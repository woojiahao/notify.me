package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/woojiahao/notify.me/config"
	"github.com/woojiahao/notify.me/forms"
	"github.com/woojiahao/notify.me/models"
	"github.com/woojiahao/notify.me/query"
	"github.com/woojiahao/notify.me/services"
	"net/http"
	"time"
)

type UserController struct{}

var userService = new(services.UserService)

func (u UserController) Register(c *gin.Context) {
	var registerPayload forms.UserRegister
	if err := c.Bind(&registerPayload); err != nil {
		SetStatusAndError(c, http.StatusBadRequest, err)
		return
	}

	_, err := userService.Register(registerPayload)
	if err != nil {
		status := http.StatusInternalServerError
		if err == services.RegistrationEmailUsed {
			status = http.StatusBadRequest
		}
		SetStatusAndError(c, status, err)
		return
	}

	c.Status(201)
}

func (u UserController) Login(c *gin.Context) {
	var loginPayload forms.UserLogin
	if err := c.Bind(&loginPayload); err != nil {
		SetStatusAndError(c, http.StatusBadRequest, err)
		return
	}

	user, err := userService.Login(loginPayload)
	if err != nil {
		// TODO: Move error mapping directly to SetStatusAndError
		status := http.StatusNotFound
		if err == models.LoginFail {
			status = http.StatusBadRequest
		}
		SetStatusAndError(c, status, err)
		return
	}

	conf := config.GetConfig()
	accessJwt, err := createJwt(user, conf.Jwt.Secret, conf.Jwt.AccessDuration)
	if err != nil {
		SetStatusAndError(c, http.StatusInternalServerError, err)
		return
	}

	refreshJwt, err := createJwt(user, conf.Jwt.Secret, conf.Jwt.RefreshDuration)
	if err != nil {
		SetStatusAndError(c, http.StatusInternalServerError, err)
		return
	}

	c.JSON(200, gin.H{
		"user":    user,
		"access":  accessJwt,
		"refresh": refreshJwt,
	})
}

func createJwt(user *query.User, secret string, durationInS int) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(time.Duration(durationInS) * time.Second).Unix()
	claims["email"] = user.Email
	claims["user_id"] = user.ID
	return token.SignedString([]byte(secret))
}
