-- Migration: Unified Image Management System (Architecture Revision V1)

-- 1. Create product_images table
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES public.product_models(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    inventory_unit_id UUID REFERENCES public.inventory_units(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text TEXT,
    image_type TEXT DEFAULT 'Gallery',
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Constraint: Exactly one relationship must exist
    CONSTRAINT enforce_single_entity_ownership CHECK (
        ( (model_id IS NOT NULL)::integer + 
          (variant_id IS NOT NULL)::integer + 
          (inventory_unit_id IS NOT NULL)::integer ) = 1
    )
);

-- 2. Add Row Level Security (RLS)
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users on product_images"
    ON public.product_images FOR SELECT
    USING (true);

CREATE POLICY "Enable all operations for authenticated admin users on product_images"
    ON public.product_images FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. Drop legacy JSONB columns
ALTER TABLE public.product_models DROP COLUMN IF EXISTS images;
ALTER TABLE public.product_variants DROP COLUMN IF EXISTS images;
ALTER TABLE public.inventory_units DROP COLUMN IF EXISTS images;

-- Notify Supabase PostgREST schema cache to reload
NOTIFY pgrst, 'reload schema';
