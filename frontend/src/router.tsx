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
import { UserRole } from './utils/roles';

// ----------------------
// Protected route
// ----------------------
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

// ----------------------
// Role protected route
// ----------------------
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

  if (!user || !allowedRoles.includes(user.role)) {
    return <NotAuthorized />;
  }

  return <>{children}</>;
};

// ----------------------
// Public Route
// ----------------------
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// ----------------------
// Main Router
// ----------------------
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

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard - all roles */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Assistant - all roles */}
        <Route path="assistant" element={<Assistant />} />

        {/* Employees - ADMIN + HR + MANAGER */}
        <Route
          path="employees"
          element={
            <RoleProtectedRoute
              allowedRoles={[UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]}
            >
              <Employees />
            </RoleProtectedRoute>
          }
        />

        {/* Documents - all roles can access THEIR documents */}
        <Route path="documents" element={<Documents />} />

        {/* Workflows - only ADMIN + HR */}
        <Route
          path="workflows"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.HR]}>
              <Workflows />
            </RoleProtectedRoute>
          }
        />

        {/* Settings - only ADMIN */}
        <Route
          path="settings"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <Settings />
            </RoleProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
