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
import { Palette, Gradient, Type, Layout, Sparkles, Save, RotateCcw } from 'lucide-react';
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
    try {
      const response = await apiRequest('GET', '/api/themes/presets');
      if (response.ok) {
        const presets = await response.json();
        setPresetThemes(presets);
      }
    } catch (error) {
      console.error('Failed to fetch preset themes:', error);
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
        ...theme?.gradients[gradientType],
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
                  <Gradient className="w-4 h-4" />
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
                  {Object.entries(theme.colors).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={key}
                          type="color"
                          value={value}
                          onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={value}
                          onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="gradients" className="space-y-4">
                {Object.entries(theme.gradients).map(([gradientType, gradient]) => (
                  <Card key={gradientType}>
                    <CardHeader>
                      <CardTitle className="capitalize text-sm">
                        {gradientType} Gradient
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={gradient.enabled}
                          onCheckedChange={(checked) => handleGradientChange(gradientType as keyof ThemeGradients, 'enabled', checked)}
                        />
                        <Label>Enable gradient</Label>
                      </div>
                      
                      {gradient.enabled && (
                        <>
                          <div className="space-y-2">
                            <Label>Start Color</Label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={gradient.start}
                                onChange={(e) => handleGradientChange(gradientType as keyof ThemeGradients, 'start', e.target.value)}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={gradient.start}
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
                                value={gradient.end}
                                onChange={(e) => handleGradientChange(gradientType as keyof ThemeGradients, 'end', e.target.value)}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={gradient.end}
                                onChange={(e) => handleGradientChange(gradientType as keyof ThemeGradients, 'end', e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Angle: {gradient.angle}°</Label>
                            <Slider
                              value={[gradient.angle]}
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
                {Object.entries(theme.fonts).map(([fontKey, fontValue]) => (
                  <div key={fontKey} className="space-y-2">
                    <Label className="capitalize">
                      {fontKey} Font
                    </Label>
                    <Select
                      value={fontValue}
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
                  <Label>Border Radius: {theme.layout.borderRadius}px</Label>
                  <Slider
                    value={[theme.layout.borderRadius]}
                    onValueChange={([value]) => handleLayoutChange('borderRadius', value)}
                    max={32}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Card Style</Label>
                  <Select
                    value={theme.layout.cardStyle}
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
                    value={theme.layout.spacing}
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
                  <Label>Shadow Intensity: {Math.round(theme.layout.shadowIntensity * 100)}%</Label>
                  <Slider
                    value={[theme.layout.shadowIntensity]}
                    onValueChange={([value]) => handleLayoutChange('shadowIntensity', value)}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              </TabsContent>

              <TabsContent value="presets" className="space-y-4">
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
