-- PIM Architecture Additional Templates Seeder

DO $$
DECLARE
    -- Templates
    template_monitor_id UUID;
    template_storage_id UUID;
    template_ram_id UUID;
    template_cctv_id UUID;
    
    -- Groups
    group_monitor_display_id UUID;
    group_storage_config_id UUID;
    group_ram_config_id UUID;
    group_cctv_camera_id UUID;
    
    -- Monitor Attributes
    attr_screen_size_id UUID;
    attr_resolution_id UUID;
    attr_panel_type_id UUID;
    attr_refresh_rate_id UUID;
    
    -- Storage Attributes
    attr_capacity_id UUID;
    attr_form_factor_id UUID;
    attr_pcie_gen_id UUID;
    
    -- RAM Attributes
    attr_ram_cap_id UUID;
    attr_ram_type_id UUID;
    attr_ram_speed_id UUID;
    
    -- CCTV Attributes
    attr_camera_type_id UUID;
    attr_cctv_res_id UUID;
    attr_night_vision_id UUID;
    attr_connectivity_id UUID;
    
BEGIN
    -- ==========================================
    -- 1. MONITOR TEMPLATE
    -- ==========================================
    INSERT INTO public.specification_templates (name, description) VALUES ('Monitor Specifications', 'Standard template for monitors') RETURNING id INTO template_monitor_id;
    INSERT INTO public.attribute_groups (template_id, name, display_order) VALUES (template_monitor_id, 'Display', 10) RETURNING id INTO group_monitor_display_id;
    
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Monitor Screen Size', 'monitor_screen_size', 'Screen size diagonally', 'Dropdown', 'Inch') RETURNING id INTO attr_screen_size_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Resolution', 'resolution', 'Display Resolution', 'Dropdown', NULL) RETURNING id INTO attr_resolution_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Panel Type', 'panel_type', 'Display Panel Technology', 'Dropdown', NULL) RETURNING id INTO attr_panel_type_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Refresh Rate', 'refresh_rate', 'Display Refresh Rate', 'Dropdown', 'Hz') RETURNING id INTO attr_refresh_rate_id;
    
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_monitor_id, attr_screen_size_id, group_monitor_display_id, 10, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_monitor_id, attr_resolution_id, group_monitor_display_id, 20, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_monitor_id, attr_panel_type_id, group_monitor_display_id, 30, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_monitor_id, attr_refresh_rate_id, group_monitor_display_id, 40, true);
    
    INSERT INTO public.attribute_options (attribute_id, label, value, display_order) VALUES
        (attr_screen_size_id, '24"', '24', 10), (attr_screen_size_id, '27"', '27', 20), (attr_screen_size_id, '32"', '32', 30), (attr_screen_size_id, '34" Ultrawide', '34-uw', 40),
        (attr_resolution_id, '1080p FHD', '1080p', 10), (attr_resolution_id, '1440p QHD', '1440p', 20), (attr_resolution_id, '4K UHD', '4k', 30),
        (attr_panel_type_id, 'IPS', 'ips', 10), (attr_panel_type_id, 'VA', 'va', 20), (attr_panel_type_id, 'TN', 'tn', 30), (attr_panel_type_id, 'OLED', 'oled', 40),
        (attr_refresh_rate_id, '60Hz', '60', 10), (attr_refresh_rate_id, '75Hz', '75', 20), (attr_refresh_rate_id, '144Hz', '144', 30), (attr_refresh_rate_id, '240Hz', '240', 40);

    -- ==========================================
    -- 2. STORAGE (SSD/HDD) TEMPLATE
    -- ==========================================
    INSERT INTO public.specification_templates (name, description) VALUES ('Storage Specifications', 'Standard template for SSDs and HDDs') RETURNING id INTO template_storage_id;
    INSERT INTO public.attribute_groups (template_id, name, display_order) VALUES (template_storage_id, 'Storage Configuration', 10) RETURNING id INTO group_storage_config_id;
    
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Storage Capacity', 'storage_capacity', 'Total drive capacity', 'Dropdown', 'GB/TB') RETURNING id INTO attr_capacity_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Form Factor', 'form_factor', 'Physical drive shape/size', 'Dropdown', NULL) RETURNING id INTO attr_form_factor_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('PCIe Generation', 'pcie_gen', 'PCIe Interface Generation', 'Dropdown', NULL) RETURNING id INTO attr_pcie_gen_id;
    
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_storage_id, attr_capacity_id, group_storage_config_id, 10, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_storage_id, attr_form_factor_id, group_storage_config_id, 20, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_storage_id, attr_pcie_gen_id, group_storage_config_id, 30, false);
    
    INSERT INTO public.attribute_options (attribute_id, label, value, display_order) VALUES
        (attr_capacity_id, '256GB', '256gb', 10), (attr_capacity_id, '512GB', '512gb', 20), (attr_capacity_id, '1TB', '1tb', 30), (attr_capacity_id, '2TB', '2tb', 40), (attr_capacity_id, '4TB', '4tb', 50),
        (attr_form_factor_id, 'M.2 NVMe', 'm2-nvme', 10), (attr_form_factor_id, '2.5" SATA', '2.5-sata', 20), (attr_form_factor_id, '3.5" SATA', '3.5-sata', 30),
        (attr_pcie_gen_id, 'Gen 3', 'gen3', 10), (attr_pcie_gen_id, 'Gen 4', 'gen4', 20), (attr_pcie_gen_id, 'Gen 5', 'gen5', 30);

    -- ==========================================
    -- 3. RAM TEMPLATE
    -- ==========================================
    INSERT INTO public.specification_templates (name, description) VALUES ('RAM Specifications', 'Standard template for Memory') RETURNING id INTO template_ram_id;
    INSERT INTO public.attribute_groups (template_id, name, display_order) VALUES (template_ram_id, 'Memory Configuration', 10) RETURNING id INTO group_ram_config_id;
    
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Memory Capacity', 'memory_capacity', 'Total memory capacity', 'Dropdown', 'GB') RETURNING id INTO attr_ram_cap_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Memory Type', 'memory_type', 'DDR Generation', 'Dropdown', NULL) RETURNING id INTO attr_ram_type_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Memory Speed', 'memory_speed', 'Operating Frequency', 'Dropdown', 'MHz') RETURNING id INTO attr_ram_speed_id;
    
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_ram_id, attr_ram_cap_id, group_ram_config_id, 10, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_ram_id, attr_ram_type_id, group_ram_config_id, 20, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_ram_id, attr_ram_speed_id, group_ram_config_id, 30, true);
    
    INSERT INTO public.attribute_options (attribute_id, label, value, display_order) VALUES
        (attr_ram_cap_id, '8GB', '8gb', 10), (attr_ram_cap_id, '16GB', '16gb', 20), (attr_ram_cap_id, '32GB', '32gb', 30), (attr_ram_cap_id, '64GB', '64gb', 40),
        (attr_ram_type_id, 'DDR4', 'ddr4', 10), (attr_ram_type_id, 'DDR5', 'ddr5', 20), (attr_ram_type_id, 'DDR3', 'ddr3', 30),
        (attr_ram_speed_id, '2666MHz', '2666', 10), (attr_ram_speed_id, '3200MHz', '3200', 20), (attr_ram_speed_id, '4800MHz', '4800', 30), (attr_ram_speed_id, '6000MHz', '6000', 40);

    -- ==========================================
    -- 4. CCTV TEMPLATE
    -- ==========================================
    INSERT INTO public.specification_templates (name, description) VALUES ('CCTV Camera Specifications', 'Standard template for Security Cameras') RETURNING id INTO template_cctv_id;
    INSERT INTO public.attribute_groups (template_id, name, display_order) VALUES (template_cctv_id, 'Camera & Security', 10) RETURNING id INTO group_cctv_camera_id;
    
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Camera Type', 'camera_type', 'Physical shape/style of camera', 'Dropdown', NULL) RETURNING id INTO attr_camera_type_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Camera Resolution', 'camera_resolution', 'Megapixel/Video Resolution', 'Dropdown', 'MP') RETURNING id INTO attr_cctv_res_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Night Vision Support', 'night_vision_support', 'Has Infrared/Night Vision', 'Boolean', NULL) RETURNING id INTO attr_night_vision_id;
    INSERT INTO public.attributes (name, slug, description, data_type, unit) VALUES ('Connectivity', 'connectivity', 'Connection type', 'Dropdown', NULL) RETURNING id INTO attr_connectivity_id;
    
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_cctv_id, attr_camera_type_id, group_cctv_camera_id, 10, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_cctv_id, attr_cctv_res_id, group_cctv_camera_id, 20, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_cctv_id, attr_night_vision_id, group_cctv_camera_id, 30, true);
    INSERT INTO public.template_attributes (template_id, attribute_id, group_id, display_order, is_required) VALUES (template_cctv_id, attr_connectivity_id, group_cctv_camera_id, 40, true);
    
    INSERT INTO public.attribute_options (attribute_id, label, value, display_order) VALUES
        (attr_camera_type_id, 'Dome', 'dome', 10), (attr_camera_type_id, 'Bullet', 'bullet', 20), (attr_camera_type_id, 'PTZ', 'ptz', 30), (attr_camera_type_id, 'Box', 'box', 40),
        (attr_cctv_res_id, '2MP (1080p)', '2mp', 10), (attr_cctv_res_id, '4MP (1440p)', '4mp', 20), (attr_cctv_res_id, '5MP', '5mp', 30), (attr_cctv_res_id, '8MP (4K)', '8mp', 40),
        (attr_connectivity_id, 'Wired POE', 'wired-poe', 10), (attr_connectivity_id, 'Wireless Wi-Fi', 'wireless-wifi', 20), (attr_connectivity_id, 'Analog BNC', 'analog-bnc', 30);


    -- ==========================================
    -- 5. CATEGORY MAPPING
    -- ==========================================
    -- This section dynamically maps the templates to the matching categories in the DB based on the slug/name
    
    -- Laptops / Desktops -> We use the "Laptop Specifications" template which was created in seed_pim.sql
    -- To ensure we grab its ID properly dynamically:
    UPDATE public.categories 
    SET template_id = (SELECT id FROM public.specification_templates WHERE name = 'Laptop Specifications' LIMIT 1)
    WHERE slug IN ('laptop-desktop', 'laptops', 'desktops');
    
    -- Monitors -> Monitor Specifications
    UPDATE public.categories 
    SET template_id = template_monitor_id
    WHERE slug IN ('monitors', 'monitor', 'display');
    
    -- SSDs / HDDs -> Storage Specifications
    UPDATE public.categories 
    SET template_id = template_storage_id
    WHERE slug IN ('ssds', 'ssd', 'hdd', 'storage');
    
    -- RAM -> RAM Specifications
    UPDATE public.categories 
    SET template_id = template_ram_id
    WHERE slug IN ('ram', 'memory');
    
    -- CCTV -> CCTV Specifications
    UPDATE public.categories 
    SET template_id = template_cctv_id
    WHERE slug IN ('cctv', 'cctv-cameras', 'security-cameras', 'cameras');
    
END $$;
