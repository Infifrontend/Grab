import { pgTable, text, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  isRetailAllowed: boolean("is_retail_allowed").default(false),
});

export const deals = pgTable("deals", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  discountPercentage: integer("discount_percentage").notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  discountedPrice: decimal("discounted_price", { precision: 10, scale: 2 }).notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  groupSizeMin: integer("group_size_min").notNull(),
  groupSizeMax: integer("group_size_max").notNull(),
  availableSeats: integer("available_seats").notNull(),
  isFlashSale: boolean("is_flash_sale").default(false),
  isLimitedTime: boolean("is_limited_time").default(false),
});

export const packages = pgTable("packages", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  features: text("features").array(),
  category: text("category"),
});

export const bookings = pgTable("bookings", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  bookingId: text("booking_id").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  route: text("route").notNull(),
  date: timestamp("date").notNull(),
  passengers: integer("passengers").notNull(),
  status: text("status").notNull(), // confirmed, cancelled, pending
  createdAt: timestamp("created_at").defaultNow(),
});

export const searchRequests = pgTable("search_requests", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  returnDate: timestamp("return_date"),
  passengers: integer("passengers").notNull(),
  cabin: text("cabin").notNull(),
  tripType: text("trip_type").notNull(), // oneWay, roundTrip, multiCity
});

// Flights table for flight booking functionality
export const flights = pgTable("flights", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  flightNumber: text("flight_number").notNull().unique(),
  airline: text("airline").notNull(),
  aircraft: text("aircraft").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  duration: text("duration").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  availableSeats: integer("available_seats").notNull(),
  totalSeats: integer("total_seats").notNull(),
  cabin: text("cabin").notNull(), // economy, business, first
  stops: integer("stops").default(0),
  status: text("status").notNull().default("scheduled"), // scheduled, delayed, cancelled, completed
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced bookings table for managing flight bookings
export const flightBookings = pgTable("flight_bookings", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  bookingReference: text("booking_reference").notNull().unique(),
  pnr: text("pnr").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  flightId: integer("flight_id").references(() => flights.id).notNull(),
  passengerCount: integer("passenger_count").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  bookingStatus: text("booking_status").notNull().default("pending"), // pending, confirmed, cancelled, completed
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  seatNumbers: text("seat_numbers").array(),
  specialRequests: text("special_requests"),
  bookedAt: timestamp("booked_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Passenger details for bookings
export const passengers = pgTable("passengers", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  bookingId: integer("booking_id").references(() => flightBookings.id).notNull(),
  title: text("title").notNull(), // Mr, Mrs, Ms, Dr
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  nationality: text("nationality").notNull(),
  passportNumber: text("passport_number"),
  passportExpiry: timestamp("passport_expiry"),
  seatPreference: text("seat_preference"), // window, aisle, middle
  mealPreference: text("meal_preference"), // vegetarian, vegan, halal, kosher
  specialAssistance: text("special_assistance"),
});

// Bids module for flight offers
export const bids = pgTable("bids", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  flightId: integer("flight_id").references(() => flights.id).notNull(),
  bidAmount: decimal("bid_amount", { precision: 10, scale: 2 }).notNull(),
  passengerCount: integer("passenger_count").notNull(),
  bidStatus: text("bid_status").notNull().default("active"), // active, accepted, rejected, expired, withdrawn
  validUntil: timestamp("valid_until").notNull(),
  notes: text("notes"),
  totalSeatsAvailable: integer("total_seats_available").default(50),
  minSeatsPerBid: integer("min_seats_per_bid").default(1),
  maxSeatsPerBid: integer("max_seats_per_bid").default(10),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment handling for transactions
export const payments = pgTable("payments", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  bookingId: integer("booking_id").references(() => flightBookings.id),
  userId: integer("user_id").references(() => users.id),
  paymentReference: text("payment_reference").notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  paymentMethod: text("payment_method").notNull(), // credit_card, debit_card, paypal, bank_transfer
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, processing, completed, failed, cancelled, refunded
  transactionId: text("transaction_id"),
  paymentGateway: text("payment_gateway"), // stripe, paypal, square
  failureReason: text("failure_reason"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment refunds tracking
export const refunds = pgTable("refunds", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  paymentId: integer("payment_id").references(() => payments.id).notNull(),
  refundReference: text("refund_reference").notNull().unique(),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).notNull(),
  refundReason: text("refund_reason").notNull(),
  refundStatus: text("refund_status").notNull().default("pending"), // pending, processing, completed, failed
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  type: text("type").notNull(), // bid_created, bid_accepted, payment_received, etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  priority: text("priority").default("medium"), // low, medium, high
  actionData: text("action_data"), // JSON string for any action-specific data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Retail bids table for storing retail user bid submissions
export const retailBids = pgTable("retail_bids", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  bidId: integer("bid_id").references(() => bids.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  flightId: integer("flight_id").references(() => flights.id).notNull(),
  submittedAmount: decimal("submitted_amount", { precision: 10, scale: 2 }).notNull(),
  passengerCount: integer("passenger_count").notNull(),
  status: text("status").notNull().default("submitted"), // submitted, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  flightBookings: many(flightBookings),
  bids: many(bids),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));

export const flightsRelations = relations(flights, ({ many }) => ({
  flightBookings: many(flightBookings),
  bids: many(bids),
}));

export const flightBookingsRelations = relations(flightBookings, ({ one, many }) => ({
  user: one(users, {
    fields: [flightBookings.userId],
    references: [users.id],
  }),
  flight: one(flights, {
    fields: [flightBookings.flightId],
    references: [flights.id],
  }),
  passengers: many(passengers),
  payments: many(payments),
}));

export const passengersRelations = relations(passengers, ({ one }) => ({
  booking: one(flightBookings, {
    fields: [passengers.bookingId],
    references: [flightBookings.id],
  }),
}));

export const bidsRelations = relations(bids, ({ one }) => ({
  user: one(users, {
    fields: [bids.userId],
    references: [users.id],
  }),
  flight: one(flights, {
    fields: [bids.flightId],
    references: [flights.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  booking: one(flightBookings, {
    fields: [payments.bookingId],
    references: [flightBookings.id],
  }),
  refunds: many(refunds),
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  payment: one(payments, {
    fields: [refunds.paymentId],
    references: [payments.id],
  }),
}));

export const retailBidsRelations = relations(retailBids, ({ one }) => ({
  bid: one(bids, {
    fields: [retailBids.bidId],
    references: [bids.id],
  }),
  user: one(users, {
    fields: [retailBids.userId],
    references: [users.id],
  }),
  flight: one(flights, {
    fields: [retailBids.flightId],
    references: [flights.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export const insertDealSchema = createInsertSchema(deals);
export const insertPackageSchema = createInsertSchema(packages);
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export const insertSearchRequestSchema = createInsertSchema(searchRequests).extend({
  departureDate: z.string().or(z.date()).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ),
  returnDate: z.string().or(z.date()).nullable().transform((val) => 
    val ? (typeof val === 'string' ? new Date(val) : val) : null
  ),
});
export const insertFlightSchema = createInsertSchema(flights).omit({ id: true, createdAt: true });
export const insertFlightBookingSchema = createInsertSchema(flightBookings).omit({ id: true, bookedAt: true, updatedAt: true });
export const insertPassengerSchema = createInsertSchema(passengers).omit({ id: true });
export const insertBidSchema = createInsertSchema(bids).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, processedAt: true, createdAt: true });
export const insertRefundSchema = createInsertSchema(refunds).omit({ id: true, processedAt: true, createdAt: true });
export const insertRetailBidSchema = createInsertSchema(retailBids).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Deal = typeof deals.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type SearchRequest = typeof searchRequests.$inferSelect;
export type Flight = typeof flights.$inferSelect;
export type FlightBooking = typeof flightBookings.$inferSelect;
export type Passenger = typeof passengers.$inferSelect;
export type Bid = typeof bids.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Refund = typeof refunds.$inferSelect;

export type InsertDeal = z.infer<typeof insertDealSchema>;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertSearchRequest = z.infer<typeof insertSearchRequestSchema>;
export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type InsertFlightBooking = z.infer<typeof insertFlightBookingSchema>;
export type InsertPassenger = z.infer<typeof insertPassengerSchema>;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertRefund = z.infer<typeof insertRefundSchema>;
export type RetailBid = typeof retailBids.$inferSelect;
export type InsertRetailBid = z.infer<typeof insertRetailBidSchema>;