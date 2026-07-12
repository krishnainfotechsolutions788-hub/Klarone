-- Up Migration

-- 1. Create Custom ENUM Types
CREATE TYPE cart_status AS ENUM ('active', 'converted', 'abandoned', 'expired');
CREATE TYPE address_type AS ENUM ('home', 'work', 'other');
CREATE TYPE order_address_type AS ENUM ('billing', 'shipping');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'cancelled');
CREATE TYPE order_status AS ENUM ('pending_payment', 'order_placed', 'confirmed', 'cancelled');
CREATE TYPE payment_method_type AS ENUM ('upi', 'credit_card', 'debit_card', 'net_banking', 'cod', 'wallet', 'emi');

-- 2. Shipping Methods
CREATE TABLE public.shipping_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    estimated_days INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Customer Addresses
CREATE TABLE public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    label TEXT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    landmark TEXT,
    address_type address_type DEFAULT 'home',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Shopping Carts
CREATE TABLE public.shopping_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status cart_status DEFAULT 'active',
    subtotal NUMERIC(12,2) DEFAULT 0,
    discount NUMERIC(12,2) DEFAULT 0,
    tax NUMERIC(12,2) DEFAULT 0,
    shipping_cost NUMERIC(12,2) DEFAULT 0,
    total NUMERIC(12,2) DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- Ensure only one active cart per customer
CREATE UNIQUE INDEX unique_active_cart_per_customer ON public.shopping_carts (customer_id) WHERE status = 'active';

-- 5. Cart Items
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES public.shopping_carts(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL,
    snapshot_name TEXT,
    snapshot_image TEXT,
    snapshot_specifications JSONB,
    added_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Customer Orders
CREATE TABLE public.customer_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    subtotal NUMERIC(12,2) NOT NULL,
    discount NUMERIC(12,2) DEFAULT 0,
    tax NUMERIC(12,2) DEFAULT 0,
    shipping_cost NUMERIC(12,2) DEFAULT 0,
    grand_total NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_status payment_status DEFAULT 'pending',
    order_status order_status DEFAULT 'pending_payment',
    notes TEXT,
    placed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Order Addresses (Immutable snapshot of the shipping/billing address used for the order)
CREATE TABLE public.order_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
    type order_address_type NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    landmark TEXT
);

-- 8. Order Items (Immutable products)
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    product_name TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    selected_specifications JSONB,
    primary_image TEXT
);

-- 9. Payments
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
    payment_provider TEXT NOT NULL,
    transaction_id TEXT,
    amount NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status payment_status DEFAULT 'pending',
    payment_method payment_method_type,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 11. Define RLS Policies

-- shipping_methods: Everyone can read active methods. Only admins can write.
CREATE POLICY "Anyone can view active shipping methods" ON public.shipping_methods
    FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage shipping methods" ON public.shipping_methods
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.profile_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    ));

-- customer_addresses: User can CRUD their own addresses.
CREATE POLICY "Users can view their own addresses" ON public.customer_addresses
    FOR SELECT TO authenticated USING (customer_id = auth.uid());
CREATE POLICY "Users can insert their own addresses" ON public.customer_addresses
    FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Users can update their own addresses" ON public.customer_addresses
    FOR UPDATE TO authenticated USING (customer_id = auth.uid());
CREATE POLICY "Users can delete their own addresses" ON public.customer_addresses
    FOR DELETE TO authenticated USING (customer_id = auth.uid());

-- shopping_carts: User can CRUD their own carts.
CREATE POLICY "Users can view their own carts" ON public.shopping_carts
    FOR SELECT TO authenticated USING (customer_id = auth.uid());
CREATE POLICY "Users can insert their own carts" ON public.shopping_carts
    FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Users can update their own carts" ON public.shopping_carts
    FOR UPDATE TO authenticated USING (customer_id = auth.uid());
CREATE POLICY "Users can delete their own carts" ON public.shopping_carts
    FOR DELETE TO authenticated USING (customer_id = auth.uid());

-- cart_items: User can CRUD items for their own carts.
CREATE POLICY "Users can view items in their own carts" ON public.cart_items
    FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.shopping_carts WHERE id = cart_id AND customer_id = auth.uid()));
CREATE POLICY "Users can insert items into their own carts" ON public.cart_items
    FOR INSERT TO authenticated 
    WITH CHECK (EXISTS (SELECT 1 FROM public.shopping_carts WHERE id = cart_id AND customer_id = auth.uid()));
CREATE POLICY "Users can update items in their own carts" ON public.cart_items
    FOR UPDATE TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.shopping_carts WHERE id = cart_id AND customer_id = auth.uid()));
CREATE POLICY "Users can delete items in their own carts" ON public.cart_items
    FOR DELETE TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.shopping_carts WHERE id = cart_id AND customer_id = auth.uid()));

-- customer_orders: User can view their own orders.
CREATE POLICY "Users can view their own orders" ON public.customer_orders
    FOR SELECT TO authenticated USING (customer_id = auth.uid());

-- order_addresses: User can view their order addresses
CREATE POLICY "Users can view their own order addresses" ON public.order_addresses
    FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.customer_orders WHERE id = order_id AND customer_id = auth.uid()));

-- order_items: User can view their own order items
CREATE POLICY "Users can view their own order items" ON public.order_items
    FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.customer_orders WHERE id = order_id AND customer_id = auth.uid()));

-- payments: User can view their own payments
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.customer_orders WHERE id = order_id AND customer_id = auth.uid()));
