# Role-Based Access Control (RBAC) Implementation

## Overview
This document describes the role-based access control system implemented in the HR-Genius frontend application. The system supports four distinct user roles with different permissions and dashboards.

## User Roles

### 1. **ADMIN**
- **Full Access**: Complete system access including users, employees, documents, workflows, and system settings
- **Dashboard**: System overview with total users, HR staff count, total documents, and system health
- **Sidebar Access**: Dashboard, Assistant, Employees, Documents, Workflows, Settings
- **Special Features**: User management, system configuration, security settings

### 2. **HR**
- **Access**: Manage all employees, generate documents, and create workflows
- **Dashboard**: Quick stats (Employees, Documents, Workflows), "Generate Document" shortcut
- **Sidebar Access**: Dashboard, Assistant, Employees, Documents, Workflows
- **Special Features**: Document generation, employee management, workflow creation

### 3. **MANAGER**
- **Access**: View only their team's employees and documents; can approve or request HR actions
- **Dashboard**: "My Team" view, pending approvals, and document requests
- **Sidebar Access**: Dashboard, Assistant, Employees, Documents
- **Special Features**: Team management, approval workflows

### 4. **EMPLOYEE**
- **Access**: Personal dashboard with profile, personal documents, and ability to request new ones
- **Dashboard**: Personal stats, recent documents, and request form
- **Sidebar Access**: Dashboard, Assistant, Documents
- **Special Features**: Document requests, personal profile management

## Implementation Details

### File Structure
```
frontend/src/
├── utils/
│   └── roles.ts                    # Role constants, permissions, and utilities
├── context/
│   └── AuthContext.tsx             # Authentication context with role support
├── components/
│   ├── Navbar.tsx                 # Role badge display
│   └── Sidebar.tsx                # Role-based menu visibility
├── pages/
│   ├── Dashboard.tsx              # Role-specific dashboard components
│   ├── Employees.tsx              # Role-based employee management
│   ├── Documents.tsx              # Role-based document access
│   ├── Workflows.tsx              # HR/Admin only workflows
│   ├── Settings.tsx               # Admin-only settings
│   └── NotAuthorized.tsx          # Access denied page
└── router.tsx                     # Role-based route protection
```

### Key Components

#### 1. Role Utilities (`utils/roles.ts`)
- Defines `UserRole` enum (ADMIN, HR, MANAGER, EMPLOYEE)
- Role display names and badge colors
- Permission checks (`hasPermission`, `hasRole`)
- Route accessibility checks (`isRouteAccessible`)
- Sidebar items mapping per role

#### 2. AuthContext (`context/AuthContext.tsx`)
- Stores user object including role
- Validates role on load and update
- TODO: Connect to `/api/auth/me` for user data fetching

#### 3. Route Protection (`router.tsx`)
- `ProtectedRoute`: Basic authentication check
- `RoleProtectedRoute`: Role-based access control
- Routes protected with comments:
  - `// VISIBLE_TO: ['ADMIN', 'HR']` for Workflows
  - `// VISIBLE_TO: ['ADMIN']` for Settings
  - `// VISIBLE_TO: ['ADMIN', 'HR', 'MANAGER']` for Employees

#### 4. Conditional Rendering
Pages use conditional rendering with clear comments:
- `// RENDER_IF: user.role === 'HR' || user.role === 'ADMIN'`
- `// VISIBLE_TO: ['ADMIN', 'HR']`

### UI Features

#### Role Badge
- Displayed in Navbar beside user name
- Color-coded by role:
  - Admin: Purple
  - HR: Blue
  - Manager: Green
  - Employee: Gray

#### Sidebar Visibility
- Menu items automatically filtered based on role
- Settings link only visible to Admin
- Smooth animations when items appear/disappear

#### Dashboard Differences
- **Admin**: System metrics, user management links
- **HR**: Employee stats, document generation shortcuts
- **Manager**: Team view, pending approvals
- **Employee**: Personal documents, request form

### Animations & Transitions
- Page transitions with Framer Motion
- Role badge animations on login
- Sidebar menu item animations
- Smooth transitions when switching roles

## Backend Integration Points

### Required API Endpoints
1. **Authentication**
   - `POST /api/auth/login` - Should return user object with role
   - `GET /api/auth/me` - Get current user with role

2. **User Management** (Admin only)
   - `GET /api/users` - List all users
   - `POST /api/users` - Create user
   - `PUT /api/users/:id` - Update user
   - `DELETE /api/users/:id` - Delete user

3. **Employees** (Admin, HR, Manager)
   - `GET /api/employees` - List employees (filtered by role)
   - `POST /api/employees` - Create employee (Admin/HR only)
   - `PUT /api/employees/:id` - Update employee (Admin/HR only)
   - `DELETE /api/employees/:id` - Delete employee (Admin/HR only)

4. **Documents**
   - `GET /api/documents` - List documents (filtered by role)
   - `POST /api/documents` - Generate document (HR/Admin) or request (Employee)
   - `DELETE /api/documents/:id` - Delete document (HR/Admin only)

5. **Workflows** (Admin/HR only)
   - `GET /api/workflows` - List workflows
   - `POST /api/workflows` - Create workflow
   - `PUT /api/workflows/:id` - Update workflow
   - `DELETE /api/workflows/:id` - Delete workflow

6. **Settings** (Admin only)
   - `GET /api/system/settings` - Get system settings
   - `PUT /api/system/settings` - Update system settings
   - `GET /api/system/config` - Get configuration
   - `GET /api/system/monitoring` - Get system metrics

## Testing Different Roles

### Mock Login (Current Implementation)
The current mock login defaults to HR role. To test different roles, modify the `login` function in `AuthContext.tsx`:

```typescript
const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: email,
  role: UserRole.ADMIN, // Change to ADMIN, HR, MANAGER, or EMPLOYEE
  avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0ea5e9&color=fff'
};
```

### Role Switching
When backend is integrated, role changes will be reflected immediately:
- Sidebar updates automatically
- Dashboard content changes
- Route protection enforces access
- Animations provide smooth transitions

## Security Notes

1. **Frontend Protection**: UI elements are hidden/disabled based on role
2. **Route Protection**: Routes are protected at the router level
3. **Backend Validation**: ⚠️ **CRITICAL**: Backend must validate all requests regardless of frontend checks
4. **Token Validation**: Ensure JWT tokens include role information
5. **API Security**: All API endpoints must verify user role before processing requests

## Future Enhancements

1. Role switching UI for testing
2. Permission-based fine-grained access control
3. Role hierarchy system
4. Audit logging for role-based actions
5. Multi-tenant role support

## Comments for Backend Team

All role-based components include comments like:
- `// VISIBLE_TO: ['ADMIN', 'HR']` - Indicates which roles can see/use this feature
- `// RENDER_IF: user.role === 'HR' || user.role === 'ADMIN'` - Conditional rendering logic
- `// TODO: protect route for specific roles` - Indicates route protection needed

These comments help backend developers understand the expected access control requirements.

