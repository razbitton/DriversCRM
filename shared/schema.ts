import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  full_name: text("full_name").notNull(),
  phone: text("phone").notNull(),
  additional_phone: text("additional_phone"),
  email: text("email"),
  address: text("address"),
  residence_area: text("residence_area"),
  id_number: text("id_number"),
  license_number: text("license_number").notNull(),
  vehicle_number: text("vehicle_number"),
  vehicle_type: text("vehicle_type"),
  vehicle_seats: text("vehicle_seats"),
  vehicle_condition: text("vehicle_condition"),
  vehicle_category: text("vehicle_category"),
  join_date: text("join_date"),
  status: text("status").notNull().default("active"), // active, inactive, suspended
  channel_id: text("channel_id"),
  fixed_charge: decimal("fixed_charge", { precision: 10, scale: 2 }),
  variable_charge_percentage: decimal("variable_charge_percentage", { precision: 5, scale: 2 }),
  created_at: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  serial_number: text("serial_number").notNull().unique(),
  full_name: text("full_name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  status: text("status").notNull().default("regular"), // regular, casual
  payment_status: text("payment_status").notNull().default("paid"), // debt, credit, paid
  last_activity_date: timestamp("last_activity_date"),
  created_at: timestamp("created_at").defaultNow(),
});

export const tenders = pgTable("tenders", {
  id: serial("id").primaryKey(),
  tender_number: text("tender_number").notNull().unique(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  client_name: text("client_name").notNull(),
  client_phone: text("client_phone"),
  service_type: text("service_type").notNull(), // delivery, ride, special
  driver_id: integer("driver_id").references(() => drivers.id),
  status: text("status").notNull().default("active"), // active, waiting, completed, cancelled
  scheduled_time: timestamp("scheduled_time"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
});

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  trip_number: text("trip_number").notNull().unique(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  client_name: text("client_name").notNull(),
  client_phone: text("client_phone"),
  driver_id: integer("driver_id").references(() => drivers.id),
  trip_type: text("trip_type").notNull(), // delivery, ride, special
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, cancelled
  scheduled_time: timestamp("scheduled_time").notNull(),
  actual_start_time: timestamp("actual_start_time"),
  actual_end_time: timestamp("actual_end_time"),
  price: decimal("price", { precision: 10, scale: 2 }),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  payment_number: text("payment_number").notNull(),
  driver_id: integer("driver_id").references(() => drivers.id).notNull(),
  trip_id: integer("trip_id").references(() => trips.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payment_type: text("payment_type").notNull(), // salary, commission, bonus, deduction
  payment_date: timestamp("payment_date").defaultNow(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, paid, cancelled
  created_at: timestamp("created_at").defaultNow(),
});

export const pricing = pgTable("pricing", {
  id: serial("id").primaryKey(),
  channel_id: text("channel_id").notNull(),
  route_name: text("route_name").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  service_type: text("service_type").notNull(),
  base_price: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  one_way_price: decimal("one_way_price", { precision: 10, scale: 2 }),
  return_price: decimal("return_price", { precision: 10, scale: 2 }),
  round_trip_price: decimal("round_trip_price", { precision: 10, scale: 2 }),
  per_km_price: decimal("per_km_price", { precision: 10, scale: 2 }),
  min_price: decimal("min_price", { precision: 10, scale: 2 }),
  max_price: decimal("max_price", { precision: 10, scale: 2 }),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  created_at: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  created_at: true,
});

export const insertTenderSchema = createInsertSchema(tenders).omit({
  id: true,
  created_at: true,
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  created_at: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  created_at: true,
});

export const insertPricingSchema = createInsertSchema(pricing).omit({
  id: true,
  created_at: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertTender = z.infer<typeof insertTenderSchema>;
export type Tender = typeof tenders.$inferSelect;

export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type InsertPricing = z.infer<typeof insertPricingSchema>;
export type Pricing = typeof pricing.$inferSelect;
