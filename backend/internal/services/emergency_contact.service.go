package services

import (
	"context"

	"github.com/ekastn/shemaps/backend/internal/store"
	"github.com/google/uuid"
)

type EmergencyContactService struct {
	querier store.Querier
}

func NewEmergencyContactService(querier store.Querier) *EmergencyContactService {
	return &EmergencyContactService{
		querier: querier,
	}
}

func (s *EmergencyContactService) GetEmergencyContacts(ctx context.Context, userID uuid.UUID) ([]store.EmergencyContact, error) {
	return s.querier.GetEmergencyContactsByUser(ctx, userID)
}

func (s *EmergencyContactService) CreateEmergencyContact(ctx context.Context, arg store.CreateEmergencyContactParams) (store.EmergencyContact, error) {
	return s.querier.CreateEmergencyContact(ctx, arg)
}

func (s *EmergencyContactService) DeleteEmergencyContact(ctx context.Context, contactID uuid.UUID, userID uuid.UUID) error {
	return s.querier.DeleteEmergencyContact(ctx, store.DeleteEmergencyContactParams{
		ID:     contactID,
		UserID: userID,
	})
}

func (s *EmergencyContactService) UpdateEmergencyContact(ctx context.Context, arg store.UpdateEmergencyContactParams) (store.EmergencyContact, error) {
	return s.querier.UpdateEmergencyContact(ctx, arg)
}
