package models

import (
	"errors"
	"fmt"
	"github.com/woojiahao/notify.me/db"
	"github.com/woojiahao/notify.me/forms"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID           string `json:"id,omitempty"`
	Name         string `json:"name"`
	Email        string `json:"email"`
	PasswordHash string `json:"-"`
}

var (
	UserNotFound               = errors.New("user not found")
	PasswordHashGenerationFail = errors.New("failed to generate password hash")
	RegistrationEmailUsed      = errors.New("email in use already")
	UserParseError             = errors.New("failed to parse row")
)

func (u User) Register(registerPayload forms.UserRegister) (*User, error) {
	conn := db.GetDB()
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(registerPayload.Password), 13)
	if err != nil {
		// TODO: Handle as internal server error
		return nil, PasswordHashGenerationFail
	}
	rows, err := conn.Query(
		"INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
		registerPayload.Name,
		registerPayload.Email,
		passwordHash,
	)
	if err != nil {
		// TODO: Handle as invalid request error
		return nil, RegistrationEmailUsed
	}

	var user User
	if !rows.Next() {
		return nil, UserParseError
	}
	err = rows.Scan(&user.ID, &user.Name, &user.Email, &user.PasswordHash)
	if err != nil {
		return nil, UserParseError
	}

	return &user, nil
}

func (u User) Login(loginPayload forms.UserLogin) (*User, error) {
	user, err := u.FindByEmail(loginPayload.Email)
	if err != nil {
		// TODO: Handle this as 404
		return nil, errors.New("user not found")
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginPayload.Password)); err == nil {
		return user, nil
	} else {
		fmt.Println(err)
		// TODO: Handle this as invalid request
		return nil, errors.New("invalid password")
	}
}

func (u User) FindByEmail(email string) (*User, error) {
	conn := db.GetDB()
	row := conn.QueryRow("SELECT * FROM users WHERE email = $1", email)
	if row == nil {
		return nil, errors.New("no user with email")
	}

	var user User
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.PasswordHash)
	if err != nil {
		return nil, errors.New("cannot parse row")
	}
	return &user, nil
}
