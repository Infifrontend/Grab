
-- Remove unnecessary columns from grab_t_bids table
ALTER TABLE grab_t_bids DROP COLUMN IF EXISTS user_id;
ALTER TABLE grab_t_bids DROP COLUMN IF EXISTS passenger_count;
ALTER TABLE grab_t_bids DROP COLUMN IF EXISTS bid_status;
ALTER TABLE grab_t_bids DROP COLUMN IF EXISTS flight_id;

-- Ensure r_status column exists and has proper default
ALTER TABLE grab_t_bids ALTER COLUMN r_status SET DEFAULT 4;

-- Update any existing records to have proper r_status if null
UPDATE grab_t_bids SET r_status = 4 WHERE r_status IS NULL;
