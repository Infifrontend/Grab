import { db } from "./db";
import {
  users,
  grabTUsers,
  grabTBids,
  deals,
  packages,
  bookings,
  searchRequests,
  flights,
  flightBookings,
  passengers,
  bids,
  payments,
  refunds,
  notifications,
  retailBids,
  grabTRetailBids,
  grabTBidPayments,
  type InsertUser,
  type InsertDeal,
  type InsertPackage,
  type InsertBooking,
  type InsertSearchRequest,
  type InsertFlight,
  type InsertFlightBooking,
  type InsertPassenger,
  type InsertBid,
  type InsertPayment,
  type InsertRefund,
  type User,
  type Deal,
  type Package,
  type Booking,
  type SearchRequest,
  type Flight,
  type FlightBooking,
  type Passenger,
  type Bid,
  type Payment,
  type Refund,
  type RetailBid,
  type InsertGrabTBidPayment,
  type GrabTBidPayment
} from "../shared/schema.js";
import { eq, and, gte, lte, like, or, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  checkRetailAccess(userId: number): Promise<boolean>;
  updateUserRetailAccess(userId: number, isAllowed: boolean): Promise<void>;
  getAllUsers(): Promise<User[]>;

  // Deals
  getDeals(): Promise<Deal[]>;
  getDeal(id: number): Promise<Deal | undefined>;

  // Packages
  getPackages(): Promise<Package[]>;
  searchPackages(destination?: string): Promise<Package[]>;

  // Legacy Bookings
  getBookings(userId?: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;

  // Search Requests
  createSearchRequest(request: InsertSearchRequest): Promise<void>;

  // Flights
  getFlights(origin?: string, destination?: string, departureDate?: Date): Promise<Flight[]>;
  getFlight(id: number): Promise<Flight | undefined>;
  createFlight(flight: InsertFlight): Promise<Flight>;
  updateFlightSeats(flightId: number, seatsBooked: number): Promise<void>;

  // Flight Bookings
  getFlightBookings(userId?: number): Promise<FlightBooking[]>;
  getFlightBooking(id: number): Promise<FlightBooking | undefined>;
  getFlightBookingByReference(reference: string): Promise<FlightBooking | undefined>;
  getFlightBookingByPNR(pnr: string): Promise<any>;
  createFlightBooking(booking: InsertFlightBooking): Promise<FlightBooking>;
  updateFlightBookingStatus(id: number, status: string, paymentStatus?: string): Promise<void>;
  updateBookingDetails(bookingId: number, updates: { specialRequests?: string }): Promise<void>;
  getRecentFlightBookings(limit?: number): Promise<FlightBooking[]>;

  // Passengers
  getPassengersByBooking(bookingId: number): Promise<Passenger[]>;
  createPassenger(passenger: InsertPassenger): Promise<Passenger>;
  updatePassenger(id: number, passenger: Partial<InsertPassenger>): Promise<void>;

  // Bids
  getBids(userId?: number, flightId?: number): Promise<Bid[]>;
  getBid(id: number): Promise<Bid | undefined>;
  createBid(bid: InsertBid): Promise<Bid>;
  updateBidStatus(id: number, status: string): Promise<void>;
  deleteBid(id: number): Promise<void>;
  getBidById(bidId: number): Promise<any>;

  // Payments
  getPaymentsByBooking(bookingId: number): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentByReference(reference: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: number, status: string, transactionId?: string, failureReason?: string): Promise<void>;

  // Refunds
  getRefundsByPayment(paymentId: number): Promise<Refund[]>;
  createRefund(refund: InsertRefund): Promise<Refund>;
  updateRefundStatus(id: number, status: string): Promise<void>;

  // Bids Statistics
  getBidStatistics(userId?: number): Promise<{
        totalBids: number;
        activeBids: number;
        acceptedBids: number;
        rejectedBids: number;
        completedBids: number;
        totalBidAmount: number;
        avgBidAmount: number;
  }>;

  // Payments Statistics
  getPaymentStatistics(userId?: number): Promise<{
        totalPayments: number;
        pendingPayments: number;
        upcomingPayments: number;
        refundsProcessed: number;
  }>;

  // Payment Management
  getPayments(userId?: number, statusFilter?: string): Promise<any[]>;
  getPaymentSchedule(userId?: number): Promise<any[]>;
  createPayment(paymentData: any): Promise<Payment>;

  updateBidDetails(bidId: number, updateData: any): Promise<any>;
  getPaymentsByBidId(bidId: number): Promise<Payment[]>;

  // Bid Payment Management (using grab_t_bid_payments)
  createBidPayment(paymentData: InsertGrabTBidPayment): Promise<GrabTBidPayment>;
  getBidPaymentsByUser(userId: number): Promise<GrabTBidPayment[]>;
  getBidPaymentsByRetailBid(retailBidId: number): Promise<GrabTBidPayment[]>;
  updateBidPaymentStatus(paymentId: number, status: number): Promise<void>;

  // Retail Bids
  createRetailBid(bid: InsertRetailBid): Promise<RetailBid>;
  getRetailBidsByBid(bidId: number): Promise<RetailBid[]>;
  getRetailBidsWithUsersByBid(bidId: number): Promise<any[]>;
  updateRetailBidStatus(retailBidId: number, status: string): Promise<any>;
  hasUserPaidForBid(bidId: number, userId: number): Promise<boolean>;
  getRetailBidById(retailBidId: number): Promise<any>; // Added this line
}

// DatabaseStorage is the only storage implementation now

export class DatabaseStorage implements IStorage {

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async checkRetailAccess(userId: number): Promise<boolean> {
    const result = await db
      .select({ isRetailAllowed: users.isRetailAllowed })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result[0]?.isRetailAllowed || false;
  }

  async updateUserRetailAccess(userId: number, isAllowed: boolean) {
    try {
      await db
        .update(users)
        .set({ isRetailAllowed: isAllowed })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error("Error updating user retail access:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      console.log("Executing getAllUsers query...");
      const allUsers = await db.select().from(users);
      console.log(`getAllUsers returned ${allUsers.length} users`);
      return allUsers;
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      throw error;
    }
  }

  async getDeals(): Promise<Deal[]> {
    return await db.select().from(deals);
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    const [deal] = await db.select().from(deals).where(eq(deals.id, id));
    return deal || undefined;
  }

  async getPackages(): Promise<Package[]> {
    return await db.select().from(packages);
  }

  async searchPackages(destination?: string): Promise<Package[]> {
    if (!destination) {
      return await db.select().from(packages);
    }

    const allPackages = await db.select().from(packages);
    return allPackages.filter(pkg =>
      pkg.location.toLowerCase().includes(destination.toLowerCase()) ||
      pkg.title.toLowerCase().includes(destination.toLowerCase())
    );
  }

  async getBookings(userId?: number): Promise<Booking[]> {
    if (!userId) {
      return await db.select().from(bookings);
    }

    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  async createSearchRequest(request: InsertSearchRequest): Promise<void> {
    try {
      // Create request without ID field to allow auto-increment
      await db.insert(searchRequests).values({
        origin: request.origin,
        destination: request.destination,
        departureDate: request.departureDate,
        returnDate: request.returnDate,
        passengers: request.passengers,
        cabin: request.cabin,
        tripType: request.tripType
      });
    } catch (error) {
      // If we get a duplicate key error, try to fix the sequence
      if (error.code === '23505' && error.constraint === 'search_requests_pkey') {
        console.log('Fixing search_requests sequence...');

        // Reset the sequence to the maximum ID + 1
        await db.execute(`
          SELECT setval('search_requests_id_seq', COALESCE((SELECT MAX(id) FROM search_requests), 0) + 1, false)
        `);

        // Try the insert again
        await db.insert(searchRequests).values({
          origin: request.origin,
          destination: request.destination,
          departureDate: request.departureDate,
          returnDate: request.returnDate,
          passengers: request.passengers,
          cabin: request.cabin,
          tripType: request.tripType
        });
      } else {
        throw error;
      }
    }
  }

  // Flights
  async getFlights(origin?: string, destination?: string, departureDate?: Date) {
    try {
      console.log(`Searching flights with params:`, { origin, destination, departureDate });

      let conditions = [];

      if (origin && origin.trim()) {
        conditions.push(eq(flights.origin, origin.trim()));
      }

      if (destination && destination.trim()) {
        conditions.push(eq(flights.destination, destination.trim()));
      }

      if (departureDate) {
        // For date filtering, we'll match flights on the same day
        const startOfDay = new Date(departureDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(departureDate);
        endOfDay.setHours(23, 59, 59, 999);

        console.log(`Date filtering between:`, { startOfDay, endOfDay });

        conditions.push(
          and(
            gte(flights.departureTime, startOfDay),
            lte(flights.departureTime, endOfDay)
          )
        );
      }

      let query = db.select().from(flights);

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      const result = await query;

      console.log(`Flight search returned ${result.length} flights`);
      if (result.length > 0) {
        console.log("Sample flight from results:", {
          id: result[0].id,
          flightNumber: result[0].flightNumber,
          origin: result[0].origin,
          destination: result[0].destination,
          departureTime: result[0].departureTime,
          price: result[0].price
        });
      }

      return result;
    } catch (error) {
      console.error("Error fetching flights:", error);
      throw error;
    }
  }

  async getReturnFlights(destination: string, origin: string, returnDate?: Date) {
    // For return flights, origin and destination are swapped
    return this.getFlights(destination, origin, returnDate);
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    const [flight] = await db.select().from(flights).where(eq(flights.id, id));
    return flight || undefined;
  }

  async createFlight(flight: InsertFlight): Promise<Flight> {
    const [newFlight] = await db.insert(flights).values(flight).returning();
    return newFlight;
  }

  async updateFlightSeats(flightId: number, seatsBooked: number): Promise<void> {
    const flight = await this.getFlight(flightId);
    if (flight) {
      const newAvailableSeats = flight.availableSeats - seatsBooked;
      await db.update(flights)
        .set({ availableSeats: newAvailableSeats })
        .where(eq(flights.id, flightId));
    }
  }

  // Flight Bookings
  async getFlightBookings(userId?: number): Promise<FlightBooking[]> {
    if (!userId) {
      return await db.select().from(flightBookings);
    }
    return await db.select().from(flightBookings).where(eq(flightBookings.userId, userId));
  }

  async getRecentFlightBookings(limit: number = 5): Promise<FlightBooking[]> {
    return await db
      .select()
      .from(flightBookings)
      .orderBy(desc(flightBookings.bookedAt))
      .limit(limit);
  }

  async getFlightBooking(id: number): Promise<FlightBooking | undefined> {
    const [booking] = await db.select().from(flightBookings).where(eq(flightBookings.id, id));
    return booking || undefined;
  }

  async getFlightBookingByReference(reference: string): Promise<FlightBooking | undefined> {
    const [booking] = await db.select().from(flightBookings).where(eq(flightBookings.bookingReference, reference));
    return booking || undefined;
  }

  async getFlightBookingByPNR(pnr: string): Promise<any> {
    const [booking] = await db
      .select()
      .from(flightBookings)
      .where(eq(flightBookings.pnr, pnr))
      .limit(1);
    return booking;
  }

  // Generate unique PNR (Passenger Name Record)
  private generatePNR(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    // Generate format: A1B2C3 (letter-digit-letter-digit-letter-digit)
    let pnr = '';
    for (let i = 0; i < 3; i++) {
      const letter = letters[Math.floor(Math.random() * letters.length)];
      const digit = digits[Math.floor(Math.random() * digits.length)];
      pnr += letter + digit;
    }

    return pnr;
  }

  async createFlightBooking(bookingData: InsertFlightBooking): Promise<FlightBooking> {
    // Generate unique PNR if not provided
    let pnr = bookingData.pnr;
    if (!pnr) {
      let isUnique = false;
      while (!isUnique) {
        pnr = this.generatePNR();
        // Check if PNR already exists
        const existingBooking = await db
          .select()
          .from(flightBookings)
          .where(eq(flightBookings.pnr, pnr))
          .limit(1);

        if (existingBooking.length === 0) {
          isUnique = true;
        }
      }
    }

    const bookingWithPNR = { ...bookingData, pnr };

    try {
      const [newBooking] = await db.insert(flightBookings).values(bookingWithPNR).returning();
      return newBooking;
    } catch (error) {
      // If we get a duplicate key error, try to fix the sequence
      if (error.code === '23505' && error.constraint === 'flight_bookings_pkey') {
        console.log('Fixing flight_bookings sequence...');

        // Reset the sequence to the maximum ID + 1
        await db.execute(`
          SELECT setval('flight_bookings_id_seq', COALESCE((SELECT MAX(id) FROM flight_bookings), 0) + 1, false)
        `);

        // Try the insert again
        const [newBooking] = await db.insert(flightBookings).values(bookingWithPNR).returning();
        return newBooking;
      } else {
        throw error;
      }
    }
  }

  async updateFlightBookingStatus(id: number, status: string, paymentStatus?: string): Promise<void> {
    const updateData: any = { bookingStatus: status, updatedAt: new Date() };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    await db.update(flightBookings).set(updateData).where(eq(flightBookings.id, id));
  }

  async updateBookingDetails(bookingId: number, updates: { specialRequests?: string }): Promise<void> {
    try {
      console.log(`Updating booking ${bookingId} with:`, updates);

      const result = await db.update(flightBookings)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(flightBookings.id, bookingId))
        .returning();

      if (result.length === 0) {
        throw new Error(`No booking found with ID ${bookingId}`);
      }

      console.log(`Successfully updated booking ${bookingId}`);
    } catch (error) {
      console.error(`Error updating booking ${bookingId}:`, error);
      throw error;
    }
  }

  async updateBookingPassengerCount(bookingId: number, passengerCount: number) {
    return await db
      .update(flightBookings)
      .set({
        passengerCount: passengerCount,
        updatedAt: new Date()
      })
      .where(eq(flightBookings.id, bookingId));
  }

  // Passengers
  async getPassengersByBooking(bookingId: number): Promise<Passenger[]>{
    return await db.select().from(passengers).where(eq(passengers.bookingId, bookingId));
  }

  async createPassenger(passenger: InsertPassenger): Promise<Passenger> {
    try {
      const [newPassenger] = await db.insert(passengers).values(passenger).returning();
      return newPassenger;
    } catch (error) {
      // If we get a duplicate key error, try to fix the sequence
      if (error.code === '23505' && error.constraint === 'passengers_pkey') {
        console.log('Fixing passengers sequence...');

        // Reset the sequence to the maximum ID + 1
        await db.execute(`
          SELECT setval('passengers_id_seq', COALESCE((SELECT MAX(id) FROM passengers), 0) + 1, false)
        `);

        // Try the insert again
        const [newPassenger] = await db.insert(passengers).values(passenger).returning();
        return newPassenger;
      } else {
        throw error;
      }
    }
  }

  async updatePassenger(id: number, passenger: Partial<InsertPassenger>): Promise<void> {
    await db.update(passengers).set(passenger).where(eq(passengers.id, id));
  }

  // Bids
  async getBids(userId?: number): Promise<Bid[]> {
    try {
      let query = db
        .select({
          id: grabTBids.id,
          userId: grabTBids.userId,
          flightId: grabTBids.flightId,
          bidAmount: grabTBids.bidAmount,
          passengerCount: grabTBids.passengerCount,
          bidStatus: grabTBids.bidStatus,
          validUntil: grabTBids.validUntil,
          notes: grabTBids.notes,
          totalSeatsAvailable: grabTBids.totalSeatsAvailable,
          minSeatsPerBid: grabTBids.minSeatsPerBid,
          maxSeatsPerBid: grabTBids.maxSeatsPerBid,
          createdAt: grabTBids.createdAt,
          updatedAt: grabTBids.updatedAt,
          flight: {
            id: flights.id,
            flightNumber: flights.flightNumber,
            airline: flights.airline,
            origin: flights.origin,
            destination: flights.destination,
            departureTime: flights.departureTime,
            price: flights.price,
          },
          user: {
            id: grabTUsers.id,
            username: grabTUsers.username,
            name: grabTUsers.name,
          },
        })
        .from(grabTBids)
        .leftJoin(flights, eq(grabTBids.flightId, flights.id))
        .leftJoin(grabTUsers, eq(grabTBids.userId, grabTUsers.id));

      if (userId) {
        query = query.where(eq(grabTBids.userId, userId));
      }

      const results = await query.orderBy(desc(grabTBids.createdAt));
      return results;
    } catch (error) {
      console.error("Error getting bids:", error);
      throw error;
    }
  }

  async getBid(id: number): Promise<Bid | undefined> {
    const [bid] = await db.select().from(grabTBids).where(eq(grabTBids.id, id));
    return bid || undefined;
  }

  async createBid(bidData: InsertBid): Promise<Bid> {
    try {
      console.log("Creating bid with data:", bidData);

      // Validate required fields before insertion
      if (!bidData.userId || !bidData.flightId || !bidData.bidAmount || !bidData.bidStatus) {
        throw new Error("Missing required fields for bid creation");
      }

      // Ensure validUntil is a proper Date object
      if (bidData.validUntil && !(bidData.validUntil instanceof Date)) {
        bidData.validUntil = new Date(bidData.validUntil);
      }

      // Map bidData to match grab_t_bids schema
      const mappedBidData = {
        userId: bidData.userId,
        flightId: bidData.flightId,
        bidAmount: bidData.bidAmount,
        passengerCount: bidData.passengerCount,
        bidStatus: bidData.bidStatus,
        validUntil: bidData.validUntil,
        totalSeatsAvailable: bidData.totalSeatsAvailable,
        minSeatsPerBid: bidData.minSeatsPerBid,
        maxSeatsPerBid: bidData.maxSeatsPerBid,
        notes: bidData.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const [bid] = await db
        .insert(grabTBids)
        .values(mappedBidData)
        .returning();

      console.log("Bid created successfully:", bid);
      return bid;
    } catch (error) {
      // If we get a sequence error, try to fix it
      if (error.message.includes('null value in column "id"') || error.message.includes('grab_t_bids_id_seq')) {
        console.log('Fixing grab_t_bids sequence...');

        try {
          // Create the sequence if it doesn't exist
          await db.execute(`
            CREATE SEQUENCE IF NOT EXISTS grab_t_bids_id_seq;
          `);

          // Set the sequence to the correct value
          await db.execute(`
            SELECT setval('grab_t_bids_id_seq', COALESCE((SELECT MAX(id) FROM grab_t_bids), 0) + 1, false);
          `);

          // Alter the table to use the sequence
          await db.execute(`
            ALTER TABLE grab_t_bids ALTER COLUMN id SET DEFAULT nextval('grab_t_bids_id_seq');
          `);

          console.log('grab_t_bids sequence fixed, retrying bid creation...');

          // Try the insert again with proper mapping
          const mappedBidData = {
            userId: bidData.userId,
            flightId: bidData.flightId,
            bidAmount: bidData.bidAmount,
            passengerCount: bidData.passengerCount,
            bidStatus: bidData.bidStatus,
            validUntil: bidData.validUntil,
            totalSeatsAvailable: bidData.totalSeatsAvailable,
            minSeatsPerBid: bidData.minSeatsPerBid,
            maxSeatsPerBid: bidData.maxSeatsPerBid,
            notes: bidData.notes,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const [bid] = await db
            .insert(grabTBids)
            .values(mappedBidData)
            .returning();

          console.log("Bid created successfully after sequence fix:", bid);
          return bid;
        } catch (sequenceError) {
          console.error("Error fixing sequence:", sequenceError);
          throw error; // Throw original error
        }
      } else {
        console.error("Error creating bid:", error);
        throw error;
      }
    }
  }

  async updateBidStatus(id: number, status: string): Promise<void> {
    console.log(`Updating bid ${id} status to ${status}`);
    await db.update(grabTBids).set({ bidStatus: status, updatedAt: new Date() }).where(eq(grabTBids.id, id));
  }

  async deleteBid(id: number): Promise<void> {
    await db.delete(grabTBids).where(eq(grabTBids.id, id));
  }

  // Payments
  async getPaymentsByBooking(bookingId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.bookingId, bookingId));
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getPaymentByReference(reference: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.paymentReference, reference));
    return payment || undefined;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePaymentStatus(id: number, status: string, transactionId?: string, failureReason?: string): Promise<void> {
    const updateData: any = { paymentStatus: status };
    if (status === 'completed') {
      updateData.processedAt = new Date();
    }
    if (transactionId) {
      updateData.transactionId = transactionId;
    }
    if (failureReason) {
      updateData.failureReason = failureReason;
    }
    await db.update(payments).set(updateData).where(eq(payments.id, id));
  }

  // Refunds
  async getRefundsByPayment(paymentId: number): Promise<Refund[]> {
    return await db.select().from(refunds).where(eq(refunds.paymentId, paymentId));
  }

  async createRefund(refund: InsertRefund): Promise<Refund> {
    const [newRefund] = await db.insert(refunds).values(refund).returning();
    return newRefund;
  }

  async updateRefundStatus(id: number, status: string): Promise<void> {
    const updateData: any = { refundStatus: status };
    if (status === 'completed') {
      updateData.processedAt = new Date();
    }
    await db.update(refunds).set(updateData).where(eq(refunds.id, id));
  }

  async getBidStatistics(userId?: number): Promise<{
        totalBids: number;
        activeBids: number;
        acceptedBids: number;
        rejectedBids: number;
        completedBids: number;
        totalBidAmount: number;
        avgBidAmount: number;
  }> {
    try {
      let query = db.select().from(grabTBids);

      if (userId) {
        query = query.where(eq(grabTBids.userId, userId));
      }

      const allBids = await query;

      const totalBids = allBids.length;
      const activeBids = allBids.filter(bid => bid.bidStatus === 'active').length;
      const acceptedBids = allBids.filter(bid => bid.bidStatus === 'accepted' || bid.bidStatus === 'approved').length;
      const rejectedBids = allBids.filter(bid => bid.bidStatus === 'rejected').length;
      const completedBids = allBids.filter(bid => bid.bidStatus === 'completed').length;

      const totalBidAmount = allBids.reduce((sum, bid) => {
        return sum + (parseFloat(bid.bidAmount?.toString() || "0"));
      }, 0);

      const avgBidAmount = totalBids > 0 ? totalBidAmount / totalBids : 0;

      return {
        totalBids,
        activeBids,
        acceptedBids,
        rejectedBids,
        completedBids,
        totalBidAmount,
        avgBidAmount
      };
    } catch (error) {
      console.error("Error getting bid statistics:", error);
      throw error;
    }
  }

  async getPaymentStatistics(userId?: number) {
    try {
      // Get all payments
      let paymentsQuery = db
        .select({
          amount: payments.amount,
          status: payments.paymentStatus,
          createdAt: payments.createdAt,
          bookingId: payments.bookingId
        })
        .from(payments);

      if (userId) {
        paymentsQuery = paymentsQuery
          .innerJoin(flightBookings, eq(payments.bookingId, flightBookings.id))
          .where(eq(flightBookings.userId, userId));
      }

      const allPayments = await paymentsQuery;

      // Calculate totals
      const totalPayments = allPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);

      const pendingPayments = allPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);

      // Calculate upcoming payments (next 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const upcomingPayments = allPayments
        .filter(p => p.status === 'pending' && new Date(p.createdAt) <= thirtyDaysFromNow)
        .reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);

      // Get refunds
      const allRefunds = await db
        .select({
          amount: refunds.refundAmount,
          status: refunds.refundStatus
        })
        .from(refunds);

      const refundsProcessed = allRefunds
        .filter(r => r.status === 'completed')
        .reduce((sum, refund) => sum + parseFloat(refund.refundAmount.toString()), 0);

      return {
        totalPayments,
        pendingPayments,
        upcomingPayments,
        refundsProcessed
      };
    } catch (error) {
      console.error('Error calculating payment statistics:', error);
      return {
        totalPayments: 0,
        pendingPayments: 0,
        upcomingPayments: 0,
        refundsProcessed: 0
      };
    }
  }

  async getPayments(userId?: number, statusFilter?: string) {
    try {
      let query = db
        .select({
          id: payments.id,
          paymentReference: payments.paymentReference,
          amount: payments.amount,
          paymentMethod: payments.paymentMethod,
          paymentStatus: payments.paymentStatus,
          transactionId: payments.transactionId,
          createdAt: payments.createdAt,
          bookingReference: flightBookings.bookingReference,
          bookingId: flightBookings.id
        })
        .from(payments)
        .innerJoin(flightBookings, eq(payments.bookingId, flightBookings.id));

      if (userId) {
        query = query.where(eq(flightBookings.userId, userId));
      }

      const allPayments = await query;

      // Filter by status if provided
      let filteredPayments = allPayments;
      if (statusFilter && statusFilter !== 'All Status') {
        filteredPayments = allPayments.filter(p =>
          p.paymentStatus.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      // Transform to match frontend expectations
      return filteredPayments.map(payment => ({
        key: payment.id.toString(),
        paymentId: payment.paymentReference,
        bookingId: payment.bookingReference,
        date: payment.createdAt.toISOString().split('T')[0],
        amount: `₹${parseFloat(payment.amount.toString()).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        type: this.getPaymentType(parseFloat(payment.amount.toString())),
        status: this.capitalizeFirst(payment.paymentStatus),
        method: this.formatPaymentMethod(payment.paymentMethod),
        transactionId: payment.transactionId || 'N/A'
      }));
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  }

  async getPaymentSchedule(userId?: number) {
    try {
      // Get bookings with pending payments
      let query = db
        .select({
          bookingId: flightBookings.id,
          bookingReference: flightBookings.bookingReference,
          totalAmount: flightBookings.totalAmount,
          paymentStatus: flightBookings.paymentStatus,
          bookedAt: flightBookings.bookedAt
        })
        .from(flightBookings);

      if (userId) {
        query = query.where(eq(flightBookings.userId, userId));
      }

      const bookings = await query;

      // Generate scheduled payments for pending bookings
      const scheduleData = [];
      let scheduleId = 1000;

      for (const booking of bookings) {
        if (booking.paymentStatus === 'pending') {
          const totalAmount = parseFloat(booking.totalAmount.toString());
          const firstPayment = totalAmount * 0.3; // 30% deposit
          const secondPayment = totalAmount * 0.7; // Remaining 70%

          // First payment due immediately
          scheduleData.push({
            key: scheduleId++,
            paymentId: `SCH-${scheduleId}`,
            bookingId: booking.bookingReference,
            dueDate: new Date().toISOString().split('T')[0],
            amount: `₹${firstPayment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            status: 'Due'
          });

          // Second payment due 30 days later
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 30);
          scheduleData.push({
            key: scheduleId++,
            paymentId: `SCH-${scheduleId}`,
            bookingId: booking.bookingReference,
            dueDate: futureDate.toISOString().split('T')[0],
            amount: `₹${secondPayment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            status: 'Upcoming'
          });
        }
      }

      return scheduleData;
    } catch (error) {
      console.error('Error fetching payment schedule:', error);
      return [];
    }
  }

  async createPayment(paymentData: any) {
    try {
      // Generate payment reference if not provided
      const paymentReference = paymentData.paymentReference || `PAY-${new Date().getFullYear()}-${nanoid(6)}`;

      const [payment] = await db.insert(payments).values({
        bookingId: paymentData.bookingId || null,
        userId: paymentData.userId || 1,
        paymentReference: paymentReference,
        amount: paymentData.amount,
        currency: paymentData.currency || 'USD',
        paymentMethod: paymentData.paymentMethod,
        paymentStatus: paymentData.paymentStatus || 'pending',
        transactionId: paymentData.transactionId,
        paymentGateway: paymentData.paymentGateway,
        processedAt: paymentData.processedAt || new Date(),
        createdAt: paymentData.createdAt || new Date()
      }).returning();

      return payment;
    } catch (error) {
      // If we get a duplicate key error, try to fix the sequence
      if (error.code === '23505' && error.constraint === 'payments_pkey') {
        console.log('Fixing payments sequence...');

        // Reset the sequence to the maximum ID + 1
        await db.execute(`
          SELECT setval('payments_id_seq', COALESCE((SELECT MAX(id) FROM payments), 0) + 1, false);
        `);

        // Try the insert again
        const paymentReference = paymentData.paymentReference || `PAY-${new Date().getFullYear()}-${nanoid(6)}`;

        const [payment] = await db.insert(payments).values({
          bookingId: paymentData.bookingId || null,
          userId: paymentData.userId || 1,
          paymentReference: paymentReference,
          amount: paymentData.amount,
          currency: paymentData.currency || 'USD',
          paymentMethod: paymentData.paymentMethod,
          paymentStatus: paymentData.paymentStatus || 'pending',
          transactionId: paymentData.transactionId,
          paymentGateway: paymentData.paymentGateway,
          processedAt: paymentData.processedAt || new Date(),
          createdAt: paymentData.createdAt || new Date()
        }).returning();

        return payment;
      } else {
        console.error('Error creating payment:', error);
        throw error;
      }
    }
  }

  private getPaymentType(amount: number): string {
    if (amount < 1000) return 'Deposit';
    if (amount < 3000) return 'Partial Payment';
    return 'Full Payment';
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private formatPaymentMethod(method: string): string {
    const methodMap: { [key: string]: string } = {
      'credit_card': 'Credit Card',
      'debit_card': 'Debit Card',
      'bank_transfer': 'Bank Transfer',
      'paypal': 'PayPal'
    };
    return methodMap[method] || method;
  }

  async seedPaymentData() {
    try {
      // Get existing bookings to create payments for
      const existingBookings = await db.select().from(flightBookings).limit(5);

      if (existingBookings.length === 0) {
        console.log('No bookings found to create payments for');
        return;
      }

      const samplePayments = [
        {
          bookingId: existingBookings[0].id,
          paymentReference: `PAY-2024-${nanoid(6)}`,
          amount: '2500.00',
          currency: 'INR',
          paymentMethod: 'credit_card',
          paymentStatus: 'completed',
          transactionId: 'txn_' + nanoid(8),
          paymentGateway: 'stripe'
        },
        {
          bookingId: existingBookings[1]?.id || existingBookings[0].id,
          paymentReference: `PAY-2024-${nanoid(6)}`,
          amount: '1500.00',
          currency: 'INR',
          paymentMethod: 'bank_transfer',
          paymentStatus: 'completed',
          transactionId: 'txn_' + nanoid(8),
          paymentGateway: 'bank'
        },
        {
          bookingId: existingBookings[2]?.id || existingBookings[0].id,
          paymentReference: `PAY-2024-${nanoid(6)}`,
          amount: '3200.00',
          currency: 'INR',
          paymentMethod: 'credit_card',
          paymentStatus: 'pending',
          transactionId: 'txn_' + nanoid(8),
          paymentGateway: 'stripe'
        }
      ];

      for (const payment of samplePayments) {
        await db.insert(payments).values({
          ...payment,
          createdAt: new Date()
        });
      }

      // Create sample refunds
      const sampleRefunds = [
        {
          paymentId: 1, // Assuming first payment ID
          refundReference: `REF-2024-${nanoid(6)}`,
          refundAmount: '500.00',
          refundReason: 'Cancellation',
          refundStatus: 'completed'
        }
      ];

      for (const refund of sampleRefunds) {
        await db.insert(refunds).values({
          ...refund,
          createdAt: new Date()
        });
      }

      console.log('Sample payment data seeded successfully');
    } catch (error) {
      console.error('Error seeding payment data:', error);
    }
  }

  async getBids(userId?: number): Promise<Bid[]> {
    try {
      let query = db
        .select({
          id: grabTBids.id,
          userId: grabTBids.userId,
          flightId: grabTBids.flightId,
          bidAmount: grabTBids.bidAmount,
          passengerCount: grabTBids.passengerCount,
          bidStatus: grabTBids.bidStatus,
          validUntil: grabTBids.validUntil,
          notes: grabTBids.notes,
          totalSeatsAvailable: grabTBids.totalSeatsAvailable,
          minSeatsPerBid: grabTBids.minSeatsPerBid,
          maxSeatsPerBid: grabTBids.maxSeatsPerBid,
          createdAt: grabTBids.createdAt,
          updatedAt: grabTBids.updatedAt,
          flight: {
            id: flights.id,
            flightNumber: flights.flightNumber,
            airline: flights.airline,
            origin: flights.origin,
            destination: flights.destination,
            departureTime: flights.departureTime,
            price: flights.price,
          },
          user: {
            id: grabTUsers.id,
            username: grabTUsers.username,
            name: grabTUsers.name,
          },
        })
        .from(grabTBids)
        .leftJoin(flights, eq(grabTBids.flightId, flights.id))
        .leftJoin(grabTUsers, eq(grabTBids.userId, grabTUsers.id));

      if (userId) {
        query = query.where(eq(grabTBids.userId, userId));
      }

      const results = await query.orderBy(desc(grabTBids.createdAt));
      return results;
    } catch (error) {
      console.error("Error getting bids:", error);
      throw error;
    }
  }

  async createBid(bidData: InsertBid): Promise<Bid> {
    try {
      console.log("Creating bid with data:", bidData);

      // Validate required fields before insertion
      if (!bidData.userId || !bidData.flightId || !bidData.bidAmount || !bidData.bidStatus) {
        throw new Error("Missing required fields for bid creation");
      }

      // Ensure validUntil is a proper Date object
      if (bidData.validUntil && !(bidData.validUntil instanceof Date)) {
        bidData.validUntil = new Date(bidData.validUntil);
      }

      // Map bidData to match grab_t_bids schema
      const mappedBidData = {
        userId: bidData.userId,
        flightId: bidData.flightId,
        bidAmount: bidData.bidAmount,
        passengerCount: bidData.passengerCount,
        bidStatus: bidData.bidStatus,
        validUntil: bidData.validUntil,
        totalSeatsAvailable: bidData.totalSeatsAvailable,
        minSeatsPerBid: bidData.minSeatsPerBid,
        maxSeatsPerBid: bidData.maxSeatsPerBid,
        notes: bidData.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const [bid] = await db
        .insert(grabTBids)
        .values(mappedBidData)
        .returning();

      console.log("Bid created successfully:", bid);
      return bid;
    } catch (error) {
      // If we get a sequence error, try to fix it
      if (error.message.includes('null value in column "id"') || error.message.includes('grab_t_bids_id_seq')) {
        console.log('Fixing grab_t_bids sequence...');

        try {
          // Create the sequence if it doesn't exist
          await db.execute(`
            CREATE SEQUENCE IF NOT EXISTS grab_t_bids_id_seq;
          `);

          // Set the sequence to the correct value
          await db.execute(`
            SELECT setval('grab_t_bids_id_seq', COALESCE((SELECT MAX(id) FROM grab_t_bids), 0) + 1, false);
          `);

          // Alter the table to use the sequence
          await db.execute(`
            ALTER TABLE grab_t_bids ALTER COLUMN id SET DEFAULT nextval('grab_t_bids_id_seq');
          `);

          console.log('grab_t_bids sequence fixed, retrying bid creation...');

          // Try the insert again with proper mapping
          const mappedBidData = {
            userId: bidData.userId,
            flightId: bidData.flightId,
            bidAmount: bidData.bidAmount,
            passengerCount: bidData.passengerCount,
            bidStatus: bidData.bidStatus,
            validUntil: bidData.validUntil,
            totalSeatsAvailable: bidData.totalSeatsAvailable,
            minSeatsPerBid: bidData.minSeatsPerBid,
            maxSeatsPerBid: bidData.maxSeatsPerBid,
            notes: bidData.notes,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const [bid] = await db
            .insert(grabTBids)
            .values(mappedBidData)
            .returning();

          console.log("Bid created successfully after sequence fix:", bid);
          return bid;
        } catch (sequenceError) {
          console.error("Error fixing sequence:", sequenceError);
          throw error; // Throw original error
        }
      } else {
        console.error("Error creating bid:", error);
        throw error;
      }
    }
  }

  async getBidById(bidId: number) {
    try {
      console.log(`Looking up bid with ID: ${bidId}`);

      if (!bidId || isNaN(bidId) || bidId <= 0) {
        console.error(`Invalid bid ID provided: ${bidId}`);
        return null;
      }

      const result = await db
        .select({
          bid: {
            id: grabTBids.id,
            userId: grabTBids.userId,
            flightId: grabTBids.flightId,
            bidAmount: grabTBids.bidAmount,
            passengerCount: grabTBids.passengerCount,
            bidStatus: grabTBids.bidStatus,
            validUntil: grabTBids.validUntil,
            notes: grabTBids.notes,
            totalSeatsAvailable: grabTBids.totalSeatsAvailable,
            minSeatsPerBid: grabTBids.minSeatsPerBid,
            maxSeatsPerBid: grabTBids.maxSeatsPerBid,
            createdAt: grabTBids.createdAt,
            updatedAt: grabTBids.updatedAt,
          },
          flight: {
            id: flights.id,
            flightNumber: flights.flightNumber,
            airline: flights.airline,
            origin: flights.origin,
            destination: flights.destination,
            departureTime: flights.departureTime,
            price: flights.price,
          },
          user: {
            id: grabTUsers.id,
            username: grabTUsers.username,
            name: grabTUsers.name,
          },
        })
        .from(grabTBids)
        .leftJoin(flights, eq(grabTBids.flightId, flights.id))
        .leftJoin(grabTUsers, eq(grabTBids.userId, grabTUsers.id))
        .where(eq(grabTBids.id, bidId))
        .limit(1);

      if (result.length === 0) {
        console.log(`No bid found with ID: ${bidId}`);

        // Debug: Show what bids actually exist
        const allBids = await db.select({ id: grabTBids.id, bidAmount: grabTBids.bidAmount, bidStatus: grabTBids.bidStatus }).from(grabTBids);
        console.log(`Existing bids in database:`, allBids);

        return null;
      }

      console.log(`Found bid ${bidId} successfully:`, {
        bidId: result[0].bid.id,
        bidAmount: result[0].bid.bidAmount,
        bidStatus: result[0].bid.bidStatus,
        hasUser: !!result[0].user,
        hasFlight: !!result[0].flight
      });

      return {
        bid: result[0].bid,
        user: result[0].user,
        flight: result[0].flight,
      };
    } catch (error) {
      console.error(`Error fetching bid ${bidId}:`, error);
      return null;
    }
  }

  async migrateToDomesticFlights() {
    console.log('Starting migration to domestic flights only...');

    try {
      // Delete all existing flights
      await db.delete(flights);
      console.log('Cleared existing flights');

      // Insert only domestic Indian flights
      const domesticFlights = [
        {
          flightNumber: 'AI101',
          airline: 'Air India',
          aircraft: 'Boeing 737',
          origin: 'Delhi',
          destination: 'Mumbai',
          departureTime: new Date('2024-01-20T06:00:00'),
          arrivalTime: new Date('2024-01-20T08:30:00'),
          duration: '2h 30m',
          price: '4500',
          availableSeats: 180,
          totalSeats: 180,
          cabin: 'economy',
          stops: 0
        },
        {
          flightNumber: 'SG201',
          airline: 'SpiceJet',
          aircraft: 'Boeing 737',
          origin: 'Mumbai',
          destination: 'Bangalore',
          departureTime: new Date('2024-01-20T09:00:00'),
          arrivalTime: new Date('2024-01-20T11:00:00'),
          duration: '2h 0m',
          price: '3800',
          availableSeats: 189,
          totalSeats: 189,
          cabin: 'economy',
          stops: 0
        },
        {
          flightNumber: 'UK301',
          airline: 'Vistara',
          aircraft: 'Airbus A320',
          origin: 'Delhi',
          destination: 'Bangalore',
          departureTime: new Date('2024-01-20T10:30:00'),
          arrivalTime: new Date('2024-01-20T13:00:00'),
          duration: '2h 30m',
          price: '5200',
          availableSeats: 164,
          totalSeats: 164,
          cabin: 'economy',
          stops: 0
        }
      ];

      // Insert domestic flights
      for (const flight of domesticFlights) {
        await db.insert(flights).values(flight);
      }

      console.log(`Successfully inserted ${domesticFlights.length} domestic flights`);

    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  async deletePassenger(passengerId: number): Promise<void> {
    await db.delete(passengers)
      .where(eq(passengers.id, passengerId));
  }

  async updateBookingPassengerCount(bookingId: number, passengerCount: number) {
    try {
      console.log(`Updating passenger count for booking ${bookingId} to ${passengerCount}`);

      const result = await db
        .update(flightBookings)
        .set({
          passengerCount: passengerCount,
          updatedAt: new Date()
        })
        .where(eq(flightBookings.id, bookingId))
        .returning();

      if (result.length === 0) {
        throw new Error(`No booking found with ID ${bookingId}`);
      }

      console.log(`Successfully updated passenger count for booking ${bookingId}`);
      return result[0];
    } catch (error) {
      console.error(`Error updating passenger count for booking ${bookingId}:`, error);
      throw error;
    }
  }

  async updateBidDetails(bidId: number, updateData: any): Promise<any> {
    // Ensure we handle the new seat configuration columns
    const sanitizedData = {
      ...updateData,
      totalSeatsAvailable: updateData.totalSeatsAvailable || undefined,
      minSeatsPerBid: updateData.minSeatsPerBid || undefined,
      maxSeatsPerBid: updateData.maxSeatsPerBid || undefined
    };

    const [updatedBid] = await db
      .update(grabTBids)
      .set(sanitizedData)
      .where(eq(grabTBids.id, bidId))
      .returning();
    return updatedBid;
  }

  async getPaymentsByUserId(userId: number) {
    try {
      const userPayments = await db
        .select()
        .from(payments)
        .innerJoin(flightBookings, eq(payments.bookingId, flightBookings.id))
        .where(eq(flightBookings.userId, userId));

      return userPayments.map(payment => ({
        ...payment.payments,
        booking: payment.flight_bookings
      }));
    } catch (error) {
      console.error("Error getting payments by user ID:", error);
      throw error;
    }
  }

  async getPaymentsByBidId(bidId: number) {
    try {
      console.log(`Fetching payments for bid ID: ${bidId}`);

      // Get all payments and filter those related to the bid
      const allPayments = await db.select().from(payments);

      // Filter payments that are related to this bid
      const bidRelatedPayments = allPayments.filter(payment => {
        // Check if payment reference or transaction ID contains the bid ID
        const paymentRef = payment.paymentReference || '';
        const transactionId = payment.transactionId || '';

        // Also check if bookingId matches (in case bid ID was used as booking ID)
        const bookingMatches = payment.bookingId && payment.bookingId.toString() === bidId.toString();

        // Check if payment reference contains the bid ID
        const refMatches = paymentRef.includes(bidId.toString()) || transactionId.includes(bidId.toString());

        return bookingMatches || refMatches;
      });

      console.log(`Found ${bidRelatedPayments.length} payments for bid ${bidId}`);
      return bidRelatedPayments;
    } catch (error) {
      console.error("Error getting payments by bid ID:", error);
      throw error;
    }
  }

  // Fix database sequences to prevent duplicate key errors
  async fixDatabaseSequences() {
    try {
      console.log('Fixing database sequences...');

      const sequences = [
        { name: 'search_requests_id_seq', table: 'search_requests' },
        { name: 'flights_id_seq', table: 'flights' },
        { name: 'flight_bookings_id_seq', table: 'flight_bookings' },
        { name: 'grab_t_bids_id_seq', table: 'grab_t_bids' },
        { name: 'payments_id_seq', table: 'payments' },
        { name: 'passengers_id_seq', table: 'passengers' },
        { name: 'users_id_seq', table: 'users' },
        { name: 'deals_id_seq', table: 'deals' },
        { name: 'packages_id_seq', table: 'packages' },
        { name: 'bookings_id_seq', table: 'bookings' },
        { name: 'refunds_id_seq', table: 'refunds' },
        { name: 'notifications_id_seq', table: 'notifications' }
      ];

      for (const seq of sequences) {
        try {
          // Create the sequence if it doesn't exist
          await db.execute(`
            CREATE SEQUENCE IF NOT EXISTS ${seq.name};
          `);

          // Set the sequence to the correct value
          await db.execute(`
            SELECT setval('${seq.name}', COALESCE((SELECT MAX(id) FROM ${seq.table}), 0) + 1, false);
          `);

          // Ensure the table uses the sequence
          await db.execute(`
            ALTER TABLE ${seq.table} ALTER COLUMN id SET DEFAULT nextval('${seq.name}');
          `);

          console.log(`Fixed sequence: ${seq.name}`);
        } catch (seqError) {
          console.log(`Could not fix sequence ${seq.name}:`, seqError.message);
          // Continue with other sequences
        }
      }

      console.log('Database sequences fixed successfully');
    } catch (error) {
      console.error('Error fixing database sequences:', error);
      throw error;
    }
  }

  // Get retail bids by bid ID
  async getRetailBidsByBid(bidId: number): Promise<any[]> {
    try {
      console.log(`Fetching retail bids for bid ID: ${bidId}`);

      const retailBidsList = await db
        .select()
        .from(grabTRetailBids)
        .where(eq(grabTRetailBids.rBidId, bidId))
        .orderBy(desc(grabTRetailBids.createdAt));

      console.log(`Found ${retailBidsList.length} retail bids for bid ${bidId}`);
      return retailBidsList;
    } catch (error) {
      console.error("Error getting retail bids by bid:", error);
      throw error;
    }
  }

  // Get retail bids with user information by bid ID
  async getRetailBidsWithUsersByBid(bidId: number): Promise<any[]> {
    try {
      console.log(`Fetching retail bids with user info for bid ID: ${bidId}`);

      const retailBidsWithUsers = await db
        .select({
          retailBid: grabTRetailBids,
          user: grabTUsers
        })
        .from(grabTRetailBids)
        .leftJoin(grabTUsers, eq(grabTRetailBids.rUserId, grabTUsers.id))
        .where(eq(grabTRetailBids.rBidId, bidId))
        .orderBy(desc(grabTRetailBids.createdAt));

      console.log(`Found ${retailBidsWithUsers.length} retail bids with user info for bid ${bidId}`);
      return retailBidsWithUsers;
    } catch (error) {
      console.error("Error getting retail bids with users by bid:", error);
      throw error;
    }
  }

  async updateRetailBidStatus(retailBidId: number, status: string): Promise<void> {
    try {
      console.log(`Updating retail bid ${retailBidId} status to: ${status}`);

      await db
        .update(grabTRetailBids)
        .set({
          status: status,
          updatedAt: new Date()
        })
        .where(eq(grabTRetailBids.id, retailBidId));

      console.log(`Retail bid ${retailBidId} status updated to: ${status}`);
    } catch (error) {
      console.error("Error updating retail bid status:", error);
      throw error;
    }
  }

  async getRetailBidById(retailBidId: number): Promise<RetailBid | null> {
    try {
      console.log(`Fetching retail bid with ID: ${retailBidId}`);

      const [retailBid] = await db
        .select()
        .from(grabTRetailBids)
        .where(eq(grabTRetailBids.id, retailBidId))
        .limit(1);

      return retailBid || null;
    } catch (error) {
      console.error("Error getting retail bid by ID:", error);
      throw error;
    }
  }

  // Retail Bids
  // Bid Payment Management using grab_t_bid_payments table
  async createBidPayment(paymentData: InsertGrabTBidPayment): Promise<GrabTBidPayment> {
    try {
      console.log("Creating bid payment with data:", paymentData);

      const [newPayment] = await db
        .insert(grabTBidPayments)
        .values(paymentData)
        .returning();

      console.log("Bid payment created successfully:", newPayment);
      return newPayment;
    } catch (error) {
      console.error("Error creating bid payment:", error);
      throw error;
    }
  }

  async getBidPaymentsByUser(userId: number): Promise<GrabTBidPayment[]> {
    try {
      const payments = await db
        .select()
        .from(grabTBidPayments)
        .where(eq(grabTBidPayments.rUserId, userId))
        .orderBy(desc(grabTBidPayments.createdAt));

      return payments;
    } catch (error) {
      console.error("Error getting bid payments by user:", error);
      throw error;
    }
  }

  async getBidPaymentsByRetailBid(retailBidId: number): Promise<GrabTBidPayment[]> {
    try {
      const payments = await db
        .select()
        .from(grabTBidPayments)
        .where(eq(grabTBidPayments.rRetailBidId, retailBidId))
        .orderBy(desc(grabTBidPayments.createdAt));

      return payments;
    } catch (error) {
      console.error("Error getting bid payments by retail bid:", error);
      throw error;
    }
  }

  async updateBidPaymentStatus(paymentId: number, status: number): Promise<void> {
    try {
      await db
        .update(grabTBidPayments)
        .set({ rStatus: status, processedAt: new Date() })
        .where(eq(grabTBidPayments.id, paymentId));

      console.log(`Bid payment ${paymentId} status updated to ${status}`);
    } catch (error) {
      console.error("Error updating bid payment status:", error);
      throw error;
    }
  }

  async createRetailBid(bid: InsertRetailBid): Promise<RetailBid> {
    try {
      console.log("Creating retail bid:", bid);

      // Validate that the user has retail access
      const hasRetailAccess = await this.checkRetailAccess(bid.userId);
      if (!hasRetailAccess) {
        throw new Error(`User ${bid.userId} does not have retail access.`);
      }

      // Get the original bid configuration to validate limits
      const bidConfiguration = await this.getBidById(bid.bidId);
      if (!bidConfiguration) {
        throw new Error(`Bid configuration with ID ${bid.bidId} not found.`);
      }

      // Parse configuration data for seat limits
      let configData = {};
      try {
        configData = bidConfiguration.bid.notes ? JSON.parse(bidConfiguration.bid.notes) : {};
      } catch (e) {
        console.log("Could not parse bid configuration notes, using defaults");
        configData = {};
      }

      // Get seat limits from bid configuration
      const totalSeatsAvailable = bidConfiguration.bid.totalSeatsAvailable || configData.totalSeatsAvailable || 100;
      const maxSeatsPerUser = bidConfiguration.bid.maxSeatsPerBid || configData.maxSeatsPerUser || 10;

      // Calculate seats already under review or paid for this bid
      const existingRetailBids = await this.getRetailBidsByBid(bid.bidId);
      const seatsUnderReviewOrPaid = existingRetailBids.reduce((sum, rb) => {
        if (rb.rStatus === 2 || rb.rStatus === 3 || rb.rStatus === 4) { // Assuming 2=under_review, 3=paid, 4=approved
          return sum + (rb.seatBooked || 0);
        }
        return sum;
      }, 0);

      const availableSeats = totalSeatsAvailable - seatsUnderReviewOrPaid;

      // Validation checks
      if (bid.passengerCount > maxSeatsPerUser) {
        throw new Error(`Passenger count (${bid.passengerCount}) exceeds maximum allowed per user (${maxSeatsPerUser}).`);
      }
      if (bid.passengerCount > availableSeats) {
        throw new Error(`Not enough seats available. ${availableSeats} seats remaining.`);
      }

      // Check if user has already submitted a bid for this configuration
      const userExistingBid = existingRetailBids.find(rb => rb.rUserId === bid.userId);
      if (userExistingBid) {
        throw new Error("You have already submitted a bid for this configuration");
      }

      console.log("Creating retail bid with validation:", {
        bidId: bid.bidId,
        userId: bid.userId,
        passengerCount: bid.passengerCount,
        submittedAmount: bid.submittedAmount,
        totalSeatsAvailable: totalSeatsAvailable,
        availableSeats: availableSeats,
        maxSeatsPerUser: maxSeatsPerUser
      });

      // Ensure the grab_t_retail_bids table exists and has the correct structure
      await db.execute(`
        CREATE TABLE IF NOT EXISTS "grab_t_retail_bids" (
          "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          "r_bid_id" integer NOT NULL,
          "user_id" integer NOT NULL,
          "flight_id" integer NOT NULL,
          "submitted_amount" numeric(10,2) NOT NULL,
          "passenger_count" integer NOT NULL,
          "status" text DEFAULT 'submitted' NOT NULL,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
        );
      `);

      // Insert the retail bid into the database
      const [newRetailBid] = await db
        .insert(grabTRetailBids)
        .values({
          rBidId: bid.bidId, // Use bidId from the InsertRetailBid interface
          rUserId: bid.userId, // Use rUserId instead of userId
          submittedAmount: bid.submittedAmount.toString(), // Ensure string format for decimal
          seatBooked: bid.passengerCount, // Use seatBooked instead of passengerCount
          rStatus: 1 // Set initial status (assuming 1 = submitted)
        })
        .returning();

      console.log("Retail bid created successfully:", newRetailBid);
      return newRetailBid;
    } catch (error) {
      console.error("Error creating retail bid:", error);

      // Handle potential sequence errors for grab_t_retail_bids table
      if (error.code === '23505' || error.message.includes('grab_t_retail_bids_id_seq')) {
        console.log('Fixing grab_t_retail_bids sequence...');
        try {
          // Create sequence if it doesn't exist
          await db.execute(`
            CREATE SEQUENCE IF NOT EXISTS grab_t_retail_bids_id_seq;
          `);

          // Set the sequence to the correct value
          await db.execute(`
            SELECT setval('grab_t_retail_bids_id_seq', COALESCE((SELECT MAX(id) FROM grab_t_retail_bids), 0) + 1, false);
          `);

          // Alter the table to use the sequence
          await db.execute(`
            ALTER TABLE grab_t_retail_bids ALTER COLUMN id SET DEFAULT nextval('grab_t_retail_bids_id_seq');
          `);

          console.log('Retrying retail bid creation after sequence fix...');
          // Try the insert again without recursion to avoid infinite loops
          const [newRetailBid] = await db
            .insert(grabTRetailBids)
            .values({
              rBidId: bid.bidId, // Use bidId from the InsertRetailBid interface
              rUserId: bid.userId, // Use rUserId instead of userId
              submittedAmount: bid.submittedAmount.toString(), // Ensure string format for decimal
              seatBooked: bid.passengerCount, // Use seatBooked instead of passengerCount
              rStatus: 1 // Set initial status (assuming 1 = submitted)
            })
            .returning();

          console.log("Retail bid created successfully after sequence fix:", newRetailBid);
          return newRetailBid;
        } catch (retryError) {
          console.error("Failed to create retail bid even after sequence fix:", retryError);
          throw new Error("Failed to submit retail bid due to database issues");
        }
      } else {
        throw new Error(`Failed to submit retail bid: ${error.message}`);
      }
    }
  }
}

// Export storage instance
export const storage = new DatabaseStorage();