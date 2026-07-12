-- PIM Architecture Seeder

DO $$
DECLARE
    template_laptop_id UUID;
    
    group_general_id UUID;
    group_performance_id UUID;
    group_memory_id UUID;
    group_display_id UUID;
    
    attr_brand_id UUID;
    attr_processor_id UUID;
    attr_ram_id UUID;
    attr_storage_id UUID;
    attr_display_size_id UUID;
    
BEGIN
    -- Insert Templates
    INSERT INTO public.specification_templates (name, description) VALUES ('Laptop Specifications', 'Standard template for laptops') RETURNING id INTO template_laptop_id;
    
    -- Insert Groups
    INSERT INTO public.attribute_groups (template_id, name, display_order) VALUES (template_laptop_id, 'General', 10) RETURNING id INTO group_general_id;
    INSERT INTO public.attribute_groups (template_id, name, display_order) VALUES (template_laptop_id, 'Performance', 20) RETURNING id INTO group_performance_id;
    INSERT INTO public.attribute_groups (template_id, name, display_order) VALUES (template_laptop_id, 'Memory & Storage', 30) RETURNING id INTO group_memory_id;
    INSERT INTO public.attribute_groups (template_id, name, display_order) VALUES (template_laptop_id, 'Display', 40) RETURNING id INTO group_display_id;
    
    -- Insert Attributes
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Brand', 'brand', 'Manufacturer Brand', 'Text', NULL) RETURNING id INTO attr_brand_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Processor', 'processor', 'CPU Model', 'Dropdown', NULL) RETURNING id INTO attr_processor_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('RAM', 'ram', 'Random Access Memory', 'Dropdown', 'GB') RETURNING id INTO attr_ram_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Storage', 'storage', 'Storage Capacity', 'Dropdown', 'GB/TB') RETURNING id INTO attr_storage_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Display Size', 'display_size', 'Screen size diagonally', 'Dropdown', 'Inch') RETURNING id INTO attr_display_size_id;
    
    -- Template Attributes (Linking)
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_laptop_id, attr_brand_id, group_general_id, 10, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_laptop_id, attr_processor_id, group_performance_id, 10, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_laptop_id, attr_ram_id, group_memory_id, 10, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_laptop_id, attr_storage_id, group_memory_id, 20, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_laptop_id, attr_display_size_id, group_display_id, 10, true);
    
    -- Attribute Options
    INSERT INTO public.attribute_options (attribute_id, label, value, display_order) VALUES
        (attr_processor_id, 'Intel Core i3', 'intel-core-i3', 10),
        (attr_processor_id, 'Intel Core i5', 'intel-core-i5', 20),
        (attr_processor_id, 'Intel Core i7', 'intel-core-i7', 30),
        (attr_processor_id, 'AMD Ryzen 5', 'amd-ryzen-5', 40),
        (attr_processor_id, 'AMD Ryzen 7', 'amd-ryzen-7', 50);
        
    INSERT INTO public.attribute_options (attribute_id, label, value, display_order) VALUES
        (attr_ram_id, '4GB', '4', 10),
        (attr_ram_id, '8GB', '8', 20),
        (attr_ram_id, '16GB', '16', 30),
        (attr_ram_id, '32GB', '32', 40);
        
    INSERT INTO public.attribute_options (attribute_id, label, value, display_order) VALUES
        (attr_storage_id, '256GB SSD', '256-ssd', 10),
        (attr_storage_id, '512GB SSD', '512-ssd', 20),
        (attr_storage_id, '1TB SSD', '1024-ssd', 30);
        
    INSERT INTO public.attribute_options (attribute_id, label, value, display_order) VALUES
        (attr_display_size_id, '13.3"', '13.3', 10),
        (attr_display_size_id, '14"', '14', 20),
        (attr_display_size_id, '15.6"', '15.6', 30),
        (attr_display_size_id, '16"', '16', 40);
        
    -- Note: Updating existing categories to link to the new template will require 
    -- manual mapping if there are existing categories. For a fresh install, 
    -- the application will link categories to these templates during creation.
        
END $$;
