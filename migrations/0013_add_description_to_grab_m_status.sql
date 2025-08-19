
-- Add description column to grab_m_status table if it doesn't exist
ALTER TABLE grab_m_status ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing records to have default descriptions
UPDATE grab_m_status SET description = 
  CASE 
    WHEN status_code = 'ACTIVE' THEN 'User account is active and fully functional'
    WHEN status_code = 'INACTIVE' THEN 'User account is temporarily disabled'
    WHEN status_code = 'PENDING' THEN 'User account is awaiting verification'
    WHEN status_code = 'SUSPENDED' THEN 'User account has been suspended due to policy violations'
    WHEN status_code = 'DELETED' THEN 'User account has been marked for deletion'
    WHEN status_code = 'O' THEN 'Bid is open for submissions'
    WHEN status_code = 'UR' THEN 'Payment received, under review'
    WHEN status_code = 'AP' THEN 'Bid approved by admin'
    WHEN status_code = 'R' THEN 'Bid rejected by admin'
    WHEN status_code = 'P' THEN 'Payment is processing'
    WHEN status_code = 'A' THEN 'Active status'
    WHEN status_code = 'C' THEN 'Bid process completed'
    ELSE 'Status description'
  END
WHERE description IS NULL;
