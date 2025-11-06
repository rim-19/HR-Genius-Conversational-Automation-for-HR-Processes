import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiBell, FiSearch, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ROLE_DISPLAY_NAMES, ROLE_BADGE_COLORS } from '../utils/roles';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <nav className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      {/* Search bar */}
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees, documents..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Right side - Notifications and User */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
          <FiBell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-secondary-500"></span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <img
              src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=0ea5e9&color=fff'}
              alt={user?.name}
              className="h-8 w-8 rounded-full"
            />
            <div className="hidden text-left md:block">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                {/* Role badge */}
                {user?.role && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${ROLE_BADGE_COLORS[user.role]}`}
                  >
                    {ROLE_DISPLAY_NAMES[user.role]}
                  </motion.span>
                )}
              </div>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <FiChevronDown className="h-4 w-4 text-gray-600" />
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5"
            >
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Navigate to profile
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile Settings
              </button>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;