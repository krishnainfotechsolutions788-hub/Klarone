-- Add missing INSERT policies for customer order tables

-- customer_orders: User can insert their own orders.
CREATE POLICY "Users can insert their own orders" ON public.customer_orders
    FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());

-- order_addresses: User can insert their own order addresses
CREATE POLICY "Users can insert their own order addresses" ON public.order_addresses
    FOR INSERT TO authenticated 
    WITH CHECK (EXISTS (SELECT 1 FROM public.customer_orders WHERE id = order_id AND customer_id = auth.uid()));

-- order_items: User can insert their own order items
CREATE POLICY "Users can insert their own order items" ON public.order_items
    FOR INSERT TO authenticated 
    WITH CHECK (EXISTS (SELECT 1 FROM public.customer_orders WHERE id = order_id AND customer_id = auth.uid()));

-- payments: User can insert their own payments
CREATE POLICY "Users can insert their own payments" ON public.payments
    FOR INSERT TO authenticated 
    WITH CHECK (EXISTS (SELECT 1 FROM public.customer_orders WHERE id = order_id AND customer_id = auth.uid()));
