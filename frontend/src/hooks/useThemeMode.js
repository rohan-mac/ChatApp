import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const useThemeMode = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('chat-theme') || user?.themePreference || 'dark');

  useEffect(() => {
    if (user?.themePreference && !localStorage.getItem('chat-theme')) {
      setTheme(user.themePreference);
    }
  }, [user?.themePreference]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('chat-theme', theme);
  }, [theme]);

  return [theme, setTheme];
};

export default useThemeMode;
