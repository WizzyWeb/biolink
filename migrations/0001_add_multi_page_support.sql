-- Migration: Add multi-page support to profiles table
-- This migration adds support for multiple bio pages per user

-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN page_name TEXT NOT NULL DEFAULT 'main',
ADD COLUMN is_default BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Create indexes for better performance
CREATE INDEX "IDX_user_page_name" ON profiles (user_id, page_name);
CREATE INDEX "IDX_page_name_unique" ON profiles (page_name);

-- Update existing profiles to have unique page names
-- First, set all existing profiles to have page_name = username for backward compatibility
UPDATE profiles SET page_name = username;

-- Set the first profile for each user as default
WITH user_first_profiles AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as rn
  FROM profiles
)
UPDATE profiles 
SET is_default = true 
WHERE id IN (
  SELECT id FROM user_first_profiles WHERE rn = 1
);

-- Add unique constraint on page_name globally (for public URLs)
ALTER TABLE profiles ADD CONSTRAINT "profiles_page_name_unique" UNIQUE (page_name);

-- Add unique constraint on user_id + page_name combination
ALTER TABLE profiles ADD CONSTRAINT "profiles_user_page_name_unique" UNIQUE (user_id, page_name);

-- Remove the old username unique constraint since we're now using page_name
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS "profiles_username_unique";
