-- Migration: Product Module Schema Architecture Revision V2
-- This updates the schema to match the finalized Klarone product architecture.

-- 1. Update product_models
-- The Product Model represents only the base product. It must no longer store hardware specifications.
ALTER TABLE public.product_models 
  DROP COLUMN IF EXISTS specifications,
  ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;

-- 2. Update product_variants
-- The Variant represents the actual sellable configuration.
ALTER TABLE public.product_variants 
  RENAME COLUMN dynamic_attributes TO specifications;

ALTER TABLE public.product_variants 
  RENAME COLUMN price TO selling_price;

ALTER TABLE public.product_variants 
  RENAME COLUMN cost TO cost_price;

ALTER TABLE public.product_variants 
  DROP COLUMN IF EXISTS rental_price,
  DROP COLUMN IF EXISTS color,
  DROP COLUMN IF EXISTS condition;

-- 3. Update inventory_units
-- Every inventory record must belong to exactly one Product Variant.
-- Clean up any orphaned inventory units that were tied only to models
DELETE FROM public.inventory_units WHERE variant_id IS NULL;

-- Remove old constraint and column
ALTER TABLE public.inventory_units DROP CONSTRAINT IF EXISTS check_model_or_variant;
ALTER TABLE public.inventory_units DROP COLUMN IF EXISTS model_id;

-- Make variant_id strictly required
ALTER TABLE public.inventory_units ALTER COLUMN variant_id SET NOT NULL;

-- Rename and add columns
ALTER TABLE public.inventory_units RENAME COLUMN condition TO condition_grade;

ALTER TABLE public.inventory_units 
  ADD COLUMN IF NOT EXISTS asset_code TEXT,
  ADD COLUMN IF NOT EXISTS selling_price_override DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS supplier_id UUID,
  ADD COLUMN IF NOT EXISTS warehouse_id UUID,
  ADD COLUMN IF NOT EXISTS rack_location TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS rental_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('available', 'rented', 'sold', 'repair', 'lost')) DEFAULT 'available';

-- Notify Supabase PostgREST schema cache to reload
NOTIFY pgrst, 'reload schema';
