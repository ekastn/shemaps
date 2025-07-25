package middleware

import (
	"context"
	"net/http"

	"github.com/ekastn/shemaps/backend/internal/auth"
	"github.com/ekastn/shemaps/backend/internal/services"
	"github.com/ekastn/shemaps/backend/internal/utils"
	"github.com/google/uuid"
)

type contextKey string

const (
	UserIDKey   = contextKey("userID")
	DeviceIDKey = contextKey("deviceID")
)

func Authenticate(authService *services.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			var userID uuid.UUID
			var err error

			// 1. Check for JWT token
			token, tokenErr := auth.GetBearerToken(r.Header)
			if tokenErr == nil {
				userID, err = authService.ValidateToken(token)
				if err == nil {
					ctx := context.WithValue(r.Context(), UserIDKey, userID)
					next.ServeHTTP(w, r.WithContext(ctx))
					return
				}
			}

			// 2. If no valid JWT, check for X-Device-ID header or query parameter
			deviceIDStr := r.Header.Get("X-Device-ID")
			if deviceIDStr == "" {
				deviceIDStr = r.URL.Query().Get("deviceId")
			}

			if deviceIDStr != "" {
				deviceID, parseErr := uuid.Parse(deviceIDStr)
				if parseErr != nil {
					utils.Error(w, http.StatusBadRequest, "Bad Request", "Invalid X-Device-ID format")
					return
				}

				user, userErr := authService.GetUserByDeviceID(r.Context(), deviceID)
				if userErr == nil {
					userID = user.ID
				} else {
					// If device_id not found, create a new guest user
					guestUser, createErr := authService.CreateGuestUser(r.Context(), deviceID) // Use deviceID from header
					if createErr != nil {
						utils.Error(w, http.StatusInternalServerError, "Internal Server Error", "Failed to create guest user")
						return
					}
					userID = guestUser.ID
				}

				ctx := context.WithValue(r.Context(), UserIDKey, userID)
				ctx = context.WithValue(ctx, DeviceIDKey, deviceID)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}

			// 3. If neither header is present, deny access
			utils.Error(w, http.StatusUnauthorized, "Unauthorized", "Authentication required")
		})
	}
}

func GetUserIDFromContext(ctx context.Context) (interface{}, bool) {
	userID, ok := ctx.Value(UserIDKey).(interface{})
	return userID, ok
}

func GetDeviceIDFromContext(ctx context.Context) (interface{}, bool) {
	deviceID, ok := ctx.Value(DeviceIDKey).(interface{})
	return deviceID, ok
}
