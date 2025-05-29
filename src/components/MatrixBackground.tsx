import React, { useEffect, useRef, useContext, memo, useState, useCallback } from 'react';
import { ThemeContext } from '../App';
import { MatrixBackgroundProps, MatrixDrop } from '../types';

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
  density = 1, 
  speed = 1,
  fadeOpacity = 0.05,
  characters,
  glowEffect = true,
  depthEffect = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDarkTheme } = useContext(ThemeContext);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  // Define default character set
  const defaultMatrix = '01イウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンφχψωΔΘΛΞΠΣΦΨΩ';
  const matrixChars = characters || defaultMatrix;
  
  // Handle resize with useCallback to optimize performance
  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);
  
  // Setup matrix effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Calculate font size based on density
    const fontSize = Math.max(10, Math.floor(14 * density));
    const columns = Math.floor(canvas.width / fontSize);
    
    // Initialize drops array with random starting positions and depths
    const drops: MatrixDrop[] = [];
    for (let i = 0; i < columns; i++) {
      // Some drops start above the canvas for a staggered effect
      drops[i] = {
        y: Math.floor(Math.random() * canvas.height * 2) - canvas.height,
        speed: (0.5 + Math.random() * 0.5) * speed,
        depth: Math.random(), // Random depth between 0-1
        lastChar: '',
        lastSpecial: false,
        changeInterval: Math.floor(Math.random() * 3) + 1, // Change every 1-3 steps
        lastChange: 0
      };
    }
    
    // Character variation - some characters have higher probability
    const getRandomChar = (drop: MatrixDrop) => {
      drop.lastChange++;
      
      // Only change character after interval unless it's not set
      if (drop.lastChange < drop.changeInterval && drop.lastChar) {
        return { char: drop.lastChar, special: drop.lastSpecial };
      }
      
      // Reset change counter
      drop.lastChange = 0;
      
      // Special effect: occasionally use a brighter character
      // Deeper drops have lower chance of special chars
      const specialChance = depthEffect ? 0.98 + (0.01 * drop.depth) : 0.98;
      const specialChar = Math.random() > specialChance;
      
      // Get random character from the matrix set
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      
      // Save last character and special status
      drop.lastChar = char;
      drop.lastSpecial = specialChar;
      
      return { char, special: specialChar };
    };
    
    // Define the draw function
    const draw = () => {
      // Different background color and opacity based on theme
      ctx.fillStyle = isDarkTheme 
        ? `rgba(0, 0, 0, ${fadeOpacity})` 
        : `rgba(240, 240, 240, ${fadeOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Loop through each column
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        
        // Get a character and determine if it's special (brighter)
        const { char, special } = getRandomChar(drop);
        
        // Calculate opacity based on depth if depth effect is enabled
        const depthOpacity = depthEffect ? 0.4 + (drop.depth * 0.6) : 1;
        
        // Set the character style
        if (special) {
          // Brighter character
          const brightColor = isDarkTheme ? '#00FF99' : '#00AA55';
          ctx.fillStyle = brightColor;
          
          // Add glow effect for special characters
          if (glowEffect) {
            // Glow strength varies with depth
            const glowStrength = depthEffect ? 5 + Math.floor(drop.depth * 10) : 10;
            ctx.shadowBlur = glowStrength;
            ctx.shadowColor = brightColor;
          }
        } else {
          // Regular character with depth-based color
          if (depthEffect && isDarkTheme) {
            // In dark theme, deeper chars are brighter green
            const green = Math.floor(65 + (drop.depth * 190)); // 65-255
            ctx.fillStyle = `rgba(0, ${green}, ${Math.floor(green/3)}, ${depthOpacity})`;
          } else if (depthEffect && !isDarkTheme) {
            // In light theme, deeper chars are darker green
            const green = Math.floor(119 - (drop.depth * 70)); // 49-119
            ctx.fillStyle = `rgba(0, ${green}, ${Math.floor(green/2)}, ${depthOpacity})`;
          } else {
            // No depth effect
            ctx.fillStyle = isDarkTheme ? '#00FF41' : '#007733';
          }
          ctx.shadowBlur = 0;
        }
        
        // Set font with size variation based on depth
        let currentSize = fontSize;
        if (depthEffect) {
          currentSize = fontSize * (0.7 + (drop.depth * 0.6)); // 70%-130% of fontSize
        }
        if (special) {
          currentSize += 2; // Special chars are slightly bigger
        }
        
        ctx.font = `${currentSize}px monospace`;
        
        // Only draw if within canvas
        if (drop.y > 0) {
          ctx.fillText(char, i * fontSize, drop.y * fontSize);
        }
        
        // Reset drop with random probability when it reaches bottom
        if (drop.y * fontSize > canvas.height && Math.random() > 0.975) {
          drop.y = 0;
          // Occasionally change depth and speed when resetting
          if (Math.random() > 0.7) {
            drop.depth = Math.random();
            drop.speed = (0.5 + Math.random() * 0.5) * speed;
          }
        }
        
        // Move drop at varying speeds
        drop.y += drop.speed;
      }
    };
    
    // Set interval for animation with speed control
    const interval = setInterval(draw, Math.max(10, Math.floor(35 / speed)));
    
    // Handle window resize events
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDarkTheme, dimensions, density, speed, fadeOpacity, matrixChars, glowEffect, depthEffect, handleResize]);
  
  return (
    <>
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
        style={{ 
          opacity: isDarkTheme ? 0.8 : 0.6, 
          filter: glowEffect ? 'contrast(1.1)' : 'none' 
        }}
      />
      {glowEffect && (
        <div 
          className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
          style={{ 
            background: isDarkTheme 
              ? 'radial-gradient(circle at center, rgba(0,100,0,0.1) 0%, rgba(0,0,0,0) 70%)' 
              : 'radial-gradient(circle at center, rgba(0,100,0,0.05) 0%, rgba(0,0,0,0) 70%)',
            mixBlendMode: 'screen'
          }}
        />
      )}
    </>
  );
};

export default memo(MatrixBackground);