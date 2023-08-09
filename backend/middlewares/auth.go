package middlewares

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/woojiahao/notify.me/config"
	"log"
)

func Auth() *jwt.GinJWTMiddleware {
	/*
		Custom JWT token generation means don't need to provide any values for the middleware,
		we're just going to use it for the expiry checks
	*/
	conf := config.GetConfig()
	middleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Key: []byte(conf.Jwt.Secret),
	})

	if err != nil {
		log.Fatalf("Failed to setup JWT middleware")
	}

	return middleware
}
