
-- Create grab_m_status table if it doesn't exist
CREATE TABLE IF NOT EXISTS "grab_m_status" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grab_m_status_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"status_name" text NOT NULL,
	"status_code" text NOT NULL UNIQUE,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Insert default status values
INSERT INTO "grab_m_status" (status_name, status_code, description) VALUES
('Active', 'ACTIVE', 'User account is active and fully functional'),
('Inactive', 'INACTIVE', 'User account is temporarily disabled'),
('Pending', 'PENDING', 'User account is awaiting verification'),
('Suspended', 'SUSPENDED', 'User account has been suspended due to policy violations'),
('Deleted', 'DELETED', 'User account has been marked for deletion')
ON CONFLICT (status_code) DO NOTHING;

-- Add r_status column to grab_t_users table
ALTER TABLE "grab_t_users" ADD COLUMN IF NOT EXISTS "r_status" integer;

-- Set default r_status to 1 (Active) for existing users
UPDATE "grab_t_users" SET "r_status" = 1 WHERE "r_status" IS NULL;

-- Add foreign key constraint
DO $$ BEGIN
 ALTER TABLE "grab_t_users" ADD CONSTRAINT "grab_t_users_r_status_grab_m_status_id_fk" FOREIGN KEY ("r_status") REFERENCES "grab_m_status"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_grab_t_users_r_status ON "grab_t_users"("r_status");
