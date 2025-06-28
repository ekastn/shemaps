package config

import (
	"log"

	"github.com/ekastn/shemaps/backend/internal/env"
	"github.com/joho/godotenv"
)

type Config struct {
	GoogleMapsAPIKey string
	Addr             string
	PostgresURL      string
	JWTSecret        string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("Failed to load .env file")
	}
	apiKey := env.GetString("GOOGLE_MAPS_API_KEY", "")
	addr := env.GetString("ADDR", ":3000")
	pgURL := env.GetString("POSTGRES_URL", "")
	jwtSecret := env.GetString("JWT_SECRET", "super-secret-key")

	return &Config{
		GoogleMapsAPIKey: apiKey,
		Addr:             addr,
		PostgresURL:      pgURL,
		JWTSecret:        jwtSecret,
	}
}
