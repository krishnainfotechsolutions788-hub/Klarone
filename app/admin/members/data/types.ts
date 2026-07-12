export type MemberStatus = 'active' | 'pending' | 'suspended' | 'archived';

export interface Role {
  id: string;
  name: string;
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  loginAt: string;
  lastActivity: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  date: string;
}

export interface Activity {
  id: string;
  title: string;
  date: string;
}

export interface Member {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  department: string;
  designation: string;
  branch: string;
  status: MemberStatus;
  roles: Role[];
  isOnline: boolean;
  lastLoginAt: string;
  joinedDate: string;
  sessions?: Session[];
  auditLogs?: AuditLog[];
  activityTimeline?: Activity[];
}

export interface Invitation {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  roles: Role[];
  invitedBy: string;
  status: 'Pending' | 'Accepted' | 'Expired' | 'Revoked';
  expiresAt: string;
  createdAt: string;
  invitationToken?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}



