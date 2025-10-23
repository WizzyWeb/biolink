import { type User, type UpsertUser, type Profile, type SocialLink, type InsertProfile, type InsertSocialLink, type UpdateProfile, type UpdateSocialLink, users, profiles, socialLinks } from "@shared/schema";
import { db } from "./db";
import { eq, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Profile methods
  getProfile(username: string): Promise<Profile | undefined>;
  getProfileById(id: string): Promise<Profile | undefined>;
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, updates: Partial<UpdateProfile>): Promise<Profile | undefined>;
  incrementProfileViews(id: string): Promise<void>;
  incrementLinkClicks(id: string): Promise<void>;

  // Social links methods
  getSocialLinks(profileId: string): Promise<SocialLink[]>;
  getSocialLink(id: string): Promise<SocialLink | undefined>;
  createSocialLink(link: InsertSocialLink): Promise<SocialLink>;
  updateSocialLink(id: string, updates: Partial<UpdateSocialLink>): Promise<SocialLink | undefined>;
  deleteSocialLink(id: string): Promise<boolean>;
  reorderSocialLinks(linkIds: string[]): Promise<void>;
  incrementIndividualLinkClick(linkId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Profile methods
  async getProfile(username: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.username, username));
    return profile || undefined;
  }

  async getProfileById(id: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile || undefined;
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile || undefined;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db
      .insert(profiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateProfile(id: string, updates: Partial<UpdateProfile>): Promise<Profile | undefined> {
    const [profile] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.id, id))
      .returning();
    return profile || undefined;
  }

  async incrementProfileViews(id: string): Promise<void> {
    await db
      .update(profiles)
      .set({ profileViews: sql`${profiles.profileViews} + 1` })
      .where(eq(profiles.id, id));
  }

  async incrementLinkClicks(id: string): Promise<void> {
    await db
      .update(profiles)
      .set({ linkClicks: sql`${profiles.linkClicks} + 1` })
      .where(eq(profiles.id, id));
  }

  async getSocialLinks(profileId: string): Promise<SocialLink[]> {
    return await db
      .select()
      .from(socialLinks)
      .where(eq(socialLinks.profileId, profileId))
      .orderBy(asc(socialLinks.order));
  }

  async getSocialLink(id: string): Promise<SocialLink | undefined> {
    const [link] = await db.select().from(socialLinks).where(eq(socialLinks.id, id));
    return link || undefined;
  }

  async createSocialLink(insertLink: InsertSocialLink): Promise<SocialLink> {
    const [link] = await db
      .insert(socialLinks)
      .values(insertLink)
      .returning();
    return link;
  }

  async updateSocialLink(id: string, updates: Partial<UpdateSocialLink>): Promise<SocialLink | undefined> {
    const [link] = await db
      .update(socialLinks)
      .set(updates)
      .where(eq(socialLinks.id, id))
      .returning();
    return link || undefined;
  }

  async deleteSocialLink(id: string): Promise<boolean> {
    const result = await db
      .delete(socialLinks)
      .where(eq(socialLinks.id, id))
      .returning();
    return result.length > 0;
  }

  async reorderSocialLinks(linkIds: string[]): Promise<void> {
    for (let i = 0; i < linkIds.length; i++) {
      await db
        .update(socialLinks)
        .set({ order: i + 1 })
        .where(eq(socialLinks.id, linkIds[i]));
    }
  }

  async incrementIndividualLinkClick(linkId: string): Promise<void> {
    await db
      .update(socialLinks)
      .set({ clicks: sql`${socialLinks.clicks} + 1` })
      .where(eq(socialLinks.id, linkId));
  }
}

export const storage = new DatabaseStorage();
