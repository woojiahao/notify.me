package config

import (
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

type Config struct {
	Database struct {
		Host     string
		Username string
		Password string
		Port     int
		Name     string
	}
	Jwt struct {
		Secret          string
		AccessDuration  int
		RefreshDuration int
	}
}

func (c *Config) GetDSN() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		c.Database.Host,
		c.Database.Port,
		c.Database.Username,
		c.Database.Password,
		c.Database.Name,
	)
}

var config *Config

func Init() {
	config = &Config{}

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Unable to load .env")
	}

	host := os.Getenv("DB_HOST")
	username := os.Getenv("DB_USERNAME")
	password := os.Getenv("DB_PASSWORD")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")
	portInt, err := strconv.Atoi(port)
	if err != nil {
		log.Fatalf("Invalid port")
	}

	config.Database.Host = host
	config.Database.Username = username
	config.Database.Password = password
	config.Database.Port = portInt
	config.Database.Name = name

	secret := os.Getenv("JWT_SECRET")
	accessDuration := os.Getenv("JWT_ACCESS_DURATION")
	refreshDuration := os.Getenv("JWT_REFRESH_DURATION")
	accessDurationInt, err := strconv.Atoi(accessDuration)
	if err != nil {
		log.Fatalf("Invalid access duration")
	}
	refreshDurationInt, err := strconv.Atoi(refreshDuration)
	if err != nil {
		log.Fatalf("Invalid refresh duration")
	}

	config.Jwt.Secret = secret
	config.Jwt.AccessDuration = accessDurationInt
	config.Jwt.RefreshDuration = refreshDurationInt
}

func GetConfig() *Config {
	return config
}
