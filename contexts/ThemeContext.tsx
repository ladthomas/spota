import React, { createContext, ReactNode, useContext, useState } from 'react';

type ThemeMode = 'dark' | 'light';

type ThemeContextType = {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    border: string;
  };
};

const darkColors = {
  background: '#18171c',
  surface: '#23202a',
  text: '#fff',
  textSecondary: '#999',
  primary: '#FFD36F',
  border: '#333',
};

const lightColors = {
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#000000',
  textSecondary: '#666666',
  primary: '#FFD36F',
  border: '#e0e0e0',
};

// Création du contexte
const ThemeContext = createContext<ThemeContextType | null>(null);

// Hook pour utiliser le contexte
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé à l'intérieur d'un ThemeProvider");
  }
  return context;
};

// Provider du contexte
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  const value = {
    theme,
    toggleTheme,
    colors,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
} 