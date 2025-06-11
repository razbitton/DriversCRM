import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDriverSchema, insertClientSchema, insertTenderSchema, 
  insertTripSchema, insertPaymentSchema, insertPricingSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Drivers routes
  app.get("/api/drivers", async (req, res) => {
    try {
      const drivers = await storage.getDrivers();
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch drivers" });
    }
  });

  app.get("/api/drivers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const driver = await storage.getDriver(id);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      res.json(driver);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch driver" });
    }
  });

  app.post("/api/drivers", async (req, res) => {
    try {
      const result = insertDriverSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid driver data", errors: result.error.issues });
      }
      const driver = await storage.createDriver(result.data);
      res.status(201).json(driver);
    } catch (error) {
      res.status(500).json({ message: "Failed to create driver" });
    }
  });

  app.put("/api/drivers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertDriverSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid driver data", errors: result.error.issues });
      }
      const driver = await storage.updateDriver(id, result.data);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      res.json(driver);
    } catch (error) {
      res.status(500).json({ message: "Failed to update driver" });
    }
  });

  app.delete("/api/drivers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDriver(id);
      if (!success) {
        return res.status(404).json({ message: "Driver not found" });
      }
      res.json({ message: "Driver deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete driver" });
    }
  });

  app.get("/api/drivers/search/:query", async (req, res) => {
    try {
      const drivers = await storage.searchDrivers(req.params.query);
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ message: "Failed to search drivers" });
    }
  });

  // Clients routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const result = insertClientSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid client data", errors: result.error.issues });
      }
      const client = await storage.createClient(result.data);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertClientSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid client data", errors: result.error.issues });
      }
      const client = await storage.updateClient(id, result.data);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteClient(id);
      if (!success) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json({ message: "Client deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  app.get("/api/clients/search/:query", async (req, res) => {
    try {
      const clients = await storage.searchClients(req.params.query);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to search clients" });
    }
  });

  // Tenders routes
  app.get("/api/tenders", async (req, res) => {
    try {
      const { status } = req.query;
      let tenders;
      if (status && typeof status === 'string') {
        tenders = await storage.getTendersByStatus(status);
      } else {
        tenders = await storage.getTenders();
      }
      res.json(tenders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tenders" });
    }
  });

  app.get("/api/tenders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tender = await storage.getTender(id);
      if (!tender) {
        return res.status(404).json({ message: "Tender not found" });
      }
      res.json(tender);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tender" });
    }
  });

  app.post("/api/tenders", async (req, res) => {
    try {
      const result = insertTenderSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid tender data", errors: result.error.issues });
      }
      const tender = await storage.createTender(result.data);
      res.status(201).json(tender);
    } catch (error) {
      res.status(500).json({ message: "Failed to create tender" });
    }
  });

  app.put("/api/tenders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertTenderSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid tender data", errors: result.error.issues });
      }
      const tender = await storage.updateTender(id, result.data);
      if (!tender) {
        return res.status(404).json({ message: "Tender not found" });
      }
      res.json(tender);
    } catch (error) {
      res.status(500).json({ message: "Failed to update tender" });
    }
  });

  app.delete("/api/tenders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTender(id);
      if (!success) {
        return res.status(404).json({ message: "Tender not found" });
      }
      res.json({ message: "Tender deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tender" });
    }
  });

  // Trips routes
  app.get("/api/trips", async (req, res) => {
    try {
      const { status, driverId } = req.query;
      let trips;
      if (status && typeof status === 'string') {
        trips = await storage.getTripsByStatus(status);
      } else if (driverId && typeof driverId === 'string') {
        trips = await storage.getTripsByDriver(parseInt(driverId));
      } else {
        trips = await storage.getTrips();
      }
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });

  app.get("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trip = await storage.getTrip(id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trip" });
    }
  });

  app.post("/api/trips", async (req, res) => {
    try {
      const result = insertTripSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid trip data", errors: result.error.issues });
      }
      const trip = await storage.createTrip(result.data);
      res.status(201).json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to create trip" });
    }
  });

  app.put("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertTripSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid trip data", errors: result.error.issues });
      }
      const trip = await storage.updateTrip(id, result.data);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trip" });
    }
  });

  app.delete("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTrip(id);
      if (!success) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.json({ message: "Trip deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trip" });
    }
  });

  // Payments routes
  app.get("/api/payments", async (req, res) => {
    try {
      const { driverId } = req.query;
      let payments;
      if (driverId && typeof driverId === 'string') {
        payments = await storage.getPaymentsByDriver(parseInt(driverId));
      } else {
        payments = await storage.getPayments();
      }
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const result = insertPaymentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid payment data", errors: result.error.issues });
      }
      const payment = await storage.createPayment(result.data);
      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  app.delete("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePayment(id);
      if (!success) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json({ message: "Payment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete payment" });
    }
  });

  // Pricing routes
  app.get("/api/pricing", async (req, res) => {
    try {
      const pricing = await storage.getPricing();
      res.json(pricing);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pricing" });
    }
  });

  app.post("/api/pricing", async (req, res) => {
    try {
      const result = insertPricingSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid pricing data", errors: result.error.issues });
      }
      const pricing = await storage.createPricing(result.data);
      res.status(201).json(pricing);
    } catch (error) {
      res.status(500).json({ message: "Failed to create pricing" });
    }
  });

  app.delete("/api/pricing/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePricing(id);
      if (!success) {
        return res.status(404).json({ message: "Pricing not found" });
      }
      res.json({ message: "Pricing deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete pricing" });
    }
  });

  // Statistics endpoint for dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
