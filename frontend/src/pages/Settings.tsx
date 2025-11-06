import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiSettings, FiShield, FiDatabase, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../utils/roles';

// VISIBLE_TO: ['ADMIN']
// TODO: Wire to backend routes like /api/system/settings
const Settings: React.FC = () => {
  const { user } = useAuth();

  // This page is already protected by route guard, but we add checks here for UI elements
  // RENDER_IF: user.role === 'ADMIN'

  const settingsCategories = [
    {
      id: 1,
      name: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: FiUsers,
      color: 'bg-blue-500',
      // TODO: Link to /api/users management
    },
    {
      id: 2,
      name: 'System Configuration',
      description: 'Configure system preferences and settings',
      icon: FiSettings,
      color: 'bg-purple-500',
      // TODO: Link to /api/system/config
    },
    {
      id: 3,
      name: 'Security & Access',
      description: 'Manage security policies and access controls',
      icon: FiShield,
      color: 'bg-red-500',
      // TODO: Link to /api/security/settings
    },
    {
      id: 4,
      name: 'Database & Backup',
      description: 'Database management and backup settings',
      icon: FiDatabase,
      color: 'bg-green-500',
      // TODO: Link to /api/system/backup
    },
    {
      id: 5,
      name: 'System Monitoring',
      description: 'View system logs and performance metrics',
      icon: FiActivity,
      color: 'bg-orange-500',
      // TODO: Link to /api/system/monitoring
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-purple-500 to-primary-500 p-8 text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="mt-2 text-purple-100">
          Admin-only configuration area. Manage system-wide settings and preferences.
        </p>
      </motion.div>

      {/* Settings Categories */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {settingsCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card group cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex items-start space-x-4">
              <div className={`rounded-xl ${category.color} p-3 text-white transition-transform group-hover:scale-110`}>
                <category.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{category.description}</p>
                <button className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700">
                  Configure →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card border-2 border-dashed border-purple-300 bg-purple-50"
      >
        <div className="flex items-start space-x-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500 text-white">
            <FiShield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Admin Access Required</h3>
            <p className="mt-1 text-sm text-gray-600">
              These settings are only accessible to system administrators. Changes made here affect
              all users and system behavior. Please ensure you understand the implications before
              making changes.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Backend API endpoints: /api/system/settings, /api/users, /api/system/config
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
