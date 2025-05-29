import React, { useEffect, useState, useCallback, memo } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Check theme from document
  useEffect(() => {
    const checkTheme = () => {
      const isLight = document.documentElement.classList.contains('light-theme');
      setIsDarkTheme(!isLight);
    };
    
    // Initial check
    checkTheme();
    
    // Set up observer to detect class changes on html element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Define callbacks outside of useEffect
  const updatePosition = useCallback((e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
  }, []);

  const handleMouseDown = useCallback(() => setClicked(true), []);
  const handleMouseUp = useCallback(() => setClicked(false), []);
  const handleMouseLeave = useCallback(() => setHidden(true), []);
  const handleMouseEnter = useCallback(() => setHidden(false), []);

  // Set up event listeners with optimized performance
  useEffect(() => {
    // Check if device is touch-enabled
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    
    // Only add event listeners if not a touch device
    if (!isTouchDevice) {
    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [
    isTouchDevice, 
    updatePosition, 
    handleMouseDown, 
    handleMouseUp, 
    handleMouseLeave, 
    handleMouseEnter
  ]);

  // Prepare render content even if it might not be displayed
  const cursorContent = (
    <>
      <div 
        className={`fixed pointer-events-none z-50 w-8 h-8 rounded-full border ${isDarkTheme ? 'border-green-500' : 'border-green-700'} mix-blend-difference transition-transform duration-200 ease-out`}
        style={{
          left: position.x - 16,
          top: position.y - 16,
          transform: clicked ? 'scale(0.8)' : 'scale(1)',
          opacity: hidden ? 0 : 1,
        }}
      />
      <div 
        className={`fixed pointer-events-none z-50 w-2 h-2 rounded-full ${isDarkTheme ? 'bg-green-500' : 'bg-green-700'} mix-blend-difference`}
        style={{
          left: position.x - 4,
          top: position.y - 4,
          transform: clicked ? 'scale(1.5)' : 'scale(1)',
          opacity: hidden ? 0 : 1,
        }}
      />
    </>
  );

  // Return null for touch devices, but don't use conditional rendering for hooks
  if (isTouchDevice) {
    return null;
  }

  return cursorContent;
};

export default memo(CustomCursor);