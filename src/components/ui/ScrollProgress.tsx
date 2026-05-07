import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ScrollProgressProps {
  position?: 'top' | 'bottom';
  height?: number;
  color?: string;
  showPercentage?: boolean;
}

/**
 * Scroll Progress Indicator Component
 * 
 * Shows a progress bar indicating how far the user has scrolled down the page
 * 
 * Features:
 * - Smooth spring animation
 * - Customizable position (top/bottom)
 * - Optional percentage display
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <ScrollProgress position="top" height={3} color="var(--color-primary)" />
 * ```
 */
export function ScrollProgress({
  position = 'top',
  height = 3,
  color = 'var(--color-primary)',
  showPercentage = false,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [percentage, setPercentage] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!showPercentage) return;

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setPercentage(Math.round(latest * 100));
    });

    return () => unsubscribe();
  }, [scrollYProgress, showPercentage]);

  return (
    <>
      <motion.div
        className="fixed left-0 right-0 z-50 origin-left"
        style={{
          [position]: 0,
          height: `${height}px`,
          backgroundColor: color,
          scaleX: prefersReducedMotion ? scrollYProgress : scaleX,
        }}
      />
      {showPercentage && percentage > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-50 bg-[var(--color-bg-secondary)] backdrop-blur-lg border border-[rgba(255,255,255,0.1)] rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-text-body)] shadow-lg"
        >
          {percentage}%
        </motion.div>
      )}
    </>
  );
}

/**
 * Smooth Scroll Component
 * 
 * Enables smooth scrolling to anchor links
 * 
 * @example
 * ```tsx
 * <SmoothScroll>
 *   <a href="#section1">Go to Section 1</a>
 *   <div id="section1">Section 1 Content</div>
 * </SmoothScroll>
 * ```
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const targetElement = document.querySelector(href);
      if (!targetElement) return;

      e.preventDefault();

      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Update URL without jumping
      history.pushState(null, '', href);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}

/**
 * Hook for scroll-based animations
 * 
 * Returns scroll progress values for custom animations
 * 
 * @example
 * ```tsx
 * const { scrollY, scrollYProgress } = useScrollAnimation();
 * 
 * <motion.div
 *   style={{
 *     opacity: scrollYProgress,
 *     scale: useTransform(scrollYProgress, [0, 1], [0.8, 1]),
 *   }}
 * >
 *   Content
 * </motion.div>
 * ```
 */
export function useScrollAnimation() {
  const { scrollY, scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  return {
    scrollY: prefersReducedMotion ? 0 : scrollY,
    scrollYProgress: prefersReducedMotion ? 0 : scrollYProgress,
  };
}

/**
 * Scroll to Top Button Component
 * 
 * Shows a button to scroll back to the top of the page
 * Only appears after scrolling down a certain amount
 * 
 * @example
 * ```tsx
 * <ScrollToTop threshold={300} />
 * ```
 */
export function ScrollToTop({ threshold = 300 }: { threshold?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Scroll to top"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </motion.button>
  );
}

export default ScrollProgress;
