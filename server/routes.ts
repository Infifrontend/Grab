import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSearchRequestSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all deals
  app.get("/api/deals", async (_req, res) => {
    try {
      const deals = await storage.getDeals();
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  // Get all packages
  app.get("/api/packages", async (req, res) => {
    try {
      const { destination } = req.query;
      const packages = await storage.searchPackages(destination as string);
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  // Get all bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const { userId } = req.query;
      const bookings = await storage.getBookings(userId ? parseInt(userId as string) : undefined);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Create search request
  app.post("/api/search", async (req, res) => {
    try {
      const searchData = insertSearchRequestSchema.parse(req.body);
      await storage.createSearchRequest(searchData);
      
      // For now, return empty results as this would typically call external APIs
      res.json({ results: [], message: "Search completed successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid search data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Search failed" });
      }
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Booking creation failed" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
