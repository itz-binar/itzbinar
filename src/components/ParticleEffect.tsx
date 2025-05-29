import React, { useEffect, useRef, useContext, memo, useState, useCallback } from 'react';
import { ThemeContext } from '../App';
import { ParticleEffectProps, Particle } from '../types';

const ParticleEffect: React.FC<ParticleEffectProps> = ({
  count = 70,
  connectDistance = 150,
  opacity = 0.5,
  pulseEffect = true,
  size = 1,
  depthEffect = true,
  trailEffect = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDarkTheme } = useContext(ThemeContext);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  // Handle resize with useCallback
  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);
  
  // Create particles with useCallback
  const createParticles = useCallback((
    width: number, 
    height: number, 
    count: number, 
    colors: string[],
    size: number
  ): Particle[] => {
    const particles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const depth = Math.random(); // Random depth between 0-1
      const sizeMultiplier = depthEffect ? 0.6 + (depth * 0.8) : 1; // Size varies with depth
      
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: (Math.random() * 2 + 0.5) * size * sizeMultiplier,
        speedX: (Math.random() - 0.5) * 0.7 * (depthEffect ? 0.5 + (depth * 1) : 1), // Speed varies with depth
        speedY: (Math.random() - 0.5) * 0.7 * (depthEffect ? 0.5 + (depth * 1) : 1),
        opacity: Math.random() * 0.5 + 0.2,
        color: depthEffect 
          ? getDepthColor(depth, colors, isDarkTheme) 
          : colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2, // Random starting phase
        pulseSpeed: 0.02 + Math.random() * 0.03,
        depth: depth
      });
    }
    
    return particles;
  }, [depthEffect, isDarkTheme]);
  
  // Get color based on depth
  const getDepthColor = useCallback((
    depth: number, 
    colors: string[], 
    isDark: boolean
  ): string => {
    if (!depthEffect) return colors[Math.floor(Math.random() * colors.length)];
    
    // For dark theme, deeper particles are brighter
    if (isDark) {
      if (depth < 0.3) return colors[0]; // Darkest
      if (depth < 0.6) return colors[1]; // Medium
      if (depth < 0.9) return colors[2]; // Brighter
      return colors[3]; // Brightest
    } 
    // For light theme, deeper particles are darker
    else {
      if (depth < 0.3) return colors[3]; // Lightest
      if (depth < 0.6) return colors[2]; // Medium
      if (depth < 0.9) return colors[1]; // Darker
      return colors[0]; // Darkest
    }
  }, [depthEffect]);
  
  // Connect particles with lines
  const connectParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    particles: Particle[],
    maxDistance: number,
    isDarkTheme: boolean
  ) => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only connect if within distance
        if (distance < maxDistance) {
          // Calculate line opacity based on distance and particle depths
          const distanceOpacity = 1 - (distance / maxDistance);
          
          // In depth mode, prefer connecting particles of similar depth
          let depthFactor = 1;
          if (depthEffect) {
            const depthDiff = Math.abs(p1.depth - p2.depth);
            depthFactor = 1 - depthDiff; // 0-1 value, 1 means same depth
          }
          
          // Different line color based on theme and depth
          let baseColor: string;
          if (isDarkTheme) {
            if (depthEffect) {
              // Average depth determines color brightness
              const avgDepth = (p1.depth + p2.depth) / 2;
              const green = Math.floor(100 + avgDepth * 155); // 100-255
              baseColor = `0, ${green}, ${Math.floor(green/4)}`;
            } else {
              baseColor = '0, 255, 65';
            }
          } else {
            if (depthEffect) {
              // Average depth determines color darkness
              const avgDepth = (p1.depth + p2.depth) / 2;
              const green = Math.floor(119 - avgDepth * 60); // 59-119
              baseColor = `0, ${green}, ${Math.floor(green/2)}`;
            } else {
              baseColor = '0, 119, 51';
            }
          }
          
          // Draw line with gradient
          const gradient = ctx.createLinearGradient(
            p1.x, p1.y, 
            p2.x, p2.y
          );
          
          // Final opacity calculation
          const finalOpacity = distanceOpacity * 0.2 * p1.opacity * p2.opacity * depthFactor;
          
          gradient.addColorStop(0, `rgba(${baseColor}, ${finalOpacity})`);
          gradient.addColorStop(1, `rgba(${baseColor}, ${finalOpacity})`);
          
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = depthEffect ? 0.4 + (((p1.depth + p2.depth) / 2) * 0.8) : 0.6;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }, [depthEffect]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Different color schemes based on theme with more variety
    const darkThemeColors = ['#008F11', '#00BB22', '#00CC33', '#00DD55', '#00FF41'];
    const lightThemeColors = ['#005522', '#007733', '#008844', '#00994d', '#00aa55'];
    const colors = isDarkTheme ? darkThemeColors : lightThemeColors;
    
    // Initialize particles
    const particles = createParticles(canvas.width, canvas.height, count, colors, size);
    
    // Animation function
    const animate = () => {
      // Use different background based on theme and trail effect
      const bgOpacity = trailEffect ? 0.03 : 0.2;
      ctx.fillStyle = isDarkTheme ? `rgba(0, 0, 0, ${bgOpacity})` : `rgba(240, 240, 240, ${bgOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Update pulse effect
        if (pulseEffect) {
          p.pulse += p.pulseSpeed;
          if (p.pulse > Math.PI * 2) p.pulse = 0;
          
          // Size oscillation with pulse - deeper particles pulse more
          const pulseAmount = depthEffect ? 0.3 + (p.depth * 0.4) : 0.5; // 0.3-0.7 or fixed 0.5
          const pulseFactor = Math.sin(p.pulse) * pulseAmount + 1;
          const currentSize = p.size * pulseFactor;
          
          // Draw with glow effect - deeper particles glow more
          const glowAmount = depthEffect ? 3 + Math.floor(p.depth * 5) : 5;
          ctx.shadowBlur = glowAmount;
          ctx.shadowColor = p.color;
          
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          
          // Reset shadow
          ctx.shadowBlur = 0;
        } else {
          // Standard drawing without pulse
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        
        // Update position with smooth movement - deeper particles move more sinusoidally
        const timeFactor = Date.now() * 0.001;
        const depthMovement = depthEffect ? 0.7 + (p.depth * 0.6) : 1; // 0.7-1.3 or fixed 1
        
        p.x += Math.sin(timeFactor + i) * p.speedX * depthMovement;
        p.y += Math.cos(timeFactor + i) * p.speedY * depthMovement;
        
        // Boundary check with smooth wrapping
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;
        
        // Randomly change opacity for twinkling effect - deeper particles twinkle more
        const twinkleAmount = depthEffect ? 0.005 + (p.depth * 0.01) : 0.01; // 0.005-0.015 or fixed 0.01
        p.opacity += (Math.random() - 0.5) * twinkleAmount;
        p.opacity = Math.max(0.1, Math.min(0.8, p.opacity));
      }
      
      // Connect particles with lines
      connectParticles(ctx, particles, connectDistance, isDarkTheme);
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    isDarkTheme, 
    dimensions, 
    count, 
    connectDistance, 
    pulseEffect, 
    size, 
    depthEffect,
    trailEffect,
    createParticles, 
    connectParticles, 
    handleResize
  ]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        opacity: opacity,
        mixBlendMode: isDarkTheme ? 'screen' : 'multiply',
        filter: 'contrast(1.05)'
      }}
    />
  );
};

export default memo(ParticleEffect);