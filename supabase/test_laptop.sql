-- Delete existing test laptop if it exists
DELETE FROM public.product_models WHERE code = 'TEST-LAP-001';

DO $$ 
DECLARE
    group_comp UUID;
    cat_lap UUID;
    brand_lenovo UUID;
    model_id UUID := gen_random_uuid();
    var1_id UUID := gen_random_uuid();
    var2_id UUID := gen_random_uuid();
BEGIN
    -- Get IDs
    SELECT id INTO group_comp FROM public.category_groups WHERE name = 'Computers' LIMIT 1;
    SELECT id INTO cat_lap FROM public.categories WHERE name = 'Laptop' LIMIT 1;
    SELECT id INTO brand_lenovo FROM public.brands WHERE name = 'Lenovo' LIMIT 1;

    IF group_comp IS NULL OR cat_lap IS NULL OR brand_lenovo IS NULL THEN
        RAISE EXCEPTION 'Prerequisite categories or brands not found. Run the main seed first.';
    END IF;

    -- Insert Model
    INSERT INTO public.product_models (id, category_id, brand_id, name, code, description, short_description, status, highlights)
    VALUES (model_id, cat_lap, brand_lenovo, 'Lenovo ThinkPad Test', 'TEST-LAP-001', 'Test Description', 'Test Short', 'active', '[]'::jsonb);

    -- Insert Variants
    INSERT INTO public.product_variants (id, model_id, sku, specifications, selling_price, cost_price, status)
    VALUES 
    (var1_id, model_id, 'TEST-SKU-1', '{"Color": "Black", "RAM": "16GB"}'::jsonb, 1200, 1000, 'active'),
    (var2_id, model_id, 'TEST-SKU-2', '{"Color": "Silver", "RAM": "32GB"}'::jsonb, 1500, 1300, 'active');

    -- Insert Inventory Units
    INSERT INTO public.inventory_units (variant_id, inventory_mode, quantity, serial_number, condition_grade, purchase_price, selling_price_override)
    VALUES 
    (var1_id, 'serialized', 1, 'TEST-SN-001', 'new', 1000, 1200),
    (var1_id, 'serialized', 1, 'TEST-SN-002', 'new', 1000, 1200),
    (var2_id, 'serialized', 1, 'TEST-SN-003', 'new', 1300, 1500);

END $$;
