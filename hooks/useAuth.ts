import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  profile_photo: string
  phone: string
  department: string
  employee_id: string
  status: string
  created_at: string
  last_login: string
}

interface Permission {
  module: string
  action: string
}

export function useAuth() {
  const supabase = createClient()

  // Fetch authenticated user
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    },
  })

  // Fetch extended profile
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()
      
      if (error) throw error
      return data as UserProfile
    },
  })

  // Fetch flat permissions array
  const { data: permissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['userPermissions', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      // Since supabase JS client does not directly support complex many-to-many joins cleanly without views or RPCs
      // We can use a custom RPC we should have created, or do multiple queries. 
      // For now, let's assume we create a view or RPC called `get_user_permissions`
      // Or we just query user_roles -> role_permissions -> permissions
      
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user!.id)

      if (!userRoles || userRoles.length === 0) return []

      const roleIds = userRoles.map(ur => ur.role_id)

      const { data: rolePerms } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .in('role_id', roleIds)

      if (!rolePerms || rolePerms.length === 0) return []

      const permIds = rolePerms.map(rp => rp.permission_id)

      const { data: perms } = await supabase
        .from('permissions')
        .select('module, action')
        .in('id', permIds)

      return (perms || []) as Permission[]
    },
  })

  const hasPermission = (module: string, action: string) => {
    if (!permissions) return false
    return permissions.some(p => p.module === module && p.action === action)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return {
    user,
    profile,
    permissions,
    hasPermission,
    isLoading: isLoadingUser || isLoadingProfile || isLoadingPermissions,
    logout
  }
}
