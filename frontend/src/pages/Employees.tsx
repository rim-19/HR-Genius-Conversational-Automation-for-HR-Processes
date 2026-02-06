import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EmployeeCard from "../components/EmployeeCard";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../utils/roles";
import { employeesAPI } from "../services/api";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  avatar?: string;
  status?: "active" | "inactive";
}

const Employees: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]); // Changed to any[] as per instruction
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // New state
  const [editingEmployee, setEditingEmployee] = useState<any>(null); // New state

  const canManageEmployees =
    user?.role === UserRole.HR || user?.role === UserRole.ADMIN;

  const isManager = user?.role === UserRole.MANAGER;

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await employeesAPI.getAll(currentPage, 6); // 6 per page for good layout
      setEmployees(response.data.employees);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (employee: Employee) => {
    toast.info(`Edit form for ${employee.name} should go here`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await employeesAPI.delete(id);
      toast.success("Employee deleted");
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  return (
    <div className="space-y-6">
      {/* 
        En-tête de la page avec titre et bouton d'ajout
        - Animation d'entrée depuis le haut
        - Titre change selon le rôle (Manager: "My Team", Autres: "Employees")
      */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          {/* 
            Titre conditionnel selon le rôle
            - Managers voient "My Team"
            - Autres voient "Employees"
          */}
          <h1 className="text-2xl font-bold text-gray-900">
            {isManager ? "My Team" : "Employees"}
          </h1>
          {/* Description qui change selon le rôle */}
          <p className="text-sm text-gray-600">
            {isManager
              ? "View your team members and their information"
              : "Manage your team members and their information"}
          </p>
        </div>
        {/* 
          Bouton d'ajout d'employé - Visible uniquement pour ADMIN et HR
          - Ouvre la modale d'ajout d'employé
        */}
        {canManageEmployees && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FiPlus className="h-5 w-5" />
            <span>Add Employee</span>
          </button>
        )}
      </motion.div>

      {/* 
        Zone de recherche et filtres
        - Animation avec délai de 0.1s
        - Champ de recherche avec icône
        - Bouton de filtres (à implémenter)
      */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card flex items-center space-x-4"
      >
        {/* 
          Champ de recherche
          - relative: pour positionner l'icône de recherche
          - flex-1: prend tout l'espace disponible
        */}
        <div className="relative flex-1">
          {/* Icône de recherche positionnée à gauche */}
          <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          {/* 
            Champ de saisie de recherche
            - value: valeur contrôlée par searchQuery
            - onChange: met à jour searchQuery à chaque frappe
            - pl-10: padding gauche pour laisser place à l'icône
          */}
          <input
            type="text"
            placeholder="Search employees by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full pl-10"
          />
        </div>
        {/* 
          Bouton de filtres (à implémenter)
          - TODO: Ouvrir une modale avec des options de filtrage
        */}
        <button className="btn btn-outline flex items-center space-x-2">
          <FiFilter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </motion.div>

      {/* 
        Compteur d'employés affichés
        - Animation avec délai de 0.2s
        - Affiche le nombre d'employés filtrés sur le total
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">{filteredEmployees.length}</span> of{" "}
          <span className="font-semibold">{employees.length}</span> employees
        </p>
      </motion.div>

      {/* Employee Grid or Empty State */}
      {filteredEmployees.length > 0 ? (
        <>
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
                  onEdit={canManageEmployees ? handleEdit : undefined}
                  onDelete={canManageEmployees ? handleDelete : undefined}
                />
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-outline"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-outline"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`btn btn-outline ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                        ? "bg-primary-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`btn btn-outline ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card py-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FiSearch className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No employees found
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Try adjusting your search query or filters
          </p>
        </motion.div>
      )}

      {/* 
        Modale d'ajout d'employé (placeholder)
        - Affichée conditionnellement selon showAddModal
        - fixed inset-0: prend toute la fenêtre
        - z-50: z-index très élevé pour être au-dessus de tout
        - bg-black bg-opacity-50: fond noir semi-transparent (overlay)
      */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            {/* 
              Contenu de la modale avec animation d'entrée
              - max-w-md: largeur maximale de 28rem (448px)
              - rounded-xl: coins très arrondis
              - shadow-xl: ombre importante
            */}
            {/* Titre de la modale */}
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Add New Employee
            </h2>
            {/* 
              Message d'information
              TODO: Implémenter un formulaire complet d'ajout d'employé
            */}
            <p className="mb-4 text-sm text-gray-600">
              This is a placeholder modal. Connect to backend API to add
              employees.
            </p>
            {/* Boutons d'action */}
            <div className="flex justify-end space-x-2">
              {/* Bouton d'annulation */}
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              {/* 
                Bouton d'ajout (simulation)
                TODO: Implémenter l'appel API POST /api/employees
              */}
              <button
                onClick={() => {
                  toast.success("Employee added! (Demo)");
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
