import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

/**
 * Ultra-Premium Spinner Component
 * 
 * Features:
 * - Smooth rotation animation
 * - Multiple sizes
 * - Customizable color
 * - Used for button loading states
 */
export const Spinner = ({ size = 'md', color, ...props }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <motion.div
      className={`
        ${sizeClasses[size]}
        border-current border-t-transparent
        rounded-full
      `}
      style={{ borderColor: color || 'currentColor', borderTopColor: 'transparent' }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: 'linear',
      }}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
};

export default Spinner;
