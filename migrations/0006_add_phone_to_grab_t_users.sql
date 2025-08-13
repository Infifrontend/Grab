
-- Add phone column to grab_t_users table
ALTER TABLE grab_t_users ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add created_at and updated_at columns if they don't exist
ALTER TABLE grab_t_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE grab_t_users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create an index on phone for faster queries
CREATE INDEX IF NOT EXISTS idx_grab_t_users_phone ON grab_t_users(phone);
