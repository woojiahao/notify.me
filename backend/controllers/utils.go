package controllers

import (
	"github.com/gin-gonic/gin"
)

func SetStatusAndError(c *gin.Context, status int, err error) {
	c.Status(status)
	_ = c.Error(err)
}
