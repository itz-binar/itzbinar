import { useState, useEffect, useCallback } from 'react';
import { Theme, UseThemeReturn } from '../types';

export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Get stored theme or detect user preference
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    
    // Use system preference as fallback
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const isDarkTheme = theme === 'dark';

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDarkTheme);
    document.documentElement.classList.toggle('light-theme', !isDarkTheme);
  }, [isDarkTheme]);

  // Store theme preference
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change theme if user hasn't explicitly set a preference
      if (!localStorage.getItem('theme')) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Set theme helper
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  // Toggle theme helper
  const toggleTheme = useCallback(() => {
    setThemeState(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, isDarkTheme, setTheme, toggleTheme };
};

export default useTheme; 