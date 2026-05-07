import { useState, useCallback, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

interface RippleProps {
  color?: string;
  duration?: number;
}

/**
 * Ripple Effect Component
 * 
 * Creates a Material Design-inspired ripple effect on click
 * 
 * Features:
 * - Radial gradient animation from click point
 * - Automatic cleanup after animation completes
 * - Respects prefers-reduced-motion
 * - Customizable color and duration
 * 
 * @example
 * ```tsx
 * <button className="relative overflow-hidden">
 *   <Ripple color="rgba(255,255,255,0.3)" />
 *   Click me
 * </button>
 * ```
 */
export function Ripple({ color = 'rgba(255,255,255,0.3)', duration = 0.6 }: RippleProps) {
  const [ripples, setRipples] = useState<RippleEffect[]>();
  const prefersReducedMotion = useReducedMotion();

  const addRipple = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;

    const rippleContainer = event.currentTarget;
    const rect = rippleContainer.getBoundingClientRect();
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple: RippleEffect = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...(prev || []), newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev?.filter((ripple) => ripple.id !== newRipple.id));
    }, duration * 1000);
  }, [duration, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]"
      onMouseDown={addRipple}
      style={{ pointerEvents: 'auto' }}
    >
      <AnimatePresence>
        {ripples?.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            }}
            initial={{
              width: 0,
              height: 0,
              x: 0,
              y: 0,
              opacity: 1,
            }}
            animate={{
              width: 500,
              height: 500,
              x: -250,
              y: -250,
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: duration,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hook to use ripple effect in custom components
 * 
 * @example
 * ```tsx
 * function CustomButton() {
 *   const { ripples, addRipple } = useRipple();
 *   
 *   return (
 *     <button onMouseDown={addRipple} className="relative overflow-hidden">
 *       {ripples}
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 */
export function useRipple(color = 'rgba(255,255,255,0.3)', duration = 0.6) {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const addRipple = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;

      const rippleContainer = event.currentTarget;
      const rect = rippleContainer.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newRipple: RippleEffect = {
        id: Date.now(),
        x,
        y,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
      }, duration * 1000);
    },
    [duration, prefersReducedMotion]
  );

  const rippleElements = prefersReducedMotion ? null : (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            }}
            initial={{
              width: 0,
              height: 0,
              x: 0,
              y: 0,
              opacity: 1,
            }}
            animate={{
              width: 500,
              height: 500,
              x: -250,
              y: -250,
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: duration,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  return { ripples: rippleElements, addRipple };
}

export default Ripple;
