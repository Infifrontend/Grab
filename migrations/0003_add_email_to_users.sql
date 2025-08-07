
-- Add email column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email text;

-- Update existing users to have email values (using username as placeholder)
UPDATE users SET email = username WHERE email IS NULL;

-- Add unique constraint and not null constraint
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
