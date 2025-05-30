import React, { createContext, useEffect, useState } from 'react';
import SocialCard from './components/SocialCard';
import ThemeToggle from './components/ThemeToggle';
import TerminalWindow from './components/TerminalWindow';
import useTheme from './hooks/useTheme';
import { ThemeContextType } from './types';
import { motion } from 'framer-motion';
import './styles/globals.css';

// Theme context for sharing theme state across components
export const ThemeContext = createContext<ThemeContextType>({
  isDarkTheme: true,
  setTheme: () => {},
  toggleTheme: () => {},
});

function App() {
  const { isDarkTheme, setTheme, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Ensure proper theme application to document root
  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDarkTheme);
    document.documentElement.classList.toggle('light-theme', !isDarkTheme);
    
    // Add smooth transitions for theme changes
    document.documentElement.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    
    // Add static background color to body
    document.body.style.backgroundColor = isDarkTheme 
      ? '#121212' // Dark gray
      : '#f8f9fa'; // Light gray
    document.body.style.transition = 'background-color 0.5s ease';
  }, [isDarkTheme]);

  // Check for mobile devices
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  return (
    <ThemeContext.Provider value={{ isDarkTheme, setTheme, toggleTheme }}>
      <div className={`min-h-screen w-full flex flex-col ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
           style={{ 
             backgroundColor: isDarkTheme ? '#121212' : '#f8f9fa',
             color: isDarkTheme ? '#ffffff' : '#333333'
           }}>
        
        {/* Theme Toggle - Responsive position */}
        <motion.div 
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ThemeToggle />
        </motion.div>
        
        {/* Main Content Area - Improved responsiveness */}
        <motion.main 
          className="flex-1 z-10 w-full max-w-6xl mx-auto px-4 py-6 md:py-12 lg:py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid gap-6 md:gap-8 lg:gap-12">
            <div className="space-y-6 md:space-y-8">
              {/* Profile Section */}
              <motion.div 
                className="text-center mb-4 md:mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'} font-sans tracking-tight mb-2 md:mb-4`}>
                  DIGITAL WORKSPACE
                </h1>
                <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'} text-base md:text-lg lg:text-xl font-sans`}>
                  Security Research & Development Hub
                </p>
              </motion.div>

              {/* Main Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <SocialCard isMobile={isMobile} />
              </motion.div>
            </div>
            
            <motion.footer 
              className="text-center mt-6 md:mt-auto pb-16 md:pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} text-xs font-sans`}>
                &lt;/&gt; with 💻 by Binar | {new Date().getFullYear()}
              </p>
            </motion.footer>
          </div>
        </motion.main>

        {/* Terminal Section - Optimized for both desktop and mobile */}
        <motion.div 
          className="w-full z-20 fixed bottom-0 left-0 right-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <TerminalWindow isMobile={isMobile} />
        </motion.div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;