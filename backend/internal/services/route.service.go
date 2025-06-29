package services

import (
	"context"
	"errors"
	"log"
	"math"
	"sort"

	"github.com/ekastn/shemaps/backend/internal/domain"
	"github.com/ekastn/shemaps/backend/internal/store"
	"github.com/paulmach/orb"
	"github.com/paulmach/orb/geo"
)

type RouteService struct {
	mapsService *MapsService
	store       *store.Queries
}

func NewRouteService(mapsService *MapsService, store *store.Queries) *RouteService {
	return &RouteService{
		mapsService: mapsService,
		store:       store,
	}
}

func (s *RouteService) CalculateSafeRoutes(ctx context.Context, origin, destination string) ([]domain.RouteWithSafety, error) {
	googleRoutes, _, err := s.mapsService.GetDirections(ctx, origin, destination, "driving", true)
	if err != nil || len(googleRoutes) == 0 {
		return nil, errors.New("Failed to get directions")
	}

	overallBounds := googleRoutes[0].Bounds
	for i := 1; i < len(googleRoutes); i++ {
		overallBounds.NorthEast.Lat = math.Max(overallBounds.NorthEast.Lat, googleRoutes[i].Bounds.NorthEast.Lat)
		overallBounds.NorthEast.Lng = math.Max(overallBounds.NorthEast.Lng, googleRoutes[i].Bounds.NorthEast.Lng)
		overallBounds.SouthWest.Lat = math.Min(overallBounds.SouthWest.Lat, googleRoutes[i].Bounds.SouthWest.Lat)
		overallBounds.SouthWest.Lng = math.Min(overallBounds.SouthWest.Lng, googleRoutes[i].Bounds.SouthWest.Lng)
	}

	params := store.FindReportsInBoundsParams{
		North: overallBounds.NorthEast.Lat,
		South: overallBounds.SouthWest.Lat,
		East:  overallBounds.NorthEast.Lng,
		West:  overallBounds.SouthWest.Lng,
	}

	dangerReports, err := s.store.FindReportsInBounds(ctx, params)
	if err != nil {
		log.Printf("WARNING: Gagal mengambil safety reports: %v", err)
		dangerReports = []store.SafetyReport{}
	}

	log.Printf("Menemukan %d laporan keamanan yang relevan di database", len(dangerReports))

	// scoring routes
	var shemapsRoutes []domain.RouteWithSafety

	for _, gRoute := range googleRoutes {
		routePath, err := gRoute.OverviewPolyline.Decode()
		if err != nil {
			log.Printf("WARNING: Gagal decode polyline untuk satu rute: %v", err)
			continue // Lewati rute yang rusak ini
		}

		dangerScore := 0
		for _, report := range dangerReports {
			reportPoint := orb.Point{report.Longitude, report.Latitude}

			isNearRoute := false
			// Cek jarak laporan ke setiap titik di sepanjang rute
			for _, routePoint := range routePath {
				p2 := orb.Point{routePoint.Lng, routePoint.Lat}

				distance := geo.Distance(reportPoint, p2)

				// 100 meter near the route
				if distance < 100 {
					isNearRoute = true
					break
				}
			}

			if isNearRoute {
				if report.SafetyLevel == "DANGEROUS" {
					dangerScore += 3
				} else {
					dangerScore += 1
				}
			}
		}

		var level domain.SafetyLevel
		if dangerScore > 5 {
			level = domain.LevelDangerous
		} else if dangerScore > 0 {
			level = domain.LevelCautious
		} else {
			level = domain.LevelSafe
		}

		shemapsRoutes = append(shemapsRoutes, domain.RouteWithSafety{
			Route:       gRoute,
			SafetyLevel: level,
			DangerScore: dangerScore,
		})
	}

	// sort by danger score
	sort.Slice(shemapsRoutes, func(i, j int) bool {
		return shemapsRoutes[i].DangerScore < shemapsRoutes[j].DangerScore
	})

	return shemapsRoutes, nil
}
