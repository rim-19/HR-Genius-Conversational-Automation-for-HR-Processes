import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiUserPlus, FiFileText, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { dashboardAPI } from '../services/api';

const ActivityFeed: React.FC = () => {
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchActivity = async () => {
        try {
            setIsLoading(true);
            const response = await dashboardAPI.getActivity();
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching activities:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
        // Refresh every minute
        const interval = setInterval(fetchActivity, 60000);
        return () => clearInterval(interval);
    }, []);

    const getIcon = (action: string) => {
        switch (action) {
            case 'create_employee': return <FiUserPlus className="text-green-500" />;
            case 'generate_document': return <FiFileText className="text-blue-500" />;
            case 'update_employee': return <FiRefreshCw className="text-orange-500" />;
            case 'delete_employee': return <FiTrash2 className="text-red-500" />;
            default: return <FiActivity className="text-primary-500" />;
        }
    };

    const formatDescription = (description: string) => {
        try {
            const data = JSON.parse(description);
            if (data.intent === 'create_employee') return `Added new employee ${data.employeeName || ''}`;
            if (data.intent === 'generate_document') return `Generated ${data.documentType || 'document'} for ${data.employeeName || ''}`;
            if (data.intent === 'update_employee') return `Updated details for ${data.employeeName || ''}`;
            return data.intent.replace(/_/g, ' ');
        } catch {
            return description;
        }
    };

    return (
        <div className="card glass">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Live Activity Feed</h3>
                <button
                    onClick={fetchActivity}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                >
                    Refresh
                </button>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading activity...</div>
                ) : activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start space-x-3 border-l-2 border-gray-100 dark:border-gray-700 pl-4 py-1"
                        >
                            <div className="mt-1 rounded-full bg-white dark:bg-gray-800 p-2 shadow-sm border border-gray-100 dark:border-gray-700">
                                {getIcon(activity.action)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {activity.user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {formatDescription(activity.description)}
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">
                                    {new Date(activity.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400 italic">No recent activity</div>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
