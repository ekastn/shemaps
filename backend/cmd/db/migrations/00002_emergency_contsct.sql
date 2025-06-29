-- +goose Up
CREATE TABLE "emergency_contacts" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "contact_name" varchar NOT NULL,
  "phone_number" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

-- +goose Down
DROP TABLE IF EXISTS "emergency_contacts";
