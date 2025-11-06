import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserRole } from '../utils/roles';

// Define user interface
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole; // Use enum instead of string
  avatar?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>; // role param for demo only
  logout: () => void;
  updateUser: (user: User) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for stored user on mount and fetch from backend
  useEffect(() => {
    const loadUser = async () => {
      try {
        // TODO: Replace with actual API call to /api/auth/me
        // const response = await api.get('/auth/me');
        // const userData = response.data;
        // setUser(userData);
        
        // For now, check localStorage
        const storedUser = localStorage.getItem('hr_genius_user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // Ensure role is valid UserRole enum value
            if (Object.values(UserRole).includes(parsedUser.role)) {
              setUser(parsedUser);
            } else {
              console.warn('Invalid role in stored user, clearing...');
              localStorage.removeItem('hr_genius_user');
            }
          } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('hr_genius_user');
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

  // Login function
  // For demo: accepts optional role parameter to test different user roles
  const login = async (email: string, password: string, role?: UserRole) => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await axios.post('/api/auth/login', { email, password });
      // const userData = response.data;
      // setUser(userData); // Backend should return user with role
      
      // Mock login for now - remove role parameter when backend is integrated
      // TODO: Replace with actual API call to /api/auth/login
      // Backend should return user object with role: 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
      const roleNames: Record<UserRole, string> = {
        [UserRole.ADMIN]: 'Admin User',
        [UserRole.HR]: 'HR Manager',
        [UserRole.MANAGER]: 'Team Manager',
        [UserRole.EMPLOYEE]: 'Employee',
      };
      
      const selectedRole = role || UserRole.HR;
      const name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'User';
      
      const mockUser: User = {
        id: '1',
        name: `${name} (${roleNames[selectedRole]})`,
        email: email,
        role: selectedRole,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff`
      };

      setUser(mockUser);
      localStorage.setItem('hr_genius_user', JSON.stringify(mockUser));
      toast.success(`Welcome back, ${mockUser.name}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('hr_genius_user');
    toast.info('You have been logged out.');
    navigate('/login');
  };

  // Update user function with smooth transition support
  const updateUser = (updatedUser: User) => {
    // Validate role before updating
    if (!Object.values(UserRole).includes(updatedUser.role)) {
      console.error('Invalid role provided:', updatedUser.role);
      return;
    }
    setUser(updatedUser);
    localStorage.setItem('hr_genius_user', JSON.stringify(updatedUser));
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

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
