import React, { useEffect } from 'react';
import { AppRouter } from './router';
import { ChatProvider } from './context/ChatContext';

/**
 * Composant App - Composant racine de l'application
 * 
 * Ce composant est le point d'entrée principal de l'application React.
 * Il rend simplement le routeur principal (AppRouter) qui gère toute la navigation.
 * 
 * Toute la logique de routing, protection des routes et layouts est gérée
 * dans AppRouter. Ce composant reste minimal pour une meilleure séparation des responsabilités.
 */
function App() {
  // Global cleanup to remove any ghost dark mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('hr_genius_theme');
  }, []);

  return (
    <ChatProvider>
      <AppRouter />
    </ChatProvider>
  );
}

export default App;
