
-- Fix all sequence conflicts by dropping and recreating them properly

-- Drop all old sequences if they exist
DROP SEQUENCE IF EXISTS bids_id_seq CASCADE;
DROP SEQUENCE IF EXISTS flights_id_seq CASCADE;
DROP SEQUENCE IF EXISTS flight_bookings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS payments_id_seq CASCADE;
DROP SEQUENCE IF EXISTS passengers_id_seq CASCADE;
DROP SEQUENCE IF EXISTS search_requests_id_seq CASCADE;
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS retail_bids_id_seq CASCADE;
DROP SEQUENCE IF EXISTS deals_id_seq CASCADE;
DROP SEQUENCE IF EXISTS packages_id_seq CASCADE;
DROP SEQUENCE IF EXISTS bookings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS refunds_id_seq CASCADE;
DROP SEQUENCE IF EXISTS notifications_id_seq CASCADE;

-- Now recreate sequences for the new grab_t_ tables
CREATE SEQUENCE IF NOT EXISTS grab_t_bids_id_seq;
CREATE SEQUENCE IF NOT EXISTS grab_t_retail_bids_id_seq;
CREATE SEQUENCE IF NOT EXISTS grab_t_users_id_seq;
CREATE SEQUENCE IF NOT EXISTS grab_t_bid_payments_id_seq;

-- Update the grab_t_ tables to use the new sequences
ALTER TABLE grab_t_bids ALTER COLUMN id SET DEFAULT nextval('grab_t_bids_id_seq');
ALTER TABLE grab_t_retail_bids ALTER COLUMN id SET DEFAULT nextval('grab_t_retail_bids_id_seq');
ALTER TABLE grab_t_users ALTER COLUMN id SET DEFAULT nextval('grab_t_users_id_seq');
ALTER TABLE grab_t_bid_payments ALTER COLUMN id SET DEFAULT nextval('grab_t_bid_payments_id_seq');

-- Set the sequences to start from the correct values
SELECT setval('grab_t_bids_id_seq', COALESCE((SELECT MAX(id) FROM grab_t_bids), 0) + 1, false);
SELECT setval('grab_t_retail_bids_id_seq', COALESCE((SELECT MAX(id) FROM grab_t_retail_bids), 0) + 1, false);
SELECT setval('grab_t_users_id_seq', COALESCE((SELECT MAX(id) FROM grab_t_users), 0) + 1, false);
SELECT setval('grab_t_bid_payments_id_seq', COALESCE((SELECT MAX(id) FROM grab_t_bid_payments), 0) + 1, false);
