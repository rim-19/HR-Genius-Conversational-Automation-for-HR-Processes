import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiMessageSquare,
  FiUsers,
  FiFileText,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../utils/roles';

/**
 * Composant Sidebar - Barre latérale de navigation
 * 
 * Ce composant affiche le menu de navigation principal avec:
 * - Logo et nom de l'application
 * - Menu de navigation avec icônes
 * - Filtrage des éléments de menu basé sur le rôle de l'utilisateur
 * - Fonctionnalité de réduction/expansion de la sidebar
 * 
 * Les éléments du menu sont filtrés selon les permissions de l'utilisateur connecté.
 */
const Sidebar: React.FC = () => {
  // État pour contrôler si la sidebar est réduite ou non
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Récupération des informations de l'utilisateur connecté via le contexte d'authentification
  const { user } = useAuth();

  /**
   * Configuration complète des éléments du menu avec contrôle d'accès par rôle
   * 
   * Chaque élément contient:
   * - path: route vers la page
   * - icon: composant d'icône React Icons
   * - label: texte affiché dans le menu
   * - roles: tableau des rôles autorisés à voir cet élément
   */
  const allMenuItems = [
    {
      path: '/dashboard',
      icon: FiHome,
      label: 'Dashboard',
      roles: [
        UserRole.ADMIN,
        UserRole.HR,
        UserRole.MANAGER,
        UserRole.EMPLOYEE,
      ],
    },
    {
      path: '/assistant',
      icon: FiMessageSquare,
      label: 'AI Assistant',
      roles: [
        UserRole.ADMIN,
        UserRole.HR,
        UserRole.MANAGER,
        UserRole.EMPLOYEE,
      ],
    },
    {
      path: '/employees',
      icon: FiUsers,
      label: 'Employees',
      roles: [UserRole.ADMIN, UserRole.HR, UserRole.MANAGER],
    },
    {
      path: '/documents',
      icon: FiFileText,
      label: 'Documents',
      roles: [
        UserRole.ADMIN,
        UserRole.HR,
        UserRole.MANAGER,
        UserRole.EMPLOYEE,
      ],
    },
    {
      path: '/settings',
      icon: FiSettings,
      label: 'Settings',
      roles: [UserRole.ADMIN],
    },
  ];

  /**
   * Filtrage des éléments du menu selon le rôle de l'utilisateur
   * Seuls les éléments dont le tableau "roles" contient le rôle de l'utilisateur sont affichés
   */
  const menuItems = allMenuItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    /* 
      Container principal de la sidebar avec animation de largeur
      - motion.aside: composant animé de Framer Motion
      - animate: largeur change entre 80px (réduit) et 256px (étendu)
      - border-r: bordure droite pour séparer de la zone de contenu
      - shadow-sm: ombre légère pour la profondeur
    */
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="relative flex flex-col border-r border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm"
    >
      {/* 
        En-tête avec logo et nom de l'application
        - h-16: hauteur fixe de 64px (4rem)
        - border-b: bordure inférieure pour séparer du menu
      */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {/* 
          Affichage conditionnel selon l'état collapsed:
          - Si non réduit: affiche le logo + nom + description
          - Si réduit: affiche seulement l'icône du logo centré
        */}
        {!isCollapsed ? (
          /* Logo complet avec nom et description */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
              <HiSparkles className="h-6 w-6 text-white" />
            </div>
            {/* Nom et description de l'application */}
            <div>
              <h1 className="text-lg font-bold text-gray-900">HR-Genius</h1>
              <p className="text-xs text-gray-500">AI Assistant</p>
            </div>
          </motion.div>
        ) : (
          /* Logo réduit (icône seule) */
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
            <HiSparkles className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      {/* 
        Zone de navigation principale
        - flex-1: prend tout l'espace vertical disponible
        - space-y-1: espacement vertical entre les éléments de menu
        - p-4: padding de 16px
      */}
      <nav className="flex-1 space-y-1 p-4">
        {/* 
          Parcours de tous les éléments de menu autorisés pour l'utilisateur
          Chaque élément est animé avec un délai progressif pour un effet d'apparition en cascade
        */}
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            {/* 
              Lien de navigation vers la page correspondante
              - NavLink: composant React Router qui ajoute la classe "active" si la route correspond
              - isActive: fonction qui reçoit l'état actif et retourne les classes CSS appropriées
            */}
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm' // Style pour la page active
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Style pour les pages inactives
                }`
              }
            >
              {/* Icône de l'élément de menu */}
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {/* Label visible seulement si la sidebar n'est pas réduite */}
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* 
        Bouton pour réduire/étendre la sidebar
        - absolute: positionné de manière absolue par rapport au parent
        - -right-3: positionné à 12px à droite du conteneur (dépasse légèrement)
        - top-20: positionné à 80px du haut
      */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100"
      >
        {/* 
          Affichage conditionnel de l'icône selon l'état:
          - Si réduit: flèche vers la droite (pour étendre)
          - Si étendu: flèche vers la gauche (pour réduire)
        */}
        {isCollapsed ? (
          <FiChevronRight className="h-4 w-4" />
        ) : (
          <FiChevronLeft className="h-4 w-4" />
        )}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
