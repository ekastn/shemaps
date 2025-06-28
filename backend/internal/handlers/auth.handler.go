package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ekastn/shemaps/backend/internal/services"
	"github.com/ekastn/shemaps/backend/internal/utils"
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
	var params services.RegisterUserParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		utils.Error(w, http.StatusBadRequest, "Bad Request", "Invalid request body")
		return
	}

	if params.Email == "" || params.Password == "" || params.FullName == "" {
		utils.Error(w, http.StatusBadRequest, "Bad Request", "Email, password, and full name are required")
		return
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

	// Hide the password hash in the response
	userResponse := auth.User
	userResponse.PasswordHash = ""

	response := struct {
		User  interface{} `json:"user"`
		Token string      `json:"token"`
	}{
		User:  userResponse,
		Token: auth.Token,
	}

	utils.Success(w, http.StatusCreated, response)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var params services.LoginUserParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		utils.Error(w, http.StatusBadRequest, "Bad Request", "Invalid request body")
		return
	}

	// Basic validation
	if params.Email == "" || params.Password == "" {
		utils.Error(w, http.StatusBadRequest, "Bad Request", "Email and password are required")
		return
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

	// Hide the password hash in the response
	userResponse := auth.User
	userResponse.PasswordHash = ""

	response := struct {
		User  interface{} `json:"user"`
		Token string      `json:"token"`
	}{
		User:  userResponse,
		Token: auth.Token,
	}

	utils.Success(w, http.StatusOK, response)
}
