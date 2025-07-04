package dto

import (
	"time"

	"github.com/ekastn/shemaps/backend/internal/store"
	"github.com/google/uuid"
)

// CreateEmergencyContactRequest defines the structure for creating a new emergency contact.
type CreateEmergencyContactRequest struct {
	ContactName string `json:"contact_name" validate:"required"`
	PhoneNumber string `json:"phone_number" validate:"required"`
}

type UpdateEmergencyContactRequest struct {
	ContactName string `json:"contact_name" validate:"required"`
	PhoneNumber string `json:"phone_number" validate:"required"`
}

// EmergencyContactResponse defines the structure for an emergency contact returned by the API.
type EmergencyContactResponse struct {
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"user_id"`
	ContactName string    `json:"contact_name"`
	PhoneNumber string    `json:"phone_number"`
	CreatedAt   time.Time `json:"created_at"`
}

// NewEmergencyContactResponse converts a store.EmergencyContact to a DTO.
func NewEmergencyContactResponse(contact store.EmergencyContact) EmergencyContactResponse {
	return EmergencyContactResponse{
		ID:          contact.ID,
		UserID:      contact.UserID,
		ContactName: contact.ContactName,
		PhoneNumber: contact.PhoneNumber,
		CreatedAt:   contact.CreatedAt,
	}
}

// NewEmergencyContactListResponse converts a slice of store.EmergencyContact to a slice of DTOs.
func NewEmergencyContactListResponse(contacts []store.EmergencyContact) []EmergencyContactResponse {
	list := make([]EmergencyContactResponse, len(contacts))
	for i, c := range contacts {
		list[i] = NewEmergencyContactResponse(c)
	}
	return list
}
