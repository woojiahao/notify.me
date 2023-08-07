package db

import (
	"database/sql"
	"github.com/golang-migrate/migrate"
	"github.com/golang-migrate/migrate/database/postgres"
	_ "github.com/golang-migrate/migrate/source/file"
	_ "github.com/lib/pq"
	"github.com/woojiahao/notify.me/config"
	"log"
)

var db *sql.DB

func Init() {
	c := config.GetConfig()
	conn, err := sql.Open("postgres", c.GetDSN())
	if err != nil {
		log.Fatalf("Invalid database connection")
	}
	db = conn
}

func Migrate() {
	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		log.Fatalf("Failed to create driver")
	}
	m, err := migrate.NewWithDatabaseInstance("file://./migrations", "postgres", driver)
	if err != nil {
		log.Fatalf("Failed to create migration instance")
	}
	err = m.Up()
	if err != nil {
		log.Fatalf("Failed to migrate")
	}
}

func GetDB() *sql.DB {
	return db
}
