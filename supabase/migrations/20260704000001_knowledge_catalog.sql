-- Migration: Knowledge Catalog Schema

-- We use the 'kc_' prefix to denote tables belonging to the Knowledge Catalog domain,
-- ensuring clear separation from the inventory domain (e.g., product_models).

CREATE TABLE public.kc_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.kc_laptops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.kc_brands(id),
    series TEXT,
    model TEXT NOT NULL,
    release_year INTEGER,
    cpu TEXT,
    gpu TEXT,
    ram TEXT,
    storage TEXT,
    display TEXT,
    battery TEXT,
    weight DECIMAL(5,2), -- in kg
    ports JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    official_specifications JSONB DEFAULT '{}'::jsonb,
    msrp DECIMAL(10,2),
    
    -- Calculated Scores (updated by triggers or edge functions/app logic)
    programming_score INTEGER DEFAULT 0,
    gaming_score INTEGER DEFAULT 0,
    student_score INTEGER DEFAULT 0,
    business_score INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.kc_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kc_laptops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on kc_brands" ON public.kc_brands FOR SELECT USING (true);
CREATE POLICY "Allow public read access on kc_laptops" ON public.kc_laptops FOR SELECT USING (true);

-- Admin policies (assuming auth allows all for now, per existing patterns)
CREATE POLICY "Allow authenticated full access on kc_brands" ON public.kc_brands FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on kc_laptops" ON public.kc_laptops FOR ALL TO authenticated USING (true);
