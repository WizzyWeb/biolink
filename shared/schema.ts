import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password"), // Hashed password for email/password auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
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

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type UpdateSocialLink = z.infer<typeof updateSocialLinkSchema>;
