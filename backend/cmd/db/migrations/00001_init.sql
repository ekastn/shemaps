-- +goose Up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TABLE "users" (
  id uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "safety_reports" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "reporter_user_id" uuid NOT NULL,
  "location" geography(Point, 4326) NOT NULL,
  "latitude" float8 NOT NULL,
  "longitude" float8 NOT NULL,
  "safety_level" varchar NOT NULL,
  "description" varchar,
  "tags" text[],
  "confirmations_count" int NOT NULL DEFAULT 1,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "safety_reports" ADD FOREIGN KEY ("reporter_user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

-- SPATIAL INDEX
CREATE INDEX safety_reports_location_idx ON "safety_reports" USING GIST ("location");


-- +goose Down
DROP TABLE IF EXISTS "safety_reports";
DROP TABLE IF EXISTS "users";
