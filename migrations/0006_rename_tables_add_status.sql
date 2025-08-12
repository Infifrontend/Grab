
-- Create the new status table
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

-- Insert default status values
INSERT INTO "grab_m_status" ("status_code", "status_name", "status_type", "description") VALUES
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
('RETAIL_PAID', 'Paid', 'retail_bid', 'Retail bid payment completed');

-- Rename existing tables
ALTER TABLE "users" RENAME TO "grab_t_users";
ALTER TABLE "bids" RENAME TO "grab_t_bids";
ALTER TABLE "payments" RENAME TO "grab_t_bid_payments";
ALTER TABLE "retail_bids" RENAME TO "grab_t_retail_bids";

-- Add status_id columns to the renamed tables
ALTER TABLE "grab_t_bids" ADD COLUMN "status_id" integer;
ALTER TABLE "grab_t_bid_payments" ADD COLUMN "status_id" integer;
ALTER TABLE "grab_t_retail_bids" ADD COLUMN "status_id" integer;
ALTER TABLE "refunds" ADD COLUMN "status_id" integer;

-- Add bid_id column to payments table if it doesn't exist
ALTER TABLE "grab_t_bid_payments" ADD COLUMN IF NOT EXISTS "bid_id" integer;

-- Add foreign key constraints for status_id
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

-- Update foreign key constraints to use new table names
DO $$ BEGIN
 ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_user_id_users_id_fk";
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_grab_t_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "grab_t_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "flight_bookings" DROP CONSTRAINT IF EXISTS "flight_bookings_user_id_users_id_fk";
 ALTER TABLE "flight_bookings" ADD CONSTRAINT "flight_bookings_user_id_grab_t_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "grab_t_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_bids" DROP CONSTRAINT IF EXISTS "bids_user_id_users_id_fk";
 ALTER TABLE "grab_t_bids" ADD CONSTRAINT "grab_t_bids_user_id_grab_t_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "grab_t_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_bids" DROP CONSTRAINT IF EXISTS "bids_flight_id_flights_id_fk";
 ALTER TABLE "grab_t_bids" ADD CONSTRAINT "grab_t_bids_flight_id_flights_id_fk" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_bid_payments" DROP CONSTRAINT IF EXISTS "payments_booking_id_flight_bookings_id_fk";
 ALTER TABLE "grab_t_bid_payments" ADD CONSTRAINT "grab_t_bid_payments_booking_id_flight_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "flight_bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_bid_payments" DROP CONSTRAINT IF EXISTS "payments_user_id_users_id_fk";
 ALTER TABLE "grab_t_bid_payments" ADD CONSTRAINT "grab_t_bid_payments_user_id_grab_t_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "grab_t_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "refunds" DROP CONSTRAINT IF EXISTS "refunds_payment_id_payments_id_fk";
 ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_grab_t_bid_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "grab_t_bid_payments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_retail_bids" DROP CONSTRAINT IF EXISTS "retail_bids_bid_id_bids_id_fk";
 ALTER TABLE "grab_t_retail_bids" ADD CONSTRAINT "grab_t_retail_bids_bid_id_grab_t_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "grab_t_bids"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_retail_bids" DROP CONSTRAINT IF EXISTS "retail_bids_user_id_users_id_fk";
 ALTER TABLE "grab_t_retail_bids" ADD CONSTRAINT "grab_t_retail_bids_user_id_grab_t_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "grab_t_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_retail_bids" DROP CONSTRAINT IF EXISTS "retail_bids_flight_id_flights_id_fk";
 ALTER TABLE "grab_t_retail_bids" ADD CONSTRAINT "grab_t_retail_bids_flight_id_flights_id_fk" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Update existing status values to match status_id
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
);

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
);

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
);
