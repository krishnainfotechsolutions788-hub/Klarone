-- Populate specifications for product_models
UPDATE public.product_models
SET specifications = jsonb_build_object(
    'Screen Size', '16 Inches',
    'Colour', 'Space Gray',
    'Hard Disk Size', '512 GB SSD',
    'Operating System', 'Windows 11 Home',
    'Special Feature', '45% NTSC color gamut, Anti-glare(AG) display',
    'Graphics Card', 'Integrated'
)
WHERE specifications IS NULL OR specifications::text = '{}'::text;

-- Update dynamic_attributes for variants if they are empty
UPDATE public.product_variants
SET dynamic_attributes = jsonb_build_object(
    'CPU Model', 'Intel Core Ultra 5',
    'RAM Memory Installed Size', '16 GB'
)
WHERE dynamic_attributes IS NULL OR dynamic_attributes::text = '{}'::text;
