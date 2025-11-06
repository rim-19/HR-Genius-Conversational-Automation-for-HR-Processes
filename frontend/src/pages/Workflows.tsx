import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiSettings, FiActivity } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { toast } from 'react-toastify';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  executions: number;
  lastRun?: Date;
}

const Workflows: React.FC = () => {
  // Mock workflows data
  // TODO: integrate n8n workflow trigger
  const [workflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Employee Onboarding',
      description: 'Automated workflow for new employee onboarding process',
      status: 'active',
      executions: 45,
      lastRun: new Date('2024-01-15T10:30:00'),
    },
    {
      id: '2',
      name: 'Salary Update Notification',
      description: 'Send automated notifications when salary updates are processed',
      status: 'active',
      executions: 128,
      lastRun: new Date('2024-01-14T15:45:00'),
    },
    {
      id: '3',
      name: 'Document Generation',
      description: 'Automatically generate and send employee certificates',
      status: 'active',
      executions: 89,
      lastRun: new Date('2024-01-13T09:20:00'),
    },
    {
      id: '4',
      name: 'Performance Review Reminder',
      description: 'Send reminders for upcoming performance reviews',
      status: 'inactive',
      executions: 34,
      lastRun: new Date('2024-01-10T14:00:00'),
    },
  ]);

  const handleTrigger = (workflow: Workflow) => {
    toast.info(`Triggering workflow: ${workflow.name} - Connect to n8n backend`);
  };

  const handleToggleStatus = (workflow: Workflow) => {
    const newStatus = workflow.status === 'active' ? 'inactive' : 'active';
    toast.success(`Workflow ${workflow.name} set to ${newStatus}`);
  };

  const handleConfigure = (workflow: Workflow) => {
    toast.info(`Configure ${workflow.name} - Connect to n8n backend`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-purple-500 to-primary-500 p-8 text-white shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <HiSparkles className="h-10 w-10" />
          <div>
            <h1 className="text-3xl font-bold">Automation Workflows</h1>
            <p className="mt-2 text-purple-100">
              Manage and monitor your automated HR processes powered by n8n
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workflows</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {workflows.filter((w) => w.status === 'active').length}
              </p>
            </div>
            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <FiActivity className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Executions</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {workflows.reduce((sum, w) => sum + w.executions, 0)}
              </p>
            </div>
            <div className="rounded-xl bg-primary-100 p-3 text-primary-600">
              <HiSparkles className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Workflows</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {workflows.filter((w) => w.status === 'inactive').length}
              </p>
            </div>
            <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
              <FiPause className="h-6 w-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Workflows list */}
      <div className="space-y-4">
        {workflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      workflow.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {workflow.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{workflow.description}</p>
                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FiActivity className="h-4 w-4" />
                    <span>{workflow.executions} executions</span>
                  </div>
                  {workflow.lastRun && (
                    <div>
                      Last run: {workflow.lastRun.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTrigger(workflow)}
                  disabled={workflow.status === 'inactive'}
                  className="btn btn-primary flex items-center space-x-2 disabled:opacity-50"
                  title="Trigger workflow"
                >
                  <FiPlay className="h-4 w-4" />
                  <span>Run</span>
                </button>
                <button
                  onClick={() => handleToggleStatus(workflow)}
                  className={`btn flex items-center space-x-2 ${
                    workflow.status === 'active'
                      ? 'btn-outline text-orange-600 hover:bg-orange-50'
                      : 'btn-outline text-green-600 hover:bg-green-50'
                  }`}
                  title={workflow.status === 'active' ? 'Pause workflow' : 'Activate workflow'}
                >
                  {workflow.status === 'active' ? (
                    <FiPause className="h-4 w-4" />
                  ) : (
                    <FiPlay className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => handleConfigure(workflow)}
                  className="btn btn-outline"
                  title="Configure workflow"
                >
                  <FiSettings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card border-2 border-dashed border-primary-300 bg-primary-50"
      >
        <div className="flex items-start space-x-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white">
            <HiSparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Powered by n8n</h3>
            <p className="mt-1 text-sm text-gray-600">
              These workflows are powered by n8n automation platform. Connect your n8n instance to
              enable real-time workflow execution and monitoring.
            </p>
            <button className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700">
              Learn more about n8n integration →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Workflows;