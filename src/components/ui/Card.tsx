import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  variant?: 'standard' | 'glass' | 'interactive';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: ReactNode;
}

/**
 * Ultra-Premium Card Component
 * 
 * Features:
 * - Standard variant with subtle background
 * - Glass variant with backdrop-blur
 * - Interactive variant with hover lift effect
 * - Consistent border-radius (16px-24px)
 * - Enhanced shadows on hover
 * - Border glow on hover for interactive cards
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'standard',
      padding = 'md',
      hover = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = variant === 'interactive' || hover || !!onClick;

    // Padding configurations
    const paddingClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // Base card styles
    const baseStyles = `
      relative
      rounded-3xl
      transition-all duration-300
      ${paddingClasses[padding]}
      ${isInteractive ? 'cursor-pointer' : ''}
    `;

    // Variant-specific styles
    const variantStyles = {
      standard: `
        bg-[rgba(255,255,255,0.03)]
        border border-[rgba(255,255,255,0.06)]
        ${isInteractive ? `
          hover:bg-[rgba(255,255,255,0.05)]
          hover:border-[rgba(255,255,255,0.12)]
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]
          hover:-translate-y-1
        ` : ''}
      `,
      glass: `
        bg-[rgba(255,255,255,0.05)]
        backdrop-blur-[20px]
        -webkit-backdrop-filter: blur(20px)
        border border-[rgba(255,255,255,0.1)]
        shadow-[0_8px_32px_rgba(0,0,0,0.2)]
        ${isInteractive ? `
          hover:bg-[rgba(255,255,255,0.08)]
          hover:border-[rgba(255,255,255,0.15)]
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]
          hover:-translate-y-1
        ` : ''}
      `,
      interactive: `
        bg-[rgba(255,255,255,0.03)]
        border border-[rgba(255,255,255,0.06)]
        hover:bg-[rgba(255,255,255,0.05)]
        hover:border-[rgba(102,126,234,0.3)]
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.3),0_0_0_1px_rgba(102,126,234,0.2)]
        hover:-translate-y-1
        active:-translate-y-0.5
        active:scale-[0.99]
      `,
    };

    const cardClasses = `${baseStyles} ${variantStyles[variant]}`.trim();

    // Animation variants for framer-motion
    const motionVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    };

    return (
      <motion.div
        ref={ref}
        className={cardClasses}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e as any);
          }
        } : undefined}
        whileHover={isInteractive ? { scale: 1.01 } : undefined}
        whileTap={isInteractive ? { scale: 0.99 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header Component
 */
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div
      ref={ref}
      className="mb-4 pb-4 border-b border-[rgba(255,255,255,0.06)]"
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Title Component
 */
export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ children, ...props }, ref) => (
    <h3
      ref={ref}
      className="text-xl font-bold tracking-tight text-[var(--color-text-heading)]"
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

/**
 * Card Description Component
 */
export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ children, ...props }, ref) => (
    <p
      ref={ref}
      className="text-sm text-[var(--color-text-secondary)] mt-1"
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

/**
 * Card Content Component
 */
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div
      ref={ref}
      className="text-[var(--color-text-body)]"
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

/**
 * Card Footer Component
 */
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div
      ref={ref}
      className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-3"
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export default Card;
