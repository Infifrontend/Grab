
-- Add r_status column to grab_t_bids table
ALTER TABLE "grab_t_bids" ADD COLUMN IF NOT EXISTS "r_status" integer;

-- Set default r_status to 1 (Active) for existing records
UPDATE "grab_t_bids" SET "r_status" = 1 WHERE "r_status" IS NULL;

-- Add foreign key constraint
DO $$ BEGIN
 ALTER TABLE "grab_t_bids" ADD CONSTRAINT "grab_t_bids_r_status_grab_m_status_id_fk" FOREIGN KEY ("r_status") REFERENCES "grab_m_status"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_grab_t_bids_r_status ON "grab_t_bids"("r_status");
