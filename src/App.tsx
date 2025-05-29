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
  setDarkTheme: (value: boolean) => {},
  toggleTheme: () => {},
});

function App() {
  const { isDarkTheme, setTheme, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [theme, setThemeState] = useState('dark');
  
  // Convert the setTheme function to match the existing context shape
  const setDarkTheme = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };
  
  // Ensure proper theme application to document root
  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDarkTheme);
    document.documentElement.classList.toggle('light-theme', !isDarkTheme);
    
    // Add smooth transitions for theme changes
    document.documentElement.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    
    // Add matrix background to body in case of any loading delays
    document.body.style.backgroundImage = isDarkTheme 
      ? 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,10,0,1))'
      : 'linear-gradient(to bottom, rgba(240,240,240,1), rgba(240,250,240,1))';
    document.body.style.transition = 'background-image 0.5s ease';
    
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
    <ThemeContext.Provider value={{ isDarkTheme, setDarkTheme, toggleTheme }}>
      <div className={`h-full w-full flex flex-col ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        {/* Background Effects - Optimize for mobile */}
        <MatrixBackground 
          density={isMobile ? 0.8 : 1.3} 
          speed={0.85} 
          fadeOpacity={0.03} 
          glowEffect={true}
          depthEffect={true}
          characters="01イウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンφχψωΔΘΛΞΠΣΦΨΩ▓▒░█▄▀■□●○"
        />
        <ParticleEffect 
          count={isMobile ? 50 : 90}
          connectDistance={isMobile ? 150 : 190}
          opacity={0.65}
          pulseEffect={true}
          size={1.25}
          depthEffect={true}
          trailEffect={!isMobile}
        />
        <div 
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
          style={{ 
            background: isDarkTheme 
              ? 'radial-gradient(circle at 30% 50%, rgba(0,50,0,0.05) 0%, rgba(0,0,0,0) 70%), radial-gradient(circle at 70% 50%, rgba(0,30,0,0.05) 0%, rgba(0,0,0,0) 70%)' 
              : 'radial-gradient(circle at 30% 50%, rgba(0,80,0,0.02) 0%, rgba(0,0,0,0) 70%), radial-gradient(circle at 70% 50%, rgba(0,50,0,0.02) 0%, rgba(0,0,0,0) 70%)',
            mixBlendMode: 'screen',
            transition: 'background 0.5s ease'
          }}
        />
        
        {/* Vignette Effect */}
        <div 
          className="fixed top-0 left-0 w-full h-full pointer-events-none"
          style={{ 
            boxShadow: isDarkTheme 
              ? 'inset 0 0 150px rgba(0,0,0,0.7)' 
              : 'inset 0 0 150px rgba(0,0,0,0.2)',
            transition: 'box-shadow 0.5s ease'
          }}
        />
        
        {/* CRT Screen Effect - Disable on mobile for performance */}
        {!isMobile && <div className="crt-effect" style={{ opacity: isDarkTheme ? 0.1 : 0.05 }} />}
        
        {/* Custom Cursor - Only on desktop */}
        {!isMobile && <CustomCursor />}
        
        {/* Theme Toggle - Responsive position */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        {/* Main Content Area - Improved responsiveness */}
        <main className="flex-1 z-10 w-full max-w-6xl mx-auto px-4 py-6 md:py-8 lg:py-16">
          <div className="grid gap-6 md:gap-8 lg:gap-12">
            <div className="space-y-6 md:space-y-8">
              {/* Profile Section - Enhanced for mobile */}
              <div className="text-center mb-4 md:mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-green-500 font-mono tracking-tight mb-2 md:mb-4 hover:text-shadow-glow transition-all duration-300">
                  <span className="relative inline-block">
                    DIGITAL WORKSPACE
                    <span className="absolute top-0 left-0 -ml-1 text-blue-400/30" aria-hidden="true">DIGITAL WORKSPACE</span>
                    <span className="absolute top-0 left-0 ml-1 text-red-400/30" aria-hidden="true">DIGITAL WORKSPACE</span>
                  </span>
                </h1>
                <p className={`${isDarkTheme ? 'text-green-400/80' : 'text-green-700/80'} text-base md:text-lg lg:text-xl font-mono`}>
                  Security Research & Development Hub
                </p>
              </div>

              {/* Main Card - Responsive sizing */}
              <SocialCard isMobile={isMobile} />
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