import React from 'react';
import { ToastContainer } from 'react-toastify';
import { AppRouter } from './router';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

/**
 * ToastContainer qui suit le thème actif (clair/sombre).
 * Doit être rendu à l'intérieur du ThemeProvider pour accéder au contexte.
 */
const ThemedToastContainer: React.FC = () => {
  const { theme } = useTheme();
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
    />
  );
};

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
  return (
    <ThemeProvider>
      <ChatProvider>
        <AppRouter />
      </ChatProvider>
      <ThemedToastContainer />
    </ThemeProvider>
  );
}

export default App;
