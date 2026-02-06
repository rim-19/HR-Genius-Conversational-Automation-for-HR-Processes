import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { UserRole } from "../utils/roles";

// Define user interface
interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  token?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("hr_genius_token");
        const storedUser = localStorage.getItem("hr_genius_user");

        if (token && storedUser) {
          // Set authorization header for all future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          try {
            const response = await api.get('/me');
            setUser(response.data);
          } catch (error) {
            console.error("Token verification failed:", error);
            logout();
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/login', { email, password });

      const { token, user: userData } = response.data;

      localStorage.setItem("hr_genius_token", token);
      localStorage.setItem("hr_genius_user", JSON.stringify(userData));

      // Set Auth Header
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      navigate("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("hr_genius_user");
    localStorage.removeItem("hr_genius_token");
    delete api.defaults.headers.common["Authorization"];
    toast.info("You have been logged out.");
    navigate("/login");
  };

  // Update user (role, data…)
  const updateUser = (updatedUser: User) => {
    if (!Object.values(UserRole).includes(updatedUser.role)) {
      console.error("Invalid role:", updatedUser.role);
      return;
    }

    setUser(updatedUser);

    const stored = localStorage.getItem("hr_genius_user");
    if (stored) {
      const oldUser = JSON.parse(stored);
      localStorage.setItem(
        "hr_genius_user",
        JSON.stringify({ ...oldUser, ...updatedUser })
      );
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
