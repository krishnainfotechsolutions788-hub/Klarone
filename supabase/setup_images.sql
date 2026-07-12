-- 1. Create the product_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES public.product_models(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES public.inventory_units(id) ON DELETE CASCADE,
    
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    
    metadata JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    CONSTRAINT image_target_check CHECK (
        (model_id IS NOT NULL)::integer + 
        (variant_id IS NOT NULL)::integer + 
        (unit_id IS NOT NULL)::integer = 1
    )
);

-- 2. Enable RLS and setup policies
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to perform all on product_images" 
ON public.product_images FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow anonymous read access on product_images" 
ON public.product_images FOR SELECT TO anon USING (status = 'active');

-- 3. Seed images for existing products
DO $$
DECLARE
    model RECORD;
BEGIN
    FOR model IN SELECT id, name FROM public.product_models LOOP
        -- Only insert if images don't already exist for this model to prevent duplicates
        IF NOT EXISTS (SELECT 1 FROM public.product_images WHERE model_id = model.id) THEN
            -- Insert Primary Image (Front View)
            INSERT INTO public.product_images (model_id, image_url, is_primary, display_order, alt_text)
            VALUES (
                model.id, 
                'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop', 
                true, 
                1, 
                model.name || ' Front View'
            );
            
            -- Insert Secondary Image (Side View)
            INSERT INTO public.product_images (model_id, image_url, is_primary, display_order, alt_text)
            VALUES (
                model.id, 
                'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964&auto=format&fit=crop', 
                false, 
                2, 
                model.name || ' Side View'
            );

            -- Insert Tertiary Image (Top View)
            INSERT INTO public.product_images (model_id, image_url, is_primary, display_order, alt_text)
            VALUES (
                model.id, 
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop', 
                false, 
                3, 
                model.name || ' Top View'
            );
        END IF;
    END LOOP;
END $$;
