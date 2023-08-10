package middlewares

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) == 0 {
			return
		}

		err := c.Errors[0]
		status := c.Writer.Status()
		body := make(map[string]any)
		switch status {
		case http.StatusInternalServerError:
			body = gin.H{
				"status": status,
				"error":  "Internal server error.",
			}
		case http.StatusNotFound:
			body = gin.H{
				"status":      status,
				"error":       "Resource not found.",
				"description": err.Err.Error(),
			}
		case http.StatusBadRequest:
			body = gin.H{
				"status":      status,
				"error":       "Bad request.",
				"description": err.Err.Error(),
			}
		}

		c.JSON(-1, body)
	}
}
