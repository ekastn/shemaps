package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ekastn/shemaps/backend/internal/dto"
	"github.com/ekastn/shemaps/backend/internal/middleware"
	"github.com/ekastn/shemaps/backend/internal/services"
	"github.com/ekastn/shemaps/backend/internal/store"
	"github.com/ekastn/shemaps/backend/internal/utils"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type EmergencyContactHandler struct {
	service *services.EmergencyContactService
}

func NewEmergencyContactHandler(service *services.EmergencyContactService) *EmergencyContactHandler {
	return &EmergencyContactHandler{
		service: service,
	}
}

func (h *EmergencyContactHandler) GetContacts(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserIDFromContext(r.Context())
	if !ok {
		utils.Error(w, http.StatusUnauthorized, "Unauthorized", "User ID not found in context")
		return
	}

	parsedUserID, ok := userID.(uuid.UUID)
	if !ok {
		utils.Error(w, http.StatusInternalServerError, "Internal Server Error", "Failed to parse user ID")
		return
	}

	contacts, err := h.service.GetEmergencyContacts(r.Context(), parsedUserID)
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Internal Server Error", "Failed to get emergency contacts")
		return
	}

	utils.Success(w, http.StatusOK, dto.NewEmergencyContactListResponse(contacts))
}

func (h *EmergencyContactHandler) CreateContact(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserIDFromContext(r.Context())
	if !ok {
		utils.Error(w, http.StatusUnauthorized, "Unauthorized", "User ID not found in context")
		return
	}

	parsedUserID, ok := userID.(uuid.UUID)
	if !ok {
		utils.Error(w, http.StatusInternalServerError, "Internal Server Error", "Failed to parse user ID")
		return
	}

	var req dto.CreateEmergencyContactRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "Bad Request", "Invalid request payload")
		return
	}

	params := store.CreateEmergencyContactParams{
		UserID:      parsedUserID,
		ContactName: req.ContactName,
		PhoneNumber: req.PhoneNumber,
	}

	contact, err := h.service.CreateEmergencyContact(r.Context(), params)
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Internal Server Error", "Failed to create emergency contact")
		return
	}

	utils.Success(w, http.StatusCreated, dto.NewEmergencyContactResponse(contact))
}

func (h *EmergencyContactHandler) DeleteContact(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserIDFromContext(r.Context())
	if !ok {
		utils.Error(w, http.StatusUnauthorized, "Unauthorized", "User ID not found in context")
		return
	}

	parsedUserID, ok := userID.(uuid.UUID)
	if !ok {
		utils.Error(w, http.StatusInternalServerError, "Internal Server Error", "Failed to parse user ID")
		return
	}

	contactIDStr := chi.URLParam(r, "contactID")
	contactID, err := uuid.Parse(contactIDStr)
	if err != nil {
		utils.Error(w, http.StatusBadRequest, "Bad Request", "Invalid contact ID")
		return
	}

	err = h.service.DeleteEmergencyContact(r.Context(), contactID, parsedUserID)
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Internal Server Error", "Failed to delete emergency contact")
		return
	}

	utils.Success(w, http.StatusOK, map[string]string{"message": "Emergency contact deleted successfully"})
}
