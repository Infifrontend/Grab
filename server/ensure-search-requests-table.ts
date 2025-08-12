
import { db } from "./db.js";
import { sql } from "drizzle-orm";

export async function ensureSearchRequestsTable() {
  try {
    console.log("Ensuring search_requests table exists...");
    
    // Create the search_requests table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS search_requests (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        departure_date TIMESTAMP NOT NULL,
        return_date TIMESTAMP,
        passengers INTEGER NOT NULL,
        cabin TEXT NOT NULL,
        trip_type TEXT NOT NULL
      )
    `);
    
    console.log("search_requests table created successfully!");
  } catch (error) {
    console.error("Error creating search_requests table:", error);
    throw error;
  }
}

// Run the function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ensureSearchRequestsTable()
    .then(() => {
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}
