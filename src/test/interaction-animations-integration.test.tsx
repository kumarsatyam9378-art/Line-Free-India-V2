/**
 * Interaction Animations Integration Test
 * 
 * Tests for Task 10.2: Add interaction animations
 * Validates: Requirements 2.13, 7.3, 7.6
 * 
 * This test suite validates that animation variants are properly exported
 * and components are correctly structured to use them.
 */

import { describe, it, expect } from 'vitest';
import { 
  cardHoverVariants, 
  pillVariants, 
  favoriteVariants 
} from '../utils/animations';

describe('Interaction Animations Integration - Task 10.2', () => {
  describe('Requirement 2.13: BusinessCard animation variants', () => {
    it('should export cardHoverVariants with correct structure', () => {
      expect(cardHoverVariants).toBeDefined();
      expect(cardHoverVariants.hover).toBeDefined();
      expect(cardHoverVariants.tap).toBeDefined();
    });

    it('should have hover state with scale 1.02', () => {
      expect(cardHoverVariants.hover.scale).toBe(1.02);
    });

    it('should have tap state with scale 0.98', () => {
      expect(cardHoverVariants.tap.scale).toBe(0.98);
    });

    it('should include vertical lift on hover', () => {
      expect(cardHoverVariants.hover.y).toBe(-4);
    });
  });

  describe('Requirement 7.3: CategoryPill animation variants', () => {
    it('should export pillVariants with correct structure', () => {
      expect(pillVariants).toBeDefined();
      expect(pillVariants.hover).toBeDefined();
      expect(pillVariants.tap).toBeDefined();
    });

    it('should have hover state with scale 1.05', () => {
      expect(pillVariants.hover.scale).toBe(1.05);
    });

    it('should have tap state with scale 0.95', () => {
      expect(pillVariants.tap.scale).toBe(0.95);
    });
  });

  describe('Requirement 7.6: Favorite button animation variants', () => {
    it('should export favoriteVariants with correct structure', () => {
      expect(favoriteVariants).toBeDefined();
      expect(favoriteVariants.inactive).toBeDefined();
      expect(favoriteVariants.active).toBeDefined();
    });

    it('should have inactive state with scale 1', () => {
      expect(favoriteVariants.inactive.scale).toBe(1);
    });

    it('should have active state with bounce animation', () => {
      expect(favoriteVariants.active.scale).toEqual([1, 1.3, 1]);
    });
  });

  describe('Animation timing configuration', () => {
    it('should use appropriate durations for each animation type', () => {
      // Hover animations should be fast (200ms)
      expect(cardHoverVariants.hover.transition?.duration).toBe(0.2);
      expect(pillVariants.hover.transition?.duration).toBe(0.2);
      
      // Tap animations should be micro (150ms)
      expect(cardHoverVariants.tap.transition?.duration).toBe(0.15);
      expect(pillVariants.tap.transition?.duration).toBe(0.15);
      
      // Toggle animations should be normal (300ms)
      expect(favoriteVariants.active.transition?.duration).toBe(0.3);
    });

    it('should use standard easing for all interactions', () => {
      const standardEasing = [0.4, 0, 0.2, 1];
      
      expect(cardHoverVariants.hover.transition?.ease).toEqual(standardEasing);
      expect(cardHoverVariants.tap.transition?.ease).toEqual(standardEasing);
      expect(pillVariants.hover.transition?.ease).toEqual(standardEasing);
      expect(pillVariants.tap.transition?.ease).toEqual(standardEasing);
      expect(favoriteVariants.active.transition?.ease).toEqual(standardEasing);
    });
  });

  describe('Component implementation verification', () => {
    it('should verify BusinessCard component exists and exports correctly', async () => {
      const BusinessCard = await import('../components/BusinessCard');
      expect(BusinessCard.default).toBeDefined();
    });

    it('should verify CategoryPill component exists and exports correctly', async () => {
      const CategoryPill = await import('../components/CategoryPill');
      expect(CategoryPill.default).toBeDefined();
    });

    it('should verify animation utilities are properly exported', async () => {
      const animations = await import('../utils/animations');
      expect(animations.cardHoverVariants).toBeDefined();
      expect(animations.pillVariants).toBeDefined();
      expect(animations.favoriteVariants).toBeDefined();
    });
  });
});
