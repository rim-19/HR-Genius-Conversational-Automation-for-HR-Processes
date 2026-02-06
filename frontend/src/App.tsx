import { AppRouter } from './router';

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
  return <AppRouter />;
}

export default App;
