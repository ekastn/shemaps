package middleware

import (
	"context"
	"net/http"

	"github.com/ekastn/shemaps/backend/internal/auth"
	"github.com/ekastn/shemaps/backend/internal/services"
	"github.com/ekastn/shemaps/backend/internal/utils"
)

type contextKey string

const UserIDKey = contextKey("userID")

func Authenticate(authService *services.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token, err := auth.GetBearerToken(r.Header)
			if err != nil {
				utils.Error(w, http.StatusUnauthorized, "Unauthorized", "Missing or invalid authorization token")
				return
			}

			userID, err := authService.ValidateToken(token)
			if err != nil {
				utils.Error(w, http.StatusUnauthorized, "Unauthorized", "Invalid token")
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetUserIDFromContext(ctx context.Context) (interface{}, bool) {
	userID, ok := ctx.Value(UserIDKey).(interface{})
	return userID, ok
}
