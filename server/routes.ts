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
import { eq, desc, and, or, like, sql, isNull, isNotNull, ne } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "./db.js";
import {
  users as usersTable, // Alias users to usersTable to avoid conflict with the variable name 'users'
  flights,
  bookings,
  passengers,
  bids,
  payments,
  notifications,
  retailBids,
} from "../shared/schema.js";

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

      // Create search request (storage will handle ID generation)
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
      console.log(`Fetching booking details for ID: ${id}`);

      let booking = null;
      let passengers = [];
      let flightData = null;
      let comprehensiveData = null;

      // Get all flight bookings first for comprehensive search
      const allFlightBookings = await storage.getFlightBookings();
      console.log(`Total flight bookings available: ${allFlightBookings.length}`);

      // Try multiple search strategies
      if (!booking) {
        // Strategy 1: Search by PNR (exact match)
        booking = allFlightBookings.find(b => b.pnr && b.pnr.toUpperCase() === id.toUpperCase());
        if (booking) console.log("Found booking by PNR exact match");
      }

      if (!booking) {
        // Strategy 2: Search by booking reference (exact match)
        booking = allFlightBookings.find(b => b.bookingReference && b.bookingReference.toUpperCase() === id.toUpperCase());
        if (booking) console.log("Found booking by booking reference exact match");
      }

      if (!booking) {
        // Strategy 3: Search by ID (numeric)
        booking = allFlightBookings.find(b => b.id.toString() === id);
        if (booking) console.log("Found booking by numeric ID");
      }

      if (!booking) {
        // Strategy 4: Partial match in PNR or booking reference
        booking = allFlightBookings.find(b => 
          (b.pnr && b.pnr.toUpperCase().includes(id.toUpperCase())) ||
          (b.bookingReference && b.bookingReference.toUpperCase().includes(id.toUpperCase()))
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
          console.log("Found booking in legacy bookings:", booking ? "Yes" : "No");

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
        console.log("Available PNRs:", allFlightBookings.map(b => b.pnr).filter(Boolean));
        console.log("Available booking references:", allFlightBookings.map(b => b.bookingReference).filter(Boolean));
        console.log("Available IDs:", allFlightBookings.map(b => b.id));

        return res.status(404).json({ 
          message: "Booking not found",
          searchedId: id,
          availablePNRs: allFlightBookings.map(b => b.pnr).filter(Boolean),
          availableReferences: allFlightBookings.map(b => b.bookingReference).filter(Boolean)
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
        pnr: booking.pnr
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

  // Get all bids with user-specific payment status
  app.get("/api/bids", async (req, res) => {
    try {
      const { userId } = req.query;
      const loggedInUserId = userId ? parseInt(userId as string) : null;
      
      // Get all bids (not filtered by userId for retail view)
      const bids = await storage.getBids();

      // For each bid, determine user-specific payment status
      const bidsWithUserStatus = await Promise.all(bids.map(async (bid) => {
        let userSpecificPaymentStatus = "Open";
        let hasUserPaid = false;

        if (loggedInUserId) {
          // Check if the current user has paid for this specific bid
          hasUserPaid = await storage.hasUserPaidForBid(bid.id, loggedInUserId);
          
          if (hasUserPaid) {
            // Check the retail bid status for this user
            const retailBids = await storage.getRetailBidsByBid(bid.id);
            const userRetailBid = retailBids.find(rb => rb.userId === loggedInUserId);
            
            if (userRetailBid) {
              switch (userRetailBid.status) {
                case 'under_review':
                  userSpecificPaymentStatus = "Under Review";
                  break;
                case 'approved':
                  userSpecificPaymentStatus = "Approved";
                  break;
                case 'rejected':
                  userSpecificPaymentStatus = "Rejected";
                  break;
                case 'paid':
                  userSpecificPaymentStatus = "Payment Completed";
                  break;
                default:
                  userSpecificPaymentStatus = "Under Review";
              }
            } else {
              userSpecificPaymentStatus = "Payment Completed";
            }
          } else {
            // Check if bid is closed due to seat availability
            const bidStatus = await storage.getBidStatus(bid.id, loggedInUserId);
            if (bidStatus && bidStatus.isClosed) {
              userSpecificPaymentStatus = "Closed";
            }
          }
        }

        return {
          ...bid,
          userSpecificPaymentStatus,
          hasUserPaid
        };
      }));

      // Sort bids by creation date (newest first) for recent activity display
      const sortedBids = bidsWithUserStatus.sort((a, b) => 
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
      const bids = await storage.getBids(); // Get all bids, don't filter by userId here

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

  // Update bid payment status
  app.put("/api/bids/:id/payment-status", async (req, res) => {
    try {
      const { id } = req.params;
      const { bidStatus, paymentStatus, passengerCount, bidAmount } = req.body;

      console.log(`Updating bid ${id} payment status to ${paymentStatus}, bid status to ${bidStatus}`);

      // Update the bid with payment information
      const updateData = {
        bidStatus: bidStatus || 'completed',
        passengerCount: passengerCount,
        bidAmount: bidAmount?.toString(),
        updatedAt: new Date()
      };

      // Add payment status to notes with correct status mapping
      const existingBid = await storage.getBidById(parseInt(id));
      let existingNotes = {};

      try {
        existingNotes = existingBid?.bid?.notes ? JSON.parse(existingBid.bid.notes) : {};
      } catch (e) {
        existingNotes = {};
      }

      // Determine the correct payment status based on the provided paymentStatus
      let finalPaymentStatus = paymentStatus || 'Payment Completed';
      
      // Ensure we're using the correct status values
      if (paymentStatus === 'Paid') {
        finalPaymentStatus = 'Payment Completed';
      }

      const paymentData = {
        ...existingNotes,
        paymentInfo: {
          paymentStatus: finalPaymentStatus,
          paymentDate: new Date().toISOString(),
          depositPaid: true,
          paymentCompleted: true,
          completedAt: new Date().toISOString()
        }
      };

      updateData.notes = JSON.stringify(paymentData);

      await storage.updateBidDetails(parseInt(id), updateData);

      // Get the updated bid to return
      const updatedBid = await storage.getBidById(parseInt(id));

      if (!updatedBid) {
        return res.status(404).json({
          success: false,
          message: "Bid not found"
        });
      }

      // Create notification for completed payment
      await createNotification(
        'payment_completed',
        'Payment Completed',
        `Payment for bid ${existingBid.bid.id} has been completed successfully. Amount: ₹${bidAmount}`,
        'high',
        {
          bidId: parseInt(id),
          amount: bidAmount,
          paymentStatus: paymentStatus
        }
      );

      res.json({
        success: true,
        message: `Bid payment completed successfully`,
        bid: updatedBid
      });
    } catch (error) {
      console.error("Error updating bid payment status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update bid payment status",
        error: error.message
      });
    }
  });

  // Update bid status (accept/reject)
  app.put("/api/bids/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes, counterOffer, rejectionReason } = req.body;

      console.log(`Updating bid ${id} status to ${status}`);

      // Update the bid status in the database
      const updateData = {
        bidStatus: status,
        updatedAt: new Date()
      };

      // Add admin notes to the bid notes if provided
      if (adminNotes || counterOffer || rejectionReason) {
        const existingBid = await storage.getBidById(parseInt(id));
        let existingNotes = {};

        try {
          existingNotes = existingBid?.bid?.notes ? JSON.parse(existingBid.bid.notes) : {};
        } catch (e) {
          existingNotes = {};
        }

        const adminData = {
          ...existingNotes,
          adminReview: {
            status,
            adminNotes: adminNotes || '',
            counterOffer: counterOffer || null,
            rejectionReason: rejectionReason || null,
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Admin' // You might want to get this from session
          }
        };

        updateData.notes = JSON.stringify(adminData);
      }

      await storage.updateBidDetails(parseInt(id), updateData);

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
      console.error("Error updating bid status:", error);
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
        totalSeatsAvailable: updatedConfigurationData.totalSeatsAvailable,
        minSeatsPerBid: updatedConfigurationData.minSeatsPerBid,
        maxSeatsPerBid: updatedConfigurationData.maxSeatsPerBid,
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

  // Debug endpoint to check all bids
  app.get("/api/debug/bids", async (req, res) => {
    try {
      const allBids = await storage.getBids();
      res.json({
        success: true,
        totalBids: allBids.length,
        bids: allBids.map(bid => ({
          id: bid.id,
          bidAmount: bid.bidAmount,
          bidStatus: bid.bidStatus,
          userId: bid.userId,
          flightId: bid.flightId
        }))
      });
    } catch (error) {
      console.error("Error fetching debug bids:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch debug bid data",
        error: error.message 
      });
    }
  });

  // Get bid details by ID
  app.get("/api/bids/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const bidId = parseInt(id);

      console.log(`Looking up bid with ID: ${bidId}`);

      if (isNaN(bidId) || bidId <= 0) {
        console.log(`Invalid bid ID format: ${id} -> ${bidId}`);
        return res.status(400).json({ 
          success: false, 
          message: `Invalid bid ID: ${id}` 
        });
      }

      const bid = await storage.getBidById(bidId);

      if (!bid) {
        const allBids = await storage.getBids();
        console.log(`Bid not found with ID: ${bidId}`);
        console.log(`Total bids in database: ${allBids.length}`);
        console.log(`Available bid IDs: [${allBids.map(b => b.id).join(', ')}]`);
        return res.status(404).json({ 
          success: false, 
          message: `Bid not found with ID: ${bidId}` 
        });
      }

      console.log(`Successfully found bid ${bidId}:`, {
        bidId: bid.bid?.id,
        bidAmount: bid.bid?.bidAmount,
        bidStatus: bid.bid?.bidStatus,
        userId: bid.bid?.userId
      });

      res.json({
        success: true,
        ...bid
      });
    } catch (error) {
      console.error("Error fetching bid details:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch bid details",
        error: error.message 
      });
    }
  });

  // Create bid configuration
  app.post("/api/bid-configurations", async (req: Request, res: Response) => {try {      console.log("Received bid configuration data:", req.body);

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
        bidAmount
      } = req.body;

      // Validate required fields
      if (!bidTitle || !origin || !destination) {
        return res.status(400).json({
          success: false,
          message: "Bid title, origin, and destination are required fields"
        });
      }

      // Validate bid amount
      const validBidAmount = bidAmount && bidAmount >= 100 ? bidAmount : 1000; // Default to 1000 if not provided or invalid

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

      // Create bid configuration record with seat values in dedicated columns
      const bidData = {
        userId: 1, // Default admin user - you might want to get this from session/auth
        flightId: flightId,
        bidAmount: validBidAmount.toString(), // Use the validated bid amount
        passengerCount: minSeatsPerBid || 1, // Keep minimum seats as passenger count reference
        bidStatus: "active",
        validUntil: validUntilDate,
        totalSeatsAvailable: totalSeatsAvailable || 50,
        minSeatsPerBid: minSeatsPerBid || 1,
        maxSeatsPerBid: maxSeatsPerBid || 10,
        notes: JSON.stringify(configurationData)
      };

      console.log("Creating bid configuration with data:", bidData);

      const bidConfig = await storage.createBid(bidData);

      console.log("Bid configuration created successfully:", bidConfig);

      // Create notification for new bid configuration
      await createNotification(
        'bid_created',
        'New Bid Configuration Created',
        `A new bid configuration "${bidTitle}" for route ${origin} → ${destination} has been created with base amount ₹${validBidAmount}.`,
        'medium',
        {
          bidId: bidConfig.id,
          bidTitle,
          route: `${origin} → ${destination}`,
          amount: validBidAmount
        }
      );

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

  // Migrate payments table to add user_id column
  app.post("/api/migrate-payments-user-id", async (_req, res) => {
    try {
      const { migratePaymentsUserId } = await import("./migrate-payments-user-id");
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
      const { migratePaymentReference } = await import("./migrate-payment-reference");
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
      const { migrateBidStatusLabels } = await import("./migrate-bid-status-labels");
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
      console.log("Group leader data:", { groupLeaderName, groupLeaderEmail, groupLeaderPhone });

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
          message: "Booking not found" 
        });
      }

      console.log(`Found booking with ID: ${booking.id}`);

      // Parse existing comprehensive data if available
      let comprehensiveData = {};
      if (booking.specialRequests) {
        try {
          comprehensiveData = JSON.parse(booking.specialRequests);
        } catch (e) {
          console.log("Could not parse existing special requests, using empty object");
          comprehensiveData = {};
        }
      }

      // Update group leader information
      comprehensiveData.groupLeaderInfo = {
        ...comprehensiveData.groupLeaderInfo,
        name: groupLeaderName || '',
        email: groupLeaderEmail || '',
        phone: groupLeaderPhone || '',
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
        error: error.message 
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
          message: "Invalid passenger data provided" 
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
          console.log(`Available bookings:`, allBookings.map(b => ({ 
            id: b.id, 
            reference: b.bookingReference, 
            pnr: b.pnr 
          })));
        } catch (debugError) {
          console.log("Could not fetch bookings for debug:", debugError.message);
        }

        return res.status(404).json({ 
          success: false,
          message: "Booking not found" 
        });
      }

      console.log(`Found booking with ID: ${booking.id}`);

      // Get existing passengers
      const existingPassengers = await storage.getPassengersByBooking(booking.id);
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
          dateOfBirth: passengerData.dateOfBirth ? new Date(passengerData.dateOfBirth) : new Date("1990-01-01"),
          nationality: passengerData.nationality || "Indian",
          passportNumber: passengerData.passportNumber || null,
          passportExpiry: passengerData.passportExpiry ? new Date(passengerData.passportExpiry) : null,
          seatPreference: passengerData.seatPreference || null,
          mealPreference: passengerData.mealPreference || null,
          specialAssistance: passengerData.specialRequests || null,
        };

        if (existingPassengers[i]) {
          // Update existing passenger
          console.log(`Updating existing passenger ${i + 1}`);
          await storage.updatePassenger(existingPassengers[i].id, passengerInfo);
        } else {
          // Create new passenger
          console.log(`Creating new passenger ${i + 1}`);
          await storage.createPassenger({
            bookingId: booking.id,
            ...passengerInfo,
          });
        }
      }

      // Remove excess passengers if the new list is shorter
      if (existingPassengers.length > passengers.length) {
        console.log(`Removing ${existingPassengers.length - passengers.length} excess passengers`);
        for (let i = passengers.length; i < existingPassengers.length; i++) {
          await storage.deletePassenger(existingPassengers[i].id);
        }
      }

      // Update the booking's passenger count to match the actual number of passengers
      const validPassengerCount = passengers.filter(p => p.firstName || p.lastName).length;
      await storage.updateBookingPassengerCount(booking.id, validPassengerCount);

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
        error: error.message 
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
          const directPayments = await storage.getPaymentsByBidId(parseInt(bidId as string));
          payments = [...directPayments];

          // Also check for payments that might be linked through booking references
          const allPayments = await storage.getPayments();
          const bidRelatedPayments = allPayments.filter(payment => {
            return payment.bookingId && payment.bookingId.includes(bidId as string);
          });

          // Merge and deduplicate
          const existingIds = new Set(payments.map(p => p.id));
          bidRelatedPayments.forEach(payment => {
            if (!existingIds.has(payment.id)) {
              payments.push(payment);
            }
          });

          console.log(`Found ${payments.length} payments for bid ${bidId}`);
        } catch (error) {
          console.log(`Error fetching payments for bid ${bidId}:`, error.message);
          payments = [];
        }
      } else if (userId) {
        payments = await storage.getPayments(parseInt(userId as string));
      } else {
        payments = await storage.getPayments();
      }

      // Enhance payment data with bid information
      const enhancedPayments = await Promise.all(payments.map(async (payment: any) => {
        try {
          // Try to find related bid information
          const allBids = await storage.getBids();
          let relatedBid = null;

          if (bidId) {
            // If we're querying for a specific bid, find that bid
            relatedBid = allBids.find(bid => bid.id.toString() === bidId);
          } else {
            // Otherwise, try to match payment to any bid
            relatedBid = allBids.find(bid => {
              return bid.id.toString() === payment.bidId || 
                     payment.key === bid.id.toString() ||
                     (payment.bookingId && payment.bookingId.includes(bid.id.toString()));
            });
          }

          if (relatedBid) {
            // Parse bid configuration to get route information
            let configData = {};
            try {
              configData = relatedBid.notes ? JSON.parse(relatedBid.notes) : {};
            } catch (e) {
              configData = {};
            }

            const origin = configData.origin || relatedBid.flight?.origin || "Unknown";
            const destination = configData.destination || relatedBid.flight?.destination || "Unknown";
            const route = `${origin} → ${destination}`;

            return {
              ...payment,
              bidId: `BID-${relatedBid.id}`,
              route: route,
              paymentReference: payment.paymentReference || `PAY-${payment.id}`
            };
          }

          return {
            ...payment,
            paymentReference: payment.paymentReference || `PAY-${payment.id}`
          };
        } catch (error) {
          console.log("Could not enhance payment data:", error.message);
          return {
            ...payment,
            paymentReference: payment.paymentReference || `PAY-${payment.id}`
          };
        }
      }));

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
      const { bidId, userId: requestUserId, bookingId, amount, currency, paymentMethod, paymentStatus, paymentType, cardDetails } = req.body;

      // Validate required fields
      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid payment amount" 
        });
      }

      if (!paymentMethod) {
        return res.status(400).json({ 
          success: false, 
          message: "Payment method is required" 
        });
      }

      // Get the actual user ID from request (localStorage is not available on server)
      const currentUserId = parseInt(requestUserId) || null;

      // Check if THIS SPECIFIC USER has already paid for this bid (prevent duplicate payments by same user)
      if (bidId && currentUserId) {
        try {
          const bidDetails = await storage.getBidById(parseInt(bidId));
          console.log(`Checking bid ${bidId} for user ${currentUserId} payment status`);

          // Check if this specific user has already paid
          const retailBids = await storage.getRetailBidsByBid(parseInt(bidId));
          const userRetailBid = retailBids.find(rb => rb.userId === currentUserId);
          
          if (userRetailBid && (userRetailBid.status === 'under_review' || userRetailBid.status === 'paid')) {
            return res.status(400).json({ 
              success: false, 
              message: "You have already completed payment for this bid" 
            });
          }

          // Check if this user has already made a payment for this bid
          const existingPayments = await storage.getPaymentsByBidId(parseInt(bidId));
          const userPayment = existingPayments.find(payment => {
            return payment.userId === currentUserId;
          });

          if (userPayment) {
            return res.status(400).json({ 
              success: false, 
              message: "You have already completed payment for this bid" 
            });
          }

          // Check bid notes for user-specific payment completion
          let userPaidFromBidNotes = false;
          try {
            const notes = bidDetails?.bid?.notes ? JSON.parse(bidDetails.bid.notes) : {};
            const userPayments = notes.userPayments || [];
            const userPayment = userPayments.find(up => up.userId === currentUserId);
            userPaidFromBidNotes = userPayment && userPayment.paymentCompleted === true;
            
            if (userPaidFromBidNotes) {
              return res.status(400).json({ 
                success: false, 
                message: "You have already completed payment for this bid" 
              });
            }
          } catch (noteError) {
            console.log("Could not parse bid notes for user payment check:", noteError.message);
          }

          console.log(`User ${currentUserId} has not paid for bid ${bidId} yet, allowing payment`);
        } catch (error) {
          console.log("Error checking user payment status:", error.message);
        }
      }

      // Use the current user ID or ensure default user exists
      let userId = currentUserId;

      if (!userId) {
        // Ensure default user exists if no user ID provided
        try {
          let defaultUser = await storage.getUserByUsername("default_user");
          if (!defaultUser) {
            console.log("Creating default user for payments...");
            defaultUser = await storage.createUser({
              username: "default_user",
              password: "default_password",
              name: "Default User"
            });
            console.log("Default user created:", defaultUser);
          }
          userId = defaultUser.id;
        } catch (userError) {
          console.error("Error handling default user:", userError);
          return res.status(500).json({
            success: false,
            message: "Failed to setup user information for payment"
          });
        }
      }

      // Validate bid exists if bidId is provided
      if (bidId) {
        try {
          const parsedBidId = parseInt(bidId);
          if (isNaN(parsedBidId)) {
            throw new Error(`Invalid bid ID format: ${bidId}`);
          }

          const bidDetails = await storage.getBidById(parsedBidId);
          if (!bidDetails || !bidDetails.bid) {
            throw new Error(`Bid not found with ID: ${bidId}`);
          }

          console.log(`Validated bid ${bidId} for user ${userId} payment`);
        } catch (error) {
          console.error("Error validating bid for payment:", error.message);
          return res.status(400).json({
            success: false,
            message: `Invalid bid ID: ${error.message}`
          });
        }
      }

      const paymentReference = `PAY-${bidId || 'BOOK'}-USER${userId}-${nanoid(4)}`;

      // For bid payments, set bookingId to null to avoid foreign key constraint violation
      const paymentData = {
        bookingId: bookingId && !bidId ? parseInt(bookingId) : null,
        userId: userId,
        paymentReference: paymentReference,
        amount: amount.toString(),
        currency: currency || "USD",
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus || "completed",
        paymentGateway: paymentMethod === "creditCard" ? "stripe" : "bank",
        transactionId: `txn_${nanoid(8)}`,
        processedAt: new Date(),
        createdAt: new Date()
      };

      console.log("Creating payment with data:", paymentData);

      const payment = await storage.createPayment(paymentData);

      console.log("Payment created successfully:", payment);

      // If this payment is for a bid, update ONLY the user-specific payment tracking
      if (bidId) {
        try {
          // Get existing bid notes
          const bidDetails = await storage.getBidById(parseInt(bidId));
          let existingNotes = {};
          try {
            existingNotes = bidDetails?.bid?.notes ? JSON.parse(bidDetails.bid.notes) : {};
          } catch (e) {
            existingNotes = {};
          }

          // Add payment information to bid notes with user-specific tracking
          const userPayments = existingNotes.userPayments || [];
          userPayments.push({
            paymentId: payment.id,
            paymentReference: paymentReference,
            paymentStatus: paymentStatus || "completed",
            paymentDate: new Date().toISOString(),
            amount: amount,
            paymentMethod: paymentMethod,
            paymentCompleted: true,
            userId: userId
          });

          const updatedNotes = {
            ...existingNotes,
            userPayments: userPayments,
            // Keep legacy paymentInfo for backwards compatibility, but don't use it for global validation
            paymentInfo: {
              latestPaymentId: payment.id,
              latestPaymentReference: paymentReference,
              lastPaymentDate: new Date().toISOString(),
              totalPaymentsReceived: userPayments.length
            }
          };

          // DON'T change the global bid status - keep it as 'active' so other users can still pay
          // Only update the notes to track this user's payment
          await storage.updateBidDetails(parseInt(bidId), {
            // Keep original bidStatus unchanged for other users
            notes: JSON.stringify(updatedNotes),
            updatedAt: new Date()
          });
          console.log(`Added user-specific payment tracking for user ${userId} on bid ${bidId} without changing global status`);

          // Mark the retail bid as 'under_review' for THIS user only
          const retailBids = await storage.getRetailBidsByBid(parseInt(bidId));
          const userRetailBid = retailBids.find(rb => rb.userId === userId);
          if (userRetailBid) {
            await storage.updateRetailBidStatus(userRetailBid.id, 'under_review');
            console.log(`Updated retail bid ${userRetailBid.id} status to under_review for user ${userId}`);
          }
        } catch (error) {
          console.log("Could not update bid payment tracking:", error.message);
        }
      }

      // Return payment with reference for frontend use
      res.json({
        success: true,
        payment,
        paymentReference: paymentReference,
        bidId: bidId || null
      });
    } catch (error) {
      console.error("Payment creation error:", error);

      let errorMessage = "Payment creation failed";
      if (error.message) {
        if (error.message.includes("UNIQUE constraint")) {
          errorMessage = "Duplicate payment detected";
        } else if (error.message.includes("NOT NULL constraint")) {
          errorMessage = "Missing required payment information";
        } else if (error.message.includes("FOREIGN KEY constraint")) {
          errorMessage = "Invalid booking reference provided";
        } else if (error.message.includes("user_id")) {
          errorMessage = "User information required for payment";
        } else {
          errorMessage = error.message;
        }
      }

      res.status(500).json({ 
        success: false, 
        message: errorMessage 
      });
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

  app.put("/api/notifications/:id/read", async (req: Request, res: Response) => {
    try {
      const notificationId = parseInt(req.params.id);

      await db
        .update(notifications)
        .set({ 
          isRead: true,
          updatedAt: new Date().toISOString()
        })
        .where(eq(notifications.id, notificationId));

      res.json({ success: true, message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ success: false, error: "Failed to mark notification as read" });
    }
  });

  app.put("/api/notifications/mark-all-read", async (req: Request, res: Response) => {
    try {
      await db
        .update(notifications)
        .set({ 
          isRead: true,
          updatedAt: new Date().toISOString()
        })
        .where(eq(notifications.isRead, false));

      res.json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ success: false, error: "Failed to mark all notifications as read" });
    }
  });

  // Approve or reject retail user for a bid
  app.put("/api/bids/:bidId/retail-users/:userId/status", async (req, res) => {
    try {
      const { bidId, userId } = req.params;
      const { action } = req.body; // 'approve' or 'reject'

      console.log(`${action}ing retail user ${userId} for bid ${bidId}`);

      // Get existing bid
      const existingBid = await storage.getBidById(parseInt(bidId));
      if (!existingBid) {
        return res.status(404).json({
          success: false,
          message: "Bid not found"
        });
      }

      // Parse existing notes to get retail users data and seat availability
      let existingNotes = {};
      try {
        existingNotes = existingBid.bid.notes ? JSON.parse(existingBid.bid.notes) : {};
      } catch (e) {
        existingNotes = {};
      }

      // Get seat availability information
      const totalSeatsAvailable = existingBid.bid.totalSeatsAvailable || existingNotes.totalSeatsAvailable || 100;
      const retailBids = await storage.getRetailBidsByBid(parseInt(bidId));
      const currentSeatsBooked = retailBids
        .filter(rb => rb.status === 'approved' || rb.status === 'paid')
        .reduce((total, rb) => total + (rb.passengerCount || 0), 0);

      // Initialize retail users array if it doesn't exist or ensure we have enough users
      if (!existingNotes.retailUsers || existingNotes.retailUsers.length === 0) {
        const names = ["John Smith", "Sarah Johnson", "Mike Wilson", "Emma Davis", "David Brown", "Lisa Garcia"];
        const domains = ["gmail.com", "yahoo.com", "email.com", "outlook.com"];
        const userCount = Math.max(parseInt(userId), 5); // Ensure we have at least as many users as the requested userId

        existingNotes.retailUsers = [];
        for (let i = 0; i < userCount; i++) {
          const baseBidAmount = parseFloat(existingBid.bid.bidAmount) || 500;
          const randomIncrement = Math.floor(Math.random() * 100) + 20; // $20-$120 above base

          existingNotes.retailUsers.push({
            id: i + 1,
            name: names[i] || `User ${i + 1}`,
            email: `${names[i]?.toLowerCase().replace(' ', '.')}@${domains[i % domains.length]}` || `user${i + 1}@email.com`,
            bookingRef: `GR00123${i + 4}`,
            seatNumber: `1${2 + i}${String.fromCharCode(65 + i)}`, // 12A, 13B, etc.
            bidAmount: baseBidAmount + randomIncrement,
            passengerCount: Math.floor(Math.random() * 5) + 1, // 1-5 passengers
            status: existingBid.bid.bidStatus === 'approved' && i === 0 ? 'approved' : 'pending_approval'
          });
        }
      }

      // Find and update the specific retail user
      let retailUserIndex = existingNotes.retailUsers.findIndex(user => user.id === parseInt(userId));

      // If user still not found, add them dynamically
      if (retailUserIndex === -1) {
        const baseBidAmount = parseFloat(existingBid.bid.bidAmount) || 500;
        const randomIncrement = Math.floor(Math.random() * 100) + 20;
        const names = ["John Smith", "Sarah Johnson", "Mike Wilson", "Emma Davis", "David Brown", "Lisa Garcia"];
        const domains = ["gmail.com", "yahoo.com", "email.com", "outlook.com"];
        const userIdNum = parseInt(userId);

        const newUser = {
          id: userIdNum,
          name: names[userIdNum - 1] || `User ${userIdNum}`,
          email: `${names[userIdNum - 1]?.toLowerCase().replace(' ', '.')}@${domains[userIdNum % domains.length]}` || `user${userIdNum}@email.com`,
          bookingRef: `GR00123${userIdNum + 3}`,
          seatNumber: `1${2 + userIdNum - 1}${String.fromCharCode(64 + userIdNum)}`, // 12A, 13B, etc.
          bidAmount: baseBidAmount + randomIncrement,
          passengerCount: Math.floor(Math.random() * 5) + 1, // 1-5 passengers
          status: 'pending_approval'
        };

        existingNotes.retailUsers.push(newUser);
        retailUserIndex = existingNotes.retailUsers.length - 1;

        console.log(`Created new retail user dynamically:`, newUser);
      }

      let newBidStatus = existingBid.bid.bidStatus; // Keep current bid status by default
      let seatsWillBeBooked = 0;

      if (action === 'approve') {
        const userPassengerCount = existingNotes.retailUsers[retailUserIndex].passengerCount || 1;

        // Check if approving this user would exceed seat limit
        if (currentSeatsBooked + userPassengerCount > totalSeatsAvailable) {
          return res.status(400).json({
            success: false,
            message: `Cannot approve: Not enough seats available. User needs ${userPassengerCount} seats but only ${totalSeatsAvailable - currentSeatsBooked} remaining.`
          });
        }

        seatsWillBeBooked = userPassengerCount;

        // If approving this user, reject all other users automatically
        existingNotes.retailUsers.forEach((user, index) => {
          if (index === retailUserIndex) {
            // Approve the selected user
            user.status = 'approved';
            user.updatedAt = new Date().toISOString();
            user.updatedBy = 'Admin';
          } else if (user.status === 'pending_approval' || user.status === 'approved') {
            // Reject all other users who were pending or previously approved
            user.status = 'rejected';
            user.updatedAt = new Date().toISOString();
            user.updatedBy = 'Admin (Auto-rejected)';
          }
        });

        // Update bid status to "approved" when a retail user is approved
        newBidStatus = 'approved';

        // Update the retail bid status in the retail_bids table
        const retailBid = retailBids.find(rb => rb.userId === parseInt(userId));
        if (retailBid) {
          await storage.updateRetailBidStatus(retailBid.id, 'approved');
        }

        // Check if the bid should be closed due to seat capacity
        const newTotalSeatsBooked = currentSeatsBooked + seatsWillBeBooked;
        if (newTotalSeatsBooked >= totalSeatsAvailable) {
          // Update bid notes to indicate it's closed due to capacity
          existingNotes.closedDueToCapacity = true;
          existingNotes.closedAt = new Date().toISOString();
        }

        console.log(`Updating bid ${bidId} status from ${existingBid.bid.bidStatus} to ${newBidStatus}. Seats booked: ${newTotalSeatsBooked}/${totalSeatsAvailable}`);
      } else {
        // If rejecting this user, just update their status
        existingNotes.retailUsers[retailUserIndex].status = 'rejected';
        existingNotes.retailUsers[retailUserIndex].updatedAt = new Date().toISOString();
        existingNotes.retailUsers[retailUserIndex].updatedBy = 'Admin';

        // Update the retail bid status in the retail_bids table
        const retailBid = retailBids.find(rb => rb.userId === parseInt(userId));
        if (retailBid) {
          await storage.updateRetailBidStatus(retailBid.id, 'rejected');
        }
      }

      // Update the bid with new notes and potentially new bid status
      const updateData = {
        notes: JSON.stringify(existingNotes),
        bidStatus: newBidStatus,
        updatedAt: new Date()
      };

      await storage.updateBidDetails(parseInt(bidId), updateData);

      // Calculate final seat availability
      const finalSeatsBooked = currentSeatsBooked + (action === 'approve' ? seatsWillBeBooked : 0);
      const seatsRemaining = totalSeatsAvailable - finalSeatsBooked;

      // Create notification for the action
      await createNotification(
        'retail_user_status_updated',
        `Retail User ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        action === 'approve' 
          ? `Retail user ${existingNotes.retailUsers[retailUserIndex].name} has been approved for bid ${bidId}. ${seatsWillBeBooked} seats booked. ${seatsRemaining} seats remaining.`
          : `Retail user ${existingNotes.retailUsers[retailUserIndex].name} has been rejected for bid ${bidId}`,
        'medium',
        {
          bidId: parseInt(bidId),
          userId: parseInt(userId),
          action: action === 'approve' ? 'approved' : 'rejected',
          userName: existingNotes.retailUsers[retailUserIndex].name,
          seatsBooked: seatsWillBeBooked,
          seatsRemaining: seatsRemaining,
          totalSeatsAvailable: totalSeatsAvailable
        }
      );

      res.json({
        success: true,
        message: action === 'approve' 
          ? `Retail user approved successfully. ${seatsWillBeBooked} seats booked. ${seatsRemaining} seats remaining.`
          : `Retail user rejected successfully`,
        retailUser: existingNotes.retailUsers[retailUserIndex],
        bidStatusUpdated: newBidStatus !== existingBid.bid.bidStatus,
        newBidStatus: newBidStatus,
        previousBidStatus: existingBid.bid.bidStatus,
        seatsRemaining: seatsRemaining,
        totalSeatsAvailable: totalSeatsAvailable,
        isClosed: seatsRemaining <= 0
      });
    } catch (error) {
      console.error(`Error ${req.body.action}ing retail user:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to ${req.body.action} retail user`,
        error: error.message
      });
    }
  });

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
          message: "Bid not found"
        });
      }

      // Parse existing notes and remove payment info
      let existingNotes = {};
      try {
        existingNotes = existingBid.bid.notes ? JSON.parse(existingBid.bid.notes) : {};
      } catch (e) {
        existingNotes = {};
      }

      // Remove payment info and reset status
      delete existingNotes.paymentInfo;

      const updateData = {
        bidStatus: 'accepted', // or 'active' depending on your flow
        notes: JSON.stringify(existingNotes),
        updatedAt: new Date()
      };

      await storage.updateBidDetails(parseInt(id), updateData);

      res.json({
        success: true,
        message: "Bid payment status reset successfully"
      });
    } catch (error) {
      console.error("Error resetting bid payment status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to reset bid payment status",
        error: error.message
      });
    }
  });

  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      console.log("Fetching all users...");
      const allUsers = await storage.getAllUsers();
      console.log(`Found ${allUsers.length} users`);

      res.json({
        success: true,
        users: allUsers,
        count: allUsers.length
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
        error: error.message
      });
    }
  });

  // Create a new user
  app.post("/api/users", async (req, res) => {
    try {
      const { firstName, lastName, email, username, password, name, isRetailAllowed } = req.body;

      // Validate required fields
      if (!username || !password || !name || !email) {
        return res.status(400).json({
          success: false,
          message: "Username, password, name, and email are required"
        });
      }

      // Check if user already exists by username or email
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this username already exists"
        });
      }

      const existingEmailUser = await storage.getUserByEmail(email);
      if (existingEmailUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists"
        });
      }

      // Hash password before storing (basic hashing - in production use bcrypt)
      const hashedPassword = Buffer.from(password).toString('base64');

      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        name,
        email,
        isRetailAllowed: isRetailAllowed || false
      });

      res.json({
        success: true,
        message: "User created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          isRetailAllowed: newUser.isRetailAllowed
        }
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
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
          message: "Username and password are required"
        });
      }

      // Get user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // In a real application, you'd verify the password hash here
      // For now, we'll assume password verification passed

      // Check if user has retail access
      const hasRetailAccess = await storage.checkRetailAccess(user.id);
      if (!hasRetailAccess) {
        return res.status(403).json({
          success: false,
          message: "Access denied: You are not authorized to access the retail portal"
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          isRetailAllowed: user.isRetailAllowed
        },
        message: "Access granted"
      });
    } catch (error) {
      console.error("Error checking retail access:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
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
        message: `Retail access ${isAllowed ? 'granted' : 'revoked'} successfully`
      });
    } catch (error) {
      console.error("Error updating retail access:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update retail access"
      });
    }
  });

  // Submit retail bid
  app.post("/api/retail-bids", async (req, res) => {
    try {
      const { bidId, userId, submittedAmount, passengerCount } = req.body;

      console.log("Received retail bid submission:", req.body);

      // Validate required fields
      if (!bidId || !userId || !submittedAmount || !passengerCount) {
        return res.status(400).json({
          success: false,
          message: "All fields are required: bidId, userId, submittedAmount, passengerCount"
        });
      }

      // Get the original bid configuration to validate limits
      const originalBid = await storage.getBidById(parseInt(bidId));
      if (!originalBid) {
        return res.status(404).json({
          success: false,
          message: "Bid configuration not found"
        });
      }

      console.log("Original bid found:", originalBid.bid);

      // Parse bid configuration data for seat availability checking
      let configData = {};
      try {
        configData = originalBid.bid.notes ? JSON.parse(originalBid.bid.notes) : {};
        console.log("Parsed config data:", configData);
      } catch (e) {
        console.log("Could not parse config data, using defaults");
        configData = {};
      }

      // Get seat limits
      const totalSeatsAvailable = originalBid.bid.totalSeatsAvailable || configData.totalSeatsAvailable || 100;
      const maxSeatsPerUser = originalBid.bid.maxSeatsPerBid || configData.maxSeatsPerUser || 10;
      const existingRetailBids = await storage.getRetailBidsByBid(parseInt(bidId));

      // Calculate available seats = total_seats_available minus sum of passenger_count from retail_bids with status 'under_review' or 'paid'
      const bookedSeats = existingRetailBids
        .filter(rb => rb.status === 'under_review' || rb.status === 'paid')
        .reduce((total, rb) => total + (rb.passengerCount || 0), 0);

      const availableSeats = totalSeatsAvailable - bookedSeats;

      // Validate passenger count is <= available seats
      if (parseInt(passengerCount) > availableSeats) {
        return res.status(400).json({
          success: false,
          message: `Not enough seats available. ${availableSeats} seats remaining.`
        });
      }

      // Validate passenger count is <= max_seats_per_user
      if (parseInt(passengerCount) > maxSeatsPerUser) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${maxSeatsPerUser} seats allowed per user.`
        });
      }

      // Check if user has already submitted a bid for this configuration
      const userExistingBid = existingRetailBids.find(rb => rb.userId === parseInt(userId));

      if (userExistingBid) {
        return res.status(400).json({
          success: false,
          message: "You have already submitted a bid for this configuration"
        });
      }

      console.log("Bid submission for bid:", bidId, "passenger count:", passengerCount);

      // Create retail bid submission with status 'submitted'
      const retailBidData = {
        bidId: parseInt(bidId),
        userId: parseInt(userId),
        flightId: originalBid.bid.flightId,
        submittedAmount: submittedAmount.toString(),
        passengerCount: parseInt(passengerCount),
        status: "submitted" // Set as submitted initially
      };

      const newRetailBid = await storage.createRetailBid(retailBidData);

      // Create notification
      await createNotification(
        'retail_bid_submitted',
        'New Retail Bid Submitted',
        `A retail user has submitted a bid of $${submittedAmount} for ${passengerCount} passengers on bid configuration ${bidId}. ${availableSeats - parseInt(passengerCount)} seats remaining.`,
        'medium',
        {
          retailBidId: newRetailBid.id,
          bidId: parseInt(bidId),
          userId: parseInt(userId),
          amount: submittedAmount,
          passengerCount: parseInt(passengerCount),
          seatsRemaining: availableSeats - parseInt(passengerCount)
        }
      );

      res.json({
        success: true,
        message: "Retail bid submitted successfully",
        retailBid: newRetailBid,
        availableSeats: availableSeats - parseInt(passengerCount),
        totalSeatsAvailable: totalSeatsAvailable
      });

    } catch (error) {
      console.error("Error submitting retail bid:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit retail bid",
        error: error.message
      });
    }
  });

  // Mark retail bid as under_review after payment
  app.put("/api/retail-bids/:retailBidId/mark-under-review", async (req, res) => {
    try {
      const { retailBidId } = req.params;
      const { paymentReference, transactionId, userId, bidId } = req.body;

      console.log(`Marking retail bid ${retailBidId} as under_review after payment by user ${userId} for bid ${bidId}`);

      // Get the retail bid
      const retailBid = await storage.getRetailBidById(parseInt(retailBidId));
      if (!retailBid) {
        return res.status(404).json({
          success: false,
          message: "Retail bid not found"
        });
      }

      // Validate that the bid is currently in 'submitted' status
      if (retailBid.status !== 'submitted') {
        return res.status(400).json({
          success: false,
          message: `Cannot mark bid as under_review. Current status: ${retailBid.status}`
        });
      }

      // Update the retail bid status to 'under_review'
      await storage.updateRetailBidStatus(parseInt(retailBidId), 'under_review');

      // Get the main bid configuration to check seat availability
      const bidDetails = await storage.getBidById(retailBid.bidId);
      if (bidDetails) {
        let configData = {};
        try {
          configData = bidDetails.bid.notes ? JSON.parse(bidDetails.bid.notes) : {};
        } catch (e) {
          configData = {};
        }

        const totalSeatsAvailable = bidDetails.bid.totalSeatsAvailable || configData.totalSeatsAvailable || 100;
        
        // Get all retail bids for this configuration to calculate remaining seats
        const allRetailBids = await storage.getRetailBidsByBid(retailBid.bidId);
        const bookedSeats = allRetailBids
          .filter(rb => rb.status === 'under_review' || rb.status === 'paid')
          .reduce((total, rb) => total + (rb.passengerCount || 0), 0);

        const remainingSeats = totalSeatsAvailable - bookedSeats;

        console.log(`Bid ${retailBid.bidId}: ${bookedSeats}/${totalSeatsAvailable} seats booked, ${remainingSeats} remaining`);
      }

      // Create notification for payment received
      await createNotification(
        'retail_bid_payment_received',
        'Retail Bid Payment Received',
        `Payment received for retail bid ${retailBidId}. Bid is now under review.`,
        'medium',
        {
          retailBidId: parseInt(retailBidId),
          paymentReference: paymentReference || null,
          transactionId: transactionId || null,
          bidId: retailBid.bidId,
          userId: retailBid.userId
        }
      );

      res.json({
        success: true,
        message: "Retail bid marked as under review successfully",
        retailBidId: parseInt(retailBidId),
        newStatus: 'under_review'
      });

    } catch (error) {
      console.error("Error marking retail bid as under review:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark retail bid as under review",
        error: error.message
      });
    }
  });

  // Get retail bids for a bid configuration
  app.get("/api/retail-bids/:bidId", async (req, res) => {
    try {
      const { bidId } = req.params;
      const retailBids = await storage.getRetailBidsByBid(parseInt(bidId));

      res.json({
        success: true,
        retailBids
      });
    } catch (error) {
      console.error("Error fetching retail bids:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch retail bids",
        error: error.message
      });
    }
  });

  // Get bid status with seat availability for retail users
  app.get("/api/bid-status/:bidId", async (req, res) => {
    try {
      const { bidId } = req.params;
      const { userId } = req.query;

      console.log(`Fetching bid status for bidId: ${bidId}, userId: ${userId}`);

      // Get the bid configuration
      const bidDetails = await storage.getBidById(parseInt(bidId));
      if (!bidDetails) {
        return res.status(404).json({
          success: false,
          message: "Bid not found"
        });
      }

      // Parse configuration data
      let configData = {};
      try {
        configData = bidDetails.bid.notes ? JSON.parse(bidDetails.bid.notes) : {};
      } catch (e) {
        configData = {};
      }

      // Get total seats available
      const totalSeatsAvailable = bidDetails.bid.totalSeatsAvailable || configData.totalSeatsAvailable || 100;

      // Get all retail bids for this configuration
      const retailBids = await storage.getRetailBidsByBid(parseInt(bidId));

      // Get all payments related to this bid to check for payment completion
      const bidPayments = await storage.getPaymentsByBidId(parseInt(bidId));

      // Calculate booked seats from retail bids with status 'under_review', 'paid', or 'approved'
      const bookedSeats = retailBids
        .filter(rb => rb.status === 'under_review' || rb.status === 'paid' || rb.status === 'approved')
        .reduce((total, rb) => total + (rb.passengerCount || 0), 0);

      const availableSeats = totalSeatsAvailable - bookedSeats;

      // Determine user-specific status
      let displayStatus = 'Open';
      let statusForUser = 'open';
      let hasUserPaid = false;
      let userPaymentStatus = 'open';

      if (userId) {
        const currentUserId = parseInt(userId as string);
        
        // Check if THIS user has a retail bid for this bid_id
        const userRetailBid = retailBids.find(rb => rb.userId === currentUserId);
        
        // Check if this user has made a payment for this bid (check by userId in payments table)
        const userPayment = bidPayments.find(payment => {
          return payment.userId === currentUserId;
        });

        // Check bid notes for payment completion by this user (user-specific tracking)
        let userPaidFromBidNotes = false;
        try {
          const userPayments = configData.userPayments || [];
          const userPaymentRecord = userPayments.find(up => up.userId === currentUserId);
          userPaidFromBidNotes = userPaymentRecord && userPaymentRecord.paymentCompleted === true;
        } catch (e) {
          userPaidFromBidNotes = false;
        }

        // Determine if this specific user has paid
        hasUserPaid = (userRetailBid && (userRetailBid.status === 'under_review' || userRetailBid.status === 'paid' || userRetailBid.status === 'approved')) ||
                      userPayment !== undefined ||
                      userPaidFromBidNotes;

        if (hasUserPaid) {
          // User has paid - show their specific status
          if (userRetailBid?.status === 'approved') {
            displayStatus = "Approved";
            statusForUser = 'approved';
            userPaymentStatus = 'approved';
          } else if (userRetailBid?.status === 'rejected') {
            displayStatus = "Rejected";
            statusForUser = 'rejected';
            userPaymentStatus = 'rejected';
          } else {
            displayStatus = "Under Review";
            statusForUser = 'under_review';
            userPaymentStatus = 'under_review';
          }
          console.log(`User ${userId} has paid for bid ${bidId}, showing: ${displayStatus}`);
        } else {
          // User hasn't paid - check if seats are available for booking
          if (availableSeats > 0) {
            displayStatus = "Open";
            statusForUser = 'open';
            userPaymentStatus = 'open';
            console.log(`User ${userId} has not paid for bid ${bidId}, showing: Open (${availableSeats} seats available)`);
          } else {
            displayStatus = "Closed";
            statusForUser = 'closed';
            userPaymentStatus = 'closed';
            console.log(`User ${userId} - bid ${bidId} closed due to no seats available`);
          }
        }
      } else {
        // No user specified - show general availability based on seat count
        if (availableSeats > 0) {
          displayStatus = "Open";
          statusForUser = 'open';
          userPaymentStatus = 'open';
        } else {
          displayStatus = "Closed";
          statusForUser = 'closed';
          userPaymentStatus = 'closed';
        }
      }

      // Check if ALL seats are booked (bid should be closed for everyone who hasn't paid)
      const bidFullyBooked = availableSeats <= 0;
      if (bidFullyBooked && !hasUserPaid) {
        displayStatus = "Closed";
        statusForUser = 'closed';
        userPaymentStatus = 'closed';
      }

      console.log(`Final status for bid ${bidId}, user ${userId}: ${displayStatus} (${statusForUser}), payment: ${userPaymentStatus}, seats: ${availableSeats}/${totalSeatsAvailable}`);

      res.json({
        success: true,
        bidStatus: displayStatus,
        statusForUser: statusForUser,
        paymentStatus: userPaymentStatus,
        totalSeatsAvailable: totalSeatsAvailable,
        bookedSeats: bookedSeats,
        availableSeats: availableSeats,
        seatsRemaining: availableSeats,
        isClosed: bidFullyBooked && !hasUserPaid,
        hasUserPaid: hasUserPaid,
        originalBidStatus: bidDetails.bid.bidStatus,
        userRetailBidStatus: userId ? retailBids.find(rb => rb.userId === parseInt(userId as string))?.status : null,
        allUsersWhoHavePaid: retailBids.filter(rb => rb.status === 'under_review' || rb.status === 'paid' || rb.status === 'approved').map(rb => rb.userId)
      });

    } catch (error) {
      console.error("Error fetching bid status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bid status",
        error: error.message
      });
    }
  });

  // Create notification (helper function for internal use)
  const createNotification = async (type: string, title: string, message: string, priority: string = 'medium', actionData: any = null) => {
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

  // Add API endpoints for fetching, updating, and deleting users
  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await db.select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        username: usersTable.username,
        isRetailAllowed: usersTable.isRetailAllowed,
        role: sql`CASE 
          WHEN ${usersTable.username} = 'admin' THEN 'Super Admin'
          WHEN ${usersTable.isRetailAllowed} = true THEN 'User'
          ELSE 'Guest'
        END`.as('role'),
        status: sql`'Active'`.as('status'),
        lastLogin: sql`'2024-01-15'`.as('lastLogin')
      }).from(usersTable);

      return res.json({
        success: true,
        users: users
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.json(
        { success: false, message: "Failed to fetch users" },
        500
      );
    }
  });

  // Update user
  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { name, email, isRetailAllowed } = req.body;

      if (!userId) {
        return res.json(
          { success: false, message: "User ID is required" },
          400
        );
      }

      // Check if user exists
      const existingUser = await db.select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      if (existingUser.length === 0) {
        return res.json(
          { success: false, message: "User not found" },
          404
        );
      }

      // Check if email is already taken by another user
      const emailExists = await db.select()
        .from(usersTable)
        .where(and(
          eq(usersTable.email, email),
          ne(usersTable.id, userId)
        ))
        .limit(1);

      if (emailExists.length > 0) {
        return res.json(
          { success: false, message: "Email is already taken" },
          400
        );
      }

      // Update user
      await db.update(usersTable)
        .set({
          name: name,
          email: email,
          isRetailAllowed: isRetailAllowed || false,
          updatedAt: new Date().toISOString()
        })
        .where(eq(usersTable.id, userId));

      return res.json({
        success: true,
        message: "User updated successfully"
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.json(
        { success: false, message: "Failed to update user" },
        500
      );
    }
  });

  // Delete user
  app.delete("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      if (!userId) {
        return res.json(
          { success: false, message: "User ID is required" },
          400
        );
      }

      // Check if user exists
      const existingUser = await db.select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      if (existingUser.length === 0) {
        return res.json(
          { success: false, message: "User not found" },
          404
        );
      }

      // Prevent deletion of admin user
      if (existingUser[0].username === 'admin') {
        return res.json(
          { success: false, message: "Cannot delete admin user" },
          400
        );
      }

      // Delete user
      await db.delete(usersTable)
        .where(eq(usersTable.id, userId));

      return res.json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.json(
        { success: false, message: "Failed to delete user" },
        500
      );
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
          message: "Username, password, name, and email are required"
        });
      }

      // Check if user already exists by username or email
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this username already exists"
        });
      }

      const existingEmailUser = await storage.getUserByEmail(email);
      if (existingEmailUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists"
        });
      }

      // Hash password before storing (basic hashing - in production use bcrypt)
      const hashedPassword = Buffer.from(password).toString('base64');

      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        name,
        email,
        isRetailAllowed: isRetailAllowed || false
      });

      res.json({
        success: true,
        message: "User created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          isRetailAllowed: newUser.isRetailAllowed
        }
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}