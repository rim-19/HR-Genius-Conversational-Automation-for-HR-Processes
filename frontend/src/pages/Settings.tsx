import React from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiSettings,
  FiShield,
  FiDatabase,
  FiActivity,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../utils/roles";

/**
 * Composant Settings - Page de paramètres système
 *
 * Ce composant permet aux administrateurs de gérer les paramètres système.
 * Cette page est protégée au niveau du routeur (router.tsx) pour n'autoriser
 * que les utilisateurs avec le rôle ADMIN.
 *
 * Fonctionnalités:
 * - Gestion des utilisateurs, rôles et permissions
 * - Configuration système
 * - Paramètres de sécurité et contrôle d'accès
 * - Gestion de la base de données et sauvegardes
 * - Surveillance système et métriques
 *
 * TODO: Connecter les catégories de paramètres aux routes backend:
 * - /api/system/settings
 * - /api/users
 * - /api/system/config
 * - /api/security/settings
 * - /api/system/backup
 * - /api/system/monitoring
 *
 * VISIBLE_TO: ['ADMIN']
 */
const Settings: React.FC = () => {
  // Récupération des informations de l'utilisateur connecté
  const { user } = useAuth();

  //
  // Note: Cette page est déjà protégée par le routeur (RoleProtectedRoute)
  // Les vérifications ici servent uniquement pour des éléments UI conditionnels
  // RENDER_IF: user.role === 'ADMIN'
  //

  /**
   * Catégories de paramètres système disponibles
   * Chaque catégorie représente une section de configuration différente:
   * - id: Identifiant unique de la catégorie
   * - name: Nom affiché de la catégorie
   * - description: Description de ce qui peut être configuré dans cette catégorie
   * - icon: Composant d'icône React Icons
   * - color: Classe CSS pour la couleur de fond de l'icône
   *
   * TODO: Implémenter la navigation vers les pages de configuration détaillées
   */
  const settingsCategories = [
    {
      id: 1,
      name: "User Management",
      description: "Manage users, roles, and permissions",
      icon: FiUsers,
      color: "bg-blue-500",
      // TODO: Link to /api/users management
    },
    {
      id: 2,
      name: "System Configuration",
      description: "Configure system preferences and settings",
      icon: FiSettings,
      color: "bg-purple-500",
      // TODO: Link to /api/system/config
    },
    {
      id: 3,
      name: "Security & Access",
      description: "Manage security policies and access controls",
      icon: FiShield,
      color: "bg-red-500",
      // TODO: Link to /api/security/settings
    },
    {
      id: 4,
      name: "Database & Backup",
      description: "Database management and backup settings",
      icon: FiDatabase,
      color: "bg-green-500",
      // TODO: Link to /api/system/backup
    },
    {
      id: 5,
      name: "System Monitoring",
      description: "View system logs and performance metrics",
      icon: FiActivity,
      color: "bg-orange-500",
      // TODO: Link to /api/system/monitoring
    },
  ];

  return (
    <div className="space-y-6">
      {/* 
        Container principal de la page Settings
        - space-y-6: espacement vertical de 24px entre les sections
      */}
      {/* 
        En-tête de la page avec dégradé de couleur
        - Animation d'entrée depuis le haut avec Framer Motion
        - Dégradé de violet à primaire pour indiquer une zone administrative
        - shadow-lg: ombre importante pour la profondeur
      */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-purple-500 to-primary-500 p-8 text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="mt-2 text-purple-100">
          Admin-only configuration area. Manage system-wide settings and
          preferences.
        </p>
      </motion.div>

      {/* 
        Grille des catégories de paramètres
        - grid: layout en grille responsive
        - gap-6: espacement de 24px entre les cartes
        - sm:grid-cols-2: 2 colonnes sur petits écrans et plus
        - lg:grid-cols-3: 3 colonnes sur grands écrans et plus
      */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 
          Parcours de toutes les catégories de paramètres
          Chaque catégorie est affichée dans une carte cliquable
          - Animation avec délai progressif pour un effet en cascade
        */}
        {settingsCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card group cursor-pointer hover:shadow-lg transition-all"
          >
            {/* 
              Carte de catégorie avec animation d'entrée
              - key={category.id}: identifiant unique pour React
              - initial: état initial (invisible, légèrement en bas)
              - animate: état animé (visible, position normale)
              - transition: délai progressif (0.1s * index) pour l'effet en cascade
              - card: classe personnalisée pour le style de carte
              - group: permet les effets hover sur les enfants
              - cursor-pointer: curseur en forme de pointeur
              - hover:shadow-lg: ombre plus importante au survol
            */}
            <div className="flex items-start space-x-4">
              {/* 
                Icône de la catégorie avec effet hover
                - rounded-xl: coins très arrondis
                - p-3: padding de 12px
                - transition-transform: transition fluide de la transformation
                - group-hover:scale-110: agrandit l'icône au survol de la carte
              */}
              <div
                className={`rounded-xl ${category.color} p-3 text-white transition-transform group-hover:scale-110`}
              >
                <category.icon className="h-6 w-6" />
              </div>
              {/* Contenu textuel de la catégorie */}
              <div className="flex-1">
                {/* Nom de la catégorie */}
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
                {/* Description de la catégorie */}
                <p className="mt-1 text-sm text-gray-600">
                  {category.description}
                </p>
                {/* 
                  Bouton de configuration (à implémenter)
                  - mt-3: marge supérieure de 12px
                  - text-primary-600: couleur primaire
                  - hover:text-primary-700: couleur plus foncée au survol
                  - TODO: Naviguer vers la page de configuration détaillée
                */}
                <button className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700">
                  Configure →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 
        Carte d'information sur l'accès administrateur
        - Animation avec délai pour apparaître après les catégories
        - border-2 border-dashed: bordure pointillée pour attirer l'attention
        - bg-purple-50: fond violet clair pour distinguer cette carte
        - Avertit sur l'importance des paramètres système
      */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card border-2 border-dashed border-purple-300 bg-purple-50"
      >
        <div className="flex items-start space-x-4">
          {/* Icône de bouclier pour représenter la sécurité */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500 text-white">
            <FiShield className="h-6 w-6" />
          </div>
          <div>
            {/* Titre de la carte d'information */}
            <h3 className="font-semibold text-gray-900">
              Admin Access Required
            </h3>
            {/* 
              Message d'avertissement sur les implications des changements
              Les paramètres système affectent tous les utilisateurs
            */}
            <p className="mt-1 text-sm text-gray-600">
              These settings are only accessible to system administrators.
              Changes made here affect all users and system behavior. Please
              ensure you understand the implications before making changes.
            </p>
            {/* 
              Liste des endpoints API backend pour référence
              - text-xs: texte très petit
              - text-gray-500: couleur grise pour moins d'emphase
            */}
            <p className="mt-2 text-xs text-gray-500">
              Backend API endpoints: /api/system/settings, /api/users,
              /api/system/config
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
