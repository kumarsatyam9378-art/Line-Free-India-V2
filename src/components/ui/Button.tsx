import { ButtonHTMLAttributes, ReactNode, forwardRef, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Ripple } from './Ripple';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

/**
 * Ultra-Premium Button Component
 * 
 * Features:
 * - Animated gradient backgrounds for primary buttons
 * - Shimmer effect on hover
 * - Loading state with spinner
 * - Minimum 44x44px touch target
 * - Smooth state transitions (200-300ms)
 * - Accessible with proper ARIA labels
 * - Hover feedback within 100ms
 * - Click feedback with scale transforms and color shifts
 * - Respects prefers-reduced-motion
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    // Size configurations
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm min-h-[40px]',
      md: 'px-7 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]',
    };

    // Base button styles
    const baseStyles = `
      relative inline-flex items-center justify-center gap-2
      font-semibold tracking-tight
      rounded-xl overflow-hidden
      transition-all duration-100
      outline-none focus:outline-none
      focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]
      disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
    `;

    // Variant-specific styles
    const variantStyles = {
      primary: `
        bg-gradient-to-br from-[#667EEA] to-[#764BA2]
        text-white
        shadow-[0_4px_15px_rgba(102,126,234,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
        hover:shadow-[0_6px_20px_rgba(102,126,234,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]
        hover:-translate-y-0.5
        active:translate-y-0 active:scale-[0.96]
        before:absolute before:inset-0 before:rounded-xl
        before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
        before:translate-x-[-200%] before:transition-transform before:duration-700
        hover:before:translate-x-[200%]
        ${isPressed ? 'brightness-90' : ''}
      `,
      secondary: `
        bg-transparent
        text-[var(--color-primary)]
        border border-[rgba(102,126,234,0.3)]
        hover:bg-[rgba(102,126,234,0.08)]
        hover:border-[rgba(102,126,234,0.5)]
        active:scale-[0.96]
        active:bg-[rgba(102,126,234,0.12)]
        ${isPressed ? 'border-[rgba(102,126,234,0.6)]' : ''}
      `,
      ghost: `
        bg-transparent
        text-[var(--color-text-body)]
        hover:bg-[rgba(255,255,255,0.05)]
        active:scale-[0.96]
        active:bg-[rgba(255,255,255,0.08)]
      `,
      icon: `
        bg-transparent
        text-[var(--color-text-body)]
        p-2 min-h-[44px] min-w-[44px]
        rounded-full
        hover:bg-[rgba(255,255,255,0.08)]
        active:scale-95
        relative
        after:absolute after:inset-0 after:rounded-full
        after:bg-[var(--color-primary)] after:opacity-0
        after:scale-0 after:transition-all after:duration-300
        active:after:opacity-20 active:after:scale-100
      `,
      destructive: `
        bg-gradient-to-br from-[#EF4444] to-[#DC2626]
        text-white
        shadow-[0_4px_15px_rgba(239,68,68,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
        hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)]
        hover:-translate-y-0.5
        active:translate-y-0 active:scale-[0.96]
        ${isPressed ? 'brightness-90' : ''}
      `,
    };

    const buttonClasses = `${baseStyles} ${variantStyles[variant]}`.trim();

    // Loading spinner component
    const Spinner = () => (
      <motion.div
        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        aria-label="Loading"
      />
    );

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        whileHover={
          !disabled && !loading && !prefersReducedMotion
            ? { scale: 1.02 }
            : undefined
        }
        whileTap={
          !disabled && !loading && !prefersReducedMotion
            ? { scale: 0.96 }
            : undefined
        }
        transition={{
          duration: prefersReducedMotion ? 0 : 0.1,
          ease: 'easeOut',
        }}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {/* Ripple effect */}
        {!disabled && !loading && <Ripple color="rgba(255,255,255,0.3)" duration={0.6} />}
        
        {loading ? (
          <>
            <Spinner />
            {variant !== 'icon' && <span className="opacity-0">{children}</span>}
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
