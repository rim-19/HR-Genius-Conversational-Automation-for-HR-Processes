import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiFileText, FiTrendingUp, FiActivity, FiUser, FiCheckCircle, FiClock, FiSettings } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { UserRole } from '../utils/roles';

// Admin Dashboard Component
// VISIBLE_TO: ['ADMIN']
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      id: 1,
      name: 'Total Users',
      value: '42',
      change: '+3',
      icon: FiUsers,
      color: 'bg-purple-500',
      description: 'System users across all roles',
    },
    {
      id: 2,
      name: 'HR Staff',
      value: '8',
      change: '+1',
      icon: FiUser,
      color: 'bg-blue-500',
      description: 'Active HR personnel',
    },
    {
      id: 3,
      name: 'Total Documents',
      value: '1,429',
      change: '+8%',
      icon: FiFileText,
      color: 'bg-secondary-500',
      description: 'All system documents',
    },
    {
      id: 4,
      name: 'System Health',
      value: '99.9%',
      change: 'Stable',
      icon: FiActivity,
      color: 'bg-green-500',
      description: 'Uptime and performance',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-purple-500 to-primary-500 p-8 text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-purple-100">
          System overview and management controls
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card group hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
                <p className="mt-1 flex items-center text-sm text-green-600">
                  <FiTrendingUp className="mr-1 h-4 w-4" />
                  {stat.change}
                </p>
              </div>
              <div className={`rounded-xl ${stat.color} p-3 text-white transition-transform group-hover:scale-110`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="mb-4 text-xl font-semibold text-gray-900">System Management</h2>
          <div className="grid gap-3">
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500 text-white">
                <FiSettings className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">System Settings</p>
                <p className="text-xs text-gray-600">Configure system preferences and access</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/employees')}
              className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
                <FiUsers className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">User Management</p>
                <p className="text-xs text-gray-600">Manage users and permissions</p>
              </div>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid gap-3">
            <button
              onClick={() => navigate('/assistant')}
              className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500 text-white">
                <HiSparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">AI Assistant</p>
                <p className="text-xs text-gray-600">Get instant help with system tasks</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/workflows')}
              className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white">
                <FiActivity className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Workflow Management</p>
                <p className="text-xs text-gray-600">Configure automation workflows</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// HR Dashboard Component
// VISIBLE_TO: ['HR']
const HRDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      id: 1,
      name: 'Total Employees',
      value: '248',
      change: '+12%',
      icon: FiUsers,
      color: 'bg-primary-500',
    },
    {
      id: 2,
      name: 'Documents Generated',
      value: '1,429',
      change: '+8%',
      icon: FiFileText,
      color: 'bg-secondary-500',
    },
    {
      id: 3,
      name: 'Active Workflows',
      value: '12',
      change: '+3',
      icon: FiActivity,
      color: 'bg-green-500',
    },
    {
      id: 4,
      name: 'AI Interactions',
      value: '3,847',
      change: '+24%',
      icon: HiSparkles,
      color: 'bg-purple-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Generated employment certificate',
      employee: 'John Doe',
      time: '2 hours ago',
    },
    {
      id: 2,
      action: 'Updated salary information',
      employee: 'Jane Smith',
      time: '4 hours ago',
    },
    {
      id: 3,
      action: 'Created new employee profile',
      employee: 'Mike Johnson',
      time: '1 day ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 p-8 text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold">HR Dashboard</h1>
        <p className="mt-2 text-primary-100">
          Manage employees, documents, and workflows
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card group hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 flex items-center text-sm text-green-600">
                  <FiTrendingUp className="mr-1 h-4 w-4" />
                  {stat.change}
                </p>
              </div>
              <div className={`rounded-xl ${stat.color} p-3 text-white transition-transform group-hover:scale-110`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent activities and quick actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <FiActivity className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">Employee: {activity.employee}</p>
                  <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid gap-3">
            <button
              onClick={() => navigate('/documents')}
              className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-500 text-white">
                <FiFileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Generate Document</p>
                <p className="text-xs text-gray-600">Create certificates and letters</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/employees')}
              className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white">
                <FiUsers className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Employees</p>
                <p className="text-xs text-gray-600">View and update employee data</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/workflows')}
              className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500 text-white">
                <HiSparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Workflow</p>
                <p className="text-xs text-gray-600">Set up automated processes</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Manager Dashboard Component
// VISIBLE_TO: ['MANAGER']
const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const teamStats = [
    {
      id: 1,
      name: 'Team Members',
      value: '12',
      change: '+2',
      icon: FiUsers,
      color: 'bg-primary-500',
    },
    {
      id: 2,
      name: 'Team Documents',
      value: '45',
      change: '+5',
      icon: FiFileText,
      color: 'bg-secondary-500',
    },
    {
      id: 3,
      name: 'Pending Approvals',
      value: '3',
      change: 'Urgent',
      icon: FiClock,
      color: 'bg-orange-500',
    },
    {
      id: 4,
      name: 'Approved This Month',
      value: '18',
      change: '+12%',
      icon: FiCheckCircle,
      color: 'bg-green-500',
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'Leave Request',
      employee: 'Sarah Williams',
      date: '2 days ago',
      status: 'pending',
    },
    {
      id: 2,
      type: 'Document Request',
      employee: 'Mike Johnson',
      date: '1 day ago',
      status: 'pending',
    },
    {
      id: 3,
      type: 'Salary Update',
      employee: 'David Brown',
      date: '3 days ago',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-green-500 to-primary-500 p-8 text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <p className="mt-2 text-green-100">
          Manage your team and approve requests
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {teamStats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card group hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 flex items-center text-sm text-green-600">
                  <FiTrendingUp className="mr-1 h-4 w-4" />
                  {stat.change}
                </p>
              </div>
              <div className={`rounded-xl ${stat.color} p-3 text-white transition-transform group-hover:scale-110`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* My Team and Pending Approvals */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Team View */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="mb-4 text-xl font-semibold text-gray-900">My Team</h2>
          <p className="mb-4 text-sm text-gray-600">
            View and manage your team members
          </p>
          <button
            onClick={() => navigate('/employees')}
            className="btn btn-primary w-full"
          >
            View Team Members
          </button>
        </motion.div>

        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Pending Approvals</h2>
          <div className="space-y-3">
            {pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{approval.type}</p>
                  <p className="text-xs text-gray-600">{approval.employee}</p>
                  <p className="mt-1 text-xs text-gray-500">{approval.date}</p>
                </div>
                <button className="btn btn-outline text-sm">Review</button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => navigate('/assistant')}
            className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500 text-white">
              <HiSparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">AI Assistant</p>
              <p className="text-xs text-gray-600">Get help with team management</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/documents')}
            className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-500 text-white">
              <FiFileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Team Documents</p>
              <p className="text-xs text-gray-600">View team-related documents</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Employee Dashboard Component
// VISIBLE_TO: ['EMPLOYEE']
const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const personalStats = [
    {
      id: 1,
      name: 'My Documents',
      value: '8',
      change: '+2',
      icon: FiFileText,
      color: 'bg-primary-500',
    },
    {
      id: 2,
      name: 'Pending Requests',
      value: '2',
      change: 'Active',
      icon: FiClock,
      color: 'bg-orange-500',
    },
    {
      id: 3,
      name: 'Completed',
      value: '6',
      change: 'All',
      icon: FiCheckCircle,
      color: 'bg-green-500',
    },
  ];

  const recentDocuments = [
    {
      id: 1,
      name: 'Employment Certificate',
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: 2,
      name: 'Salary Statement',
      date: '2024-01-10',
      status: 'completed',
    },
    {
      id: 3,
      name: 'Leave Request',
      date: '2024-01-08',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 p-8 text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold">Welcome, {user?.name}! 👋</h1>
        <p className="mt-2 text-primary-100">
          Your personal HR dashboard
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        {personalStats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card group hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 flex items-center text-sm text-green-600">
                  <FiTrendingUp className="mr-1 h-4 w-4" />
                  {stat.change}
                </p>
              </div>
              <div className={`rounded-xl ${stat.color} p-3 text-white transition-transform group-hover:scale-110`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent documents and request form */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Documents */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Documents</h2>
          <div className="space-y-3">
            {recentDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-600">{doc.date}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    doc.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/documents')}
            className="mt-4 btn btn-outline w-full"
          >
            View All Documents
          </button>
        </motion.div>

        {/* Request Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Request New Document</h2>
          <p className="mb-4 text-sm text-gray-600">
            Request a new document or certificate from HR
          </p>
          <div className="space-y-3">
            <select className="input w-full">
              <option>Select document type</option>
              <option>Employment Certificate</option>
              <option>Salary Statement</option>
              <option>Leave Request</option>
              <option>Other</option>
            </select>
            <textarea
              className="input w-full"
              rows={3}
              placeholder="Additional notes (optional)"
            />
            <button className="btn btn-primary w-full">
              Submit Request
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => navigate('/assistant')}
            className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500 text-white">
              <HiSparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Ask AI Assistant</p>
              <p className="text-xs text-gray-600">Get help with HR questions</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/documents')}
            className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-500 text-white">
              <FiFileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">My Documents</p>
              <p className="text-xs text-gray-600">View all your documents</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Main Dashboard Component with Role-Based Rendering
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Role-based dashboard rendering
  // RENDER_IF: user.role === 'ADMIN'
  if (user?.role === UserRole.ADMIN) {
    return <AdminDashboard />;
  }

  // RENDER_IF: user.role === 'HR'
  if (user?.role === UserRole.HR) {
    return <HRDashboard />;
  }

  // RENDER_IF: user.role === 'MANAGER'
  if (user?.role === UserRole.MANAGER) {
    return <ManagerDashboard />;
  }

  // RENDER_IF: user.role === 'EMPLOYEE'
  if (user?.role === UserRole.EMPLOYEE) {
    return <EmployeeDashboard />;
  }

  // Fallback for unknown roles
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">Loading dashboard...</h2>
        <p className="mt-2 text-sm text-gray-600">Please wait while we load your dashboard</p>
      </div>
    </div>
  );
};

export default Dashboard;
