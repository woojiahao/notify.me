package models

type Entry struct {
	ID       string         `json:"id"`
	Contents map[string]any `json:"contents"`
}
