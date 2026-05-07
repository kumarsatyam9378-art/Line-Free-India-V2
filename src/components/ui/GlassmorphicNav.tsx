import { useState, useEffect, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface GlassmorphicNavProps {
  items: NavItem[];
  logo?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Glassmorphic Navigation Component
 * 
 * Features:
 * - Glassmorphic design with backdrop-blur
 * - Sticky navigation with enhanced blur on scroll
 * - Active navigation item indicators with animated underline
 * - Smooth transitions
 * - Respects prefers-reduced-motion
 * - Mobile responsive
 * 
 * @example
 * ```tsx
 * <GlassmorphicNav
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'About', href: '/about' },
 *     { label: 'Contact', href: '/contact' },
 *   ]}
 *   logo={<Logo />}
 *   actions={<Button>Sign In</Button>}
 * />
 * ```
 */
export function GlassmorphicNav({
  items,
  logo,
  actions,
  className = '',
}: GlassmorphicNavProps) {
  const [activeItem, setActiveItem] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // Transform scroll position to backdrop blur intensity
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    prefersReducedMotion ? [8, 8] : [8, 16]
  );

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(10, 10, 15, 0.5)', 'rgba(10, 10, 15, 0.8)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect active item based on current path
  useEffect(() => {
    const currentPath = window.location.pathname;
    const activeIndex = items.findIndex((item) => item.href === currentPath);
    if (activeIndex !== -1) {
      setActiveItem(activeIndex);
    }
  }, [items]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
        style={{
          backdropFilter: prefersReducedMotion
            ? 'blur(8px)'
            : `blur(${backdropBlur}px)`,
          backgroundColor: prefersReducedMotion
            ? 'rgba(10, 10, 15, 0.5)'
            : backgroundColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">{logo}</div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {items.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setActiveItem(index)}
                  className="relative px-4 py-2 text-sm font-medium text-[var(--color-text-body)] hover:text-white transition-colors group"
                >
                  {item.icon && (
                    <span className="inline-block mr-2">{item.icon}</span>
                  )}
                  {item.label}

                  {/* Active Indicator */}
                  {activeItem === index && (
                    <motion.div
                      layoutId="activeNavItem"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#667EEA] to-[#764BA2]"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Hover Indicator */}
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {actions}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Border */}
        <div
          className={`h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity duration-300 ${
            isScrolled ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="fixed top-16 left-0 right-0 z-40 md:hidden bg-[var(--color-bg-primary)]/95 backdrop-blur-xl border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {items.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  setActiveItem(index);
                  setIsMobileMenuOpen(false);
                }}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  activeItem === index
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--color-text-body)] hover:bg-white/5'
                }`}
              >
                {item.icon && (
                  <span className="inline-block mr-2">{item.icon}</span>
                )}
                {item.label}
              </a>
            ))}
            {actions && (
              <div className="pt-4 border-t border-white/10">{actions}</div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}

/**
 * Simple Glassmorphic Header Component
 * 
 * Minimal glassmorphic header for internal pages
 * 
 * @example
 * ```tsx
 * <GlassmorphicHeader>
 *   <h1>Page Title</h1>
 * </GlassmorphicHeader>
 * ```
 */
export function GlassmorphicHeader({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${className} ${
        isScrolled
          ? 'bg-[var(--color-bg-primary)]/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </div>
    </header>
  );
}

export default GlassmorphicNav;
