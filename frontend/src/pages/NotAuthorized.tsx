import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShield, FiArrowLeft } from "react-icons/fi";

const NotAuthorized: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[60vh] flex-col items-center justify-center text-center"
    >
      <div className="rounded-2xl bg-white p-10 shadow-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100"
        >
          <FiShield className="h-10 w-10 text-red-600" />
        </motion.div>
        <h1 className="text-2xl font-semibold text-gray-900">
          You are not authorized to view this page
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Please check with your administrator if you believe this is an error.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center space-x-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Go back to Dashboard</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotAuthorized;
