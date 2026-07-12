CREATE POLICY "Admins can view all orders" ON public.customer_orders
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.profile_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    ));

CREATE POLICY "Admins can update orders" ON public.customer_orders
    FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.profile_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    ));

-- Also for order items, addresses, etc.
CREATE POLICY "Admins can view all order items" ON public.order_items
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.profile_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    ));

CREATE POLICY "Admins can view all order addresses" ON public.order_addresses
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.profile_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    ));

CREATE POLICY "Admins can view all payments" ON public.payments
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.profile_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    ));
