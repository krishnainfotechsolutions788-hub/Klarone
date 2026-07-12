-- Migration: Dynamic Category & Attribute System (PIM Architecture)

-- 1. specification_templates
CREATE TABLE IF NOT EXISTS public.specification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. attribute_groups
CREATE TABLE IF NOT EXISTS public.attribute_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES public.specification_templates(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. attributes
CREATE TABLE IF NOT EXISTS public.attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    data_type TEXT NOT NULL CHECK (data_type IN ('Text', 'Textarea', 'Number', 'Decimal', 'Boolean', 'Date', 'Dropdown', 'Multi Select', 'Color', 'URL', 'Image')),
    unit TEXT,
    default_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. template_attributes
CREATE TABLE IF NOT EXISTS public.template_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES public.specification_templates(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.attribute_groups(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT false,
    is_searchable BOOLEAN DEFAULT true,
    is_filterable BOOLEAN DEFAULT true,
    is_comparable BOOLEAN DEFAULT true,
    visible_on_product_page BOOLEAN DEFAULT true,
    visible_in_listing BOOLEAN DEFAULT false,
    is_editable BOOLEAN DEFAULT true,
    UNIQUE(template_id, attribute_id)
);

-- 5. attribute_options
CREATE TABLE IF NOT EXISTS public.attribute_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    UNIQUE(attribute_id, value)
);

-- 6. variant_attribute_values
CREATE TABLE IF NOT EXISTS public.variant_attribute_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
    option_id UUID REFERENCES public.attribute_options(id) ON DELETE SET NULL,
    value_text TEXT,
    value_number DECIMAL(15,4),
    value_boolean BOOLEAN,
    value_date DATE,
    UNIQUE(variant_id, attribute_id)
);

-- 7. Update existing tables
ALTER TABLE public.categories DROP COLUMN IF EXISTS specification_template;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.specification_templates(id) ON DELETE SET NULL;

ALTER TABLE public.product_variants DROP COLUMN IF EXISTS specifications;

-- Enable RLS
ALTER TABLE public.specification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variant_attribute_values ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Allow all for authenticated/anon for V1 - restrict later)
CREATE POLICY "Allow all on specification_templates" ON public.specification_templates FOR ALL USING (true);
CREATE POLICY "Allow all on attribute_groups" ON public.attribute_groups FOR ALL USING (true);
CREATE POLICY "Allow all on attributes" ON public.attributes FOR ALL USING (true);
CREATE POLICY "Allow all on template_attributes" ON public.template_attributes FOR ALL USING (true);
CREATE POLICY "Allow all on attribute_options" ON public.attribute_options FOR ALL USING (true);
CREATE POLICY "Allow all on variant_attribute_values" ON public.variant_attribute_values FOR ALL USING (true);

-- Notify PostgREST
NOTIFY pgrst, 'reload schema';
