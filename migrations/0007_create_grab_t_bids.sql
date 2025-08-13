
-- Create grab_t_bids table to replace the bids table
CREATE TABLE IF NOT EXISTS "grab_t_bids" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grab_t_bids_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"flight_id" integer NOT NULL,
	"bid_amount" numeric(10,2) NOT NULL,
	"passenger_count" integer NOT NULL,
	"bid_status" text DEFAULT 'active' NOT NULL,
	"valid_until" timestamp NOT NULL,
	"notes" text,
	"total_seats_available" integer DEFAULT 50,
	"min_seats_per_bid" integer DEFAULT 1,
	"max_seats_per_bid" integer DEFAULT 10,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "grab_t_bids" ADD CONSTRAINT "grab_t_bids_user_id_grab_t_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "grab_t_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grab_t_bids" ADD CONSTRAINT "grab_t_bids_flight_id_flights_id_fk" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_grab_t_bids_user_id ON grab_t_bids(user_id);
CREATE INDEX IF NOT EXISTS idx_grab_t_bids_flight_id ON grab_t_bids(flight_id);
CREATE INDEX IF NOT EXISTS idx_grab_t_bids_bid_status ON grab_t_bids(bid_status);
CREATE INDEX IF NOT EXISTS idx_grab_t_bids_created_at ON grab_t_bids(created_at);
