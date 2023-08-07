package server

import (
	"github.com/gin-gonic/gin"
	"github.com/woojiahao/notify.me/controllers"
)

func NewRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	user := new(controllers.UserController)
	api := router.Group("api")
	{
		userGroup := api.Group("user")
		{
			userGroup.POST("/register", user.Register)
			userGroup.POST("/login", user.Login)
		}
	}

	return router
}
