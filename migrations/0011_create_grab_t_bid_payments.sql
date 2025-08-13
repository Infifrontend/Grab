
CREATE TABLE IF NOT EXISTS "grab_t_bid_payments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grab_t_bid_payments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"r_user_id" integer NOT NULL,
	"r_retail_bid_id" integer,
	"payment_reference" text NOT NULL,
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grab_t_bid_payments" ADD CONSTRAINT "grab_t_bid_payments_r_user_id_grab_t_users_id_fk" FOREIGN KEY ("r_user_id") REFERENCES "grab_t_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grab_t_bid_payments" ADD CONSTRAINT "grab_t_bid_payments_r_retail_bid_id_grab_t_retail_bids_id_fk" FOREIGN KEY ("r_retail_bid_id") REFERENCES "grab_t_retail_bids"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grab_t_bid_payments" ADD CONSTRAINT "grab_t_bid_payments_r_status_grab_m_status_id_fk" FOREIGN KEY ("r_status") REFERENCES "grab_m_status"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grab_t_bid_payments" ADD CONSTRAINT "grab_t_bid_payments_payment_reference_unique" UNIQUE("payment_reference");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
