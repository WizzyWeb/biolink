import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProfileSchema, 
  insertSocialLinkSchema, 
  updateProfileSchema, 
  updateSocialLinkSchema,
  reorderLinksSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get profile by username
  app.get("/api/profile/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const profile = await storage.getProfile(username);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Increment profile views
      await storage.incrementProfileViews(profile.id);
      
      const links = await storage.getSocialLinks(profile.id);
      
      res.json({ profile, links });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update profile
  app.patch("/api/profile/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateProfileSchema.parse({ id, ...req.body });
      
      const profile = await storage.updateProfile(id, updates);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create social link
  app.post("/api/links", async (req, res) => {
    try {
      const linkData = insertSocialLinkSchema.parse(req.body);
      const link = await storage.createSocialLink(linkData);
      res.status(201).json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update social link
  app.patch("/api/links/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateSocialLinkSchema.parse({ id, ...req.body });
      
      const link = await storage.updateSocialLink(id, updates);
      
      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }
      
      res.json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete social link
  app.delete("/api/links/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSocialLink(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Link not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reorder social links
  app.patch("/api/links/reorder", async (req, res) => {
    try {
      const { linkIds } = reorderLinksSchema.parse(req.body);
      await storage.reorderSocialLinks(linkIds);
      res.status(200).json({ message: "Links reordered successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Track link click
  app.post("/api/links/:id/click", async (req, res) => {
    try {
      const { id } = req.params;
      const link = await storage.getSocialLink(id);
      
      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }

      // Increment link clicks for the profile
      await storage.incrementLinkClicks(link.profileId);
      
      res.json({ url: link.url });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
