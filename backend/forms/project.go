package forms

type CreateProject struct {
	Name   string `json:"name" binding:"required"`
	UserID string `json:"user_id" binding:"required"`
}
