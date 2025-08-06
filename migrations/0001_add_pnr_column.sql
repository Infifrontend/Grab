
-- Migration to add PNR column to flight_bookings table
ALTER TABLE "flight_bookings" ADD COLUMN "pnr" text;

-- Create unique constraint on pnr column (initially allow null)
-- We'll update existing records first, then make it NOT NULL

-- Generate PNR for existing bookings
UPDATE "flight_bookings" 
SET "pnr" = (100000 + (id * 123) % 900000)::text
WHERE "pnr" IS NULL;

-- Now add NOT NULL constraint and unique constraint
ALTER TABLE "flight_bookings" ALTER COLUMN "pnr" SET NOT NULL;
ALTER TABLE "flight_bookings" ADD CONSTRAINT "flight_bookings_pnr_unique" UNIQUE("pnr");
