
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { notifications } from "../shared/schema.js";

const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/groupretail";
const client = postgres(connectionString);
const db = drizzle(client);

async function createNotificationsTable() {
  try {
    console.log("Creating notifications table...");
    
    // Create the notifications table
    await client`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        priority VARCHAR(10) DEFAULT 'medium',
        action_data TEXT,
        created_at VARCHAR NOT NULL,
        updated_at VARCHAR NOT NULL
      )
    `;

    console.log("Notifications table created successfully!");

    // Insert some sample notifications
    const sampleNotifications = [
      {
        type: 'bid_created',
        title: 'New Bid Configuration Available',
        message: 'A new bid opportunity for Economy to Business upgrade on LAX → JFK route is now available.',
        isRead: false,
        priority: 'high',
        actionData: JSON.stringify({ route: 'LAX → JFK', amount: 250 }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        type: 'bid_accepted',
        title: 'Bid Accepted',
        message: 'Your bid for seat upgrade has been accepted! Check your booking details.',
        isRead: false,
        priority: 'high',
        actionData: JSON.stringify({ bidId: 'BID001', amount: 180 }),
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        type: 'payment_received',
        title: 'Payment Confirmation',
        message: 'Payment of ₹15,240 has been successfully processed for your booking.',
        isRead: true,
        priority: 'medium',
        actionData: JSON.stringify({ amount: 15240, bookingId: 'BK123' }),
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: 'Your flight booking has been confirmed. Download your e-tickets from the dashboard.',
        isRead: true,
        priority: 'medium',
        actionData: JSON.stringify({ bookingRef: 'GR789', flightNo: 'GR-1234' }),
        createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        updatedAt: new Date(Date.now() - 10800000).toISOString(),
      }
    ];

    await db.insert(notifications).values(sampleNotifications);
    console.log("Sample notifications inserted successfully!");

  } catch (error) {
    console.error("Error creating notifications table:", error);
  } finally {
    await client.end();
  }
}

createNotificationsTable();
