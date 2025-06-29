package dto

import (
	"time"

	"github.com/ekastn/shemaps/backend/internal/store"
	"github.com/google/uuid"
)

// RegisterRequest defines the structure for a user registration request.
type RegisterRequest struct {
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginRequest defines the structure for a user login request.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// UserResponse defines the publicly exposed user data.
type UserResponse struct {
	ID        uuid.UUID `json:"id"`
	FullName  string    `json:"full_name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

// AuthResponse defines the response for successful login or registration.
type AuthResponse struct {
	User  UserResponse `json:"user"`
	Token string       `json:"token"`
}

// NewUserResponse creates a new UserResponse DTO from a store.User model,
// ensuring sensitive data like the password hash is not exposed.
func NewUserResponse(user store.User) UserResponse {
	return UserResponse{
		ID:        user.ID,
		FullName:  user.FullName,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
	}
}
