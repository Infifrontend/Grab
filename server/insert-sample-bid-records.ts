
import { db } from "./db.js";
import { bids, users, flights } from "../shared/schema.js";
import { eq } from "drizzle-orm";

export async function insertSampleBidRecords() {
  try {
    console.log("Starting sample bid records insertion...");

    // Ensure user with ID 1 exists
    const existingUser = await db.select().from(users).where(eq(users.id, 1));
    
    if (existingUser.length === 0) {
      console.log("Creating default user with ID 1...");
      await db.insert(users).values({
        id: 1,
        username: "admin",
        password: "admin123",
        name: "Administrator"
      });
      console.log("Default user created successfully.");
    }

    // Get an existing flight or use flight ID 1
    const existingFlights = await db.select().from(flights).limit(1);
    const flightId = existingFlights.length > 0 ? existingFlights[0].id : 1;

    // Sample bid records data
    const sampleBids = [
      {
        userId: 1,
        flightId: flightId,
        bidAmount: '850.00',
        passengerCount: 2,
        bidStatus: 'rejected',
        validUntil: new Date('2025-08-15T18:30:00.000Z'),
        notes: JSON.stringify({
          title: "Economy Class Bid - New York to Los Angeles",
          flightType: "Domestic",
          origin: "New York",
          destination: "Los Angeles",
          travelDate: "2025-08-15",
          rejectionReason: "Bid amount below minimum threshold",
          rejectedAt: "2025-07-28T10:15:00.000Z",
          configType: "user_bid"
        }),
        createdAt: new Date('2025-07-25T14:20:00.000Z'),
        updatedAt: new Date('2025-07-28T10:15:00.000Z')
      },
      {
        userId: 1,
        flightId: flightId,
        bidAmount: '1200.00',
        passengerCount: 3,
        bidStatus: 'expired',
        validUntil: new Date('2025-07-28T23:59:59.000Z'),
        notes: JSON.stringify({
          title: "Business Class Bid - Miami to London",
          flightType: "International",
          origin: "Miami",
          destination: "London",
          travelDate: "2025-08-20",
          expiredAt: "2025-07-29T00:00:00.000Z",
          originalBidEndTime: "2025-07-28T23:59:59.000Z",
          configType: "user_bid"
        }),
        createdAt: new Date('2025-07-20T09:30:00.000Z'),
        updatedAt: new Date('2025-07-29T00:00:00.000Z')
      }
    ];

    // Insert sample bids
    for (const bid of sampleBids) {
      try {
        const [insertedBid] = await db.insert(bids).values(bid).returning();
        console.log(`Inserted sample bid with status '${bid.bidStatus}':`, {
          id: insertedBid.id,
          bidStatus: insertedBid.bidStatus,
          bidAmount: insertedBid.bidAmount,
          passengerCount: insertedBid.passengerCount
        });
      } catch (error) {
        if (error.message.includes("duplicate key")) {
          console.log(`Sample bid already exists, skipping...`);
        } else {
          console.error(`Error inserting sample bid:`, error.message);
        }
      }
    }

    console.log("Sample bid records insertion completed successfully!");
    return { 
      success: true, 
      message: "Sample bid records with rejected and expired status inserted successfully" 
    };

  } catch (error) {
    console.error("Error inserting sample bid records:", error);
    throw error;
  }
}

// Export for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  insertSampleBidRecords()
    .then(result => {
      console.log("Result:", result);
      process.exit(0);
    })
    .catch(error => {
      console.error("Failed:", error);
      process.exit(1);
    });
}
