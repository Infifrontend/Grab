import { db } from "./db";
import { 
  users, 
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
  type User, type InsertUser, type Deal, type Package, type Booking, type InsertBooking, type InsertSearchRequest,
  type Flight, type InsertFlight, type InsertFlightBooking, type FlightBooking, type Passenger, type InsertPassenger,
  type Bid, type InsertBid, type Payment, type InsertPayment, type Refund, type InsertRefund
} from "@shared/schema";
import { eq, and, gte, lte, like, or, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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
        activeBids: number;
        acceptedBids: number;
        totalSavings: number;
        depositsPaid: number;
        refundsReceived: number;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
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
    await db.insert(searchRequests).values(request);
  }

  // Flights
  async getFlights(origin?: string, destination?: string, departureDate?: Date): Promise<Flight[]> {
    const conditions = [];

    if (origin) {
      conditions.push(eq(flights.origin, origin));
    }

    if (destination) {
      conditions.push(eq(flights.destination, destination));
    }

    if (departureDate) {
      const startOfDay = new Date(departureDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(departureDate);
      endOfDay.setHours(23, 59, 59, 999);

      conditions.push(
        and(
          gte(flights.departureTime, startOfDay),
          lte(flights.departureTime, endOfDay)
        )
      );
    }

    if (conditions.length > 0) {
      return await db.select().from(flights).where(and(...conditions));
    }

    return await db.select().from(flights);
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

  async createFlightBooking(booking: InsertFlightBooking): Promise<FlightBooking> {
    const [newBooking] = await db.insert(flightBookings).values(booking).returning();
    return newBooking;
  }

  async updateFlightBookingStatus(id: number, status: string, paymentStatus?: string): Promise<void> {
    const updateData: any = { bookingStatus: status, updatedAt: new Date() };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    await db.update(flightBookings).set(updateData).where(eq(flightBookings.id, id));
  }

  async updateBookingDetails(bookingId: number, updates: { specialRequests?: string }): Promise<void> {
    await db.update(flightBookings)
      .set(updates)
      .where(eq(flightBookings.id, bookingId));
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
  async getPassengersByBooking(bookingId: number): Promise<Passenger[]> {
    return await db.select().from(passengers).where(eq(passengers.bookingId, bookingId));
  }

  async createPassenger(passenger: InsertPassenger): Promise<Passenger> {
    const [newPassenger] = await db.insert(passengers).values(passenger).returning();
    return newPassenger;
  }

  async updatePassenger(id: number, passenger: Partial<InsertPassenger>): Promise<void> {
    await db.update(passengers).set(passenger).where(eq(passengers.id, id));
  }

  // Bids
  async getBids(userId?: number, flightId?: number): Promise<Bid[]> {
    const conditions = [];
    if (userId) conditions.push(eq(bids.userId, userId));
    if (flightId) conditions.push(eq(bids.flightId, flightId));

    if (conditions.length > 0) {
      return await db.select().from(bids).where(and(...conditions));
    }

    return await db.select().from(bids);
  }

  async getBid(id: number): Promise<Bid | undefined> {
    const [bid] = await db.select().from(bids).where(eq(bids.id, id));
    return bid || undefined;
  }

  async createBid(bid: InsertBid): Promise<Bid> {
    const [newBid] = await db.insert(bids).values(bid).returning();
    return newBid;
  }

  async updateBidStatus(id: number, status: string): Promise<void> {
    console.log(`Updating bid ${id} status to ${status}`);
    await db.update(bids).set({ bidStatus: status, updatedAt: new Date() }).where(eq(bids.id, id));
  }

  async deleteBid(id: number): Promise<void> {
    await db.delete(bids).where(eq(bids.id, id));
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

  async getBidStatistics(userId?: number) {
    try {
      const conditions = userId ? eq(bids.userId, userId) : undefined;

      const allBids = await db.select().from(bids).where(conditions);

      const activeBids = allBids.filter(bid => bid.bidStatus === 'active').length;
      const acceptedBids = allBids.filter(bid => bid.bidStatus === 'accepted').length;

      const totalSavings = allBids
        .filter(bid => bid.bidStatus === 'accepted')
        .reduce((sum, bid) => sum + parseFloat(bid.bidAmount), 0);

      const depositsData = [
        { bidId: 'BID-1001', amount: 2500.00, status: 'Paid', date: '2024-05-15' },
        { bidId: 'BID-1002', amount: 1800.00, status: 'Paid', date: '2024-05-10' },
        { bidId: 'BID-1003', amount: 3200.00, status: 'Pending', date: '2024-05-20' },
      ];

      const refundsData = [
        { bidId: 'BID-1004', amount: 1500.00, status: 'Processed', date: '2024-05-12' },
        { bidId: 'BID-1005', amount: 950.00, status: 'Processed', date: '2024-05-08' },
      ];

      const depositsPaid = depositsData
        .filter(deposit => deposit.status === 'Paid')
        .reduce((sum, deposit) => sum + deposit.amount, 0);

      const refundsReceived = refundsData
        .filter(refund => refund.status === 'Processed')
        .reduce((sum, refund) => sum + refund.amount, 0);

      return {
        activeBids,
        acceptedBids,
        totalSavings,
        depositsPaid,
        refundsReceived
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
        .reduce((sum, payment) => sum + parseFloat(p.amount.toString()), 0);

      const pendingPayments = allPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, payment) => sum + parseFloat(p.amount.toString()), 0);

      // Calculate upcoming payments (next 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const upcomingPayments = allPayments
        .filter(p => p.status === 'pending' && new Date(p.createdAt) <= thirtyDaysFromNow)
        .reduce((sum, payment) => sum + parseFloat(p.amount.toString()), 0);

      // Get refunds
      const allRefunds = await db
        .select({
          amount: refunds.refundAmount,
          status: refunds.refundStatus
        })
        .from(refunds);

      const refundsProcessed = allRefunds
        .filter(r => r.status === 'completed')
        .reduce((sum, refund) => sum + parseFloat(r.refundAmount.toString()), 0);

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
      const paymentReference = paymentData.paymentReference || `PAY-${new Date().getFullYear()}-${nanoid(6)}`;
      
      const [payment] = await db.insert(payments).values({
        ...paymentData,
        paymentReference: paymentReference,
        createdAt: new Date()
      }).returning();

      console.log('Payment created successfully:', payment);
      return payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
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

  async getBids(userId?: number) {
    try {
      const conditions = userId ? eq(bids.userId, userId) : undefined;

      const bidList = await db
        .select({
          bid: bids,
          flight: flights
        })
        .from(bids)
        .innerJoin(flights, eq(bids.flightId, flights.id))
        .where(conditions)
        .orderBy(desc(bids.createdAt));

      return bidList.map(item => ({
        ...item.bid,
        flight: item.flight
      }));
    } catch (error) {
      console.error("Error getting bids:", error);
      throw error;
    }
  }

  async createBid(bidData: InsertBid) {
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

      const [bid] = await db
        .insert(bids)
        .values({
          ...bidData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      console.log("Bid created successfully:", bid);
      return bid;
    } catch (error) {
      console.error("Error creating bid:", error);
      throw error;
    }
  }

  async getBidById(bidId: number) {
    try {
      const [result] = await db
        .select({
          bid: bids,
          flight: flights,
          user: users
        })
        .from(bids)
        .leftJoin(flights, eq(bids.flightId, flights.id))
        .leftJoin(users, eq(bids.userId, users.id))
        .where(eq(bids.id, bidId))
        .limit(1);

      return result || null;
    } catch (error) {
      console.error("Error getting bid by ID:", error);
      throw error;
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

  async updateBidDetails(bidId: number, updateData: any): Promise<any> {
    try {
      console.log(`Updating bid ${bidId} with data:`, updateData);

      const [updatedBid] = await db
        .update(bids)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(bids.id, bidId))
        .returning();

      if (!updatedBid) {
        throw new Error(`Bid with ID ${bidId} not found`);
      }

      console.log('Bid updated in database:', updatedBid);
      return updatedBid;
    } catch (error) {
      console.error("Error updating bid details:", error);
      throw error;
    }
  }
}

// Export storage instance
export const storage = new DatabaseStorage();