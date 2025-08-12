
-- Fix grab_t_users table schema
-- Remove any unexpected columns that might exist

-- First, let's check what columns actually exist and drop any that shouldn't be there
DO $$
DECLARE
    col_name text;
BEGIN
    -- Get all columns that exist in grab_t_users but shouldn't be there according to our schema
    FOR col_name IN 
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'grab_t_users' 
        AND column_name NOT IN ('id', 'username', 'password', 'name', 'email', 'is_retail_allowed', 'created_at', 'updated_at')
    LOOP
        EXECUTE 'ALTER TABLE grab_t_users DROP COLUMN IF EXISTS ' || quote_ident(col_name) || ' CASCADE';
        RAISE NOTICE 'Dropped unexpected column: %', col_name;
    END LOOP;
END $$;

-- Ensure all required columns exist with correct types
ALTER TABLE grab_t_users ADD COLUMN IF NOT EXISTS id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY;
ALTER TABLE grab_t_users ADD COLUMN IF NOT EXISTS username text NOT NULL;
ALTER TABLE grab_t_users ADD COLUMN IF NOT EXISTS password text NOT NULL;
ALTER TABLE grab_t_users ADD COLUMN IF NOT EXISTS name text NOT NULL;
ALTER TABLE grab_t_users ADD COLUMN IF NOT EXISTS email text NOT NULL;
ALTER TABLE grab_t_users ADD COLUMN IF NOT EXISTS is_retail_allowed boolean DEFAULT false;

-- Ensure unique constraints exist
DO $$ BEGIN
    ALTER TABLE grab_t_users ADD CONSTRAINT grab_t_users_username_unique UNIQUE (username);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE grab_t_users ADD CONSTRAINT grab_t_users_email_unique UNIQUE (email);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
