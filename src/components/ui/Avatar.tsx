import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  ring?: boolean;
  ringColor?: string;
  fallback?: string;
  className?: string;
}

/**
 * Avatar Component with Ring Effect
 * 
 * Features:
 * - Multiple sizes (xs to 2xl)
 * - Animated ring glow effect using box-shadow
 * - Status indicator
 * - Fallback initials
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <Avatar
 *   src="/avatar.jpg"
 *   alt="John Doe"
 *   size="xl"
 *   ring
 *   status="online"
 * />
 * ```
 */
export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  status,
  ring = false,
  ringColor = 'var(--color-primary)',
  fallback,
  className = '',
}: AvatarProps) {
  const prefersReducedMotion = useReducedMotion();

  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
    '2xl': 'w-6 h-6',
  };

  const statusColors = {
    online: 'bg-[var(--color-success)]',
    offline: 'bg-[var(--color-text-secondary)]',
    away: 'bg-[#F59E0B]',
    busy: 'bg-[var(--color-error)]',
  };

  const statusPositions = {
    xs: 'bottom-0 right-0',
    sm: 'bottom-0 right-0',
    md: 'bottom-0.5 right-0.5',
    lg: 'bottom-1 right-1',
    xl: 'bottom-1.5 right-1.5',
    '2xl': 'bottom-2 right-2',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        className={`${sizes[size]} rounded-full overflow-hidden relative`}
        style={{
          boxShadow: ring
            ? `0 0 0 3px ${ringColor}20, 0 0 20px ${ringColor}40`
            : undefined,
        }}
        whileHover={
          ring && !prefersReducedMotion
            ? {
                boxShadow: `0 0 0 4px ${ringColor}30, 0 0 30px ${ringColor}60`,
              }
            : undefined
        }
        transition={{ duration: 0.3 }}
      >
        {/* Ring Animation */}
        {ring && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 20px ${ringColor}`,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Image or Fallback */}
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#667EEA] to-[#764BA2] flex items-center justify-center text-white font-bold">
            {fallback || alt.charAt(0).toUpperCase()}
          </div>
        )}
      </motion.div>

      {/* Status Indicator */}
      {status && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
          className={`absolute ${statusPositions[size]} ${statusSizes[size]} ${statusColors[status]} rounded-full border-2 border-[var(--color-bg-primary)]`}
        />
      )}
    </div>
  );
}

/**
 * Avatar Group Component
 * 
 * Displays multiple avatars in an overlapping group
 * 
 * @example
 * ```tsx
 * <AvatarGroup max={3}>
 *   <Avatar src="/user1.jpg" />
 *   <Avatar src="/user2.jpg" />
 *   <Avatar src="/user3.jpg" />
 * </AvatarGroup>
 * ```
 */
export function AvatarGroup({
  children,
  max = 5,
  size = 'md',
  className = '',
}: {
  children: ReactNode;
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}) {
  const childArray = Array.isArray(children) ? children : [children];
  const displayedChildren = childArray.slice(0, max);
  const remaining = childArray.length - max;

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg',
    '2xl': 'w-32 h-32 text-xl',
  };

  return (
    <div className={`flex items-center ${className}`}>
      {displayedChildren.map((child, index) => (
        <div
          key={index}
          className="relative"
          style={{
            marginLeft: index > 0 ? '-0.75rem' : 0,
            zIndex: displayedChildren.length - index,
          }}
        >
          {child}
        </div>
      ))}

      {remaining > 0 && (
        <div
          className={`${sizes[size]} rounded-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-bg-primary)] flex items-center justify-center font-semibold text-[var(--color-text-body)] relative`}
          style={{
            marginLeft: '-0.75rem',
            zIndex: 0,
          }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

/**
 * Animated Avatar Component
 * 
 * Avatar with entrance animation
 * 
 * @example
 * ```tsx
 * <AnimatedAvatar
 *   src="/avatar.jpg"
 *   size="xl"
 *   ring
 *   delay={0.2}
 * />
 * ```
 */
export function AnimatedAvatar({
  delay = 0,
  ...props
}: AvatarProps & { delay?: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        delay: prefersReducedMotion ? 0 : delay,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      <Avatar {...props} />
    </motion.div>
  );
}

/**
 * Avatar Upload Component
 * 
 * Avatar with upload functionality
 * 
 * @example
 * ```tsx
 * <AvatarUpload
 *   src="/avatar.jpg"
 *   onUpload={(file) => handleUpload(file)}
 * />
 * ```
 */
export function AvatarUpload({
  src,
  alt = 'Avatar',
  size = 'xl',
  onUpload,
  className = '',
}: {
  src?: string;
  alt?: string;
  size?: AvatarProps['size'];
  onUpload: (file: File) => void;
  className?: string;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className={`relative inline-block group ${className}`}>
      <Avatar src={src} alt={alt} size={size} />

      {/* Upload Overlay */}
      <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
        />
      </label>
    </div>
  );
}

export default Avatar;
