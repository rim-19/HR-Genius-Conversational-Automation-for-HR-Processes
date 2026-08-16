import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

/**
 * Composant Login - Page de connexion
 *
 * Ce composant gère l'authentification des utilisateurs avec:
 * - Champ email pour l'adresse email
 * - Champ mot de passe avec fonctionnalité d'affichage/masquage
 * - Option "Remember me" pour se souvenir de la session
 * - Lien "Forgot password" pour réinitialiser le mot de passe
 * - Bouton de soumission avec état de chargement
 *
 * Les animations Framer Motion sont utilisées pour rendre l'interface plus attractive.
 */
const Login: React.FC = () => {
  // Fonction de connexion du contexte d'authentification
  const { login } = useAuth();

  // États locaux pour gérer les valeurs du formulaire
  const [email, setEmail] = useState(""); // Email de l'utilisateur
  const [password, setPassword] = useState(""); // Mot de passe
  const [showPassword, setShowPassword] = useState(false); // Afficher/masquer le mot de passe
  const [isLoading, setIsLoading] = useState(false); // État de chargement lors de la soumission

  /**
   * Gestionnaire de soumission du formulaire de connexion
   *
   * @param e - Événement de formulaire React
   *
   * Cette fonction:
   * 1. Empêche le rechargement de la page (e.preventDefault())
   * 2. Active l'état de chargement
   * 3. Appelle la fonction login du contexte avec email et password
   * 4. Gère les erreurs éventuelles
   * 5. Désactive l'état de chargement dans tous les cas (finally)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setIsLoading(true); // Active l'indicateur de chargement

    try {
      // Appel à la fonction de connexion du contexte d'authentification
      // Cette fonction communique avec le backend pour vérifier les identifiants
      await login(email, password);
    } catch (error) {
      // En cas d'erreur (identifiants incorrects, problème réseau, etc.)
      console.error("Login error:", error);
      // Note: Vous pourriez ajouter ici une notification toast pour informer l'utilisateur
    } finally {
      // Désactive l'indicateur de chargement dans tous les cas (succès ou erreur)
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {/* 
        Container principal centré verticalement et horizontalement
        - min-h-screen: prend au moins toute la hauteur de l'écran
        - items-center justify-center: centre le contenu
        - px-4: padding horizontal pour l'espacement sur les côtés
      */}
      {/* 
        Container du formulaire avec animation d'entrée
        - max-w-md: largeur maximale de 28rem (448px)
        - Animation: apparaît avec un léger mouvement depuis le bas
      */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo et titre de l'application */}
        <div className="mb-8 text-center">
          {/* 
            Logo animé avec effet de "spring" (ressort)
            - scale: 0 -> 1 avec un effet élastique
            - delay: 0.2s pour apparaître après le container
          */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg"
          >
            <HiSparkles className="h-8 w-8 text-white" />
          </motion.div>
          {/* Nom de l'application */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">HR-Genius</h1>
          {/* Description */}
          <p className="mt-2 text-gray-600 dark:text-gray-400">AI-Powered HR Assistant</p>
        </div>

        {/* 
          Formulaire de connexion avec animation d'entrée
          - rounded-2xl: coins très arrondis
          - shadow-xl: ombre importante pour la profondeur
          - p-8: padding de 32px
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl"
        >
          {/* Titre du formulaire */}
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Welcome back
          </h2>

          {/* Formulaire avec gestion de la soumission */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ Email */}
            <div>
              {/* Label du champ email */}
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              {/* Container relatif pour positionner l'icône */}
              <div className="relative mt-1">
                {/* Icône d'email positionnée à gauche du champ */}
                <FiMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                {/* 
                  Champ de saisie email
                  - type="email": validation HTML5 pour le format email
                  - value: valeur contrôlée par l'état email
                  - onChange: met à jour l'état email à chaque frappe
                  - required: champ obligatoire
                  - pl-10: padding gauche pour laisser place à l'icône
                */}
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input w-full pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              {/* Password */}
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input w-full pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3 text-base font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span className="ml-2">Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-primary-50 dark:bg-primary-900/30 p-4">
            <p className="text-sm text-primary-800 dark:text-primary-300">
              Login with your HR-Genius credentials.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a
            href="#"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Contact your administrator
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
