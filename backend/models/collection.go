package models

import (
	"context"
	sql "database/sql"
	"encoding/csv"
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
	CSVParseError        = errors.New("failed to parse CSV file")
)

func (c Collection) Create(createCollectionPayload forms.CreateCollection, projectId string) (*Collection, error) {
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
	for i := 0; i < len(entries); i++ {
		bulkQueries = append(bulkQueries, fmt.Sprintf("($%d)", i+1))
	}
	query := fmt.Sprintf("INSERT INTO entries VALUES %s", strings.Join(bulkQueries, ", "))
	_, err = tx.ExecContext(context.TODO(), query, entries...)
	if err != nil {
		return nil, CollectionCreateFail
	}

	rows, err := tx.Query(`
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

	collection := Collection{}
	for rows.Next() {
		entry := Entry{}
		err = rows.Scan(
			&collection.ID,
			&collection.Name,
			&collection.EntryIdentifiers,
			&collection.ProjectId,
			&collection.Columns,
			&entry.ID,
			&entry.Contents,
		)
		if err != nil {
			return nil, CollectionCreateFail
		}
		collection.Entries = append(collection.Entries, entry)
	}

	err = tx.Commit()
	if err != nil {
		return nil, CollectionCreateFail
	}

	return &collection, nil
}

func extractCSV(file *multipart.FileHeader, skipRow int) ([]any, error) {
	// Extract the headers and
	f, err := file.Open()
	if err != nil {
		return make([]any, 0), nil
	}

	reader := csv.NewReader(f)
	allEntries, err := reader.ReadAll()
	if err != nil {
		return nil, CSVParseError
	}

	// Handle the skip rows
	rows := allEntries[skipRow:]

	var entries []any

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
