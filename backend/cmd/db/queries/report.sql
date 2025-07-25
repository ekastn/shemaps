-- name: CreateSafetyReport :one
INSERT INTO safety_reports (
  reporter_user_id, location, latitude, longitude, safety_level, tags, description
) VALUES (
  $1, ST_SetSRID(ST_MakePoint($3, $2), 4326), $2, $3, $4, $5, $6
) RETURNING *;

-- name: FindReportsInBounds :many
SELECT * FROM safety_reports
WHERE
  location && ST_MakeEnvelope(@west::float8, @south::float8, @east::float8, @north::float8, 4326)
ORDER BY created_at DESC;
