/**
 * Responsive Hook
 * 
 * Provides breakpoint detection and responsive state management.
 * Detects viewport size changes and returns current breakpoint information.
 * 
 * Breakpoints:
 * - Mobile: ≤480px
 * - Tablet: 481-1023px
 * - Desktop: ≥1024px
 */

import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveState {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

/**
 * Debounce utility function
 * Delays function execution until after wait milliseconds have elapsed
 * since the last time it was invoked
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get current responsive state based on window dimensions
 */
function getResponsiveState(): ResponsiveState {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  let breakpoint: Breakpoint;
  if (width <= 480) breakpoint = 'mobile';
  else if (width <= 1023) breakpoint = 'tablet';
  else breakpoint = 'desktop';
  
  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    width,
    height
  };
}

/**
 * Hook to detect and track responsive breakpoints
 * 
 * @returns ResponsiveState object with current breakpoint information
 * 
 * @example
 * ```tsx
 * const { isMobile, isDesktop, breakpoint } = useResponsive();
 * 
 * return (
 *   <div>
 *     {isMobile && <MobileNav />}
 *     {isDesktop && <DesktopSidebar />}
 *     <p>Current breakpoint: {breakpoint}</p>
 *   </div>
 * );
 * ```
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => 
    getResponsiveState()
  );
  
  useEffect(() => {
    // Debounced resize handler (150ms delay)
    const handleResize = debounce(() => {
      setState(getResponsiveState());
    }, 150);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return state;
}
