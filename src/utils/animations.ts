/**
 * Animation Utilities for Premium Customer Home
 * 
 * Centralized Framer Motion animation variants and configurations
 * for consistent animations across the application.
 */

import { Variants } from 'framer-motion';
import { DESIGN_TOKENS } from '../config/designTokens';

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================

export const ANIMATION_CONFIG = {
  durations: DESIGN_TOKENS.animation.durations,
  easing: {
    standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
    decelerate: [0, 0, 0.2, 1] as [number, number, number, number],
    accelerate: [0.4, 0, 1, 1] as [number, number, number, number],
  },
  stagger: {
    delay: DESIGN_TOKENS.animation.stagger.delay / 1000, // Convert to seconds
  },
};

// ============================================================================
// REDUCED MOTION DETECTION
// ============================================================================

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getAnimationProps = (variants: Variants) => {
  if (prefersReducedMotion()) {
    return { initial: false, animate: false };
  }
  return { initial: 'initial', animate: 'animate', variants };
};

// ============================================================================
// PAGE ANIMATIONS
// ============================================================================

export const pageVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal / 1000,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: ANIMATION_CONFIG.durations.fast / 1000,
      ease: ANIMATION_CONFIG.easing.accelerate,
    },
  },
};

// ============================================================================
// BUSINESS CARD ANIMATIONS
// ============================================================================

export const cardContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger.delay,
      delayChildren: 0.1,
    },
  },
};

export const cardVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 30, 
    scale: 0.95 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal / 1000,
      ease: ANIMATION_CONFIG.easing.decelerate,
    },
  },
};

export const cardHoverVariants: Variants = {
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: ANIMATION_CONFIG.durations.fast / 1000,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: ANIMATION_CONFIG.durations.micro / 1000,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
};

// ============================================================================
// CATEGORY PILL ANIMATIONS
// ============================================================================

export const pillVariants: Variants = {
  hover: { 
    scale: 1.05,
    transition: { 
      duration: ANIMATION_CONFIG.durations.fast / 1000,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
  tap: { 
    scale: 0.95,
    transition: { 
      duration: ANIMATION_CONFIG.durations.micro / 1000,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
};

// ============================================================================
// FAVORITE BUTTON ANIMATIONS
// ============================================================================

export const favoriteVariants: Variants = {
  inactive: { 
    scale: 1 
  },
  active: { 
    scale: [1, 1.3, 1],
    transition: { 
      duration: ANIMATION_CONFIG.durations.normal / 1000,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
};

// ============================================================================
// FADE IN ANIMATIONS
// ============================================================================

export const fadeInVariants: Variants = {
  initial: { 
    opacity: 0 
  },
  animate: { 
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal / 1000,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
};

// ============================================================================
// SLIDE IN ANIMATIONS
// ============================================================================

export const slideInFromBottomVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal / 1000,
      ease: ANIMATION_CONFIG.easing.decelerate,
    },
  },
};

export const slideInFromTopVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: -20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal / 1000,
      ease: ANIMATION_CONFIG.easing.decelerate,
    },
  },
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleInVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.9 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: ANIMATION_CONFIG.durations.normal / 1000,
      ease: ANIMATION_CONFIG.easing.decelerate,
    },
  },
};

// ============================================================================
// STAGGER CONTAINER
// ============================================================================

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger.delay,
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create custom stagger animation with configurable delay
 */
export const createStaggerVariants = (staggerDelay: number = ANIMATION_CONFIG.stagger.delay): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

/**
 * Create custom fade in animation with configurable duration
 */
export const createFadeInVariants = (duration: number = ANIMATION_CONFIG.durations.normal): Variants => ({
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: duration / 1000,
      ease: ANIMATION_CONFIG.easing.standard,
    },
  },
});

/**
 * Create custom slide animation with configurable direction and distance
 */
export const createSlideVariants = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance: number = 20
): Variants => {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const value = direction === 'down' || direction === 'right' ? distance : -distance;

  return {
    initial: { 
      opacity: 0, 
      [axis]: value 
    },
    animate: { 
      opacity: 1, 
      [axis]: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.normal / 1000,
        ease: ANIMATION_CONFIG.easing.decelerate,
      },
    },
  };
};
