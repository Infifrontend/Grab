
import { db } from "./db";
import { sql } from "drizzle-orm";

async function addMinimumBidAmountColumn() {
  try {
    console.log("Adding minimum_bid_amount column to bids table...");
    
    // Add the minimum_bid_amount column
    await db.execute(sql`
      ALTER TABLE bids 
      ADD COLUMN IF NOT EXISTS minimum_bid_amount DECIMAL(10, 2)
    `);
    
    console.log("Successfully added minimum_bid_amount column to bids table");
  } catch (error) {
    console.error("Error adding minimum_bid_amount column:", error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addMinimumBidAmountColumn()
    .then(() => {
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

export { addMinimumBidAmountColumn };
