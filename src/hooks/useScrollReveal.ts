import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Ultra-Premium Scroll-Triggered Reveal Animations
 * 
 * Uses Intersection Observer for revealing elements when they enter viewport
 * with smooth fade-in + translateY animations
 * 
 * Features:
 * - Configurable threshold and root margin
 * - Once or repeat animation
 * - Smooth cubic-bezier easing
 * - Respects prefers-reduced-motion
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
    delay?: number;
  } = {}
) {
  const { 
    threshold = 0.1, 
    rootMargin = '0px 0px -50px 0px', 
    once = true,
    delay = 0,
  } = options;
  
  const ref = useRef<T>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If reduced motion is preferred, reveal immediately
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsRevealed(true), delay);
          } else {
            setIsRevealed(true);
          }
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [threshold, rootMargin, once, delay, prefersReducedMotion]);

  return { ref, isRevealed };
}

/**
 * Staggered List Entry Animations
 * 
 * Applies scroll-reveal to a list container and staggers children
 * with 50-80ms delay between elements
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  itemCount: number,
  options: {
    threshold?: number;
    staggerDelay?: number;
    once?: boolean;
  } = {}
) {
  const { threshold = 0.1, staggerDelay = 60, once = true } = options;
  const containerRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // If reduced motion is preferred, show immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [threshold, once, prefersReducedMotion]);

  const getItemStyle = useCallback(
    (index: number): React.CSSProperties => {
      if (prefersReducedMotion) {
        return { opacity: 1, transform: 'none' };
      }
      
      return {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: isVisible ? `${index * staggerDelay}ms` : '0ms',
      };
    },
    [isVisible, staggerDelay, prefersReducedMotion]
  );

  const getItemClassName = useCallback(
    (index: number) => {
      const delayClass = index < 10 ? `stagger-delay-${index + 1}` : '';
      return `reveal ${isVisible ? 'revealed' : ''} ${delayClass}`.trim();
    },
    [isVisible]
  );

  return { containerRef, isVisible, getItemStyle, getItemClassName };
}

export default useScrollReveal;
