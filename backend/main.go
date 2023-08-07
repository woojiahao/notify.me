package main

import (
	"github.com/woojiahao/notify.me/config"
	"github.com/woojiahao/notify.me/db"
	"github.com/woojiahao/notify.me/server"
)

func main() {
	config.Init()
	db.Init()
	db.Migrate()
	server.Init()
}
