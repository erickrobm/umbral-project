import React, { useState, useEffect } from 'react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize based on HTML class
    const isDarkClass = document.documentElement.classList.contains('dark');
    setIsDark(isDarkClass);
  }, []);

  const toggle = () => {
    const newStatus = !isDark;
    setIsDark(newStatus);
    if (newStatus) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  return (
    <button 
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 bg-white dark:bg-surface-dark text-slate-900 dark:text-white p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform"
      title="Toggle Dark Mode"
    >
      <span className="material-symbols-outlined block dark:hidden">dark_mode</span>
      <span className="material-symbols-outlined hidden dark:block">light_mode</span>
    </button>
  );
};