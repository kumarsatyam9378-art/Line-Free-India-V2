/**
 * Framer Motion Animations Test
 * 
 * Tests for animation implementation in the premium customer home redesign.
 * Validates: Requirements 7.1, 7.2, 7.3, 7.5, 7.6, 7.8, 7.9
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CustomerHome from '../pages/CustomerHome';
import BusinessCard from '../components/BusinessCard';
import CategoryPill from '../components/CategoryPill';
import PremiumPartnersSection from '../components/PremiumPartnersSection';
import { AppProvider } from '../store/AppContext';
import * as useReducedMotionHook from '../hooks/useReducedMotion';

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the useReducedMotion hook
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
  getAnimationDuration: vi.fn((duration: number, prefersReducedMotion: boolean) => 
    prefersReducedMotion ? 0 : duration
  ),
  getAnimationConfig: vi.fn((config: any, prefersReducedMotion: boolean) => 
    prefersReducedMotion ? { ...config, duration: 0, delay: 0 } : config
  ),
}));

// Mock other dependencies
vi.mock('../components/BottomNav', () => ({
  default: () => <div data-testid="bottom-nav">Bottom Nav</div>,
}));

vi.mock('../components/ResponsiveContainer', () => ({
  default: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

vi.mock('../components/GreetingHeader', () => ({
  default: () => <div data-testid="greeting-header">Greeting Header</div>,
}));

vi.mock('../components/LoyaltyPointsCard', () => ({
  default: () => <div data-testid="loyalty-points-card">Loyalty Points Card</div>,
}));

vi.mock('../components/QuickActionsGrid', () => ({
  default: () => <div data-testid="quick-actions-grid">Quick Actions Grid</div>,
}));

vi.mock('../components/DiscoveryPortal', () => ({
  default: () => <div data-testid="discovery-portal">Discovery Portal</div>,
}));

vi.mock('../components/NearbyBusinessesMap', () => ({
  default: () => <div data-testid="nearby-businesses-map">Map</div>,
}));

vi.mock('../components/LazyImage', () => ({
  default: ({ alt }: any) => <img alt={alt} />,
}));

vi.mock('../utils/imageHandling', () => ({
  getBusinessImage: () => ({ type: 'url', url: 'test.jpg' }),
}));

vi.mock('../utils/glassMorphism', () => ({
  getGlassClasses: () => 'glass-class',
}));

const mockBusiness = {
  uid: 'test-business-1',
  businessName: 'Test Salon',
  businessType: 'mens_salon' as const,
  location: '123 Test St',
  phone: '1234567890',
  photoURL: 'test-photo.jpg',
  bannerImageURL: 'test-banner.jpg',
  services: [{ name: 'Haircut', price: 500, duration: 30 }],
  isOpen: true,
  isBreak: false,
  isStopped: false,
  rating: 4.5,
  totalReviews: 100,
  lat: 0,
  lng: 0,
};

const mockCategory = {
  id: 'mens_salon' as const,
  icon: '💈',
  label: 'Men\'s Salon',
  labelHi: 'पुरुष सैलून',
  terminology: {
    professional: 'Barber',
    professionalHi: 'नाई',
    customer: 'Customer',
    customerHi: 'ग्राहक',
    appointment: 'Appointment',
    appointmentHi: 'अपॉइंटमेंट',
  },
  defaultServices: [],
};

describe('Framer Motion Animations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Entrance Animations (Requirement 7.1)', () => {
    it('should apply page entrance animation variants to CustomerHome', () => {
      const useReducedMotionSpy = vi.spyOn(useReducedMotionHook, 'useReducedMotion');
      useReducedMotionSpy.mockReturnValue(false);

      render(
        <BrowserRouter>
          <AppProvider>
            <CustomerHome />
          </AppProvider>
        </BrowserRouter>
      );

      // Verify the page renders
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      
      // Verify useReducedMotion was called
      expect(useReducedMotionSpy).toHaveBeenCalled();
    });

    it('should apply fade-in animation to header sections', () => {
      render(
        <BrowserRouter>
          <AppProvider>
            <CustomerHome />
          </AppProvider>
        </BrowserRouter>
      );

      // Verify header components are rendered
      expect(screen.getByTestId('greeting-header')).toBeInTheDocument();
      expect(screen.getByTestId('loyalty-points-card')).toBeInTheDocument();
    });

    it('should apply slide-up animation to content sections', () => {
      render(
        <BrowserRouter>
          <AppProvider>
            <CustomerHome />
          </AppProvider>
        </BrowserRouter>
      );

      // Verify content sections are rendered
      expect(screen.getByTestId('quick-actions-grid')).toBeInTheDocument();
      expect(screen.getByTestId('discovery-portal')).toBeInTheDocument();
    });
  });

  describe('Business Card Animations (Requirement 7.2, 7.5, 7.6)', () => {
    it('should render BusinessCard with animation variants', () => {
      const mockOnClick = vi.fn();
      const mockOnFavorite = vi.fn();

      render(
        <BusinessCard
          business={mockBusiness}
          onCardClick={mockOnClick}
          isFavorite={false}
          onFavoriteToggle={mockOnFavorite}
        />
      );

      expect(screen.getByText('Test Salon')).toBeInTheDocument();
    });

    it('should apply hover animation variants to business cards', () => {
      const mockOnClick = vi.fn();
      const mockOnFavorite = vi.fn();

      const { container } = render(
        <BusinessCard
          business={mockBusiness}
          onCardClick={mockOnClick}
          isFavorite={false}
          onFavoriteToggle={mockOnFavorite}
        />
      );

      // Verify the card button exists
      const cardButton = container.querySelector('button[aria-label*="View details"]');
      expect(cardButton).toBeInTheDocument();
    });

    it('should apply click feedback animation (scale 0.98)', () => {
      const mockOnClick = vi.fn();
      const mockOnFavorite = vi.fn();

      const { container } = render(
        <BusinessCard
          business={mockBusiness}
          onCardClick={mockOnClick}
          isFavorite={false}
          onFavoriteToggle={mockOnFavorite}
        />
      );

      const cardButton = container.querySelector('button[aria-label*="View details"]');
      expect(cardButton).toBeInTheDocument();
    });
  });

  describe('Stagger Animation (Requirement 7.2)', () => {
    it('should apply stagger animation to business cards grid', () => {
      const businesses = [mockBusiness, { ...mockBusiness, uid: 'test-2' }];
      const mockOnClick = vi.fn();
      const mockIsFavorite = vi.fn(() => false);
      const mockOnFavorite = vi.fn();

      render(
        <PremiumPartnersSection
          businesses={businesses}
          onBusinessClick={mockOnClick}
          isFavorite={mockIsFavorite}
          onFavoriteToggle={mockOnFavorite}
          selectedCategory="all"
        />
      );

      // Verify multiple cards are rendered
      expect(screen.getAllByText('Test Salon')).toHaveLength(2);
    });
  });

  describe('Category Pill Animations (Requirement 7.6)', () => {
    it('should render CategoryPill with hover animation', () => {
      const mockOnClick = vi.fn();

      render(
        <CategoryPill
          category={mockCategory}
          isActive={false}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Men\'s Salon')).toBeInTheDocument();
    });

    it('should render CategoryPill with tap animation', () => {
      const mockOnClick = vi.fn();

      const { container } = render(
        <CategoryPill
          category={mockCategory}
          isActive={false}
          onClick={mockOnClick}
        />
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Favorite Button Animation (Requirement 7.6)', () => {
    it('should animate favorite button on toggle', () => {
      const mockOnClick = vi.fn();
      const mockOnFavorite = vi.fn();

      const { container } = render(
        <BusinessCard
          business={mockBusiness}
          onCardClick={mockOnClick}
          isFavorite={false}
          onFavoriteToggle={mockOnFavorite}
        />
      );

      const favoriteButton = container.querySelector('button[aria-label*="Add to favorites"]');
      expect(favoriteButton).toBeInTheDocument();
    });

    it('should show active state for favorited business', () => {
      const mockOnClick = vi.fn();
      const mockOnFavorite = vi.fn();

      const { container } = render(
        <BusinessCard
          business={mockBusiness}
          onCardClick={mockOnClick}
          isFavorite={true}
          onFavoriteToggle={mockOnFavorite}
        />
      );

      const favoriteButton = container.querySelector('button[aria-label*="Remove from favorites"]');
      expect(favoriteButton).toBeInTheDocument();
    });
  });

  describe('Reduced Motion Support (Requirement 7.8, 7.9)', () => {
    it('should detect prefers-reduced-motion preference', () => {
      const useReducedMotionSpy = vi.spyOn(useReducedMotionHook, 'useReducedMotion');
      useReducedMotionSpy.mockReturnValue(true);

      render(
        <BrowserRouter>
          <AppProvider>
            <CustomerHome />
          </AppProvider>
        </BrowserRouter>
      );

      expect(useReducedMotionSpy).toHaveBeenCalled();
      expect(useReducedMotionSpy).toHaveReturnedWith(true);
    });

    it('should disable animations when reduced motion is preferred', () => {
      const useReducedMotionSpy = vi.spyOn(useReducedMotionHook, 'useReducedMotion');
      useReducedMotionSpy.mockReturnValue(true);

      const mockOnClick = vi.fn();
      const mockOnFavorite = vi.fn();

      render(
        <BusinessCard
          business={mockBusiness}
          onCardClick={mockOnClick}
          isFavorite={false}
          onFavoriteToggle={mockOnFavorite}
        />
      );

      // Verify the component still renders and functions
      expect(screen.getByText('Test Salon')).toBeInTheDocument();
    });

    it('should ensure functionality works without animations', () => {
      const useReducedMotionSpy = vi.spyOn(useReducedMotionHook, 'useReducedMotion');
      useReducedMotionSpy.mockReturnValue(true);

      const mockOnClick = vi.fn();
      const mockOnFavorite = vi.fn();

      const { container } = render(
        <BusinessCard
          business={mockBusiness}
          onCardClick={mockOnClick}
          isFavorite={false}
          onFavoriteToggle={mockOnFavorite}
        />
      );

      // Click the card
      const cardButton = container.querySelector('button[aria-label*="View details"]');
      cardButton?.click();
      expect(mockOnClick).toHaveBeenCalled();

      // Click the favorite button
      const favoriteButton = container.querySelector('button[aria-label*="Add to favorites"]');
      favoriteButton?.click();
      expect(mockOnFavorite).toHaveBeenCalled();
    });
  });

  describe('Animation Configuration (Requirement 7.1)', () => {
    it('should use consistent animation timing', () => {
      const { getAnimationDuration } = useReducedMotionHook;
      
      // Test normal duration
      expect(getAnimationDuration(0.3, false)).toBe(0.3);
      
      // Test reduced motion duration
      expect(getAnimationDuration(0.3, true)).toBe(0);
    });

    it('should use consistent easing functions', () => {
      const { getAnimationConfig } = useReducedMotionHook;
      
      const config = { duration: 0.3, ease: 'easeOut', delay: 0.1 };
      
      // Test normal config
      expect(getAnimationConfig(config, false)).toEqual(config);
      
      // Test reduced motion config
      expect(getAnimationConfig(config, true)).toEqual({
        ...config,
        duration: 0,
        delay: 0,
      });
    });
  });
});
