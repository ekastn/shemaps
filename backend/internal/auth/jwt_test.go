package auth

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestMakeAndValidateJWT(t *testing.T) {
	// Generate a new UUID for the user
	userID := uuid.New()
	secret := "mySecretKey"

	// Create the JWT token
	token, err := MakeJWT(userID, secret)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// Validate the token
	validUserID, err := ValidateJWT(token, secret)
	assert.NoError(t, err)
	assert.Equal(t, userID, validUserID)
}

func TestExpiredJWT(t *testing.T) {
	// Generate a new UUID for the user
	userID := uuid.New()
	secret := "mySecretKey"

	// Create the JWT token
	token, err := MakeJWT(userID, secret)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// Validate the expired token
	_, err = ValidateJWT(token, secret)
	assert.Error(t, err)
}

func TestInvalidJWTSecret(t *testing.T) {
	// Generate a new UUID for the user
	userID := uuid.New()
	secret := "mySecretKey"

	// Create the JWT token
	token, err := MakeJWT(userID, secret)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// Try validating with an incorrect secret
	invalidSecret := "wrongSecretKey"
	_, err = ValidateJWT(token, invalidSecret)
	assert.Error(t, err)
}
