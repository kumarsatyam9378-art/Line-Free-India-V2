import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PremiumAnimatedAuth from './PremiumAnimatedAuth';
import * as useReducedMotionModule from '../hooks/useReducedMotion';

// Mock the AppContext
vi.mock('../store/AppContext', () => ({
  useApp: () => ({
    signInWithGoogle: vi.fn(),
    signInWithEmail: vi.fn(),
    signUpWithEmail: vi.fn(),
    setRole: vi.fn(),
  }),
}));

// Mock haptics
vi.mock('../utils/haptics', () => ({
  triggerHaptic: vi.fn(),
}));

describe('PremiumAnimatedAuth - Reduced Motion Support', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render animated background with animations when reduced motion is not preferred', () => {
    // Mock useReducedMotion to return false (animations enabled)
    vi.spyOn(useReducedMotionModule, 'useReducedMotion').mockReturnValue(false);

    const { container } = render(
      <BrowserRouter>
        <PremiumAnimatedAuth mode="customer" />
      </BrowserRouter>
    );

    // Check that the animated background container exists
    const backgroundContainer = container.querySelector('.fixed.inset-0.z-0');
    expect(backgroundContainer).toBeInTheDocument();

    // Verify gradient orbs are present (should have at least 5)
    const gradientOrbs = container.querySelectorAll('.absolute.rounded-full');
    expect(gradientOrbs.length).toBeGreaterThanOrEqual(5);
  });

  it('should preserve static gradient colors when reduced motion is preferred', () => {
    // Mock useReducedMotion to return true (animations disabled)
    vi.spyOn(useReducedMotionModule, 'useReducedMotion').mockReturnValue(true);

    const { container } = render(
      <BrowserRouter>
        <PremiumAnimatedAuth mode="customer" />
      </BrowserRouter>
    );

    // Check that the animated background container still exists
    const backgroundContainer = container.querySelector('.fixed.inset-0.z-0');
    expect(backgroundContainer).toBeInTheDocument();

    // Verify gradient orbs are still present (colors preserved)
    const gradientOrbs = container.querySelectorAll('.absolute.rounded-full');
    expect(gradientOrbs.length).toBeGreaterThanOrEqual(5);

    // Verify that gradient backgrounds are still applied
    const firstOrb = gradientOrbs[0] as HTMLElement;
    expect(firstOrb.style.background).toContain('radial-gradient');
  });

  it('should render correct theme colors for customer mode', () => {
    vi.spyOn(useReducedMotionModule, 'useReducedMotion').mockReturnValue(false);

    render(
      <BrowserRouter>
        <PremiumAnimatedAuth mode="customer" />
      </BrowserRouter>
    );

    // Check for customer mode icon and title
    expect(screen.getByText('💎')).toBeInTheDocument();
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });

  it('should render correct theme colors for business mode', () => {
    vi.spyOn(useReducedMotionModule, 'useReducedMotion').mockReturnValue(false);

    render(
      <BrowserRouter>
        <PremiumAnimatedAuth mode="business" />
      </BrowserRouter>
    );

    // Check for business mode icon and title
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('Business Portal')).toBeInTheDocument();
  });
});
