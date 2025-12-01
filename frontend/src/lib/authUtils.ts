// Role-based access control
export type UserRole = 'admin' | 'manager' | 'staff'

interface RouteAccess {
  path: string
  allowedRoles: UserRole[]
}

export const routeAccessControl: RouteAccess[] = [
  // Manager - Overview/Dashboard only
  { path: '/', allowedRoles: ['manager', 'admin'] },
  { path: '/dashboard', allowedRoles: ['manager', 'admin'] },
  
  // Staff - Bookings, Guests, Payments
  { path: '/bookings', allowedRoles: ['staff', 'admin'] },
  { path: '/guests', allowedRoles: ['staff', 'admin'] },
  { path: '/payments', allowedRoles: ['staff', 'admin'] },
  
  // Admin only - Full access
  { path: '/rooms', allowedRoles: ['admin'] },
  { path: '/room-types', allowedRoles: ['admin'] },
]

export const isRouteAccessible = (path: string, userRole?: string): boolean => {
  const route = routeAccessControl.find(r => r.path === path)
  if (!route) return false
  
  const normalizedRole = userRole?.toLowerCase() as UserRole | undefined
  return normalizedRole ? route.allowedRoles.includes(normalizedRole) : false
}

export const getAccessibleRoutes = (userRole?: string): string[] => {
  const normalizedRole = userRole?.toLowerCase() as UserRole | undefined
  if (!normalizedRole) return []
  
  return routeAccessControl
    .filter(route => route.allowedRoles.includes(normalizedRole))
    .map(route => route.path)
}
