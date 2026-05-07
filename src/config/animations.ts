/**
 * Centralized Animation Configuration
 * 
 * This file contains all animation constants used throughout the application.
 * All timing values, easing functions, scale factors, and other animation
 * parameters are defined here for consistency and easy maintenance.
 */

export const ANIMATION_DURATIONS = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
  pageTransition: 400,
  exitTransition: 200,
  shimmer: 1500,
  pulse: 2000,
  gradientOrb: 18000,
} as const;

export const ANIMATION_EASINGS = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring' as const, stiffness: 400, damping: 25 },
  springSoft: { type: 'spring' as const, stiffness: 200, damping: 35 },
} as const;

export const ANIMATION_SCALES = {
  hover: 1.02,
  hoverLarge: 1.05,
  active: 0.98,
  activeSmall: 0.95,
  cardHover: 1.02,
  buttonHover: 1.02,
  iconHover: 1.1,
} as const;

export const ANIMATION_TRANSLATIONS = {
  hoverUp: -4,
  hoverUpLarge: -8,
  slideUp: 30,
  slideUpLarge: 40,
  buttonHoverUp: -2,
  cardHoverUp: -4,
} as const;

export const BLUR_VALUES = {
  glass: 16,
  glassStrong: 20,
  gradient: 80,
  gradientLarge: 100,
  gradientMobile: 60,
  input: 10,
  backdrop: 8,
} as const;

export const SHADOW_VALUES = {
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  cardHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  button: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
  buttonHover: '0 6px 20px rgba(0, 0, 0, 0.15)',
  glow: '0 8px 32px rgba(0, 240, 255, 0.3)',
  glowPurple: '0 8px 32px rgba(139, 92, 246, 0.3)',
  glowPink: '0 8px 32px rgba(244, 63, 94, 0.3)',
} as const;

export const STAGGER_DELAYS = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.2,
  card: 0.05,
  listItem: 0.1,
} as const;

export const OPACITY_VALUES = {
  gradientDark: 0.25,
  gradientLight: 0.08,
  glassCard: 0.05,
  disabled: 0.4,
  hover: 0.8,
} as const;

// TypeScript types for animation configurations
export type AnimationDuration = typeof ANIMATION_DURATIONS[keyof typeof ANIMATION_DURATIONS];
export type AnimationEasing = typeof ANIMATION_EASINGS[keyof typeof ANIMATION_EASINGS];
export type AnimationScale = typeof ANIMATION_SCALES[keyof typeof ANIMATION_SCALES];
export type AnimationTranslation = typeof ANIMATION_TRANSLATIONS[keyof typeof ANIMATION_TRANSLATIONS];
export type BlurValue = typeof BLUR_VALUES[keyof typeof BLUR_VALUES];
export type ShadowValue = typeof SHADOW_VALUES[keyof typeof SHADOW_VALUES];
export type StaggerDelay = typeof STAGGER_DELAYS[keyof typeof STAGGER_DELAYS];
export type OpacityValue = typeof OPACITY_VALUES[keyof typeof OPACITY_VALUES];

// Animation configuration object type
export interface AnimationConfig {
  duration?: AnimationDuration;
  easing?: AnimationEasing | string;
  scale?: AnimationScale;
  translation?: AnimationTranslation;
  delay?: number;
}

// Validate animation configuration in development mode
export function validateAnimationConfig(config: AnimationConfig): boolean {
  if (process.env.NODE_ENV === 'development') {
    if (config.duration && (config.duration < 0 || config.duration > 10000)) {
      console.warn(`Invalid animation duration: ${config.duration}ms. Should be between 0-10000ms.`);
      return false;
    }
    if (config.scale && (config.scale < 0.5 || config.scale > 2)) {
      console.warn(`Invalid animation scale: ${config.scale}. Should be between 0.5-2.`);
      return false;
    }
  }
  return true;
}
