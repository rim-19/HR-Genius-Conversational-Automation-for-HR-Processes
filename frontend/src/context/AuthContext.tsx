import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { UserRole } from '../utils/roles';

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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('hr_genius_user');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);

          // Validate role
          if (!Object.values(UserRole).includes(parsedUser.role)) {
            localStorage.removeItem('hr_genius_user');
            setIsLoading(false);
            return;
          }

          // Validate token with backend
          try {
            const response = await api.get('/me'); // backend must return user info
            setUser({ ...response.data, token: parsedUser.token, avatar: parsedUser.avatar });
          } catch (err) {
            // Token invalid → logout
            localStorage.removeItem('hr_genius_user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
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

      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userData.name
      )}&background=0ea5e9&color=fff`;

      const userToStore = {
        ...userData,
        avatar,
        token,
      };

      localStorage.setItem('hr_genius_user', JSON.stringify(userToStore));
      setUser(userToStore);

      toast.success(`Welcome back, ${userData.name}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid email or password.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('hr_genius_user');
    toast.info('You have been logged out.');
    navigate('/login');
  };

  // Update user (role, data…)
  const updateUser = (updatedUser: User) => {
    if (!Object.values(UserRole).includes(updatedUser.role)) {
      console.error('Invalid role:', updatedUser.role);
      return;
    }

    setUser(updatedUser);

    const stored = localStorage.getItem('hr_genius_user');
    if (stored) {
      const oldUser = JSON.parse(stored);
      localStorage.setItem(
        'hr_genius_user',
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
