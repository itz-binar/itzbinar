import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <div 
        className="fixed pointer-events-none z-50 w-8 h-8 rounded-full border border-green-500 mix-blend-difference transition-transform duration-200 ease-out"
        style={{
          left: position.x - 16,
          top: position.y - 16,
          transform: clicked ? 'scale(0.8)' : 'scale(1)',
        }}
      />
      <div 
        className="fixed pointer-events-none z-50 w-2 h-2 rounded-full bg-green-500 mix-blend-difference"
        style={{
          left: position.x - 4,
          top: position.y - 4,
          transform: clicked ? 'scale(1.5)' : 'scale(1)',
        }}
      />
    </>
  );
};

export default CustomCursor;