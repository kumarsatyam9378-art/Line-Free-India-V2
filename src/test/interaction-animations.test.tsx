/**
 * Interaction Animations Test
 * 
 * Tests for Task 10.2: Add interaction animations
 * Validates: Requirements 2.13, 7.3, 7.6
 * 
 * This test suite validates that:
 * - Business cards have hover animations (scale 1.02)
 * - Business cards have click feedback (scale 0.98)
 * - Category pills have hover and tap animations
 * - Favorite button animates on toggle
 */

import { describe, it, expect } from 'vitest';
import { 
  cardHoverVariants, 
  pillVariants, 
  favoriteVariants,
  ANIMATION_CONFIG 
} from '../utils/animations';

describe('Interaction Animations - Task 10.2', () => {
  describe('Requirement 2.13: Business card hover animations', () => {
    it('should scale business card to 1.02 on hover', () => {
      expect(cardHoverVariants.hover).toBeDefined();
      expect(cardHoverVariants.hover.scale).toBe(1.02);
    });

    it('should use fast duration for hover animation', () => {
      const expectedDuration = ANIMATION_CONFIG.durations.fast / 1000;
      expect(cardHoverVariants.hover.transition?.duration).toBe(expectedDuration);
    });

    it('should use standard easing for hover animation', () => {
      expect(cardHoverVariants.hover.transition?.ease).toEqual(
        ANIMATION_CONFIG.easing.standard
      );
    });

    it('should include vertical lift on hover', () => {
      expect(cardHoverVariants.hover.y).toBe(-4);
    });
  });

  describe('Requirement 2.13: Business card click feedback', () => {
    it('should scale business card to 0.98 on tap/click', () => {
      expect(cardHoverVariants.tap).toBeDefined();
      expect(cardHoverVariants.tap.scale).toBe(0.98);
    });

    it('should use micro duration for tap feedback', () => {
      const expectedDuration = ANIMATION_CONFIG.durations.micro / 1000;
      expect(cardHoverVariants.tap.transition?.duration).toBe(expectedDuration);
    });

    it('should use standard easing for tap animation', () => {
      expect(cardHoverVariants.tap.transition?.ease).toEqual(
        ANIMATION_CONFIG.easing.standard
      );
    });
  });

  describe('Requirement 7.3: Category pill hover animations', () => {
    it('should scale category pill on hover', () => {
      expect(pillVariants.hover).toBeDefined();
      expect(pillVariants.hover.scale).toBe(1.05);
    });

    it('should use fast duration for pill hover', () => {
      const expectedDuration = ANIMATION_CONFIG.durations.fast / 1000;
      expect(pillVariants.hover.transition?.duration).toBe(expectedDuration);
    });

    it('should use standard easing for pill hover', () => {
      expect(pillVariants.hover.transition?.ease).toEqual(
        ANIMATION_CONFIG.easing.standard
      );
    });
  });

  describe('Requirement 7.3: Category pill tap animations', () => {
    it('should scale category pill to 0.95 on tap', () => {
      expect(pillVariants.tap).toBeDefined();
      expect(pillVariants.tap.scale).toBe(0.95);
    });

    it('should use micro duration for pill tap', () => {
      const expectedDuration = ANIMATION_CONFIG.durations.micro / 1000;
      expect(pillVariants.tap.transition?.duration).toBe(expectedDuration);
    });

    it('should use standard easing for pill tap', () => {
      expect(pillVariants.tap.transition?.ease).toEqual(
        ANIMATION_CONFIG.easing.standard
      );
    });
  });

  describe('Requirement 7.6: Favorite button toggle animation', () => {
    it('should have inactive state with scale 1', () => {
      expect(favoriteVariants.inactive).toBeDefined();
      expect(favoriteVariants.inactive.scale).toBe(1);
    });

    it('should have active state with bounce animation', () => {
      expect(favoriteVariants.active).toBeDefined();
      expect(favoriteVariants.active.scale).toEqual([1, 1.3, 1]);
    });

    it('should use normal duration for favorite toggle', () => {
      const expectedDuration = ANIMATION_CONFIG.durations.normal / 1000;
      expect(favoriteVariants.active.transition?.duration).toBe(expectedDuration);
    });

    it('should use standard easing for favorite animation', () => {
      expect(favoriteVariants.active.transition?.ease).toEqual(
        ANIMATION_CONFIG.easing.standard
      );
    });
  });

  describe('Animation timing consistency', () => {
    it('should use consistent micro duration for instant feedback', () => {
      expect(ANIMATION_CONFIG.durations.micro).toBe(150);
    });

    it('should use consistent fast duration for hover effects', () => {
      expect(ANIMATION_CONFIG.durations.fast).toBe(200);
    });

    it('should use consistent normal duration for state changes', () => {
      expect(ANIMATION_CONFIG.durations.normal).toBe(300);
    });

    it('should use consistent standard easing curve', () => {
      expect(ANIMATION_CONFIG.easing.standard).toEqual([0.4, 0, 0.2, 1]);
    });
  });

  describe('Animation variants structure', () => {
    it('should export cardHoverVariants with hover and tap states', () => {
      expect(cardHoverVariants).toHaveProperty('hover');
      expect(cardHoverVariants).toHaveProperty('tap');
    });

    it('should export pillVariants with hover and tap states', () => {
      expect(pillVariants).toHaveProperty('hover');
      expect(pillVariants).toHaveProperty('tap');
    });

    it('should export favoriteVariants with inactive and active states', () => {
      expect(favoriteVariants).toHaveProperty('inactive');
      expect(favoriteVariants).toHaveProperty('active');
    });
  });

  describe('Performance considerations', () => {
    it('should use transform-based animations for better performance', () => {
      // Scale animations use CSS transforms which are GPU-accelerated
      expect(cardHoverVariants.hover).toHaveProperty('scale');
      expect(pillVariants.hover).toHaveProperty('scale');
      expect(favoriteVariants.active).toHaveProperty('scale');
    });

    it('should use short durations to avoid sluggish feel', () => {
      // All interaction animations should be under 300ms
      const hoverDuration = cardHoverVariants.hover.transition?.duration || 0;
      const tapDuration = cardHoverVariants.tap.transition?.duration || 0;
      const pillHoverDuration = pillVariants.hover.transition?.duration || 0;
      const pillTapDuration = pillVariants.tap.transition?.duration || 0;

      expect(hoverDuration).toBeLessThanOrEqual(0.3);
      expect(tapDuration).toBeLessThanOrEqual(0.3);
      expect(pillHoverDuration).toBeLessThanOrEqual(0.3);
      expect(pillTapDuration).toBeLessThanOrEqual(0.3);
    });
  });
});
