DROP POLICY IF EXISTS "Users can insert their own orders" ON public.customer_orders;
CREATE POLICY "Users can insert their own orders" ON public.customer_orders FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view their own orders" ON public.customer_orders;
CREATE POLICY "Users can view their own orders" ON public.customer_orders FOR SELECT TO authenticated USING (true);
