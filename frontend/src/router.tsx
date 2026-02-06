import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import Employees from "./pages/Employees";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import NotAuthorized from "./pages/NotAuthorized";
import { UserRole } from "./utils/roles";

/**
 * Composant ProtectedRoute - Protection des routes par authentification
 *
 * Ce composant vérifie si l'utilisateur est authentifié avant d'afficher le contenu.
 *
 * Logique:
 * - Si le chargement est en cours: affiche un spinner
 * - Si l'utilisateur est authentifié: affiche les enfants (contenu protégé)
 * - Si l'utilisateur n'est pas authentifié: redirige vers /login
 *
 * @param children - Le contenu à protéger (composants React)
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Récupération de l'état d'authentification depuis le contexte
  const { isAuthenticated, isLoading } = useAuth();

  // Affichage d'un spinner pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        {/* Spinner animé avec bordure circulaire */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  // Si authentifié: affiche le contenu, sinon redirige vers login
  // replace: remplace l'historique au lieu d'ajouter une nouvelle entrée
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

/**
 * Composant RoleProtectedRoute - Protection des routes par rôle utilisateur
 *
 * Ce composant vérifie à la fois l'authentification ET le rôle de l'utilisateur.
 * Seuls les utilisateurs avec les rôles autorisés peuvent accéder au contenu.
 *
 * Logique:
 * - Si le chargement est en cours: affiche un spinner
 * - Si l'utilisateur n'est pas authentifié: redirige vers /login
 * - Si l'utilisateur n'a pas le bon rôle: affiche la page "Not Authorized"
 * - Si l'utilisateur a le bon rôle: affiche le contenu
 *
 * @param children - Le contenu à protéger (composants React)
 * @param allowedRoles - Tableau des rôles autorisés à accéder à cette route
 */
const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) => {
  // Récupération de l'utilisateur et de l'état d'authentification
  const { user, isAuthenticated, isLoading } = useAuth();

  // Affichage d'un spinner pendant la vérification
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  // Si non authentifié: redirige vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérification du rôle: si l'utilisateur n'existe pas ou n'a pas le bon rôle
  // Affiche la page "Non autorisé"
  if (!user || !allowedRoles.includes(user.role)) {
    return <NotAuthorized />;
  }

  // Si tout est OK: affiche le contenu protégé
  return <>{children}</>;
};

/**
 * Composant PublicRoute - Route publique avec redirection si authentifié
 *
 * Ce composant est utilisé pour les pages publiques (Login, Register, etc.)
 * Si l'utilisateur est déjà authentifié, il est redirigé vers le dashboard.
 *
 * Logique:
 * - Si authentifié: redirige vers /dashboard (évite d'afficher la page de login si déjà connecté)
 * - Si non authentifié: affiche le contenu public
 *
 * @param children - Le contenu public à afficher (ex: page de login)
 */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  // Si déjà connecté, redirige vers le dashboard
  // Sinon, affiche la page publique (login, etc.)
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

/**
 * Composant AppRouter - Routeur principal de l'application
 *
 * Ce composant définit toutes les routes de l'application avec:
 * - Routes publiques (accessibles sans authentification)
 * - Routes protégées (nécessitent une authentification)
 * - Routes protégées par rôle (nécessitent un rôle spécifique)
 *
 * Structure:
 * - /login: Route publique avec AuthLayout (fond animé)
 * - /: Route protégée avec MainLayout (sidebar + navbar)
 *   - /dashboard: Accessible à tous les rôles authentifiés
 *   - /assistant: Accessible à tous les rôles authentifiés
 *   - /employees: Accessible uniquement à ADMIN, HR, MANAGER
 *   - /documents: Accessible à tous (chaque utilisateur voit ses documents)
 *   - /settings: Accessible uniquement à ADMIN
 */
export const AppRouter = () => {
  return (
    <Routes>
      {/* 
        Route publique - Page de connexion
        Utilise AuthLayout (layout avec fond animé) et PublicRoute
        Si l'utilisateur est déjà connecté, sera redirigé vers /dashboard
      */}
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

      {/* 
        Routes protégées - Nécessitent une authentification
        Utilise MainLayout (layout principal avec sidebar et navbar)
        Toutes les routes enfants sont protégées par défaut
      */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* 
          Route index (/) - Redirige automatiquement vers /dashboard
          Si l'utilisateur accède à la racine, il est redirigé vers le dashboard
        */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* 
          Dashboard - Accessible à tous les rôles authentifiés
          Le contenu affiché dépend du rôle (voir Dashboard.tsx pour les différents dashboards)
        */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* 
          Assistant IA - Accessible à tous les rôles authentifiés
          Interface de chat avec l'assistant IA pour les tâches HR
        */}
        <Route path="assistant" element={<Assistant />} />

        {/* 
          Gestion des employés - Accessible uniquement à ADMIN, HR et MANAGER
          Les employés (EMPLOYEE) ne peuvent pas accéder à cette page
        */}
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

        {/* 
          Documents - Accessible à tous les rôles authentifiés
          Chaque utilisateur voit ses propres documents
          Les HR/ADMIN peuvent voir/gérer tous les documents
          (le filtrage est géré dans le composant Documents lui-même)
        */}
        <Route path="documents" element={<Documents />} />

        {/* 
          Paramètres - Accessible uniquement à ADMIN
          Configuration système et paramètres de l'application
        */}
        <Route
          path="settings"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <Settings />
            </RoleProtectedRoute>
          }
        />
      </Route>

      {/* 
        Route de secours (fallback) - Toute route non définie
        Si l'utilisateur accède à une URL qui n'existe pas,
        il est redirigé vers /dashboard
      */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
