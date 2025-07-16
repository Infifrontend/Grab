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

      // Search for outbound flights
      const outboundFlights = await storage.getFlights(
        searchData.origin,
        searchData.destination,
        searchData.departureDate
      );

      let returnFlights = [];
      
      // If it's a round trip, also search for return flights
      if (searchData.tripType === 'roundTrip' && searchData.returnDate) {
        returnFlights = await storage.getReturnFlights(
          searchData.origin,
          searchData.destination,
          searchData.returnDate
        );
        console.log(`Found ${returnFlights.length} return flights for ${searchData.destination} to ${searchData.origin}`);
      }

      console.log(`Found ${outboundFlights.length} outbound flights for ${searchData.origin} to ${searchData.destination}`);
      console.log("Outbound flight data sample:", outboundFlights.slice(0, 2));

      res.json({ 
        flights: outboundFlights,
        returnFlights: returnFlights,
        tripType: searchData.tripType,
        message: "Search completed successfully" 
      });
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
        bookingStatus: "confirmed",
        paymentStatus: "pending",
        flightNumber: flight.flightNumber,
        airlineName: flight.airline,
        arrivalTime: flight.arrivalTime
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

  // Get booking details by ID (for booking details page)
  app.get("/api/booking-details/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Try to find in flight bookings first
      let booking = await storage.getFlightBookingByReference(id);
      let passengers = [];
      let flightData = null;
      let comprehensiveData = null;
      
      if (booking) {
        // Get passengers for this booking
        passengers = await storage.getPassengersByBooking(booking.id);
        
        // Get flight details
        flightData = await storage.getFlight(booking.flightId);
        
        // Parse comprehensive booking data from specialRequests if available
        if (booking.specialRequests) {
          try {
            comprehensiveData = JSON.parse(booking.specialRequests);
          } catch (e) {
            // If parsing fails, ignore and use basic data
          }
        }
        
        return res.json({ 
          booking, 
          passengers, 
          flightData,
          comprehensiveData
        });
      }
      
      // If not found in flight bookings, try legacy bookings
      const legacyBookings = await storage.getBookings();
      const legacyBooking = legacyBookings.find(b => 
        b.id.toString() === id || b.bookingId === id
      );
      
      if (legacyBooking) {
        return res.json({ 
          booking: legacyBooking, 
          passengers: [], 
          flightData: null,
          comprehensiveData: null
        });
      }
      
      res.status(404).json({ message: "Booking not found" });
    } catch (error) {
      console.error("Error fetching booking details:", error);
      res.status(500).json({ message: "Failed to fetch booking details" });
    }
  });

  // Create comprehensive group booking
  app.post("/api/group-bookings", async (req, res) => {
    try {
      const {
        bookingData,
        flightData,
        bundleData,
        selectedServices,
        groupLeaderData,
        paymentData,
        passengerData,
        bookingSummary
      } = req.body;

      console.log("Creating comprehensive group booking:", {
        passengerCount: bookingData?.totalPassengers,
        totalAmount: bookingSummary?.totalAmount,
        paymentMethod: paymentData?.paymentMethod
      });

      // Generate unique booking reference
      const bookingReference = `GB-${new Date().getFullYear()}-${nanoid(8).toUpperCase()}`;

      // Get flight details for the booking
      const flight = await storage.getFlight(flightData?.selectedFlightId || 1);

      // Create main booking record
      const mainBooking = {
        bookingReference,
        flightId: flightData?.selectedFlightId || 1,
        passengerCount: bookingData?.totalPassengers || 1,
        totalAmount: bookingSummary?.totalAmount?.toString() || "0",
        bookingStatus: "confirmed",
        paymentStatus: paymentData?.paymentMethod === "bankTransfer" ? "pending" : "pending",
        specialRequests: `Group Type: ${groupLeaderData?.groupType || 'N/A'}, Services: ${selectedServices?.map(s => s.name).join(', ') || 'None'}`,
        flightNumber: flight?.flightNumber,
        airlineName: flight?.airline,
        arrivalTime: flight?.arrivalTime
      };

      const booking = await storage.createFlightBooking(mainBooking);

      // Add passengers if provided
      if (passengerData && passengerData.length > 0) {
        for (const passenger of passengerData) {
          await storage.createPassenger({
            bookingId: booking.id,
            title: passenger.title || 'Mr',
            firstName: passenger.firstName,
            lastName: passenger.lastName,
            dateOfBirth: new Date(passenger.dateOfBirth),
            nationality: passenger.nationality || 'Indian',
            passportNumber: passenger.passportNumber || null,
            passportExpiry: passenger.passportExpiry ? new Date(passenger.passportExpiry) : null,
            seatPreference: passenger.seatPreference || null,
            mealPreference: passenger.mealPreference || null,
            specialAssistance: passenger.specialAssistance || null
          });
        }
      }

      // Store comprehensive booking data in a separate table for full details
      const comprehensiveBookingData = {
        bookingReference,
        tripDetails: bookingData,
        flightDetails: flightData,
        bundleSelection: bundleData,
        selectedServices: selectedServices || [],
        groupLeaderInfo: groupLeaderData,
        paymentInfo: paymentData,
        pricingSummary: bookingSummary,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };

      // For now, we'll store this as a JSON field in the booking's specialRequests
      // In a production app, you'd want a separate table for this
      await storage.updateBookingDetails(booking.id, {
        specialRequests: JSON.stringify(comprehensiveBookingData)
      });

      res.json({ 
        success: true,
        booking,
        bookingReference,
        message: "Group booking created successfully" 
      });
    } catch (error) {
      console.error("Group booking creation error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to create group booking",
        error: error.message 
      });
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

  // Add return flights for round trip support
  app.post("/api/add-return-flights", async (_req, res) => {
    try {
      const { addReturnFlights } = await import('./add-return-flights');
      await addReturnFlights();

      res.json({ 
        success: true, 
        message: "Return flights added successfully" 
      });
    } catch (error) {
      console.error('Return flights migration error:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to add return flights" 
      });
    }
  });

  // Migrate flight booking columns
  app.post("/api/migrate-flight-booking-columns", async (_req, res) => {
    try {
      const { migrateFlightBookingColumns } = await import('./migrate-flight-booking-columns');
      await migrateFlightBookingColumns();

      res.json({ 
        success: true, 
        message: "Flight booking columns migration completed successfully" 
      });
    } catch (error) {
      console.error('Flight booking columns migration error:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to migrate flight booking columns" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}