import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiBell, FiSearch, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ROLE_DISPLAY_NAMES, ROLE_BADGE_COLORS } from '../utils/roles';

/**
 * Composant Navbar - Barre de navigation supérieure
 * 
 * Ce composant affiche la barre de navigation en haut de la page avec:
 * - Barre de recherche pour rechercher des employés, documents, etc.
 * - Bouton de notifications avec indicateur de nouvelles notifications
 * - Menu utilisateur avec avatar, nom, rôle et email
 * - Dropdown pour accéder au profil et se déconnecter
 * 
 * La navbar reste fixe en haut lors du scroll grâce à "sticky"
 */
const Navbar: React.FC = () => {
  // Récupération des données de l'utilisateur et de la fonction de déconnexion
  const { user, logout } = useAuth();

  // État pour contrôler l'affichage du menu déroulant utilisateur
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isDark, setIsDark] = React.useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hr_genius_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hr_genius_theme', 'light');
    }
  };

  return (
    <nav className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 px-6 shadow-sm">
      {/* 
        Zone de recherche - Côté gauche
        - flex flex-1: prend tout l'espace disponible
        - items-center: centre verticalement
      */}
      <div className="flex flex-1 items-center">
        {/* Container relatif pour positionner l'icône de recherche */}
        <div className="relative w-full max-w-md">
          {/* 
            Icône de recherche positionnée absolument dans le champ de recherche
            - absolute left-3: positionné à 12px de la gauche
            - top-1/2 -translate-y-1/2: centré verticalement
          */}
          <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          {/* 
            Champ de recherche
            - pl-10: padding gauche pour laisser place à l'icône
            - focus:border-primary-500: bordure primaire au focus
            - focus:ring-2: ring de focus pour l'accessibilité
          */}
          <input
            type="text"
            placeholder="Search employees, documents..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* 
        Zone droite - Notifications et menu utilisateur
        - flex items-center: aligne les éléments horizontalement
        - space-x-4: espacement horizontal de 16px entre les éléments
      */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Toggle Dark Mode"
        >
          {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
        </button>
        {/* 
          Bouton de notifications
          - relative: pour positionner l'indicateur de notification
          - rounded-lg: coins arrondis
          - transition-colors: transition fluide des couleurs au hover
        */}
        <button className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
          <FiBell className="h-5 w-5" />
          {/* 
            Indicateur de nouvelles notifications
            - absolute right-1 top-1: positionné en haut à droite
            - h-2 w-2: petit cercle de 8px
            - bg-secondary-500: couleur secondaire
          */}
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-secondary-500"></span>
        </button>

        {/* 
          Menu utilisateur avec dropdown
          - relative: pour positionner le menu déroulant
        */}
        <div className="relative">
          {/* 
            Bouton pour ouvrir/fermer le menu utilisateur
            Affiche l'avatar, le nom, le rôle et l'email de l'utilisateur
          */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            {/* 
              Avatar de l'utilisateur
              - Utilise l'avatar de l'utilisateur ou génère un avatar par défaut via l'API ui-avatars
              - rounded-full: forme circulaire
            */}
            <img
              src={
                user?.avatar ||
                'https://ui-avatars.com/api/?name=User&background=0ea5e9&color=fff'
              }
              alt={user?.name}
              className="h-8 w-8 rounded-full"
            />

            {/* 
              Informations utilisateur (cachées sur petits écrans)
              - hidden md:block: caché sur mobile, visible sur écrans moyens et plus
              - text-left: alignement du texte à gauche
            */}
            <div className="hidden text-left md:block">
              <div className="flex items-center space-x-2">
                {/* Nom de l'utilisateur */}
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>

                {/* 
                  Badge du rôle avec animation
                  - Affiche le nom du rôle avec une couleur correspondante
                  - Animation d'entrée avec Framer Motion
                */}
                {user?.role && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${ROLE_BADGE_COLORS[user.role]}`}
                  >
                    {ROLE_DISPLAY_NAMES[user.role]}
                  </motion.span>
                )}
              </div>
              {/* Email de l'utilisateur */}
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>

            {/* Icône de chevron indiquant qu'il y a un menu déroulant */}
            <FiChevronDown className="h-4 w-4 text-gray-600" />
          </button>

          {/* 
            Menu déroulant - Affiché conditionnellement selon showDropdown
            - Animation d'entrée avec Framer Motion
            - absolute: positionné de manière absolue
            - right-0: aligné à droite
            - shadow-lg: ombre importante pour la profondeur
          */}
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700"
            >
              {/* 
                Bouton pour accéder aux paramètres du profil
                - block w-full: prend toute la largeur
                - text-left: alignement du texte à gauche
                - hover:bg-gray-100: fond gris au survol
              */}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // TODO: navigate to profile later
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile Settings
              </button>

              {/* 
                Bouton de déconnexion
                - text-red-600: couleur rouge pour indiquer une action importante
                - Appelle la fonction logout() du contexte d'authentification
              */}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
