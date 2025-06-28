package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ekastn/shemaps/backend/internal/services"
	"github.com/ekastn/shemaps/backend/internal/utils"
	"github.com/google/uuid"
)

type ReportHandler struct {
	reportService *services.ReportService
}

func NewReportHandler(reportService *services.ReportService) *ReportHandler {
	return &ReportHandler{
		reportService: reportService,
	}
}

func (h *ReportHandler) CreateReport(w http.ResponseWriter, r *http.Request) {
	var reqBody struct {
		Latitude    float64  `json:"latitude"`
		Longitude   float64  `json:"longitude"`
		SafetyLevel string   `json:"safety_level"`
		Tags        []string `json:"tags"`
		Description string   `json:"description"`
	}

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		utils.Error(w, http.StatusBadRequest, "bad_request", "Invalid request body")
		return
	}

	// FIXME: UserID should be extracted from JWT token
	userID, _ := uuid.Parse("18d5b573-9a8c-4fdc-a381-cf18dd574a49")

	report, err := h.reportService.CreateReport(
		r.Context(),
		userID,
		reqBody.Latitude,
		reqBody.Longitude,
		reqBody.SafetyLevel,
		reqBody.Tags,
		reqBody.Description,
	)

	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "internal_error", err.Error())
		return
	}

	utils.Success(w, http.StatusCreated, report)
}
