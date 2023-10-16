package models

import (
	"context"
	sql "database/sql"
	"encoding/csv"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/lib/pq"
	"github.com/woojiahao/notify.me/db"
	"github.com/woojiahao/notify.me/forms"
	"mime/multipart"
	"strings"
)

type Collection struct {
	ID               string   `json:"id"`
	Name             string   `json:"name"`
	EntryIdentifiers []string `json:"entry_identifiers"`
	Columns          []string `json:"columns"`
	ProjectId        string   `json:"project_id"`
	Entries          []Entry  `json:"entries"`
}

var (
	CollectionCreateFail = errors.New("failed to create collection")
	CollectionNotFound   = errors.New("collection not found")
	CollectionParseError = errors.New("failed to parse collection")
	CSVParseError        = errors.New("failed to parse CSV file")
)

func (c Collection) Create(createCollectionPayload forms.CreateCollection, projectId string) (*Collection, error) {
	// TODO: Exploring storing the entire CSV on blob storage
	// Parse CSV file
	entries, err := extractCSV(createCollectionPayload.File, createCollectionPayload.SkipRow)
	if err != nil {
		return nil, CSVParseError
	}

	conn := db.GetDB()
	tx, err := conn.BeginTx(context.TODO(), nil)
	if err != nil {
		return nil, CollectionCreateFail
	}

	// Create the collection first
	row := tx.QueryRow(
		"INSERT INTO collections (name, entry_identifiers, project_id, columns) VALUES ($1, $2, $3, $4) RETURNING id;",
		createCollectionPayload.Name,
		pq.Array(createCollectionPayload.Identifiers),
		projectId,
		pq.Array(createCollectionPayload.Columns),
	)

	if row.Err() == sql.ErrNoRows {
		return nil, CollectionCreateFail
	}

	var collectionId string
	err = row.Scan(&collectionId)
	if err != nil {
		return nil, CollectionCreateFail
	}

	// Create all the entries as a bulk import
	var bulkQueries []string
	var jsonEntries []any
	for i := 0; i < len(entries); i++ {
		bulkQueries = append(bulkQueries, fmt.Sprintf("($1, $%d)", i+2))
		bs, err := json.Marshal(entries[i])
		if err != nil {
			return nil, CollectionCreateFail
		}
		jsonEntries = append(jsonEntries, string(bs))
	}
	query := fmt.Sprintf("INSERT INTO entries (collection_id, contents) VALUES %s", strings.Join(bulkQueries, ", "))
	var args []any
	args = append(args, collectionId)
	args = append(args, jsonEntries...)
	_, err = tx.ExecContext(context.TODO(), query, args...)
	if err != nil {
		return nil, CollectionCreateFail
	}

	err = tx.Commit()
	if err != nil {
		return nil, CollectionCreateFail
	}

	return c.FindById(collectionId)
}

func (c Collection) FindAllByProjectId(projectId string) ([]Collection, error) {
	conn := db.GetDB()
	rows, err := conn.Query(`
	SELECT
		collections.id AS collection_id,
		name,
		entry_identifiers,
		project_id,
		columns,
		entries.id AS entry_id,
		contents
	FROM collections
		JOIN entries ON collections.id = entries.collection_id
	WHERE project_id = $1
	`, projectId)

	if err != nil {
		return nil, CollectionParseError
	}

	var collections []Collection
	for rows.Next() {
		collection := Collection{}
		entry := Entry{}
		var contents []byte
		err = rows.Scan(
			&collection.ID,
			&collection.Name,
			pq.Array(&collection.EntryIdentifiers),
			&collection.ProjectId,
			pq.Array(&collection.Columns),
			&entry.ID,
			&contents,
		)
		if err != nil {
			return nil, CollectionParseError
		}
		var unmarshalledContents map[string]any
		err = json.Unmarshal(contents, &unmarshalledContents)
		if err != nil {
			return nil, CollectionParseError
		}
		entry.Contents = unmarshalledContents
		if len(collections) == 0 || collections[len(collections)-1].ID != collection.ID {
			collection.Entries = append(collection.Entries, entry)
			collections = append(collections, collection)
		} else {
			collections[len(collections)-1].Entries = append(collections[len(collections)-1].Entries, entry)
		}
	}

	return collections, nil
}

func (c Collection) FindById(collectionId string) (*Collection, error) {
	conn := db.GetDB()
	rows, err := conn.Query(`
	SELECT
		collections.id AS collection_id,
		name,
		entry_identifiers,
		project_id,
		columns,
		entries.id AS entry_id,
		contents
	FROM collections
		JOIN entries ON collections.id = entries.collection_id
	WHERE collections.id = $1
	`, collectionId)

	if err != nil {
		return nil, CollectionParseError
	}

	hasCollection := false
	collection := Collection{}
	for rows.Next() {
		hasCollection = true
		entry := Entry{}
		var contents []byte
		err = rows.Scan(
			&collection.ID,
			&collection.Name,
			pq.Array(&collection.EntryIdentifiers),
			&collection.ProjectId,
			pq.Array(&collection.Columns),
			&entry.ID,
			&contents,
		)
		if err != nil {
			return nil, CollectionCreateFail
		}
		var unmarshalledContents map[string]any
		err = json.Unmarshal(contents, &unmarshalledContents)
		if err != nil {
			return nil, CollectionCreateFail
		}
		entry.Contents = unmarshalledContents
		collection.Entries = append(collection.Entries, entry)
	}

	if hasCollection {
		return &collection, nil
	}

	return nil, CollectionNotFound
}

func extractCSV(file *multipart.FileHeader, skipRow int) ([]map[string]string, error) {
	// Extract the headers and
	f, err := file.Open()
	if err != nil {
		return make([]map[string]string, 0), nil
	}

	reader := csv.NewReader(f)
	allEntries, err := reader.ReadAll()
	if err != nil {
		return nil, CSVParseError
	}

	// Handle the skip rows
	rows := allEntries[skipRow:]

	var entries []map[string]string

	// Parse first row as the header column
	headers := handleHeaderDuplicates(rows[0])
	rest := rows[1:]
	for _, row := range rest {
		entry := make(map[string]string)
		for i := 0; i < len(headers); i++ {
			entry[headers[i]] = row[i]
		}
		entries = append(entries, entry)
	}

	return entries, nil
}

func handleHeaderDuplicates(header []string) []string {
	var dedupedHeaders []string
	seen := make(map[string]int)
	for _, h := range header {
		if count, ok := seen[h]; ok {
			// Count exists means that we should just use the count value and increment
			dedupedHeaders = append(dedupedHeaders, fmt.Sprintf("%s_%d", h, count))
			seen[h]++
		} else {
			dedupedHeaders = append(dedupedHeaders, h)
			seen[h] = 1
		}
	}
	return dedupedHeaders
}
