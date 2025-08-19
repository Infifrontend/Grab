-- Fix payments table to have user_id column
DO $$ 
BEGIN
    -- Check if user_id column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'payments' AND column_name = 'user_id') THEN
        ALTER TABLE payments ADD COLUMN user_id INTEGER REFERENCES users(id);
    END IF;
END $$;
