
-- Add retail access control column to users table
ALTER TABLE "users" ADD COLUMN "is_retail_allowed" boolean DEFAULT false;

-- Update existing users to allow retail access (you can modify this as needed)
UPDATE "users" SET "is_retail_allowed" = true WHERE "username" = 'default_user';
