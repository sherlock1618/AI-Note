import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const localPref = localStorage.getItem('darkMode');
    if (localPref !== null) {
      setDarkMode(JSON.parse(localPref));
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      document.body.className = darkMode ? 'dark-theme' : 'light-theme';
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }
  }, [darkMode, isInitialized]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, isInitialized }}>
      {children}
    </ThemeContext.Provider>
  );
};