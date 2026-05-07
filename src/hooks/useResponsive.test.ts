/**
 * Unit Tests for Responsive Hook
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResponsive } from './useResponsive';

describe('useResponsive Hook', () => {
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

  describe('Mobile Breakpoint (≤480px)', () => {
    it('should detect mobile at 375px width', () => {
      setWindowSize(375, 667);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('mobile');
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.width).toBe(375);
      expect(result.current.height).toBe(667);
    });

    it('should detect mobile at 480px width (boundary)', () => {
      setWindowSize(480, 800);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('mobile');
      expect(result.current.isMobile).toBe(true);
    });

    it('should detect mobile at 320px width (small phone)', () => {
      setWindowSize(320, 568);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('mobile');
      expect(result.current.isMobile).toBe(true);
    });
  });

  describe('Tablet Breakpoint (481-1023px)', () => {
    it('should detect tablet at 481px width (lower boundary)', () => {
      setWindowSize(481, 800);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('tablet');
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
    });

    it('should detect tablet at 768px width (iPad portrait)', () => {
      setWindowSize(768, 1024);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('tablet');
      expect(result.current.isTablet).toBe(true);
    });

    it('should detect tablet at 1023px width (upper boundary)', () => {
      setWindowSize(1023, 768);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('tablet');
      expect(result.current.isTablet).toBe(true);
    });
  });

  describe('Desktop Breakpoint (≥1024px)', () => {
    it('should detect desktop at 1024px width (boundary)', () => {
      setWindowSize(1024, 768);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('desktop');
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
    });

    it('should detect desktop at 1280px width (laptop)', () => {
      setWindowSize(1280, 800);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('desktop');
      expect(result.current.isDesktop).toBe(true);
    });

    it('should detect desktop at 1920px width (full HD)', () => {
      setWindowSize(1920, 1080);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('desktop');
      expect(result.current.isDesktop).toBe(true);
    });
  });

  describe('Resize Handling', () => {
    it('should update breakpoint on window resize', () => {
      setWindowSize(375, 667);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('mobile');

      // Resize to tablet
      act(() => {
        setWindowSize(768, 1024);
        window.dispatchEvent(new Event('resize'));
        vi.advanceTimersByTime(150); // Debounce delay
      });

      expect(result.current.breakpoint).toBe('tablet');
    });

    it('should update from tablet to desktop', () => {
      setWindowSize(768, 1024);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('tablet');

      // Resize to desktop
      act(() => {
        setWindowSize(1280, 800);
        window.dispatchEvent(new Event('resize'));
        vi.advanceTimersByTime(150);
      });

      expect(result.current.breakpoint).toBe('desktop');
    });

    it('should update from desktop to mobile', () => {
      setWindowSize(1280, 800);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('desktop');

      // Resize to mobile
      act(() => {
        setWindowSize(375, 667);
        window.dispatchEvent(new Event('resize'));
        vi.advanceTimersByTime(150);
      });

      expect(result.current.breakpoint).toBe('mobile');
    });
  });

  describe('Debouncing', () => {
    it('should debounce resize events (150ms delay)', () => {
      setWindowSize(375, 667);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe('mobile');

      // Trigger multiple rapid resizes
      act(() => {
        setWindowSize(768, 1024);
        window.dispatchEvent(new Event('resize'));
        vi.advanceTimersByTime(50);

        setWindowSize(1024, 768);
        window.dispatchEvent(new Event('resize'));
        vi.advanceTimersByTime(50);

        setWindowSize(1280, 800);
        window.dispatchEvent(new Event('resize'));
        vi.advanceTimersByTime(50);
      });

      // Should still be mobile (debounce not complete)
      expect(result.current.breakpoint).toBe('mobile');

      // Complete debounce
      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Now should be desktop
      expect(result.current.breakpoint).toBe('desktop');
    });

    it('should not update state before debounce completes', () => {
      setWindowSize(375, 667);
      const { result } = renderHook(() => useResponsive());

      const initialWidth = result.current.width;

      act(() => {
        setWindowSize(1280, 800);
        window.dispatchEvent(new Event('resize'));
        vi.advanceTimersByTime(100); // Less than 150ms
      });

      // Should still have initial width
      expect(result.current.width).toBe(initialWidth);

      act(() => {
        vi.advanceTimersByTime(50); // Complete the 150ms
      });

      // Now should have new width
      expect(result.current.width).toBe(1280);
    });
  });

  describe('Cleanup', () => {
    it('should remove resize listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { unmount } = renderHook(() => useResponsive());
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('Dimensions Tracking', () => {
    it('should track width and height correctly', () => {
      setWindowSize(1280, 720);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.width).toBe(1280);
      expect(result.current.height).toBe(720);
    });

    it('should update dimensions on resize', () => {
      setWindowSize(375, 667);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.width).toBe(375);
      expect(result.current.height).toBe(667);

      act(() => {
        setWindowSize(1920, 1080);
        window.dispatchEvent(new Event('resize'));
        vi.advanceTimersByTime(150);
      });

      expect(result.current.width).toBe(1920);
      expect(result.current.height).toBe(1080);
    });
  });
});
