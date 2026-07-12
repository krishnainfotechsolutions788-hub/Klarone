-- Migration: Inventory V2 Architecture (Strict Alignment)

-- 1. Drop constraints pointing to old tables
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_variant_id_fkey;
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_variant_id_fkey;

-- 2. Drop the old product module tables (since we deleted their data)
DROP TABLE IF EXISTS public.inventory_units CASCADE;
DROP TABLE IF EXISTS public.variant_attribute_values CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.product_models CASCADE;

-- 3. Update foreign keys on cart and orders to point to knowledge catalog
ALTER TABLE public.order_items ADD CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.kc_variants(id) ON DELETE RESTRICT;
ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.kc_variants(id) ON DELETE RESTRICT;

-- 4. Create the NEW Inventory Items table
CREATE TABLE public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES public.kc_variants(id) ON DELETE CASCADE,
    inventory_mode VARCHAR(50) DEFAULT 'serialized', -- 'serialized' or 'quantity'
    serial_number VARCHAR(255),
    quantity INTEGER DEFAULT 1,
    condition VARCHAR(50) DEFAULT 'New', -- New, Refurbished, Used
    battery_health INTEGER,
    purchase_price DECIMAL(10, 2),
    selling_price DECIMAL(10, 2),
    rental_price DECIMAL(10, 2),
    warehouse_location VARCHAR(255),
    rack_location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'In Stock', -- In Stock, Rented, Sold
    actual_images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_inventory_items_variant ON public.inventory_items(variant_id);

-- Triggers for updated_at
CREATE TRIGGER update_inventory_items_modtime BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- RLS Policies
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to perform all on inventory_items" ON public.inventory_items FOR ALL TO authenticated USING (true);
