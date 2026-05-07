import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PremiumAnimatedAuth from '../pages/PremiumAnimatedAuth';

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

// Mock useReducedMotion
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('Task 3.2: Mode-specific header', () => {
  it('displays 💎 icon with "Welcome" title for Customer mode', () => {
    render(
      <BrowserRouter>
        <PremiumAnimatedAuth mode="customer" />
      </BrowserRouter>
    );

    // Check for diamond icon
    expect(screen.getByText('💎')).toBeInTheDocument();
    
    // Check for Welcome title
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    
    // Check for subtitle
    expect(screen.getByText('Skip every queue, instantly')).toBeInTheDocument();
  });

  it('displays ⚡ icon with "Business Portal" title for Business mode', () => {
    render(
      <BrowserRouter>
        <PremiumAnimatedAuth mode="business" />
      </BrowserRouter>
    );

    // Check for lightning icon
    expect(screen.getByText('⚡')).toBeInTheDocument();
    
    // Check for Business Portal title
    expect(screen.getByText('Business Portal')).toBeInTheDocument();
    
    // Check for subtitle
    expect(screen.getByText('Manage your beauty business')).toBeInTheDocument();
  });

  it('positions header above the sliding panel (inside Auth Card)', () => {
    const { container } = render(
      <BrowserRouter>
        <PremiumAnimatedAuth mode="customer" />
      </BrowserRouter>
    );

    // Find the header div
    const header = container.querySelector('.text-center.mb-8');
    expect(header).toBeInTheDocument();
    
    // Verify it contains the icon
    expect(header?.textContent).toContain('💎');
    
    // Verify it contains the title
    expect(header?.textContent).toContain('Welcome');
  });
});
