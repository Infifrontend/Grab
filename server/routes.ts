import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertSearchRequestSchema,
  insertBookingSchema,
  insertFlightBookingSchema,
  insertPassengerSchema,
  insertBidSchema,
  insertPaymentSchema,
  insertRetailBidSchema,
} from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";
import {
  eq,
  desc,
  and,
  or,
  like,
  sql,
  isNull,
  isNotNull,
  ne,
} from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "./db.js";
import {
  users as usersTable, // Alias users to usersTable to avoid conflict with the variable name 'users'
  grabTUsers,
  grabTBids,
  grabTRetailBids,
  grabTBidPayments,
  flights,
  bookings,
  flightBookings,
  passengers,
  bids,
  payments,
  notifications,
  retailBids,
} from "../shared/schema.js";
import { biddingStorage } from "./bidding-storage.js";

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
      const bookings = await storage.getBookings(
        userId ? parseInt(userId as string) : undefined,
      );
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
      flights.forEach((flight) => {
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

      // Validate the request body
      if (
        !req.body.origin ||
        !req.body.destination ||
        !req.body.departureDate
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: origin, destination, or departureDate",
        });
      }

      // Parse and validate the search data
      const searchData = insertSearchRequestSchema.parse(req.body);
      console.log("Parsed search data:", searchData);

      // Create search request (storage will handle ID generation)
      await storage.createSearchRequest(searchData);

      // Convert date strings to Date objects for database search
      let departureDateObj = searchData.departureDate;
      if (typeof departureDateObj === "string") {
        departureDateObj = new Date(departureDateObj);
      }

      let returnDateObj = null;
      if (searchData.returnDate) {
        returnDateObj =
          typeof searchData.returnDate === "string"
            ? new Date(searchData.returnDate)
            : searchData.returnDate;
      }

      console.log("Searching with dates:", {
        origin: searchData.origin,
        destination: searchData.destination,
        departureDate: departureDateObj,
        returnDate: returnDateObj,
      });

      // Search for outbound flights - pass undefined instead of date for broader search initially
      let outboundFlights = await storage.getFlights(
        searchData.origin,
        searchData.destination,
        undefined, // Search without date filter first to see all available flights
      );

      console.log(
        `Initial flight search found ${outboundFlights.length} flights for route ${searchData.origin} to ${searchData.destination}`,
      );

      // If no flights found for exact route, try case-insensitive search
      if (outboundFlights.length === 0) {
        console.log("Trying case-insensitive search...");
        const allFlights = await storage.getFlights("", "", undefined); // Get all flights
        console.log(`Total flights in database: ${allFlights.length}`);

        // Filter flights manually with case-insensitive matching
        outboundFlights = allFlights.filter(
          (flight) =>
            flight.origin.toLowerCase() === searchData.origin.toLowerCase() &&
            flight.destination.toLowerCase() ===
              searchData.destination.toLowerCase(),
        );

        console.log(
          `Case-insensitive search found ${outboundFlights.length} flights`,
        );

        // If still no flights, show available routes for debugging
        if (outboundFlights.length === 0) {
          const availableRoutes = [
            ...new Set(
              allFlights.map((f) => `${f.origin} -> ${f.destination}`),
            ),
          ];
          console.log(
            "Available routes in database:",
            availableRoutes.slice(0, 10),
          );
        }
      }

      let returnFlights = [];

      // If it's a round trip, also search for return flights
      if (searchData.tripType === "roundTrip" && searchData.returnDate) {
        returnFlights = await storage.getReturnFlights(
          searchData.destination,
          searchData.origin,
          returnDateObj,
        );

        // If no return flights found, try without date filter
        if (returnFlights.length === 0) {
          const allFlights = await storage.getFlights("", "", undefined);
          returnFlights = allFlights.filter(
            (flight) =>
              flight.origin.toLowerCase() ===
                searchData.destination.toLowerCase() &&
              flight.destination.toLowerCase() ===
                searchData.origin.toLowerCase(),
          );
        }

        console.log(
          `Found ${returnFlights.length} return flights for ${searchData.destination} to ${searchData.origin}`,
        );
      }

      console.log(
        `Final result: ${outboundFlights.length} outbound flights for ${searchData.origin} to ${searchData.destination}`,
      );

      if (outboundFlights.length > 0) {
        console.log("Sample flight data:", {
          id: outboundFlights[0].id,
          origin: outboundFlights[0].origin,
          destination: outboundFlights[0].destination,
          price: outboundFlights[0].price,
          departureTime: outboundFlights[0].departureTime,
          airline: outboundFlights[0].airline,
        });
      } else {
        console.log("No flights found. Checking database content...");
        // Debug: Get all flights to see what's available
        const allFlights = await storage.getFlights("", "", undefined);
        console.log(`Total flights in database: ${allFlights.length}`);
        if (allFlights.length > 0) {
          console.log(
            "Available routes:",
            allFlights
              .slice(0, 5)
              .map((f) => `${f.origin} -> ${f.destination}`),
          );
        }
      }

      res.json({
        success: true,
        flights: outboundFlights,
        returnFlights: returnFlights,
        tripType: searchData.tripType,
        searchCriteria: {
          origin: searchData.origin,
          destination: searchData.destination,
          departureDate: searchData.departureDate,
          returnDate: searchData.returnDate,
          passengers: searchData.passengers,
        },
        message: "Search completed successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Search validation error:", error.errors);
        res.status(400).json({
          success: false,
          message: "Invalid search data",
          errors: error.errors,
          details: error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", "),
        });
      } else {
        console.error("Search error:", error);
        res.status(500).json({
          success: false,
          message: "Search failed",
          error: error.message,
        });
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
        departureDate ? new Date(departureDate as string) : undefined,
      );
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flights" });
    }
  });

  // Debug endpoint to check all flights in database
  app.get("/api/debug/flights", async (req, res) => {
    try {
      console.log("Debug: Fetching all flights from database");
      const allFlights = await storage.getFlights();

      const flightSummary = allFlights.map((flight) => ({
        id: flight.id,
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        origin: flight.origin,
        destination: flight.destination,
        departureTime: flight.departureTime,
        price: flight.price,
        availableSeats: flight.availableSeats,
      }));

      const uniqueRoutes = [
        ...new Set(allFlights.map((f) => `${f.origin} → ${f.destination}`)),
      ];

      console.log(
        `Debug: Found ${allFlights.length} total flights in database`,
      );
      console.log(`Debug: Unique routes:`, uniqueRoutes.slice(0, 20));

      res.json({
        success: true,
        totalFlights: allFlights.length,
        uniqueRoutes: uniqueRoutes,
        sampleFlights: flightSummary.slice(0, 10),
        allFlights: flightSummary,
      });
    } catch (error) {
      console.error("Debug flights error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch debug flight data",
        error: error.message,
      });
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
        // PNR will be auto-generated by storage.createFlightBooking
        flightId,
        passengerCount,
        totalAmount: totalAmount.toString(),
        bookingStatus: "pending",
        paymentStatus: "pending",
      };

      const booking = await storage.createFlightBooking(bookingData);

      // Add passengers if provided
      if (passengers && passengers.length > 0) {
        for (const passenger of passengers) {
          await storage.createPassenger({
            ...passenger,
            bookingId: booking.id,
          });
        }
      }

      // Update flight availability
      await storage.updateFlightSeats(flightId, passengerCount);

      res.json({
        booking,
        flight,
        pnr: booking.pnr,
        message: "Booking created successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Invalid booking data", errors: error.errors });
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
      const bookings = await storage.getFlightBookings(
        userId ? parseInt(userId as string) : undefined,
      );
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flight bookings" });
    }
  });

  // Get recent flight bookings (last 5 records)
  app.get("/api/recent-flight-bookings", async (req, res) => {
    try {
      const recentBookings = await storage.getRecentFlightBookings(5);
      res.json(recentBookings);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch recent flight bookings" });
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

  // Get booking overview statistics for dashboard charts
  app.get("/api/booking-overview", async (req, res) => {
    try {
      const flightBookings = await storage.getFlightBookings();

      // Generate monthly booking statistics
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentYear = new Date().getFullYear();

      const monthlyData = monthNames.map((month) => ({
        month,
        bookings: 0,
        revenue: 0,
        passengers: 0,
      }));

      flightBookings.forEach((booking) => {
        if (booking.createdAt) {
          const bookingDate = new Date(booking.createdAt);
          if (bookingDate.getFullYear() === currentYear) {
            const monthIndex = bookingDate.getMonth();
            monthlyData[monthIndex].bookings += 1;
            monthlyData[monthIndex].revenue += parseFloat(
              booking.totalAmount || "0",
            );
            monthlyData[monthIndex].passengers += booking.passengerCount || 0;
          }
        }
      });

      // Add status breakdown
      const statusData = {
        confirmed: flightBookings.filter((b) => b.bookingStatus === "confirmed")
          .length,
        pending: flightBookings.filter((b) => b.bookingStatus === "pending")
          .length,
        cancelled: flightBookings.filter((b) => b.bookingStatus === "cancelled")
          .length,
      };

      res.json({
        monthlyData,
        statusData,
        totalBookings: flightBookings.length,
        totalRevenue: flightBookings.reduce(
          (sum, b) => sum + parseFloat(b.totalAmount || "0"),
          0,
        ),
        totalPassengers: flightBookings.reduce(
          (sum, b) => sum + (b.passengerCount || 0),
          0,
        ),
      });
    } catch (error) {
      console.error("Error fetching booking overview:", error);
      res.status(500).json({ message: "Failed to fetch booking overview" });
    }
  });

  // Get booking details by ID (for booking details page)
  app.get("/api/booking-details/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Fetching booking details for ID: ${id}`);

      let booking = null;
      let passengers = [];
      let flightData = null;
      let comprehensiveData = null;

      // Get all flight bookings for comprehensive search
      const allFlightBookings = await storage.getFlightBookings();
      console.log(
        `Total flight bookings available: ${allFlightBookings.length}`,
      );

      // Try multiple search strategies
      if (!booking) {
        // Strategy 1: Search by PNR (exact match)
        booking = allFlightBookings.find(
          (b) => b.pnr && b.pnr.toUpperCase() === id.toUpperCase(),
        );
        if (booking) console.log("Found booking by PNR exact match");
      }

      if (!booking) {
        // Strategy 2: Search by booking reference (exact match)
        booking = allFlightBookings.find(
          (b) =>
            b.bookingReference &&
            b.bookingReference.toUpperCase() === id.toUpperCase(),
        );
        if (booking)
          console.log("Found booking by booking reference exact match");
      }

      if (!booking) {
        // Strategy 3: Search by ID (numeric)
        booking = allFlightBookings.find((b) => b.id.toString() === id);
        if (booking) console.log("Found booking by numeric ID");
      }

      if (!booking) {
        // Strategy 4: Partial match in PNR or booking reference
        booking = allFlightBookings.find(
          (b) =>
            (b.pnr && b.pnr.toUpperCase().includes(id.toUpperCase())) ||
            (b.bookingReference &&
              b.bookingReference.toUpperCase().includes(id.toUpperCase())),
        );
        if (booking) console.log("Found booking by partial match");
      }

      // If still not found, try legacy bookings
      if (!booking) {
        try {
          const legacyBookings = await storage.getBookings();
          booking = legacyBookings.find(
            (b) => b.id.toString() === id || b.bookingId === id,
          );
          console.log(
            "Found booking in legacy bookings:",
            booking ? "Yes" : "No",
          );

          if (booking) {
            return res.json({
              booking,
              passengers: [],
              flightData: null,
              comprehensiveData: null,
            });
          }
        } catch (error) {
          console.log("Error finding booking in legacy:", error.message);
        }
      }

      if (!booking) {
        console.log(`No booking found for ID: ${id}`);

        // Debug information
        console.log(
          "Available PNRs:",
          allFlightBookings.map((b) => b.pnr).filter(Boolean),
        );
        console.log(
          "Available booking references:",
          allFlightBookings.map((b) => b.bookingReference).filter(Boolean),
        );
        console.log(
          "Available IDs:",
          allFlightBookings.map((b) => b.id),
        );

        return res.status(404).json({
          message: "Booking not found",
          searchedId: id,
          availablePNRs: allFlightBookings.map((b) => b.pnr).filter(Boolean),
          availableReferences: allFlightBookings
            .map((b) => b.bookingReference)
            .filter(Boolean),
        });
      }

      // Get passengers for this booking
      try {
        passengers = await storage.getPassengersByBooking(booking.id);
        console.log(`Found ${passengers.length} passengers for booking`);
      } catch (error) {
        console.log("Error fetching passengers:", error.message);
        passengers = [];
      }

      // Get flight details
      try {
        if (booking.flightId) {
          flightData = await storage.getFlight(booking.flightId);
          console.log("Found flight data:", flightData ? "Yes" : "No");
        }
      } catch (error) {
        console.log("Error fetching flight data:", error.message);
        flightData = null;
      }

      // Parse comprehensive booking data from specialRequests if available
      if (booking.specialRequests) {
        try {
          comprehensiveData = JSON.parse(booking.specialRequests);
          console.log("Parsed comprehensive data successfully");
        } catch (e) {
          console.log("Could not parse comprehensive data:", e.message);
          comprehensiveData = null;
        }
      }

      console.log("Returning booking details successfully");
      return res.json({
        booking,
        passengers,
        flightData,
        comprehensiveData,
      });
    } catch (error) {
      console.error("Error fetching booking details:", error);
      res.status(500).json({ message: "Failed to fetch booking details" });
    }
  });

  // Create comprehensive group booking
  app.post("/api/group-bookings", async (req, res) => {
    try {
      console.log("Received group booking request");

      const {
        bookingData,
        flightData,
        bundleData,
        selectedServices,
        groupLeaderData,
        paymentData,
        passengerData,
        bookingSummary,
      } = req.body;

      // Validate required data
      if (!bookingData && !paymentData) {
        return res.status(400).json({
          success: false,
          message: "Missing required booking data",
        });
      }

      const passengerCount =
        bookingData?.totalPassengers ||
        paymentData?.passengerCount ||
        (passengerData ? passengerData.length : 1);

      const totalAmount =
        bookingSummary?.totalAmount || paymentData?.totalAmount || "0";

      console.log("Creating comprehensive group booking:", {
        passengerCount,
        totalAmount,
        paymentMethod: paymentData?.paymentMethod,
      });

      // Generate unique booking reference
      const bookingReference = `GB-${new Date().getFullYear()}-${nanoid(8).toUpperCase()}`;

      // Determine flight ID safely
      let flightId = 1; // Default fallback
      if (flightData?.outbound?.id) {
        flightId = flightData.outbound.id;
      } else if (flightData?.selectedFlightId) {
        flightId = flightData.selectedFlightId;
      }

      // Create main booking record
      const mainBooking = {
        bookingReference,
        // PNR will be auto-generated by storage.createFlightBooking
        flightId,
        passengerCount,
        totalAmount: totalAmount.toString(),
        bookingStatus: "confirmed",
        paymentStatus:
          paymentData?.paymentMethod === "bankTransfer" ? "pending" : "pending",
        specialRequests: `Group Type: ${groupLeaderData?.groupType || "N/A"}, Services: ${selectedServices?.map((s) => s.name).join(", ") || "None"}`,
      };

      console.log("Creating booking with data:", mainBooking);

      const booking = await storage.createFlightBooking(mainBooking);
      console.log("Booking created successfully:", booking);

      // Add passengers if provided
      if (
        passengerData &&
        Array.isArray(passengerData) &&
        passengerData.length > 0
      ) {
        console.log(`Adding ${passengerData.length} passengers`);
        for (const passenger of passengerData) {
          try {
            await storage.createPassenger({
              bookingId: booking.id,
              title: passenger.title || "Mr",
              firstName: passenger.firstName || "Unknown",
              lastName: passenger.lastName || "Unknown",
              dateOfBirth: passenger.dateOfBirth
                ? new Date(passenger.dateOfBirth)
                : new Date("1990-01-01"),
              nationality: passenger.nationality || "Indian",
              passportNumber: passenger.passportNumber || null,
              passportExpiry: passenger.passportExpiry
                ? new Date(passenger.passportExpiry)
                : null,
              seatPreference: passenger.seatPreference || null,
              mealPreference: passenger.mealPreference || null,
              specialAssistance: passenger.specialAssistance || null,
            });
          } catch (passengerError) {
            console.error("Error creating passenger:", passengerError);
            // Continue with other passengers even if one fails
          }
        }
      }

      // Store comprehensive booking data safely
      try {
        const comprehensiveBookingData = {
          bookingReference,
          tripDetails: bookingData || {},
          flightDetails: flightData || {},
          bundleSelection: bundleData || {},
          selectedServices: selectedServices || [],
          groupLeaderInfo: groupLeaderData || {},
          paymentInfo: paymentData || {},
          pricingSummary: bookingSummary || {},
          createdAt: new Date().toISOString(),
          status: "confirmed",
        };

        await storage.updateBookingDetails(booking.id, {
          specialRequests: JSON.stringify(comprehensiveBookingData),
        });
        console.log("Comprehensive data stored successfully");
      } catch (storageError) {
        console.error("Error storing comprehensive data:", storageError);
        // Don't fail the entire booking for this
      }

      // Store booking details in a way that can be easily retrieved
      console.log("Group booking created successfully:", {
        bookingId: booking.id,
        bookingReference,
        pnr: booking.pnr,
      });

      res.json({
        success: true,
        booking,
        bookingReference,
        pnr: booking.pnr,
        message: "Group booking created successfully",
      });
    } catch (error) {
      console.error("Group booking creation error:", error);

      let errorMessage = "Failed to create group booking";
      if (error.message) {
        errorMessage = `Failed to create group booking: ${error.message}`;
      }

      res.status(500).json({
        success: false,
        message: errorMessage,
        error: error.message || "Unknown error",
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
        res
          .status(400)
          .json({ message: "Invalid booking data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Booking creation failed" });
      }
    }
  });

  // Get bid statistics
  app.get("/api/bids/statistics", async (req, res) => {
    try {
      const { userId } = req.query;
      const stats = await storage.getBidStatistics(
        userId ? parseInt(userId as string) : undefined,
      );
      res.json(stats);
    } catch (error) {
      console.error("Error fetching bid statistics:", error);
      res.status(500).json({ message: "Failed to fetch bid statistics" });
    }
  });

  // Get all bids
  app.get("/api/bids", async (req, res) => {
    try {
      let { userId } = req.query;

      // If userId not in query, check headers (if frontend sends it)
      if (!userId || userId === "undefined" || userId === "null") {
        userId = req.headers["x-user-id"] || req.headers["user-id"];
      }

      // If userId is provided, redirect to the user-specific endpoint for proper status resolution
      if (userId && userId !== "undefined" && userId !== "null") {
        console.log(
          `Redirecting to user-specific bids endpoint for user ${userId}`,
        );
        return res.redirect(`/api/user-bids/${userId}`);
      } else {
        console.log(
          "Fetching all bids with default Open status (no user context)",
        );

        // Default view - fetch ALL bids from grab_t_bids table with default "Open" status
        // Since no user is specified, all bids should show as "Open"
        const bidsQuery = sql`
          SELECT
            gtb.id,
            gtb.bid_amount,
            gtb.valid_until,
            gtb.notes,
            gtb.total_seats_available,
            gtb.min_seats_per_bid,
            gtb.max_seats_per_bid,
            gtb.r_status,
            gtb.created_at,
            gtb.updated_at,
            gms.status_name
          FROM grab_t_bids gtb
          LEFT JOIN grab_m_status gms ON gtb.r_status = gms.id
          ORDER BY gtb.created_at DESC
        `;

        const bidsResults = await db.execute(bidsQuery);

        // Transform the results to match the expected format for active-bids-section
        const transformedBids = bidsResults.rows.map((row: any) => {
          let configData = {};
          try {
            configData = row.notes ? JSON.parse(row.notes) : {};
          } catch (e) {
            configData = {};
          }

          // Map r_status to bidStatus
          let bidStatus = "active"; // Default status
          let statusName = "Open"; // Default status name

          if (row.r_status) {
            switch (row.r_status) {
              case 1: // Active
                bidStatus = "active";
                statusName = "Active";
                break;
              case 2: // Approved
                bidStatus = "approved";
                statusName = "Approved";
                break;
              case 3: // Completed
                bidStatus = "completed";
                statusName = "Completed";
                break;
              case 4: // Open
                bidStatus = "active";
                statusName = "Open";
                break;
              case 5: // Rejected
                bidStatus = "rejected";
                statusName = "Rejected";
                break;
              default:
                bidStatus = "active";
                statusName = row.status_name || "Open";
            }
          }

          // When no user is specified, all bids show as "Open"
          return {
            id: row.id,
            bidAmount: row.bid_amount,
            validUntil: row.valid_until,
            notes: row.notes,
            totalSeatsAvailable: row.total_seats_available,
            minSeatsPerBid: row.min_seats_per_bid,
            maxSeatsPerBid: row.max_seats_per_bid,
            rStatus: row.r_status || 4,
            statusName: statusName,
            bidStatus: bidStatus, // Properly mapped status
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            seatAvailability: {
              paymentStatus: "open",
            },
          };
        });

        console.log(
          `Returning ${transformedBids.length} bids with default Open status`,
        );
        res.json(transformedBids);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
      res.status(500).json({ message: "Failed to fetch bids" });
    }
  });

  // Get bid configurations (formatted for admin display)
  app.get("/api/bid-configurations-list", async (req, res) => {
    try {
      const bids = await storage.getBids(); // Get all bids, don't filter by userId here

      // Filter and format bid configurations (those with configType)
      const bidConfigurations = bids
        .filter((bid) => {
          try {
            const notes = bid.notes ? JSON.parse(bid.notes) : {};
            return notes.configType === "bid_configuration";
          } catch (e) {
            return false;
          }
        })
        .map((bid) => {
          // Ensure proper status mapping
          let bidStatus = "active"; // Default status

          // Map rStatus to bidStatus
          if (bid.rStatus) {
            switch (bid.rStatus) {
              case 1: // Active in grab_m_status
                bidStatus = "active";
                break;
              case 2: // Approved
                bidStatus = "approved";
                break;
              case 3: // Completed
                bidStatus = "completed";
                break;
              case 4: // Open
                bidStatus = "active";
                break;
              case 5: // Rejected
                bidStatus = "rejected";
                break;
              default:
                bidStatus = "active";
            }
          }

          return {
            ...bid,
            bidStatus: bid.bidStatus || bidStatus, // Use existing or mapped status
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first

      res.json(bidConfigurations);
    } catch (error) {
      console.error("Error fetching bid configurations:", error);
      res.status(500).json({ message: "Failed to fetch bid configurations" });
    }
  });

  // Update bid payment status
  app.put("/api/bids/:id/payment-status", async (req, res) => {
    try {
      const { id } = req.params;
      const { bidStatus, paymentStatus, passengerCount, bidAmount } = req.body;

      console.log(
        `Updating bid ${id} payment status to ${paymentStatus}, bid status to ${bidStatus}`,
      );

      // Update the bid with payment information
      const updateData = {
        bidStatus: bidStatus || "completed",
        passengerCount: passengerCount,
        bidAmount: bidAmount?.toString(),
        updatedAt: new Date(),
      };

      // Add payment status to notes with correct status mapping
      const existingBid = await storage.getBidById(parseInt(id));
      let existingNotes = {};

      try {
        existingNotes = existingBid?.bid?.notes
          ? JSON.parse(existingBid.bid.notes)
          : {};
      } catch (e) {
        existingNotes = {};
      }

      // Determine the correct payment status based on the provided paymentStatus
      let finalPaymentStatus = paymentStatus || "Payment Completed";

      // Ensure we're using the correct status values
      if (paymentStatus === "Paid") {
        finalPaymentStatus = "Payment Completed";
      }

      const paymentData = {
        ...existingNotes,
        paymentInfo: {
          paymentStatus: finalPaymentStatus,
          paymentDate: new Date().toISOString(),
          depositPaid: true,
          paymentCompleted: true,
          completedAt: new Date().toISOString(),
        },
      };

      updateData.notes = JSON.stringify(paymentData);

      await storage.updateBidDetails(parseInt(id), updateData);

      // Get the updated bid to return
      const updatedBid = await storage.getBidById(parseInt(id));

      if (!updatedBid) {
        return res.status(404).json({
          success: false,
          message: "Bid not found",
        });
      }

      // Create notification for completed payment
      await createNotification(
        "payment_completed",
        "Payment Completed",
        `Payment for bid ${existingBid.bid.id} has been completed successfully. Amount: ₹${bidAmount}`,
        "high",
        {
          bidId: parseInt(id),
          amount: bidAmount,
          paymentStatus: paymentStatus,
        },
      );

      res.json({
        success: true,
        message: `Bid payment completed successfully`,
        bid: updatedBid,
      });
    } catch (error) {
      console.error("Error updating bid payment status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update bid payment status",
        error: error.message,
      });
    }
  });

  // Update bid status (accept/reject)
  app.put("/api/bids/retail-users/status", async (req, res) => {
    try {
      const { r_bidId, r_userId, p_bid_id, action, adminNotes, counterOffer, rejectionReason } = req.body;

      console.log("Received request body:", req.body);

      if (!r_bidId || !r_userId || !p_bid_id || !action) {
        return res.status(400).json({
          success: false,
          message: "Missing r_bidId, r_userId, p_bid_id or action"
        });
      }

      // Map action to status ID using bidding storage
      let statusId;
      if (action === 9) { // Approve
        statusId = await biddingStorage.getStatusIdByCode("AP"); // Approved
      } else if (action === 7) { // Reject
        statusId = await biddingStorage.getStatusIdByCode("R"); // Rejected
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid action. Must be 7 (rejected) or 9 (approved)."
        });
      }

      if (!statusId) {
        return res.status(500).json({
          success: false,
          message: "Required status not found in database"
        });
      }

      console.log(`Updating retail bid ID=${r_bidId} for user=${r_userId} on parent bid=${p_bid_id} with statusId=${statusId}`);

      // Update retail bid status using the correct retail bid ID
      await db.execute(sql`
        UPDATE grab_t_retail_bids 
        SET r_status = ${statusId}, updated_at = now() 
        WHERE id = ${r_bidId} AND r_user_id = ${r_userId}
      `);

      // If approving, update parent bid to approved and reject other retail bids
      if (action === 9) {
        // Update parent bid to approved
        await storage.updateParentBid(p_bid_id, { rStatus: statusId });

        // Get all retail bids for this parent bid
        const allRetailBids = await storage.getRetailBidsByBid(p_bid_id);
        const rejectedStatusId = await biddingStorage.getStatusIdByCode("R");

        if (rejectedStatusId) {
          // Reject all other retail bids for this parent bid
          for (const retailBid of allRetailBids) {
            if (retailBid.id !== r_bidId) { // Use retail bid ID instead of user ID
              await db.execute(sql`
                UPDATE grab_t_retail_bids 
                SET r_status = ${rejectedStatusId}, updated_at = now() 
                WHERE id = ${retailBid.id}
              `);
            }
          }
        }
      }

      const actionText = action === 9 ? "approved" : "rejected";
      res.json({
        success: true,
        message: `Retail bid ${r_bidId} for user ${r_userId} on parent bid ${p_bid_id} ${actionText} successfully`
      });

    } catch (error) {
      console.error("Error updating retail bid status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update bid status",
        error: error.message
      });
    }
  });

  // Update bid configuration status (toggle on/off)
  app.put("/api/bid-configurations/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log(`Updating bid configuration ${id} status to ${status}`);

      // Update the bid status in the database
      await storage.updateBidStatus(parseInt(id), status);

      // Get the updated bid to return
      const updatedBid = await storage.getBidById(parseInt(id));

      if (!updatedBid) {
        return res.status(404).json({
          success: false,
          message: "Bid configuration not found",
        });
      }

      res.json({
        success: true,
        message: `Bid configuration ${status === "active" ? "activated" : "deactivated"} successfully`,
        bid: updatedBid,
      });
    } catch (error) {
      console.error("Error updating bid configuration status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update bid configuration status",
        error: error.message,
      });
    }
  });

  // Update bid configuration
  app.put("/api/bid-configurations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const {
        bidTitle,
        flightType,
        origin,
        destination,
        totalSeatsAvailable,
        minSeatsPerBid,
        maxSeatsPerBid,
        maxSeatsPerUser,
        fareType,
        baggageAllowance,
        cancellationTerms,
        mealIncluded,
        otherNotes,
        bidAmount,
      } = req.body;

      console.log(`Updating bid configuration ${id}:`, req.body);

      // Get existing bid configuration
      const existingBid = await storage.getBidById(parseInt(id));

      if (!existingBid) {
        return res.status(404).json({
          success: false,
          message: "Bid configuration not found",
        });
      }

      // Parse existing notes to preserve other data
      let existingConfigData = {};
      try {
        existingConfigData = existingBid.bid.notes
          ? JSON.parse(existingBid.bid.notes)
          : {};
      } catch (e) {
        console.warn("Could not parse existing notes, using empty object");
      }

      // Create updated configuration data
      const updatedConfigurationData = {
        ...existingConfigData,
        title: bidTitle || existingConfigData.title,
        flightType: flightType || existingConfigData.flightType || "Domestic",
        origin: origin || existingConfigData.origin,
        destination: destination || existingConfigData.destination,
        totalSeatsAvailable:
          totalSeatsAvailable !== undefined
            ? totalSeatsAvailable
            : existingConfigData.totalSeatsAvailable || 50,
        minSeatsPerBid:
          minSeatsPerBid !== undefined
            ? minSeatsPerBid
            : existingConfigData.minSeatsPerBid || 1,
        maxSeatsPerBid:
          maxSeatsPerBid !== undefined
            ? maxSeatsPerBid
            : existingConfigData.maxSeatsPerBid || 10,
        maxSeatsPerUser:
          maxSeatsPerUser !== undefined
            ? maxSeatsPerUser
            : existingConfigData.maxSeatsPerUser || 5,
        fareType: fareType || existingConfigData.fareType || "Economy",
        baggageAllowance:
          baggageAllowance !== undefined
            ? baggageAllowance
            : existingConfigData.baggageAllowance || 20,
        cancellationTerms:
          cancellationTerms !== undefined
            ? cancellationTerms
            : existingConfigData.cancellationTerms || "Standard",
        mealIncluded:
          mealIncluded !== undefined
            ? mealIncluded
            : existingConfigData.mealIncluded || false,
        otherNotes:
          otherNotes !== undefined
            ? otherNotes
            : existingConfigData.otherNotes || "",
        updatedAt: new Date().toISOString(),
        configType: "bid_configuration", // Ensure this remains set
      };

      console.log("Updated configuration data:", updatedConfigurationData);

      // Update the bid configuration
      const updatedBid = await storage.updateBidDetails(parseInt(id), {
        notes: JSON.stringify(updatedConfigurationData),
        passengerCount: updatedConfigurationData.minSeatsPerBid,
        bidAmount:
          bidAmount !== undefined
            ? bidAmount.toString()
            : existingBid.bid.bidAmount,
        totalSeatsAvailable: updatedConfigurationData.totalSeatsAvailable,
        minSeatsPerBid: updatedConfigurationData.minSeatsPerBid,
        maxSeatsPerBid: updatedConfigurationData.maxSeatsPerBid,
        updatedAt: new Date(),
      });

      console.log("Bid updated successfully:", updatedBid);

      res.json({
        success: true,
        message: "Bid configuration updated successfully",
        bid: updatedBid,
        configData: updatedConfigurationData,
      });
    } catch (error) {
      console.error("Error updating bid configuration:", error);

      let errorMessage = "Failed to update bid configuration";
      if (error.message) {
        if (error.message.includes("UNIQUE constraint")) {
          errorMessage =
            "A bid configuration with these details already exists";
        } else if (error.message.includes("NOT NULL constraint")) {
          errorMessage = "Missing required information for bid configuration";
        } else if (error.message.includes("FOREIGN KEY constraint")) {
          errorMessage = "Invalid flight or user reference";
        } else {
          errorMessage = `Failed to update bid configuration: ${error.message}`;
        }
      }

      res.status(500).json({
        success: false,
        message: errorMessage,
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  });

  // Get single bid configuration
  app.get("/api/bid-configurations/:id", async (req, res) => {
    try {
      const { id } = req.params;

      console.log(`Fetching bid configuration ${id}`);

      const bid = await storage.getBidById(parseInt(id));

      if (!bid) {
        return res.status(404).json({
          success: false,
          message: "Bid configuration not found",
        });
      }

      res.json({
        success: true,
        bid,
      });
    } catch (error) {
      console.error("Error fetching bid configuration:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bid configuration",
        error: error.message,
      });
    }
  });

  // Create a new bid
  app.post("/api/bids", async (req, res) => {
    try {
      const bidData = insertBidSchema.parse(req.body);
      const bid = await storage.createBid(bidData);
      res.json(bid);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Invalid bid data", errors: error.errors });
      } else {
        console.error("Bid creation error:", error);
        res.status(500).json({ message: "Bid creation failed" });
      }
    }
  });

  // Debug endpoint to check all bids and complete flow
  app.get("/api/debug/bids", async (req, res) => {
    try {
      // Get admin bids from grab_t_bids
      const adminBidsQuery = sql`
        SELECT
          gtb.*,
          gms.status_name
        FROM grab_t_bids gtb
        LEFT JOIN grab_m_status gms ON gtb.r_status = gms.id
        ORDER BY gtb.id DESC
      `;
      const adminBidsResults = await db.execute(adminBidsQuery);

      // Get retail bids from grab_t_retail_bids
      const retailBidsQuery = sql`
        SELECT
          grb.*,
          gtu.name as user_name,
          gms.status_name as retail_status_name
        FROM grab_t_retail_bids grb
        LEFT JOIN grab_t_users gtu ON grb.r_user_id = gtu.id
        LEFT JOIN grab_m_status gms ON grb.r_status = gms.id
        ORDER BY grb.id DESC
      `;
      const retailBidsResults = await db.execute(retailBidsQuery);

      // Get payments from grab_t_bid_payments
      const paymentsQuery = sql`
        SELECT
          gbp.*,
          gtu.name as user_name,
          gms.status_name as payment_status_name
        FROM grab_t_bid_payments gbp
        LEFT JOIN grab_t_users gtu ON gbp.r_user_id = gtu.id
        LEFT JOIN grab_m_status gms ON gbp.r_status = gms.id
        LEFT JOIN grab_t_retail_bids grb ON gbp.r_retail_bid_id = grb.id
        ORDER BY gbp.id DESC
      `;
      const paymentsResults = await db.execute(paymentsQuery);

      // Get statuses from grab_m_status
      const statusQuery = sql`SELECT * FROM grab_m_status ORDER BY id ASC`;
      const statusResults = await db.execute(statusQuery);

      // Get users from grab_t_users
      const usersQuery = sql`SELECT id, username, name, email, is_retail_allowed FROM grab_t_users ORDER BY id DESC`;
      const usersResults = await db.execute(usersQuery);

      res.json({
        success: true,
        statuses: statusResults,
        users: usersResults,
        adminBids: adminBidsResults,
        retailBids: retailBidsResults,
        payments: paymentsResults,
        summary: {
          totalStatuses: statusResults.length,
          totalUsers: usersResults.length,
          totalAdminBids: adminBidsResults.length,
          totalRetailBids: retailBidsResults.length,
          totalPayments: paymentsResults.length,
        },
        flow: {
          description:
            "Complete flow: 1) Admin creates bid in grab_t_bids with r_status=4 (Open), 2) Retail user creates bid in grab_t_retail_bids, 3) Payment created in grab_t_bid_payments, 4) Status updates via r_status FK references",
        },
      });
    } catch (error) {
      console.error("Error in debug endpoint:", error);
      res.status(500).json({
        success: false,
        message: "Debug endpoint failed",
        error: error.message,
      });
    }
  });

  // Get bid details by ID from grab_t_bids table
  app.get("/api/bids/:bidId", async (req, res) => {
    try {
      const { bidId } = req.params;
      const { userId } = req.query;

      console.log(`Fetching bid details for ID: ${bidId}, user ID: ${userId}`);

      if (!bidId || isNaN(parseInt(bidId))) {
        return res.status(400).json({
          success: false,
          message: `Invalid bid ID: ${bidId}`,
        });
      }

      // Get bid from grab_t_bids with status
      const bidQuery = sql`
        SELECT
          gtb.*,
          gms.status_name as status_name
        FROM grab_t_bids gtb
        LEFT JOIN grab_m_status gms ON gtb.r_status = gms.id
        WHERE gtb.id = ${parseInt(bidId)}
      `;

      const bidResults = await db.execute(bidQuery);

      if (!bidResults || !bidResults.rows || bidResults.rows.length === 0) {
        // Debug: Show available bids
        const allBidsQuery = sql`SELECT id FROM grab_t_bids ORDER BY id`;
        const allBidsResults = await db.execute(allBidsQuery);
        const availableIds = allBidsResults.rows
          ? allBidsResults.rows.map((row: any) => row.id)
          : [];

        console.log(`Bid not found with ID: ${bidId}`);
        console.log(`Total bids in grab_t_bids: ${availableIds.length}`);
        console.log(`Available bid IDs: [${availableIds.join(", ")}]`);

        return res.status(404).json({
          success: false,
          message: `Bid not found with ID: ${bidId}`,
          availableIds: availableIds,
        });
      }

      const bid = bidResults.rows[0];

      // Get retail bids for this bid with user and status info
      const retailBidsQuery = sql`
        SELECT
          grb.*,
          gtu.name as user_name,
          gtu.email as user_email,
          gms.status_name as retail_status_name
        FROM grab_t_retail_bids grb
        LEFT JOIN grab_t_users gtu ON grb.r_user_id = gtu.id
        LEFT JOIN grab_m_status gms ON grb.r_status = gms.id
        WHERE grb.r_bid_id = ${parseInt(bidId)}
        ORDER BY grb.created_at DESC
      `;

      const retailBidsResults = await db.execute(retailBidsQuery);
      const retailBids = retailBidsResults.rows || [];

      // Get payments for this bid
      const paymentsQuery = sql`
        SELECT
          gbp.*,
          gtu.name as user_name,
          gms.status_name as payment_status_name
        FROM grab_t_bid_payments gbp
        LEFT JOIN grab_t_users gtu ON gbp.r_user_id = gtu.id
        LEFT JOIN grab_m_status gms ON gbp.r_status = gms.id
        LEFT JOIN grab_t_retail_bids grb ON gbp.r_retail_bid_id = grb.id
        WHERE grb.r_bid_id = ${parseInt(bidId)}
        ORDER BY gbp.created_at DESC
      `;

      const paymentsResults = await db.execute(paymentsQuery);
      const payments = paymentsResults.rows || [];

      // Check if user has payment for this bid
      let seatAvailability = null;
      if (userId) {
        const userPayment = payments.find(
          (p) => p.r_user_id === parseInt(userId as string),
        );
        if (userPayment) {
          seatAvailability = {
            paymentStatus: userPayment.payment_status_name || "pending",
            paymentDate: userPayment.created_at,
            amount: userPayment.amount,
          };
        }
      }

      // Format the response to match the expected structure
      const formattedBid = {
        success: true,
        bid: {
          id: bid.id,
          bidAmount: bid.bid_amount,
          validUntil: bid.valid_until,
          notes: bid.notes,
          totalSeatsAvailable: bid.total_seats_available,
          minSeatsPerBid: bid.min_seats_per_bid,
          maxSeatsPerBid: bid.max_seats_per_bid,
          rStatus: bid.r_status,
          createdAt: bid.created_at,
          updatedAt: bid.updated_at,
          seatAvailability: seatAvailability,
          retailBids: retailBids.map((rb) => ({
            id: rb.id,
            rUserId: rb.r_user_id,
            submittedAmount: rb.submitted_amount,
            seatBooked: rb.seat_booked,
            rStatus: rb.r_status,
            userName: rb.user_name,
            userEmail: rb.user_email,
            retailStatusName: rb.retail_status_name,
            createdAt: rb.created_at,
          })),
          payments: payments,
        },
      };

      console.log(`Successfully retrieved bid ${bidId} details.`);
      res.json(formattedBid);
    } catch (error) {
      console.error("Error fetching bid details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bid details",
        error: error.message,
      });
    }
  });

  // Create bid configuration
  app.post("/api/bid-configurations", async (req: Request, res: Response) => {
    try {
      console.log("Received bid configuration data:", req.body);

      const {
        bidTitle,
        flightType,
        origin,
        destination,
        travelDate,
        departureTimeRange,
        totalSeatsAvailable,
        minSeatsPerBid,
        maxSeatsPerBid,
        maxSeatsPerUser,
        bidStartTime,
        bidEndTime,
        autoAwardTopBidder,
        manualReviewOption,
        autoRefundNonWinners,
        fareType,
        baggageAllowance,
        cancellationTerms,
        mealIncluded,
        otherNotes,
        bidAmount,
      } = req.body;

      // Validate required fields
      if (!bidTitle || !origin || !destination) {
        return res.status(400).json({
          success: false,
          message: "Bid title, origin, and destination are required fields",
        });
      }

      // Validate bid amount
      const validBidAmount = bidAmount && bidAmount >= 100 ? bidAmount : 1000; // Default to 1000 if not provided or invalid

      // Allow submission without required field validation

      // Find or create a flight that matches the route
      let flightId = 1; // Default fallback
      try {
        // First try to find an existing flight
        const flights = await storage.getFlights(
          origin,
          destination,
          new Date(travelDate),
        );

        if (flights.length > 0) {
          flightId = flights[0].id;
          console.log(`Found existing flight with ID: ${flightId}`);
        } else {
          // Create a new flight for this route if none exists
          console.log(
            `No flights found for route ${origin} to ${destination}, creating new flight`,
          );

          const newFlight = await storage.createFlight({
            flightNumber: `BC${Math.floor(1000 + Math.random() * 9000)}`,
            airline: "Bid Configuration Flight",
            aircraft: "Configuration",
            origin: origin,
            destination: destination,
            departureTime: new Date(travelDate),
            arrivalTime: new Date(
              new Date(travelDate).getTime() + 2 * 60 * 60 * 1000,
            ), // +2 hours
            duration: "2h 0m",
            price: "0",
            availableSeats: totalSeatsAvailable || 50,
            totalSeats: totalSeatsAvailable || 50,
            cabin: "economy",
            stops: 0,
          });

          flightId = newFlight.id;
          console.log(`Created new flight with ID: ${flightId}`);
        }
      } catch (flightError) {
        console.error("Error handling flight:", flightError);
        // Continue with default flight ID
      }

      // Parse dates properly
      let validUntilDate;
      try {
        validUntilDate = new Date(bidEndTime);
        if (isNaN(validUntilDate.getTime())) {
          throw new Error("Invalid bid end time");
        }
      } catch (dateError) {
        console.error("Date parsing error:", dateError);
        return res.status(400).json({
          success: false,
          message: "Invalid date format for bid end time",
        });
      }

      // Create comprehensive configuration data
      const configurationData = {
        title: bidTitle,
        flightType: flightType || "Domestic",
        origin,
        destination,
        travelDate,
        departureTimeRange,
        totalSeatsAvailable: totalSeatsAvailable || 50,
        minSeatsPerBid: minSeatsPerBid || 1,
        maxSeatsPerBid: maxSeatsPerBid || 10,
        maxSeatsPerUser: maxSeatsPerUser || 5,
        bidStartTime,
        bidEndTime,
        autoAwardTopBidder: autoAwardTopBidder || false,
        manualReviewOption: manualReviewOption || false,
        autoRefundNonWinners: autoRefundNonWinners || false,
        fareType: fareType || "Economy",
        baggageAllowance: baggageAllowance || 20,
        cancellationTerms: cancellationTerms || "Standard",
        mealIncluded: mealIncluded || false,
        otherNotes: otherNotes || "",
        configType: "bid_configuration",
        createdAt: new Date().toISOString(),
        status: "active",
      };

      // Create bid configuration record with seat values in dedicated columns
      const bidData = {
        bidAmount: validBidAmount.toString(), // Use the validated bid amount
        validUntil: validUntilDate,
        totalSeatsAvailable: totalSeatsAvailable || 50,
        minSeatsPerBid: minSeatsPerBid || 1,
        maxSeatsPerBid: maxSeatsPerBid || 10,
        rStatus: 4, // Set r_status to 4 for admin-created bids (Open)
        notes: JSON.stringify(configurationData),
      };

      console.log("Creating bid configuration with data:", bidData);

      // Insert into grab_t_bids table with proper column mapping
      const mappedBidData = {
        bidAmount: bidData.bidAmount,
        validUntil: bidData.validUntil,
        totalSeatsAvailable: bidData.totalSeatsAvailable,
        minSeatsPerBid: bidData.minSeatsPerBid,
        maxSeatsPerBid: bidData.maxSeatsPerBid,
        rStatus: bidData.rStatus,
        notes: bidData.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [bidConfig] = await db
        .insert(grabTBids)
        .values(mappedBidData)
        .returning();

      console.log("Bid configuration created successfully:", bidConfig);

      // Create notification for new bid configuration
      await createNotification(
        "bid_created",
        "New Bid Configuration Created",
        `A new bid configuration "${bidTitle}" for route ${origin} → ${destination} has been created with base amount ₹${validBidAmount}.`,
        "medium",
        {
          bidId: bidConfig.id,
          bidTitle,
          route: `${origin} → ${destination}`,
          amount: validBidAmount,
        },
      );

      res.json({
        success: true,
        bidConfiguration: bidConfig,
        message: `Bid configuration "${bidTitle}" created successfully`,
      });
    } catch (error) {
      console.error("Error creating bid configuration:", error);

      let errorMessage = "Failed to create bid configuration";

      if (error.message) {
        if (error.message.includes("UNIQUE constraint")) {
          errorMessage =
            "A bid configuration with these details already exists";
        } else if (error.message.includes("NOT NULL constraint")) {
          errorMessage = "Missing required information for bid configuration";
        } else if (error.message.includes("FOREIGN KEY constraint")) {
          errorMessage = "Invalid flight or user reference";
        } else {
          errorMessage = `Failed to create bid configuration: ${error.message}`;
        }
      }

      res.status(500).json({
        success: false,
        message: errorMessage,
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  });

  // Migration endpoint to remove international flights
  app.post("/api/migrate-domestic", async (_req, res) => {
    try {
      await storage.migrateToDomesticFlights();

      res.json({
        success: true,
        message: "Successfully migrated to domestic flights only",
      });
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to migrate flights",
      });
    }
  });

  // Add return flights for round trip support
  app.post("/api/add-return-flights", async (_req, res) => {
    try {
      const { addReturnFlights } = await import("./add-return-flights");
      await addReturnFlights();

      res.json({
        success: true,
        message: "Return flights added successfully",
      });
    } catch (error) {
      console.error("Return flights migration error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to add return flights",
      });
    }
  });

  // Seed payment data
  app.post("/api/seed-payment-data", async (_req, res) => {
    try {
      await storage.seedPaymentData();
      res.json({
        success: true,
        message: "Payment data seeded successfully",
      });
    } catch (error) {
      console.error("Payment data seeding error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to seed payment data",
      });
    }
  });

  // Migrate payments table to add user_id column
  app.post("/api/migrate-payments-user-id", async (_req, res) => {
    try {
      const { migratePaymentsUserId } = await import(
        "./migrate-payments-user-id"
      );
      await migratePaymentsUserId();
      res.json({
        success: true,
        message: "Payments table migrated successfully",
      });
    } catch (error) {
      console.error("Payments migration error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to migrate payments table",
      });
    }
  });

  // Migrate payments table to add payment_reference column
  app.post("/api/migrate-payment-reference", async (_req, res) => {
    try {
      const { migratePaymentReference } = await import(
        "./migrate-payment-reference"
      );
      await migratePaymentReference();
      res.json({
        success: true,
        message: "Payment reference column added successfully",
      });
    } catch (error) {
      console.error("Payment reference migration error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to migrate payment reference column",
      });
    }
  });

  // Fix database sequences
  app.post("/api/fix-database-sequences", async (_req, res) => {
    try {
      await storage.fixDatabaseSequences();
      res.json({
        success: true,
        message: "Database sequences fixed successfully",
      });
    } catch (error) {
      console.error("Database sequences fix error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fix database sequences",
      });
    }
  });

  // Migrate bid status labels
  app.post("/api/migrate-bid-status-labels", async (_req, res) => {
    try {
      const { migrateBidStatusLabels } = await import(
        "./migrate-bid-status-labels"
      );
      const result = await migrateBidStatusLabels();
      res.json(result);
    } catch (error) {
      console.error("Bid status labels migration error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to migrate bid status labels",
      });
    }
  });

  // Update booking details (group leader info)
  app.put("/api/booking-details/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { groupLeaderName, groupLeaderEmail, groupLeaderPhone } = req.body;

      console.log(`Updating group leader info for booking: ${id}`);
      console.log("Group leader data:", {
        groupLeaderName,
        groupLeaderEmail,
        groupLeaderPhone,
      });

      // Find the booking using multiple strategies
      let booking = null;

      // Strategy 1: Search by PNR
      try {
        booking = await storage.getFlightBookingByPNR(id);
        if (booking) console.log("Found booking by PNR");
      } catch (error) {
        console.log("Error finding by PNR:", error.message);
      }

      // Strategy 2: Search by booking reference
      if (!booking) {
        try {
          booking = await storage.getFlightBookingByReference(id);
          if (booking) console.log("Found booking by reference");
        } catch (error) {
          console.log("Error finding by reference:", error.message);
        }
      }

      // Strategy 3: Search by ID
      if (!booking) {
        try {
          const allFlightBookings = await storage.getFlightBookings();
          booking = allFlightBookings.find((b) => b.id.toString() === id);
          if (booking) console.log("Found booking by ID");
        } catch (error) {
          console.log("Error finding by ID:", error.message);
        }
      }

      if (!booking) {
        console.log(`Booking not found for ID: ${id}`);
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      console.log(`Found booking with ID: ${booking.id}`);

      // Parse existing comprehensive data if available
      let comprehensiveData = {};
      if (booking.specialRequests) {
        try {
          comprehensiveData = JSON.parse(booking.specialRequests);
        } catch (e) {
          console.log(
            "Could not parse existing special requests, using empty object",
          );
          comprehensiveData = {};
        }
      }

      // Update group leader information
      comprehensiveData.groupLeaderInfo = {
        ...comprehensiveData.groupLeaderInfo,
        name: groupLeaderName || "",
        email: groupLeaderEmail || "",
        phone: groupLeaderPhone || "",
        updatedAt: new Date().toISOString(),
      };

      console.log("Updated comprehensive data:", comprehensiveData);

      // Save back to database
      await storage.updateBookingDetails(booking.id, {
        specialRequests: JSON.stringify(comprehensiveData),
      });

      console.log("Group leader information updated successfully");

      res.json({
        success: true,
        message: "Group leader information updated successfully",
      });
    } catch (error) {
      console.error("Error updating booking details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update booking details",
        error: error.message,
      });
    }
  });

  // Update passengers for a booking
  app.put("/api/booking-passengers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { passengers } = req.body;

      console.log(`Updating passengers for booking: ${id}`);
      console.log(`Passenger data received:`, passengers);

      // Validate input
      if (!passengers || !Array.isArray(passengers)) {
        return res.status(400).json({
          success: false,
          message: "Invalid passenger data provided",
        });
      }

      // Find the booking by ID, reference, or PNR
      let booking = null;

      // Try by booking reference first
      try {
        booking = await storage.getFlightBookingByReference(id);
        console.log("Found booking by reference:", booking ? "Yes" : "No");
      } catch (error) {
        console.log("Error finding booking by reference:", error.message);
      }

      // If not found by reference, try by PNR
      if (!booking) {
        try {
          booking = await storage.getFlightBookingByPNR(id);
          console.log("Found booking by PNR:", booking ? "Yes" : "No");
        } catch (error) {
          console.log("Error finding booking by PNR:", error.message);
        }
      }

      // If not found by PNR, try by numeric ID
      if (!booking) {
        try {
          const allFlightBookings = await storage.getFlightBookings();
          booking = allFlightBookings.find((b) => b.id.toString() === id);
          console.log("Found booking by numeric ID:", booking ? "Yes" : "No");
        } catch (error) {
          console.log("Error finding booking by numeric ID:", error.message);
        }
      }

      if (!booking) {
        console.log(`Booking not found for ID: ${id}`);

        // Debug: Show what bookings actually exist
        try {
          const allBookings = await storage.getFlightBookings();
          console.log(
            `Available bookings:`,
            allBookings.map((b) => ({
              id: b.id,
              reference: b.bookingReference,
              pnr: b.pnr,
            })),
          );
        } catch (debugError) {
          console.log(
            "Could not fetch bookings for debug:",
            debugError.message,
          );
        }

        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      console.log(`Found booking with ID: ${booking.id}`);

      // Get existing passengers using direct database query
      const existingPassengers = await db
        .select()
        .from(passengers)
        .where(eq(passengers.bookingId, booking.id));

      console.log(`Found ${existingPassengers.length} existing passengers`);

      // Update existing passengers or create new ones
      for (let i = 0; i < passengers.length; i++) {
        const passengerData = passengers[i];

        // Skip empty passenger entries
        if (!passengerData.firstName && !passengerData.lastName) {
          continue;
        }

        const passengerInfo = {
          title: passengerData.title || "Mr",
          firstName: passengerData.firstName || "",
          lastName: passengerData.lastName || "",
          dateOfBirth: passengerData.dateOfBirth
            ? new Date(passengerData.dateOfBirth)
            : new Date("1990-01-01"),
          nationality: passengerData.nationality || "Indian",
          passportNumber: passengerData.passportNumber || null,
          passportExpiry: passengerData.passportExpiry
            ? new Date(passengerData.passportExpiry)
            : null,
          seatPreference: passengerData.seatPreference || null,
          mealPreference: passengerData.mealPreference || null,
          specialAssistance: passengerData.specialRequests || null,
        };

        if (existingPassengers[i]) {
          // Update existing passenger using direct database query
          console.log(`Updating existing passenger ${i + 1}`);
          await db
            .update(passengers)
            .set(passengerInfo)
            .where(eq(passengers.id, existingPassengers[i].id));
        } else {
          // Create new passenger using direct database query
          console.log(`Creating new passenger ${i + 1}`);
          await db.insert(passengers).values({
            bookingId: booking.id,
            ...passengerInfo,
          });
        }
      }

      // Remove excess passengers if the new list is shorter
      if (existingPassengers.length > passengers.length) {
        console.log(
          `Removing ${existingPassengers.length - passengers.length} excess passengers`,
        );
        for (let i = passengers.length; i < existingPassengers.length; i++) {
          await db
            .delete(passengers)
            .where(eq(passengers.id, existingPassengers[i].id));
        }
      }

      // Update the booking's passenger count to match the actual number of passengers
      const validPassengerCount = passengers.filter(
        (p) => p.firstName || p.lastName,
      ).length;

      await db
        .update(flightBookings)
        .set({
          passengerCount: validPassengerCount,
          updatedAt: new Date(),
        })
        .where(eq(flightBookings.id, booking.id));

      console.log(`Successfully updated passengers for booking ${id}`);

      res.json({
        success: true,
        message: "Passengers updated successfully",
        passengerCount: validPassengerCount,
      });
    } catch (error) {
      console.error("Error updating passengers:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update passengers",
        error: error.message,
      });
    }
  });

  // Get payment statistics
  app.get("/api/payments/statistics", async (req, res) => {
    try {
      const { userId } = req.query;
      const stats = await storage.getPaymentStatistics(
        userId ? parseInt(userId as string) : undefined,
      );
      res.json(stats);
    } catch (error) {
      console.error("Error fetching payment statistics:", error);
      res.status(500).json({ message: "Failed to fetch payment statistics" });
    }
  });

  // Get all payments
  app.get("/api/payments", async (req, res) => {
    try {
      const { userId, bidId } = req.query;
      let payments = [];

      if (bidId) {
        // Fetch payments by bid ID - check multiple ways payments might be linked to bids
        console.log(`Fetching payments for bid ID: ${bidId}`);

        try {
          // First, try to get payments directly linked to the bid
          const directPayments = await storage.getPaymentsByBidId(
            parseInt(bidId as string),
          );
          payments = [...directPayments];

          // Also check for payments that might be linked through booking references
          const allPayments = await storage.getPayments();
          const bidRelatedPayments = allPayments.filter((payment) => {
            return (
              payment.bookingId && payment.bookingId.includes(bidId as string)
            );
          });

          // Merge and deduplicate
          const existingIds = new Set(payments.map((p) => p.id));
          bidRelatedPayments.forEach((payment) => {
            if (!existingIds.has(payment.id)) {
              payments.push(payment);
            }
          });

          console.log(`Found ${payments.length} payments for bid ${bidId}`);
        } catch (error) {
          console.log(
            `Error fetching payments for bid ${bidId}:`,
            error.message,
          );
          payments = [];
        }
      } else if (userId) {
        payments = await storage.getPayments(parseInt(userId as string));
      } else {
        payments = await storage.getPayments();
      }

      // Enhance payment data with bid information
      const enhancedPayments = await Promise.all(
        payments.map(async (payment: any) => {
          try {
            // Try to find related bid information
            const allBids = await storage.getBids();
            let relatedBid = null;

            if (bidId) {
              // If we're querying for a specific bid, find that bid
              relatedBid = allBids.find((bid) => bid.id.toString() === bidId);
            } else {
              // Otherwise, try to match payment to any bid
              relatedBid = allBids.find((bid) => {
                return (
                  bid.id.toString() === payment.bidId ||
                  payment.key === bid.id.toString() ||
                  (payment.bookingId &&
                    payment.bookingId.includes(bid.id.toString()))
                );
              });
            }

            if (relatedBid) {
              // Parse bid configuration to get route information
              let configData = {};
              try {
                configData = relatedBid.notes
                  ? JSON.parse(relatedBid.notes)
                  : {};
              } catch (e) {
                configData = {};
              }

              const origin =
                configData.origin || relatedBid.flight?.origin || "Unknown";
              const destination =
                configData.destination ||
                relatedBid.flight?.destination ||
                "Unknown";
              const route = `${origin} → ${destination}`;

              return {
                ...payment,
                bidId: `BID-${relatedBid.id}`,
                route: route,
                paymentReference:
                  payment.paymentReference || `PAY-${payment.id}`,
              };
            }

            return {
              ...payment,
              paymentReference: payment.paymentReference || `PAY-${payment.id}`,
            };
          } catch (error) {
            console.log("Could not enhance payment data:", error.message);
            return {
              ...payment,
              paymentReference: payment.paymentReference || `PAY-${payment.id}`,
            };
          }
        }),
      );

      res.json(enhancedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Get payment schedule (upcoming payments)
  app.get("/api/payments/schedule", async (req, res) => {
    try {
      const { userId } = req.query;
      const schedule = await storage.getPaymentSchedule(
        userId ? parseInt(userId as string) : undefined,
      );
      res.json(schedule);
    } catch (error) {
      console.error("Error fetching payment schedule:", error);
      res.status(500).json({ message: "Failed to fetch payment schedule" });
    }
  });

  // Create a new payment
  app.post("/api/payments", async (req, res) => {
    try {
      const {
        bidId,
        userId,
        userEmail,
        userName,
        userRole,
        userLoggedIn,
        bookingId,
        amount,
        currency,
        paymentMethod, // fixed: was 'retailBidspaymentMethod' in body but you used paymentMethod
        paymentStatus,
        paymentType,
        cardDetails,
      } = req.body;

      console.log("Received payment request:", req.body);
      console.log("User logged in:", userLoggedIn);

      // Validate required fields
      if (!amount || parseFloat(amount) <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid payment amount" });
      }

      if (!paymentMethod) {
        return res
          .status(400)
          .json({ success: false, message: "Payment method is required" });
      }

      const currentUserId = parseInt(userId);
      if (!currentUserId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required for payment" });
      }

      if (!userEmail || !userName) {
        return res.status(400).json({
          success: false,
          message: "User email and name are required for payment",
        });
      }

      console.log(
        `Payment request from user: ${userName} (${userEmail}), ID: ${currentUserId}, Role: ${userRole}`,
      );

      // Check if user already paid for this bid
      if (bidId && currentUserId) {
        try {
          const bidDetails = await storage.getBidById(parseInt(bidId));
          const retailBids = await storage.getRetailBidsByBid(parseInt(bidId));

          const userRetailBid = retailBids.find(
            (rb) => rb.userId === currentUserId,
          );

          if (
            userRetailBid &&
            (userRetailBid.status === "under_review" ||
              userRetailBid.status === "paid")
          ) {
            return res.status(400).json({
              success: false,
              message: "You have already completed payment for this bid",
            });
          }

          const existingPayments = await storage.getPaymentsByBidId(
            parseInt(bidId),
          );
          const userPayment = existingPayments.find(
            (payment) => payment.rUserId === currentUserId,
          );

          if (userPayment) {
            return res.status(400).json({
              success: false,
              message: "You have already completed payment for this bid",
            });
          }

          // Check bid notes
          const notes = bidDetails?.bid?.notes
            ? JSON.parse(bidDetails.bid.notes)
            : {};
          const userPaymentsInNotes = notes.userPayments || [];
          const userPaymentInNotes = userPaymentsInNotes.find(
            (up) => up.userId === currentUserId,
          );

          if (userPaymentInNotes && userPaymentInNotes.paymentCompleted) {
            return res.json({
              success: true,
              alreadyPaid: true,
              message: "You have already completed payment for this bid",
            });
          }
        } catch (err) {
          console.log("Error checking user payment status:", err.message);
        }
      }

      // Validate bid exists if bidId is provided
      if (bidId) {
        const parsedBidId = parseInt(bidId);
        if (isNaN(parsedBidId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid bid ID format: ${bidId}`,
          });
        }

        const bidDetails = await storage.getBidById(parsedBidId);
        if (!bidDetails || !bidDetails.bid) {
          return res.status(400).json({
            success: false,
            message: `Bid not found with ID: ${bidId}`,
          });
        }
      }

      const paymentReference = `PAY-${bidId || "BOOK"}-USER${currentUserId}-${nanoid(4)}`;

      const paymentData = {
        bookingId: bookingId && !bidId ? parseInt(bookingId) : null,
        user_id: currentUserId,
        paymentReference,
        amount: amount.toString(),
        currency: currency || "USD",
        paymentMethod,
        paymentStatus: paymentStatus || "completed",
        paymentGateway: paymentMethod === "creditCard" ? "stripe" : "bank",
        transactionId: `txn_${nanoid(8)}`,
        processedAt: new Date(),
        createdAt: new Date(),
      };

      let payment;

      if (bidId) {
        const retailBids = await storage.getRetailBidsByBid(parseInt(bidId));
        const userRetailBid = retailBids.find(
          (rb) => rb.userId === currentUserId,
        );

        if (userRetailBid) {
          const bidPaymentData = {
            rUserId: currentUserId,
            rRetailBidId: userRetailBid.id,
            paymentReference,
            amount: amount.toString(),
            currency: currency || "USD",
            paymentMethod,
            rStatus: 1, // completed
            transactionId: `txn_${nanoid(8)}`,
            paymentGateway: paymentMethod === "creditCard" ? "stripe" : "bank",
            processedAt: new Date(),
          };

          payment = await storage.createBidPayment(bidPaymentData);

          // Update retail bid status
          await db.execute(sql`
            UPDATE grab_t_retail_bids
            SET r_status = 2, updated_at = now()
            WHERE id = ${userRetailBid.id}
          `);
        } else {
          payment = await storage.createPayment(paymentData);
        }
      } else {
        payment = await storage.createPayment(paymentData);
      }

      // Update bid notes
      if (bidId) {
        const bidDetails = await storage.getBidById(parseInt(bidId));
        let existingNotes = {};
        try {
          existingNotes = bidDetails?.bid?.notes
            ? JSON.parse(bidDetails.bid.notes)
            : {};
        } catch (e) {
          existingNotes = {};
        }

        const userPayments = existingNotes.userPayments || [];
        userPayments.push({
          paymentId: payment.id,
          paymentReference,
          paymentStatus: paymentStatus || "completed",
          paymentDate: new Date().toISOString(),
          amount,
          paymentMethod,
          paymentCompleted: true,
          user_id: currentUserId,
        });

        await storage.updateBidDetails(parseInt(bidId), {
          notes: JSON.stringify({ ...existingNotes, userPayments }),
          updatedAt: new Date(),
        });
      }

      res.json({
        success: true,
        payment,
        paymentReference,
        bidId: bidId || null,
      });
    } catch (error) {
      console.error("Payment creation error:", error);
      let errorMessage = error.message || "Payment creation failed";
      res.status(500).json({ success: false, message: errorMessage });
    }
  });

  // Notification endpoints
  app.get("/api/notifications", async (req: Request, res: Response) => {
    try {
      const notificationsList = await db
        .select()
        .from(notifications)
        .orderBy(desc(notifications.createdAt))
        .limit(50); // Limit to recent 50 notifications

      res.json({ notifications: notificationsList });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.put(
    "/api/notifications/:id/read",
    async (req: Request, res: Response) => {
      try {
        const notificationId = parseInt(req.params.id);

        await db
          .update(notifications)
          .set({
            isRead: true,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(notifications.id, notificationId));

        res.json({ success: true, message: "Notification marked as read" });
      } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({
          success: false,
          error: "Failed to mark notification as read",
        });
      }
    },
  );

  app.put(
    "/api/notifications/mark-all-read",
    async (req: Request, res: Response) => {
      try {
        await db
          .update(notifications)
          .set({
            isRead: true,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(notifications.isRead, false));

        res.json({
          success: true,
          message: "All notifications marked as read",
        });
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({
          success: false,
          error: "Failed to mark all notifications as read",
        });
      }
    },
  );

  // Insert bid data endpoint
  app.post("/api/insert-bid-data", async (_req, res) => {
    try {
      const { insertBidData } = await import("./insert-bid-data");
      const result = await insertBidData();
      res.json(result);
    } catch (error) {
      console.error("Bid data insertion error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to insert bid data",
      });
    }
  });

  // Reset bid payment status (for testing/admin purposes)
  app.put("/api/bids/:id/reset-payment", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Resetting payment status for bid ${id}`);

      // Get existing bid
      const existingBid = await storage.getBidById(parseInt(id));
      if (!existingBid) {
        return res.status(404).json({
          success: false,
          message: "Bid not found",
        });
      }

      // Parse existing notes and remove payment info
      let existingNotes = {};
      try {
        existingNotes = existingBid.bid.notes
          ? JSON.parse(existingBid.bid.notes)
          : {};
      } catch (e) {
        existingNotes = {};
      }

      // Remove payment info and reset status
      delete existingNotes.paymentInfo;

      const updateData = {
        bidStatus: "accepted", // or 'active' depending on your flow
        notes: JSON.stringify(existingNotes),
        updatedAt: new Date(),
      };

      await storage.updateBidDetails(parseInt(id), updateData);

      res.json({
        success: true,
        message: "Bid payment status reset successfully",
      });
    } catch (error) {
      console.error("Error resetting bid payment status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to reset bid payment status",
        error: error.message,
      });
    }
  });

  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      console.log("Fetching all users from grab_t_users...");

      const userResults = await db.execute(sql`
        SELECT u.id, u.username, u.name, u.email, u.phone, u.is_retail_allowed, u.r_status, s.status_name
        FROM grab_t_users u
        LEFT JOIN grab_m_status s ON u.r_status = s.id
        ORDER BY u.id DESC
      `);

      const users = userResults.rows.map((user) => ({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isRetailAllowed: user.is_retail_allowed,
        rStatus: user.r_status,
        statusName: user.status_name,
      }));

      console.log(`Found ${users.length} users`);

      res.json({
        success: true,
        users: users,
        count: users.length,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      });
    }
  });

  // Create a new user
  app.post("/api/users", async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        username,
        password,
        name,
        role,
        isRetailAllowed,
        rStatus,
      } = req.body;

      // Create full name from firstName and lastName if name is not provided
      let fullName = name;
      if (!fullName && firstName && lastName) {
        fullName = `${firstName} ${lastName}`;
      } else if (!fullName && firstName) {
        fullName = firstName;
      } else if (!fullName && lastName) {
        fullName = lastName;
      }

      // Validate required fields
      if (!username || !password || !fullName || !email || !phone) {
        console.log("Validation failed:", {
          username: !!username,
          password: !!password,
          fullName: !!fullName,
          email: !!email,
          phone: !!phone,
          receivedData: { firstName, lastName, name, email, phone, username },
        });
        return res.status(400).json({
          success: false,
          message:
            "Username, password, name (or firstName/lastName), email, and phone are required",
        });
      }

      // Check if user already exists by username or email in grab_t_users
      const existingUserResults = await db.execute(sql`
        SELECT * FROM grab_t_users WHERE username = ${username} OR email = ${email} LIMIT 1
      `);

      if (existingUserResults.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "User with this username or email already exists",
        });
      }

      // Hash password before storing
      const hashedPassword = Buffer.from(password).toString("base64");

      // Determine retail access based on role
      const retailAllowed = role === "retail_user" || isRetailAllowed || false;

      // Set default r_status to 1 (Active) if not provided
      const userStatus = rStatus || 1;

      // Create user in grab_t_users table with r_status
      await db.execute(sql`
        INSERT INTO grab_t_users (username, password, name, email, phone, is_retail_allowed, r_status)
        VALUES (${username}, ${hashedPassword}, ${fullName}, ${email}, ${phone}, ${retailAllowed}, ${userStatus})
      `);

      // Get the created user
      const createdUserResults = await db.execute(sql`
        SELECT id, username, name, email, phone, is_retail_allowed, r_status
        FROM grab_t_users
        WHERE username = ${username}
        LIMIT 1
      `);

      const createdUser = createdUserResults.rows[0];

      res.json({
        success: true,
        message: "User created successfully",
        user: {
          id: createdUser.id,
          username: createdUser.username,
          name: createdUser.name,
          email: createdUser.email,
          phone: createdUser.phone,
          isRetailAllowed: createdUser.is_retail_allowed,
          rStatus: createdUser.r_status,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Check retail access for user
  app.post("/api/check-retail-access", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
      }

      console.log(`Checking retail access for username: ${username}`);

      // Get user by username directly from grab_t_users table
      const userResults = await db.execute(sql`
        SELECT id, username, password, name, email, is_retail_allowed
        FROM grab_t_users
        WHERE username = ${username}
        LIMIT 1
      `);

      if (userResults.rows.length === 0) {
        console.log(`User not found: ${username}`);
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      const user = userResults.rows[0];

      console.log(`User found: ${user.username}, verifying password...`);

      // Enhanced password verification logic
      let passwordValid = false;

      // First, try direct comparison (for plain text passwords)
      if (user.password === password) {
        passwordValid = true;
        console.log(`Direct password match for user: ${username}`);
      } else {
        // Try base64 decoding (for encoded passwords)
        try {
          const decodedStoredPassword = Buffer.from(
            user.password,
            "base64",
          ).toString();
          if (decodedStoredPassword === password) {
            passwordValid = true;
            console.log(`Base64 decoded password match for user: ${username}`);
          }
        } catch (decodeError) {
          console.log(
            `Base64 decode failed for user: ${username}, trying hex...`,
          );

          // Try hex decoding as fallback
          try {
            const hexDecodedPassword = Buffer.from(
              user.password,
              "hex",
            ).toString();
            if (hexDecodedPassword === password) {
              passwordValid = true;
              console.log(`Hex decoded password match for user: ${username}`);
            }
          } catch (hexError) {
            console.log(`Hex decode also failed for user: ${username}`);
          }
        }
      }

      // Debug logging for password verification
      console.log(
        `Password verification result for ${username}: ${passwordValid}`,
      );
      console.log(
        `Stored password format check - Length: ${user.password.length}, First 10 chars: ${user.password.substring(0, 10)}...`,
      );

      if (!passwordValid) {
        console.log(`Password verification failed for user: ${username}`);
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      console.log(
        `Password verified for user: ${username}, checking retail access...`,
      );

      // Check if user has retail access
      if (!user.is_retail_allowed) {
        console.log(`User ${username} does not have retail access`);
        return res.status(403).json({
          success: false,
          message:
            "Access denied: You are not authorized to access the retail portal",
        });
      }

      console.log(`Retail access granted for user: ${username}`);

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          isRetailAllowed: user.isRetailAllowed,
        },
        message: "Access granted",
      });
    } catch (error) {
      console.error("Error checking retail access:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });

  // Update user retail access (admin only)
  app.put("/api/users/:id/retail-access", async (req, res) => {
    try {
      const { id } = req.params;
      const { isAllowed } = req.body;

      await storage.updateUserRetailAccess(parseInt(id), isAllowed);

      res.json({
        success: true,
        message: `Retail access ${isAllowed ? "granted" : "revoked"} successfully`,
      });
    } catch (error) {
      console.error("Error updating retail access:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update retail access",
      });
    }
  });

  // Submit retail bid
  app.post("/api/retail-bids", async (req, res) => {
    try {
      const { bidId, userId, submittedAmount, passengerCount } = req.body;

      console.log("Received retail bid submission:", req.body);

      // Validate required fields with specific error messages
      const missingFields = [];
      const invalidFields = [];

      // Check for missing fields
      if (bidId === undefined || bidId === null) missingFields.push("bidId");
      if (userId === undefined || userId === null) missingFields.push("userId");
      if (submittedAmount === undefined || submittedAmount === null)
        missingFields.push("submittedAmount");
      if (passengerCount === undefined || passengerCount === null)
        missingFields.push("passengerCount");

      // Check for invalid field types/values
      if (bidId && (isNaN(parseInt(bidId)) || parseInt(bidId) <= 0))
        invalidFields.push("bidId (must be positive integer)");
      if (userId && (isNaN(parseInt(userId)) || parseInt(userId) <= 0))
        invalidFields.push("userId (must be positive integer)");
      if (
        submittedAmount &&
        (isNaN(parseFloat(submittedAmount)) || parseFloat(submittedAmount) <= 0)
      )
        invalidFields.push("submittedAmount (must be positive number)");
      if (
        passengerCount &&
        (isNaN(parseInt(passengerCount)) || parseInt(passengerCount) <= 0)
      )
        invalidFields.push("passengerCount (must be positive integer)");

      if (missingFields.length > 0) {
        console.log("Missing fields in retail bid submission:", missingFields);
        console.log("Received data:", {
          bidId,
          userId,
          submittedAmount,
          passengerCount,
        });
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
          receivedData: { bidId, userId, submittedAmount, passengerCount },
        });
      }

      if (invalidFields.length > 0) {
        console.log("Invalid fields in retail bid submission:", invalidFields);
        return res.status(400).json({
          success: false,
          message: `Invalid field values: ${invalidFields.join(", ")}`,
          receivedData: { bidId, userId, submittedAmount, passengerCount },
        });
      }

      // Get the original bid configuration to validate limits
      const originalBid = await storage.getBidById(parseInt(bidId));
      if (!originalBid) {
        return res.status(404).json({
          success: false,
          message: "Bid configuration not found",
        });
      }

      console.log("Original bid found:", originalBid.bid);

      // Parse bid configuration data for seat availability checking
      let configData = {};
      try {
        configData = originalBid.bid.notes
          ? JSON.parse(originalBid.bid.notes)
          : {};
        console.log("Parsed config data:", configData);
      } catch (e) {
        console.log("Could not parse config data, using defaults");
        configData = {};
      }

      // Get seat limits
      const totalSeatsAvailable =
        originalBid.bid.totalSeatsAvailable ||
        configData.totalSeatsAvailable ||
        100;
      const maxSeatsPerUser =
        originalBid.bid.maxSeatsPerBid || configData.maxSeatsPerUser || 10;
      const existingRetailBids = await storage.getRetailBidsByBid(
        parseInt(bidId),
      );

      // Calculate available seats = total_seats_available minus sum of seat_booked from retail_bids with status 'under_review' or 'paid'
      const bookedSeats = existingRetailBids
        .filter((rb) => rb.status === "under_review" || rb.status === "paid")
        .reduce((total, rb) => total + (rb.seatBooked || 0), 0);

      const availableSeats = totalSeatsAvailable - bookedSeats;

      // Debug endpoint to check user credentials (remove in production)
      app.get("/api/debug/users", async (req, res) => {
        try {
          console.log("Debug: Fetching all users from database");

          const allUsers = await db
            .select({
              id: usersTable.id,
              username: usersTable.username,
              name: usersTable.name,
              email: usersTable.email,
              isRetailAllowed: usersTable.isRetailAllowed,
              passwordLength: sql`length(${usersTable.password})`.as(
                "passwordLength",
              ),
              passwordPreview: sql`substring(${usersTable.password}, 1, 10)`.as(
                "passwordPreview",
              ),
            })
            .from(usersTable);

          console.log(`Debug: Found ${allUsers.length} users in database`);

          res.json({
            success: true,
            totalUsers: allUsers.length,
            users: allUsers,
            message: "Debug user information retrieved successfully",
          });
        } catch (error) {
          console.error("Debug users error:", error);
          res.status(500).json({
            success: false,
            message: "Failed to fetch debug user data",
            error: error.message,
          });
        }
      });

      // Debug endpoint to test specific user authentication
      app.post("/api/debug/test-auth", async (req, res) => {
        try {
          const { username, password } = req.body;

          if (!username || !password) {
            return res.status(400).json({
              success: false,
              message: "Username and password are required for testing",
            });
          }

          console.log(
            `Debug: Testing authentication for username: ${username}`,
          );

          // Get user by username from grab_t_users table
          const userResults = await db.execute(sql`
        SELECT id, username, password, name, email, is_retail_allowed
        FROM grab_t_users
        WHERE username = ${username}
        LIMIT 1
      `);

          if (userResults.rows.length === 0) {
            return res.json({
              success: false,
              message: "User not found",
              debug: {
                username: username,
                userExists: false,
              },
            });
          }

          const user = userResults.rows[0];

          // Test different password verification methods
          const verificationTests = {
            directMatch: user.password === password,
            base64Decoded: false,
            hexDecoded: false,
          };

          // Test base64 decoding
          try {
            const decodedStoredPassword = Buffer.from(
              user.password,
              "base64",
            ).toString();
            verificationTests.base64Decoded =
              decodedStoredPassword === password;
          } catch (e) {
            verificationTests.base64Decoded = false;
          }

          // Test hex decoding
          try {
            const hexDecodedPassword = Buffer.from(
              user.password,
              "hex",
            ).toString();
            verificationTests.hexDecoded = hexDecodedPassword === password;
          } catch (e) {
            verificationTests.hexDecoded = false;
          }

          const authSuccessful =
            verificationTests.directMatch ||
            verificationTests.base64Decoded ||
            verificationTests.hexDecoded;

          res.json({
            success: true,
            message: "Authentication test completed",
            debug: {
              username: username,
              userExists: true,
              userId: user.id,
              userName: user.name,
              isRetailAllowed: user.isRetailAllowed,
              storedPasswordLength: user.password.length,
              storedPasswordPreview: user.password.substring(0, 10) + "...",
              providedPasswordLength: password.length,
              verificationTests: verificationTests,
              authSuccessful: authSuccessful,
              recommendedAction: authSuccessful
                ? "Authentication should work"
                : "Check password encoding/format",
            },
          });
        } catch (error) {
          console.error("Debug auth test error:", error);
          res.status(500).json({
            success: false,
            message: "Debug authentication test failed",
            error: error.message,
          });
        }
      });

      // Validate passenger count is <= available seats
      if (parseInt(passengerCount) > availableSeats) {
        return res.status(400).json({
          success: false,
          message: `Not enough seats available. ${availableSeats} seats remaining.`,
        });
      }

      // Validate passenger count is <= max_seats_per_user
      if (parseInt(passengerCount) > maxSeatsPerUser) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${maxSeatsPerUser} seats allowed per user.`,
        });
      }

      // Check if user has already submitted a bid for this configuration
      const userExistingBid = existingRetailBids.find(
        (rb) => rb.userId === parseInt(userId),
      );

      if (userExistingBid) {
        return res.status(400).json({
          success: false,
          message: "You have already submitted a bid for this configuration",
        });
      }

      console.log(
        "Bid submission for bid:",
        bidId,
        "passenger count:",
        passengerCount,
      );

      // Import bidding storage to use status_code lookup
      const { biddingStorage } = await import("./bidding-storage.js");

      // Create retail bid submission using the proper method
      const retailBidData = {
        rBidId: parseInt(bidId),
        rUserId: parseInt(userId),
        submittedAmount: submittedAmount.toString(),
        seatBooked: parseInt(passengerCount),
      };

      // Use bidding storage method which properly sets UR status
      const newRetailBid = await biddingStorage.createRetailBid(retailBidData);

      console.log(
        `Created retail bid ${newRetailBid.id} with r_status=6 (under_review)`,
      );

      // Create notification
      await createNotification(
        "retail_bid_submitted",
        "New Retail Bid Submitted",
        `A retail user has submitted a bid of $${submittedAmount} for ${passengerCount} passengers on bid configuration ${bidId}. ${availableSeats - parseInt(passengerCount)} seats remaining.`,
        "medium",
        {
          id: newRetailBid.id,
          bid_id: parseInt(bidId),
          user_id: parseInt(userId),
          submitted_amount: submittedAmount,
          seat_booked: parseInt(passengerCount),
          seatsRemaining: availableSeats - parseInt(passengerCount),
        },
      );

      res.json({
        success: true,
        message: "Retail bid submitted successfully",
        retailBid: newRetailBid,
        availableSeats: availableSeats - parseInt(passengerCount),
        totalSeatsAvailable: totalSeatsAvailable,
      });
    } catch (error) {
      console.error("Error submitting retail bid:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit retail bid",
        error: error.message,
      });
    }
  });

  // Mark retail bid as under_review after payment
  app.put(
    "/api/retail-bids/:retailBidId/mark-under-review",
    async (req, res) => {
      try {
        const { retailBidId } = req.params;
        const { paymentReference, transactionId, userId, bidId } = req.body;

        console.log(
          `Marking retail bid ${retailBidId} as under_review after payment by user ${userId} for bid ${bidId}`,
        );

        // Get the retail bid
        const retailBid = await storage.getRetailBidById(parseInt(retailBidId));
        if (!retailBid) {
          return res.status(404).json({
            success: false,
            message: "Retail bid not found",
          });
        }

        // Validate that the bid is currently in 'submitted' status
        if (retailBid.status !== "submitted") {
          return res.status(400).json({
            success: false,
            message: `Cannot mark bid as under_review. Current status: ${retailBid.status}`,
          });
        }

        // Update the retail bid status to 'under_review'
        await storage.updateRetailBidStatus(
          parseInt(retailBidId),
          "under_review",
        );

        // Get the main bid configuration to check seat availability
        const bidDetails = await storage.getBidById(retailBid.bidId);
        if (bidDetails) {
          let configData = {};
          try {
            configData = bidDetails.bid.notes
              ? JSON.parse(bidDetails.bid.notes)
              : {};
          } catch (e) {
            configData = {};
          }

          const totalSeatsAvailable =
            bidDetails.bid.totalSeatsAvailable ||
            configData.totalSeatsAvailable ||
            100;

          // Get all retail bids for this configuration to calculate remaining seats
          const allRetailBids = await storage.getRetailBidsByBid(
            retailBid.bidId,
          );
          const bookedSeats = allRetailBids
            .filter(
              (rb) => rb.status === "under_review" || rb.status === "paid",
            )
            .reduce((total, rb) => total + (rb.passengerCount || 0), 0);

          const remainingSeats = totalSeatsAvailable - bookedSeats;

          console.log(
            `Bid ${retailBid.bidId}: ${bookedSeats}/${totalSeatsAvailable} seats booked, ${remainingSeats} remaining`,
          );
        }

        // Create notification for payment received
        await createNotification(
          "retail_bid_payment_received",
          "Retail Bid Payment Received",
          `Payment received for retail bid ${retailBidId}. Bid is now under review.`,
          "medium",
          {
            retailBidId: parseInt(retailBidId),
            paymentReference: paymentReference || null,
            transactionId: transactionId || null,
            bidId: retailBid.bidId,
            userId: retailBid.userId,
          },
        );

        res.json({
          success: true,
          message: "Retail bid marked as under review successfully",
          retailBidId: parseInt(retailBidId),
          newStatus: "under_review",
        });
      } catch (error) {
        console.error("Error marking retail bid as under review:", error);
        res.status(500).json({
          success: false,
          message: "Failed to mark retail bid as under review",
          error: error.message,
        });
      }
    },
  );

  // Get retail bids for a bid configuration
  app.get("/api/retail-bids/:bidId", async (req, res) => {
    try {
      const { bidId } = req.params;
      console.log(`Fetching retail bids for bid ID: ${bidId}`);

      // Get the main bid configuration
      const bidDetails = await storage.getBidById(parseInt(bidId));
      if (!bidDetails) {
        return res.status(404).json({
          success: false,
          message: "Bid configuration not found",
        });
      }

      // Parse configuration data
      let configData = {};
      try {
        configData = bidDetails.bid.notes
          ? JSON.parse(bidDetails.bid.notes)
          : {};
      } catch (e) {
        configData = {};
      }

      const baseBidAmount = parseFloat(bidDetails.bid.bidAmount) || 0;

      // Get retail bids with user information from the database
      const retailBidsWithUsers = await storage.getRetailBidsWithUsersByBid(
        parseInt(bidId),
      );

      // If no retail bids exist in database, check if there are any in the bid notes
      let retailUsers = [];
      if (retailBidsWithUsers.length > 0) {
        // Convert database retail bids to the expected format
        retailUsers = retailBidsWithUsers.map((item) => {
          const retailBid = item.retailBid;
          const user = item.user;
          return {
            id: retailBid.id, // Use the actual retail bid ID from grab_t_retail_bids table
            userId: retailBid.rUserId, // The actual user ID from grab_t_retail_bids
            rUserId: retailBid.rUserId, // The r_user_id field from grab_t_retail_bids table
            retailBidId: retailBid.id, // Add explicit retail bid ID field
            name: user?.name || `User ${retailBid.rUserId}`,
            email: user?.email || `user${retailBid.rUserId}@email.com`,
            bookingRef: `GR00${1230 + retailBid.rUserId}`,
            seatNumber: `1${2 + retailBid.rUserId}${String.fromCharCode(65 + (retailBid.rUserId % 26))}`,
            bidAmount: parseFloat(retailBid.submittedAmount),
            passengerCount: retailBid.seatBooked,
            status: retailBid.status,
            createdAt: retailBid.createdAt,
            updatedAt: retailBid.updatedAt,
          };
        });
      } else {
        // Check if retail users exist in bid notes (legacy data)
        try {
          const notesRetailUsers = configData.retailUsers || [];
          if (notesRetailUsers.length > 0) {
            retailUsers = notesRetailUsers;
          } else {
            // Generate some sample data if none exists (for development)
            const names = [
              "John Smith",
              "Sarah Johnson",
              "Mike Wilson",
              "Emma Davis",
              "David Brown",
            ];
            const domains = [
              "gmail.com",
              "yahoo.com",
              "email.com",
              "outlook.com",
            ];
            const userCount = Math.max(Math.floor(Math.random() * 4) + 2, 3); // 3-5 users

            for (let i = 0; i < userCount; i++) {
              const randomIncrement = Math.floor(Math.random() * 100) + 20; // $20-$120 above base
              retailUsers.push({
                id: i + 1,
                name: names[i] || `User ${i + 1}`,
                email:
                  `${names[i]?.toLowerCase().replace(" ", ".")}@${domains[i % domains.length]}` ||
                  `user${i + 1}@email.com`,
                bookingRef: `GR00123${i + 4}`,
                seatNumber: `1${2 + i}${String.fromCharCode(65 + i)}`, // 12A, 13B, etc.
                bidAmount: baseBidAmount + randomIncrement,
                passengerCount: Math.floor(Math.random() * 3) + 1, // 1-3 passengers
                status: i === 0 ? "approved" : "pending_approval",
              });
            }
          }
        } catch (e) {
          console.log("Error parsing retail users from notes:", e.message);
          retailUsers = [];
        }
      }

      // Calculate total seats available and booked
      const totalSeatsAvailable =
        bidDetails.bid.totalSeatsAvailable ||
        configData.totalSeatsAvailable ||
        100;
      const bookedSeats = retailUsers.reduce((total, user) => {
        if (
          user.status === "under_review" ||
          user.status === "paid" ||
          user.status === "approved"
        ) {
          return total + (user.passengerCount || 1);
        }
        return total;
      }, 0);

      // Find the highest bidder
      const highestBidAmount =
        retailUsers.length > 0
          ? Math.max(...retailUsers.map((user) => user.bidAmount))
          : 0;

      // Format response
      const response = {
        success: true,
        data: {
          bidId: `BID${bidId.toString().padStart(3, "0")}`,
          baseBidAmount: baseBidAmount,
          totalRetailUsers: retailUsers.length,
          totalSeatsAvailable: totalSeatsAvailable,
          bookedSeats: bookedSeats,
          availableSeats: totalSeatsAvailable - bookedSeats,
          highestBidAmount: highestBidAmount,
          retailUsers: retailUsers.map((user) => ({
            id: user.retailBidId || user.id, // Use retail bid ID as the primary ID
            rUserId: user.rUserId, // The user ID who made the bid
            retailBidId: user.retailBidId || user.id, // Explicit retail bid ID from grab_t_retail_bids
            name: user.name,
            email: user.email,
            bookingRef: user.bookingRef,
            seatNumber: user.seatNumber,
            bidAmount: user.bidAmount,
            passengerCount: user.passengerCount || 1,
            differenceFromBase: user.bidAmount - baseBidAmount,
            status: user.status,
            isHighestBidder: user.bidAmount === highestBidAmount,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          })),
        },
      };

      console.log(`Found ${retailUsers.length} retail users for bid ${bidId}`);
      res.json(response);
    } catch (error) {
      console.error("Error fetching retail users for bid:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch retail users",
        error: error.message,
      });
    }
  });

  // Get bid status with seat availability for retail users
  app.get("/api/bid-status/:bidId/", async (req, res) => {
    try {
      const { bidId } = req.params;
      const { userId } = req.query;

      console.log(
        `Fetching bid status for bid ID: ${bidId}, user ID: ${userId}`,
      );

      // Validate bidId
      const parsedBidId = parseInt(bidId, 10);
      if (isNaN(parsedBidId) || parsedBidId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid bid ID",
        });
      }

      // Get complete bid details using the new workflow
      const { biddingStorage } = await import("./bidding-storage.js");
      const bidDetails = await biddingStorage.getBidWithDetails(
        parsedBidId,
        userId ? parseInt(userId as string) : undefined,
      );

      if (!bidDetails) {
        return res.status(404).json({
          success: false,
          message: "Bid not found",
        });
      }

      const {
        bid,
        retailBids,
        bidPayments,
        totalSeatsAvailable,
        bookedSeats,
        availableSeats,
        displayStatus,
        statusForUser,
        userPaymentStatus,
        hasUserPaid,
        userRetailBidStatus,
      } = bidDetails;

      // Get the actual status name for user's retail bid
      let userRetailBidStatusName = null;
      if (userRetailBidStatus && userId) {
        const userRetailBid = retailBids.find(
          (rb) => rb.rUserId === parseInt(userId as string),
        );
        if (userRetailBid) {
          const status = await biddingStorage.getStatusById(
            userRetailBid.rStatus,
          );
          userRetailBidStatusName = status?.statusName || null;
        }
      }

      console.log(
        `Final status for bid ${bidId}, user ${userId}: ${displayStatus} (${statusForUser}), payment: ${userPaymentStatus}, seats: ${availableSeats}/${totalSeatsAvailable}`,
      );

      return res.json({
        success: true,
        bidStatus: displayStatus,
        statusForUser: statusForUser,
        paymentStatus: userPaymentStatus,
        totalSeatsAvailable: totalSeatsAvailable,
        bookedSeats: bookedSeats,
        availableSeats: availableSeats,
        seatsRemaining: availableSeats,
        isClosed: availableSeats <= 0 && !hasUserPaid,
        hasUserPaid: hasUserPaid,
        userRetailBidStatus: userRetailBidStatus,
        userRetailBidStatusName: userRetailBidStatusName,
        allUsersWhoHavePaid: retailBids
          .filter((rb) => {
            if (!rb) return false;
            const payment = bidPayments.find((p) => p.rUserId === rb.rUserId);
            return payment && payment.r_status === 3;
          })
          .map((rb) => rb.rUserId),
        bid: bid,
        retailBids: retailBids,
        payments: bidPayments,
      });
    } catch (err) {
      console.error("Unexpected error fetching bid status:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch bid status",
        error: err.message,
      });
    }
  });

  // Create default admin user if it doesn't exist
  app.post("/api/create-default-admin", async (req, res) => {
    try {
      console.log("Checking for default admin user...");

      // Check if admin user already exists
      const existingAdmin = await storage.getUserByUsername("admin");
      if (existingAdmin) {
        return res.json({
          success: true,
          message: "Admin user already exists",
          user: {
            id: existingAdmin.id,
            username: existingAdmin.username,
            name: existingAdmin.name,
          },
        });
      }

      // Create default admin user
      const adminUser = await storage.createUser({
        username: "admin",
        password: Buffer.from("admin123").toString("base64"), // Base64 encoded
        name: "Administrator",
        email: "admin@grab.com",
        isRetailAllowed: true,
      });

      console.log("Default admin user created successfully");

      res.json({
        success: true,
        message: "Default admin user created successfully",
        user: {
          id: adminUser.id,
          username: adminUser.username,
          name: adminUser.name,
          email: adminUser.email,
        },
      });
    } catch (error) {
      console.error("Error creating default admin user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create default admin user",
        error: error.message,
      });
    }
  });

  // Get user-specific bid status with display_status logic
  app.get("/api/user-bids/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      console.log(`Fetching bids for user ID: ${userId}`);

      const bidsQuery = sql`
        SELECT
    gtb.id AS bid_id,
    gtb.bid_amount,
    gtb.notes,
    gtb.total_seats_available,
    gtb.min_seats_per_bid,
    gtb.max_seats_per_bid,
    gtb.valid_until,
    gtb.created_at,
    gtb.r_status AS admin_status_id,
    ms_admin.status_name AS admin_status,
    grb.id AS retail_bid_id,
    grb.r_status AS retail_status_id,
    ms_retail.status_name AS retail_status,
    grb.submitted_amount,
    grb.seat_booked AS retail_passenger_count,
    grb.created_at AS retail_bid_created_at,
    COALESCE(grb.r_status, gtb.r_status) AS final_status_id,
    COALESCE(ms_retail.status_name, ms_admin.status_name) AS final_status
FROM grab_t_bids gtb
LEFT JOIN grab_t_retail_bids grb
    ON gtb.id = grb.r_bid_id
   AND grb.r_user_id = ${parseInt(userId, 10)}
LEFT JOIN grab_m_status ms_admin
    ON gtb.r_status = ms_admin.id
LEFT JOIN grab_m_status ms_retail
    ON grb.r_status = ms_retail.id
ORDER BY gtb.created_at DESC;
      `;

      const results = await db.execute(bidsQuery);

      // Transform results (status names already included)
      const transformedBids = results.rows.map((row: any) => {
        // Parse config data
        let configData = {};
        try {
          configData = row.notes ? JSON.parse(row.notes) : {};
        } catch (e) {
          console.warn(`Could not parse notes for bid ${row.bid_id}:`, e);
        }

        // Title + route
        const bidTitle = configData.title || `Bid ${row.bid_id}`;
        const origin = configData.origin || "Unknown";
        const destination = configData.destination || "Unknown";
        const route = `${origin} → ${destination}`;

        // Use final_status_name directly
        let displayStatus = row.final_status || "Open";
        let statusClass = "status-default";
        switch (displayStatus.toLowerCase()) {
          case "under review":
            statusClass = "status-under-review";
            break;
          case "approved":
            statusClass = "status-approved";
            break;
          case "rejected":
            statusClass = "status-rejected";
            break;
          case "closed":
            statusClass = "status-closed";
            break;
          case "expired":
            statusClass = "status-expired";
            break;
          case "open":
            statusClass = "status-open";
            break;
        }

        return {
          bid_id: row.bid_id,
          title: bidTitle,
          route,
          origin,
          destination,
          bid_amount: row.bid_amount,
          display_status: displayStatus,
          status_class: statusClass,
          status_source: row.retail_bid_id ? "retail_bid" : "global_bid",
          admin_status_id: row.admin_status_id,
          admin_status_name: row.admin_status_name,
          has_user_bid: row.retail_bid_id !== null,
          retail_bid_id: row.retail_bid_id,
          retail_status_id: row.retail_status_id,
          retail_status_name: row.retail_status_name,
          submitted_amount: row.submitted_amount,
          retail_passenger_count: row.retail_passenger_count,
          retail_bid_created_at: row.retail_bid_created_at,
          total_seats_available: row.total_seats_available,
          min_seats_per_bid: row.min_seats_per_bid,
          max_seats_per_bid: row.max_seats_per_bid,
          valid_until: row.valid_until,
          created_at: row.created_at,
          config_data: configData,
        };
      });

      res.json({
        success: true,
        user_id: parseInt(userId, 10),
        bids: transformedBids,
        total_count: transformedBids.length,
        user_participated_count: transformedBids.filter((b) => b.has_user_bid)
          .length,
      });
    } catch (error) {
      console.error("Error fetching user bids:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user bids",
        error: error.message,
      });
    }
  });

  // Create notification (helper function for internal use)
  const createNotification = async (
    type: string,
    title: string,
    message: string,
    priority: string = "medium",
    actionData: any = null,
  ) => {
    try {
      const now = new Date();
      await db.insert(notifications).values({
        type,
        title,
        message,
        priority,
        isRead: false,
        actionData: actionData ? JSON.stringify(actionData) : null,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  // Update user
  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { firstName, lastName, email, phone, isRetailAllowed, rStatus } =
        req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      // Check if user exists in grab_t_users
      const existingUserResults = await db.execute(sql`
        SELECT * FROM grab_t_users WHERE id = ${userId} LIMIT 1
      `);

      if (existingUserResults.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if email is already taken by another user
      const emailExistsResults = await db.execute(sql`
        SELECT * FROM grab_t_users WHERE email = ${email} AND id != ${userId} LIMIT 1
      `);

      if (emailExistsResults.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken",
        });
      }

      // Update user in grab_t_users table including r_status
      const updatedName = `${firstName} ${lastName}`;
      const userStatus = rStatus || 1; // Default to 1 (Active) if not provided

      await db.execute(sql`
        UPDATE grab_t_users
        SET name = ${updatedName}, email = ${email}, phone = ${phone}, is_retail_allowed = ${isRetailAllowed || false}, r_status = ${userStatus}, updated_at = now()
        WHERE id = ${userId}
      `);

      return res.json({
        success: true,
        message: "User updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update user",
      });
    }
  });

  // Delete user
  app.delete("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      // Check if user exists in grab_t_users
      const existingUserResults = await db.execute(sql`
        SELECT * FROM grab_t_users WHERE id = ${userId} LIMIT 1
      `);

      if (existingUserResults.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const existingUser = existingUserResults.rows[0];

      // Prevent deletion of admin user
      if (existingUser.username === "admin") {
        return res.status(400).json({
          success: false,
          message: "Cannot delete admin user",
        });
      }

      // Delete user from grab_t_users table
      await db.execute(sql`
        DELETE FROM grab_t_users WHERE id = ${userId}
      `);

      return res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  });

  // User login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
      }

      console.log(`Login attempt for username: ${username}`);

      // Get user by username from grab_t_users table
      const userResults = await db.execute(sql`
        SELECT id, username, password, name, email, is_retail_allowed
        FROM grab_t_users
        WHERE username = ${username}
        LIMIT 1
      `);

      if (userResults.rows.length === 0) {
        console.log(`User not found: ${username}`);
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      const user = userResults.rows[0];

      console.log(`User found: ${user.username}, verifying password...`);

      // Enhanced password verification logic
      let passwordValid = false;

      // First, try direct comparison (for plain text passwords)
      if (user.password === password) {
        passwordValid = true;
        console.log(`Direct password match for user: ${username}`);
      } else {
        // Try base64 decoding (for encoded passwords)
        try {
          const decodedStoredPassword = Buffer.from(
            user.password,
            "base64",
          ).toString();
          if (decodedStoredPassword === password) {
            passwordValid = true;
            console.log(`Base64 decoded password match for user: ${username}`);
          }
        } catch (decodeError) {
          console.log(
            `Base64 decode failed for user: ${username}, trying hex...`,
          );

          // Try hex decoding as fallback
          try {
            const hexDecodedPassword = Buffer.from(
              user.password,
              "hex",
            ).toString();
            if (hexDecodedPassword === password) {
              passwordValid = true;
              console.log(`Hex decoded password match for user: ${username}`);
            }
          } catch (hexError) {
            console.log(`Hex decode also failed for user: ${username}`);
          }
        }
      }

      // Debug logging for password verification
      console.log(
        `Password verification result for ${username}: ${passwordValid}`,
      );
      console.log(
        `Stored password format check - Length: ${user.password.length}, First 10 chars: ${user.password.substring(0, 10)}...`,
      );

      if (!passwordValid) {
        console.log(`Password verification failed for user: ${username}`);
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      console.log(`Login successful for user: ${username}`);

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          isRetailAllowed: user.isRetailAllowed,
        },
        message: "Login successful",
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });

  // User management endpoints
  app.post("/api/users", async (req, res) => {
    try {
      const { name, email, username, password, isRetailAllowed } = req.body;

      // Validate required fields
      if (!username || !password || !name || !email) {
        return res.status(400).json({
          success: false,
          message: "Username, password, name, and email are required",
        });
      }

      // Check if user already exists by username or email
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this username already exists",
        });
      }

      const existingEmailUser = await storage.getUserByEmail(email);
      if (existingEmailUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Hash password before storing (basic hashing - in production use bcrypt)
      const hashedPassword = Buffer.from(password).toString("base64");

      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        name,
        email,
        isRetailAllowed: isRetailAllowed || false,
      });

      res.json({
        success: true,
        message: "User created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          isRetailAllowed: newUser.isRetailAllowed,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Grant retail access to a user by username using grab_t_users table
  app.post("/api/grant-retail-access", async (req, res) => {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({
          success: false,
          message: "Username is required",
        });
      }

      console.log(`Granting retail access to user: ${username}`);

      // Find user by username in grab_t_users table
      const userResults = await db.execute(sql`
        SELECT * FROM grab_t_users WHERE username = ${username} LIMIT 1
      `);

      if (userResults.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const user = userResults.rows[0];

      // Update user retail access in grab_t_users table
      await db.execute(sql`
        UPDATE grab_t_users
        SET is_retail_allowed = true, updated_at = now()
        WHERE username = ${username}
      `);

      console.log(`Retail access granted to user: ${username}`);

      res.json({
        success: true,
        message: `Retail access granted to user: ${username}`,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          isRetailAllowed: true,
        },
      });
    } catch (error) {
      console.error("Error granting retail access:", error);
      res.status(500).json({
        success: false,
        message: "Failed to grant retail access",
        error: error.message,
      });
    }
  });

  // Create test retail user in grab_t_users table
  app.post("/api/create-test-retail-user", async (req, res) => {
    try {
      console.log("Creating test retail user in grab_t_users table...");

      // Check if test user already exists in grab_t_users
      const existingUserResults = await db.execute(sql`
        SELECT * FROM grab_t_users WHERE username = 'testuser' LIMIT 1
      `);

      if (existingUserResults.rows.length > 0) {
        const existingUser = existingUserResults.rows[0];

        // Grant retail access if user exists but doesn't have it
        if (!existingUser.is_retail_allowed) {
          await db.execute(sql`
            UPDATE grab_t_users
            SET is_retail_allowed = true, updated_at = now()
            WHERE username = 'testuser'
          `);
        }

        return res.json({
          success: true,
          message: "Test retail user already exists and has retail access",
          user: {
            id: existingUser.id,
            username: existingUser.username,
            name: existingUser.name,
            isRetailAllowed: true,
          },
          credentials: {
            username: "testuser",
            password: "password123",
          },
        });
      }

      // Create test retail user in grab_t_users table
      await db.execute(sql`
        INSERT INTO grab_t_users (username, password, name, email, is_retail_allowed)
        VALUES ('testuser', ${Buffer.from("password123").toString("base64")}, 'Test Retail User', 'testuser@grab.com', true)
      `);

      console.log(
        "Test retail user created successfully in grab_t_users table",
      );

      res.json({
        success: true,
        message: "Test retail user created successfully",
        user: {
          username: "testuser",
          name: "Test Retail User",
          email: "testuser@grab.com",
          isRetailAllowed: true,
        },
        credentials: {
          username: "testuser",
          password: "password123",
        },
      });
    } catch (error) {
      console.error("Error creating test retail user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create test retail user",
        error: error.message,
      });
    }
  });

  // Create test bid data for testing
  app.post("/api/create-test-bid-data", async (req, res) => {
    try {
      console.log("Creating test bid data...");

      // Check if we already have bids
      const existingBids = await db.execute(sql`
        SELECT COUNT(*) as count FROM grab_t_bids WHERE r_status = 4
      `);

      if (existingBids.rows[0].count > 0) {
        return res.json({
          success: true,
          message: "Test bid data already exists",
          count: existingBids.rows[0].count,
        });
      }

      // Create sample bid configurations
      const sampleBids = [
        {
          bidAmount: "500.00",
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          totalSeatsAvailable: 50,
          minSeatsPerBid: 1,
          maxSeatsPerBid: 10,
          rStatus: 4, // Open status
          notes: JSON.stringify({
            title: "Delhi to Mumbai Flight",
            origin: "Delhi",
            destination: "Mumbai",
            flightType: "Domestic",
            fareType: "Economy",
            configType: "bid_configuration",
            createdAt: new Date().toISOString(),
          }),
        },
        {
          bidAmount: "750.00",
          validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          totalSeatsAvailable: 40,
          minSeatsPerBid: 2,
          maxSeatsPerBid: 8,
          rStatus: 4, // Open status
          notes: JSON.stringify({
            title: "Mumbai to Bangalore Flight",
            origin: "Mumbai",
            destination: "Bangalore",
            flightType: "Domestic",
            fareType: "Economy",
            configType: "bid_configuration",
            createdAt: new Date().toISOString(),
          }),
        },
        {
          bidAmount: "1200.00",
          validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          totalSeatsAvailable: 30,
          minSeatsPerBid: 1,
          maxSeatsPerBid: 5,
          rStatus: 4, // Open status
          notes: JSON.stringify({
            title: "Delhi to Bangalore Business Class",
            origin: "Delhi",
            destination: "Bangalore",
            flightType: "Domestic",
            fareType: "Business",
            configType: "bid_configuration",
            createdAt: new Date().toISOString(),
          }),
        },
      ];

      let createdCount = 0;
      for (const bid of sampleBids) {
        await db.insert(grabTBids).values({
          ...bid,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        createdCount++;
      }

      console.log(`Created ${createdCount} test bid configurations`);

      res.json({
        success: true,
        message: `Created ${createdCount} test bid configurations successfully`,
        count: createdCount,
      });
    } catch (error) {
      console.error("Error creating test bid data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create test bid data",
        error: error.message,
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}