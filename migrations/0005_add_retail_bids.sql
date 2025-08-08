
-- Add retail_bids table for storing retail user bid submissions
CREATE TABLE IF NOT EXISTS "retail_bids" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "retail_bids_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"bid_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"flight_id" integer NOT NULL,
	"submitted_amount" numeric(10,2) NOT NULL,
	"passenger_count" integer NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "retail_bids" ADD CONSTRAINT "retail_bids_bid_id_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "bids"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "retail_bids" ADD CONSTRAINT "retail_bids_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "retail_bids" ADD CONSTRAINT "retail_bids_flight_id_flights_id_fk" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
