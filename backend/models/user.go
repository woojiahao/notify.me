package models

import (
	"errors"
	"github.com/woojiahao/notify.me/db"
	"github.com/woojiahao/notify.me/forms"
)

type User struct {
	ID           string `json:"id,omitempty"`
	Name         string `json:"name"`
	Email        string `json:"email"`
	PasswordHash string `json:"password_hash"`
}

func (u User) Register(registerPayload forms.UserRegister) (*User, error) {
	conn := db.GetDB()
	rows, err := conn.Query(
		"INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
		registerPayload.Name,
		registerPayload.Email,
		registerPayload.Password,
	)
	if err != nil {
		return nil, errors.New("failed to register user")
	}

	var user User
	err = rows.Scan(&user.ID, &user.Name, &user.Email, &user.PasswordHash)
	if err != nil {
		return nil, errors.New("cannot find row")
	}

	return &user, nil
}
