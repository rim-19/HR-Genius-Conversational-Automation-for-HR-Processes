// User Role Constants
export enum UserRole {
  ADMIN = 'ADMIN',
  HR = 'HR',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.HR]: 'HR',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.EMPLOYEE]: 'Employee',
};

// Role badge colors
export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'bg-purple-100 text-purple-800',
  [UserRole.HR]: 'bg-blue-100 text-blue-800',
  [UserRole.MANAGER]: 'bg-green-100 text-green-800',
  [UserRole.EMPLOYEE]: 'bg-gray-100 text-gray-800',
};

// Role-based access permissions
export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canManageEmployees: true,
    canGenerateDocuments: true,
    canCreateWorkflows: true,
    canAccessSettings: true,
    canViewAllEmployees: true,
    canApproveRequests: true,
    canViewTeamOnly: false,
  },
  [UserRole.HR]: {
    canManageUsers: false,
    canManageEmployees: true,
    canGenerateDocuments: true,
    canCreateWorkflows: true,
    canAccessSettings: false,
    canViewAllEmployees: true,
    canApproveRequests: true,
    canViewTeamOnly: false,
  },
  [UserRole.MANAGER]: {
    canManageUsers: false,
    canManageEmployees: false,
    canGenerateDocuments: false,
    canCreateWorkflows: false,
    canAccessSettings: false,
    canViewAllEmployees: false,
    canApproveRequests: true,
    canViewTeamOnly: true,
  },
  [UserRole.EMPLOYEE]: {
    canManageUsers: false,
    canManageEmployees: false,
    canGenerateDocuments: false,
    canCreateWorkflows: false,
    canAccessSettings: false,
    canViewAllEmployees: false,
    canApproveRequests: false,
    canViewTeamOnly: false,
  },
};

// Helper function to check if user has permission
export const hasPermission = (role: UserRole, permission: keyof typeof ROLE_PERMISSIONS[UserRole]): boolean => {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
};

// Helper function to check if user role is in allowed roles
export const hasRole = (userRole: string | undefined, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole as UserRole);
};

// Sidebar items visibility per role
export const SIDEBAR_ITEMS_PER_ROLE: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: ['/dashboard', '/assistant', '/employees', '/documents', '/settings'],
  [UserRole.HR]: ['/dashboard', '/assistant', '/employees', '/documents'],
  [UserRole.MANAGER]: ['/dashboard', '/assistant', '/employees', '/documents'],
  [UserRole.EMPLOYEE]: ['/dashboard', '/assistant', '/documents'],
};

// Helper to check if route is accessible for role
export const isRouteAccessible = (route: string, role: string | undefined): boolean => {
  if (!role) return false;
  const userRole = role as UserRole;
  const allowedRoutes = SIDEBAR_ITEMS_PER_ROLE[userRole] || [];
  return allowedRoutes.includes(route);
};

