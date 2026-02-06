import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

/**
 * Composant MainLayout - Layout principal pour toutes les pages authentifiées
 * 
 * Ce layout structure la page principale avec:
 * - Une barre latérale (Sidebar) pour la navigation
 * - Une barre de navigation en haut (Navbar)
 * - Une zone de contenu principale avec animations de transition
 * 
 * Utilise React Router pour gérer la navigation et afficher le contenu
 * des routes enfants via le composant <Outlet />
 */
const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return localStorage.getItem('hr_genius_theme') === 'dark';
  });

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hr_genius_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hr_genius_theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Barre latérale (Sidebar) - Contient le menu de navigation principal */}
      <Sidebar />

      {/* 
        Zone de contenu principal
        - flex flex-1 flex-col: prend tout l'espace restant et organise en colonne
        - overflow-hidden: cache le contenu qui dépasse
      */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 
          Barre de navigation supérieure (Navbar)
          Contient la recherche, notifications et profil utilisateur
        */}
        <Navbar />

        {/* 
          Zone de contenu des pages avec animations
          - flex-1: prend tout l'espace vertical disponible
          - overflow-y-auto: permet le scroll vertical si le contenu dépasse
          - overflow-x-hidden: cache le scroll horizontal
          - p-6: padding de 24px (1.5rem)
        */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900/50 p-6">
          {/* 
            Container pour limiter la largeur maximale du contenu
            - mx-auto: centre horizontalement
            - max-w-7xl: largeur maximale de 80rem (1280px)
          */}
          <div className="mx-auto max-w-7xl">
            {/* 
              AnimatePresence: Permet d'animer les composants qui entrent/sortent
              - mode="wait": attend la fin de l'animation de sortie avant de démarrer l'entrée
            */}
            <AnimatePresence mode="wait">
              {/* 
                Motion div avec animation basée sur le chemin de la route
                - key={location.pathname}: change quand la route change, déclenche l'animation
                - initial: état initial (opacité 0, légèrement en bas)
                - animate: état animé (opacité 1, position normale)
                - exit: état de sortie (opacité 0, légèrement en haut)
                - transition: durée de l'animation (0.2 secondes)
              */}
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* 
                  Outlet: Affiche le composant de la route enfant correspondante
                  C'est ici que les différentes pages (Dashboard, Documents, etc.) s'affichent
                */}
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
