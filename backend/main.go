package main

import (
	"github.com/woojiahao/notify.me/config"
	"github.com/woojiahao/notify.me/db"
)

func main() {
	config.Init()
	db.Init()
	db.Migrate()
}
