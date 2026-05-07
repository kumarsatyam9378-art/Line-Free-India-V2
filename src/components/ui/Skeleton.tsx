import { HTMLAttributes } from 'react';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Ultra-Premium Skeleton Component
 * 
 * Features:
 * - Shimmer effect animation
 * - Multiple variants (text, circular, rectangular)
 * - Customizable dimensions
 * - Smooth loading experience
 */
export const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  animation = 'wave',
  style,
  ...props
}: SkeletonProps) => {
  const variantStyles = {
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'skeleton-shimmer',
    none: '',
  };

  return (
    <div
      className={`
        bg-[rgba(255,255,255,0.05)]
        ${variantStyles[variant]}
        ${animationStyles[animation]}
      `}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1rem' : '100%'),
        ...style,
      }}
      aria-busy="true"
      aria-live="polite"
      {...props}
    />
  );
};

/**
 * Skeleton Group for multiple skeletons
 */
export const SkeletonGroup = ({ count = 3, spacing = 12 }: { count?: number; spacing?: number }) => (
  <div className="space-y-3" style={{ gap: `${spacing}px` }}>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} variant="text" />
    ))}
  </div>
);

/**
 * Skeleton Card for card loading states
 */
export const SkeletonCard = () => (
  <div className="p-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-3xl">
    <div className="flex items-start gap-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-3">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
    </div>
  </div>
);

export default Skeleton;
