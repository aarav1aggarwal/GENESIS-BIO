import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema,
  insertUserProgressSchema,
  insertBadgeSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route("/api");
  
  // Learn Topics
  app.get("/api/learn/topics", async (req, res) => {
    try {
      const topics = await storage.getAllLearnTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning topics" });
    }
  });
  
  app.get("/api/learn/topics/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const topic = await storage.getLearnTopic(id);
      
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topic" });
    }
  });
  
  // Tissue Items
  app.get("/api/explore/tissues", async (req, res) => {
    try {
      let tissues;
      
      // Handle filtering
      if (Object.keys(req.query).length > 0) {
        const filter: Partial<Record<string, any>> = {};
        
        if (req.query.category) filter.category = req.query.category;
        if (req.query.cellType) filter.cellType = req.query.cellType;
        if (req.query.bioInk) filter.bioInk = req.query.bioInk;
        if (req.query.labName) filter.labName = req.query.labName;
        
        tissues = await storage.getTissueItemsByFilter(filter);
      } else {
        tissues = await storage.getAllTissueItems();
      }
      
      res.json(tissues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tissue items" });
    }
  });
  
  app.get("/api/explore/tissues/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tissue = await storage.getTissueItem(id);
      
      if (!tissue) {
        return res.status(404).json({ message: "Tissue not found" });
      }
      
      res.json(tissue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tissue" });
    }
  });
  
  // Case Studies
  app.get("/api/biocase/studies", async (req, res) => {
    try {
      const studies = await storage.getAllCaseStudies();
      res.json(studies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case studies" });
    }
  });
  
  app.get("/api/biocase/studies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const study = await storage.getCaseStudy(id);
      
      if (!study) {
        return res.status(404).json({ message: "Case study not found" });
      }
      
      res.json(study);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case study" });
    }
  });
  
  // Challenges
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });
  
  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const challenge = await storage.getChallenge(id);
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });
  
  // User Management
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Return without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.post("/api/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you'd create a session here
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // User Progress
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });
  
  app.post("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId
      });
      
      const progress = await storage.createUserProgress(progressData);
      
      // Update user XP if the progress item is completed
      if (progressData.completed) {
        await storage.updateUserProgress(userId, 100); // Award 100 XP points
      }
      
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create progress" });
    }
  });
  
  // User Badges
  app.get("/api/users/:userId/badges", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user badges" });
    }
  });
  
  app.post("/api/users/:userId/badges", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const badgeData = insertBadgeSchema.parse({
        ...req.body,
        userId
      });
      
      const badge = await storage.createBadge(badgeData);
      
      // Update user XP when badge is earned
      await storage.updateUserProgress(userId, 250); // Award 250 XP points for badge
      
      res.status(201).json(badge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid badge data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create badge" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
