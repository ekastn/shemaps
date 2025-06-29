-- +goose Up
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "full_name" DROP NOT NULL;

-- Add guest account support
ALTER TABLE "users" ADD COLUMN "status" VARCHAR(20) NOT NULL DEFAULT 'GUEST';
ALTER TABLE "users" ADD COLUMN "device_id" uuid UNIQUE;

-- +goose Down
ALTER TABLE "users" DROP COLUMN "device_id";
ALTER TABLE "users" DROP COLUMN "status";
ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "full_name" SET NOT NULL;
