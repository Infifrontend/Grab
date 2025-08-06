
-- Delete passengers associated with the flight bookings first
DELETE FROM "passengers" 
WHERE "booking_id" IN (26, 27, 28, 29, 30);

-- Delete any payments associated with these bookings
DELETE FROM "payments" 
WHERE "booking_id" IN (26, 27, 28, 29, 30);

-- Delete any refunds associated with payments for these bookings
DELETE FROM "refunds" 
WHERE "payment_id" IN (
  SELECT "id" FROM "payments" 
  WHERE "booking_id" IN (26, 27, 28, 29, 30)
);

-- Now delete the flight bookings
DELETE FROM "flight_bookings" 
WHERE "id" IN (26, 27, 28, 29, 30);
