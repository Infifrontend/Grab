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
      const searchData = insertSearchRequestSchema.parse(req.body);
      await storage.createSearchRequest(searchData);

      // Search for outbound flights
      const outboundFlights = await storage.getFlights(
        searchData.origin,
        searchData.destination,
        searchData.departureDate,
      );

      let returnFlights = [];

      // If it's a round trip, also search for return flights
      if (searchData.tripType === "roundTrip" && searchData.returnDate) {
        returnFlights = await storage.getReturnFlights(
          searchData.destination,
          searchData.origin,
          searchData.returnDate,
        );
        console.log(
          `Found ${returnFlights.length} return flights for ${searchData.destination} to ${searchData.origin}`,
        );
      }

      console.log(
        `Found ${outboundFlights.length} outbound flights for ${searchData.origin} to ${searchData.destination}`,
      );
      console.log("Outbound flight data sample:", outboundFlights.slice(0, 2));

      res.json({
        flights: outboundFlights,
        returnFlights: returnFlights,
        tripType: searchData.tripType,
        message: "Search completed successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Search validation error:", error.errors);
        res
          .status(400)
          .json({ message: "Invalid search data", errors: error.errors });
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
        departureDate ? new Date(departureDate as string) : undefined,
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
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = new Date().getFullYear();

      const monthlyData = monthNames.map(month => ({ 
        month, 
        bookings: 0, 
        revenue: 0,
        passengers: 0 
      }));

      flightBookings.forEach(booking => {
        if (booking.createdAt) {
          const bookingDate = new Date(booking.createdAt);
          if (bookingDate.getFullYear() === currentYear) {
            const monthIndex = bookingDate.getMonth();
            monthlyData[monthIndex].bookings += 1;
            monthlyData[monthIndex].revenue += parseFloat(booking.totalAmount || '0');
            monthlyData[monthIndex].passengers += booking.passengerCount || 0;
          }
        }
      });

      // Add status breakdown
      const statusData = {
        confirmed: flightBookings.filter(b => b.bookingStatus === 'confirmed').length,
        pending: flightBookings.filter(b => b.bookingStatus === 'pending').length,
        cancelled: flightBookings.filter(b => b.bookingStatus === 'cancelled').length,
      };

      res.json({
        monthlyData,
        statusData,
        totalBookings: flightBookings.length,
        totalRevenue: flightBookings.reduce((sum, b) => sum + parseFloat(b.totalAmount || '0'), 0),
        totalPassengers: flightBookings.reduce((sum, b) => sum + (b.passengerCount || 0), 0)
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

      // Try to find in flight bookings first by booking reference
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
          comprehensiveData,
        });
      }

      // If not found by reference, try by ID
      const allFlightBookings = await storage.getFlightBookings();
      const flightBookingById = allFlightBookings.find(
        (b) => b.id.toString() === id,
      );

      if (flightBookingById) {
        passengers = await storage.getPassengersByBooking(flightBookingById.id);
        flightData = await storage.getFlight(flightBookingById.flightId);

        if (flightBookingById.specialRequests) {
          try {
            comprehensiveData = JSON.parse(flightBookingById.specialRequests);
          } catch (e) {
            // If parsing fails, ignore and use basic data
          }
        }

        return res.json({
          booking: flightBookingById,
          passengers,
          flightData,
          comprehensiveData,
        });
      }

      // If not found in flight bookings, try legacy bookings
      const legacyBookings = await storage.getBookings();
      const legacyBooking = legacyBookings.find(
        (b) => b.id.toString() === id || b.bookingId === id,
      );

      if (legacyBooking) {
        return res.json({
          booking: legacyBooking,
          passengers: [],
          flightData: null,
          comprehensiveData: null,
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

      res.json({
        success: true,
        booking,
        bookingReference,
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
      const { userId } = req.query;
      const bids = await storage.getBids(
        userId ? parseInt(userId as string) : undefined,
      );

      // Sort bids by creation date (newest first) for recent activity display
      const sortedBids = bids.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      res.json(sortedBids);
    } catch (error) {
      console.error("Error fetching bids:", error);
      res.status(500).json({ message: "Failed to fetch bids" });
    }
  });

  // Get bid configurations (formatted for admin display)
  app.get("/api/bid-configurations-list", async (req, res) => {
    try {
      const bids = await storage.getBids();

      // Filter and format bid configurations (those with configType)
      const bidConfigurations = bids
        .filter(bid => {
          try {
            const notes = bid.notes ? JSON.parse(bid.notes) : {};
            return notes.configType === 'bid_configuration';
          } catch (e) {
            return false;
          }
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first

      res.json(bidConfigurations);
    } catch (error) {
      console.error("Error fetching bid configurations:", error);
      res.status(500).json({ message: "Failed to fetch bid configurations" });
    }
  });

  // Review bid (accept/reject)
  app.put("/api/bids/:id/review", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      console.log(`Reviewing bid ${id} with status ${status}`);

      if (!status || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be 'accepted' or 'rejected'"
        });
      }

      // Update the bid status in the database
      await storage.updateBidStatus(parseInt(id), status);

      // If there are admin notes, update those too
      if (adminNotes) {
        await storage.updateBidDetails(parseInt(id), {
          notes: adminNotes,
          reviewedAt: new Date()
        });
      }

      // Get the updated bid to return
      const updatedBid = await storage.getBidById(parseInt(id));

      if (!updatedBid) {
        return res.status(404).json({
          success: false,
          message: "Bid not found"
        });
      }

      res.json({
        success: true,
        message: `Bid ${status} successfully`,
        bid: updatedBid
      });
    } catch (error) {
      console.error("Error reviewing bid:", error);
      res.status(500).json({
        success: false,
        message: "Failed to review bid",
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
          message: "Bid configuration not found"
        });
      }

      res.json({
        success: true,
        message: `Bid configuration ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
        bid: updatedBid
      });
    } catch (error) {
      console.error("Error updating bid configuration status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update bid configuration status",
        error: error.message
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
        bidAmount
      } = req.body;

      console.log(`Updating bid configuration ${id}:`, req.body);

      // Get existing bid configuration
      const existingBid = await storage.getBidById(parseInt(id));

      if (!existingBid) {
        return res.status(404).json({
          success: false,
          message: "Bid configuration not found"
        });
      }

      // Parse existing notes to preserve other data
      let existingConfigData = {};
      try {
        existingConfigData = existingBid.bid.notes ? JSON.parse(existingBid.bid.notes) : {};
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
        totalSeatsAvailable: totalSeatsAvailable !== undefined ? totalSeatsAvailable : existingConfigData.totalSeatsAvailable || 50,
        minSeatsPerBid: minSeatsPerBid !== undefined ? minSeatsPerBid : existingConfigData.minSeatsPerBid || 1,
        maxSeatsPerBid: maxSeatsPerBid !== undefined ? maxSeatsPerBid : existingConfigData.maxSeatsPerBid || 10,
        maxSeatsPerUser: maxSeatsPerUser !== undefined ? maxSeatsPerUser : existingConfigData.maxSeatsPerUser || 5,
        fareType: fareType || existingConfigData.fareType || "Economy",
        baggageAllowance: baggageAllowance !== undefined ? baggageAllowance : existingConfigData.baggageAllowance || 20,
        cancellationTerms: cancellationTerms || existingConfigData.cancellationTerms || "Standard",
        mealIncluded: mealIncluded !== undefined ? mealIncluded : existingConfigData.mealIncluded || false,
        otherNotes: otherNotes !== undefined ? otherNotes : existingConfigData.otherNotes || "",
        updatedAt: new Date().toISOString(),
        configType: "bid_configuration" // Ensure this remains set
      };

      console.log('Updated configuration data:', updatedConfigurationData);

      // Update the bid configuration
      const updatedBid = await storage.updateBidDetails(parseInt(id), {
        notes: JSON.stringify(updatedConfigurationData),
        passengerCount: updatedConfigurationData.minSeatsPerBid,
        bidAmount: bidAmount !== undefined ? bidAmount.toString() : existingBid.bid.bidAmount,
        updatedAt: new Date()
      });

      console.log('Bid updated successfully:', updatedBid);

      res.json({
        success: true,
        message: "Bid configuration updated successfully",
        bid: updatedBid,
        configData: updatedConfigurationData
      });
    } catch (error) {
      console.error("Error updating bid configuration:", error);
      
      let errorMessage = "Failed to update bid configuration";
      if (error.message) {
        if (error.message.includes("UNIQUE constraint")) {
          errorMessage = "A bid configuration with these details already exists";
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
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
          message: "Bid configuration not found"
        });
      }

      res.json({
        success: true,
        bid
      });
    } catch (error) {
      console.error("Error fetching bid configuration:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bid configuration",
        error: error.message
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

  // Get bid details by ID
  app.get("/api/bids/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const bid = await storage.getBidById(parseInt(id));
      if (!bid) {
        return res.status(404).json({ message: "Bid not found" });
      }
      res.json(bid);
    } catch (error) {
      console.error("Error fetching bid details:", error);
      res.status(500).json({ message: "Failed to fetch bid details" });
    }
  });

  // Create bid configuration
  app.post("/api/bid-configurations", async (req, res) => {
    try {
      console.log("Received bid configuration request:", req.body);

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
        otherNotes
      } = req.body;

      // Allow submission without required field validation

      // Find or create a flight that matches the route
      let flightId = 1; // Default fallback
      try {
        // First try to find an existing flight
        const flights = await storage.getFlights(origin, destination, new Date(travelDate));

        if (flights.length > 0) {
          flightId = flights[0].id;
          console.log(`Found existing flight with ID: ${flightId}`);
        } else {
          // Create a new flight for this route if none exists
          console.log(`No flights found for route ${origin} to ${destination}, creating new flight`);

          const newFlight = await storage.createFlight({
            flightNumber: `BC${Math.floor(1000 + Math.random() * 9000)}`,
            airline: "Bid Configuration Flight",
            aircraft: "Configuration",
            origin: origin,
            destination: destination,
            departureTime: new Date(travelDate),
            arrivalTime: new Date(new Date(travelDate).getTime() + 2 * 60 * 60 * 1000), // +2 hours
            duration: "2h 0m",
            price: "0",
            availableSeats: totalSeatsAvailable || 50,
            totalSeats: totalSeatsAvailable || 50,
            cabin: "economy",
            stops: 0
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
          message: "Invalid date format for bid end time"
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
        status: "active"
      };

      // Create bid configuration record
      const bidData = {
        userId: 1, // Default admin user - you might want to get this from session/auth
        flightId: flightId,
        bidAmount: "0", // Initial amount, will be set by actual bidders
        passengerCount: minSeatsPerBid || 1,
        bidStatus: "active",
        validUntil: validUntilDate,
        notes: JSON.stringify(configurationData)
      };

      console.log("Creating bid configuration with data:", bidData);

      const bidConfig = await storage.createBid(bidData);

      console.log("Bid configuration created successfully:", bidConfig);

      res.json({
        success: true,
        bidConfiguration: bidConfig,
        message: `Bid configuration "${bidTitle}" created successfully`
      });

    } catch (error) {
      console.error("Error creating bid configuration:", error);

      // Provide more specific error messages
      let errorMessage = "Failed to create bid configuration";

      if (error.message) {
        if (error.message.includes("UNIQUE constraint")) {
          errorMessage = "A bid configuration with these details already exists";
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
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

  // Update booking details (group leader info)
  app.put("/api/booking-details/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { groupLeaderName, groupLeaderEmail, groupLeaderPhone } = req.body;

      // Find the booking by ID or reference
      let booking = await storage.getFlightBookingByReference(id);
      if (!booking) {
        const allFlightBookings = await storage.getFlightBookings();
        booking = allFlightBookings.find((b) => b.id.toString() === id);
      }

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Parse existing comprehensive data if available
      let comprehensiveData = {};
      if (booking.specialRequests) {
        try {
          comprehensiveData = JSON.parse(booking.specialRequests);
        } catch (e) {
          // If parsing fails, start with empty object
        }
      }

      // Update group leader information
      comprehensiveData.groupLeaderInfo = {
        ...comprehensiveData.groupLeaderInfo,
        name: groupLeaderName,
        email: groupLeaderEmail,
        phone: groupLeaderPhone,
        updatedAt: new Date().toISOString(),
      };

      // Save back to database
      await storage.updateBookingDetails(booking.id, {
        specialRequests: JSON.stringify(comprehensiveData),
      });

      res.json({
        success: true,
        message: "Group leader information updated successfully",
      });
    } catch (error) {
      console.error("Error updating booking details:", error);
      res.status(500).json({ message: "Failed to update booking details" });
    }
  });

  // Update passengers for a booking
  app.put("/api/booking-passengers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { passengers } = req.body;

      // Find the booking by ID or reference
      let booking = await storage.getFlightBookingByReference(id);
      if (!booking) {
        const allFlightBookings = await storage.getFlightBookings();
        booking = allFlightBookings.find((b) => b.id.toString() === id);
      }

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Get existing passengers
      const existingPassengers = await storage.getPassengersByBooking(
        booking.id,
      );

      // Update existing passengers or create new ones
      for (let i = 0; i < passengers.length; i++) {
        const passengerData = passengers[i];

        if (existingPassengers[i]) {
          // Update existing passenger
          await storage.updatePassenger(existingPassengers[i].id, {
            firstName: passengerData.firstName,
            lastName: passengerData.lastName,
          });
        } else {
          // Create new passenger
          await storage.createPassenger({
            bookingId: booking.id,
            title: "Mr",
            firstName: passengerData.firstName,
            lastName: passengerData.lastName,
            dateOfBirth: new Date("1990-01-01"), // Default date
            nationality: "Indian", // Default nationality
          });
        }
      }

      // Remove excess passengers if the new list is shorter
      if (existingPassengers.length > passengers.length) {
        for (let i = passengers.length; i < existingPassengers.length; i++) {
          await storage.deletePassenger(existingPassengers[i].id);
        }
      }

      // Update the booking's passenger count to match the actual number of passengers
      await storage.updateBookingPassengerCount(booking.id, passengers.length);

      res.json({
        success: true,
        message: "Passengers updated successfully",
      });
    } catch (error) {
      console.error("Error updating passengers:", error);
      res.status(500).json({ message: "Failed to update passengers" });
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
      const { userId, status } = req.query;
      const payments = await storage.getPayments(
        userId ? parseInt(userId as string) : undefined,
        status as string,
      );
      res.json(payments);
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
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);
      res.json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Invalid payment data", errors: error.errors });
      } else {
        console.error("Payment creation error:", error);
        res.status(500).json({ message: "Payment creation failed" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}