
-- Add role column to grab_t_users table
ALTER TABLE grab_t_users ADD COLUMN IF NOT EXISTS role text DEFAULT 'retail_user';

-- Update existing users based on their isRetailAllowed status
UPDATE grab_t_users SET role = 'admin' WHERE username = 'admin' OR email LIKE '%admin%';
UPDATE grab_t_users SET role = 'retail_user' WHERE role IS NULL OR role = 'retail_user';
