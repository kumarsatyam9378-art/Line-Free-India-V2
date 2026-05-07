import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface StaggerListProps {
  children: ReactNode;
  staggerDelay?: number;
  duration?: number;
  className?: string;
}

/**
 * Stagger List Component
 * 
 * Animates list items with a stagger effect
 * 
 * Features:
 * - Customizable stagger delay between items
 * - Fade + slide animation
 * - Respects prefers-reduced-motion
 * - Works with any list structure
 * 
 * @example
 * ```tsx
 * <StaggerList staggerDelay={0.05}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </StaggerList>
 * ```
 */
export function StaggerList({
  children,
  staggerDelay = 0.05,
  duration = 0.3,
  className = '',
}: StaggerListProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

/**
 * Stagger Grid Component
 * 
 * Animates grid items with a stagger effect
 * 
 * @example
 * ```tsx
 * <StaggerGrid columns={3} staggerDelay={0.05}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </StaggerGrid>
 * ```
 */
export function StaggerGrid({
  children,
  columns = 3,
  gap = 4,
  staggerDelay = 0.05,
  duration = 0.3,
  className = '',
}: StaggerListProps & { columns?: number; gap?: number }) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

/**
 * Stagger Fade Component
 * 
 * Simple fade-in stagger animation
 * 
 * @example
 * ```tsx
 * <StaggerFade>
 *   <p>Paragraph 1</p>
 *   <p>Paragraph 2</p>
 *   <p>Paragraph 3</p>
 * </StaggerFade>
 * ```
 */
export function StaggerFade({
  children,
  staggerDelay = 0.08,
  duration = 0.4,
  className = '',
}: StaggerListProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

/**
 * Stagger Scale Component
 * 
 * Scale-in stagger animation for cards/tiles
 * 
 * @example
 * ```tsx
 * <StaggerScale>
 *   <Card>Card 1</Card>
 *   <Card>Card 2</Card>
 *   <Card>Card 3</Card>
 * </StaggerScale>
 * ```
 */
export function StaggerScale({
  children,
  staggerDelay = 0.05,
  duration = 0.3,
  className = '',
}: StaggerListProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

/**
 * Hook for custom stagger animations
 * 
 * Returns variants for container and items
 * 
 * @example
 * ```tsx
 * const { containerVariants, itemVariants } = useStaggerAnimation({
 *   staggerDelay: 0.05,
 *   duration: 0.3,
 * });
 * 
 * <motion.ul variants={containerVariants} initial="hidden" animate="visible">
 *   {items.map((item, i) => (
 *     <motion.li key={i} variants={itemVariants}>
 *       {item}
 *     </motion.li>
 *   ))}
 * </motion.ul>
 * ```
 */
export function useStaggerAnimation({
  staggerDelay = 0.05,
  duration = 0.3,
  animationType = 'fade-slide',
}: {
  staggerDelay?: number;
  duration?: number;
  animationType?: 'fade' | 'fade-slide' | 'scale' | 'slide';
} = {}) {
  const prefersReducedMotion = useReducedMotion();

  const itemVariantsByType = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    'fade-slide': {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    },
    slide: {
      hidden: { x: -20 },
      visible: { x: 0 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants = {
    ...itemVariantsByType[animationType],
    visible: {
      ...itemVariantsByType[animationType].visible,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return { containerVariants, itemVariants };
}

export default StaggerList;
