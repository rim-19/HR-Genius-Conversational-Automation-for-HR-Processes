import React from "react";
import { motion } from "framer-motion";

/**
 * Interface définissant les propriétés attendues par le composant AuthLayout
 * @param children - Les composants enfants à afficher dans ce layout (ex: Login, Register)
 */
interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Composant Layout pour les pages d'authentification (Login, Register, etc.)
 *
 * Ce composant crée un layout avec un arrière-plan animé et gradient pour les pages d'auth.
 * Il utilise Framer Motion pour créer des animations fluides et attrayantes.
 *
 * Fonctionnalités:
 * - Arrière-plan avec dégradé de couleurs (primary-50, white, secondary-50)
 * - Formes animées en arrière-plan pour un effet visuel moderne
 * - Centrage vertical et horizontal du contenu
 * - Z-index pour garantir que le contenu soit au-dessus des animations
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* 
        Container pour les formes animées en arrière-plan
        - absolute inset-0: prend toute la place du parent
        - overflow-hidden: cache les parties qui dépassent
      */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 
          Première forme animée - Cercle en haut à gauche
          - h-96 w-96: taille de 384px x 384px
          - rounded-full: forme circulaire
          - bg-primary-200: couleur primaire avec opacité
          - blur-3xl: effet de flou important
          Animation: scale (pulsation) et rotation continue
        */}
        <motion.div
          className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary-200 opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1], // Pulse de la taille
            rotate: [0, 90, 0], // Rotation de 0° à 90° et retour
          }}
          transition={{
            duration: 20, // Durée de l'animation: 20 secondes
            repeat: Infinity, // Répète à l'infini
            ease: "easeInOut", // Easing pour un mouvement fluide
          }}
        />

        {/* 
          Deuxième forme animée - Cercle en bas à droite
          Animation similaire mais avec des paramètres légèrement différents
          pour créer une variation visuelle
        */}
        <motion.div
          className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-secondary-200 opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1], // Pulse plus important
            rotate: [0, -90, 0], // Rotation inverse
          }}
          transition={{
            duration: 25, // Durée différente pour éviter la synchronisation
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* 
          Troisième forme animée - Cercle au centre
          Plus petit et au centre pour ajouter de la profondeur
        */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-300 opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.5, 1], // Pulse encore plus grand
          }}
          transition={{
            duration: 15, // Animation plus rapide
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 
        Contenu principal (enfants passés en props)
        - relative z-10: position relative avec z-index élevé pour être au-dessus des animations
        - w-full: prend toute la largeur disponible
      */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

export default AuthLayout;
