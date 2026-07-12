-- Migration: Add slug and status to categories table

-- Add slug and status columns to categories
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('active', 'draft', 'archived')) DEFAULT 'active';

-- Update existing categories to have a slug based on their name if it's null
UPDATE public.categories SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;

-- Make slug NOT NULL after populating existing data
ALTER TABLE public.categories ALTER COLUMN slug SET NOT NULL;

-- Notify Supabase PostgREST schema cache to reload
NOTIFY pgrst, 'reload schema';
