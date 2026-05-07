/**
 * Unit Tests for Contrast Ratio Utility
 */

import { describe, it, expect } from 'vitest';
import { getLuminance, calculateContrastRatio, meetsWCAGAA } from './contrast';

describe('Contrast Utility', () => {
  describe('getLuminance', () => {
    it('should calculate luminance for pure black', () => {
      const luminance = getLuminance('#000000');
      expect(luminance).toBe(0);
    });

    it('should calculate luminance for pure white', () => {
      const luminance = getLuminance('#FFFFFF');
      expect(luminance).toBe(1);
    });

    it('should calculate luminance for hex colors', () => {
      const luminance = getLuminance('#10B981'); // Emerald green
      expect(luminance).toBeGreaterThan(0);
      expect(luminance).toBeLessThan(1);
    });

    it('should calculate luminance for rgb colors', () => {
      const luminance = getLuminance('rgb(16, 185, 129)');
      expect(luminance).toBeGreaterThan(0);
      expect(luminance).toBeLessThan(1);
    });

    it('should calculate luminance for rgba colors', () => {
      const luminance = getLuminance('rgba(16, 185, 129, 0.8)');
      expect(luminance).toBeGreaterThan(0);
      expect(luminance).toBeLessThan(1);
    });
  });

  describe('calculateContrastRatio', () => {
    it('should calculate maximum contrast for black on white', () => {
      const ratio = calculateContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBe(21);
    });

    it('should calculate maximum contrast for white on black', () => {
      const ratio = calculateContrastRatio('#FFFFFF', '#000000');
      expect(ratio).toBe(21);
    });

    it('should calculate minimum contrast for identical colors', () => {
      const ratio = calculateContrastRatio('#10B981', '#10B981');
      expect(ratio).toBe(1);
    });

    it('should calculate contrast for dark mode text (light on dark)', () => {
      const ratio = calculateContrastRatio('#F1F5F9', '#030303');
      expect(ratio).toBeGreaterThan(4.5); // Should meet WCAG AA
    });

    it('should calculate contrast for light mode text (dark on light)', () => {
      const ratio = calculateContrastRatio('#0F172A', '#F7F9FC');
      expect(ratio).toBeGreaterThan(4.5); // Should meet WCAG AA
    });

    it('should be symmetric (order does not matter)', () => {
      const ratio1 = calculateContrastRatio('#10B981', '#FFFFFF');
      const ratio2 = calculateContrastRatio('#FFFFFF', '#10B981');
      expect(ratio1).toBe(ratio2);
    });
  });

  describe('meetsWCAGAA', () => {
    it('should pass for normal text with 4.5:1 contrast', () => {
      // White text on dark background
      expect(meetsWCAGAA('#FFFFFF', '#000000', false)).toBe(true);
    });

    it('should pass for large text with 3:1 contrast', () => {
      // Light gray on medium gray
      expect(meetsWCAGAA('#CCCCCC', '#666666', true)).toBe(true);
    });

    it('should fail for normal text with insufficient contrast', () => {
      // Light gray on white (low contrast)
      expect(meetsWCAGAA('#CCCCCC', '#FFFFFF', false)).toBe(false);
    });

    it('should pass for dark mode primary text', () => {
      const textColor = '#F1F5F9';
      const bgColor = '#030303';
      expect(meetsWCAGAA(textColor, bgColor, false)).toBe(true);
    });

    it('should pass for light mode primary text', () => {
      const textColor = '#0F172A';
      const bgColor = '#F7F9FC';
      expect(meetsWCAGAA(textColor, bgColor, false)).toBe(true);
    });

    it('should pass for dark mode dim text', () => {
      const textColor = '#94A3B8';
      const bgColor = '#030303';
      expect(meetsWCAGAA(textColor, bgColor, false)).toBe(true);
    });

    it('should pass for light mode dim text', () => {
      const textColor = '#64748B';
      const bgColor = '#F7F9FC';
      expect(meetsWCAGAA(textColor, bgColor, false)).toBe(true);
    });

    it('should use 3:1 threshold for large text', () => {
      // This combination passes for large text (3:1) but fails for normal text (4.5:1)
      // #888888 on #FFFFFF has ~3.54:1 contrast - passes large, fails normal
      const textColor = '#888888';
      const bgColor = '#FFFFFF';
      
      expect(meetsWCAGAA(textColor, bgColor, true)).toBe(true);
      expect(meetsWCAGAA(textColor, bgColor, false)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle uppercase hex colors', () => {
      const ratio = calculateContrastRatio('#FFFFFF', '#000000');
      expect(ratio).toBe(21);
    });

    it('should handle lowercase hex colors', () => {
      const ratio = calculateContrastRatio('#ffffff', '#000000');
      expect(ratio).toBe(21);
    });

    it('should handle rgb with spaces', () => {
      const luminance = getLuminance('rgb(255, 255, 255)');
      expect(luminance).toBe(1);
    });

    it('should handle rgb without spaces', () => {
      const luminance = getLuminance('rgb(255,255,255)');
      expect(luminance).toBe(1);
    });

    it('should throw error for invalid color format', () => {
      expect(() => getLuminance('invalid-color')).toThrow();
    });
  });
});
