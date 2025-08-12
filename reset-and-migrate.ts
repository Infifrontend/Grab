
import { sql } from "drizzle-orm";
import { db } from "./server/db.js";

async function resetAndMigrate() {
  try {
    console.log("Starting database reset and migration...");
    
    // Drop all tables to start fresh
    console.log("Dropping existing tables...");
    await db.execute(sql`DROP TABLE IF EXISTS refunds CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS grab_t_retail_bids CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS grab_t_bid_payments CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS grab_t_bids CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS passengers CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS flight_bookings CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS bookings CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS flights CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS grab_t_users CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS grab_m_status CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS deals CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS packages CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS search_requests CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS notifications CASCADE`);
    
    // Drop old table names if they exist
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS bids CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS payments CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS retail_bids CASCADE`);
    
    // Clear migration tracking table
    await db.execute(sql`DROP TABLE IF EXISTS __drizzle_migrations CASCADE`);
    
    console.log("All tables dropped successfully");
    console.log("Database reset complete. Now run 'npm run db:migrate' to apply all migrations.");
    
  } catch (error) {
    console.error("Error during reset:", error);
    throw error;
  }
}

resetAndMigrate().catch(console.error);
