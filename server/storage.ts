import { users, deals, packages, bookings, searchRequests, type User, type InsertUser, type Deal, type Package, type Booking, type InsertBooking, type InsertSearchRequest } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDeals(): Promise<Deal[]>;
  getDeal(id: number): Promise<Deal | undefined>;
  
  getPackages(): Promise<Package[]>;
  searchPackages(destination?: string): Promise<Package[]>;
  
  getBookings(userId?: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  
  createSearchRequest(request: InsertSearchRequest): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private deals: Map<number, Deal>;
  private packages: Map<number, Package>;
  private bookings: Map<number, Booking>;
  private currentUserId: number;
  private currentDealId: number;
  private currentPackageId: number;
  private currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.deals = new Map();
    this.packages = new Map();
    this.bookings = new Map();
    this.currentUserId = 1;
    this.currentDealId = 1;
    this.currentPackageId = 1;
    this.currentBookingId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample deals
    const sampleDeals: Deal[] = [
      {
        id: 1,
        title: "Flash Sale: NYC to Vegas",
        subtitle: "Limited time offer",
        discountPercentage: 34,
        originalPrice: "450.00",
        discountedPrice: "299.00",
        origin: "New York",
        destination: "Las Vegas",
        rating: "4.8",
        groupSizeMin: 15,
        groupSizeMax: 50,
        availableSeats: 45,
        isFlashSale: true,
        isLimitedTime: true,
      }
    ];

    // Initialize sample packages
    const samplePackages: Package[] = [
      {
        id: 1,
        title: "Executive Business Package",
        location: "NEW YORK — CHICAGO",
        price: "1299.00",
        originalPrice: "1699.00",
        features: ["Round trip business class flights", "3 nights luxury hotel stay", "Airport transfers included", "Daily breakfast included"],
        category: "business",
      },
      {
        id: 2,
        title: "European Explorer Package",
        location: "CHICAGO — PARIS",
        price: "899.00",
        originalPrice: "1299.00",
        features: ["Return trip economy flights", "4 nights boutique hotel", "City walking tours", "Museum passes included"],
        category: "leisure",
      },
      {
        id: 3,
        title: "Mediterranean Getaway",
        location: "MIAMI — SANTORINI",
        price: "1599.00",
        originalPrice: "2199.00",
        features: ["Round trip premium flights", "5 nights oceanview resort", "Island hopping tours", "All meals included"],
        category: "leisure",
      },
      {
        id: 4,
        title: "Alpine Adventure Package",
        location: "DENVER — ASPEN",
        price: "1189.00",
        originalPrice: "1599.00",
        features: ["Round trip flights", "4 nights mountain lodge", "Ski lift passes", "Equipment rental included"],
        category: "adventure",
      },
    ];

    // Initialize sample bookings
    const sampleBookings: Booking[] = [
      {
        id: 1,
        bookingId: "GR-2024-001",
        userId: 1,
        route: "New York → Las Vegas",
        date: new Date("2024-01-15"),
        passengers: 23,
        status: "confirmed",
        createdAt: new Date(),
      },
      {
        id: 2,
        bookingId: "GR-2024-002",
        userId: 1,
        route: "Chicago → Paris",
        date: new Date("2024-01-28"),
        passengers: 18,
        status: "cancelled",
        createdAt: new Date(),
      },
      {
        id: 3,
        bookingId: "GR-2024-003",
        userId: 1,
        route: "New York → Las Vegas",
        date: new Date("2024-01-15"),
        passengers: 25,
        status: "confirmed",
        createdAt: new Date(),
      },
      {
        id: 4,
        bookingId: "GR-2024-004",
        userId: 1,
        route: "New York → Las Vegas",
        date: new Date("2024-01-15"),
        passengers: 19,
        status: "pending",
        createdAt: new Date(),
      },
    ];

    sampleDeals.forEach(deal => this.deals.set(deal.id, deal));
    samplePackages.forEach(pkg => this.packages.set(pkg.id, pkg));
    sampleBookings.forEach(booking => this.bookings.set(booking.id, booking));
    
    this.currentDealId = sampleDeals.length + 1;
    this.currentPackageId = samplePackages.length + 1;
    this.currentBookingId = sampleBookings.length + 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values());
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    return this.deals.get(id);
  }

  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async searchPackages(destination?: string): Promise<Package[]> {
    const allPackages = Array.from(this.packages.values());
    if (!destination) return allPackages;
    
    return allPackages.filter(pkg => 
      pkg.location.toLowerCase().includes(destination.toLowerCase()) ||
      pkg.title.toLowerCase().includes(destination.toLowerCase())
    );
  }

  async getBookings(userId?: number): Promise<Booking[]> {
    const allBookings = Array.from(this.bookings.values());
    if (!userId) return allBookings;
    
    return allBookings.filter(booking => booking.userId === userId);
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id,
      userId: insertBooking.userId || null,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async createSearchRequest(request: InsertSearchRequest): Promise<void> {
    // Store search request for analytics/tracking purposes
    console.log('Search request:', request);
  }
}

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
}

export const storage = new DatabaseStorage();
