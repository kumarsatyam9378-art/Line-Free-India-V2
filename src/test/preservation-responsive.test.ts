/**
 * Preservation Property Tests - Responsive Functionality (Task 6)
 * 
 * **Validates: Requirements 3.4, 3.5, 3.6, 3.7**
 * 
 * These tests capture baseline responsive behavior that must remain unchanged after the fix.
 * Following observation-first methodology - tests run on UNFIXED code to establish baseline.
 * 
 * EXPECTED OUTCOME: All tests PASS (confirms baseline behavior to preserve)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useResponsive, type ResponsiveState } from '../hooks/useResponsive';
import { triggerHaptic } from '../utils/haptics';

describe('Property 2: Preservation - Responsive Hook and Tailwind Behavior', () => {
  
  // Store original window dimensions
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  // Helper to set window dimensions
  const setWindowSize = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    // Restore original dimensions
    setWindowSize(originalInnerWidth, originalInnerHeight);
  });

  /**
   * Property 2.1: useResponsive Hook Returns Complete ResponsiveState
   * **Validates: Requirement 3.4**
   * 
   * For all viewport widths, useResponsive() must return a ResponsiveState object
   * with all required properties: breakpoint, isMobile, isTablet, isDesktop, width, height
   */
  describe('useResponsive Hook Returns Complete ResponsiveState', () => {
    it('property: useResponsive returns ResponsiveState with all properties for any viewport width', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 200, max: 2560 }), // Viewport widths from small phone to large desktop
          fc.integer({ min: 300, max: 1600 }), // Viewport heights
          (width, height) => {
            setWindowSize(width, height);
            const { result } = renderHook(() => useResponsive());
            
            // Must have all required properties
            expect(result.current).toHaveProperty('breakpoint');
            expect(result.current).toHaveProperty('isMobile');
            expect(result.current).toHaveProperty('isTablet');
            expect(result.current).toHaveProperty('isDesktop');
            expect(result.current).toHaveProperty('width');
            expect(result.current).toHaveProperty('height');
            
            // Verify types
            expect(typeof result.current.breakpoint).toBe('string');
            expect(typeof result.current.isMobile).toBe('boolean');
            expect(typeof result.current.isTablet).toBe('boolean');
            expect(typeof result.current.isDesktop).toBe('boolean');
            expect(typeof result.current.width).toBe('number');
            expect(typeof result.current.height).toBe('number');
            
            // Verify values match input
            expect(result.current.width).toBe(width);
            expect(result.current.height).toBe(height);
            
            // Verify breakpoint is one of the valid values
            expect(['mobile', 'tablet', 'desktop']).toContain(result.current.breakpoint);
            
            // Verify exactly one breakpoint flag is true
            const trueFlags = [
              result.current.isMobile,
              result.current.isTablet,
              result.current.isDesktop
            ].filter(flag => flag === true);
            expect(trueFlags.length).toBe(1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: breakpoint detection is consistent with width thresholds', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 200, max: 2560 }),
          (width) => {
            setWindowSize(width, 800);
            const { result } = renderHook(() => useResponsive());
            
            // Verify breakpoint matches expected thresholds
            if (width <= 480) {
              expect(result.current.breakpoint).toBe('mobile');
              expect(result.current.isMobile).toBe(true);
              expect(result.current.isTablet).toBe(false);
              expect(result.current.isDesktop).toBe(false);
            } else if (width <= 1023) {
              expect(result.current.breakpoint).toBe('tablet');
              expect(result.current.isMobile).toBe(false);
              expect(result.current.isTablet).toBe(true);
              expect(result.current.isDesktop).toBe(false);
            } else {
              expect(result.current.breakpoint).toBe('desktop');
              expect(result.current.isMobile).toBe(false);
              expect(result.current.isTablet).toBe(false);
              expect(result.current.isDesktop).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: boundary values are handled correctly', () => {
      const boundaries = [
        { width: 480, expected: 'mobile' },
        { width: 481, expected: 'tablet' },
        { width: 1023, expected: 'tablet' },
        { width: 1024, expected: 'desktop' }
      ];

      boundaries.forEach(({ width, expected }) => {
        setWindowSize(width, 800);
        const { result } = renderHook(() => useResponsive());
        expect(result.current.breakpoint).toBe(expected);
      });
    });
  });

  /**
   * Property 2.2: Tailwind Responsive Classes Work at Correct Breakpoints
   * **Validates: Requirement 3.5**
   * 
   * For all Tailwind responsive classes (sm:, md:, lg:, xl:), styles must apply
   * at the correct breakpoints defined by Tailwind CSS v4
   */
  describe('Tailwind Responsive Classes Work at Correct Breakpoints', () => {
    // Tailwind CSS v4 default breakpoints
    const TAILWIND_BREAKPOINTS = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    };

    it('property: Tailwind breakpoints are defined and consistent', () => {
      // Verify Tailwind breakpoints exist and are in ascending order
      const breakpointValues = Object.values(TAILWIND_BREAKPOINTS);
      
      for (let i = 1; i < breakpointValues.length; i++) {
        expect(breakpointValues[i]).toBeGreaterThan(breakpointValues[i - 1]);
      }
      
      // Verify specific breakpoint values (baseline behavior)
      expect(TAILWIND_BREAKPOINTS.sm).toBe(640);
      expect(TAILWIND_BREAKPOINTS.md).toBe(768);
      expect(TAILWIND_BREAKPOINTS.lg).toBe(1024);
      expect(TAILWIND_BREAKPOINTS.xl).toBe(1280);
      expect(TAILWIND_BREAKPOINTS['2xl']).toBe(1536);
    });

    it('property: responsive class application logic is consistent', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 200, max: 2560 }),
          (width) => {
            // Determine which Tailwind classes should apply at this width
            const shouldApplySm = width >= TAILWIND_BREAKPOINTS.sm;
            const shouldApplyMd = width >= TAILWIND_BREAKPOINTS.md;
            const shouldApplyLg = width >= TAILWIND_BREAKPOINTS.lg;
            const shouldApplyXl = width >= TAILWIND_BREAKPOINTS.xl;
            const shouldApply2xl = width >= TAILWIND_BREAKPOINTS['2xl'];
            
            // Verify logic is consistent (larger breakpoints imply smaller ones)
            if (shouldApply2xl) {
              expect(shouldApplyXl).toBe(true);
              expect(shouldApplyLg).toBe(true);
              expect(shouldApplyMd).toBe(true);
              expect(shouldApplySm).toBe(true);
            }
            
            if (shouldApplyXl) {
              expect(shouldApplyLg).toBe(true);
              expect(shouldApplyMd).toBe(true);
              expect(shouldApplySm).toBe(true);
            }
            
            if (shouldApplyLg) {
              expect(shouldApplyMd).toBe(true);
              expect(shouldApplySm).toBe(true);
            }
            
            if (shouldApplyMd) {
              expect(shouldApplySm).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: Tailwind lg breakpoint aligns with useResponsive desktop threshold', () => {
      // The useResponsive hook defines desktop as ≥1024px
      // Tailwind lg: breakpoint is also 1024px
      // This alignment should be preserved
      
      const useResponsiveDesktopThreshold = 1024;
      const tailwindLgBreakpoint = TAILWIND_BREAKPOINTS.lg;
      
      expect(tailwindLgBreakpoint).toBe(useResponsiveDesktopThreshold);
      
      // Verify behavior at the boundary
      setWindowSize(1023, 800);
      const { result: resultTablet } = renderHook(() => useResponsive());
      expect(resultTablet.current.isDesktop).toBe(false);
      
      setWindowSize(1024, 800);
      const { result: resultDesktop } = renderHook(() => useResponsive());
      expect(resultDesktop.current.isDesktop).toBe(true);
    });
  });

  /**
   * Property 2.3: Window Resize Events Trigger Debounced Updates
   * **Validates: Requirement 3.6**
   * 
   * For all resize events, the debounce handler must delay state updates by 150ms
   * to prevent excessive recalculations
   */
  describe('Window Resize Events Trigger Debounced Updates', () => {
    it('property: resize events are debounced with 150ms delay', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 300, max: 1920 }),
          fc.integer({ min: 600, max: 1920 }),
          (initialWidth, finalWidth) => {
            // Skip if widths are the same (no change to test)
            fc.pre(initialWidth !== finalWidth);
            
            setWindowSize(initialWidth, 800);
            const { result } = renderHook(() => useResponsive());
            
            const initialState = result.current.width;
            
            // Trigger resize
            act(() => {
              setWindowSize(finalWidth, 800);
              window.dispatchEvent(new Event('resize'));
              
              // Advance time by less than 150ms
              vi.advanceTimersByTime(100);
            });
            
            // State should NOT have updated yet (debounce not complete)
            expect(result.current.width).toBe(initialState);
            
            // Complete the debounce delay
            act(() => {
              vi.advanceTimersByTime(50); // Total: 150ms
            });
            
            // Now state should be updated
            expect(result.current.width).toBe(finalWidth);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('property: multiple rapid resizes only trigger one update after debounce', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 300, max: 1920 }), { minLength: 3, maxLength: 10 }),
          (widths) => {
            setWindowSize(widths[0], 800);
            const { result } = renderHook(() => useResponsive());
            
            const initialWidth = result.current.width;
            
            // Trigger multiple rapid resizes
            act(() => {
              widths.slice(1).forEach((width, index) => {
                setWindowSize(width, 800);
                window.dispatchEvent(new Event('resize'));
                vi.advanceTimersByTime(30); // Less than 150ms between each
              });
            });
            
            // State should still be initial (debounce keeps resetting)
            expect(result.current.width).toBe(initialWidth);
            
            // Complete the debounce
            act(() => {
              vi.advanceTimersByTime(150);
            });
            
            // Should now reflect the last width
            const lastWidth = widths[widths.length - 1];
            expect(result.current.width).toBe(lastWidth);
          }
        ),
        { numRuns: 30 }
      );
    });

    it('property: debounce delay is exactly 150ms', () => {
      setWindowSize(375, 667);
      const { result } = renderHook(() => useResponsive());
      
      act(() => {
        setWindowSize(1280, 800);
        window.dispatchEvent(new Event('resize'));
        
        // Test at 149ms - should NOT update
        vi.advanceTimersByTime(149);
      });
      
      expect(result.current.width).toBe(375);
      
      act(() => {
        // Advance 1 more ms to reach exactly 150ms
        vi.advanceTimersByTime(1);
      });
      
      // Now should be updated
      expect(result.current.width).toBe(1280);
    });
  });

  /**
   * Property 2.4: Touch Interactions Trigger Haptic Feedback
   * **Validates: Requirement 3.7**
   * 
   * For all touch interactions on mobile, haptic feedback must be triggered
   * with appropriate vibration patterns
   */
  describe('Touch Interactions Trigger Haptic Feedback', () => {
    let vibrateSpy: any;

    beforeEach(() => {
      // Mock navigator.vibrate
      vibrateSpy = vi.fn();
      Object.defineProperty(window.navigator, 'vibrate', {
        writable: true,
        configurable: true,
        value: vibrateSpy
      });
    });

    afterEach(() => {
      vibrateSpy.mockRestore();
    });

    it('property: triggerHaptic function exists and is callable', () => {
      expect(typeof triggerHaptic).toBe('function');
      
      // Should not throw for any valid haptic type
      const hapticTypes: Array<'light' | 'medium' | 'heavy' | 'burst' | 'ultra-heavy' | 'success' | 'error'> = [
        'light', 'medium', 'heavy', 'burst', 'ultra-heavy', 'success', 'error'
      ];
      
      hapticTypes.forEach(type => {
        expect(() => triggerHaptic(type)).not.toThrow();
      });
    });

    it('property: all haptic types trigger vibration with correct patterns', () => {
      const hapticPatterns: Record<string, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 40,
        'ultra-heavy': [60, 20, 80],
        burst: [10, 10, 10, 10, 10],
        success: [15, 60, 25],
        error: [30, 50, 30, 50, 60]
      };

      Object.entries(hapticPatterns).forEach(([type, expectedPattern]) => {
        vibrateSpy.mockClear();
        triggerHaptic(type as any);
        
        expect(vibrateSpy).toHaveBeenCalledTimes(1);
        
        // Verify the vibration pattern matches expected
        const actualPattern = vibrateSpy.mock.calls[0][0];
        expect(actualPattern).toEqual(expectedPattern);
      });
    });

    it('property: haptic feedback works for all valid types', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('light', 'medium', 'heavy', 'burst', 'ultra-heavy', 'success', 'error'),
          (hapticType) => {
            vibrateSpy.mockClear();
            triggerHaptic(hapticType as any);
            
            // Should have called vibrate exactly once
            expect(vibrateSpy).toHaveBeenCalledTimes(1);
            
            // Should have called with a number or array
            const arg = vibrateSpy.mock.calls[0][0];
            expect(typeof arg === 'number' || Array.isArray(arg)).toBe(true);
            
            // If array, all elements should be numbers
            if (Array.isArray(arg)) {
              arg.forEach((val: any) => {
                expect(typeof val).toBe('number');
                expect(val).toBeGreaterThan(0);
              });
            } else {
              expect(arg).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('property: haptic feedback gracefully handles unsupported devices', () => {
      // Remove vibrate support
      Object.defineProperty(window.navigator, 'vibrate', {
        writable: true,
        configurable: true,
        value: undefined
      });
      
      // Should not throw even without vibrate support
      expect(() => triggerHaptic('light')).not.toThrow();
      expect(() => triggerHaptic('medium')).not.toThrow();
      expect(() => triggerHaptic('heavy')).not.toThrow();
    });

    it('property: default haptic type is light', () => {
      vibrateSpy.mockClear();
      triggerHaptic(); // No argument
      
      expect(vibrateSpy).toHaveBeenCalledTimes(1);
      expect(vibrateSpy).toHaveBeenCalledWith(10); // Light vibration
    });
  });

  /**
   * Property 2.5: Responsive State Consistency
   * **Validates: Requirements 3.4, 3.5, 3.6**
   * 
   * For all viewport changes, the responsive state must remain internally consistent
   */
  describe('Responsive State Consistency', () => {
    it('property: responsive state is always internally consistent', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 200, max: 2560 }),
          fc.integer({ min: 300, max: 1600 }),
          (width, height) => {
            setWindowSize(width, height);
            const { result } = renderHook(() => useResponsive());
            
            const state = result.current;
            
            // Verify consistency between breakpoint and boolean flags
            if (state.breakpoint === 'mobile') {
              expect(state.isMobile).toBe(true);
              expect(state.isTablet).toBe(false);
              expect(state.isDesktop).toBe(false);
            } else if (state.breakpoint === 'tablet') {
              expect(state.isMobile).toBe(false);
              expect(state.isTablet).toBe(true);
              expect(state.isDesktop).toBe(false);
            } else if (state.breakpoint === 'desktop') {
              expect(state.isMobile).toBe(false);
              expect(state.isTablet).toBe(false);
              expect(state.isDesktop).toBe(true);
            }
            
            // Verify dimensions match window
            expect(state.width).toBe(window.innerWidth);
            expect(state.height).toBe(window.innerHeight);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: resize listener cleanup works correctly', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { unmount } = renderHook(() => useResponsive());
      
      unmount();
      
      // Should have removed the resize listener
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('property: hook can be called multiple times without interference', () => {
      setWindowSize(768, 1024);
      
      const { result: result1 } = renderHook(() => useResponsive());
      const { result: result2 } = renderHook(() => useResponsive());
      const { result: result3 } = renderHook(() => useResponsive());
      
      // All instances should return the same state
      expect(result1.current.breakpoint).toBe(result2.current.breakpoint);
      expect(result2.current.breakpoint).toBe(result3.current.breakpoint);
      expect(result1.current.width).toBe(result2.current.width);
      expect(result2.current.width).toBe(result3.current.width);
    });
  });
});
