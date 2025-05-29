import React, { useState, useEffect, memo } from 'react';
import { TypewriterTextProps } from '../types';

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 80,
  className = "",
  onComplete,
  startDelay = 0
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(startDelay === 0);

  // Handle start delay
  useEffect(() => {
    if (!hasStarted) {
      const startTimeout = setTimeout(() => {
        setHasStarted(true);
      }, startDelay);
      return () => clearTimeout(startTimeout);
    }
  }, [hasStarted, startDelay]);

  // Handle typewriter effect
  useEffect(() => {
    if (!hasStarted || currentIndex >= text.length) return;
    
    const timeout = setTimeout(() => {
      setDisplayText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
      
      if (currentIndex === text.length - 1) {
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [currentIndex, delay, text, onComplete, hasStarted, text.length]);

  // Reset typewriter when text changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);
    setHasStarted(startDelay === 0);
  }, [text, startDelay]);

  return (
    <div className={`${className} relative`}>
      <span>{displayText}</span>
      {!isComplete && hasStarted && (
        <span className="inline-block w-2 h-4 ml-1 bg-green-400 animate-pulse"></span>
      )}
    </div>
  );
};

export default memo(TypewriterText);