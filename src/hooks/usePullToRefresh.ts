import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
}

/**
 * Hook for implementing pull-to-refresh gesture on mobile
 * 
 * Features:
 * - Touch-based pull gesture detection
 * - Visual feedback with pull distance
 * - Threshold-based trigger
 * - Resistance effect for natural feel
 * - Respects prefers-reduced-motion
 * 
 * @param options - Configuration options
 * @returns Pull-to-refresh state and container ref
 * 
 * @example
 * ```tsx
 * const { containerRef, isPulling, pullDistance, isRefreshing } = usePullToRefresh({
 *   onRefresh: async () => {
 *     await fetchData();
 *   },
 *   threshold: 80,
 * });
 * 
 * return (
 *   <div ref={containerRef}>
 *     {isPulling && <div style={{ transform: `translateY(${pullDistance}px)` }}>Pull to refresh</div>}
 *     {isRefreshing && <div>Refreshing...</div>}
 *     <Content />
 *   </div>
 * );
 * ```
 */
export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true,
}: PullToRefreshOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
  });
  const touchStartY = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || prefersReducedMotion || state.isRefreshing) return;

      const container = containerRef.current;
      if (!container) return;

      // Only start pull if at the top of the scroll container
      if (container.scrollTop === 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    },
    [enabled, prefersReducedMotion, state.isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || prefersReducedMotion || state.isRefreshing) return;

      const container = containerRef.current;
      if (!container || touchStartY.current === 0) return;

      const touchY = e.touches[0].clientY;
      const pullDistance = touchY - touchStartY.current;

      // Only pull down, not up
      if (pullDistance > 0 && container.scrollTop === 0) {
        // Prevent default scroll behavior
        e.preventDefault();

        // Apply resistance for natural feel
        const resistedDistance = pullDistance / resistance;

        setState({
          isPulling: true,
          pullDistance: resistedDistance,
          isRefreshing: false,
        });
      }
    },
    [enabled, prefersReducedMotion, resistance, state.isRefreshing]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || prefersReducedMotion || state.isRefreshing) return;

    const { pullDistance } = state;

    if (pullDistance >= threshold) {
      // Trigger refresh
      setState({
        isPulling: false,
        pullDistance: 0,
        isRefreshing: true,
      });

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        setState({
          isPulling: false,
          pullDistance: 0,
          isRefreshing: false,
        });
      }
    } else {
      // Reset state
      setState({
        isPulling: false,
        pullDistance: 0,
        isRefreshing: false,
      });
    }

    touchStartY.current = 0;
  }, [enabled, prefersReducedMotion, state, threshold, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled || prefersReducedMotion) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, prefersReducedMotion, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    containerRef,
    ...state,
  };
}

/**
 * Hook for haptic feedback on mobile devices
 * 
 * Uses the Vibration API to provide tactile feedback
 * 
 * @example
 * ```tsx
 * const { triggerHaptic } = useHapticFeedback();
 * 
 * <button onClick={() => triggerHaptic('light')}>
 *   Click me
 * </button>
 * ```
 */
export function useHapticFeedback() {
  const prefersReducedMotion = useReducedMotion();

  const triggerHaptic = useCallback(
    (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
      if (prefersReducedMotion) return;

      // Check if Vibration API is supported
      if (!('vibrate' in navigator)) return;

      // Vibration patterns for different feedback types
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30,
        success: [10, 50, 10],
        warning: [20, 100, 20],
        error: [30, 100, 30, 100, 30],
      };

      navigator.vibrate(patterns[type]);
    },
    [prefersReducedMotion]
  );

  return { triggerHaptic };
}

export default usePullToRefresh;
