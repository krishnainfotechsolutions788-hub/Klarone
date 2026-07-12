-- Add new values to order_status ENUM
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'pending_verification';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'inventory_allocated';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'packing';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'ready_for_dispatch';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'shipped';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'delivered';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'completed';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'refunded';

-- 1. Order Assignments Table
CREATE TABLE public.order_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (order_id) -- Only one active assignee per order for now, can be updated
);

-- 2. Order Notes Table
CREATE TABLE public.order_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Order Audit Logs
CREATE TABLE public.order_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Can be null for system actions
    action TEXT NOT NULL,
    previous_state order_status,
    new_state order_status,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Order Timeline Events (Customer Facing)
CREATE TABLE public.order_timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    is_customer_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Inventory Allocations
CREATE TABLE public.inventory_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
    product_variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    serial_number TEXT,
    allocated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    allocated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.order_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_allocations ENABLE ROW LEVEL SECURITY;

-- Admin RLS Policies for new tables
CREATE POLICY "Admins can manage order_assignments" ON public.order_assignments
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.profile_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    ));

CREATE POLICY "Admins can manage order_notes" ON public.order_notes
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.profile_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    ));

CREATE POLICY "Admins can manage order_audit_logs" ON public.order_audit_logs
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.profile_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    ));

CREATE POLICY "Admins can manage order_timeline_events" ON public.order_timeline_events
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.profile_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    ));

CREATE POLICY "Admins can manage inventory_allocations" ON public.inventory_allocations
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.profile_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    ));
