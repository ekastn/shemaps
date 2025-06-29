package services

import (
	"context"
	"errors"

	"github.com/ekastn/shemaps/backend/internal/auth"
	"github.com/ekastn/shemaps/backend/internal/config"
	"github.com/ekastn/shemaps/backend/internal/store"
	"github.com/google/uuid"
)

var (
	ErrUserAlreadyExists  = errors.New("user already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type AuthService struct {
	store  *store.Queries
	config *config.Config
}

type RegisterUserParams struct {
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginUserParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	User  store.User `json:"user"`
	Token string     `json:"token"`
}

func NewAuthService(store *store.Queries, config *config.Config) *AuthService {
	return &AuthService{
		store:  store,
		config: config,
	}
}

func (s *AuthService) Register(ctx context.Context, params RegisterUserParams) (*AuthResponse, error) {
	_, err := s.store.GetUserByEmail(ctx, params.Email)
	if err == nil {
		return nil, ErrUserAlreadyExists
	}

	passwordHash, err := auth.HashPassword(params.Password)
	if err != nil {
		return nil, err
	}

	user, err := s.store.CreateUser(ctx, store.CreateUserParams{
		FullName:     params.FullName,
		Email:        params.Email,
		PasswordHash: passwordHash,
	})
	if err != nil {
		return nil, err
	}

	token, err := auth.MakeJWT(user.ID, s.config.JWTSecret)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		User:  user,
		Token: token,
	}, nil
}

func (s *AuthService) Login(ctx context.Context, params LoginUserParams) (*AuthResponse, error) {
	user, err := s.store.GetUserByEmail(ctx, params.Email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if !auth.CheckPasswordHash(params.Password, user.PasswordHash) {
		return nil, ErrInvalidCredentials
	}

	token, err := auth.MakeJWT(user.ID, s.config.JWTSecret)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		User:  user,
		Token: token,
	}, nil
}

func (s *AuthService) ValidateToken(tokenString string) (uuid.UUID, error) {
	return auth.ValidateJWT(tokenString, s.config.JWTSecret)
}

func (s *AuthService) GetUserByID(ctx context.Context, userID uuid.UUID) (store.User, error) {
	return s.store.GetUserByID(ctx, userID)
}
