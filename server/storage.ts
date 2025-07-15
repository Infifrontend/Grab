import { 
  users, deals, packages, bookings, searchRequests, flights, flightBookings, passengers, bids, payments, refunds,
  type User, type InsertUser, type Deal, type Package, type Booking, type InsertBooking, type InsertSearchRequest,
  type Flight, type InsertFlight, type FlightBooking, type InsertFlightBooking, type Passenger, type InsertPassenger,
  type Bid, type InsertBid, type Payment, type InsertPayment, type Refund, type InsertRefund
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, like, or } from "drizzle-orm";

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
}

// DatabaseStorage is the only storage implementation now

export class DatabaseStorage implements IStorage {
  async updateBookingDetails(bookingId: number, updates: any) {
    try {
      const result = await db
        .update(flightBookings)
        .set(updates)
        .where(eq(flightBookings.id, bookingId))
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error updating booking details:', error);
      throw error;
    }
  }

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
    if (origin) conditions.push(eq(flights.origin, origin));
    if (destination) conditions.push(eq(flights.destination, destination));
    if (departureDate) {
      const startOfDay = new Date(departureDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(departureDate);
      endOfDay.setHours(23, 59, 59, 999);
      conditions.push(gte(flights.departureTime, startOfDay));
      conditions.push(lte(flights.departureTime, endOfDay));
    }

    if (conditions.length > 0) {
      return await db.select().from(flights).where(and(...conditions));
    }

    return await db.select().from(flights);
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
          duration: 150,
          availableSeats: 180,
          baseCost: 4500,
          cabinClass: 'Economy'
        },
        {
          flightNumber: 'SG201',
          airline: 'SpiceJet',
          aircraft: 'Boeing 737',
          origin: 'Mumbai',
          destination: 'Bangalore',
          departureTime: new Date('2024-01-20T09:00:00'),
          arrivalTime: new Date('2024-01-20T11:00:00'),
          duration: 120,
          availableSeats: 189,
          baseCost: 3800,
          cabinClass: 'Economy'
        },
        {
          flightNumber: 'UK301',
          airline: 'Vistara',
          aircraft: 'Airbus A320',
          origin: 'Delhi',
          destination: 'Bangalore',
          departureTime: new Date('2024-01-20T10:30:00'),
          arrivalTime: new Date('2024-01-20T13:00:00'),
          duration: 150,
          availableSeats: 164,
          baseCost: 5200,
          cabinClass: 'Economy'
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
}

// Export storage instance
export const storage = new DatabaseStorage();