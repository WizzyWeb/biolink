import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { type Theme, type ThemeColors, type ThemeGradients, type ThemeFonts, type ThemeLayout } from '@shared/schema';

interface ThemeContextType {
  theme: Theme | null;
  isLoading: boolean;
  error: string | null;
  setTheme: (theme: Theme) => void;
  applyTheme: (theme: Theme) => void;
  resetToDefault: () => void;
  updateThemeColors: (colors: Partial<ThemeColors>) => void;
  updateThemeGradients: (gradients: Partial<ThemeGradients>) => void;
  updateThemeFonts: (fonts: Partial<ThemeFonts>) => void;
  updateThemeLayout: (layout: Partial<ThemeLayout>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  profileId?: string;
}

export function ThemeProvider({ children, profileId }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default theme fallback
  const defaultTheme: Theme = {
    id: 'default',
    profileId: profileId || '',
    name: 'Default',
    isActive: true,
    colors: {
      primary: 'hsl(258 89% 66%)',
      primaryForeground: 'hsl(0 0% 100%)',
      secondary: 'hsl(161 94% 30%)',
      secondaryForeground: 'hsl(0 0% 100%)',
      accent: 'hsl(211.5789 51.3514% 92.7451%)',
      accentForeground: 'hsl(203.8863 88.2845% 53.1373%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(210 25% 7.8431%)',
      card: 'hsl(0 0% 100%)',
      cardForeground: 'hsl(210 25% 7.8431%)',
      muted: 'hsl(240 1.9608% 90%)',
      mutedForeground: 'hsl(210 25% 7.8431%)',
      border: 'hsl(201.4286 30.4348% 90.9804%)',
      input: 'hsl(200 23.0769% 97.4510%)',
      ring: 'hsl(258 89% 66%)',
    },
    gradients: {
      background: {
        enabled: true,
        start: 'hsl(48 100% 81%)',
        end: '#FFD89B',
        angle: 135,
      },
      card: {
        enabled: false,
        start: 'hsl(0 0% 100%)',
        end: 'hsl(0 0% 100%)',
        angle: 0,
      },
      button: {
        enabled: true,
        start: 'hsl(258 89% 66%)',
        end: 'hsl(250 100% 80%)',
        angle: 135,
      },
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      display: 'Poppins',
    },
    layout: {
      borderRadius: 16,
      cardStyle: 'elevated',
      spacing: 'normal',
      shadowIntensity: 0.15,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Fetch theme on mount
  useEffect(() => {
    if (profileId) {
      fetchTheme(profileId);
    } else {
      setThemeState(defaultTheme);
      applyTheme(defaultTheme);
    }
  }, [profileId]);

  const fetchTheme = async (profileId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest('GET', `/api/themes/${profileId}`);
      if (response.ok) {
        const themeData = await response.json();
        setThemeState(themeData);
        applyTheme(themeData);
      } else {
        // Use default theme if no custom theme exists
        setThemeState(defaultTheme);
        applyTheme(defaultTheme);
      }
    } catch (err) {
      console.error('Failed to fetch theme:', err);
      setError('Failed to load theme');
      setThemeState(defaultTheme);
      applyTheme(defaultTheme);
    } finally {
      setIsLoading(false);
    }
  };

  const applyTheme = (themeToApply: Theme) => {
    const root = document.documentElement;
    
    // Apply colors
    Object.entries(themeToApply.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply gradients
    const { gradients } = themeToApply;
    
    // Background gradient
    if (gradients.background.enabled) {
      root.style.setProperty('--bg-gradient-start', gradients.background.start);
      root.style.setProperty('--bg-gradient-end', gradients.background.end);
      root.style.setProperty('--bg-gradient-angle', `${gradients.background.angle}deg`);
      const gradientValue = `linear-gradient(${gradients.background.angle}deg, ${gradients.background.start}, ${gradients.background.end})`;
      root.style.setProperty('--bg-gradient', gradientValue);
      console.log('Applied background gradient:', gradientValue);
    } else {
      root.style.setProperty('--bg-gradient', gradients.background.start);
      console.log('Applied background color:', gradients.background.start);
    }

    // Card gradient
    if (gradients.card.enabled) {
      root.style.setProperty('--card-gradient-start', gradients.card.start);
      root.style.setProperty('--card-gradient-end', gradients.card.end);
      root.style.setProperty('--card-gradient-angle', `${gradients.card.angle}deg`);
      root.style.setProperty('--card-gradient', `linear-gradient(${gradients.card.angle}deg, ${gradients.card.start}, ${gradients.card.end})`);
    } else {
      root.style.setProperty('--card-gradient', gradients.card.start);
    }

    // Button gradient
    if (gradients.button.enabled) {
      root.style.setProperty('--button-gradient-start', gradients.button.start);
      root.style.setProperty('--button-gradient-end', gradients.button.end);
      root.style.setProperty('--button-gradient-angle', `${gradients.button.angle}deg`);
      root.style.setProperty('--button-gradient', `linear-gradient(${gradients.button.angle}deg, ${gradients.button.start}, ${gradients.button.end})`);
    } else {
      root.style.setProperty('--button-gradient', gradients.button.start);
    }

    // Apply fonts
    root.style.setProperty('--font-heading', themeToApply.fonts.heading);
    root.style.setProperty('--font-body', themeToApply.fonts.body);
    root.style.setProperty('--font-display', themeToApply.fonts.display);

    // Apply layout
    root.style.setProperty('--radius', `${themeToApply.layout.borderRadius}px`);
    root.style.setProperty('--shadow-intensity', themeToApply.layout.shadowIntensity.toString());
    
    // Apply spacing
    const spacingMap = {
      compact: '0.5rem',
      normal: '1rem',
      spacious: '1.5rem',
    };
    root.style.setProperty('--spacing', spacingMap[themeToApply.layout.spacing]);

    // Apply card style
    root.style.setProperty('--card-style', themeToApply.layout.cardStyle);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const resetToDefault = () => {
    setTheme(defaultTheme);
  };

  const updateThemeColors = (colors: Partial<ThemeColors>) => {
    if (!theme) return;
    const updatedTheme = {
      ...theme,
      colors: { ...theme.colors, ...colors },
    };
    setTheme(updatedTheme);
  };

  const updateThemeGradients = (gradients: Partial<ThemeGradients>) => {
    if (!theme) return;
    const updatedTheme = {
      ...theme,
      gradients: { ...theme.gradients, ...gradients },
    };
    setTheme(updatedTheme);
  };

  const updateThemeFonts = (fonts: Partial<ThemeFonts>) => {
    if (!theme) return;
    const updatedTheme = {
      ...theme,
      fonts: { ...theme.fonts, ...fonts },
    };
    setTheme(updatedTheme);
  };

  const updateThemeLayout = (layout: Partial<ThemeLayout>) => {
    if (!theme) return;
    const updatedTheme = {
      ...theme,
      layout: { ...theme.layout, ...layout },
    };
    setTheme(updatedTheme);
  };

  const value: ThemeContextType = {
    theme,
    isLoading,
    error,
    setTheme,
    applyTheme,
    resetToDefault,
    updateThemeColors,
    updateThemeGradients,
    updateThemeFonts,
    updateThemeLayout,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
