-- Migration: Product Module Schema
-- Based on Product.md design

-- 1. Category Groups
CREATE TABLE public.category_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.category_groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    variant_support BOOLEAN DEFAULT false,
    inventory_mode TEXT CHECK (inventory_mode IN ('serialized', 'quantity')) NOT NULL,
    specification_template JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(group_id, name)
);

-- 3. Brands
CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Series (Optional, linked to Brand)
CREATE TABLE public.series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(brand_id, name)
);

-- 5. Product Models
CREATE TABLE public.product_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id),
    brand_id UUID NOT NULL REFERENCES public.brands(id),
    series_id UUID REFERENCES public.series(id),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    status TEXT CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
    specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Product Variants
CREATE TABLE public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID NOT NULL REFERENCES public.product_models(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    dynamic_attributes JSONB DEFAULT '{}'::jsonb,
    price DECIMAL(10,2),
    cost DECIMAL(10,2),
    rental_price DECIMAL(10,2),
    images JSONB DEFAULT '[]'::jsonb,
    status TEXT CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Inventory Units
CREATE TABLE public.inventory_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    model_id UUID REFERENCES public.product_models(id) ON DELETE CASCADE, -- Fallback for models without variants
    inventory_mode TEXT CHECK (inventory_mode IN ('serialized', 'quantity')) NOT NULL,
    serial_number TEXT,
    quantity INTEGER DEFAULT 0,
    condition TEXT DEFAULT 'new',
    battery_health INTEGER,
    purchase_price DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    supplier TEXT,
    warehouse TEXT,
    rack TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_model_or_variant CHECK (variant_id IS NOT NULL OR model_id IS NOT NULL)
);

-- Row Level Security (RLS)

ALTER TABLE public.category_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_units ENABLE ROW LEVEL SECURITY;

-- Basic admin policies for now
CREATE POLICY "Allow authenticated users to perform all on category_groups" ON public.category_groups FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to perform all on categories" ON public.categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to perform all on brands" ON public.brands FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to perform all on series" ON public.series FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to perform all on product_models" ON public.product_models FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to perform all on product_variants" ON public.product_variants FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to perform all on inventory_units" ON public.inventory_units FOR ALL TO authenticated USING (true);
