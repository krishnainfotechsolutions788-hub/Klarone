-- Migration to add dynamic product specifications
CREATE TABLE IF NOT EXISTS public.kc_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID REFERENCES public.kc_variants(id) ON DELETE CASCADE,
    group_name VARCHAR(255),
    attribute_name VARCHAR(255),
    attribute_code VARCHAR(255),
    value TEXT,
    unit VARCHAR(100),
    type VARCHAR(50) DEFAULT 'text',
    display_order INTEGER,
    source VARCHAR(100) DEFAULT 'Icecat',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kc_specifications_variant ON public.kc_specifications(variant_id);
CREATE INDEX IF NOT EXISTS idx_kc_specifications_attribute ON public.kc_specifications(attribute_code);

-- Enable RLS
ALTER TABLE public.kc_specifications ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read for kc_specifications" 
ON public.kc_specifications 
FOR SELECT 
TO public 
USING (true);

-- Allow service role to manage
CREATE POLICY "Allow service_role full access kc_specifications" 
ON public.kc_specifications 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
