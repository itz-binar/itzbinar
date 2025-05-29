import React, { useRef, useEffect, useState, useContext } from 'react';
import { MatrixBackgroundProps, MatrixDrop } from '../types';
import { ThemeContext } from '../App';

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
  density = 1.0,
  speed = 1.0,
  fadeOpacity = 0.02,
  characters = "01",
  glowEffect = false,
  depthEffect = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const dropsRef = useRef<MatrixDrop[]>([]);
  const animationRef = useRef<number>(0);
  const { isDarkTheme } = useContext(ThemeContext);
  
  // Set up the canvas and initialize drops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      setDimensions({ width: innerWidth, height: innerHeight });
      
      // Re-initialize drops when resizing
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        initializeDrops(innerWidth, innerHeight);
      }
    };
    
    // Initial setup
    handleResize();
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  // Initialize drops based on screen dimensions and density
  const initializeDrops = (width: number, height: number) => {
    const drops: MatrixDrop[] = [];
    const dropCount = Math.floor(width / 20 * density); // Adjust drop count based on density
    
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        y: Math.random() * height * 2 - height, // Start some drops above the screen
        speed: (Math.random() * 0.5 + 0.5) * speed, // Vary the speed
        depth: Math.random(), // Depth effect (0-1)
        lastChar: '',
        lastSpecial: false,
        changeInterval: Math.floor(Math.random() * 15) + 5, // How often to change characters
        lastChange: 0
      });
    }
    
    dropsRef.current = drops;
  };

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Character set based on props and theme
    const charSet = characters.split('');
    
    // Colors for different themes
    const getColor = (depth: number, special: boolean = false) => {
      if (isDarkTheme) {
        if (special) {
          return `rgba(0, 255, 255, ${0.5 + depth * 0.5})`;
        }
        return `rgba(0, ${155 + Math.floor(depth * 100)}, ${20 + Math.floor(depth * 60)}, ${0.6 + depth * 0.4})`;
      } else {
        if (special) {
          return `rgba(0, 100, 120, ${0.7 + depth * 0.3})`;
        }
        return `rgba(0, ${80 + Math.floor(depth * 40)}, ${20 + Math.floor(depth * 30)}, ${0.5 + depth * 0.5})`;
      }
    };
    
    const getFontSize = (depth: number) => {
      return depthEffect ? 10 + Math.floor(depth * 6) : 14;
    };
    
    const getShadow = (depth: number, special: boolean = false) => {
      if (!glowEffect) return '';
      
      if (isDarkTheme) {
        if (special) {
          return `0 0 ${5 + depth * 10}px rgba(0, 255, 255, ${0.5 + depth * 0.5})`;
        }
        return `0 0 ${3 + depth * 5}px rgba(0, 255, 65, ${0.3 + depth * 0.4})`;
      } else {
        if (special) {
          return `0 0 ${3 + depth * 5}px rgba(0, 100, 120, ${0.3 + depth * 0.3})`;
        }
        return `0 0 ${2 + depth * 3}px rgba(0, 100, 0, ${0.2 + depth * 0.2})`;
      }
    };
    
    const drawMatrix = () => {
      // Apply fade effect with lower opacity to prevent full blackout
      const actualFadeOpacity = Math.min(fadeOpacity, 0.02); // Limit maximum opacity
      ctx.fillStyle = isDarkTheme 
        ? `rgba(0, 0, 0, ${actualFadeOpacity})` 
        : `rgba(245, 245, 245, ${actualFadeOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw each drop
      dropsRef.current.forEach((drop, i) => {
        // Determine if this should be a special character (brighter)
        const isSpecial = Math.random() < 0.05;
        
        // Get a random character from the set
        const charIndex = Math.floor(Math.random() * charSet.length);
        const char = charSet[charIndex];
        
        // Only update the character occasionally based on changeInterval
        drop.lastChange++;
        if (drop.lastChange >= drop.changeInterval) {
          drop.lastChar = char;
          drop.lastSpecial = isSpecial;
          drop.lastChange = 0;
        }
        
        // Set text properties based on depth and special status
        ctx.font = `bold ${getFontSize(drop.depth)}px monospace`;
        ctx.fillStyle = getColor(drop.depth, drop.lastSpecial);
        
        // Add glow effect if enabled
        if (glowEffect) {
          ctx.shadowColor = isDarkTheme ? 'rgba(0, 255, 65, 0.8)' : 'rgba(0, 100, 0, 0.5)';
          ctx.shadowBlur = 3 + drop.depth * 5;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }
        
        // Draw the character
        const x = i * 20;
        ctx.fillText(drop.lastChar, x, drop.y);
        
        // Reset shadow for performance
        if (glowEffect) {
          ctx.shadowBlur = 0;
        }
        
        // Move the drop down
        drop.y += drop.speed * (depthEffect ? (0.5 + drop.depth) : 1) * 2;
        
        // Reset the drop when it goes off screen
        if (drop.y > canvas.height) {
          drop.y = -20;
          drop.speed = (Math.random() * 0.5 + 0.5) * speed;
          drop.depth = Math.random();
          drop.changeInterval = Math.floor(Math.random() * 15) + 5;
        }
      });
      
      // Continue the animation loop
      animationRef.current = requestAnimationFrame(drawMatrix);
    };
    
    // Start the animation
    drawMatrix();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, isDarkTheme, density, speed, fadeOpacity, characters, glowEffect, depthEffect]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ 
        opacity: isDarkTheme ? 0.6 : 0.3,
        mixBlendMode: isDarkTheme ? 'screen' : 'multiply',
        transition: 'opacity 0.5s ease'
      }}
    />
  );
};

export default React.memo(MatrixBackground);