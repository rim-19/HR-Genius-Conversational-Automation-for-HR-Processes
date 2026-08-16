import React from 'react';
import { createRoot } from 'react-dom/client'; //démarre ton application.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; //Gestion API + cache + rechargement automatique.
import { BrowserRouter as Router } from 'react-router-dom'; //Navigation entre les pages (Login → Dashboard → Profile…).
import { AuthProvider } from './context/AuthContext'; //Ton contexte d'authentification → gère le user connecté, login, logout.
import App from './App';
import './styles/index.css';
import 'react-toastify/dist/ReactToastify.css';//Affiche les notifications (succès, erreurs…).

/**
 * Configuration du client React Query
 * 
 * React Query est utilisé pour la gestion des requêtes API et du cache.
 * Configuration:
 * - refetchOnWindowFocus: false - Ne recharge pas les données quand la fenêtre reprend le focus
 * - retry: 1 - Réessaie une fois en cas d'erreur de requête
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Point d'entrée de l'application React
 * 
 * Ce fichier initialise et rend l'application React dans le DOM.
 * 
 * Structure des providers (de l'extérieur vers l'intérieur):
 * 1. React.StrictMode - Mode strict de React pour détecter les problèmes
 * 2. QueryClientProvider - Fournit React Query pour la gestion des données
 * 3. Router - Fournit le routing avec React Router (BrowserRouter)
 * 4. AuthProvider - Fournit le contexte d'authentification à toute l'application
 * 5. App - Composant principal de l'application
 * 6. ToastContainer - Container pour les notifications toast
 */

// Récupération de l'élément HTML racine où l'app sera rendue
// L'élément avec id="root" est défini dans index.html
const container = document.getElementById('root');

// Création de la racine React 18+ avec createRoot
// Le ! après container indique à TypeScript que container n'est pas null
const root = createRoot(container!);

// Rendu de l'application avec tous les providers nécessaires
root.render(
  <React.StrictMode>
    {/* 
      QueryClientProvider - Fournit le client React Query
      Permet à tous les composants d'utiliser les hooks de React Query
      (useQuery, useMutation, etc.)
    */}
    <QueryClientProvider client={queryClient}>
      {/* 
        BrowserRouter - Gère le routing côté client
        Permet d'utiliser React Router pour la navigation entre les pages
        Utilise l'API History du navigateur pour les URLs
      */}
      <Router>
        {/* 
          AuthProvider - Fournit le contexte d'authentification
          Tous les composants enfants peuvent accéder à:
          - user: informations de l'utilisateur connecté
          - isAuthenticated: état d'authentification
          - login: fonction de connexion
          - logout: fonction de déconnexion
        */}
        <AuthProvider>
          {/* Composant principal de l'application
              (inclut le ToastContainer, déplacé dans App pour suivre le thème) */}
          <App />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);