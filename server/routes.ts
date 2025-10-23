import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import authRoutes from "./auth";
import { 
  insertProfileSchema, 
  insertSocialLinkSchema, 
  updateProfileSchema, 
  updateSocialLinkSchema,
  reorderLinksSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Email/password auth routes
  app.use('/api/auth', authRoutes);

  // Replit Auth routes (keep for backward compatibility)
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Include profile information with user
      const profile = await storage.getProfileByUserId(userId);
      res.json({ ...user, profile });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
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

  // Update profile (protected)
  app.patch("/api/profile/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check ownership
      const existingProfile = await storage.getProfileById(id);
      if (!existingProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      if (existingProfile.userId !== userId) {
        return res.status(403).json({ message: "Forbidden: You can only edit your own profile" });
      }
      
      const updates = updateProfileSchema.parse({ id, ...req.body });
      const profile = await storage.updateProfile(id, updates);
      
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create social link (protected)
  app.post("/api/links", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const linkData = insertSocialLinkSchema.parse(req.body);
      
      // Check ownership of the profile
      const profile = await storage.getProfileById(linkData.profileId);
      if (!profile || profile.userId !== userId) {
        return res.status(403).json({ message: "Forbidden: You can only add links to your own profile" });
      }
      
      const link = await storage.createSocialLink(linkData);
      res.status(201).json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update social link (protected)
  app.patch("/api/links/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check ownership
      const existingLink = await storage.getSocialLink(id);
      if (!existingLink) {
        return res.status(404).json({ message: "Link not found" });
      }
      
      const profile = await storage.getProfileById(existingLink.profileId);
      if (!profile || profile.userId !== userId) {
        return res.status(403).json({ message: "Forbidden: You can only edit your own links" });
      }
      
      const updates = updateSocialLinkSchema.parse({ id, ...req.body });
      const link = await storage.updateSocialLink(id, updates);
      
      res.json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete social link (protected)
  app.delete("/api/links/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check ownership
      const existingLink = await storage.getSocialLink(id);
      if (!existingLink) {
        return res.status(404).json({ message: "Link not found" });
      }
      
      const profile = await storage.getProfileById(existingLink.profileId);
      if (!profile || profile.userId !== userId) {
        return res.status(403).json({ message: "Forbidden: You can only delete your own links" });
      }
      
      const deleted = await storage.deleteSocialLink(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reorder social links (protected)
  app.patch("/api/links/reorder", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { linkIds } = reorderLinksSchema.parse(req.body);
      
      // Check ownership of ALL links (not just the first one!)
      if (linkIds.length > 0) {
        for (const linkId of linkIds) {
          const link = await storage.getSocialLink(linkId);
          if (!link) {
            return res.status(404).json({ message: `Link ${linkId} not found` });
          }
          
          const profile = await storage.getProfileById(link.profileId);
          if (!profile || profile.userId !== userId) {
            return res.status(403).json({ message: "Forbidden: You can only reorder your own links" });
          }
        }
      }
      
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

      // Increment link clicks for the profile and individual link
      await storage.incrementLinkClicks(link.profileId);
      await storage.incrementIndividualLinkClick(id);
      
      res.json({ url: link.url });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get analytics data
  app.get("/api/analytics/:profileId", async (req, res) => {
    try {
      const { profileId } = req.params;
      const profile = await storage.getProfileById(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const links = await storage.getSocialLinks(profileId);
      
      res.json({
        profile: {
          views: profile.profileViews || 0,
          totalClicks: profile.linkClicks || 0,
        },
        links: links.map(link => ({
          id: link.id,
          title: link.title,
          platform: link.platform,
          clicks: link.clicks || 0,
          url: link.url,
        })),
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
