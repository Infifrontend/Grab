
-- Fix foreign key constraint in flight_bookings to reference grab_t_users instead of users
ALTER TABLE "flight_bookings" DROP CONSTRAINT IF EXISTS "flight_bookings_user_id_users_id_fk";
ALTER TABLE "flight_bookings" ADD CONSTRAINT "flight_bookings_user_id_grab_t_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "grab_t_users"("id") ON DELETE no action ON UPDATE no action;
