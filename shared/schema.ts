
import { pgTable, serial, text, integer, timestamp, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  password: text("password"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Flights table
export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  flightNumber: text("flight_number").notNull(),
  airline: text("airline").notNull(),
  aircraft: text("aircraft"),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  duration: text("duration"),
  price: decimal("price", { precision: 10, scale: 2 }),
  cabin: text("cabin").default("Economy"),
  availableSeats: integer("available_seats").default(0),
  totalSeats: integer("total_seats").default(0),
  status: text("status").default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bids table
export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  bidAmount: text("bid_amount").notNull(),
  minimumBidAmount: text("minimum_bid_amount"),
  passengerCount: integer("passenger_count").notNull(),
  bidStatus: text("bid_status").default("active"),
  notes: text("notes"),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  flightId: integer("flight_id").references(() => flights.id),
  bidId: integer("bid_id").references(() => bids.id),
  bookingReference: text("booking_reference").unique(),
  status: text("status").default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  passengerCount: integer("passenger_count").notNull(),
  bookingData: jsonb("booking_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Passengers table
export const passengers = pgTable("passengers", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  email: text("email"),
  phone: text("phone"),
  passportNumber: text("passport_number"),
  nationality: text("nationality"),
  seatNumber: text("seat_number"),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payments table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").default("pending"),
  transactionId: text("transaction_id"),
  paymentGateway: text("payment_gateway"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Flight Bookings junction table
export const flightBookings = pgTable("flight_bookings", {
  id: serial("id").primaryKey(),
  flightId: integer("flight_id").references(() => flights.id),
  bookingId: integer("booking_id").references(() => bookings.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bid Flights junction table
export const bidFlights = pgTable("bid_flights", {
  id: serial("id").primaryKey(),
  bidId: integer("bid_id").references(() => bids.id),
  flightId: integer("flight_id").references(() => flights.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bundle Selections table
export const bundleSelections = pgTable("bundle_selections", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  bundleType: text("bundle_type").notNull(),
  bundleData: jsonb("bundle_data"),
  price: decimal("price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertFlightSchema = createInsertSchema(flights);
export const selectFlightSchema = createSelectSchema(flights);
export const insertBidSchema = createInsertSchema(bids);
export const selectBidSchema = createSelectSchema(bids);
export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);
export const insertPassengerSchema = createInsertSchema(passengers);
export const selectPassengerSchema = createSelectSchema(passengers);
export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Flight = typeof flights.$inferSelect;
export type NewFlight = typeof flights.$inferInsert;
export type Bid = typeof bids.$inferSelect;
export type NewBid = typeof bids.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Passenger = typeof passengers.$inferSelect;
export type NewPassenger = typeof passengers.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
