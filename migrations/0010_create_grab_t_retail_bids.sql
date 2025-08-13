

-- Drop the table if it exists to recreate with proper structure
DROP TABLE IF EXISTS "grab_t_retail_bids" CASCADE;
DROP TABLE IF EXISTS "grab_t_bid_payments" CASCADE;

-- Create grab_t_retail_bids table to match your database design
CREATE TABLE "grab_t_retail_bids" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grab_t_retail_bids_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"r_bid_id" integer NOT NULL,
	"r_user_id" integer NOT NULL,
	"submitted_amount" numeric(10,2) NOT NULL,
	"seat_booked" integer NOT NULL,
	"r_status" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Create grab_t_bid_payments table to match your database design
CREATE TABLE "grab_t_bid_payments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grab_t_bid_payments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"r_user_id" integer NOT NULL,
	"r_retail_bid_id" integer NOT NULL,
	"payment_reference" text UNIQUE NOT NULL,
	"amount" numeric(10,2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"payment_method" text NOT NULL,
	"r_status" integer,
	"transaction_id" text,
	"payment_gateway" text,
	"failure_reason" text,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);

-- Add foreign key constraints for grab_t_retail_bids
DO $$ BEGIN
 ALTER TABLE "grab_t_retail_bids" ADD CONSTRAINT "grab_t_retail_bids_r_bid_id_grab_t_bids_id_fk" FOREIGN KEY ("r_bid_id") REFERENCES "grab_t_bids"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_retail_bids" ADD CONSTRAINT "grab_t_retail_bids_r_user_id_grab_t_users_id_fk" FOREIGN KEY ("r_user_id") REFERENCES "grab_t_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_retail_bids" ADD CONSTRAINT "grab_t_retail_bids_r_status_grab_m_status_id_fk" FOREIGN KEY ("r_status") REFERENCES "grab_m_status"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for grab_t_bid_payments
DO $$ BEGIN
 ALTER TABLE "grab_t_bid_payments" ADD CONSTRAINT "grab_t_bid_payments_r_user_id_grab_t_users_id_fk" FOREIGN KEY ("r_user_id") REFERENCES "grab_t_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_bid_payments" ADD CONSTRAINT "grab_t_bid_payments_r_retail_bid_id_grab_t_retail_bids_id_fk" FOREIGN KEY ("r_retail_bid_id") REFERENCES "grab_t_retail_bids"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_bid_payments" ADD CONSTRAINT "grab_t_bid_payments_r_status_grab_m_status_id_fk" FOREIGN KEY ("r_status") REFERENCES "grab_m_status"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_grab_t_retail_bids_r_bid_id ON grab_t_retail_bids(r_bid_id);
CREATE INDEX IF NOT EXISTS idx_grab_t_retail_bids_r_user_id ON grab_t_retail_bids(r_user_id);
CREATE INDEX IF NOT EXISTS idx_grab_t_retail_bids_r_status ON grab_t_retail_bids(r_status);
CREATE INDEX IF NOT EXISTS idx_grab_t_retail_bids_created_at ON grab_t_retail_bids(created_at);

CREATE INDEX IF NOT EXISTS idx_grab_t_bid_payments_r_user_id ON grab_t_bid_payments(r_user_id);
CREATE INDEX IF NOT EXISTS idx_grab_t_bid_payments_r_retail_bid_id ON grab_t_bid_payments(r_retail_bid_id);
CREATE INDEX IF NOT EXISTS idx_grab_t_bid_payments_r_status ON grab_t_bid_payments(r_status);
CREATE INDEX IF NOT EXISTS idx_grab_t_bid_payments_created_at ON grab_t_bid_payments(created_at);

