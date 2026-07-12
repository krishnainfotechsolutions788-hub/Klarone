-- Migration: Move rental_price to inventory_units

-- 1. Remove rental_price, color, and condition from variants
ALTER TABLE public.product_variants 
  DROP COLUMN IF EXISTS rental_price,
  DROP COLUMN IF EXISTS color,
  DROP COLUMN IF EXISTS condition;

-- 2. Add rental_price to inventory_units
ALTER TABLE public.inventory_units 
  ADD COLUMN IF NOT EXISTS rental_price DECIMAL(10,2);

-- Notify Supabase PostgREST schema cache to reload
NOTIFY pgrst, 'reload schema';
