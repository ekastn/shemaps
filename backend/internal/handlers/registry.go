package handlers

import (
	"github.com/ekastn/shemaps/backend/internal/services"
)

type Handlers struct {
	Health     *HealthHandler
	Directions *DirectionsHandler
}

func NewHandlers(mapsService *services.MapsService) *Handlers {
	return &Handlers{
		Health:     NewHealthHandler(),
		Directions: NewDirectionsHandler(mapsService),
	}
}
