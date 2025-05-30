import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';
import { ThemeToggleProps } from '../types';

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={toggleTheme}
      className={`
        p-2 rounded-full transition-all duration-300 
        ${isDarkTheme 
          ? 'bg-gray-800 text-blue-400 border border-blue-500/30 shadow-md' 
          : 'bg-white text-blue-600 border border-blue-600/20 shadow-md'
        }
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkTheme ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default ThemeToggle; 