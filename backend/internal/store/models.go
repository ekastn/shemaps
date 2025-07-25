// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0

package store

import (
	"time"

	go_postgis "github.com/cridenour/go-postgis"
	"github.com/google/uuid"
)

type EmergencyContact struct {
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"user_id"`
	ContactName string    `json:"contact_name"`
	PhoneNumber string    `json:"phone_number"`
	CreatedAt   time.Time `json:"created_at"`
}

type SafetyReport struct {
	ID                 uuid.UUID        `json:"id"`
	ReporterUserID     uuid.UUID        `json:"reporter_user_id"`
	Location           go_postgis.Point `json:"location"`
	Latitude           float64          `json:"latitude"`
	Longitude          float64          `json:"longitude"`
	SafetyLevel        string           `json:"safety_level"`
	Description        *string          `json:"description"`
	Tags               []string         `json:"tags"`
	ConfirmationsCount int32            `json:"confirmations_count"`
	CreatedAt          time.Time        `json:"created_at"`
}

type User struct {
	ID           uuid.UUID `json:"id"`
	FullName     *string   `json:"full_name"`
	Email        *string   `json:"email"`
	PasswordHash *string   `json:"password_hash"`
	CreatedAt    time.Time `json:"created_at"`
	Status       string    `json:"status"`
	DeviceID     uuid.UUID `json:"device_id"`
}
