import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';
import { ThemeToggleProps } from '../types';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={toggleTheme}
      className={`relative p-2 rounded-full overflow-hidden ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div 
        className={`absolute inset-0 transition-colors duration-300 ${
          isDarkTheme 
            ? 'bg-black/40 backdrop-blur-md border border-green-500/30' 
            : 'bg-white/40 backdrop-blur-md border border-green-700/20'
        }`}
      />
      
      {/* Animated background glow */}
      <div 
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background: isDarkTheme 
            ? 'radial-gradient(circle at center, rgba(0,255,65,0.2) 0%, rgba(0,0,0,0) 70%)' 
            : 'radial-gradient(circle at center, rgba(255,255,100,0.2) 0%, rgba(0,0,0,0) 70%)',
          transition: 'background 0.3s ease'
        }}
      />
      
      {/* Icon container */}
      <div className="relative z-10">
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDarkTheme ? 0 : 180,
            scale: 1
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 15 
          }}
        >
          {isDarkTheme ? (
            <Moon 
              size={24} 
              className="text-green-400 drop-shadow-[0_0_3px_rgba(0,255,65,0.5)]"
            />
          ) : (
            <Sun 
              size={24} 
              className="text-yellow-500 drop-shadow-[0_0_3px_rgba(255,255,0,0.5)]" 
            />
          )}
        </motion.div>
      </div>
      
      {/* Animated ring */}
      <motion.div 
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={false}
        animate={{ 
          borderColor: isDarkTheme ? 'rgba(0, 255, 65, 0.3)' : 'rgba(255, 255, 0, 0.3)',
          boxShadow: isDarkTheme 
            ? '0 0 10px rgba(0, 255, 65, 0.3), inset 0 0 5px rgba(0, 255, 65, 0.2)' 
            : '0 0 10px rgba(255, 255, 0, 0.2), inset 0 0 5px rgba(255, 255, 0, 0.1)'
        }}
        transition={{ duration: 0.3 }}
        style={{ border: '1px solid' }}
      />
    </motion.button>
  );
};

export default ThemeToggle; 