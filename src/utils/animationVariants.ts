/**
 * Animation Variants Library
 * 
 * Reusable Framer Motion animation variants for consistent animations
 * across the application.
 */

import { Variants } from 'framer-motion';
import { ANIMATION_DURATIONS, ANIMATION_EASINGS, ANIMATION_SCALES, ANIMATION_TRANSLATIONS } from '../config/animations';

// ============================================================================
// Basic Animations
// ============================================================================

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: ANIMATION_DURATIONS.normal / 1000 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: ANIMATION_DURATIONS.exitTransition / 1000 }
  },
};

export const fadeInFast: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: ANIMATION_DURATIONS.fast / 1000 }
  },
  exit: { opacity: 0 },
};

export const fadeInSlow: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: ANIMATION_DURATIONS.slow / 1000 }
  },
  exit: { opacity: 0 },
};

// ============================================================================
// Slide Animations
// ============================================================================

export const slideUp: Variants = {
  initial: { 
    opacity: 0, 
    y: ANIMATION_TRANSLATIONS.slideUp 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: ANIMATION_DURATIONS.normal / 1000,
      ease: ANIMATION_EASINGS.default
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: ANIMATION_DURATIONS.exitTransition / 1000 }
  },
};

export const slideUpLarge: Variants = {
  initial: { 
    opacity: 0, 
    y: ANIMATION_TRANSLATIONS.slideUpLarge 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: ANIMATION_DURATIONS.slow / 1000,
      ease: ANIMATION_EASINGS.default
    }
  },
  exit: { opacity: 0, y: -30 },
};

export const slideDown: Variants = {
  initial: { opacity: 0, y: -30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: ANIMATION_DURATIONS.normal / 1000 }
  },
  exit: { opacity: 0, y: 30 },
};

export const slideLeft: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: ANIMATION_DURATIONS.normal / 1000 }
  },
  exit: { opacity: 0, x: -30 },
};

export const slideRight: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: ANIMATION_DURATIONS.normal / 1000 }
  },
  exit: { opacity: 0, x: 30 },
};

// ============================================================================
// Scale Animations
// ============================================================================

export const scaleIn: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.95 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: ANIMATION_DURATIONS.normal / 1000,
      ease: ANIMATION_EASINGS.default
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: ANIMATION_DURATIONS.exitTransition / 1000 }
  },
};

export const scaleInLarge: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: ANIMATION_DURATIONS.slow / 1000,
      ease: ANIMATION_EASINGS.default
    }
  },
  exit: { opacity: 0, scale: 0.8 },
};

export const scaleInSpring: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: ANIMATION_EASINGS.spring
  },
  exit: { opacity: 0, scale: 0.9 },
};

// ============================================================================
// Combined Animations
// ============================================================================

export const fadeSlideUp: Variants = {
  initial: { 
    opacity: 0, 
    y: ANIMATION_TRANSLATIONS.slideUp 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: ANIMATION_DURATIONS.pageTransition / 1000,
      ease: ANIMATION_EASINGS.default
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: ANIMATION_DURATIONS.exitTransition / 1000 }
  },
};

export const fadeScaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: ANIMATION_DURATIONS.normal / 1000,
      ease: ANIMATION_EASINGS.default
    }
  },
  exit: { opacity: 0, scale: 0.95 },
};

// ============================================================================
// Container Animations (for stagger effects)
// ============================================================================

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

// ============================================================================
// Hover Animations
// ============================================================================

export const cardHover: Variants = {
  rest: { 
    y: 0, 
    scale: 1,
    transition: { duration: ANIMATION_DURATIONS.normal / 1000 }
  },
  hover: { 
    y: ANIMATION_TRANSLATIONS.cardHoverUp, 
    scale: ANIMATION_SCALES.cardHover,
    transition: { duration: ANIMATION_DURATIONS.normal / 1000 }
  },
  tap: { 
    scale: ANIMATION_SCALES.active,
    transition: { duration: ANIMATION_DURATIONS.instant / 1000 }
  },
};

export const buttonHover: Variants = {
  rest: { 
    y: 0, 
    scale: 1,
    transition: { duration: ANIMATION_DURATIONS.fast / 1000 }
  },
  hover: { 
    y: ANIMATION_TRANSLATIONS.buttonHoverUp, 
    scale: ANIMATION_SCALES.buttonHover,
    transition: { duration: ANIMATION_DURATIONS.fast / 1000 }
  },
  tap: { 
    scale: ANIMATION_SCALES.active,
    transition: { duration: ANIMATION_DURATIONS.instant / 1000 }
  },
};

export const iconHover: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: ANIMATION_SCALES.iconHover,
    transition: { duration: ANIMATION_DURATIONS.fast / 1000 }
  },
  tap: { scale: 0.95 },
};

// ============================================================================
// Special Animations
// ============================================================================

export const shimmer: Variants = {
  initial: { x: '-100%' },
  animate: { 
    x: '200%',
    transition: {
      duration: ANIMATION_DURATIONS.shimmer / 1000,
      repeat: Infinity,
      ease: 'linear',
    }
  },
};

export const pulse: Variants = {
  initial: { opacity: 0.5 },
  animate: { 
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: ANIMATION_DURATIONS.pulse / 1000,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  },
};

export const bounce: Variants = {
  initial: { y: 0 },
  animate: { 
    y: [0, -10, 0, -5, 0],
    transition: {
      duration: 0.5,
      times: [0, 0.3, 0.5, 0.7, 1],
      ease: 'easeOut',
    }
  },
};

export const shake: Variants = {
  initial: { x: 0 },
  animate: { 
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
    }
  },
};

export const spin: Variants = {
  initial: { rotate: 0 },
  animate: { 
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    }
  },
};

// ============================================================================
// Modal/Overlay Animations
// ============================================================================

export const modalOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: ANIMATION_DURATIONS.fast / 1000 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: ANIMATION_DURATIONS.fast / 1000 }
  },
};

export const modalContent: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.95,
    y: 20
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: ANIMATION_DURATIONS.normal / 1000,
      ease: ANIMATION_EASINGS.default
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
    transition: { duration: ANIMATION_DURATIONS.exitTransition / 1000 }
  },
};

export const bottomSheet: Variants = {
  initial: { y: '100%' },
  animate: { 
    y: 0,
    transition: { 
      duration: ANIMATION_DURATIONS.normal / 1000,
      ease: ANIMATION_EASINGS.default
    }
  },
  exit: { 
    y: '100%',
    transition: { duration: ANIMATION_DURATIONS.fast / 1000 }
  },
};

// ============================================================================
// Scroll Reveal Animations
// ============================================================================

export const scrollReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: ANIMATION_DURATIONS.slow / 1000,
      ease: ANIMATION_EASINGS.default
    }
  },
};

export const scrollRevealScale: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: ANIMATION_DURATIONS.slow / 1000,
      ease: ANIMATION_EASINGS.default
    }
  },
};

// ============================================================================
// Page Transition Variants
// ============================================================================

export const pageTransition: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: ANIMATION_DURATIONS.pageTransition / 1000,
      ease: ANIMATION_EASINGS.default,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: ANIMATION_DURATIONS.exitTransition / 1000,
      when: 'afterChildren'
    }
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a custom stagger container with specified delay
 */
export function createStaggerContainer(staggerDelay: number = 0.1): Variants {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: staggerDelay / 2,
      },
    },
  };
}

/**
 * Create a custom slide animation with specified direction and distance
 */
export function createSlideAnimation(
  direction: 'up' | 'down' | 'left' | 'right',
  distance: number = 30
): Variants {
  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const value = direction === 'up' || direction === 'left' ? distance : -distance;
  
  return {
    initial: { opacity: 0, [axis]: value },
    animate: { 
      opacity: 1, 
      [axis]: 0,
      transition: { duration: ANIMATION_DURATIONS.normal / 1000 }
    },
    exit: { opacity: 0, [axis]: -value },
  };
}
