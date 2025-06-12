import {
  sqliteTable as pgTable,
  text,
  integer,
  numeric,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Channels table - communication channels with manager information
export const channels = pgTable("channels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  manager_first_name: text("manager_first_name").notNull(),
  manager_last_name: text("manager_last_name").notNull(),
  manager_address: text("manager_address"),
  manager_city: text("manager_city"),
  manager_phone: text("manager_phone"),
  manager_additional_phone: text("manager_additional_phone"),
  manager_email: text("manager_email"),
  channel_name: text("channel_name").notNull(),
  channel_nickname: text("channel_nickname"),
  channel_id_number: text("channel_id_number").notNull().unique(),
  created_at: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Dispatchers table - system operators
export const dispatchers = pgTable("dispatchers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  address: text("address").notNull(),
  city: text("city"),
  phone: text("phone").notNull(),
  additional_phone: text("additional_phone").notNull(),
  email: text("email").notNull(),
  notes: text("notes"),
  username: text("username"),
  id_number: text("id_number"),
  password: text("password"),
  random_username: integer("random_username", { mode: "boolean" }).default(false),
  created_at: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const drivers = pgTable("drivers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  full_name: text("full_name").notNull(),
  id_number: text("id_number").notNull(),
  phone: text("phone").notNull(),
  additional_phone: text("additional_phone"),
  email: text("email"),
  address: text("address").notNull(),
  residence_area: text("residence_area").notNull(),
  channel_id: text("channel_id"),
  license_number: text("license_number"),
  vehicle_type: text("vehicle_type"),
  vehicle_license: text("vehicle_license"),
  vehicle_seats: integer("vehicle_seats"),
  vehicle_condition: text("vehicle_condition"),
  vehicle_category: text("vehicle_category"),
  status: text("status").notNull().default("inactive"), // active, busy, offline, suspended, inactive
  rating: numeric("rating").default("0"),
  total_trips: integer("total_trips").default(0),
  join_date: integer("join_date", { mode: "timestamp" }),
  fixed_charge: numeric("fixed_charge"),
  variable_charge_percentage: numeric("variable_charge_percentage"),
  created_at: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const clients = pgTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serial_number: text("serial_number").notNull().unique(),
  full_name: text("full_name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  status: text("status").notNull().default("regular"), // regular, casual
  payment_status: text("payment_status").notNull().default("paid"), // debt, credit, paid
  last_activity_date: integer("last_activity_date", { mode: "timestamp" }),
  created_at: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Messages table - communication system
export const messages = pgTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  channel_assignment: text("channel_assignment"),
  assigned_driver_id: text("assigned_driver_id"),
  assigned_driver_name: text("assigned_driver_name"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  notes: text("notes"),
  urgency_level: text("urgency_level").notNull().default("medium"), // low, medium, high
  scheduled_date: integer("scheduled_date", { mode: "timestamp" }),
  scheduled_time: text("scheduled_time"),
  is_scheduled: integer("is_scheduled", { mode: "boolean" }).default(false),
  status: text("status").notNull().default("draft"), // draft, sent, scheduled
  created_at: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Driver Reports table - performance and financial reports
export const driver_reports = pgTable("driver_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  driver_id: text("driver_id").notNull(),
  driver_name: text("driver_name").notNull(),
  serial_number: text("serial_number").notNull(),
  fixed_amount: numeric("fixed_amount"),
  mandatory_variables: numeric("mandatory_variables"),
  optional_variables: numeric("optional_variables"),
  previous_balance: numeric("previous_balance").default("0"),
  trip_count: integer("trip_count"),
  total_amount: numeric("total_amount"),
  is_selected: integer("is_selected", { mode: "boolean" }).default(false),
  created_at: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Price Routes table - pricing for different routes
export const price_routes = pgTable("price_routes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  one_way_price: numeric("one_way_price"),
  return_price: numeric("return_price"),
  round_trip_price: numeric("round_trip_price"),
  status: text("status").notNull().default("active"), // active, inactive
  channel_id: text("channel_id"),
  created_at: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const tenders = pgTable("tenders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  service_type: text("service_type").notNull(), // delivery, ride, special
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  publication_time: integer("publication_time", { mode: "timestamp" }),
  status: text("status").notNull().default("available"), // available, taken, completed, cancelled
  assigned_driver_id: text("assigned_driver_id"),
  assigned_driver_name: text("assigned_driver_name"),
  assigned_driver_phone: text("assigned_driver_phone"),
  client_id: text("client_id"),
  client_name: text("client_name"),
  contact_phone: text("contact_phone"),
  estimated_price: numeric("estimated_price"),
  actual_price: numeric("actual_price"),
  distance_km: numeric("distance_km"),
  notes: text("notes"),
  completion_time: integer("completion_time", { mode: "timestamp" }),
  channel_id: text("channel_id"),
  created_at: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const trips = pgTable("trips", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  client_name: text("client_name").notNull(),
  trip_type: text("trip_type").notNull(), // delivery, ride, special
  status: text("status").notNull().default("waiting"), // active, waiting, completed, cancelled
  driver_id: text("driver_id"),
  driver_name: text("driver_name"),
  scheduled_time: integer("scheduled_time", { mode: "timestamp" }),
  actual_start_time: integer("actual_start_time", { mode: "timestamp" }),
  completion_time: integer("completion_time", { mode: "timestamp" }),
  price: numeric("price"),
  distance_km: numeric("distance_km"),
  notes: text("notes"),
  created_at: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const payments = pgTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  payment_number: text("payment_number"),
  driver_id: text("driver_id").notNull(),
  driver_name: text("driver_name").notNull(),
  amount: numeric("amount").notNull(),
  payment_type: text("payment_type").notNull().default("transfer"), // credit, debit, cash, transfer
  status: text("status").notNull().default("pending"), // pending, completed, failed, cancelled
  payment_date: integer("payment_date", { mode: "timestamp" }),
  due_date: integer("due_date", { mode: "timestamp" }),
  phone: text("phone"),
  description: text("description"),
  notes: text("notes"),
  created_at: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Rename pricing to match PriceRoute entity
export const pricing = pgTable("pricing", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  one_way_price: numeric("one_way_price"),
  return_price: numeric("return_price"),
  round_trip_price: numeric("round_trip_price"),
  status: text("status").notNull().default("active"), // active, inactive
  channel_id: text("channel_id"),
  created_at: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChannelSchema = createInsertSchema(channels).omit({
  id: true,
  created_at: true,
});

export const insertDispatcherSchema = createInsertSchema(dispatchers).omit({
  id: true,
  created_at: true,
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  created_at: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  created_at: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  created_at: true,
});

export const insertDriverReportSchema = createInsertSchema(driver_reports).omit({
  id: true,
  created_at: true,
});

export const insertPriceRouteSchema = createInsertSchema(price_routes).omit({
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

export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type Channel = typeof channels.$inferSelect;

export type InsertDispatcher = z.infer<typeof insertDispatcherSchema>;
export type Dispatcher = typeof dispatchers.$inferSelect;

export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertDriverReport = z.infer<typeof insertDriverReportSchema>;
export type DriverReport = typeof driver_reports.$inferSelect;

export type InsertPriceRoute = z.infer<typeof insertPriceRouteSchema>;
export type PriceRoute = typeof price_routes.$inferSelect;

export type InsertTender = z.infer<typeof insertTenderSchema>;
export type Tender = typeof tenders.$inferSelect;

export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type InsertPricing = z.infer<typeof insertPricingSchema>;
export type Pricing = typeof pricing.$inferSelect;
