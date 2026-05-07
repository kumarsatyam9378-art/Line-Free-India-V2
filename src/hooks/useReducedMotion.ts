import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user prefers reduced motion
 * Respects the prefers-reduced-motion media query
 * 
 * @returns {boolean} true if user prefers reduced motion, false otherwise
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * 
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
 * />
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if the browser supports matchMedia
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create event listener for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add event listener (use addEventListener for better browser support)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation duration based on reduced motion preference
 * Returns 0 if reduced motion is preferred, otherwise returns the provided duration
 * 
 * @param duration - The desired animation duration in seconds
 * @param prefersReducedMotion - Whether the user prefers reduced motion
 * @returns The adjusted duration
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * const duration = getAnimationDuration(0.3, prefersReducedMotion);
 * ```
 */
export function getAnimationDuration(
  duration: number,
  prefersReducedMotion: boolean
): number {
  return prefersReducedMotion ? 0 : duration;
}

/**
 * Get animation config based on reduced motion preference
 * Returns minimal animation config if reduced motion is preferred
 * 
 * @param config - The desired animation configuration
 * @param prefersReducedMotion - Whether the user prefers reduced motion
 * @returns The adjusted animation config
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * const config = getAnimationConfig(
 *   { duration: 0.3, ease: 'easeOut' },
 *   prefersReducedMotion
 * );
 * ```
 */
export function getAnimationConfig<T extends Record<string, any>>(
  config: T,
  prefersReducedMotion: boolean
): T {
  if (prefersReducedMotion) {
    return {
      ...config,
      duration: 0,
      delay: 0,
    } as T;
  }
  return config;
}
