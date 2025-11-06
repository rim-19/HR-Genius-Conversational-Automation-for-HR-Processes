import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Employees from './pages/Employees';
import Documents from './pages/Documents';
import Workflows from './pages/Workflows';
import Settings from './pages/Settings';
import NotAuthorized from './pages/NotAuthorized';
import { UserRole, isRouteAccessible } from './utils/roles';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Role-based protected route component
// TODO: protect route for specific roles
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!user || !allowedRoles.includes(user.role)) {
    return <NotAuthorized />;
  }

  return <>{children}</>;
};

// Public route component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// Main router component
export const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard - accessible to all authenticated users */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* AI Assistant - accessible to all authenticated users */}
        <Route path="assistant" element={<Assistant />} />
        
        {/* Employees - VISIBLE_TO: ['ADMIN', 'HR', 'MANAGER'] */}
        <Route 
          path="employees" 
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]}>
              <Employees />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Documents - accessible to all authenticated users */}
        <Route path="documents" element={<Documents />} />
        
        {/* Workflows - VISIBLE_TO: ['ADMIN', 'HR'] */}
        <Route 
          path="workflows" 
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.HR]}>
              <Workflows />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Settings - VISIBLE_TO: ['ADMIN'] */}
        <Route 
          path="settings" 
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <Settings />
            </RoleProtectedRoute>
          } 
        />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
