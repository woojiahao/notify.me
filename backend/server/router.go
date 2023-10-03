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
	project := new(controllers.ProjectController)
	collection := new(controllers.CollectionController)

	api := router.Group("api")
	{
		userGroup := api.Group("user")
		{
			userGroup.POST("register", user.Register)
			userGroup.POST("login", user.Login)
			userGroup.GET(":id/projects", project.FindAll)
		}

		healthGroup := api.Group("health")
		{
			healthGroup.GET("ping", authMiddleware.MiddlewareFunc(), health.Ping)
		}

		projectGroup := api.Group("project", authMiddleware.MiddlewareFunc())
		{
			projectGroup.POST("", project.Create)
			projectGroup.GET(":id", project.FindByID)
			projectGroup.POST(":id/collection", collection.Create)
			projectGroup.GET(":id/collection", collection.FindAllInProject)
		}
	}

	return router
}
