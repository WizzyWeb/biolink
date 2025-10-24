-- Migration: Add themes table
-- Description: Creates the themes table for storing user customizations

CREATE TABLE IF NOT EXISTS themes (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id VARCHAR NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    colors JSONB NOT NULL,
    gradients JSONB NOT NULL,
    fonts JSONB NOT NULL,
    layout JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_themes_profile_id ON themes(profile_id);
CREATE INDEX IF NOT EXISTS idx_themes_is_active ON themes(is_active);
CREATE INDEX IF NOT EXISTS idx_themes_profile_active ON themes(profile_id, is_active);

-- Insert preset themes
INSERT INTO themes (profile_id, name, is_active, colors, gradients, fonts, layout) VALUES
('preset-default', 'Default', false, 
 '{"primary": "hsl(258 89% 66%)", "primaryForeground": "hsl(0 0% 100%)", "secondary": "hsl(161 94% 30%)", "secondaryForeground": "hsl(0 0% 100%)", "accent": "hsl(211.5789 51.3514% 92.7451%)", "accentForeground": "hsl(203.8863 88.2845% 53.1373%)", "background": "hsl(0 0% 100%)", "foreground": "hsl(210 25% 7.8431%)", "card": "hsl(0 0% 100%)", "cardForeground": "hsl(210 25% 7.8431%)", "muted": "hsl(240 1.9608% 90%)", "mutedForeground": "hsl(210 25% 7.8431%)", "border": "hsl(201.4286 30.4348% 90.9804%)", "input": "hsl(200 23.0769% 97.4510%)", "ring": "hsl(258 89% 66%)"}',
 '{"background": {"enabled": true, "start": "hsl(48 100% 81%)", "end": "#FFD89B", "angle": 135}, "card": {"enabled": false, "start": "hsl(0 0% 100%)", "end": "hsl(0 0% 100%)", "angle": 0}, "button": {"enabled": true, "start": "hsl(258 89% 66%)", "end": "hsl(250 100% 80%)", "angle": 135}}',
 '{"heading": "Inter", "body": "Inter", "display": "Poppins"}',
 '{"borderRadius": 16, "cardStyle": "elevated", "spacing": "normal", "shadowIntensity": 0.15}'),

('preset-ocean', 'Ocean Blue', false,
 '{"primary": "hsl(203 88% 53%)", "primaryForeground": "hsl(0 0% 100%)", "secondary": "hsl(195 100% 50%)", "secondaryForeground": "hsl(0 0% 100%)", "accent": "hsl(195 100% 90%)", "accentForeground": "hsl(203 88% 53%)", "background": "hsl(0 0% 100%)", "foreground": "hsl(210 25% 7.8431%)", "card": "hsl(0 0% 100%)", "cardForeground": "hsl(210 25% 7.8431%)", "muted": "hsl(195 100% 95%)", "mutedForeground": "hsl(203 88% 53%)", "border": "hsl(195 100% 85%)", "input": "hsl(195 100% 97%)", "ring": "hsl(203 88% 53%)"}',
 '{"background": {"enabled": true, "start": "hsl(195 100% 95%)", "end": "hsl(195 100% 85%)", "angle": 135}, "card": {"enabled": true, "start": "hsl(0 0% 100%)", "end": "hsl(195 100% 98%)", "angle": 45}, "button": {"enabled": true, "start": "hsl(203 88% 53%)", "end": "hsl(195 100% 50%)", "angle": 135}}',
 '{"heading": "Inter", "body": "Inter", "display": "Poppins"}',
 '{"borderRadius": 12, "cardStyle": "elevated", "spacing": "normal", "shadowIntensity": 0.2}'),

('preset-sunset', 'Sunset', false,
 '{"primary": "hsl(25 95% 53%)", "primaryForeground": "hsl(0 0% 100%)", "secondary": "hsl(330 81% 60%)", "secondaryForeground": "hsl(0 0% 100%)", "accent": "hsl(25 95% 90%)", "accentForeground": "hsl(25 95% 53%)", "background": "hsl(0 0% 100%)", "foreground": "hsl(210 25% 7.8431%)", "card": "hsl(0 0% 100%)", "cardForeground": "hsl(210 25% 7.8431%)", "muted": "hsl(25 95% 95%)", "mutedForeground": "hsl(25 95% 53%)", "border": "hsl(25 95% 85%)", "input": "hsl(25 95% 97%)", "ring": "hsl(25 95% 53%)"}',
 '{"background": {"enabled": true, "start": "hsl(25 95% 95%)", "end": "hsl(330 81% 90%)", "angle": 135}, "card": {"enabled": true, "start": "hsl(0 0% 100%)", "end": "hsl(25 95% 98%)", "angle": 45}, "button": {"enabled": true, "start": "hsl(25 95% 53%)", "end": "hsl(330 81% 60%)", "angle": 135}}',
 '{"heading": "Inter", "body": "Inter", "display": "Poppins"}',
 '{"borderRadius": 20, "cardStyle": "elevated", "spacing": "spacious", "shadowIntensity": 0.25}'),

('preset-forest', 'Forest', false,
 '{"primary": "hsl(142 76% 36%)", "primaryForeground": "hsl(0 0% 100%)", "secondary": "hsl(120 100% 25%)", "secondaryForeground": "hsl(0 0% 100%)", "accent": "hsl(142 76% 90%)", "accentForeground": "hsl(142 76% 36%)", "background": "hsl(0 0% 100%)", "foreground": "hsl(210 25% 7.8431%)", "card": "hsl(0 0% 100%)", "cardForeground": "hsl(210 25% 7.8431%)", "muted": "hsl(142 76% 95%)", "mutedForeground": "hsl(142 76% 36%)", "border": "hsl(142 76% 85%)", "input": "hsl(142 76% 97%)", "ring": "hsl(142 76% 36%)"}',
 '{"background": {"enabled": true, "start": "hsl(142 76% 95%)", "end": "hsl(120 100% 90%)", "angle": 135}, "card": {"enabled": true, "start": "hsl(0 0% 100%)", "end": "hsl(142 76% 98%)", "angle": 45}, "button": {"enabled": true, "start": "hsl(142 76% 36%)", "end": "hsl(120 100% 25%)", "angle": 135}}',
 '{"heading": "Inter", "body": "Inter", "display": "Poppins"}',
 '{"borderRadius": 16, "cardStyle": "elevated", "spacing": "normal", "shadowIntensity": 0.18}'),

('preset-midnight', 'Midnight', false,
 '{"primary": "hsl(258 89% 66%)", "primaryForeground": "hsl(0 0% 100%)", "secondary": "hsl(240 100% 20%)", "secondaryForeground": "hsl(0 0% 100%)", "accent": "hsl(240 100% 10%)", "accentForeground": "hsl(258 89% 66%)", "background": "hsl(0 0% 0%)", "foreground": "hsl(200 6.6667% 91.1765%)", "card": "hsl(228 9.8039% 10%)", "cardForeground": "hsl(0 0% 85.0980%)", "muted": "hsl(0 0% 9.4118%)", "mutedForeground": "hsl(210 3.3898% 46.2745%)", "border": "hsl(210 5.2632% 14.9020%)", "input": "hsl(207.6923 27.6596% 18.4314%)", "ring": "hsl(258 89% 66%)"}',
 '{"background": {"enabled": true, "start": "hsl(0 0% 0%)", "end": "hsl(240 100% 5%)", "angle": 135}, "card": {"enabled": true, "start": "hsl(228 9.8039% 10%)", "end": "hsl(240 100% 8%)", "angle": 45}, "button": {"enabled": true, "start": "hsl(258 89% 66%)", "end": "hsl(240 100% 20%)", "angle": 135}}',
 '{"heading": "Inter", "body": "Inter", "display": "Poppins"}',
 '{"borderRadius": 12, "cardStyle": "elevated", "spacing": "normal", "shadowIntensity": 0.3}'),

('preset-minimalist', 'Minimalist', false,
 '{"primary": "hsl(0 0% 0%)", "primaryForeground": "hsl(0 0% 100%)", "secondary": "hsl(0 0% 20%)", "secondaryForeground": "hsl(0 0% 100%)", "accent": "hsl(0 0% 95%)", "accentForeground": "hsl(0 0% 0%)", "background": "hsl(0 0% 100%)", "foreground": "hsl(0 0% 0%)", "card": "hsl(0 0% 100%)", "cardForeground": "hsl(0 0% 0%)", "muted": "hsl(0 0% 95%)", "mutedForeground": "hsl(0 0% 40%)", "border": "hsl(0 0% 90%)", "input": "hsl(0 0% 98%)", "ring": "hsl(0 0% 0%)"}',
 '{"background": {"enabled": false, "start": "hsl(0 0% 100%)", "end": "hsl(0 0% 100%)", "angle": 0}, "card": {"enabled": false, "start": "hsl(0 0% 100%)", "end": "hsl(0 0% 100%)", "angle": 0}, "button": {"enabled": false, "start": "hsl(0 0% 0%)", "end": "hsl(0 0% 0%)", "angle": 0}}',
 '{"heading": "Inter", "body": "Inter", "display": "Inter"}',
 '{"borderRadius": 8, "cardStyle": "outlined", "spacing": "compact", "shadowIntensity": 0}'),

('preset-retro', 'Retro', false,
 '{"primary": "hsl(45 100% 50%)", "primaryForeground": "hsl(0 0% 0%)", "secondary": "hsl(0 100% 50%)", "secondaryForeground": "hsl(0 0% 100%)", "accent": "hsl(45 100% 90%)", "accentForeground": "hsl(0 0% 0%)", "background": "hsl(45 100% 95%)", "foreground": "hsl(0 0% 0%)", "card": "hsl(0 0% 100%)", "cardForeground": "hsl(0 0% 0%)", "muted": "hsl(45 100% 90%)", "mutedForeground": "hsl(0 0% 40%)", "border": "hsl(45 100% 80%)", "input": "hsl(45 100% 98%)", "ring": "hsl(45 100% 50%)"}',
 '{"background": {"enabled": true, "start": "hsl(45 100% 95%)", "end": "hsl(0 100% 90%)", "angle": 135}, "card": {"enabled": true, "start": "hsl(0 0% 100%)", "end": "hsl(45 100% 98%)", "angle": 45}, "button": {"enabled": true, "start": "hsl(45 100% 50%)", "end": "hsl(0 100% 50%)", "angle": 135}}',
 '{"heading": "Inter", "body": "Inter", "display": "Poppins"}',
 '{"borderRadius": 24, "cardStyle": "elevated", "spacing": "spacious", "shadowIntensity": 0.2}'),

('preset-neon', 'Neon', false,
 '{"primary": "hsl(300 100% 50%)", "primaryForeground": "hsl(0 0% 0%)", "secondary": "hsl(120 100% 50%)", "secondaryForeground": "hsl(0 0% 0%)", "accent": "hsl(300 100% 90%)", "accentForeground": "hsl(0 0% 0%)", "background": "hsl(0 0% 0%)", "foreground": "hsl(300 100% 100%)", "card": "hsl(0 0% 5%)", "cardForeground": "hsl(300 100% 100%)", "muted": "hsl(0 0% 10%)", "mutedForeground": "hsl(300 100% 70%)", "border": "hsl(300 100% 20%)", "input": "hsl(0 0% 8%)", "ring": "hsl(300 100% 50%)"}',
 '{"background": {"enabled": true, "start": "hsl(0 0% 0%)", "end": "hsl(300 100% 5%)", "angle": 135}, "card": {"enabled": true, "start": "hsl(0 0% 5%)", "end": "hsl(300 100% 8%)", "angle": 45}, "button": {"enabled": true, "start": "hsl(300 100% 50%)", "end": "hsl(120 100% 50%)", "angle": 135}}',
 '{"heading": "Inter", "body": "Inter", "display": "Poppins"}',
 '{"borderRadius": 16, "cardStyle": "elevated", "spacing": "normal", "shadowIntensity": 0.4}');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_themes_updated_at 
    BEFORE UPDATE ON themes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
