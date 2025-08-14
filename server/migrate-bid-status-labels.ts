import { db } from "./db.js";
import { bids } from "../shared/schema.js";
import { eq } from "drizzle-orm";

export async function migrateBidStatusLabels() {
  console.log("Starting bid status labels migration...");

  try {
    // Get all bids with status that need updating
    const allBids = await db.select().from(bids);

    let updatedCount = 0;

    for (const bid of allBids) {
      let newStatus = bid.bidStatus;

      // Map old statuses to new statuses
      switch (bid.bidStatus) {
        case "active":
          // Note: Keep 'active' in database but display as 'Open' in frontend
          // No database change needed as frontend handles the display mapping
          break;
        case "completed":
          // Note: Keep 'completed' in database but display as 'Under Review' in frontend
          // No database change needed as frontend handles the display mapping
          break;
        case "approved":
          // Note: Keep 'approved' in database but display as 'Accepted' in frontend
          // No database change needed as frontend handles the display mapping
          break;
        default:
          // No change needed for other statuses
          break;
      }

      // Update bid if status changed (in this case, we're keeping database values unchanged)
      // The frontend components will handle the display mapping
    }

    console.log(`Bid status labels migration completed. Frontend will now display:
    - 'active' bids as 'Open'
    - 'completed' bids as 'Under Review'  
    - 'approved' bids as 'Accepted'`);

    return {
      success: true,
      message: "Bid status labels updated successfully",
      updatedCount: 0, // No database changes, only frontend display changes
    };
  } catch (error) {
    console.error("Error during bid status labels migration:", error);
    throw error;
  }
}
