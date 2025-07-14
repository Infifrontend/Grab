import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSearchRequestSchema, 
  insertBookingSchema, 
  insertFlightBookingSchema, 
  insertPassengerSchema,
  insertBidSchema,
  insertPaymentSchema 
} from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";

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

  // Get unique locations from flights table for autocomplete
  app.get("/api/flight-locations", async (req, res) => {
    try {
      const flights = await storage.getFlights("", "", undefined); // Fetch all flights
      
      // Extract unique locations from origin and destination
      const locations = new Set<string>();
      flights.forEach(flight => {
        locations.add(flight.origin);
        locations.add(flight.destination);
      });

      const uniqueLocations = Array.from(locations).sort();
      res.json({ locations: uniqueLocations });
    } catch (error) {
      console.error("Error fetching flight locations:", error);
      res.status(500).json({ error: "Failed to fetch flight locations" });
    }
  });

  // Search flights
  app.post("/api/search", async (req, res) => {
    try {
      console.log("Search request received:", req.body);
      const searchData = insertSearchRequestSchema.parse(req.body);
      await storage.createSearchRequest(searchData);

      // Search for available flights
      const flights = await storage.getFlights(
        searchData.origin,
        searchData.destination,
        searchData.departureDate
      );

      console.log(`Found ${flights.length} flights for ${searchData.origin} to ${searchData.destination}`);
      console.log("Flight data sample:", flights.slice(0, 2));

      res.json({ flights, message: "Search completed successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Search validation error:", error.errors);
        res.status(400).json({ message: "Invalid search data", errors: error.errors });
      } else {
        console.error("Search error:", error);
        res.status(500).json({ message: "Search failed" });
      }
    }
  });

  // Get flights
  app.get("/api/flights", async (req, res) => {
    try {
      const { origin, destination, departureDate } = req.query;
      const flights = await storage.getFlights(
        origin as string,
        destination as string,
        departureDate ? new Date(departureDate as string) : undefined
      );
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flights" });
    }
  });

  // Create flight booking (quick booking)
  app.post("/api/flight-bookings", async (req, res) => {
    try {
      const { flightId, passengerCount, passengers } = req.body;

      // Get flight details
      const flight = await storage.getFlight(flightId);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }

      // Check availability
      if (flight.availableSeats < passengerCount) {
        return res.status(400).json({ message: "Not enough seats available" });
      }

      // Calculate total amount
      const totalAmount = flight.price * passengerCount;

      // Create booking
      const bookingData = {
        bookingReference: `FB-${new Date().getFullYear()}-${nanoid(6)}`,
        flightId,
        passengerCount,
        totalAmount: totalAmount.toString(),
        bookingStatus: "pending",
        paymentStatus: "pending"
      };

      const booking = await storage.createFlightBooking(bookingData);

      // Add passengers if provided
      if (passengers && passengers.length > 0) {
        for (const passenger of passengers) {
          await storage.createPassenger({
            ...passenger,
            bookingId: booking.id
          });
        }
      }

      // Update flight availability
      await storage.updateFlightSeats(flightId, passengerCount);

      res.json({ 
        booking, 
        flight,
        message: "Booking created successfully" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      } else {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Booking creation failed" });
      }
    }
  });

  // Get flight bookings
  app.get("/api/flight-bookings", async (req, res) => {
    try {
      const { userId } = req.query;
      const bookings = await storage.getFlightBookings(userId ? parseInt(userId as string) : undefined);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flight bookings" });
    }
  });

  // Get flight booking by reference
  app.get("/api/flight-bookings/:reference", async (req, res) => {
    try {
      const { reference } = req.params;
      const booking = await storage.getFlightBookingByReference(reference);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Get passengers for this booking
      const passengers = await storage.getPassengersByBooking(booking.id);

      res.json({ booking, passengers });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Create legacy booking (keep for compatibility)
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

  // Migration endpoint to remove international flights
  app.post("/api/migrate-domestic", async (_req, res) => {
    try {
      await storage.migrateToDomesticFlights();

      res.json({ 
        success: true, 
        message: "Successfully migrated to domestic flights only" 
      });
    } catch (error) {
      console.error('Migration error:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to migrate flights" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}