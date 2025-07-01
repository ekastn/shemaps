package handlers

import (
	"github.com/ekastn/shemaps/backend/internal/config"
	"github.com/ekastn/shemaps/backend/internal/services"
	"github.com/ekastn/shemaps/backend/internal/store"
)

type Handlers struct {
	Directions       *DirectionsHandler
	Report           *ReportHandler
	Auth             *AuthHandler
	EmergencyContact *EmergencyContactHandler
	WebSocket        *WebSocketHandler
}

func NewHandlers(mapsService *services.MapsService, reportService services.ReportService, store *store.Queries, config *config.Config, wsHandler *WebSocketHandler) *Handlers {
	authService := services.NewAuthService(store, config)
	routeService := services.NewRouteService(mapsService, store)
	emergencyContactService := services.NewEmergencyContactService(store)

	return &Handlers{
		Directions:       NewDirectionsHandler(mapsService, routeService),
		Report:           NewReportHandler(&reportService),
		Auth:             NewAuthHandler(authService),
		EmergencyContact: NewEmergencyContactHandler(emergencyContactService),
		WebSocket:        wsHandler,
	}
}
