import { useState, useEffect } from 'react';

const useTheme = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const localPref = localStorage.getItem('darkMode');
    if (localPref !== null) return JSON.parse(localPref);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return { darkMode, toggleTheme };
};

export default useTheme;