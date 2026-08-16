import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiSettings,
  FiShield,
  FiDatabase,
  FiActivity,
  FiCheckCircle,
  FiAlertTriangle,
  FiSave,
  FiRefreshCw,
  FiTrash2,
  FiLock
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../utils/roles";

// --- Types ---
type TabId = 'users' | 'system' | 'security' | 'database' | 'monitoring';

// --- Components ---

// 1. User Management Section
const UserManagement: React.FC = () => {
  // Mock Data - Matching Seed Data
  const users = [
    { id: 1, name: "Admin User", email: "elrhezzalrim@gmail.com", role: "ADMIN", status: "Active" },
    { id: 2, name: "HR User", email: "youssrazahafy@gmail.com", role: "HR", status: "Active" },
    { id: 3, name: "Manager User", email: "prettiestrim.web@gmail.com", role: "MANAGER", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">User Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage system access and roles</p>
        </div>
        <button className="btn btn-primary">Add New User</button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-300 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' :
                    user.role === 'HR' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
                    }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-3">Edit</button>
                  <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 2. System Configuration
const SystemConfiguration: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">System Configuration</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Global application settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</span>
            <input type="text" className="input w-full mt-1" defaultValue="HR Genius Corp" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Support Email</span>
            <input type="email" className="input w-full mt-1" defaultValue="support@hr-genius.com" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</span>
            <select className="input w-full mt-1">
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
            </select>
          </label>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notification Preferences</span>
            <div className="mt-2 space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-primary-600" defaultChecked />
                <span className="text-sm text-gray-600 dark:text-gray-400">Email Alerts</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-primary-600" defaultChecked />
                <span className="text-sm text-gray-600 dark:text-gray-400">System Notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-primary-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">SMS Alerts (Enterprise)</span>
              </label>
            </div>
          </label>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <button className="btn btn-primary flex items-center space-x-2">
          <FiSave />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

// 3. Security & Access
const SecurityAccess: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Security & Access</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage security policies and protocols</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Authentication</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">JWT Strategy</h3>
            </div>
            <FiCheckCircle className="text-green-500 h-6 w-6" />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Active secure token-based auth</p>
        </div>
        <div className="card border-l-4 border-yellow-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Password Policy</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Standard</h3>
            </div>
            <FiAlertTriangle className="text-yellow-500 h-6 w-6" />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Min 8 chars. Consider upgrading to 'Strong'.</p>
        </div>
        <div className="card border-l-4 border-red-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">MFA Status</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Disabled</h3>
            </div>
            <FiLock className="text-red-500 h-6 w-6" />
          </div>
          <button className="mt-2 text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">Enable MFA</button>
        </div>
      </div>

      <div className="card bg-gray-50 dark:bg-gray-900">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Access Control List (ACL)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Current role-based access configuration.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <th className="pb-2">Role</th>
                <th className="pb-2">Dashboard</th>
                <th className="pb-2">Employees</th>
                <th className="pb-2">Settings</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-2 font-medium">ADMIN</td>
                <td className="text-green-600 dark:text-green-400">Full Access</td>
                <td className="text-green-600 dark:text-green-400">Full Access</td>
                <td className="text-green-600 dark:text-green-400">Full Access</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-2 font-medium">HR</td>
                <td className="text-green-600 dark:text-green-400">Full Access</td>
                <td className="text-green-600 dark:text-green-400">Full Access</td>
                <td className="text-red-600 dark:text-red-400">Denied</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">EMPLOYEE</td>
                <td className="text-blue-600 dark:text-blue-400">View Only</td>
                <td className="text-red-600 dark:text-red-400">Denied</td>
                <td className="text-red-600 dark:text-red-400">Denied</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 4. Database & Backup
const DatabaseBackup: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Database & Backup</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Infrastructure operational controls</p>
      </div>

      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg text-white">
            <FiDatabase className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">PostgreSQL Database</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Connection Status: <span className="text-green-600 dark:text-green-400 font-semibold">Healthy</span></p>
          </div>
          <div className="flex-1 text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Uptime: 14d 2h 12m</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Backup Schedule</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Frequency</span>
              <span className="font-medium">Daily (02:00 UTC)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Retention</span>
              <span className="font-medium">30 Days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Last Successful</span>
              <span className="font-medium text-green-600 dark:text-green-400">Today, 02:00 AM</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Actions</h3>
          <div className="space-y-3">
            <button className="btn btn-outline w-full justify-center space-x-2">
              <FiSave />
              <span>Trigger Manual Backup</span>
            </button>
            <button className="btn btn-outline w-full justify-center space-x-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800">
              <FiTrash2 />
              <span>Prune Old Logs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. System Monitoring
const SystemMonitoring: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">System Monitoring</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Real-time performance metrics</p>
      </div>

      <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Uptime', value: '99.9%', color: 'text-green-600 dark:text-green-400' },
          { label: 'Latency', value: '45ms', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Error Rate', value: '0.01%', color: 'text-green-600 dark:text-green-400' },
          { label: 'Active Users', value: '12', color: 'text-purple-600 dark:text-purple-400' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center py-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="card bg-gray-900 text-gray-100 font-mono text-sm h-64 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-700 sticky top-0 bg-gray-900">
          <span className="font-semibold text-gray-400">System Logs</span>
          <button className="text-xs text-primary-400 hover:text-primary-300">Export</button>
        </div>
        <div className="space-y-1">
          <p><span className="text-gray-500">[10:00:23]</span> <span className="text-green-400">INFO</span> User login successful (ID: 4)</p>
          <p><span className="text-gray-500">[10:01:05]</span> <span className="text-blue-400">DEBUG</span> Compressing backup archive...</p>
          <p><span className="text-gray-500">[10:01:06]</span> <span className="text-green-400">INFO</span> Backup completed (size: 45MB)</p>
          <p><span className="text-gray-500">[10:05:12]</span> <span className="text-yellow-400">WARN</span> High memory usage detected (78%)</p>
          <p><span className="text-gray-500">[10:12:45]</span> <span className="text-green-400">INFO</span> Scheduled task 'GenerateReports' completed</p>
          <p><span className="text-gray-500">[10:15:00]</span> <span className="text-green-400">INFO</span> API Health check: OK</p>
        </div>
      </div>
    </div>
  );
};


// --- Main Component ---

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('users');

  const navItems = [
    { id: 'users', label: 'User Management', icon: FiUsers },
    { id: 'system', label: 'System Configuration', icon: FiSettings },
    { id: 'security', label: 'Security & Access', icon: FiShield },
    { id: 'database', label: 'Database & Backup', icon: FiDatabase },
    { id: 'monitoring', label: 'System Monitoring', icon: FiActivity },
  ];

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      {/* Left Sidebar Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-64 flex-shrink-0 card p-0 overflow-hidden h-fit"
      >
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-gray-800 dark:text-gray-200">Settings</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">v2.4.0 (Build 2026)</p>
        </div>
        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabId)}
              className={`nav-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
            >
              <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <span>{item.label}</span>
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute right-0 w-1 h-8 bg-primary-600 rounded-l-md"
                />
              )}
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Right Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        key={activeTab} // Forces re-render animation on tab switch
        className="flex-1 overflow-y-auto"
      >
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'system' && <SystemConfiguration />}
        {activeTab === 'security' && <SecurityAccess />}
        {activeTab === 'database' && <DatabaseBackup />}
        {activeTab === 'monitoring' && <SystemMonitoring />}
      </motion.div>
    </div>
  );
};

export default Settings;
