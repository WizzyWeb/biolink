import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Palette, Paintbrush, Type, Layout, Sparkles, Save, RotateCcw } from 'lucide-react';
import { type Theme, type ThemeColors, type ThemeGradients, type ThemeFonts, type ThemeLayout } from '@shared/schema';

interface ThemeBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
}

interface PresetTheme {
  name: string;
  colors: ThemeColors;
  gradients: ThemeGradients;
  fonts: ThemeFonts;
  layout: ThemeLayout;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
];

// Helper function to convert any color format to hex for color inputs
const convertToHex = (color: string): string => {
  if (!color || typeof color !== 'string') return '#000000';
  
  // If already hex, return as is
  if (color.startsWith('#')) return color;
  
  // Handle HSL format
  if (color.startsWith('hsl(')) {
    try {
      // Extract HSL values from string like "hsl(258 89% 66%)"
      const match = color.match(/hsl\((\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\)/);
      if (match) {
        const h = parseFloat(match[1]);
        const s = parseFloat(match[2]) / 100;
        const l = parseFloat(match[3]) / 100;
        
        // Convert HSL to RGB
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        
        let r, g, b;
        if (h >= 0 && h < 60) {
          r = c; g = x; b = 0;
        } else if (h >= 60 && h < 120) {
          r = x; g = c; b = 0;
        } else if (h >= 120 && h < 180) {
          r = 0; g = c; b = x;
        } else if (h >= 180 && h < 240) {
          r = 0; g = x; b = c;
        } else if (h >= 240 && h < 300) {
          r = x; g = 0; b = c;
        } else {
          r = c; g = 0; b = x;
        }
        
        // Convert to 0-255 range and then to hex
        const toHex = (n: number) => {
          const hex = Math.round((n + m) * 255).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
    } catch (error) {
      console.warn('Failed to convert HSL to hex:', error);
    }
  }
  
  // Handle RGB format
  if (color.startsWith('rgb(')) {
    try {
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const toHex = (n: number) => {
          const hex = n.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
    } catch (error) {
      console.warn('Failed to convert RGB to hex:', error);
    }
  }
  
  // Fallback to black
  return '#000000';
};

// Helper function to convert hex back to HSL format (theme's expected format)
const convertToHsl = (hex: string): string => {
  if (!hex || typeof hex !== 'string') return 'hsl(0 0% 0%)';
  
  // Ensure hex starts with #
  if (!hex.startsWith('#')) {
    hex = '#' + hex;
  }
  
  // Remove # and ensure 6 characters
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  if (hex.length !== 6) return 'hsl(0 0% 0%)';
  
  try {
    // Convert hex to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Convert RGB to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    if (diff !== 0) {
      if (max === r) {
        h = ((g - b) / diff) % 6;
      } else if (max === g) {
        h = (b - r) / diff + 2;
      } else {
        h = (r - g) / diff + 4;
      }
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    const l = (max + min) / 2;
    const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));
    
    return `hsl(${h} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
  } catch (error) {
    console.warn('Failed to convert hex to HSL:', error);
    return 'hsl(0 0% 0%)';
  }
};

// Import all preset themes from server
import { presetThemes as serverPresetThemes } from '../../../server/presetThemes';

// Fallback preset themes in case API fails - use all server themes
const fallbackPresetThemes: PresetTheme[] = serverPresetThemes.map(preset => ({
  name: preset.name,
  colors: preset.colors,
  gradients: preset.gradients,
  fonts: preset.fonts,
  layout: preset.layout,
}));

export default function ThemeBuilderModal({ isOpen, onClose, profileId }: ThemeBuilderModalProps) {
  const { theme, setTheme, updateThemeColors, updateThemeGradients, updateThemeFonts, updateThemeLayout, resetToDefault } = useTheme();
  const { toast } = useToast();
  const [presetThemes, setPresetThemes] = useState<PresetTheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPresetThemes();
    }
  }, [isOpen]);

  const fetchPresetThemes = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching preset themes...');
      const response = await apiRequest('GET', '/api/themes/presets');
      console.log('Response status:', response.status);
      if (response.ok) {
        const presets = await response.json();
        console.log('Received presets from API:', presets.length);
        setPresetThemes(Array.isArray(presets) && presets.length > 0 ? presets : fallbackPresetThemes);
      } else {
        console.error('Failed to fetch preset themes:', response.statusText);
        console.log('Using fallback preset themes:', fallbackPresetThemes.length);
        setPresetThemes(fallbackPresetThemes);
      }
    } catch (error) {
      console.error('Failed to fetch preset themes:', error);
      console.log('Using fallback preset themes:', fallbackPresetThemes.length);
      setPresetThemes(fallbackPresetThemes);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTheme = async () => {
    if (!theme) return;
    
    setIsSaving(true);
    try {
      const response = await apiRequest('POST', '/api/themes', {
        profileId,
        name: theme.name,
        colors: theme.colors,
        gradients: theme.gradients,
        fonts: theme.fonts,
        layout: theme.layout,
      });

      if (response.ok) {
        const savedTheme = await response.json();
        // Activate the theme
        await apiRequest('POST', `/api/themes/${savedTheme.id}/activate`);
        
        toast({
          title: 'Theme saved successfully',
          description: 'Your custom theme has been applied to your profile.',
        });
        onClose();
      } else {
        throw new Error('Failed to save theme');
      }
    } catch (error) {
      toast({
        title: 'Error saving theme',
        description: 'There was an error saving your theme. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePresetSelect = (preset: PresetTheme) => {
    const presetTheme: Theme = {
      id: 'preset',
      profileId,
      name: preset.name,
      isActive: false,
      colors: preset.colors,
      gradients: preset.gradients,
      fonts: preset.fonts,
      layout: preset.layout,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTheme(presetTheme);
  };

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    updateThemeColors({ [colorKey]: value });
  };

  const handleGradientChange = (gradientType: keyof ThemeGradients, property: string, value: any) => {
    updateThemeGradients({
      [gradientType]: {
        ...(theme?.gradients as ThemeGradients)?.[gradientType],
        [property]: value,
      },
    });
  };

  const handleFontChange = (fontKey: keyof ThemeFonts, value: string) => {
    updateThemeFonts({ [fontKey]: value });
  };

  const handleLayoutChange = (layoutKey: keyof ThemeLayout, value: any) => {
    updateThemeLayout({ [layoutKey]: value });
  };

  if (!theme) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Builder
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Theme Controls */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="colors" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="gradients" className="flex items-center gap-2">
                  <Paintbrush className="w-4 h-4" />
                  Gradients
                </TabsTrigger>
                <TabsTrigger value="fonts" className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Fonts
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Layout
                </TabsTrigger>
                <TabsTrigger value="presets" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Presets
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(theme.colors as ThemeColors).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={key}
                          type="color"
                          value={convertToHex(value as string)}
                          onChange={(e) => handleColorChange(key as keyof ThemeColors, convertToHsl(e.target.value))}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={value as string}
                          onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="gradients" className="space-y-4">
                {Object.entries(theme.gradients as ThemeGradients).map(([gradientType, gradient]) => (
                  <Card key={gradientType}>
                    <CardHeader>
                      <CardTitle className="capitalize text-sm">
                        {gradientType === 'background' ? 'Full Page Background Gradient' : 
                         gradientType === 'card' ? 'Card Background Gradient' :
                         gradientType === 'button' ? 'Button Gradient' : 
                         `${gradientType} Gradient`}
                      </CardTitle>
                      {gradientType === 'background' && (
                        <p className="text-xs text-gray-600 mt-1">
                          This gradient will be applied to the entire page background
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={(gradient as any).enabled}
                          onCheckedChange={(checked) => handleGradientChange(gradientType as keyof ThemeGradients, 'enabled', checked)}
                        />
                        <Label>Enable gradient</Label>
                      </div>
                      
                      {(gradient as any).enabled && (
                        <>
                          <div className="space-y-2">
                            <Label>Start Color</Label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={convertToHex((gradient as any).start)}
                                onChange={(e) => handleGradientChange(gradientType as keyof ThemeGradients, 'start', convertToHsl(e.target.value))}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={(gradient as any).start}
                                onChange={(e) => handleGradientChange(gradientType as keyof ThemeGradients, 'start', e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>End Color</Label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={convertToHex((gradient as any).end)}
                                onChange={(e) => handleGradientChange(gradientType as keyof ThemeGradients, 'end', convertToHsl(e.target.value))}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={(gradient as any).end}
                                onChange={(e) => handleGradientChange(gradientType as keyof ThemeGradients, 'end', e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Angle: {(gradient as any).angle}°</Label>
                            <Slider
                              value={[(gradient as any).angle]}
                              onValueChange={([value]) => handleGradientChange(gradientType as keyof ThemeGradients, 'angle', value)}
                              max={360}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="fonts" className="space-y-4">
                {Object.entries(theme.fonts as ThemeFonts).map(([fontKey, fontValue]) => (
                  <div key={fontKey} className="space-y-2">
                    <Label className="capitalize">
                      {fontKey} Font
                    </Label>
                    <Select
                      value={fontValue as string}
                      onValueChange={(value) => handleFontChange(fontKey as keyof ThemeFonts, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.value }}>{font.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <div className="space-y-2">
                  <Label>Border Radius: {(theme.layout as ThemeLayout).borderRadius}px</Label>
                  <Slider
                    value={[(theme.layout as ThemeLayout).borderRadius]}
                    onValueChange={([value]) => handleLayoutChange('borderRadius', value)}
                    max={32}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Card Style</Label>
                  <Select
                    value={(theme.layout as ThemeLayout).cardStyle}
                    onValueChange={(value) => handleLayoutChange('cardStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elevated">Elevated</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="outlined">Outlined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Spacing</Label>
                  <Select
                    value={(theme.layout as ThemeLayout).spacing}
                    onValueChange={(value) => handleLayoutChange('spacing', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Shadow Intensity: {Math.round((theme.layout as ThemeLayout).shadowIntensity * 100)}%</Label>
                  <Slider
                    value={[(theme.layout as ThemeLayout).shadowIntensity]}
                    onValueChange={([value]) => handleLayoutChange('shadowIntensity', value)}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              </TabsContent>

              <TabsContent value="presets" className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Loading preset themes...</p>
                  </div>
                ) : Array.isArray(presetThemes) && presetThemes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {presetThemes.map((preset) => (
                      <Card 
                        key={preset.name} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handlePresetSelect(preset)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{preset.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex gap-1 mb-2">
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: preset.colors.primary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: preset.colors.secondary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: preset.colors.accent }}
                            />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {preset.layout.cardStyle}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-600">No preset themes available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-sm">Live Preview</CardTitle>
                <CardDescription>See how your theme looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="theme-card theme-spacing-normal space-y-4">
                  {/* Mini Profile Preview */}
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full mx-auto mb-2 gradient-border">
                      <div className="w-full h-full rounded-full bg-primary"></div>
                    </div>
                    <h3 className="theme-font-display font-bold text-sm">John Doe</h3>
                    <p className="text-xs text-muted-foreground">Software Developer</p>
                  </div>
                  
                  {/* Mini Link Cards */}
                  <div className="space-y-2">
                    <div className="theme-card theme-spacing-compact flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary"></div>
                      <span className="text-xs theme-font-body">GitHub</span>
                    </div>
                    <div className="theme-card theme-spacing-compact flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-secondary"></div>
                      <span className="text-xs theme-font-body">LinkedIn</span>
                    </div>
                  </div>
                  
                  {/* Mini Button */}
                  <Button className="theme-button w-full text-xs">
                    Sample Button
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefault}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveTheme} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save & Apply'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
