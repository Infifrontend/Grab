
-- Add seat configuration columns to bids table
ALTER TABLE bids ADD COLUMN total_seats_available INTEGER DEFAULT 50;
ALTER TABLE bids ADD COLUMN min_seats_per_bid INTEGER DEFAULT 1;
ALTER TABLE bids ADD COLUMN max_seats_per_bid INTEGER DEFAULT 10;

-- Update existing records with default values
UPDATE bids SET 
  total_seats_available = 50,
  min_seats_per_bid = 1,
  max_seats_per_bid = 10
WHERE total_seats_available IS NULL 
   OR min_seats_per_bid IS NULL 
   OR max_seats_per_bid IS NULL;
