"use server";

import { createClient } from "@/lib/supabase/server";
import { Member, Invitation, PaginatedResult } from "./data/types";
import crypto from "crypto";
import { Resend } from 'resend';

export async function getMembers(
  page = 1,
  pageSize = 10,
  search = "",
  statusFilter = "all"
): Promise<PaginatedResult<Member>> {
  const supabase = await createClient();
  
  let query = supabase
    .from('profiles')
    .select(`
      id,
      employee_code,
      first_name,
      last_name,
      full_name,
      email,
      phone,
      avatar_url,
      designation,
      status,
      last_login_at,
      created_at,
      departments(name),
      branches(name),
      user_roles!user_roles_profile_id_fkey(
        roles(id, name)
      )
    `, { count: 'exact' });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,employee_code.ilike.%${search}%`);
  }

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching members:", error);
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const mappedData: Member[] = (data || []).map((row: any) => ({
    id: row.id,
    employeeCode: row.employee_code || '-',
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    fullName: row.full_name || 'Unknown',
    email: row.email,
    phone: row.phone || '-',
    avatarUrl: row.avatar_url || '',
    department: row.departments?.name || 'Unassigned',
    designation: row.designation || '-',
    branch: row.branches?.name || 'Unassigned',
    status: row.status || 'pending',
    roles: (row.user_roles || []).map((ur: any) => ur.roles).filter(Boolean),
    isOnline: false,
    lastLoginAt: row.last_login_at ? new Date(row.last_login_at).toLocaleString() : 'Never',
    joinedDate: new Date(row.created_at).toLocaleDateString()
  }));

  return {
    data: mappedData,
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize)
  };
}

export async function getInvitations(
  page = 1,
  pageSize = 10,
  search = "",
  statusFilter = "all"
): Promise<PaginatedResult<Invitation>> {
  const supabase = await createClient();
  
  let query = supabase
    .from('user_invitations')
    .select(`
      id,
      email,
      first_name,
      last_name,
      status,
      expires_at,
      created_at,
      departments(name),
      profiles!invited_by(full_name)
    `, { count: 'exact' });

  if (search) {
    query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
  }

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching invitations:", error);
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const mappedData: Invitation[] = (data || []).map((row: any) => ({
    id: row.id,
    email: row.email,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    department: row.departments?.name || 'Unassigned',
    roles: [], // Roles mapping handled separately via role_ids if needed
    invitedBy: row.profiles?.full_name || 'System',
    status: row.status,
    expiresAt: new Date(row.expires_at).toLocaleDateString(),
    createdAt: new Date(row.created_at).toLocaleDateString(),
  }));

  return {
    data: mappedData,
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize)
  };
}

export async function inviteMember(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  if (!email) return { error: 'Email is required' };

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

  const { error } = await supabase.from('user_invitations').insert({
    email,
    first_name: firstName,
    last_name: lastName,
    invitation_token: token,
    expires_at: expiresAt.toISOString(),
    status: 'Pending'
  });

  if (error) {
    console.error("Failed to invite member:", error);
    return { error: error.message };
  }

  // The link they will click to accept
  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/accept-invite?token=${token}`;
  console.log("Invitation created! Link:", inviteLink);

  // Send the actual email using Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Klarone <hello@klarone.com>', 
        to: email,
        subject: 'You have been invited to join Klarone',
        html: `
          <div style="font-family: sans-serif; max-w-md; margin: 0 auto;">
            <h2>Welcome to Klarone!</h2>
            <p>Hi ${firstName || 'there'},</p>
            <p>You have been invited to join the Klarone workspace as an employee.</p>
            <p>Click the button below to accept your invitation and set up your account password:</p>
            <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background-color: #181d26; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Accept Invitation</a>
            <p style="color: #666; font-size: 12px; margin-top: 24px;">If you did not expect this invitation, you can safely ignore this email.</p>
          </div>
        `
      });
      
      if (error) {
        console.error("Resend API Error details:", error);
        return { success: true, inviteLink, emailError: error.message || "Failed to send email." };
      } else {
        console.log("Successfully sent invitation email to", email, "ID:", data?.id);
      }
    } catch (emailError: any) {
      console.error("Failed to send email via Resend:", emailError);
      return { success: true, inviteLink, emailError: emailError.message || "Failed to send email." };
    }
  }

  return { success: true, inviteLink };
}

export async function getMemberDetails(profileId: string) {
  const supabase = await createClient();
  
  const [sessionsRes, auditLogsRes, activityLogsRes] = await Promise.all([
    supabase
      .from('user_sessions')
      .select('*')
      .eq('profile_id', profileId)
      .order('last_activity', { ascending: false })
      .limit(10),
    supabase
      .from('audit_logs')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(15),
    supabase
      .from('user_activity_logs')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(15)
  ]);

  return {
    sessions: sessionsRes.data || [],
    auditLogs: auditLogsRes.data || [],
    activityTimeline: (activityLogsRes.data || []).map(log => ({
      id: log.id,
      title: log.activity_type,
      date: new Date(log.created_at).toLocaleString()
    }))
  };
}

export async function getMemberMetrics() {
  const supabase = await createClient();
  
  const [membersRes, activeRes, suspendedRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('status', 'suspended')
  ]);
  
  return {
    total: membersRes.count || 0,
    active: activeRes.count || 0,
    suspended: suspendedRes.count || 0,
    online: 0,
    pending: 0 // Migrated to invitations
  };
}

export async function getInvitationMetrics() {
  const supabase = await createClient();
  
  const [pendingRes, acceptedRes, expiredRes] = await Promise.all([
    supabase.from('user_invitations').select('id', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabase.from('user_invitations').select('id', { count: 'exact', head: true }).eq('status', 'Accepted'),
    supabase.from('user_invitations').select('id', { count: 'exact', head: true }).eq('status', 'Expired')
  ]);
  
  return {
    pending: pendingRes.count || 0,
    accepted: acceptedRes.count || 0,
    expired: expiredRes.count || 0,
    revoked: 0
  };
}

export async function deleteInvitation(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('user_invitations').delete().eq('id', id);
  
  if (error) {
    console.error("Failed to delete invitation:", error);
    return { error: error.message };
  }
  
  return { success: true };
}
