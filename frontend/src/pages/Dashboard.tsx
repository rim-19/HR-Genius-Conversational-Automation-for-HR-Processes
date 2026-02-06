import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiFileText, FiTrendingUp, FiActivity, FiUser, FiCheckCircle, FiClock, FiSettings } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { UserRole } from '../utils/roles';
import { dashboardAPI, documentsAPI } from '../services/api';

import DashboardCharts from '../components/DashboardCharts';
import ActivityFeed from '../components/ActivityFeed';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        setStatsData(response.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      id: 1,
      name: 'Total Users',
      value: statsData?.totalUsers || '0',
      change: statsData?.changes?.users || '+0',
      icon: FiUsers,
      color: 'bg-purple-500',
      description: 'System users across all roles',
    },
    {
      id: 2,
      name: 'Total Employees',
      value: statsData?.totalEmployees || '0',
      change: statsData?.changes?.employees || '+0',
      icon: FiUser,
      color: 'bg-blue-500',
      description: 'Registered employees',
    },
    {
      id: 3,
      name: 'Total Documents',
      value: statsData?.totalDocuments || '0',
      change: statsData?.changes?.documents || '+0',
      icon: FiFileText,
      color: 'bg-secondary-500',
      description: 'All system documents',
    },
    {
      id: 4,
      name: 'System Health',
      value: statsData?.systemHealth || '100%',
      change: 'Stable',
      icon: FiActivity,
      color: 'bg-green-500',
      description: 'Uptime and performance',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl bg-gradient-to-r from-purple-600 to-primary-600 p-8 text-white shadow-xl glass"
      >
        <h1 className="text-3xl font-bold">Admin Central</h1>
        <p className="mt-2 text-purple-100 opacity-90">
          Executive system oversight and real-time governance
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card glass group hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className="mt-2 flex items-center text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full w-fit">
                  <FiTrendingUp className="mr-1" />
                  {stat.change} today
                </div>
              </div>
              <div className={`rounded-2xl ${stat.color} p-4 text-white shadow-lg shadow-${stat.color.split('-')[1]}/20 group-hover:rotate-12 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCharts />
          <div className="grid gap-6 sm:grid-cols-2">
            <motion.div className="card glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">System Controls</h3>
              <div className="space-y-2">
                <button onClick={() => navigate('/settings')} className="btn btn-outline w-full justify-start space-x-2">
                  <FiSettings /> <span>Global Configuration</span>
                </button>
                <button onClick={() => navigate('/employees')} className="btn btn-outline w-full justify-start space-x-2">
                  <FiUsers /> <span>Auditors & Roles</span>
                </button>
              </div>
            </motion.div>
            <motion.div className="card glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">AI Capabilities</h3>
              <div className="space-y-2">
                <button onClick={() => navigate('/assistant')} className="btn btn-primary w-full justify-start space-x-2">
                  <HiSparkles /> <span>Launch AI Workspace</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

/**
 * Composant HRDashboard - Tableau de bord pour les RH
 * 
 * Ce dashboard est visible uniquement aux utilisateurs avec le rôle HR.
 * Il affiche:
 * - Statistiques RH (employés, documents générés, interactions IA)
 * - Activités récentes
 * - Actions rapides pour les tâches HR courantes
 * 
 * VISIBLE_TO: ['HR']
 */

const HRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      id: 1,
      name: 'Total Employees',
      value: stats?.totalEmployees || '0',
      change: stats?.changes?.employees || '+0',
      icon: FiUsers,
      color: 'bg-primary-500',
    },
    {
      id: 2,
      name: 'Documents Generated',
      value: stats?.totalDocuments || '0',
      change: stats?.changes?.documents || '+0',
      icon: FiFileText,
      color: 'bg-secondary-500',
    },
    {
      id: 4,
      name: 'System Health',
      value: stats?.systemHealth || '100%',
      change: 'Stable',
      icon: FiActivity,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white shadow-xl glass"
      >
        <h1 className="text-3xl font-bold">HR Workspace</h1>
        <p className="mt-2 text-primary-100 opacity-90">
          Streamline human resources and document automation
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card glass group hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className="mt-2 flex items-center text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full w-fit">
                  <FiTrendingUp className="mr-1" />
                  {stat.change}
                </div>
              </div>
              <div className={`rounded-2xl ${stat.color} p-4 text-white shadow-lg shadow-${stat.color.split('-')[1]}/20 group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <DashboardCharts />
          <div className="card glass">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => navigate('/documents')}
                className="flex items-center space-x-3 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-left transition-all hover:bg-secondary-50 hover:border-secondary-200 dark:hover:bg-secondary-900/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-500 text-white shadow-md">
                  <FiFileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Create Document</p>
                  <p className="text-xs text-gray-500">Fast PDF generation</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/employees')}
                className="flex items-center space-x-3 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-left transition-all hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white shadow-md">
                  <FiUsers className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Directory</p>
                  <p className="text-xs text-gray-500">Manage all staff</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Composant ManagerDashboard - Tableau de bord pour les managers
 * 
 * Ce dashboard est visible uniquement aux utilisateurs avec le rôle MANAGER.
 * Il affiche:
 * - Statistiques de l'équipe (membres, documents, approbations en attente)
 * - Liste des approbations en attente
 * - Vue de l'équipe
 * - Actions rapides pour la gestion d'équipe
 * 
 * VISIBLE_TO: ['MANAGER']
 */
const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        setStatsData(response.data);
      } catch (error) {
        console.error("Error fetching manager stats:", error);
      }
    };
    fetchStats();
  }, []);

  const teamStats = [
    {
      id: 1,
      name: 'Team Members',
      value: statsData?.totalEmployees || '0',
      change: statsData?.changes?.employees || '+0',
      icon: FiUsers,
      color: 'bg-primary-500',
    },
    {
      id: 2,
      name: 'Real-time sync',
      value: 'Active',
      change: 'Online',
      icon: FiActivity,
      color: 'bg-green-500',
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'Employment Letter',
      employee: 'Sarah Jenkins',
      date: 'Requested today',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl bg-gradient-to-r from-green-600 to-primary-600 p-8 text-white shadow-xl glass"
      >
        <h1 className="text-3xl font-bold">Manager Hub</h1>
        <p className="mt-2 text-green-100 opacity-90">
          Executive team oversight and operational management
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
        {teamStats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card glass group hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className="mt-2 flex items-center text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full w-fit">
                  <FiTrendingUp className="mr-1" />
                  {stat.change}
                </div>
              </div>
              <div className={`rounded-2xl ${stat.color} p-4 text-white shadow-lg shadow-${stat.color.split('-')[1]}/20 group-hover:rotate-12 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card glass">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Requests</h2>
              <span className="text-xs bg-primary-100 text-primary-700 font-bold px-2 py-1 rounded">2 NEW</span>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-xl">
                      <FiFileText className="text-secondary-500 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{approval.type}</p>
                      <p className="text-xs text-gray-500">{approval.employee} • {approval.date}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700 transition-colors">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card glass">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Quick Management</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <button onClick={() => navigate('/employees')} className="flex items-center space-x-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all">
                <div className="p-2 bg-primary-500 text-white rounded-lg"><FiUsers /></div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">My Team</p>
                  <p className="text-[10px] text-gray-500">View roster</p>
                </div>
              </button>
              <button onClick={() => navigate('/assistant')} className="flex items-center space-x-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-secondary-50 dark:hover:bg-secondary-900/10 transition-all">
                <div className="p-2 bg-secondary-500 text-white rounded-lg"><HiSparkles /></div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Ask AI</p>
                  <p className="text-[10px] text-gray-500">Manager assist</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

/**
 * Composant EmployeeDashboard - Tableau de bord pour les employés
 * 
 * Ce dashboard est visible uniquement aux utilisateurs avec le rôle EMPLOYEE.
 * Il affiche:
 * - Statistiques personnelles (documents, demandes en attente, complétés)
 * - Documents récents
 * - Formulaire de demande de document
 * - Actions rapides pour les tâches personnelles
 * 
 * VISIBLE_TO: ['EMPLOYEE']
 */
const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statsData, setStatsData] = React.useState<any>(null);
  const [recentDocs, setRecentDocs] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await dashboardAPI.getStats();
        setStatsData(statsRes.data);
        const docsRes = await documentsAPI.getAll();
        setRecentDocs(docsRes.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchData();
  }, []);

  const personalStats = [
    {
      id: 1,
      name: 'My Documents',
      value: statsData?.totalDocuments || '0',
      change: statsData?.changes?.documents || '+0',
      icon: FiFileText,
      color: 'bg-primary-500',
    },
    {
      id: 2,
      name: 'System Status',
      value: 'Online',
      change: 'Active',
      icon: FiActivity,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white shadow-xl glass"
      >
        <h1 className="text-3xl font-bold">Welcome, {user?.name}! 👋</h1>
        <p className="mt-2 text-primary-100 opacity-90">
          Your personal HR workspace and document hub
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
        {personalStats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card glass group hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className="mt-2 flex items-center text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full w-fit">
                  <FiTrendingUp className="mr-1" />
                  {stat.change}
                </div>
              </div>
              <div className={`rounded-2xl ${stat.color} p-4 text-white shadow-lg shadow-${stat.color.split('-')[1]}/20 group-hover:rotate-12 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card glass"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Documents</h2>
            <button
              onClick={() => navigate('/documents')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentDocs.map((doc: any) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <FiFileText className="text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{doc.title}</p>
                    <p className="text-xs text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="inline-flex rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-800 dark:text-green-400">
                  Ready
                </span>
              </div>
            ))}
            {recentDocs.length === 0 && (
              <p className="text-center py-8 text-sm text-gray-500 italic">No recent documents</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card glass"
        >
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Request Document</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type</label>
              <select className="input w-full">
                <option>Employment Certificate</option>
                <option>Salary Statement</option>
                <option>Internship Validation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Notes</label>
              <textarea
                className="input w-full"
                rows={2}
                placeholder="Reason for request..."
              />
            </div>
            <button className="btn btn-primary w-full py-3 shadow-lg shadow-primary-500/20">
              Submit Request
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card glass"
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => navigate('/assistant')}
            className="flex items-center space-x-4 rounded-xl border border-gray-100 dark:border-gray-800 p-4 transition-all hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:border-primary-200"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/20">
              <HiSparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">AI Assistant</p>
              <p className="text-xs text-gray-500">24/7 Smart support</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/documents')}
            className="flex items-center space-x-4 rounded-xl border border-gray-100 dark:border-gray-800 p-4 transition-all hover:bg-secondary-50 dark:hover:bg-secondary-900/10 hover:border-secondary-200"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-500 text-white shadow-lg shadow-secondary-500/20">
              <FiFileText className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">File Hub</p>
              <p className="text-xs text-gray-500">Your document library</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Composant Dashboard - Composant principal avec rendu basé sur le rôle
 * 
 * Ce composant agit comme un routeur qui affiche le dashboard approprié
 * selon le rôle de l'utilisateur connecté.
 * 
 * Logique de rendu:
 * - ADMIN → AdminDashboard
 * - HR → HRDashboard
 * - MANAGER → ManagerDashboard
 * - EMPLOYEE → EmployeeDashboard
 * - Rôle inconnu ou chargement → Message de chargement
 * 
 * Chaque dashboard est personnalisé pour afficher les informations
 * et fonctionnalités pertinentes pour chaque type d'utilisateur.
 */
const Dashboard: React.FC = () => {
  // Récupération des informations de l'utilisateur connecté
  const { user } = useAuth();

  // 
  // Rendu conditionnel basé sur le rôle de l'utilisateur
  // Chaque rôle voit un dashboard différent adapté à ses besoins
  //

  // Rendu du dashboard Admin si l'utilisateur est ADMIN
  if (user?.role === UserRole.ADMIN) {
    return <AdminDashboard />;
  }

  // Rendu du dashboard HR si l'utilisateur est HR
  if (user?.role === UserRole.HR) {
    return <HRDashboard />;
  }

  // Rendu du dashboard Manager si l'utilisateur est MANAGER
  if (user?.role === UserRole.MANAGER) {
    return <ManagerDashboard />;
  }

  // Rendu du dashboard Employee si l'utilisateur est EMPLOYEE
  if (user?.role === UserRole.EMPLOYEE) {
    return <EmployeeDashboard />;
  }

  // 
  // État de chargement ou fallback pour les rôles inconnus
  // Affiché pendant le chargement des informations utilisateur
  // ou si le rôle n'est pas reconnu
  //
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
