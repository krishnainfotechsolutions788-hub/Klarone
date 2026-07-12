-- Migration: Inventory Resolution Engine Link

-- Add a column to link the Knowledge Catalog laptop to actual Klarone Inventory (product_models)
ALTER TABLE public.kc_laptops
ADD COLUMN inventory_model_id UUID REFERENCES public.product_models(id);

-- Optional: Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_kc_laptops_inventory_model_id ON public.kc_laptops(inventory_model_id);
