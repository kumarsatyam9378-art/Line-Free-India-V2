/**
 * Gradient Configuration System
 * 
 * This file defines all gradient color palettes and animated gradient orb configurations
 * for different page types and themes (light/dark mode).
 */

export interface GradientOrb {
  color: string;
  size: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  blur: number;
  opacity: number;
  animation: {
    x: string[];
    y: string[];
    scale: number[];
    duration: number;
  };
}

export interface GradientPalette {
  dark: GradientOrb[];
  light: GradientOrb[];
}

export const GRADIENT_PALETTES: Record<string, GradientPalette> = {
  customer: {
    dark: [
      {
        color: 'rgba(0, 240, 255, 0.25)',
        size: '55vw',
        position: { top: '-15%', left: '-10%' },
        blur: 80,
        opacity: 0.6,
        animation: {
          x: ['-15%', '15%', '-10%', '10%', '-15%'],
          y: ['-15%', '10%', '-5%', '15%', '-15%'],
          scale: [1, 1.15, 1.05, 1.2, 1],
          duration: 18,
        },
      },
      {
        color: 'rgba(139, 92, 246, 0.20)',
        size: '50vw',
        position: { top: '20%', right: '-5%' },
        blur: 100,
        opacity: 0.5,
        animation: {
          x: ['5%', '-10%', '8%', '-5%', '5%'],
          y: ['20%', '35%', '25%', '40%', '20%'],
          scale: [1, 1.1, 1.2, 1.05, 1],
          duration: 20,
        },
      },
      {
        color: 'rgba(244, 63, 94, 0.18)',
        size: '45vw',
        position: { bottom: '-10%', left: '15%' },
        blur: 90,
        opacity: 0.4,
        animation: {
          x: ['15%', '25%', '10%', '30%', '15%'],
          y: ['-10%', '5%', '-5%', '10%', '-10%'],
          scale: [1, 1.25, 1.1, 1.15, 1],
          duration: 22,
        },
      },
      {
        color: 'rgba(245, 158, 11, 0.15)',
        size: '40vw',
        position: { bottom: '10%', right: '10%' },
        blur: 85,
        opacity: 0.35,
        animation: {
          x: ['10%', '-5%', '15%', '0%', '10%'],
          y: ['10%', '20%', '5%', '25%', '10%'],
          scale: [1, 1.18, 1.08, 1.22, 1],
          duration: 25,
        },
      },
    ],
    light: [
      {
        color: 'rgba(0, 240, 255, 0.08)',
        size: '55vw',
        position: { top: '-15%', left: '-10%' },
        blur: 100,
        opacity: 0.8,
        animation: {
          x: ['-15%', '15%', '-10%', '10%', '-15%'],
          y: ['-15%', '10%', '-5%', '15%', '-15%'],
          scale: [1, 1.15, 1.05, 1.2, 1],
          duration: 18,
        },
      },
      {
        color: 'rgba(139, 92, 246, 0.06)',
        size: '50vw',
        position: { top: '20%', right: '-5%' },
        blur: 120,
        opacity: 0.7,
        animation: {
          x: ['5%', '-10%', '8%', '-5%', '5%'],
          y: ['20%', '35%', '25%', '40%', '20%'],
          scale: [1, 1.1, 1.2, 1.05, 1],
          duration: 20,
        },
      },
    ],
  },

  business: {
    dark: [
      {
        color: 'rgba(16, 185, 129, 0.25)',
        size: '55vw',
        position: { top: '-10%', left: '-15%' },
        blur: 80,
        opacity: 0.6,
        animation: {
          x: ['-15%', '10%', '-10%', '15%', '-15%'],
          y: ['-10%', '15%', '-5%', '20%', '-10%'],
          scale: [1, 1.2, 1.1, 1.15, 1],
          duration: 19,
        },
      },
      {
        color: 'rgba(6, 182, 212, 0.20)',
        size: '50vw',
        position: { top: '25%', right: '-10%' },
        blur: 90,
        opacity: 0.5,
        animation: {
          x: ['-10%', '10%', '-5%', '15%', '-10%'],
          y: ['25%', '40%', '30%', '45%', '25%'],
          scale: [1, 1.15, 1.25, 1.1, 1],
          duration: 21,
        },
      },
      {
        color: 'rgba(139, 92, 246, 0.15)',
        size: '45vw',
        position: { bottom: '-5%', left: '20%' },
        blur: 85,
        opacity: 0.4,
        animation: {
          x: ['20%', '30%', '15%', '35%', '20%'],
          y: ['-5%', '10%', '0%', '15%', '-5%'],
          scale: [1, 1.22, 1.12, 1.18, 1],
          duration: 23,
        },
      },
    ],
    light: [
      {
        color: 'rgba(16, 185, 129, 0.08)',
        size: '55vw',
        position: { top: '-10%', left: '-15%' },
        blur: 100,
        opacity: 0.8,
        animation: {
          x: ['-15%', '10%', '-10%', '15%', '-15%'],
          y: ['-10%', '15%', '-5%', '20%', '-10%'],
          scale: [1, 1.2, 1.1, 1.15, 1],
          duration: 19,
        },
      },
      {
        color: 'rgba(6, 182, 212, 0.06)',
        size: '50vw',
        position: { top: '25%', right: '-10%' },
        blur: 110,
        opacity: 0.7,
        animation: {
          x: ['-10%', '10%', '-5%', '15%', '-10%'],
          y: ['25%', '40%', '30%', '45%', '25%'],
          scale: [1, 1.15, 1.25, 1.1, 1],
          duration: 21,
        },
      },
    ],
  },

  auth: {
    dark: [
      {
        color: 'rgba(0, 240, 255, 0.30)',
        size: '60vw',
        position: { top: '-20%', left: '-15%' },
        blur: 90,
        opacity: 0.7,
        animation: {
          x: ['-15%', '20%', '-10%', '15%', '-15%'],
          y: ['-20%', '10%', '-10%', '15%', '-20%'],
          scale: [1, 1.25, 1.15, 1.3, 1],
          duration: 17,
        },
      },
      {
        color: 'rgba(244, 63, 94, 0.25)',
        size: '55vw',
        position: { top: '15%', right: '-10%' },
        blur: 100,
        opacity: 0.6,
        animation: {
          x: ['-10%', '15%', '-5%', '20%', '-10%'],
          y: ['15%', '30%', '20%', '35%', '15%'],
          scale: [1, 1.2, 1.3, 1.15, 1],
          duration: 19,
        },
      },
      {
        color: 'rgba(245, 158, 11, 0.20)',
        size: '50vw',
        position: { bottom: '-15%', left: '10%' },
        blur: 95,
        opacity: 0.5,
        animation: {
          x: ['10%', '25%', '15%', '30%', '10%'],
          y: ['-15%', '5%', '-10%', '10%', '-15%'],
          scale: [1, 1.28, 1.18, 1.22, 1],
          duration: 21,
        },
      },
      {
        color: 'rgba(139, 92, 246, 0.18)',
        size: '45vw',
        position: { bottom: '5%', right: '15%' },
        blur: 88,
        opacity: 0.45,
        animation: {
          x: ['15%', '0%', '20%', '5%', '15%'],
          y: ['5%', '20%', '10%', '25%', '5%'],
          scale: [1, 1.2, 1.1, 1.25, 1],
          duration: 24,
        },
      },
    ],
    light: [
      {
        color: 'rgba(0, 240, 255, 0.10)',
        size: '60vw',
        position: { top: '-20%', left: '-15%' },
        blur: 110,
        opacity: 0.9,
        animation: {
          x: ['-15%', '20%', '-10%', '15%', '-15%'],
          y: ['-20%', '10%', '-10%', '15%', '-20%'],
          scale: [1, 1.25, 1.15, 1.3, 1],
          duration: 17,
        },
      },
      {
        color: 'rgba(244, 63, 94, 0.08)',
        size: '55vw',
        position: { top: '15%', right: '-10%' },
        blur: 120,
        opacity: 0.8,
        animation: {
          x: ['-10%', '15%', '-5%', '20%', '-10%'],
          y: ['15%', '30%', '20%', '35%', '15%'],
          scale: [1, 1.2, 1.3, 1.15, 1],
          duration: 19,
        },
      },
      {
        color: 'rgba(245, 158, 11, 0.06)',
        size: '50vw',
        position: { bottom: '-15%', left: '10%' },
        blur: 115,
        opacity: 0.7,
        animation: {
          x: ['10%', '25%', '15%', '30%', '10%'],
          y: ['-15%', '5%', '-10%', '10%', '-15%'],
          scale: [1, 1.28, 1.18, 1.22, 1],
          duration: 21,
        },
      },
    ],
  },

  landing: {
    dark: [
      {
        color: 'rgba(99, 102, 241, 0.22)',
        size: '50vw',
        position: { top: '-10%', left: '-10%' },
        blur: 85,
        opacity: 0.55,
        animation: {
          x: ['-10%', '15%', '-5%', '10%', '-10%'],
          y: ['-10%', '12%', '-5%', '18%', '-10%'],
          scale: [1, 1.18, 1.08, 1.22, 1],
          duration: 20,
        },
      },
      {
        color: 'rgba(168, 85, 247, 0.18)',
        size: '45vw',
        position: { top: '30%', right: '-8%' },
        blur: 92,
        opacity: 0.48,
        animation: {
          x: ['-8%', '12%', '-3%', '15%', '-8%'],
          y: ['30%', '45%', '35%', '50%', '30%'],
          scale: [1, 1.15, 1.25, 1.12, 1],
          duration: 22,
        },
      },
      {
        color: 'rgba(6, 182, 212, 0.16)',
        size: '48vw',
        position: { bottom: '-8%', left: '18%' },
        blur: 88,
        opacity: 0.42,
        animation: {
          x: ['18%', '28%', '13%', '33%', '18%'],
          y: ['-8%', '8%', '-3%', '12%', '-8%'],
          scale: [1, 1.24, 1.14, 1.19, 1],
          duration: 24,
        },
      },
    ],
    light: [
      {
        color: 'rgba(99, 102, 241, 0.07)',
        size: '50vw',
        position: { top: '-10%', left: '-10%' },
        blur: 105,
        opacity: 0.75,
        animation: {
          x: ['-10%', '15%', '-5%', '10%', '-10%'],
          y: ['-10%', '12%', '-5%', '18%', '-10%'],
          scale: [1, 1.18, 1.08, 1.22, 1],
          duration: 20,
        },
      },
      {
        color: 'rgba(168, 85, 247, 0.05)',
        size: '45vw',
        position: { top: '30%', right: '-8%' },
        blur: 112,
        opacity: 0.68,
        animation: {
          x: ['-8%', '12%', '-3%', '15%', '-8%'],
          y: ['30%', '45%', '35%', '50%', '30%'],
          scale: [1, 1.15, 1.25, 1.12, 1],
          duration: 22,
        },
      },
    ],
  },

  dashboard: {
    dark: [
      {
        color: 'rgba(6, 182, 212, 0.28)',
        size: '52vw',
        position: { top: '-12%', left: '-12%' },
        blur: 82,
        opacity: 0.62,
        animation: {
          x: ['-12%', '18%', '-8%', '12%', '-12%'],
          y: ['-12%', '14%', '-7%', '20%', '-12%'],
          scale: [1, 1.2, 1.1, 1.25, 1],
          duration: 18,
        },
      },
      {
        color: 'rgba(14, 165, 233, 0.22)',
        size: '48vw',
        position: { top: '28%', right: '-10%' },
        blur: 90,
        opacity: 0.52,
        animation: {
          x: ['-10%', '14%', '-5%', '18%', '-10%'],
          y: ['28%', '43%', '33%', '48%', '28%'],
          scale: [1, 1.17, 1.27, 1.13, 1],
          duration: 21,
        },
      },
      {
        color: 'rgba(99, 102, 241, 0.18)',
        size: '46vw',
        position: { bottom: '-10%', left: '16%' },
        blur: 86,
        opacity: 0.44,
        animation: {
          x: ['16%', '26%', '11%', '31%', '16%'],
          y: ['-10%', '6%', '-5%', '11%', '-10%'],
          scale: [1, 1.26, 1.16, 1.21, 1],
          duration: 23,
        },
      },
    ],
    light: [
      {
        color: 'rgba(6, 182, 212, 0.09)',
        size: '52vw',
        position: { top: '-12%', left: '-12%' },
        blur: 102,
        opacity: 0.82,
        animation: {
          x: ['-12%', '18%', '-8%', '12%', '-12%'],
          y: ['-12%', '14%', '-7%', '20%', '-12%'],
          scale: [1, 1.2, 1.1, 1.25, 1],
          duration: 18,
        },
      },
      {
        color: 'rgba(14, 165, 233, 0.07)',
        size: '48vw',
        position: { top: '28%', right: '-10%' },
        blur: 110,
        opacity: 0.72,
        animation: {
          x: ['-10%', '14%', '-5%', '18%', '-10%'],
          y: ['28%', '43%', '33%', '48%', '28%'],
          scale: [1, 1.17, 1.27, 1.13, 1],
          duration: 21,
        },
      },
    ],
  },

  default: {
    dark: [
      {
        color: 'rgba(99, 102, 241, 0.20)',
        size: '50vw',
        position: { top: '-10%', left: '-10%' },
        blur: 85,
        opacity: 0.5,
        animation: {
          x: ['-10%', '10%', '-5%', '15%', '-10%'],
          y: ['-10%', '10%', '-5%', '15%', '-10%'],
          scale: [1, 1.15, 1.05, 1.2, 1],
          duration: 20,
        },
      },
      {
        color: 'rgba(168, 85, 247, 0.15)',
        size: '45vw',
        position: { bottom: '-10%', right: '-10%' },
        blur: 90,
        opacity: 0.4,
        animation: {
          x: ['-10%', '10%', '-5%', '15%', '-10%'],
          y: ['-10%', '10%', '-5%', '15%', '-10%'],
          scale: [1, 1.2, 1.1, 1.15, 1],
          duration: 22,
        },
      },
    ],
    light: [
      {
        color: 'rgba(99, 102, 241, 0.06)',
        size: '50vw',
        position: { top: '-10%', left: '-10%' },
        blur: 105,
        opacity: 0.7,
        animation: {
          x: ['-10%', '10%', '-5%', '15%', '-10%'],
          y: ['-10%', '10%', '-5%', '15%', '-10%'],
          scale: [1, 1.15, 1.05, 1.2, 1],
          duration: 20,
        },
      },
      {
        color: 'rgba(168, 85, 247, 0.05)',
        size: '45vw',
        position: { bottom: '-10%', right: '-10%' },
        blur: 110,
        opacity: 0.6,
        animation: {
          x: ['-10%', '10%', '-5%', '15%', '-10%'],
          y: ['-10%', '10%', '-5%', '15%', '-10%'],
          scale: [1, 1.2, 1.1, 1.15, 1],
          duration: 22,
        },
      },
    ],
  },
};

// Helper function to get gradient palette based on variant and theme
export function getGradientPalette(
  variant: keyof typeof GRADIENT_PALETTES,
  theme: 'light' | 'dark'
): GradientOrb[] {
  const palette = GRADIENT_PALETTES[variant] || GRADIENT_PALETTES.default;
  return palette[theme];
}

// Helper function to get mobile-optimized gradient palette (reduced orb count)
export function getMobileGradientPalette(
  variant: keyof typeof GRADIENT_PALETTES,
  theme: 'light' | 'dark'
): GradientOrb[] {
  const fullPalette = getGradientPalette(variant, theme);
  // Return only first 2 orbs for mobile optimization
  return fullPalette.slice(0, 2).map(orb => ({
    ...orb,
    blur: 60, // Reduced blur for mobile
    size: orb.size.replace(/\d+/, (match) => String(Math.floor(parseInt(match) * 0.8))), // 80% size
  }));
}
