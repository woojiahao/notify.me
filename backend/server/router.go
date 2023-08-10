package server

import (
	"github.com/gin-gonic/gin"
	"github.com/woojiahao/notify.me/controllers"
	"github.com/woojiahao/notify.me/middlewares"
)

func NewRouter() *gin.Engine {
	router := gin.New()
	authMiddleware := middlewares.Auth()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middlewares.Cors())
	router.Use(middlewares.ErrorHandler())

	user := new(controllers.UserController)
	health := new(controllers.HealthController)
	api := router.Group("api")
	{
		userGroup := api.Group("user")
		{
			userGroup.POST("/register", user.Register)
			userGroup.POST("/login", user.Login)
		}

		healthGroup := api.Group("health")
		{
			healthGroup.GET("/ping", authMiddleware.MiddlewareFunc(), health.Ping)
		}
	}

	return router
}
