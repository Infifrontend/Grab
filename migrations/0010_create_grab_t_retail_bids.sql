
-- Create grab_t_retail_bids table to replace retail_bids table
CREATE TABLE IF NOT EXISTS "grab_t_retail_bids" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grab_t_retail_bids_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"r_bid_id" integer NOT NULL,
	"r_user_id" integer NOT NULL,
	"flight_id" integer NOT NULL,
	"submitted_amount" numeric(10,2) NOT NULL,
	"passenger_count" integer NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Add foreign key constraints
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
 ALTER TABLE "grab_t_retail_bids" ADD CONSTRAINT "grab_t_retail_bids_flight_id_flights_id_fk" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_grab_t_retail_bids_r_bid_id ON grab_t_retail_bids(r_bid_id);
CREATE INDEX IF NOT EXISTS idx_grab_t_retail_bids_r_user_id ON grab_t_retail_bids(r_user_id);
CREATE INDEX IF NOT EXISTS idx_grab_t_retail_bids_status ON grab_t_retail_bids(status);
CREATE INDEX IF NOT EXISTS idx_grab_t_retail_bids_created_at ON grab_t_retail_bids(created_at);

-- Migrate existing data from retail_bids to grab_t_retail_bids if retail_bids table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'retail_bids') THEN
    INSERT INTO grab_t_retail_bids (r_bid_id, r_user_id, flight_id, submitted_amount, passenger_count, status, created_at, updated_at)
    SELECT bid_id, user_id, flight_id, submitted_amount, passenger_count, status, created_at, updated_at
    FROM retail_bids
    WHERE NOT EXISTS (
      SELECT 1 FROM grab_t_retail_bids grb 
      WHERE grb.r_bid_id = retail_bids.bid_id 
      AND grb.r_user_id = retail_bids.user_id
    );
  END IF;
END $$;
