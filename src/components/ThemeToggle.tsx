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
          ? 'bg-[#151515] text-green-400 border border-green-500/50 shadow-lg shadow-green-500/20' 
          : 'bg-white text-green-700 border border-green-700/30 shadow-lg shadow-green-700/10'
        }
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
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