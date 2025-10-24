import { db } from './db';
import { themes, profiles, users } from '@shared/schema';
import { presetThemes } from './presetThemes';

async function seedThemes() {
  try {
    console.log('Seeding preset themes...');
    
    // Use a transaction to ensure all operations succeed or fail together
    await db.transaction(async (tx) => {
      const systemUserId = 'system-preset-user';
      const systemProfileId = 'system-preset-profile';
      
      // First, create a system user for preset themes
      await tx.insert(users).values({
        id: systemUserId,
        email: 'system@preset-themes.local',
        firstName: 'System',
        lastName: 'Preset',
        isEmailVerified: true,
      }).onConflictDoNothing(); // Don't fail if user already exists
      
      // Then, create a system profile for preset themes
      await tx.insert(profiles).values({
        id: systemProfileId,
        userId: systemUserId,
        username: 'system-preset-themes',
        displayName: 'System Preset Themes',
        bio: 'System profile for managing preset themes',
      }).onConflictDoNothing(); // Don't fail if profile already exists
      
      // Finally, insert preset themes with the system profile ID
      for (const preset of presetThemes) {
        await tx.insert(themes).values({
          profileId: systemProfileId,
          name: preset.name,
          isActive: false,
          colors: preset.colors,
          gradients: preset.gradients,
          fonts: preset.fonts,
          layout: preset.layout,
        });
      }
    });
    
    console.log('Preset themes seeded successfully!');
  } catch (error) {
    console.error('Error seeding themes:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedThemes().then(() => process.exit(0));
}

export { seedThemes };
