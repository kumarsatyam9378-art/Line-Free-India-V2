/**
 * Glass Morphism Utilities
 * 
 * Utility functions and CSS classes for creating premium glass morphism effects
 * throughout the application.
 */

import { DESIGN_TOKENS } from '../config/designTokens';

// ============================================================================
// GLASS MORPHISM PRESETS
// ============================================================================

export interface GlassMorphismConfig {
  background: string;
  backdropFilter: string;
  border: string;
  boxShadow: string;
}

/**
 * Standard glass card effect
 */
export const glassCard: GlassMorphismConfig = {
  background: 'rgba(18, 18, 26, 0.7)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${DESIGN_TOKENS.colors.borders.subtle}`,
  boxShadow: DESIGN_TOKENS.shadows.lg,
};

/**
 * Elevated glass effect (for modals, popovers)
 */
export const glassElevated: GlassMorphismConfig = {
  background: 'rgba(26, 26, 36, 0.8)',
  backdropFilter: 'blur(24px)',
  border: `1px solid ${DESIGN_TOKENS.colors.borders.default}`,
  boxShadow: DESIGN_TOKENS.shadows.xl,
};

/**
 * Subtle glass effect (for backgrounds, sections)
 */
export const glassSubtle: GlassMorphismConfig = {
  background: 'rgba(18, 18, 26, 0.5)',
  backdropFilter: 'blur(16px)',
  border: `1px solid ${DESIGN_TOKENS.colors.borders.subtle}`,
  boxShadow: DESIGN_TOKENS.shadows.md,
};

/**
 * Strong glass effect (for important UI elements)
 */
export const glassStrong: GlassMorphismConfig = {
  background: 'rgba(26, 26, 36, 0.9)',
  backdropFilter: 'blur(32px)',
  border: `1px solid ${DESIGN_TOKENS.colors.borders.strong}`,
  boxShadow: DESIGN_TOKENS.shadows['2xl'],
};

// ============================================================================
// GLASS MORPHISM GENERATOR
// ============================================================================

export interface GlassOptions {
  opacity?: number;
  blur?: number;
  borderOpacity?: number;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/**
 * Generate custom glass morphism styles
 */
export const createGlassEffect = (options: GlassOptions = {}): GlassMorphismConfig => {
  const {
    opacity = 0.7,
    blur = 20,
    borderOpacity = 0.1,
    shadow = 'lg',
  } = options;

  return {
    background: `rgba(18, 18, 26, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
    boxShadow: DESIGN_TOKENS.shadows[shadow],
  };
};

// ============================================================================
// CSS CLASS GENERATORS
// ============================================================================

/**
 * Generate inline styles for glass morphism
 */
export const getGlassStyles = (config: GlassMorphismConfig): React.CSSProperties => ({
  background: config.background,
  backdropFilter: config.backdropFilter,
  WebkitBackdropFilter: config.backdropFilter, // Safari support
  border: config.border,
  boxShadow: config.boxShadow,
});

/**
 * Generate Tailwind-compatible class string for glass morphism
 */
export const getGlassClasses = (preset: 'card' | 'elevated' | 'subtle' | 'strong' = 'card'): string => {
  const baseClasses = 'backdrop-blur-xl border';
  
  const presetClasses = {
    card: 'bg-card/70 border-white/5 shadow-lg',
    elevated: 'bg-card-2/80 border-white/10 shadow-xl',
    subtle: 'bg-card/50 border-white/5 shadow-md',
    strong: 'bg-card-2/90 border-white/15 shadow-2xl',
  };

  return `${baseClasses} ${presetClasses[preset]}`;
};

// ============================================================================
// GRADIENT OVERLAY UTILITIES
// ============================================================================

/**
 * Create gradient overlay for glass cards
 */
export const createGradientOverlay = (
  color: 'primary' | 'success' | 'warning' | 'error' = 'primary',
  opacity: number = 0.1
): string => {
  const gradients = {
    primary: DESIGN_TOKENS.colors.gradients.primary,
    success: DESIGN_TOKENS.colors.gradients.success,
    warning: DESIGN_TOKENS.colors.gradients.warning,
    error: DESIGN_TOKENS.colors.gradients.error,
  };

  return `linear-gradient(135deg, rgba(${DESIGN_TOKENS.colors.primary.rgb}, ${opacity}) 0%, transparent 100%)`;
};

// ============================================================================
// MESH GRADIENT BACKGROUND
// ============================================================================

/**
 * Create mesh gradient background for sections
 */
export const getMeshGradientStyles = (): React.CSSProperties => ({
  background: DESIGN_TOKENS.colors.backgrounds.base,
  backgroundImage: DESIGN_TOKENS.colors.gradients.mesh.join(', '),
  backgroundBlendMode: 'normal',
});

// ============================================================================
// FROSTED GLASS UTILITIES
// ============================================================================

/**
 * Create frosted glass effect with noise texture
 */
export const createFrostedGlass = (options: GlassOptions = {}): GlassMorphismConfig => {
  const baseGlass = createGlassEffect(options);
  
  return {
    ...baseGlass,
    background: `${baseGlass.background}, url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if browser supports backdrop-filter
 */
export const supportsBackdropFilter = (): boolean => {
  if (typeof window === 'undefined') return false;
  return CSS.supports('backdrop-filter', 'blur(1px)') || 
         CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
};

/**
 * Get fallback styles for browsers that don't support backdrop-filter
 */
export const getGlassFallback = (config: GlassMorphismConfig): React.CSSProperties => {
  if (supportsBackdropFilter()) {
    return getGlassStyles(config);
  }
  
  // Fallback: increase opacity for better visibility
  return {
    background: config.background.replace(/[\d.]+\)$/, '0.95)'),
    border: config.border,
    boxShadow: config.boxShadow,
  };
};

// ============================================================================
// EXPORT PRESETS
// ============================================================================

export const GLASS_PRESETS = {
  card: glassCard,
  elevated: glassElevated,
  subtle: glassSubtle,
  strong: glassStrong,
} as const;

export type GlassPreset = keyof typeof GLASS_PRESETS;
