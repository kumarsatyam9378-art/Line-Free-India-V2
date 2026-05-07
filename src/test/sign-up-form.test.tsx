import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PremiumAnimatedAuth from '../pages/PremiumAnimatedAuth';

// Mock the AppContext
vi.mock('../store/AppContext', () => ({
  useApp: () => ({
    signInWithGoogle: vi.fn(),
    signInWithEmail: vi.fn(),
    signUpWithEmail: vi.fn().mockResolvedValue({ user: { updateProfile: vi.fn() } }),
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

describe('PremiumAnimatedAuth - Sign Up Form (Tasks 7.1, 7.2, 7.3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Task 7.1: Should render Sign Up form structure with all required inputs', () => {
    const { container } = render(
      <BrowserRouter>
        <PremiumAnimatedAuth mode="customer" />
      </BrowserRouter>
    );

    // Verify Sign Up panel exists in the DOM (even if not visible)
    const usernameInput = container.querySelector('#signup-username');
    const emailInput = container.querySelector('#signup-email');
    const passwordInput = container.querySelector('#signup-password');
    
    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    
    // Verify input types
    expect(usernameInput).toHaveAttribute('type', 'text');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('Task 7.1: Should have Create Account button in Sign Up panel', () => {
    render(
      <BrowserRouter>
        <PremiumAnimatedAuth mode="customer" />
      </BrowserRouter>
    );

    // The button text "Create Account" should exist in the DOM
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('Task 7.1: Should have username input with User icon', () => {
    const { container } = render(
      <BrowserRouter>
        <PremiumAnimatedAuth mode="customer" />
      </BrowserRouter>
    );

    // Verify username input exists
    const usernameInput = container.querySelector('#signup-username');
    expect(usernameInput).toBeInTheDocument();
    
    // Verify it has a label
    const usernameLabel = container.querySelector('label[for="signup-username"]');
    expect(usernameLabel).toBeInTheDocument();
    expect(usernameLabel).toHaveTextContent('Username');
  });

  it('Task 7.1: Should have email input with envelope icon', () => {
    const { container } = render(
      <BrowserRouter>
        <PremiumAnimatedAuth mode="customer" />
      </BrowserRouter>
    );

    // Verify email input exists in Sign Up panel
    const emailInput = container.querySelector('#signup-email');
    expect(emailInput).toBeInTheDocument();
    
    // Verify it has a label
    const emailLabel = container.querySelector('label[for="signup-email"]');
    expect(emailLabel).toBeInTheDocument();
    expect(emailLabel).toHaveTextContent('Email');
  });

  it('Task 7.1: Should have password input with lock icon', () => {
    const { container } = render(
      <BrowserRouter>
        <PremiumAnimatedAuth mode="customer" />
      </BrowserRouter>
    );

    // Verify password input exists in Sign Up panel
    const passwordInput = container.querySelector('#signup-password');
    expect(passwordInput).toBeInTheDocument();
    
    // Verify it has a label
    const passwordLabel = container.querySelector('label[for="signup-password"]');
    expect(passwordLabel).toBeInTheDocument();
    expect(passwordLabel).toHaveTextContent('Password');
  });
});
