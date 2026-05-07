import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ParallaxCoverProps {
  image: string;
  height?: number;
  overlay?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Parallax Cover Image Component
 * 
 * Features:
 * - Parallax scroll effect using transform: translateY
 * - Smooth animation tied to scroll position
 * - Optional gradient overlay
 * - Content overlay support
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <ParallaxCover
 *   image="/cover.jpg"
 *   height={400}
 *   overlay
 * >
 *   <h1>Profile Title</h1>
 * </ParallaxCover>
 * ```
 */
export function ParallaxCover({
  image,
  height = 400,
  overlay = true,
  children,
  className = '',
}: ParallaxCoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // Transform scroll position to parallax effect
  const y = useTransform(
    scrollY,
    [0, height],
    prefersReducedMotion ? [0, 0] : [0, height * 0.5]
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
    >
      {/* Parallax Image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%]"
      >
        <img
          src={image}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Gradient Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
      )}

      {/* Content */}
      {children && (
        <div className="relative z-10 h-full flex items-end p-8">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Profile Header Component
 * 
 * Complete profile header with parallax cover and avatar
 * 
 * @example
 * ```tsx
 * <ProfileHeader
 *   coverImage="/cover.jpg"
 *   avatar="/avatar.jpg"
 *   name="John Doe"
 *   bio="Software Developer"
 * />
 * ```
 */
export function ProfileHeader({
  coverImage,
  avatar,
  name,
  bio,
  stats,
  actions,
  className = '',
}: {
  coverImage: string;
  avatar: string;
  name: string;
  bio?: string;
  stats?: Array<{ label: string; value: string | number }>;
  actions?: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`relative ${className}`}>
      {/* Parallax Cover */}
      <ParallaxCover image={coverImage} height={300} overlay />

      {/* Profile Content */}
      <div className="relative -mt-20 px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[var(--color-bg-primary)] shadow-2xl">
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online Status */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-[var(--color-success)] border-4 border-[var(--color-bg-primary)] rounded-full" />
          </motion.div>

          {/* Info */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.5,
                delay: prefersReducedMotion ? 0 : 0.1,
              }}
              className="text-3xl font-bold text-[var(--color-text-heading)] mb-2"
            >
              {name}
            </motion.h1>
            {bio && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.5,
                  delay: prefersReducedMotion ? 0 : 0.2,
                }}
                className="text-[var(--color-text-body)] mb-4"
              >
                {bio}
              </motion.p>
            )}

            {/* Stats */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.5,
                  delay: prefersReducedMotion ? 0 : 0.3,
                }}
                className="flex gap-6"
              >
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-2xl font-bold text-[var(--color-text-heading)]">
                      {stat.value}
                    </div>
                    <div className="text-sm text-[var(--color-text-secondary)]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.5,
                delay: prefersReducedMotion ? 0 : 0.4,
              }}
              className="flex gap-3"
            >
              {actions}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Parallax Section Component
 * 
 * Generic parallax section for any content
 * 
 * @example
 * ```tsx
 * <ParallaxSection
 *   backgroundImage="/bg.jpg"
 *   speed={0.5}
 * >
 *   <Content />
 * </ParallaxSection>
 * ```
 */
export function ParallaxSection({
  backgroundImage,
  speed = 0.5,
  children,
  className = '',
}: {
  backgroundImage: string;
  speed?: number;
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const offset = (scrolled - rect.top) * speed;
      setOffsetY(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${offsetY}px)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default ParallaxCover;
