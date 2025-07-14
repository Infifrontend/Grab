import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
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
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  features: text("features").array(),
  category: text("category"),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  route: text("route").notNull(),
  date: timestamp("date").notNull(),
  passengers: integer("passengers").notNull(),
  status: text("status").notNull(), // confirmed, cancelled, pending
  createdAt: timestamp("created_at").defaultNow(),
});

export const searchRequests = pgTable("search_requests", {
  id: serial("id").primaryKey(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  returnDate: timestamp("return_date"),
  passengers: integer("passengers").notNull(),
  cabin: text("cabin").notNull(),
  tripType: text("trip_type").notNull(), // oneWay, roundTrip, multiCity
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
});

export const insertDealSchema = createInsertSchema(deals);
export const insertPackageSchema = createInsertSchema(packages);
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export const insertSearchRequestSchema = createInsertSchema(searchRequests).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Deal = typeof deals.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type SearchRequest = typeof searchRequests.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertSearchRequest = z.infer<typeof insertSearchRequestSchema>;
