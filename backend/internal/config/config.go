package config

import (
	"log"
	"strings"

	"github.com/ekastn/shemaps/backend/internal/env"
	"github.com/joho/godotenv"
)

type Config struct {
	GoogleMapsAPIKey string
	Addr             string
	PostgresURL      string
	JWTSecret        string
	AllowedOrigins   []string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("Failed to load .env file")
	}
	apiKey := env.GetString("GOOGLE_MAPS_API_KEY", "")
	addr := env.GetString("ADDR", ":80")
	pgURL := env.GetString("POSTGRES_URL", "")
	jwtSecret := env.GetString("JWT_SECRET", "super-secret-key")
	allowedOriginsStr := env.GetString("ALLOWED_ORIGINS", "http://localhost:5173")
	allowedOrigins := []string{}
	if allowedOriginsStr != "" {
		allowedOrigins = splitAndTrim(allowedOriginsStr, ",")
	}

	return &Config{
		GoogleMapsAPIKey: apiKey,
		Addr:             addr,
		PostgresURL:      pgURL,
		JWTSecret:        jwtSecret,
		AllowedOrigins:   allowedOrigins,
	}
}

func splitAndTrim(s, sep string) []string {
	parts := strings.Split(s, sep)
	for i, p := range parts {
		parts[i] = strings.TrimSpace(p)
	}
	return parts
}
