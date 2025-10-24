import { db } from './db';
import { themes } from '@shared/schema';
import { presetThemes } from './presetThemes';

async function seedThemes() {
  try {
    console.log('Seeding preset themes...');
    
    // First, create a dummy profile for preset themes
    const dummyProfileId = 'preset-themes-profile';
    
    // Insert preset themes with a dummy profile ID
    for (const preset of presetThemes) {
      await db.insert(themes).values({
        profileId: dummyProfileId,
        name: preset.name,
        isActive: false,
        colors: preset.colors,
        gradients: preset.gradients,
        fonts: preset.fonts,
        layout: preset.layout,
      });
    }
    
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
