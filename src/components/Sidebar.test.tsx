import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useApp } from '../store/AppContext';

// Mock the AppContext
vi.mock('../store/AppContext', () => ({
  useApp: vi.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, className, onClick, ...props }: any) => (
      <button className={className} onClick={onClick} {...props}>
        {children}
      </button>
    ),
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/barber/home' }),
  };
});

describe('Sidebar Component - Theme-Aware Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useApp as any).mockReturnValue({
      user: { uid: 'test-user' },
      businessProfile: { name: 'Test Business' },
      signOutUser: vi.fn(),
    });
  });

  it('should render with theme-aware background colors', () => {
    const { container } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const sidebar = container.querySelector('.bg-card');
    expect(sidebar).toBeTruthy();
    expect(sidebar?.classList.contains('border-border')).toBe(true);
  });

  it('should use theme-aware text colors for all text elements', () => {
    const { container } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    // Check brand text uses text-text
    const brandText = screen.getByText('Line Free India');
    expect(brandText.classList.contains('text-text')).toBe(true);

    // Check logo uses text-text (not text-white)
    const logo = screen.getByText('L');
    expect(logo.classList.contains('text-text')).toBe(true);
    expect(logo.classList.contains('text-white')).toBe(false);
  });

  it('should use theme-aware border colors', () => {
    const { container } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    // Check logo border uses border-border
    const logoBorder = container.querySelector('.border-border');
    expect(logoBorder).toBeTruthy();
  });

  it('should apply theme-aware colors to navigation items', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const dashboardButton = screen.getByText('Dashboard');
    const parentButton = dashboardButton.closest('button');
    
    // Check that text uses theme-aware classes
    expect(dashboardButton.classList.contains('text-text')).toBe(true);
  });

  it('should use theme-aware hover states', () => {
    const { container } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const buttons = container.querySelectorAll('button');
    const navButton = Array.from(buttons).find(btn => 
      btn.textContent?.includes('Calendar')
    );

    expect(navButton?.classList.contains('hover:bg-card-2')).toBe(true);
  });

  it('should have 300ms transition duration for smooth theme switching', () => {
    const { container } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const buttons = container.querySelectorAll('button');
    const navButton = Array.from(buttons).find(btn => 
      btn.textContent?.includes('Dashboard')
    );

    expect(navButton?.classList.contains('duration-300')).toBe(true);
  });
});

describe('Sidebar Component - Responsive Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useApp as any).mockReturnValue({
      user: { uid: 'test-user' },
      businessProfile: { name: 'Test Business' },
      signOutUser: vi.fn(),
    });
  });

  it('should be hidden on mobile (<1024px) with hidden md:flex classes', () => {
    const { container } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const sidebar = container.firstChild as HTMLElement;
    expect(sidebar?.classList.contains('hidden')).toBe(true);
    expect(sidebar?.classList.contains('md:flex')).toBe(true);
  });

  it('should have fixed width of 288px (w-72) on desktop', () => {
    const { container } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const sidebar = container.firstChild as HTMLElement;
    expect(sidebar?.classList.contains('w-72')).toBe(true);
  });

  it('should be fixed positioned on the left side', () => {
    const { container } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const sidebar = container.firstChild as HTMLElement;
    expect(sidebar?.classList.contains('fixed')).toBe(true);
    expect(sidebar?.classList.contains('left-0')).toBe(true);
    expect(sidebar?.classList.contains('top-0')).toBe(true);
  });

  it('should not render when user is not logged in', () => {
    (useApp as any).mockReturnValue({
      user: null,
      businessProfile: null,
      signOutUser: vi.fn(),
    });

    const { container } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});
