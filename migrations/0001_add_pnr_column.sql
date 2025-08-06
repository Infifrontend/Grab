
-- Migration to add PNR column to flight_bookings table
ALTER TABLE "flight_bookings" ADD COLUMN "pnr" text;

-- Create unique constraint on pnr column (initially allow null)
-- We'll update existing records first, then make it NOT NULL

-- Generate PNR for existing bookings in A1B2C3 format
UPDATE "flight_bookings" 
SET "pnr" = chr(65 + (id * 7) % 26) || ((id * 3) % 10)::text || 
           chr(65 + (id * 11) % 26) || ((id * 5) % 10)::text || 
           chr(65 + (id * 13) % 26) || ((id * 9) % 10)::text
WHERE "pnr" IS NULL;

-- Now add NOT NULL constraint and unique constraint
ALTER TABLE "flight_bookings" ALTER COLUMN "pnr" SET NOT NULL;
ALTER TABLE "flight_bookings" ADD CONSTRAINT "flight_bookings_pnr_unique" UNIQUE("pnr");
