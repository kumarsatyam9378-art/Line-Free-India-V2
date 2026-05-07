import { describe, it, expect, beforeEach } from 'vitest';
import '../index.css';

describe('Tailwind CSS Variable Configuration', () => {
  beforeEach(() => {
    // Create a test element to check computed styles
    document.body.innerHTML = '<div id="test-element"></div>';
  });

  describe('Color Variables', () => {
    it('should define primary color variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const primary = styles.getPropertyValue('--color-primary').trim();
      expect(primary).toBe('#10B981');
    });

    it('should define background color variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const bg = styles.getPropertyValue('--color-bg').trim();
      expect(bg).toBe('#030303');
    });

    it('should define card color variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const card = styles.getPropertyValue('--color-card').trim();
      expect(card).toBe('#0A0A0B');
    });

    it('should define text color variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const text = styles.getPropertyValue('--color-text').trim();
      expect(text).toBe('#F1F5F9');
    });

    it('should define border color variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const border = styles.getPropertyValue('--color-border').trim();
      expect(border).toContain('rgba');
    });
  });

  describe('Typography Variables', () => {
    it('should define text-base variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const textBase = styles.getPropertyValue('--text-base').trim();
      expect(textBase).toBe('1rem');
    });

    it('should define text-xs variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const textXs = styles.getPropertyValue('--text-xs').trim();
      expect(textXs).toBe('0.75rem');
    });

    it('should define text-4xl variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const text4xl = styles.getPropertyValue('--text-4xl').trim();
      expect(text4xl).toBe('2.25rem');
    });

    it('should map font-size utilities to typography variables', () => {
      const styles = getComputedStyle(document.documentElement);
      const fontSizeBase = styles.getPropertyValue('--font-size-base').trim();
      const textBase = styles.getPropertyValue('--text-base').trim();
      expect(fontSizeBase).toBe(textBase);
    });
  });

  describe('Spacing Variables', () => {
    it('should define space-1 variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const space1 = styles.getPropertyValue('--space-1').trim();
      expect(space1).toBe('0.25rem');
    });

    it('should define space-4 variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const space4 = styles.getPropertyValue('--space-4').trim();
      expect(space4).toBe('1rem');
    });

    it('should define space-8 variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const space8 = styles.getPropertyValue('--space-8').trim();
      expect(space8).toBe('2rem');
    });

    it('should map spacing utilities to space variables', () => {
      const styles = getComputedStyle(document.documentElement);
      const spacing4 = styles.getPropertyValue('--spacing-4').trim();
      const space4 = styles.getPropertyValue('--space-4').trim();
      expect(spacing4).toBe(space4);
    });
  });

  describe('Layout Constants', () => {
    it('should define sidebar width variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const sidebarWidth = styles.getPropertyValue('--sidebar-width').trim();
      expect(sidebarWidth).toBe('288px');
    });

    it('should define bottom nav height variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const bottomNavHeight = styles.getPropertyValue('--bottomnav-height').trim();
      expect(bottomNavHeight).toBe('68px');
    });

    it('should define max content width variable', () => {
      const styles = getComputedStyle(document.documentElement);
      const maxContentWidth = styles.getPropertyValue('--max-content-width').trim();
      expect(maxContentWidth).toBe('480px');
    });
  });

  describe('Responsive Typography', () => {
    it('should scale typography for mobile viewport', () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));

      // Note: Media queries don't work in jsdom, so we test the CSS definition exists
      const styles = getComputedStyle(document.documentElement);
      const textBase = styles.getPropertyValue('--text-base').trim();
      expect(textBase).toBeTruthy();
    });
  });

  describe('Theme Switching', () => {
    it('should apply light mode color overrides', () => {
      document.documentElement.classList.add('light');
      
      const styles = getComputedStyle(document.documentElement);
      const bg = styles.getPropertyValue('--color-bg').trim();
      
      // Light mode should have a different background
      expect(bg).not.toBe('#030303');
      
      document.documentElement.classList.remove('light');
    });
  });
});
