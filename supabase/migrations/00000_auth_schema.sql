-- Supabase Migration: 00000_auth_schema.sql
-- Klarone Enterprise Auth & RBAC Setup

-- 1. Create custom types
CREATE TYPE user_status AS ENUM ('Active', 'Inactive', 'Suspended', 'Pending Invitation', 'Deleted');

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    profile_photo TEXT,
    phone TEXT,
    department TEXT,
    employee_id TEXT,
    status user_status DEFAULT 'Pending Invitation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_login TIMESTAMP WITH TIME ZONE,
    two_factor_enabled BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Roles Table
CREATE TABLE public.roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- 4. Permissions Table
CREATE TABLE public.permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module TEXT NOT NULL, -- e.g., 'products', 'inventory'
    action TEXT NOT NULL, -- e.g., 'view', 'create', 'edit', 'delete'
    description TEXT,
    UNIQUE(module, action)
);

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- 5. Role Permissions (Mapping Roles to Permissions)
CREATE TABLE public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- 6. User Roles (Mapping Users to Roles)
CREATE TABLE public.user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 7. Audit Logs Table
CREATE TABLE public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address TEXT,
    browser TEXT,
    device TEXT,
    action TEXT NOT NULL,
    affected_module TEXT,
    affected_record_id TEXT,
    old_value JSONB,
    new_value JSONB,
    status TEXT DEFAULT 'Success'
);

-- Audit logs should be insert-only, no updates or deletes allowed
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 8. Seed Base Permissions
INSERT INTO public.permissions (module, action, description) VALUES
('dashboard', 'view', 'View Dashboard'),
('products', 'view', 'View Products'),
('products', 'create', 'Create Products'),
('products', 'edit', 'Edit Products'),
('products', 'delete', 'Delete Products'),
('inventory', 'view', 'View Inventory'),
('inventory', 'create', 'Add Inventory'),
('inventory', 'edit', 'Edit Inventory'),
('inventory', 'delete', 'Delete Inventory'),
('inventory', 'import', 'Import Inventory'),
('inventory', 'export', 'Export Inventory'),
('orders', 'view', 'View Orders'),
('orders', 'create', 'Create Orders'),
('orders', 'edit', 'Edit Orders'),
('orders', 'cancel', 'Cancel Orders'),
('orders', 'refund', 'Refund Orders'),
('rentals', 'view', 'View Rentals'),
('rentals', 'create', 'Create Rentals'),
('rentals', 'return', 'Return Rentals'),
('users', 'view', 'View Users'),
('users', 'create', 'Create Users'),
('users', 'edit', 'Edit Users'),
('users', 'delete', 'Delete Users'),
('roles', 'view', 'View Roles'),
('roles', 'create', 'Create Roles'),
('roles', 'edit', 'Edit Roles'),
('roles', 'delete', 'Delete Roles'),
('website', 'view', 'View Website Settings'),
('website', 'edit', 'Edit Website Settings'),
('website', 'publish', 'Publish Website Changes'),
('blog', 'view', 'View Blog'),
('blog', 'create', 'Create Blog Posts'),
('blog', 'edit', 'Edit Blog Posts'),
('blog', 'delete', 'Delete Blog Posts'),
('coupons', 'view', 'View Coupons'),
('coupons', 'create', 'Create Coupons'),
('coupons', 'edit', 'Edit Coupons'),
('coupons', 'delete', 'Delete Coupons'),
('analytics', 'view', 'View Analytics'),
('settings', 'view', 'View System Settings'),
('settings', 'edit', 'Edit System Settings'),
('audit', 'view', 'View Audit Logs');

-- 9. Seed Super Admin Role
INSERT INTO public.roles (name, description, is_system) VALUES 
('Super Admin', 'Full system access', true);

-- Assign all permissions to Super Admin role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'Super Admin';

-- 10. Triggers for Profiles
-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, status)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', 'Active');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 11. Helper Function: Check Permission
-- A function that can be used in RLS policies to check if the current user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(required_module TEXT, required_action TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_perm BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = auth.uid()
    AND p.module = required_module
    AND p.action = required_action
  ) INTO has_perm;
  
  RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 12. Set up RLS Policies

-- Profiles: Users can read their own profile. Super Admins (via 'users' module perm) can read/update all.
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_permission('users', 'view'));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_permission('users', 'edit'));

-- Roles & Permissions: Anyone authenticated can read (for UI rendering), but only admins can edit
CREATE POLICY "Authenticated can read roles" ON public.roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert roles" ON public.roles FOR INSERT WITH CHECK (public.has_permission('roles', 'create'));
CREATE POLICY "Admins can update roles" ON public.roles FOR UPDATE USING (public.has_permission('roles', 'edit'));
CREATE POLICY "Admins can delete roles" ON public.roles FOR DELETE USING (public.has_permission('roles', 'delete'));

CREATE POLICY "Authenticated can read permissions" ON public.permissions FOR SELECT USING (auth.role() = 'authenticated');
-- Permissions table should generally be static/managed by migrations, so no insert/update/delete policies are strictly needed for users.

CREATE POLICY "Authenticated can read role_permissions" ON public.role_permissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage role_permissions" ON public.role_permissions FOR ALL USING (public.has_permission('roles', 'edit'));

CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all user_roles" ON public.user_roles FOR SELECT USING (public.has_permission('users', 'view'));
CREATE POLICY "Admins can manage user_roles" ON public.user_roles FOR ALL USING (public.has_permission('users', 'edit'));

-- Audit Logs: Only system can insert (via triggers or secure server functions), admins can view
CREATE POLICY "Admins can view audit_logs" ON public.audit_logs FOR SELECT USING (public.has_permission('audit', 'view'));
CREATE POLICY "System can insert audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated'); -- Ideally lock this down more in production
