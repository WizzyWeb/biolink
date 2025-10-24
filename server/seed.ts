import { db } from "./db";
import { profiles, socialLinks, users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Check if default profile already exists
  const existing = await db.select().from(profiles).where(eq(profiles.pageName, "demo"));
  
  if (existing.length > 0) {
    console.log("Default profile already exists, skipping seed.");
    return;
  }

  // Create a demo user first
  const [user] = await db
    .insert(users)
    .values({
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      isEmailVerified: true,
    })
    .returning();

  console.log("Created demo user:", user.email);

  // Create default profile
  const [profile] = await db
    .insert(profiles)
    .values({
      userId: user.id,
      pageName: "demo",
      displayName: "Sarah Mitchell",
      bio: "Digital Creator | UX Designer | Coffee Enthusiast ☕\nSharing my journey through design, tech, and lifestyle",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300",
      isDefault: true,
    })
    .returning();

  console.log("Created profile:", profile.pageName);

  // Create default links
  const defaultLinks = [
    {
      profileId: profile.id,
      platform: "instagram",
      title: "Instagram",
      url: "https://instagram.com/demo",
      description: "@demo • Daily inspiration & behind the scenes",
      order: 1,
    },
    {
      profileId: profile.id,
      platform: "twitter",
      title: "Twitter / X",
      url: "https://twitter.com/sarahm_design",
      description: "@sarahm_design • Thoughts on design & tech",
      order: 2,
    },
    {
      profileId: profile.id,
      platform: "linkedin",
      title: "LinkedIn",
      url: "https://linkedin.com/in/demo",
      description: "Professional network & portfolio",
      order: 3,
    },
    {
      profileId: profile.id,
      platform: "tiktok",
      title: "TikTok",
      url: "https://tiktok.com/@sarahcreates",
      description: "@sarahcreates • Quick design tips & trends",
      order: 4,
    },
    {
      profileId: profile.id,
      platform: "youtube",
      title: "YouTube",
      url: "https://youtube.com/demo",
      description: "Design tutorials & creative process videos",
      order: 5,
    },
    {
      profileId: profile.id,
      platform: "github",
      title: "GitHub",
      url: "https://github.com/demo",
      description: "Open source projects & code repositories",
      order: 6,
    },
    {
      profileId: profile.id,
      platform: "website",
      title: "Portfolio Website",
      url: "https://demo.design",
      description: "View my complete design portfolio",
      order: 7,
    },
    {
      profileId: profile.id,
      platform: "newsletter",
      title: "Newsletter",
      url: "https://demo.substack.com",
      description: "Subscribe for weekly design insights",
      order: 8,
    },
  ];

  await db.insert(socialLinks).values(defaultLinks);
  
  console.log("Created", defaultLinks.length, "social links");
  console.log("Seed complete!");
}

seed().catch(console.error).finally(() => process.exit());
