import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notificationsAPI } from '../services/api';
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
interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  // Récupération des données de l'utilisateur et de la fonction de déconnexion
  const { user, logout } = useAuth();

  // Thème actuel (clair/sombre) et fonction pour basculer
  const { theme, toggleTheme } = useTheme();

  // État pour contrôler l'affichage du menu déroulant utilisateur
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Notifications
  const [notifs, setNotifs] = React.useState<any[]>([]);
  const [unread, setUnread] = React.useState(0);
  const [showNotif, setShowNotif] = React.useState(false);

  const loadNotifs = React.useCallback(async () => {
    try {
      const res = await notificationsAPI.list();
      setNotifs(res.data.items || []);
      setUnread(res.data.unread || 0);
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    loadNotifs();
    const id = setInterval(loadNotifs, 30000);
    return () => clearInterval(id);
  }, [loadNotifs]);

  const toggleNotif = async () => {
    const next = !showNotif;
    setShowNotif(next);
    if (next && unread > 0) {
      try {
        await notificationsAPI.markAllRead();
        setUnread(0);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <nav className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* 
        Zone de recherche - Côté gauche
        - flex flex-1: prend tout l'espace disponible
        - items-center: centre verticalement
      */}
      <div className="flex flex-1 items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden p-2 text-gray-600 dark:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        )}
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const query = (e.target as HTMLInputElement).value;
                if (query.trim()) {
                  window.location.href = `/employees?search=${query}`;
                }
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* 
        Zone droite - Notifications et menu utilisateur
        - flex items-center: aligne les éléments horizontalement
        - space-x-4: espacement horizontal de 16px entre les éléments
      */}
      <div className="flex items-center space-x-4">
        {/*
          Bouton de bascule du thème (mode nuit)
          - Affiche une lune en mode clair, un soleil en mode sombre
          - aria-label pour l'accessibilité
        */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          {theme === 'dark' ? (
            <FiSun className="h-5 w-5" />
          ) : (
            <FiMoon className="h-5 w-5" />
          )}
        </button>

        {/*
          Bouton de notifications
          - relative: pour positionner l'indicateur de notification
          - rounded-lg: coins arrondis
          - transition-colors: transition fluide des couleurs au hover
        */}
        <div className="relative">
          <button
            onClick={toggleNotif}
            className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <FiBell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary-500 px-1 text-[10px] font-bold text-white">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700">
              <div className="border-b border-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                Notifications
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifs.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">You're all caught up.</p>
                ) : (
                  notifs.map((n) => (
                    <div key={n.id} className={`border-b border-gray-50 px-4 py-3 text-sm dark:border-gray-700/50 ${n.read ? '' : 'bg-primary-50/40 dark:bg-primary-900/10'}`}>
                      <p className="text-gray-800 dark:text-gray-200">{n.message}</p>
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
            className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
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
            <FiChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
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
              className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700"
            >
              {/* 
                Bouton pour accéder aux paramètres du profil
                - block w-full: prend toute la largeur
                - text-left: alignement du texte à gauche
                - hover:bg-gray-100: fond gris au survol
              */}


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
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
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
