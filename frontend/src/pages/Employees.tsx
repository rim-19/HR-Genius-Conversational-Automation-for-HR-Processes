import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EmployeeCard from '../components/EmployeeCard';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  avatar?: string;
  status?: 'active' | 'inactive';
}

const Employees: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock employee data
  // TODO: fetch from /api/employees
  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Developer',
      department: 'Engineering',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      phone: '+1 (555) 234-5678',
      position: 'Product Manager',
      department: 'Product',
      status: 'active',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      phone: '+1 (555) 345-6789',
      position: 'UX Designer',
      department: 'Design',
      status: 'active',
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.williams@company.com',
      phone: '+1 (555) 456-7890',
      position: 'Marketing Manager',
      department: 'Marketing',
      status: 'active',
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@company.com',
      phone: '+1 (555) 567-8901',
      position: 'Sales Representative',
      department: 'Sales',
      status: 'inactive',
    },
    {
      id: '6',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      phone: '+1 (555) 678-9012',
      position: 'HR Specialist',
      department: 'Human Resources',
      status: 'active',
    },
  ]);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (employee: Employee) => {
    toast.info(`Edit functionality for ${employee.name} - Connect to backend`);
  };

  const handleDelete = (id: string) => {
    toast.error(`Delete functionality for employee ${id} - Connect to backend`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-600">Manage your team members and their information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FiPlus className="h-5 w-5" />
          <span>Add Employee</span>
        </button>
      </motion.div>

      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card flex items-center space-x-4"
      >
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full pl-10"
          />
        </div>
        <button className="btn btn-outline flex items-center space-x-2">
          <FiFilter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </motion.div>

      {/* Employee count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredEmployees.length}</span> of{' '}
          <span className="font-semibold">{employees.length}</span> employees
        </p>
      </motion.div>

      {/* Employees grid */}
      {filteredEmployees.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <EmployeeCard
                employee={employee}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card py-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FiSearch className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No employees found</h3>
          <p className="mt-1 text-sm text-gray-600">
            Try adjusting your search query or filters
          </p>
        </motion.div>
      )}

      {/* Add employee modal placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Add New Employee</h2>
            <p className="mb-4 text-sm text-gray-600">
              This is a placeholder modal. Connect to backend API to add employees.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Employee added! (Demo)');
                  setShowAddModal(false);
                }}
                className="btn btn-primary"
              >
                Add Employee
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Employees;