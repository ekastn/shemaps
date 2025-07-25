// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: emergency_contact.sql

package store

import (
	"context"

	"github.com/google/uuid"
)

const createEmergencyContact = `-- name: CreateEmergencyContact :one
INSERT INTO emergency_contacts (user_id, contact_name, phone_number)
VALUES ($1, $2, $3) RETURNING id, user_id, contact_name, phone_number, created_at
`

type CreateEmergencyContactParams struct {
	UserID      uuid.UUID `json:"user_id"`
	ContactName string    `json:"contact_name"`
	PhoneNumber string    `json:"phone_number"`
}

func (q *Queries) CreateEmergencyContact(ctx context.Context, arg CreateEmergencyContactParams) (EmergencyContact, error) {
	row := q.db.QueryRow(ctx, createEmergencyContact, arg.UserID, arg.ContactName, arg.PhoneNumber)
	var i EmergencyContact
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.ContactName,
		&i.PhoneNumber,
		&i.CreatedAt,
	)
	return i, err
}

const deleteEmergencyContact = `-- name: DeleteEmergencyContact :exec
DELETE FROM emergency_contacts WHERE id = $1 AND user_id = $2
`

type DeleteEmergencyContactParams struct {
	ID     uuid.UUID `json:"id"`
	UserID uuid.UUID `json:"user_id"`
}

func (q *Queries) DeleteEmergencyContact(ctx context.Context, arg DeleteEmergencyContactParams) error {
	_, err := q.db.Exec(ctx, deleteEmergencyContact, arg.ID, arg.UserID)
	return err
}

const getEmergencyContactsByUser = `-- name: GetEmergencyContactsByUser :many
SELECT id, user_id, contact_name, phone_number, created_at FROM emergency_contacts WHERE user_id = $1 ORDER BY created_at
`

func (q *Queries) GetEmergencyContactsByUser(ctx context.Context, userID uuid.UUID) ([]EmergencyContact, error) {
	rows, err := q.db.Query(ctx, getEmergencyContactsByUser, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []EmergencyContact
	for rows.Next() {
		var i EmergencyContact
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.ContactName,
			&i.PhoneNumber,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateEmergencyContact = `-- name: UpdateEmergencyContact :one
UPDATE emergency_contacts SET contact_name = $1, phone_number = $2 WHERE id = $3 AND user_id = $4 RETURNING id, user_id, contact_name, phone_number, created_at
`

type UpdateEmergencyContactParams struct {
	ContactName string    `json:"contact_name"`
	PhoneNumber string    `json:"phone_number"`
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"user_id"`
}

func (q *Queries) UpdateEmergencyContact(ctx context.Context, arg UpdateEmergencyContactParams) (EmergencyContact, error) {
	row := q.db.QueryRow(ctx, updateEmergencyContact,
		arg.ContactName,
		arg.PhoneNumber,
		arg.ID,
		arg.UserID,
	)
	var i EmergencyContact
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.ContactName,
		&i.PhoneNumber,
		&i.CreatedAt,
	)
	return i, err
}
