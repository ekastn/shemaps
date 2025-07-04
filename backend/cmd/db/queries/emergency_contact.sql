-- name: CreateEmergencyContact :one
INSERT INTO emergency_contacts (user_id, contact_name, phone_number)
VALUES ($1, $2, $3) RETURNING *;

-- name: GetEmergencyContactsByUser :many
SELECT * FROM emergency_contacts WHERE user_id = $1 ORDER BY created_at;

-- name: DeleteEmergencyContact :exec
DELETE FROM emergency_contacts WHERE id = $1 AND user_id = $2;

-- name: UpdateEmergencyContact :one
UPDATE emergency_contacts SET contact_name = $1, phone_number = $2 WHERE id = $3 AND user_id = $4 RETURNING *;