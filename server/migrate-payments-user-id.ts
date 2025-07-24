
import { db } from "./db.js";
import { sql } from "drizzle-orm";

export async function migratePaymentsUserId() {
  try {
    console.log("Adding user_id column to payments table...");
    
    // Add user_id column to payments table
    await db.execute(sql`
      ALTER TABLE payments 
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id)
    `);
    
    console.log("Successfully added user_id column to payments table");
  } catch (error) {
    console.error("Error migrating payments table:", error);
    throw error;
  }
}
