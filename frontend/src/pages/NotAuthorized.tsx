import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShield, FiArrowLeft } from "react-icons/fi";

/**
 * Composant NotAuthorized - Page d'erreur d'accès non autorisé
 *
 * Ce composant est affiché lorsqu'un utilisateur tente d'accéder à une page
 * pour laquelle il n'a pas les permissions nécessaires.
 *
 * Utilisation:
 * - Affiché automatiquement par RoleProtectedRoute dans router.tsx
 * - Quand un utilisateur avec un rôle insuffisant tente d'accéder à une route protégée
 *
 * Fonctionnalités:
 * - Message clair d'erreur d'autorisation
 * - Icône de bouclier pour représenter la sécurité
 * - Lien de retour vers le dashboard
 * - Animations fluides avec Framer Motion
 */
const NotAuthorized: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[60vh] flex-col items-center justify-center text-center"
    >
      {/* 
        Container principal avec animation d'entrée
        - min-h-[60vh]: hauteur minimale de 60% de la hauteur de l'écran
        - flex flex-col: layout flexible en colonne
        - items-center justify-center: centre le contenu verticalement et horizontalement
        - text-center: alignement du texte au centre
        - Animation: apparaît avec un léger mouvement depuis le bas
      */}
      {/* 
        Carte blanche contenant le message d'erreur
        - rounded-2xl: coins très arrondis
        - bg-white: fond blanc
        - p-10: padding de 40px
        - shadow-lg: ombre importante pour la profondeur
      */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-10 shadow-lg">
        {/* 
          Icône de bouclier animée
          - Animation avec effet "spring" (ressort) pour un effet dynamique
          - delay: 0.2s pour apparaître après le container
          - bg-red-100: fond rouge clair pour indiquer une erreur
          - text-red-600: icône rouge pour l'alerte
        */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40"
        >
          <FiShield className="h-10 w-10 text-red-600 dark:text-red-400" />
        </motion.div>

        {/* 
          Titre du message d'erreur
          - text-2xl: taille de texte large
          - font-semibold: poids de police semi-gras
        */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          You are not authorized to view this page
        </h1>

        {/* 
          Description explicative
          - mt-2: marge supérieure de 8px
          - text-sm: taille de texte petite
          - text-gray-600: couleur grise pour moins d'emphase
        */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Please check with your administrator if you believe this is an error.
        </p>

        {/* 
          Bouton de retour au dashboard avec animations de hover/tap
          - whileHover: légèrement agrandi au survol
          - whileTap: légèrement réduit au clic (effet tactile)
        */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {/* 
            Lien vers le dashboard
            - inline-flex: layout flexible inline
            - items-center: aligne les éléments verticalement
            - space-x-2: espacement horizontal de 8px
            - bg-primary-600: fond de couleur primaire
            - hover:bg-primary-700: couleur plus foncée au survol
            - transition-colors: transition fluide des couleurs
          */}
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center space-x-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Go back to Dashboard</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotAuthorized;
