import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BottomNav from './BottomNav';
import * as AppContext from '../store/AppContext';

// Mock the AppContext
vi.mock('../store/AppContext', () => ({
  useApp: vi.fn(),
  getCategoryInfo: vi.fn(() => ({
    terminology: { noun: 'Customers' }
  }))
}));

describe('BottomNav - Theme-Aware Rendering', () => {
  it('should apply theme-aware background classes', () => {
    vi.mocked(AppContext.useApp).mockReturnValue({
      role: 'customer',
      unreadCount: 0,
      t: (key: string) => key,
      businessProfile: null,
    } as any);

    const { container } = render(
      <BrowserRouter>
        <BottomNav />
      </BrowserRouter>
    );

    // Check that the nav container has theme-aware classes
    const navContainer = container.querySelector('.bg-card\\/80');
    expect(navContainer).toBeTruthy();
    expect(navContainer?.classList.contains('border-border')).toBe(true);
    expect(navContainer?.classList.contains('transition-colors')).toBe(true);
  });

  it('should apply theme-aware text colors to inactive tabs', () => {
    vi.mocked(AppContext.useApp).mockReturnValue({
      role: 'customer',
      unreadCount: 0,
      t: (key: string) => key,
      businessProfile: null,
    } as any);

    render(
      <BrowserRouter>
        <BottomNav />
      </BrowserRouter>
    );

    // Get all buttons
    const buttons = screen.getAllByRole('button');
    
    // Check that inactive tabs have text-text-dim class
    buttons.forEach(button => {
      const spans = button.querySelectorAll('span');
      const hasTextDim = Array.from(spans).some(span => 
        span.className.includes('text-text-dim')
      );
      expect(hasTextDim).toBe(true);
    });
  });

  it('should have smooth color transitions', () => {
    vi.mocked(AppContext.useApp).mockReturnValue({
      role: 'customer',
      unreadCount: 0,
      t: (key: string) => key,
      businessProfile: null,
    } as any);

    const { container } = render(
      <BrowserRouter>
        <BottomNav />
      </BrowserRouter>
    );

    // Check that transition classes are applied
    const navContainer = container.querySelector('.transition-colors');
    expect(navContainer).toBeTruthy();
    expect(navContainer?.classList.contains('duration-300')).toBe(true);
  });

  it('should maintain fixed positioning and z-index across breakpoints', () => {
    vi.mocked(AppContext.useApp).mockReturnValue({
      role: 'customer',
      unreadCount: 0,
      t: (key: string) => key,
      businessProfile: null,
    } as any);

    const { container } = render(
      <BrowserRouter>
        <BottomNav />
      </BrowserRouter>
    );

    // Check fixed positioning
    const wrapper = container.querySelector('.fixed.bottom-0');
    expect(wrapper).toBeTruthy();
    expect(wrapper?.classList.contains('z-[100]')).toBe(true);
  });

  it('should render business navigation with theme-aware classes', () => {
    vi.mocked(AppContext.useApp).mockReturnValue({
      role: 'business',
      unreadCount: 0,
      t: (key: string) => key,
      businessProfile: { businessType: 'men_salon' },
    } as any);

    const { container } = render(
      <BrowserRouter>
        <BottomNav />
      </BrowserRouter>
    );

    // Check that the nav container has theme-aware classes
    const navContainer = container.querySelector('.bg-card\\/80');
    expect(navContainer).toBeTruthy();
    expect(navContainer?.classList.contains('border-border')).toBe(true);
  });
});
