package services

import (
	"context"
	"database/sql"
	"errors"
	"github.com/lib/pq"
	"github.com/woojiahao/notify.me/db"
	"github.com/woojiahao/notify.me/forms"
	"github.com/woojiahao/notify.me/query"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct{}

var (
	PasswordHashGenerationFail = errors.New("failed to generate password hash")
	UserNotFound               = errors.New("user not found")
	RegistrationEmailUsed      = errors.New("email in use already")
	UserParseError             = errors.New("failed to parse row")
	LoginFail                  = errors.New("login credentials invalid")
)

func (u UserService) Register(register forms.UserRegister) (*query.User, error) {
	conn := db.GetDB()
	queries := query.New(conn)

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(register.Password), 13)
	if err != nil {
		// TODO: Handle as internal server error
		return nil, PasswordHashGenerationFail
	}

	payload := query.CreateUserParams{
		Name:         register.Name,
		Email:        register.Email,
		PasswordHash: string(passwordHash),
	}
	user, err := queries.CreateUser(context.Background(), payload)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, UserNotFound
		}
		if pgErr, ok := err.(*pq.Error); ok {
			if pgErr.Code == "23505" {
				return nil, RegistrationEmailUsed
			}
		}
		return nil, SqlError
	}

	return &user, nil
}

func (u UserService) Login(login forms.UserLogin) (*query.User, error) {
	conn := db.GetDB()
	queries := query.New(conn)

	user, err := queries.FindUserByEmail(context.Background(), login.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, UserNotFound
		}
		return nil, SqlError
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(login.Password)); err == nil {
		return &user, nil
	} else {
		return nil, LoginFail
	}
}
