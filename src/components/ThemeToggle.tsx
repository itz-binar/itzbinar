import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../App';
import { ThemeToggleProps } from '../types';

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isDarkTheme, toggleTheme: contextToggleTheme } = useContext(ThemeContext);

  const handleToggleTheme = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    contextToggleTheme();
    
    // Allow time for transition effects
    setTimeout(() => {
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <motion.button
      onClick={handleToggleTheme}
      className={`relative rounded-full p-2 sm:p-1.5 backdrop-blur-sm border shadow-lg ${isDarkTheme ? 'bg-black/30 border-green-500/30 shadow-green-500/20' : 'bg-white/30 border-green-700/30 shadow-green-700/10'} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
      disabled={isTransitioning}
      title={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDarkTheme ? 'dark' : 'light'}
          initial={{ opacity: 0, rotate: -30 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 30 }}
          transition={{ duration: 0.2 }}
          className="relative w-6 h-6 sm:w-6 sm:h-6"
        >
          {isDarkTheme ? (
            <Sun className="w-7 h-7 sm:w-6 sm:h-6 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          ) : (
            <Moon className="w-7 h-7 sm:w-6 sm:h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle; 