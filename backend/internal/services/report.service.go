package services

import (
	"context"
	"log"

	"github.com/ekastn/shemaps/backend/internal/store"
	"github.com/google/uuid"
)

type ReportService struct {
	store store.Querier
}

func NewReportService(store store.Querier) *ReportService {
	return &ReportService{
		store: store,
	}
}

func (s *ReportService) CreateReport(ctx context.Context,
	reporterUserID uuid.UUID,
	latitude float64,
	longitude float64,
	safetyLevel string,
	tags []string,
	description string,
) (store.SafetyReport, error) {
	params := store.CreateSafetyReportParams{
		ReporterUserID: reporterUserID,
		Latitude:       latitude,
		Longitude:      longitude,
		SafetyLevel:    safetyLevel,
		Tags:           tags,
		Description:    &description,
	}

	log.Println("Creating report with parameters:", params)
	report, err := s.store.CreateSafetyReport(ctx, params)
	if err != nil {
		log.Printf("Error creating report store: %v\n", err)
		return store.SafetyReport{}, err
	}

	return report, nil
}

type ArgFindReports struct {
	North float64
	South float64
	East  float64
	West  float64
}

func (s *ReportService) FindNearbyReports(ctx context.Context, arg ArgFindReports) ([]store.SafetyReport, error) {
	params := store.FindReportsInBoundsParams{
		North:        arg.North,
		South:        arg.South,
		East:         arg.East,
		West:         arg.West,
		DangerLevel:  "DANGEROUS",
		CautionLevel: "CAUTIOUS",
	}

	reports, err := s.store.FindReportsInBounds(ctx, params)
	if err != nil {
		return nil, err
	}

	return reports, nil
}
