package dto

import (
	"time"

	"github.com/ekastn/shemaps/backend/internal/store"
	"github.com/google/uuid"
)

// CreateReportRequest defines the structure for creating a new report.
type CreateReportRequest struct {
	Latitude    float64  `json:"latitude"`
	Longitude   float64  `json:"longitude"`
	SafetyLevel string   `json:"safety_level"`
	Tags        []string `json:"tags"`
	Description string   `json:"description"`
}

// ReportResponse defines the structure for a single report returned by the API.
type ReportResponse struct {
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"user_id"`
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	SafetyLevel string    `json:"safety_level"`
	Tags        []string  `json:"tags"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

// NewReportResponse converts a store.Report to a DTO.
func NewReportResponse(report store.SafetyReport) ReportResponse {
	return ReportResponse{
		ID:          report.ID,
		UserID:      report.ReporterUserID,
		Latitude:    report.Location.Y,
		Longitude:   report.Location.X,
		SafetyLevel: report.SafetyLevel,
		Tags:        report.Tags,
		Description: *report.Description,
		CreatedAt:   report.CreatedAt,
	}
}

// NewReportListResponse converts a slice of store.Report to a slice of DTOs.
func NewReportListResponse(reports []store.SafetyReport) []ReportResponse {
	list := make([]ReportResponse, len(reports))
	for i, r := range reports {
		list[i] = NewReportResponse(r)
	}
	return list
}
