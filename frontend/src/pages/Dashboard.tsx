import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiFileText, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
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
      action: 'Sent internal communication',
      employee: 'All Staff',
      time: '6 hours ago',
    },
    {
      id: 4,
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
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}! 👋</h1>
        <p className="mt-2 text-primary-100">
          Here's what's happening with your HR operations today.
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
              onClick={() => navigate('/assistant')}
              className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500 text-white">
                <HiSparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Ask AI Assistant</p>
                <p className="text-xs text-gray-600">Get instant help with HR tasks</p>
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;