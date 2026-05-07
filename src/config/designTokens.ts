/**
 * Design Token System
 * 
 * Centralized design tokens for the ultra-premium UI system.
 * Inspired by Linear, Raycast, Vercel, Stripe, Mercury, and Notion.
 */

export interface ColorPalette {
  backgrounds: {
    base: string;
    card: string;
    elevated: string;
  };
  primary: {
    base: string;
    light: string;
    dark: string;
    rgb: string;
  };
  semantic: {
    success: GradientColor;
    warning: GradientColor;
    error: GradientColor;
    info: GradientColor;
  };
  text: {
    heading: string;
    body: string;
    secondary: string;
    disabled: string;
  };
  borders: {
    subtle: string;
    default: string;
    strong: string;
  };
  gradients: {
    primary: string;
    success: string;
    warning: string;
    error: string;
    mesh: string[];
  };
}

export interface GradientColor {
  solid: string;
  gradient: string;
  rgb: string;
}

export interface TypographySystem {
  fontFamilies: {
    sans: string;
    mono: string;
    display: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeights: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface SpacingSystem {
  base: number;
  scale: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
  };
  layout: {
    cardPadding: string;
    sectionGap: string;
    elementGap: string;
  };
}

export interface ShadowSystem {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  colored: {
    primary: string;
    success: string;
    error: string;
  };
}

export interface AnimationSystem {
  durations: {
    micro: number;
    fast: number;
    normal: number;
    slow: number;
    decorative: number;
  };
  easing: {
    standard: string;
    decelerate: string;
    accelerate: string;
    sharp: string;
  };
  stagger: {
    delay: number;
  };
}

export interface DesignTokens {
  colors: ColorPalette;
  typography: TypographySystem;
  spacing: SpacingSystem;
  shadows: ShadowSystem;
  animation: AnimationSystem;
}

// ============================================================================
// DESIGN TOKENS CONFIGURATION
// ============================================================================

export const DESIGN_TOKENS: DesignTokens = {
  // ==========================================================================
  // COLOR SYSTEM
  // ==========================================================================
  colors: {
    // Background layers - sophisticated neutrals
    backgrounds: {
      base: '#0A0A0F',      // Deep background
      card: '#12121A',      // Card surface
      elevated: '#1A1A24',  // Modal/overlay
    },

    // Primary brand colors
    primary: {
      base: '#667EEA',
      light: '#8B9FFF',
      dark: '#5568D3',
      rgb: '102, 126, 234',
    },

    // Semantic colors with gradients
    semantic: {
      success: {
        solid: '#10B981',
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        rgb: '16, 185, 129',
      },
      warning: {
        solid: '#F59E0B',
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        rgb: '245, 158, 11',
      },
      error: {
        solid: '#EF4444',
        gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        rgb: '239, 68, 68',
      },
      info: {
        solid: '#3B82F6',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        rgb: '59, 130, 246',
      },
    },

    // Text hierarchy - 4 levels
    text: {
      heading: 'rgba(255, 255, 255, 0.95)',   // 95% opacity
      body: 'rgba(255, 255, 255, 0.85)',      // 85% opacity
      secondary: 'rgba(255, 255, 255, 0.60)', // 60% opacity
      disabled: 'rgba(255, 255, 255, 0.35)',  // 35% opacity
    },

    // Ultra-subtle borders
    borders: {
      subtle: 'rgba(255, 255, 255, 0.06)',
      default: 'rgba(255, 255, 255, 0.10)',
      strong: 'rgba(255, 255, 255, 0.15)',
    },

    // Gradient system
    gradients: {
      primary: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      mesh: [
        'radial-gradient(at 0% 0%, rgba(102, 126, 234, 0.3) 0px, transparent 50%)',
        'radial-gradient(at 100% 0%, rgba(118, 75, 162, 0.3) 0px, transparent 50%)',
        'radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.2) 0px, transparent 50%)',
        'radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.2) 0px, transparent 50%)',
      ],
    },
  },

  // ==========================================================================
  // TYPOGRAPHY SYSTEM
  // ==========================================================================
  typography: {
    fontFamilies: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", Consolas, Monaco, "Courier New", monospace',
      display: 'Inter, system-ui, sans-serif',
    },

    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },

    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.025em',
    },

    lineHeights: {
      tight: 1.25,
      normal: 1.6,
      relaxed: 1.75,
    },
  },

  // ==========================================================================
  // SPACING SYSTEM
  // ==========================================================================
  spacing: {
    base: 4, // 4px base unit

    scale: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px',
      32: '128px',
    },

    layout: {
      cardPadding: '24px',
      sectionGap: '80px',
      elementGap: '12px',
    },
  },

  // ==========================================================================
  // SHADOW SYSTEM
  // ==========================================================================
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.2)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',

    colored: {
      primary: '0 10px 30px rgba(102, 126, 234, 0.3)',
      success: '0 10px 30px rgba(16, 185, 129, 0.3)',
      error: '0 10px 30px rgba(239, 68, 68, 0.3)',
    },
  },

  // ==========================================================================
  // ANIMATION SYSTEM
  // ==========================================================================
  animation: {
    durations: {
      micro: 150,      // Micro-interactions
      fast: 200,       // Button feedback
      normal: 300,     // Standard transitions
      slow: 400,       // Page transitions
      decorative: 600, // Decorative animations
    },

    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
      accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },

    stagger: {
      delay: 60, // 60ms between staggered elements
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get CSS custom property value
 */
export const getCSSVar = (token: string): string => {
  return `var(--${token})`;
};

/**
 * Convert design token to CSS custom properties
 */
export const generateCSSVariables = (): Record<string, string> => {
  const tokens = DESIGN_TOKENS;
  
  return {
    // Colors
    '--color-bg-base': tokens.colors.backgrounds.base,
    '--color-bg-card': tokens.colors.backgrounds.card,
    '--color-bg-elevated': tokens.colors.backgrounds.elevated,
    
    '--color-primary': tokens.colors.primary.base,
    '--color-primary-light': tokens.colors.primary.light,
    '--color-primary-dark': tokens.colors.primary.dark,
    '--color-primary-rgb': tokens.colors.primary.rgb,
    
    '--color-success': tokens.colors.semantic.success.solid,
    '--color-success-rgb': tokens.colors.semantic.success.rgb,
    '--color-warning': tokens.colors.semantic.warning.solid,
    '--color-warning-rgb': tokens.colors.semantic.warning.rgb,
    '--color-error': tokens.colors.semantic.error.solid,
    '--color-error-rgb': tokens.colors.semantic.error.rgb,
    '--color-info': tokens.colors.semantic.info.solid,
    '--color-info-rgb': tokens.colors.semantic.info.rgb,
    
    '--color-text-heading': tokens.colors.text.heading,
    '--color-text-body': tokens.colors.text.body,
    '--color-text-secondary': tokens.colors.text.secondary,
    '--color-text-disabled': tokens.colors.text.disabled,
    
    '--color-border-subtle': tokens.colors.borders.subtle,
    '--color-border-default': tokens.colors.borders.default,
    '--color-border-strong': tokens.colors.borders.strong,
    
    '--gradient-primary': tokens.colors.gradients.primary,
    '--gradient-success': tokens.colors.gradients.success,
    '--gradient-warning': tokens.colors.gradients.warning,
    '--gradient-error': tokens.colors.gradients.error,
    
    // Typography
    '--font-sans': tokens.typography.fontFamilies.sans,
    '--font-mono': tokens.typography.fontFamilies.mono,
    
    // Shadows
    '--shadow-sm': tokens.shadows.sm,
    '--shadow-md': tokens.shadows.md,
    '--shadow-lg': tokens.shadows.lg,
    '--shadow-xl': tokens.shadows.xl,
    '--shadow-2xl': tokens.shadows['2xl'],
    '--shadow-primary': tokens.shadows.colored.primary,
    '--shadow-success': tokens.shadows.colored.success,
    '--shadow-error': tokens.shadows.colored.error,
    
    // Animation
    '--duration-micro': `${tokens.animation.durations.micro}ms`,
    '--duration-fast': `${tokens.animation.durations.fast}ms`,
    '--duration-normal': `${tokens.animation.durations.normal}ms`,
    '--duration-slow': `${tokens.animation.durations.slow}ms`,
    '--easing-standard': tokens.animation.easing.standard,
  };
};

export default DESIGN_TOKENS;
