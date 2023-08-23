package forms

import "mime/multipart"

type CreateCollection struct {
	File        *multipart.FileHeader `form:"file"`
	Name        string                `form:"name"`
	Columns     []string              `form:"columns"`
	Identifiers []string              `form:"identifiers"`
	SkipRow     int                   `form:"skip_row"`
}
