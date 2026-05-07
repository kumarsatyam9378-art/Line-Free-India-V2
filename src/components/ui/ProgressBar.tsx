import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  animated?: boolean;
}

/**
 * Ultra-Premium Progress Bar Component
 * 
 * Features:
 * - Smooth progress animation
 * - Multiple variants with colors
 * - Optional label display
 * - Used for multi-step processes
 */
export const ProgressBar = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  animated = true,
  ...props
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantColors = {
    default: 'bg-gradient-to-r from-[#667EEA] to-[#764BA2]',
    success: 'bg-gradient-to-r from-[#10B981] to-[#059669]',
    warning: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]',
    error: 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]',
  };

  return (
    <div className="w-full" {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[var(--color-text-body)]">
            Progress
          </span>
          <span className="text-sm font-semibold text-[var(--color-text-heading)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div
        className={`
          w-full ${sizeClasses[size]}
          bg-[rgba(255,255,255,0.05)]
          rounded-full
          overflow-hidden
        `}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <motion.div
          className={`h-full ${variantColors[variant]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.5, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
