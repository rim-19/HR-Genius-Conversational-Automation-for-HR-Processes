import React from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMoreVertical } from "react-icons/fi";

/**
 * Interface définissant la structure d'un employé
 *
 * @property id - Identifiant unique de l'employé
 * @property name - Nom complet de l'employé
 * @property email - Adresse email de l'employé
 * @property phone - Numéro de téléphone de l'employé
 * @property position - Poste/position de l'employé
 * @property department - Département de l'employé
 * @property avatar - URL de l'avatar (optionnel, généré si non fourni)
 * @property status - Statut de l'employé: 'active' (actif) ou 'inactive' (inactif)
 */
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

/**
 * Propriétés du composant EmployeeCard
 *
 * @property employee - Objet employé à afficher dans la carte
 * @property onEdit - Fonction callback optionnelle appelée lors de l'édition (reçoit l'employé)
 * @property onDelete - Fonction callback optionnelle appelée lors de la suppression (reçoit l'ID)
 */
interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
}

/**
 * Composant EmployeeCard - Carte d'affichage d'un employé
 *
 * Ce composant affiche les informations d'un employé dans une carte avec:
 * - Avatar de l'employé (généré automatiquement si non fourni)
 * - Nom, poste et département
 * - Informations de contact (email, téléphone)
 * - Badge de statut (actif/inactif)
 * - Menu d'actions (éditer, supprimer)
 *
 * Les animations Framer Motion sont utilisées pour un rendu fluide.
 */
const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
}) => {
  // État pour contrôler l'affichage du menu d'actions (éditer/supprimer)
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card group relative overflow-hidden"
    >
      {/* 
        Carte d'employé avec animation d'entrée
        - initial: état initial (légèrement transparent et réduit)
        - animate: état animé (opacité et taille normales)
        - card: classe personnalisée pour le style de carte
        - group: permet les effets hover sur les enfants
        - relative: pour positionner les éléments absolus (badge, menu)
        - overflow-hidden: cache le contenu qui dépasse
      */}
      {/* 
        Badge de statut - Positionné en haut à droite
        - absolute right-4 top-4: position absolue dans le coin supérieur droit
        - Couleur conditionnelle: vert pour actif, gris pour inactif
      */}
      <div className="absolute right-4 top-4">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            employee.status === "active"
              ? "bg-green-100 text-green-800" // Style vert pour actif
              : "bg-gray-100 text-gray-800" // Style gris pour inactif
          }`}
        >
          {/* Affiche le statut ou "active" par défaut */}
          {employee.status || "active"}
        </span>
      </div>

      {/* 
        Informations principales de l'employé
        - flex items-start: layout flexible, alignement en haut
        - space-x-4: espacement horizontal de 16px entre avatar et infos
      */}
      <div className="flex items-start space-x-4">
        {/* 
          Avatar de l'employé
          - Utilise l'avatar fourni ou génère un avatar via l'API ui-avatars
          - h-16 w-16: taille de 64px x 64px
          - rounded-full: forme circulaire
          - object-cover: couvre toute la zone en conservant les proportions
        */}
        <img
          src={
            employee.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              employee.name
            )}&background=0ea5e9&color=fff`
          }
          alt={employee.name}
          className="h-16 w-16 rounded-full object-cover"
        />
        {/* 
          Informations textuelles de l'employé
          - flex-1: prend tout l'espace disponible
        */}
        <div className="flex-1">
          {/* Nom de l'employé */}
          <h3 className="text-lg font-semibold text-gray-900">
            {employee.name}
          </h3>
          {/* Poste/Position */}
          <p className="text-sm text-gray-600">{employee.position}</p>
          {/* Département */}
          <p className="text-xs text-gray-500">{employee.department}</p>
        </div>
      </div>

      {/* 
        Informations de contact
        - mt-4: marge supérieure de 16px pour séparer des infos principales
        - space-y-2: espacement vertical de 8px entre les lignes de contact
      */}
      <div className="mt-4 space-y-2">
        {/* Ligne d'email avec icône */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FiMail className="h-4 w-4" />
          <span>{employee.email}</span>
        </div>
        {/* Ligne de téléphone avec icône */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FiPhone className="h-4 w-4" />
          <span>{employee.phone}</span>
        </div>
      </div>

      {/* 
        Menu d'actions - Positionné en bas à droite
        - absolute bottom-4 right-4: position absolue dans le coin inférieur droit
      */}
      <div className="absolute bottom-4 right-4">
        {/* 
          Bouton pour ouvrir/fermer le menu d'actions
          - Affiche trois points verticaux (menu hamburger vertical)
          - hover:bg-gray-100: fond gris au survol
        */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <FiMoreVertical className="h-5 w-5" />
        </button>

        {/* 
          Menu déroulant - Affiché conditionnellement selon showMenu
          - Animation d'entrée avec Framer Motion
          - bottom-full: positionné au-dessus du bouton
          - mb-2: marge inférieure de 8px pour l'espacement
          - shadow-lg: ombre importante pour la profondeur
        */}
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-full right-0 mb-2 w-32 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            {/* 
              Bouton d'édition
              - Appelle la fonction onEdit avec l'employé en paramètre
              - Le ?.() est une vérification optionnelle (appelle seulement si onEdit existe)
            */}
            <button
              onClick={() => {
                setShowMenu(false); // Ferme le menu
                onEdit?.(employee); // Appelle la fonction onEdit si elle existe
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            {/* 
              Bouton de suppression
              - Appelle la fonction onDelete avec l'ID de l'employé
              - text-red-600: couleur rouge pour indiquer une action destructrice
            */}
            <button
              onClick={() => {
                setShowMenu(false); // Ferme le menu
                onDelete?.(employee.id); // Appelle la fonction onDelete si elle existe
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
