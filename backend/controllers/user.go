package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/woojiahao/notify.me/models"
)

type UserController struct{}

var userModel = new(models.User)

func (u UserController) Register(c *gin.Context) {
	c.JSON(200, gin.H{
		"hello": "world",
	})
	return
}

func (u UserController) Login(c *gin.Context) {
	c.JSON(200, gin.H{
		"hello": "world",
	})
	return
}
