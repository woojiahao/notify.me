package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/woojiahao/notify.me/config"
	"github.com/woojiahao/notify.me/forms"
	"github.com/woojiahao/notify.me/models"
	"net/http"
	"time"
)

type UserController struct{}

var userModel = new(models.User)

func (u UserController) Register(c *gin.Context) {
	var registerPayload forms.UserRegister
	if err := c.Bind(&registerPayload); err != nil {
		c.Status(http.StatusBadRequest)
		_ = c.Error(err)
		return
	}

	_, err := userModel.Register(registerPayload)
	if err != nil {
		status := http.StatusInternalServerError
		if err == models.RegistrationEmailUsed {
			status = http.StatusBadRequest
		}
		c.Status(status)
		_ = c.Error(err)
		return
	}

	c.Status(201)
}

func (u UserController) Login(c *gin.Context) {
	var loginPayload forms.UserLogin
	if err := c.Bind(&loginPayload); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request",
		})
		return
	}

	user, err := userModel.Login(loginPayload)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid login request",
		})
		return
	}

	conf := config.GetConfig()
	accessJwt, err := createJwt(user, conf.Jwt.Secret, conf.Jwt.AccessDuration)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Internal server error",
		})
		return
	}

	refreshJwt, err := createJwt(user, conf.Jwt.Secret, conf.Jwt.RefreshDuration)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Internal server error",
		})
		return
	}

	c.JSON(200, gin.H{
		"user":    user,
		"access":  accessJwt,
		"refresh": refreshJwt,
	})
}

func createJwt(user *models.User, secret string, durationInS int) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(time.Duration(durationInS) * time.Second).Unix()
	claims["email"] = user.Email
	return token.SignedString([]byte(secret))
}
