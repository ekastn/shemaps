package handlers

import (
	"github.com/ekastn/shemaps/backend/internal/config"
	"github.com/ekastn/shemaps/backend/internal/services"
	"github.com/ekastn/shemaps/backend/internal/store"
)

type Handlers struct {
	Directions *DirectionsHandler
	Report     *ReportHandler
	Auth       *AuthHandler
}

func NewHandlers(mapsService *services.MapsService, reportService services.ReportService, store *store.Queries, config *config.Config) *Handlers {
	authService := services.NewAuthService(store, config)
	routeService := services.NewRouteService(mapsService, store)

	return &Handlers{
		Directions: NewDirectionsHandler(mapsService, routeService),
		Report:     NewReportHandler(&reportService),
		Auth:       NewAuthHandler(authService),
	}
}
