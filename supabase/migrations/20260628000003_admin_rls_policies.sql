-- Migration: Admin RLS Policies for Members Module
-- Grants access to profiles, user_invitations, and other supporting tables for authenticated users.
-- In a production environment, you would restrict these to users with specific roles (e.g. Admin).

-- Allow authenticated users to view all profiles
CREATE POLICY "Allow authenticated users to select profiles" 
ON public.profiles FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert and select user_invitations
CREATE POLICY "Allow authenticated users to view invitations" 
ON public.user_invitations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert invitations" 
ON public.user_invitations FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update invitations" 
ON public.user_invitations FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete invitations" 
ON public.user_invitations FOR DELETE TO authenticated USING (true);

-- Allow authenticated users to view activity and audit logs
CREATE POLICY "Allow authenticated users to view activity logs" 
ON public.user_activity_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view audit logs" 
ON public.audit_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view sessions" 
ON public.user_sessions FOR SELECT TO authenticated USING (true);
