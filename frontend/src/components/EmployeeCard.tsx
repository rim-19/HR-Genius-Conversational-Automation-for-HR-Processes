import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMoreVertical } from 'react-icons/fi';

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

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card group relative overflow-hidden"
    >
      {/* Status badge */}
      <div className="absolute right-4 top-4">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            employee.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {employee.status || 'active'}
        </span>
      </div>

      {/* Employee info */}
      <div className="flex items-start space-x-4">
        <img
          src={
            employee.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=0ea5e9&color=fff`
          }
          alt={employee.name}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
          <p className="text-sm text-gray-600">{employee.position}</p>
          <p className="text-xs text-gray-500">{employee.department}</p>
        </div>
      </div>

      {/* Contact info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FiMail className="h-4 w-4" />
          <span>{employee.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FiPhone className="h-4 w-4" />
          <span>{employee.phone}</span>
        </div>
      </div>

      {/* Actions menu */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <FiMoreVertical className="h-5 w-5" />
        </button>

        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-full right-0 mb-2 w-32 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <button
              onClick={() => {
                setShowMenu(false);
                onEdit?.(employee);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                onDelete?.(employee.id);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EmployeeCard;