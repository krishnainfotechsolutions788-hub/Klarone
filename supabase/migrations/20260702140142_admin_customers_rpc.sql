-- 1. Create a Secure RPC for Admins to fetch customers with their email and order stats
CREATE OR REPLACE FUNCTION public.get_admin_customers()
RETURNS TABLE (
    id UUID,
    name TEXT,
    email TEXT,
    phone TEXT,
    total_orders BIGINT,
    total_spent NUMERIC,
    status TEXT,
    avatar TEXT,
    join_date TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Authorization: Ensure caller is an admin or superadmin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        JOIN public.profiles p ON ur.profile_id = p.id
        WHERE p.auth_user_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can view the customer list.';
    END IF;

    -- Return the customer list joined securely with auth.users
    RETURN QUERY
    SELECT 
        u.id,
        COALESCE(p.first_name || ' ' || p.last_name, 'Unknown') AS name,
        u.email::TEXT,
        p.phone,
        COALESCE(COUNT(co.id), 0)::BIGINT AS total_orders,
        COALESCE(SUM(co.grand_total), 0)::NUMERIC AS total_spent,
        p.status::TEXT,
        p.avatar_url AS avatar,
        p.created_at AS join_date
    FROM auth.users u
    JOIN public.profiles p ON u.auth_user_id = p.auth_user_id
    LEFT JOIN public.customer_orders co ON co.customer_id = u.id
    GROUP BY u.id, p.first_name, p.last_name, u.email, p.phone, p.status, p.avatar_url, p.created_at
    ORDER BY p.created_at DESC;
END;
$$;
