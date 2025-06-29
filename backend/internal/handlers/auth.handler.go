package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ekastn/shemaps/backend/internal/dto"
	"github.com/ekastn/shemaps/backend/internal/middleware"
	"github.com/ekastn/shemaps/backend/internal/services"
	"github.com/ekastn/shemaps/backend/internal/utils"
	"github.com/google/uuid"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

func (h *AuthHandler) GetAuthService() *services.AuthService {
	return h.authService
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req dto.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "Bad Request", "Invalid request body")
		return
	}

	if req.Email == "" || req.Password == "" || req.FullName == "" {
		utils.Error(w, http.StatusBadRequest, "Bad Request", "Email, password, and full name are required")
		return
	}

	params := services.RegisterUserParams{
		FullName: req.FullName,
		Email:    req.Email,
		Password: req.Password,
	}

	auth, err := h.authService.Register(r.Context(), params)
	if err != nil {
		switch err {
		case services.ErrUserAlreadyExists:
			utils.Error(w, http.StatusConflict, "Conflict", "User with this email already exists")
		default:
			utils.Error(w, http.StatusInternalServerError, "Internal Server Error", "Failed to register user")
		}
		return
	}

	response := dto.AuthResponse{
		User:  dto.NewUserResponse(auth.User),
		Token: auth.Token,
	}

	utils.Success(w, http.StatusCreated, response)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req dto.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "Bad Request", "Invalid request body")
		return
	}

	if req.Email == "" || req.Password == "" {
		utils.Error(w, http.StatusBadRequest, "Bad Request", "Email and password are required")
		return
	}

	params := services.LoginUserParams{
		Email:    req.Email,
		Password: req.Password,
	}

	auth, err := h.authService.Login(r.Context(), params)
	if err != nil {
		switch err {
		case services.ErrInvalidCredentials:
			utils.Error(w, http.StatusUnauthorized, "Unauthorized", "Invalid email or password")
		default:
			utils.Error(w, http.StatusInternalServerError, "Internal Server Error", "Failed to login")
		}
		return
	}

	response := dto.AuthResponse{
		User:  dto.NewUserResponse(auth.User),
		Token: auth.Token,
	}

	utils.Success(w, http.StatusOK, response)
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserIDFromContext(r.Context())
	if !ok {
		utils.Error(w, http.StatusUnauthorized, "Unauthorized", "Missing or invalid authorization token")
		return
	}

	user, err := h.authService.GetUserByID(r.Context(), userID.(uuid.UUID))
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Internal Server Error", "Failed to get user")
		return
	}

	utils.Success(w, http.StatusOK, dto.NewUserResponse(user))
}
