/**
 * Page Entrance Animations Test
 * 
 * Tests for Task 10.1: Add page entrance animations
 * Validates: Requirements 7.1, 7.2, 7.5, 7.9
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CustomerHome from '../pages/CustomerHome';
import { AppProvider } from '../store/AppContext';

// Mock framer-motion to test animation variants
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (_, prop) => {
          const Component = ({ children, variants, initial, animate, ...props }: any) => {
            // Store animation props for testing
            return (
              <div
                data-testid={`motion-${String(prop)}`}
                data-variants={variants ? JSON.stringify(variants) : undefined}
                data-initial={initial}
                data-animate={animate}
                {...props}
              >
                {children}
              </div>
            );
          };
          return Component;
        },
      }
    ),
  };
});

// Mock hooks
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('Page Entrance Animations - Task 10.1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Requirement 7.1: Page entrance animation', () => {
    it('should apply fade-in and slide-up animation to main container', () => {
      render(
        <BrowserRouter>
          <AppProvider>
            <CustomerHome />
          </AppProvider>
        </BrowserRouter>
      );

      const mainContainer = screen.getByTestId('motion-div');
      expect(mainContainer).toHaveAttribute('data-initial', 'initial');
      expect(mainContainer).toHaveAttribute('data-animate', 'animate');
      
      // Verify pageVariants are applied
      const variants = mainContainer.getAttribute('data-variants');
      expect(variants).toBeTruthy();
    });

    it('should use correct animation timing for page entrance', () => {
      const { pageVariants } = require('../utils/animations');
      
      expect(pageVariants.initial).toEqual({
        opacity: 0,
        y: 20,
      });
      
      expect(pageVariants.animate).toMatchObject({
        opacity: 1,
        y: 0,
      });
      
      // Verify timing configuration
      expect(pageVariants.animate.transition.duration).toBe(0.3); // 300ms / 1000
      expect(pageVariants.animate.transition.ease).toEqual([0.4, 0, 0.2, 1]);
    });
  });

  describe('Requirement 7.2: Stagger animation for business cards', () => {
    it('should apply stagger animation to business cards container', () => {
      const { cardContainerVariants } = require('../utils/animations');
      
      expect(cardContainerVariants.animate.transition).toMatchObject({
        staggerChildren: expect.any(Number),
        delayChildren: 0.1,
      });
    });

    it('should use correct stagger delay between cards', () => {
      const { cardContainerVariants, ANIMATION_CONFIG } = require('../utils/animations');
      
      const expectedDelay = ANIMATION_CONFIG.stagger.delay;
      expect(cardContainerVariants.animate.transition.staggerChildren).toBe(expectedDelay);
    });

    it('should apply entrance animation to individual cards', () => {
      const { cardVariants } = require('../utils/animations');
      
      expect(cardVariants.initial).toEqual({
        opacity: 0,
        y: 30,
        scale: 0.95,
      });
      
      expect(cardVariants.animate).toMatchObject({
        opacity: 1,
        y: 0,
        scale: 1,
      });
    });
  });

  describe('Requirement 7.5: Animation timing and easing', () => {
    it('should use standard easing curve for page entrance', () => {
      const { ANIMATION_CONFIG } = require('../utils/animations');
      
      expect(ANIMATION_CONFIG.easing.standard).toEqual([0.4, 0, 0.2, 1]);
    });

    it('should use decelerate easing for card entrance', () => {
      const { ANIMATION_CONFIG } = require('../utils/animations');
      
      expect(ANIMATION_CONFIG.easing.decelerate).toEqual([0, 0, 0.2, 1]);
    });

    it('should use correct duration values', () => {
      const { ANIMATION_CONFIG } = require('../utils/animations');
      
      expect(ANIMATION_CONFIG.durations.micro).toBe(150);
      expect(ANIMATION_CONFIG.durations.fast).toBe(200);
      expect(ANIMATION_CONFIG.durations.normal).toBe(300);
      expect(ANIMATION_CONFIG.durations.slow).toBe(400);
      expect(ANIMATION_CONFIG.durations.decorative).toBe(600);
    });
  });

  describe('Requirement 7.9: Consistent animation timing', () => {
    it('should use consistent timing across all entrance animations', () => {
      const { 
        pageVariants, 
        fadeInVariants, 
        slideInFromBottomVariants,
        ANIMATION_CONFIG 
      } = require('../utils/animations');
      
      const normalDuration = ANIMATION_CONFIG.durations.normal / 1000;
      
      expect(pageVariants.animate.transition.duration).toBe(normalDuration);
      expect(fadeInVariants.animate.transition.duration).toBe(normalDuration);
      expect(slideInFromBottomVariants.animate.transition.duration).toBe(normalDuration);
    });

    it('should use consistent easing across entrance animations', () => {
      const { 
        pageVariants, 
        fadeInVariants,
        ANIMATION_CONFIG 
      } = require('../utils/animations');
      
      const standardEasing = ANIMATION_CONFIG.easing.standard;
      
      expect(pageVariants.animate.transition.ease).toEqual(standardEasing);
      expect(fadeInVariants.animate.transition.ease).toEqual(standardEasing);
    });
  });

  describe('Reduced motion support', () => {
    it('should disable animations when reduced motion is preferred', () => {
      // Mock reduced motion preference
      vi.mock('../hooks/useReducedMotion', () => ({
        useReducedMotion: () => true,
      }));

      render(
        <BrowserRouter>
          <AppProvider>
            <CustomerHome />
          </AppProvider>
        </BrowserRouter>
      );

      const mainContainer = screen.getByTestId('motion-div');
      
      // When reduced motion is preferred, initial and animate should be false
      expect(mainContainer).toHaveAttribute('data-initial', 'false');
      expect(mainContainer).toHaveAttribute('data-animate', 'false');
    });
  });

  describe('Animation variants configuration', () => {
    it('should export all required animation variants', () => {
      const animations = require('../utils/animations');
      
      expect(animations.pageVariants).toBeDefined();
      expect(animations.cardContainerVariants).toBeDefined();
      expect(animations.cardVariants).toBeDefined();
      expect(animations.fadeInVariants).toBeDefined();
      expect(animations.slideInFromBottomVariants).toBeDefined();
    });

    it('should have proper structure for page variants', () => {
      const { pageVariants } = require('../utils/animations');
      
      expect(pageVariants).toHaveProperty('initial');
      expect(pageVariants).toHaveProperty('animate');
      expect(pageVariants.animate).toHaveProperty('transition');
    });

    it('should have proper structure for card container variants', () => {
      const { cardContainerVariants } = require('../utils/animations');
      
      expect(cardContainerVariants).toHaveProperty('initial');
      expect(cardContainerVariants).toHaveProperty('animate');
      expect(cardContainerVariants.animate).toHaveProperty('transition');
      expect(cardContainerVariants.animate.transition).toHaveProperty('staggerChildren');
    });
  });

  describe('Stagger timing configuration', () => {
    it('should use design token for stagger delay', () => {
      const { ANIMATION_CONFIG } = require('../utils/animations');
      const { DESIGN_TOKENS } = require('../config/designTokens');
      
      expect(ANIMATION_CONFIG.stagger.delay).toBe(DESIGN_TOKENS.animation.stagger.delay / 1000);
    });

    it('should have reasonable stagger delay value', () => {
      const { ANIMATION_CONFIG } = require('../utils/animations');
      
      // Stagger delay should be between 30ms and 150ms for good UX
      const delayMs = ANIMATION_CONFIG.stagger.delay * 1000;
      expect(delayMs).toBeGreaterThanOrEqual(30);
      expect(delayMs).toBeLessThanOrEqual(150);
    });
  });
});

/**
 * Validates: Requirements 7.1, 7.2, 7.5, 7.9
 * 
 * 7.1: THE System SHALL use Framer_Motion for all animations
 * 7.2: THE System SHALL animate Business_Card entrance on page load
 * 7.5: THE System SHALL use stagger animations for multiple Business_Cards
 * 7.9: THE System SHALL use consistent animation timing and easing functions
 */
