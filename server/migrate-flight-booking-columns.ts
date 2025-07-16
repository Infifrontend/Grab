
import { db } from "./db";

export async function migrateFlightBookingColumns() {
  try {
    console.log('Starting migration to add missing columns to flight_bookings table...');
    
    // Add the missing columns to flight_bookings table
    await db.execute(`
      ALTER TABLE flight_bookings 
      ADD COLUMN IF NOT EXISTS flight_number TEXT,
      ADD COLUMN IF NOT EXISTS airline_name TEXT,
      ADD COLUMN IF NOT EXISTS arrival_time TIMESTAMP;
    `);
    
    console.log('Successfully added missing columns to flight_bookings table');
    
    // Update existing bookings with flight data where possible
    await db.execute(`
      UPDATE flight_bookings 
      SET 
        flight_number = flights.flight_number,
        airline_name = flights.airline,
        arrival_time = flights.arrival_time
      FROM flights 
      WHERE flight_bookings.flight_id = flights.id 
      AND flight_bookings.flight_number IS NULL;
    `);
    
    console.log('Updated existing bookings with flight data');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateFlightBookingColumns()
    .then(() => {
      console.log('Flight booking columns migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Flight booking columns migration failed:', error);
      process.exit(1);
    });
}
