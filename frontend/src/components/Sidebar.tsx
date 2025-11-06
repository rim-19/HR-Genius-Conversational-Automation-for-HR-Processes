import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiMessageSquare,
  FiUsers,
  FiFileText,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { UserRole, isRouteAccessible } from '../utils/roles';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  // All possible menu items
  // Visibility is controlled by role-based access control
  const allMenuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard', roles: [UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { path: '/assistant', icon: FiMessageSquare, label: 'AI Assistant', roles: [UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { path: '/employees', icon: FiUsers, label: 'Employees', roles: [UserRole.ADMIN, UserRole.HR, UserRole.MANAGER] }, // VISIBLE_TO: ['ADMIN', 'HR', 'MANAGER']
    { path: '/documents', icon: FiFileText, label: 'Documents', roles: [UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { path: '/workflows', icon: HiSparkles, label: 'Workflows', roles: [UserRole.ADMIN, UserRole.HR] }, // VISIBLE_TO: ['ADMIN', 'HR']
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter((item) => {
    if (!user?.role) return false;
    return item.roles.includes(user.role);
  });

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="relative flex flex-col border-r border-gray-200 bg-white shadow-sm"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
              <HiSparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">HR-Genius</h1>
              <p className="text-xs text-gray-500">AI Assistant</p>
            </div>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
            <HiSparkles className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Settings at bottom - VISIBLE_TO: ['ADMIN'] */}
      {user?.role === UserRole.ADMIN && (
        <div className="border-t border-gray-200 p-4">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <FiSettings className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>
        </div>
      )}

      {/* Collapse button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100"
      >
        {isCollapsed ? (
          <FiChevronRight className="h-4 w-4" />
        ) : (
          <FiChevronLeft className="h-4 w-4" />
        )}
      </button>
    </motion.aside>
  );
};

export default Sidebar;