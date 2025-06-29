package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/ekastn/shemaps/backend/internal/dto"
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
	var req dto.CreateReportRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "bad_request", "Invalid request body")
		return
	}

	// FIXME: UserID should be extracted from JWT token
	userID, _ := uuid.Parse("18d5b573-9a8c-4fdc-a381-cf18dd574a49")

	report, err := h.reportService.CreateReport(
		r.Context(),
		userID,
		req.Latitude,
		req.Longitude,
		req.SafetyLevel,
		req.Tags,
		req.Description,
	)
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "internal_error", err.Error())
		return
	}

	utils.Success(w, http.StatusCreated, dto.NewReportResponse(report))
}

func (h *ReportHandler) FindReports(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	// Ambil dan konversi query params. Perlu error handling yang baik.
	north, errNorth := strconv.ParseFloat(query.Get("north"), 64)
	south, errSouth := strconv.ParseFloat(query.Get("south"), 64)
	east, errEast := strconv.ParseFloat(query.Get("east"), 64)
	west, errWest := strconv.ParseFloat(query.Get("west"), 64)

	if errNorth != nil || errSouth != nil || errEast != nil || errWest != nil {
		utils.Error(w, http.StatusBadRequest, "bad_request", "Invalid boundary parameters")
		return
	}

	arg := services.ArgFindReports{
		North: north,
		South: south,
		East:  east,
		West:  west,
	}

	log.Println("Finding reports in bounds:", arg)

	reports, err := h.reportService.FindNearbyReports(r.Context(), arg)
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "internal_error", "Failed to find reports")
		return
	}

	log.Println("Found reports:", reports)

	utils.Success(w, http.StatusOK, dto.NewReportListResponse(reports))
}
