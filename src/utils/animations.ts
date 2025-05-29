import { Variants } from 'framer-motion';

// Fade in animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeInOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
};

// Slide in from bottom animation variants
export const slideUpFade: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

// Slide in from left animation variants
export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 15 
    }
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: { duration: 0.3 }
  }
};

// Matrix-style glitch effect
export const matrixGlitch: Variants = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0],
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// Glitch text effect for children
export const glitchText: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
      yoyo: 3,
      ease: 'easeOut'
    }
  }
};

// Scale animation for hover effects
export const scaleOnHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

// Staggered container for children animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Card hover animations
export const cardHover: Variants = {
  initial: { 
    boxShadow: '0 0 10px rgba(0, 255, 65, 0.3)'
  },
  hover: { 
    y: -5,
    boxShadow: '0 10px 25px rgba(0, 255, 65, 0.5)',
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

// Matrix particles effect
export const matrixParticle: Variants = {
  initial: { 
    opacity: 0,
    y: 0
  },
  animate: (custom) => ({
    opacity: [0, 1, 0],
    y: [0, custom * 100],
    transition: {
      duration: 2 + Math.random() * 3,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop'
    }
  })
}; 