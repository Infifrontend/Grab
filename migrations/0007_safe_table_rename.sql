
-- Safe migration that checks for existing tables before renaming

-- Check if grab_m_status table exists, if not create it
CREATE TABLE IF NOT EXISTS "grab_m_status" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grab_m_status_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"status_code" text NOT NULL,
	"status_name" text NOT NULL,
	"status_type" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "grab_m_status_status_code_unique" UNIQUE("status_code")
);

-- Insert default status values only if they don't exist
INSERT INTO "grab_m_status" ("status_code", "status_name", "status_type", "description") 
SELECT * FROM (VALUES
  ('BID_ACTIVE', 'Active', 'bid', 'Bid is active and accepting retail bids'),
  ('BID_ACCEPTED', 'Accepted', 'bid', 'Bid has been accepted'),
  ('BID_REJECTED', 'Rejected', 'bid', 'Bid has been rejected'),
  ('BID_EXPIRED', 'Expired', 'bid', 'Bid has expired'),
  ('BID_WITHDRAWN', 'Withdrawn', 'bid', 'Bid has been withdrawn'),
  ('PAYMENT_PENDING', 'Pending', 'payment', 'Payment is pending'),
  ('PAYMENT_PROCESSING', 'Processing', 'payment', 'Payment is being processed'),
  ('PAYMENT_COMPLETED', 'Completed', 'payment', 'Payment has been completed'),
  ('PAYMENT_FAILED', 'Failed', 'payment', 'Payment has failed'),
  ('PAYMENT_CANCELLED', 'Cancelled', 'payment', 'Payment has been cancelled'),
  ('PAYMENT_REFUNDED', 'Refunded', 'payment', 'Payment has been refunded'),
  ('RETAIL_SUBMITTED', 'Submitted', 'retail_bid', 'Retail bid has been submitted'),
  ('RETAIL_APPROVED', 'Approved', 'retail_bid', 'Retail bid has been approved'),
  ('RETAIL_REJECTED', 'Rejected', 'retail_bid', 'Retail bid has been rejected'),
  ('RETAIL_UNDER_REVIEW', 'Under Review', 'retail_bid', 'Retail bid is under review'),
  ('RETAIL_PAID', 'Paid', 'retail_bid', 'Retail bid payment completed')
) AS new_values("status_code", "status_name", "status_type", "description")
WHERE NOT EXISTS (
  SELECT 1 FROM "grab_m_status" WHERE "status_code" = new_values."status_code"
);

-- Safely rename tables only if the old table exists and new table doesn't
DO $$
BEGIN
  -- Rename users table if needed
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'grab_t_users') THEN
    ALTER TABLE "users" RENAME TO "grab_t_users";
  END IF;

  -- Rename bids table if needed
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bids') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'grab_t_bids') THEN
    ALTER TABLE "bids" RENAME TO "grab_t_bids";
  END IF;

  -- Rename payments table if needed
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'grab_t_bid_payments') THEN
    ALTER TABLE "payments" RENAME TO "grab_t_bid_payments";
  END IF;

  -- Rename retail_bids table if needed
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'retail_bids') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'grab_t_retail_bids') THEN
    ALTER TABLE "retail_bids" RENAME TO "grab_t_retail_bids";
  END IF;
END $$;

-- Add status_id columns if they don't exist
ALTER TABLE "grab_t_bids" ADD COLUMN IF NOT EXISTS "status_id" integer;
ALTER TABLE "grab_t_bid_payments" ADD COLUMN IF NOT EXISTS "status_id" integer;
ALTER TABLE "grab_t_retail_bids" ADD COLUMN IF NOT EXISTS "status_id" integer;
ALTER TABLE "refunds" ADD COLUMN IF NOT EXISTS "status_id" integer;

-- Add bid_id column to payments table if it doesn't exist
ALTER TABLE "grab_t_bid_payments" ADD COLUMN IF NOT EXISTS "bid_id" integer;

-- Add foreign key constraints for status_id (with proper error handling)
DO $$ BEGIN
 ALTER TABLE "grab_t_bids" ADD CONSTRAINT "grab_t_bids_status_id_grab_m_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "grab_m_status"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_bid_payments" ADD CONSTRAINT "grab_t_bid_payments_status_id_grab_m_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "grab_m_status"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_retail_bids" ADD CONSTRAINT "grab_t_retail_bids_status_id_grab_m_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "grab_m_status"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "refunds" ADD CONSTRAINT "refunds_status_id_grab_m_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "grab_m_status"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Add bid_id foreign key constraint to payments
DO $$ BEGIN
 ALTER TABLE "grab_t_bid_payments" ADD CONSTRAINT "grab_t_bid_payments_bid_id_grab_t_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "grab_t_bids"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Update foreign key constraints to use new table names (with proper cleanup)
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    -- Update bookings foreign keys
    FOR constraint_name IN 
        SELECT conname FROM pg_constraint WHERE conname LIKE '%bookings%user_id%users%'
    LOOP
        EXECUTE 'ALTER TABLE bookings DROP CONSTRAINT IF EXISTS ' || constraint_name;
    END LOOP;
    
    ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_grab_t_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "grab_t_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Continue with other foreign key updates...
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    -- Update flight_bookings foreign keys
    FOR constraint_name IN 
        SELECT conname FROM pg_constraint WHERE conname LIKE '%flight_bookings%user_id%users%'
    LOOP
        EXECUTE 'ALTER TABLE flight_bookings DROP CONSTRAINT IF EXISTS ' || constraint_name;
    END LOOP;
    
    ALTER TABLE "flight_bookings" ADD CONSTRAINT "flight_bookings_user_id_grab_t_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "grab_t_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update existing status values to match status_id (only if status_id is null)
UPDATE "grab_t_bids" SET "status_id" = (
  SELECT id FROM "grab_m_status" 
  WHERE "status_code" = CASE 
    WHEN "bid_status" = 'active' THEN 'BID_ACTIVE'
    WHEN "bid_status" = 'accepted' THEN 'BID_ACCEPTED'
    WHEN "bid_status" = 'rejected' THEN 'BID_REJECTED'
    WHEN "bid_status" = 'expired' THEN 'BID_EXPIRED'
    WHEN "bid_status" = 'withdrawn' THEN 'BID_WITHDRAWN'
    ELSE 'BID_ACTIVE'
  END
) WHERE "status_id" IS NULL;

UPDATE "grab_t_bid_payments" SET "status_id" = (
  SELECT id FROM "grab_m_status" 
  WHERE "status_code" = CASE 
    WHEN "payment_status" = 'pending' THEN 'PAYMENT_PENDING'
    WHEN "payment_status" = 'processing' THEN 'PAYMENT_PROCESSING'
    WHEN "payment_status" = 'completed' THEN 'PAYMENT_COMPLETED'
    WHEN "payment_status" = 'failed' THEN 'PAYMENT_FAILED'
    WHEN "payment_status" = 'cancelled' THEN 'PAYMENT_CANCELLED'
    WHEN "payment_status" = 'refunded' THEN 'PAYMENT_REFUNDED'
    ELSE 'PAYMENT_PENDING'
  END
) WHERE "status_id" IS NULL;

UPDATE "grab_t_retail_bids" SET "status_id" = (
  SELECT id FROM "grab_m_status" 
  WHERE "status_code" = CASE 
    WHEN "status" = 'submitted' THEN 'RETAIL_SUBMITTED'
    WHEN "status" = 'approved' THEN 'RETAIL_APPROVED'
    WHEN "status" = 'rejected' THEN 'RETAIL_REJECTED'
    WHEN "status" = 'under_review' THEN 'RETAIL_UNDER_REVIEW'
    WHEN "status" = 'paid' THEN 'RETAIL_PAID'
    ELSE 'RETAIL_SUBMITTED'
  END
) WHERE "status_id" IS NULL;
