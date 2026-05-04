import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext(null);

const THEME_ORDER = ['dark', 'ocean', 'rose', 'light'];

export const ThemeProvider = ({ children }) => {
  const auth = useAuth();
  const user = auth?.user;
  const [theme, setThemeState] = useState(() => 
    typeof window !== 'undefined' 
      ? localStorage.getItem('chat-theme') || user?.themePreference || 'dark'
      : 'dark'
  );

  // Apply theme to document
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    localStorage.setItem('chat-theme', theme);
  }, [theme]);

  // Update theme when user preference changes
  useEffect(() => {
    if (user?.themePreference && !localStorage.getItem('chat-theme-override')) {
      setThemeState(user.themePreference);
    }
  }, [user?.themePreference]);

  const setTheme = (newTheme) => {
    localStorage.setItem('chat-theme-override', 'true');
    setThemeState(newTheme);
  };

  const rotateTheme = () => {
    setTheme(THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length]);
  };

  const isDark = theme === 'dark' || theme === 'light' ? theme === 'dark' : true;
  const isOcean = theme === 'ocean';
  const isRose = theme === 'rose';

  const value = {
    theme,
    setTheme,
    rotateTheme,
    isDark,
    isOcean,
    isRose,
    THEME_ORDER
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
