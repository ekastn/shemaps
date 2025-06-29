-- name: CreateEmergencyContact :one
INSERT INTO emergency_contacts (user_id, contact_name, phone_number)
VALUES ($1, $2, $3) RETURNING *;

-- name: GetEmergencyContactsByUser :many
SELECT * FROM emergency_contacts WHERE user_id = $1 ORDER BY created_at;

-- name: DeleteEmergencyContact :exec
DELETE FROM emergency_contacts WHERE id = $1 AND user_id = $2;
