import { type Profile, type SocialLink, type InsertProfile, type InsertSocialLink, type UpdateProfile, type UpdateSocialLink } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Profile methods
  getProfile(username: string): Promise<Profile | undefined>;
  getProfileById(id: string): Promise<Profile | undefined>;
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
}

export class MemStorage implements IStorage {
  private profiles: Map<string, Profile>;
  private socialLinks: Map<string, SocialLink>;

  constructor() {
    this.profiles = new Map();
    this.socialLinks = new Map();

    // Create a default profile for demo
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    const defaultProfile: Profile = {
      id: "default-profile-id",
      username: "sarahmitchell",
      displayName: "Sarah Mitchell",
      bio: "Digital Creator | UX Designer | Coffee Enthusiast ☕\nSharing my journey through design, tech, and lifestyle",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300",
      profileViews: 12500,
      linkClicks: 3200,
    };

    this.profiles.set(defaultProfile.id, defaultProfile);

    const defaultLinks: SocialLink[] = [
      {
        id: "link-1",
        profileId: "default-profile-id",
        platform: "instagram",
        title: "Instagram",
        url: "https://instagram.com/sarahmitchell",
        description: "@sarahmitchell • Daily inspiration & behind the scenes",
        order: 1,
        isActive: true,
      },
      {
        id: "link-2",
        profileId: "default-profile-id",
        platform: "twitter",
        title: "Twitter / X",
        url: "https://twitter.com/sarahm_design",
        description: "@sarahm_design • Thoughts on design & tech",
        order: 2,
        isActive: true,
      },
      {
        id: "link-3",
        profileId: "default-profile-id",
        platform: "linkedin",
        title: "LinkedIn",
        url: "https://linkedin.com/in/sarahmitchell",
        description: "Professional network & portfolio",
        order: 3,
        isActive: true,
      },
      {
        id: "link-4",
        profileId: "default-profile-id",
        platform: "tiktok",
        title: "TikTok",
        url: "https://tiktok.com/@sarahcreates",
        description: "@sarahcreates • Quick design tips & trends",
        order: 4,
        isActive: true,
      },
      {
        id: "link-5",
        profileId: "default-profile-id",
        platform: "youtube",
        title: "YouTube",
        url: "https://youtube.com/sarahmitchell",
        description: "Design tutorials & creative process videos",
        order: 5,
        isActive: true,
      },
      {
        id: "link-6",
        profileId: "default-profile-id",
        platform: "github",
        title: "GitHub",
        url: "https://github.com/sarahmitchell",
        description: "Open source projects & code repositories",
        order: 6,
        isActive: true,
      },
      {
        id: "link-7",
        profileId: "default-profile-id",
        platform: "website",
        title: "Portfolio Website",
        url: "https://sarahmitchell.design",
        description: "View my complete design portfolio",
        order: 7,
        isActive: true,
      },
      {
        id: "link-8",
        profileId: "default-profile-id",
        platform: "newsletter",
        title: "Newsletter",
        url: "https://sarahmitchell.substack.com",
        description: "Subscribe for weekly design insights",
        order: 8,
        isActive: true,
      },
    ];

    defaultLinks.forEach(link => {
      this.socialLinks.set(link.id, link);
    });
  }

  async getProfile(username: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.username === username
    );
  }

  async getProfileById(id: string): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const profile: Profile = {
      ...insertProfile,
      id,
      profileImageUrl: insertProfile.profileImageUrl || null,
      profileViews: 0,
      linkClicks: 0,
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: string, updates: Partial<UpdateProfile>): Promise<Profile | undefined> {
    const existing = this.profiles.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.profiles.set(id, updated);
    return updated;
  }

  async incrementProfileViews(id: string): Promise<void> {
    const profile = this.profiles.get(id);
    if (profile) {
      profile.profileViews = (profile.profileViews || 0) + 1;
      this.profiles.set(id, profile);
    }
  }

  async incrementLinkClicks(id: string): Promise<void> {
    const profile = this.profiles.get(id);
    if (profile) {
      profile.linkClicks = (profile.linkClicks || 0) + 1;
      this.profiles.set(id, profile);
    }
  }

  async getSocialLinks(profileId: string): Promise<SocialLink[]> {
    return Array.from(this.socialLinks.values())
      .filter(link => link.profileId === profileId && link.isActive)
      .sort((a, b) => a.order - b.order);
  }

  async getSocialLink(id: string): Promise<SocialLink | undefined> {
    return this.socialLinks.get(id);
  }

  async createSocialLink(insertLink: InsertSocialLink): Promise<SocialLink> {
    const id = randomUUID();
    const link: SocialLink = {
      ...insertLink,
      id,
      order: insertLink.order ?? 0,
      description: insertLink.description || null,
      isActive: true,
    };
    this.socialLinks.set(id, link);
    return link;
  }

  async updateSocialLink(id: string, updates: Partial<UpdateSocialLink>): Promise<SocialLink | undefined> {
    const existing = this.socialLinks.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.socialLinks.set(id, updated);
    return updated;
  }

  async deleteSocialLink(id: string): Promise<boolean> {
    return this.socialLinks.delete(id);
  }

  async reorderSocialLinks(linkIds: string[]): Promise<void> {
    linkIds.forEach((id, index) => {
      const link = this.socialLinks.get(id);
      if (link) {
        link.order = index + 1;
        this.socialLinks.set(id, link);
      }
    });
  }
}

export const storage = new MemStorage();
