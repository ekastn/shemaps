package services

import (
	"context"
	"github.com/ekastn/shemaps/backend/internal/config"
	"googlemaps.github.io/maps"
)

type MapsService struct {
	client *maps.Client
}

func NewMapsService(cfg *config.Config) (*MapsService, error) {
	c, err := maps.NewClient(maps.WithAPIKey(cfg.GoogleMapsAPIKey))
	if err != nil {
		return nil, err
	}
	return &MapsService{client: c}, nil
}

func (s *MapsService) GetDirections(ctx context.Context, origin, destination, travelMode string, alternatives bool) ([]maps.Route, string, error) {
	mode := maps.TravelModeDriving
	switch travelMode {
	case "walking":
		mode = maps.TravelModeWalking
	case "bicycling":
		mode = maps.TravelModeBicycling
	case "transit":
		mode = maps.TravelModeTransit
	}

	routes, _, err := s.client.Directions(ctx, &maps.DirectionsRequest{
		Origin:       origin,
		Destination:  destination,
		Mode:         mode,
		Alternatives: alternatives,
	})

	if err != nil {
		return nil, "", err
	}

	status := "OK"
	if len(routes) == 0 {
		status = "ZERO_RESULTS"
	}

	return routes, status, nil
}
