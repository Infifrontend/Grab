
import { db } from "./db";

async function resetDatabase() {
  try {
    console.log("Dropping all tables...");
    
    // Drop tables in reverse dependency order
    await db.execute(`DROP TABLE IF EXISTS retail_bids CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS refunds CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS payments CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS passengers CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS flight_bookings CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS bids CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS flights CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS search_requests CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS bookings CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS packages CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS deals CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS users CASCADE;`);
    await db.execute(`DROP TABLE IF EXISTS notifications CASCADE;`);
    
    // Drop sequences
    await db.execute(`DROP SEQUENCE IF EXISTS retail_bids_id_seq CASCADE;`);
    await db.execute(`DROP SEQUENCE IF EXISTS refunds_id_seq CASCADE;`);
    await db.execute(`DROP SEQUENCE IF EXISTS payments_id_seq CASCADE;`);
    await db.execute(`DROP SEQUENCE IF EXISTS passengers_id_seq CASCADE;`);
    await db.execute(`DROP SEQUENCE IF EXISTS flight_bookings_id_seq CASCADE;`);
    await db.execute(`DROP SEQUENCE IF EXISTS bids_id_seq CASCADE;`);
    await db.execute(`DROP SEQUENCE IF EXISTS flights_id_seq CASCADE;`);
    await db.execute(`DROP SEQUENCE IF EXISTS search_requests_id_seq CASCADE;`);
    await db.execute(`DROP SEQUENCE IF EXISTS bookings_id_seq CASCADE;`);
    await db.execute(`DROP SEQUENCE IF EXISTS packages_id_seq CASCADE;`);
    await db.execute(`DROP SEQUENCE IF EXISTS deals_id_seq CASCADE;`);
    await db.execute(`DROP SEQUENCE IF EXISTS users_id_seq CASCADE;`);
    await db.execute(`DROP SEQUENCE IF EXISTS notifications_id_seq CASCADE;`);
    
    console.log("✅ All tables and sequences dropped successfully!");
    console.log("Now run: npm run db:migrate");
    
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  }
}

if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { resetDatabase };
