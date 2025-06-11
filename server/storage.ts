import { 
  users, drivers, clients, tenders, trips, payments, pricing,
  type User, type InsertUser, type Driver, type InsertDriver,
  type Client, type InsertClient, type Tender, type InsertTender,
  type Trip, type InsertTrip, type Payment, type InsertPayment,
  type Pricing, type InsertPricing
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Drivers
  getDrivers(): Promise<Driver[]>;
  getDriver(id: number): Promise<Driver | undefined>;
  createDriver(insertDriver: InsertDriver): Promise<Driver>;
  updateDriver(id: number, driver: Partial<Driver>): Promise<Driver>;
  deleteDriver(id: number): Promise<void>;
  
  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(insertClient: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<Client>): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  
  // Tenders
  getTenders(): Promise<Tender[]>;
  getTender(id: number): Promise<Tender | undefined>;
  createTender(insertTender: InsertTender): Promise<Tender>;
  updateTender(id: number, tender: Partial<Tender>): Promise<Tender>;
  deleteTender(id: number): Promise<void>;
  
  // Trips
  getTrips(): Promise<Trip[]>;
  getTrip(id: number): Promise<Trip | undefined>;
  createTrip(insertTrip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, trip: Partial<Trip>): Promise<Trip>;
  deleteTrip(id: number): Promise<void>;
  
  // Payments
  getPayments(): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(insertPayment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<Payment>): Promise<Payment>;
  deletePayment(id: number): Promise<void>;
  
  // Pricing
  getPricings(): Promise<Pricing[]>;
  getPricing(id: number): Promise<Pricing | undefined>;
  createPricing(insertPricing: InsertPricing): Promise<Pricing>;
  updatePricing(id: number, pricing: Partial<Pricing>): Promise<Pricing>;
  deletePricing(id: number): Promise<void>;
  
  // Statistics
  getStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Drivers
  async getDrivers(): Promise<Driver[]> {
    return await db.select().from(drivers);
  }

  async getDriver(id: number): Promise<Driver | undefined> {
    const [driver] = await db.select().from(drivers).where(eq(drivers.id, id));
    return driver || undefined;
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const [driver] = await db.insert(drivers).values(insertDriver).returning();
    return driver;
  }

  async updateDriver(id: number, driver: Partial<Driver>): Promise<Driver> {
    const [updatedDriver] = await db.update(drivers).set(driver).where(eq(drivers.id, id)).returning();
    return updatedDriver;
  }

  async deleteDriver(id: number): Promise<void> {
    await db.delete(drivers).where(eq(drivers.id, id));
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(insertClient).returning();
    return client;
  }

  async updateClient(id: number, client: Partial<Client>): Promise<Client> {
    const [updatedClient] = await db.update(clients).set(client).where(eq(clients.id, id)).returning();
    return updatedClient;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Tenders
  async getTenders(): Promise<Tender[]> {
    return await db.select().from(tenders);
  }

  async getTender(id: number): Promise<Tender | undefined> {
    const [tender] = await db.select().from(tenders).where(eq(tenders.id, id));
    return tender || undefined;
  }

  async createTender(insertTender: InsertTender): Promise<Tender> {
    const [tender] = await db.insert(tenders).values(insertTender).returning();
    return tender;
  }

  async updateTender(id: number, tender: Partial<Tender>): Promise<Tender> {
    const [updatedTender] = await db.update(tenders).set(tender).where(eq(tenders.id, id)).returning();
    return updatedTender;
  }

  async deleteTender(id: number): Promise<void> {
    await db.delete(tenders).where(eq(tenders.id, id));
  }

  // Trips
  async getTrips(): Promise<Trip[]> {
    return await db.select().from(trips);
  }

  async getTrip(id: number): Promise<Trip | undefined> {
    const [trip] = await db.select().from(trips).where(eq(trips.id, id));
    return trip || undefined;
  }

  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const [trip] = await db.insert(trips).values(insertTrip).returning();
    return trip;
  }

  async updateTrip(id: number, trip: Partial<Trip>): Promise<Trip> {
    const [updatedTrip] = await db.update(trips).set(trip).where(eq(trips.id, id)).returning();
    return updatedTrip;
  }

  async deleteTrip(id: number): Promise<void> {
    await db.delete(trips).where(eq(trips.id, id));
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async updatePayment(id: number, payment: Partial<Payment>): Promise<Payment> {
    const [updatedPayment] = await db.update(payments).set(payment).where(eq(payments.id, id)).returning();
    return updatedPayment;
  }

  async deletePayment(id: number): Promise<void> {
    await db.delete(payments).where(eq(payments.id, id));
  }

  // Pricing
  async getPricings(): Promise<Pricing[]> {
    return await db.select().from(pricing);
  }

  async getPricing(id: number): Promise<Pricing | undefined> {
    const [pricingItem] = await db.select().from(pricing).where(eq(pricing.id, id));
    return pricingItem || undefined;
  }

  async createPricing(insertPricing: InsertPricing): Promise<Pricing> {
    const [pricingItem] = await db.insert(pricing).values(insertPricing).returning();
    return pricingItem;
  }

  async updatePricing(id: number, pricingData: Partial<Pricing>): Promise<Pricing> {
    const [updatedPricing] = await db.update(pricing).set(pricingData).where(eq(pricing.id, id)).returning();
    return updatedPricing;
  }

  async deletePricing(id: number): Promise<void> {
    await db.delete(pricing).where(eq(pricing.id, id));
  }

  // Statistics
  async getStats(): Promise<any> {
    const tendersData = await db.select().from(tenders);
    const driversData = await db.select().from(drivers);
    const tripsData = await db.select().from(trips);
    
    return {
      active: tendersData.filter(t => t.status === 'active').length,
      waiting: tendersData.filter(t => t.status === 'waiting').length,
      completed: tendersData.filter(t => t.status === 'completed').length,
      total_drivers: driversData.length,
      total_trips: tripsData.length,
    };
  }
}

export const storage = new DatabaseStorage();