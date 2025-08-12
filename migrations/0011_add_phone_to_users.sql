
-- Add phone column to grab_t_users table
ALTER TABLE grab_t_users ADD COLUMN IF NOT EXISTS phone text;
