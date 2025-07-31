
import { db } from "./db.js";
import { bids, flights } from "../shared/schema.js";
import { eq, lt, and } from "drizzle-orm";

export async function expireOldBids() {
  console.log("Starting expired bids cleanup...");
  
  try {
    const currentDate = new Date();
    console.log(`Current date: ${currentDate.toISOString()}`);
    
    // Get all active bids with flights that have departed
    const expiredBids = await db
      .select({
        bidId: bids.id,
        bidStatus: bids.bidStatus,
        flightId: bids.flightId,
        departureTime: flights.departureTime,
        notes: bids.notes
      })
      .from(bids)
      .innerJoin(flights, eq(bids.flightId, flights.id))
      .where(
        and(
          lt(flights.departureTime, currentDate), // Flight has departed
          eq(bids.bidStatus, 'active') // Only active bids
        )
      );

    console.log(`Found ${expiredBids.length} expired bids to update`);

    let updatedCount = 0;

    for (const bid of expiredBids) {
      try {
        // Parse existing notes to preserve other data
        let notes = {};
        try {
          notes = bid.notes ? JSON.parse(bid.notes) : {};
        } catch (e) {
          console.log(`Could not parse notes for bid ${bid.bidId}, creating new notes object`);
        }

        // Update notes to include payment status
        const updatedNotes = {
          ...notes,
          paymentInfo: {
            ...notes.paymentInfo || {},
            paymentStatus: 'expired',
            expiredAt: currentDate.toISOString(),
            reason: 'flight_departed'
          }
        };

        // Update the bid status and notes
        await db
          .update(bids)
          .set({
            bidStatus: 'expired',
            notes: JSON.stringify(updatedNotes),
            updatedAt: currentDate
          })
          .where(eq(bids.id, bid.bidId));

        updatedCount++;
        console.log(`Updated bid ${bid.bidId} - flight departed on ${bid.departureTime}`);
        
      } catch (error) {
        console.error(`Error updating bid ${bid.bidId}:`, error);
      }
    }

    console.log(`Expired bids cleanup completed. Updated ${updatedCount} bids.`);
    
    return {
      success: true,
      message: `Successfully expired ${updatedCount} old bids`,
      updatedCount
    };
    
  } catch (error) {
    console.error("Error during expired bids cleanup:", error);
    throw error;
  }
}

// Function to run periodic cleanup (can be called from a cron job or scheduled task)
export async function scheduleExpiredBidsCleanup() {
  try {
    console.log("Running scheduled expired bids cleanup...");
    const result = await expireOldBids();
    console.log("Scheduled cleanup result:", result);
    return result;
  } catch (error) {
    console.error("Scheduled cleanup failed:", error);
    throw error;
  }
}
