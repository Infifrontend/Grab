CREATE TABLE "retail_bids" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "retail_bids_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"bid_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"flight_id" integer NOT NULL,
	"submitted_amount" numeric(10, 2) NOT NULL,
	"passenger_count" integer NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bids" ADD COLUMN "total_seats_available" integer DEFAULT 50;--> statement-breakpoint
ALTER TABLE "bids" ADD COLUMN "min_seats_per_bid" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "bids" ADD COLUMN "max_seats_per_bid" integer DEFAULT 10;--> statement-breakpoint
ALTER TABLE "retail_bids" ADD CONSTRAINT "retail_bids_bid_id_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "public"."bids"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retail_bids" ADD CONSTRAINT "retail_bids_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retail_bids" ADD CONSTRAINT "retail_bids_flight_id_flights_id_fk" FOREIGN KEY ("flight_id") REFERENCES "public"."flights"("id") ON DELETE no action ON UPDATE no action;