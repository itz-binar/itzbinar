import React, { createContext, useEffect, useState } from 'react';
import MatrixBackground from './components/MatrixBackground';
import ParticleEffect from './components/ParticleEffect';
import SocialCard from './components/SocialCard';
import CustomCursor from './components/CustomCursor';
import TerminalWindow from './components/TerminalWindow';
import ThemeToggle from './components/ThemeToggle';
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
  const [showBackground, setShowBackground] = useState<boolean>(true); // Enable backgrounds but keep them subtle
  
  // Ensure proper theme application to document root
  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDarkTheme);
    document.documentElement.classList.toggle('light-theme', !isDarkTheme);
    
    // Add smooth transitions for theme changes
    document.documentElement.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    
    // Add static background color to body - no gradients or effects that could cause black screen
    document.body.style.backgroundColor = isDarkTheme 
      ? '#111111' // Dark gray instead of black
      : '#f5f5f5'; // Light gray
    document.body.style.transition = 'background-color 0.5s ease';
    
    // Enable backgrounds after a short delay to ensure content is loaded first
    const timer = setTimeout(() => {
      setShowBackground(true);
    }, 500);
    return () => clearTimeout(timer);
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
      <div className={`h-full w-full flex flex-col ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
           style={{ 
             backgroundColor: isDarkTheme ? '#111111' : '#f5f5f5',
             color: isDarkTheme ? '#ffffff' : '#333333'
           }}>
        {/* Very minimal background effects */}
        {showBackground && (
          <MatrixBackground 
            density={isMobile ? 0.1 : 0.2} // Very low density
            speed={0.2} // Very slow
            fadeOpacity={0.0001} // Extremely low fade opacity
            glowEffect={false}
            depthEffect={false}
            characters="01"
          />
        )}
        
        {/* Very minimal particle effect */}
        {showBackground && (
          <ParticleEffect 
            count={isMobile ? 5 : 10} // Very few particles
            connectDistance={isMobile ? 40 : 60}
            opacity={0.1} // Very low opacity
            pulseEffect={false}
            size={0.3} // Very small
            depthEffect={false}
            trailEffect={false}
          />
        )}
        
        {/* Very subtle ambient gradients */}
        <div 
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
          style={{ 
            background: isDarkTheme 
              ? 'radial-gradient(circle at 30% 50%, rgba(0,50,0,0.005) 0%, rgba(0,0,0,0) 80%), radial-gradient(circle at 70% 50%, rgba(0,30,0,0.005) 0%, rgba(0,0,0,0) 80%)' 
              : 'radial-gradient(circle at 30% 50%, rgba(0,80,0,0.002) 0%, rgba(0,0,0,0) 80%), radial-gradient(circle at 70% 50%, rgba(0,50,0,0.002) 0%, rgba(0,0,0,0) 80%)',
            mixBlendMode: 'normal',
            opacity: 0.2
          }}
        />
        
        {/* Theme Toggle - Responsive position */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        {/* Main Content Area - Improved responsiveness */}
        <main className="flex-1 z-10 w-full max-w-6xl mx-auto px-4 py-6 md:py-8 lg:py-16">
          <div className="grid gap-6 md:gap-8 lg:gap-12">
            <div className="space-y-6 md:space-y-8">
              {/* Profile Section */}
              <div className="text-center mb-4 md:mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-green-500 font-mono tracking-tight mb-2 md:mb-4">
                  DIGITAL WORKSPACE
                </h1>
                <p className={`${isDarkTheme ? 'text-green-400/80' : 'text-green-700/80'} text-base md:text-lg lg:text-xl font-mono`}>
                  Security Research & Development Hub
                </p>
              </div>

              {/* Main Card */}
              <div>
                <SocialCard isMobile={isMobile} />
              </div>
            </div>
            
            <footer className="text-center mt-6 md:mt-auto pb-16 md:pb-8">
              <p className={`${isDarkTheme ? 'text-green-500/50' : 'text-green-700/50'} text-xs font-mono`}>
                &lt;/&gt; with 💻 by Binar | {new Date().getFullYear()}
              </p>
            </footer>
          </div>
        </main>

        {/* Terminal Section - Optimized for both desktop and mobile */}
        <div className="w-full z-20 fixed bottom-0 left-0 right-0">
          <TerminalWindow isMobile={isMobile} />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;