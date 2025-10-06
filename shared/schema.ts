import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio").notNull(),
  profileImageUrl: text("profile_image_url"),
  profileViews: integer("profile_views").default(0),
  linkClicks: integer("link_clicks").default(0),
});

export const socialLinks = pgTable("social_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull(),
  platform: text("platform").notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").default(true),
  clicks: integer("clicks").default(0),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  profileViews: true,
  linkClicks: true,
});

export const insertSocialLinkSchema = createInsertSchema(socialLinks).omit({
  id: true,
});

export const updateProfileSchema = insertProfileSchema.partial().extend({
  id: z.string(),
});

export const updateSocialLinkSchema = insertSocialLinkSchema.partial().extend({
  id: z.string(),
});

export const reorderLinksSchema = z.object({
  linkIds: z.array(z.string()),
});

export type Profile = typeof profiles.$inferSelect;
export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type UpdateSocialLink = z.infer<typeof updateSocialLinkSchema>;
