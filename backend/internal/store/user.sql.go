// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: user.sql

package store

import (
	"context"

	"github.com/google/uuid"
)

const createGuestUser = `-- name: CreateGuestUser :one
INSERT INTO users (device_id) 
VALUES ($1) 
RETURNING id, full_name, email, password_hash, created_at, status, device_id
`

func (q *Queries) CreateGuestUser(ctx context.Context, deviceID uuid.UUID) (User, error) {
	row := q.db.QueryRow(ctx, createGuestUser, deviceID)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FullName,
		&i.Email,
		&i.PasswordHash,
		&i.CreatedAt,
		&i.Status,
		&i.DeviceID,
	)
	return i, err
}

const createUser = `-- name: CreateUser :one
INSERT INTO users (
    full_name, email, password_hash
) VALUES (
    $1, $2, $3
)
RETURNING id, full_name, email, password_hash, created_at, status, device_id
`

type CreateUserParams struct {
	FullName     *string `json:"full_name"`
	Email        *string `json:"email"`
	PasswordHash *string `json:"password_hash"`
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRow(ctx, createUser, arg.FullName, arg.Email, arg.PasswordHash)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FullName,
		&i.Email,
		&i.PasswordHash,
		&i.CreatedAt,
		&i.Status,
		&i.DeviceID,
	)
	return i, err
}

const getUserByDeviceID = `-- name: GetUserByDeviceID :one
SELECT id, full_name, email, password_hash, created_at, status, device_id FROM users
WHERE device_id = $1 LIMIT 1
`

func (q *Queries) GetUserByDeviceID(ctx context.Context, deviceID uuid.UUID) (User, error) {
	row := q.db.QueryRow(ctx, getUserByDeviceID, deviceID)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FullName,
		&i.Email,
		&i.PasswordHash,
		&i.CreatedAt,
		&i.Status,
		&i.DeviceID,
	)
	return i, err
}

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, full_name, email, password_hash, created_at, status, device_id FROM users
WHERE email = $1
LIMIT 1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email *string) (User, error) {
	row := q.db.QueryRow(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FullName,
		&i.Email,
		&i.PasswordHash,
		&i.CreatedAt,
		&i.Status,
		&i.DeviceID,
	)
	return i, err
}

const getUserByID = `-- name: GetUserByID :one
SELECT id, full_name, email, password_hash, created_at, status, device_id FROM users
WHERE id = $1
LIMIT 1
`

func (q *Queries) GetUserByID(ctx context.Context, id uuid.UUID) (User, error) {
	row := q.db.QueryRow(ctx, getUserByID, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FullName,
		&i.Email,
		&i.PasswordHash,
		&i.CreatedAt,
		&i.Status,
		&i.DeviceID,
	)
	return i, err
}

const upgradeGuestUser = `-- name: UpgradeGuestUser :one
UPDATE users
SET 
  full_name = $2,
  email = $3,
  password_hash = $4,
  account_status = 'REGISTERED'
WHERE id = $1
RETURNING id, full_name, email, password_hash, created_at, status, device_id
`

type UpgradeGuestUserParams struct {
	ID           uuid.UUID `json:"id"`
	FullName     *string   `json:"full_name"`
	Email        *string   `json:"email"`
	PasswordHash *string   `json:"password_hash"`
}

func (q *Queries) UpgradeGuestUser(ctx context.Context, arg UpgradeGuestUserParams) (User, error) {
	row := q.db.QueryRow(ctx, upgradeGuestUser,
		arg.ID,
		arg.FullName,
		arg.Email,
		arg.PasswordHash,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FullName,
		&i.Email,
		&i.PasswordHash,
		&i.CreatedAt,
		&i.Status,
		&i.DeviceID,
	)
	return i, err
}
