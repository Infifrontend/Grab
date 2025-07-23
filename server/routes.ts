
import type { Express } from "express";
import { db } from "./db";
import { 
  flights, 
  bookings, 
  bids, 
  users, 
  passengers, 
  payments, 
  flightBookings,
  bidFlights,
  notifications,
  bundleSelections
} from "../shared/schema";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get all flights with optional filtering
  app.get("/api/flights", async (req, res) => {
    try {
      const { origin, destination, date, passengers } = req.query;
      
      let query = db.select().from(flights);
      
      if (origin || destination || date) {
        const conditions = [];
        if (origin) conditions.push(eq(flights.origin, origin as string));
        if (destination) conditions.push(eq(flights.destination, destination as string));
        if (date) {
          const searchDate = new Date(date as string);
          const nextDay = new Date(searchDate);
          nextDay.setDate(nextDay.getDate() + 1);
          conditions.push(and(
            gte(flights.departureTime, searchDate),
            lte(flights.departureTime, nextDay)
          ));
        }
        query = query.where(and(...conditions));
      }
      
      const results = await query;
      res.json(results);
    } catch (error) {
      console.error("Error fetching flights:", error);
      res.status(500).json({ error: "Failed to fetch flights" });
    }
  });

  // Get bid details by ID
  app.get("/api/bids/:id", async (req, res) => {
    try {
      const bidId = parseInt(req.params.id);
      
      const bidResult = await db
        .select()
        .from(bids)
        .leftJoin(users, eq(bids.userId, users.id))
        .leftJoin(bidFlights, eq(bids.id, bidFlights.bidId))
        .leftJoin(flights, eq(bidFlights.flightId, flights.id))
        .where(eq(bids.id, bidId));

      if (bidResult.length === 0) {
        return res.status(404).json({ error: "Bid not found" });
      }

      const result = bidResult[0];
      res.json({
        bid: result.bids,
        user: result.users,
        flight: result.flights
      });
    } catch (error) {
      console.error("Error fetching bid details:", error);
      res.status(500).json({ error: "Failed to fetch bid details" });
    }
  });

  // Get all bids with optional user filtering
  app.get("/api/bids", async (req, res) => {
    try {
      const { userId } = req.query;
      
      let query = db
        .select()
        .from(bids)
        .leftJoin(users, eq(bids.userId, users.id))
        .orderBy(desc(bids.createdAt));
      
      if (userId) {
        query = query.where(eq(bids.userId, parseInt(userId as string)));
      }
      
      const results = await query;
      res.json(results);
    } catch (error) {
      console.error("Error fetching bids:", error);
      res.status(500).json({ error: "Failed to fetch bids" });
    }
  });

  // Create a new bid
  app.post("/api/bids", async (req, res) => {
    try {
      const {
        userId,
        flightId,
        bidAmount,
        minimumBidAmount,
        passengerCount,
        bidStatus = "active",
        notes,
        validUntil
      } = req.body;

      const newBid = await db.insert(bids).values({
        userId,
        bidAmount: bidAmount.toString(),
        minimumBidAmount: minimumBidAmount?.toString() || bidAmount.toString(),
        passengerCount,
        bidStatus,
        notes,
        validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Link bid to flight if flightId provided
      if (flightId) {
        await db.insert(bidFlights).values({
          bidId: newBid[0].id,
          flightId
        });
      }

      res.json(newBid[0]);
    } catch (error) {
      console.error("Error creating bid:", error);
      res.status(500).json({ error: "Failed to create bid" });
    }
  });

  // Update a bid
  app.put("/api/bids/:id", async (req, res) => {
    try {
      const bidId = parseInt(req.params.id);
      const {
        bidAmount,
        minimumBidAmount,
        passengerCount,
        bidStatus,
        notes,
        validUntil
      } = req.body;

      const updateData: any = {
        updatedAt: new Date()
      };

      if (bidAmount !== undefined) updateData.bidAmount = bidAmount.toString();
      if (minimumBidAmount !== undefined) updateData.minimumBidAmount = minimumBidAmount.toString();
      if (passengerCount !== undefined) updateData.passengerCount = passengerCount;
      if (bidStatus !== undefined) updateData.bidStatus = bidStatus;
      if (notes !== undefined) updateData.notes = notes;
      if (validUntil !== undefined) updateData.validUntil = new Date(validUntil);

      const updatedBid = await db
        .update(bids)
        .set(updateData)
        .where(eq(bids.id, bidId))
        .returning();

      if (updatedBid.length === 0) {
        return res.status(404).json({ error: "Bid not found" });
      }

      res.json(updatedBid[0]);
    } catch (error) {
      console.error("Error updating bid:", error);
      res.status(500).json({ error: "Failed to update bid" });
    }
  });

  // Get all bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const results = await db
        .select()
        .from(bookings)
        .leftJoin(users, eq(bookings.userId, users.id))
        .orderBy(desc(bookings.createdAt));
      
      res.json(results);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      const results = await db.select().from(users);
      res.json(results);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  return app;
}
