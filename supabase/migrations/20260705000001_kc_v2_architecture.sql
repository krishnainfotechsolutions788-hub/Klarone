-- Migration: Knowledge Catalog V2 Architecture

-- We will rename the old table to avoid data loss during the transition,
-- but the new system will exclusively use the V2 tables.
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kc_laptops') THEN
    ALTER TABLE public.kc_laptops RENAME TO kc_laptops_legacy;
  END IF;
END $$;

-- 1. Master Product Catalog
CREATE TABLE public.kc_master_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.kc_brands(id),
    series VARCHAR(255),
    model VARCHAR(255) NOT NULL,
    manufacturer_product_code VARCHAR(255),
    gtin VARCHAR(255),
    icecat_id VARCHAR(255),
    official_images JSONB DEFAULT '[]'::jsonb,
    official_specifications JSONB DEFAULT '{}'::jsonb,
    official_descriptions TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    warranty_info TEXT,
    release_date DATE,
    msrp DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Reviewed, Approved, Published
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_kc_master_brand ON public.kc_master_products(brand_id);
CREATE INDEX idx_kc_master_icecat ON public.kc_master_products(icecat_id);

-- 2. Knowledge Variants
CREATE TABLE public.kc_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    master_product_id UUID REFERENCES public.kc_master_products(id) ON DELETE CASCADE,
    cpu VARCHAR(255),
    gpu VARCHAR(255),
    ram VARCHAR(255),
    storage VARCHAR(255),
    display VARCHAR(255),
    refresh_rate VARCHAR(50),
    keyboard VARCHAR(255),
    color VARCHAR(100),
    os VARCHAR(100),
    battery VARCHAR(100),
    weight DECIMAL(5, 2),
    variant_images JSONB DEFAULT '[]'::jsonb,
    variant_specifications JSONB DEFAULT '{}'::jsonb,
    msrp DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_kc_variants_master ON public.kc_variants(master_product_id);

-- 3. Knowledge Intelligence
CREATE TABLE public.kc_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID REFERENCES public.kc_variants(id) ON DELETE CASCADE,
    
    -- Scores
    student_score INTEGER,
    gaming_score INTEGER,
    programming_score INTEGER,
    business_score INTEGER,
    creator_score INTEGER,
    value_score INTEGER,
    battery_rating INTEGER,
    repairability_score INTEGER,
    upgradeability_score INTEGER,
    thermal_rating INTEGER,
    portability_score INTEGER,
    
    -- Qualitative Data
    pros JSONB DEFAULT '[]'::jsonb,
    cons JSONB DEFAULT '[]'::jsonb,
    ai_summary TEXT,
    expert_notes TEXT,
    buying_guide TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_kc_intelligence_variant ON public.kc_intelligence(variant_id);

-- 4. Update Inventory Module
-- Inventory (product_models) should now link to the variant, not the master product.
-- Since product_models is the "Inventory" layer that owns pricing and stock, 
-- we will add a column linking it to the Knowledge Catalog variant.
ALTER TABLE public.product_models
ADD COLUMN knowledge_variant_id UUID REFERENCES public.kc_variants(id);

CREATE INDEX idx_product_models_kc_variant ON public.product_models(knowledge_variant_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()   
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER update_kc_master_products_modtime BEFORE UPDATE ON public.kc_master_products FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_kc_variants_modtime BEFORE UPDATE ON public.kc_variants FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_kc_intelligence_modtime BEFORE UPDATE ON public.kc_intelligence FOR EACH ROW EXECUTE FUNCTION update_modified_column();
