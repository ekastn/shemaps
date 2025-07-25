package handlers

import (
	"net/http"

	"github.com/ekastn/shemaps/backend/internal/dto"
	"github.com/ekastn/shemaps/backend/internal/services"
	"github.com/ekastn/shemaps/backend/internal/utils"
)

type DirectionsHandler struct {
	mapsService  *services.MapsService
	routeService *services.RouteService
}

func NewDirectionsHandler(mapsService *services.MapsService, routeService *services.RouteService) *DirectionsHandler {
	return &DirectionsHandler{
		mapsService:  mapsService,
		routeService: routeService,
	}
}

func (h *DirectionsHandler) GetDirections(w http.ResponseWriter, r *http.Request) {
	origin := r.URL.Query().Get("origin")
	destination := r.URL.Query().Get("destination")

	if origin == "" || destination == "" {
		utils.Error(w, http.StatusBadRequest, "bad_request", "Origin and destination are required")
		return
	}

	routes, err := h.routeService.CalculateSafeRoutes(r.Context(), origin, destination)
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "internal_error", "Failed to get directions")
		return
	}

	response := dto.DirectionsResponse{Routes: routes}

	utils.Success(w, http.StatusOK, response)
}
