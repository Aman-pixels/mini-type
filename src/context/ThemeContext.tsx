import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'serika_dark' | 'dracula' | 'cyberpunk' | 'light' | 'nord' | 'monokai' | 'gruvbox' | 'solarized_dark' | 'tokyo_night';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes: Record<Theme, Record<string, string>> = {
    serika_dark: {
        '--bg-color': '#323437',
        '--main-color': '#e2b714',
        '--sub-color': '#646669',
        '--text-color': '#d1d0c5',
        '--error-color': '#ca4754',
        '--error-extra-color': '#7e2a33',
    },
    dracula: {
        '--bg-color': '#282a36',
        '--main-color': '#bd93f9',
        '--sub-color': '#6272a4',
        '--text-color': '#f8f8f2',
        '--error-color': '#ff5555',
        '--error-extra-color': '#8b0000',
    },
    cyberpunk: {
        '--bg-color': '#000b1e',
        '--main-color': '#00f3ff',
        '--sub-color': '#005f73',
        '--text-color': '#e0e0e0',
        '--error-color': '#ff0055',
        '--error-extra-color': '#990033',
    },
    light: {
        '--bg-color': '#fafafa',
        '--main-color': '#0077ff',
        '--sub-color': '#999999',
        '--text-color': '#333333',
        '--error-color': '#ff3333',
        '--error-extra-color': '#cc0000',
    },
    nord: {
        '--bg-color': '#2e3440',
        '--main-color': '#88c0d0',
        '--sub-color': '#4c566a',
        '--text-color': '#d8dee9',
        '--error-color': '#bf616a',
        '--error-extra-color': '#8b3a3f',
    },
    monokai: {
        '--bg-color': '#272822',
        '--main-color': '#a6e22e',
        '--sub-color': '#75715e',
        '--text-color': '#f8f8f2',
        '--error-color': '#f92672',
        '--error-extra-color': '#a01a47',
    },
    gruvbox: {
        '--bg-color': '#282828',
        '--main-color': '#fabd2f',
        '--sub-color': '#504945',
        '--text-color': '#ebdbb2',
        '--error-color': '#fb4934',
        '--error-extra-color': '#9d0006',
    },
    solarized_dark: {
        '--bg-color': '#002b36',
        '--main-color': '#b58900',
        '--sub-color': '#586e75',
        '--text-color': '#839496',
        '--error-color': '#dc322f',
        '--error-extra-color': '#8b1a1a',
    },
    tokyo_night: {
        '--bg-color': '#1a1b26',
        '--main-color': '#7aa2f7',
        '--sub-color': '#565f89',
        '--text-color': '#c0caf5',
        '--error-color': '#f7768e',
        '--error-extra-color': '#9d3a4a',
    }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = localStorage.getItem('minitype-theme');
        return (saved as Theme) || 'serika_dark';
    });

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('minitype-theme', newTheme);
    };

    useEffect(() => {
        const themeVars = themes[theme];
        for (const [key, value] of Object.entries(themeVars)) {
            document.documentElement.style.setProperty(key, value);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
