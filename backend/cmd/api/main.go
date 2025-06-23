package main

import (
	"github.com/ekastn/shemaps/backend/internal/app"
	"github.com/ekastn/shemaps/backend/internal/config"
)

func main() {
	cfg := config.LoadConfig()

	server := app.New(cfg)
	server.Start()
}
