import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/**
 * Contexte de thème (mode nuit)
 *
 * - Persiste le choix de l'utilisateur dans localStorage ('hr_genius_theme')
 * - Sans choix explicite, suit la préférence système (prefers-color-scheme)
 * - Applique/retire la classe "dark" sur <html> (Tailwind darkMode: 'class')
 *
 * Note: index.html contient un script inline qui applique la classe "dark"
 * avant le montage de React pour éviter un flash de thème clair.
 */

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'hr_genius_theme';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') return stored;
    } catch {
        // localStorage indisponible — on continue avec la préférence système
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    // Synchronise la classe "dark" sur <html> à chaque changement
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // Persistance impossible — le thème reste actif pour la session
        }
    }, [theme]);

    // Suit la préférence système tant que l'utilisateur n'a pas choisi explicitement
    useEffect(() => {
        let hasExplicitChoice = false;
        try {
            hasExplicitChoice = localStorage.getItem(STORAGE_KEY) !== null;
        } catch {
            hasExplicitChoice = false;
        }
        if (hasExplicitChoice) return;

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
