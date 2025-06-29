package dto

import "github.com/ekastn/shemaps/backend/internal/domain"

// DirectionsResponse defines the structure for the directions API response.
type DirectionsResponse struct {
	Routes []domain.RouteWithSafety `json:"routes"`
}
