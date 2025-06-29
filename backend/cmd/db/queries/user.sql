-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1
LIMIT 1;

-- name: CreateUser :one
INSERT INTO users (
    full_name, email, password_hash
) VALUES (
    $1, $2, $3
)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1
LIMIT 1;

-- name: GetUserByDeviceID :one
SELECT * FROM users
WHERE device_id = $1 LIMIT 1;

-- name: CreateGuestUser :one
INSERT INTO users (device_id) 
VALUES ($1) 
RETURNING *;

-- name: UpgradeGuestUser :one
UPDATE users
SET 
  full_name = $2,
  email = $3,
  password_hash = $4,
  account_status = 'REGISTERED'
WHERE id = $1
RETURNING *;
