import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface BentoGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: number;
  className?: string;
}

interface BentoItemProps {
  children: ReactNode;
  span?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3;
  variant?: 'standard' | 'glass' | 'interactive';
  className?: string;
}

/**
 * Bento Grid Layout Component
 * 
 * Creates a responsive bento-style grid layout
 * 
 * Features:
 * - Responsive columns (1 on mobile, 2-4 on desktop)
 * - Customizable gap
 * - CSS Grid based
 * - Works with Card components
 * 
 * @example
 * ```tsx
 * <BentoGrid columns={3} gap={6}>
 *   <BentoItem span={2}>
 *     <Card variant="glass">Large Item</Card>
 *   </BentoItem>
 *   <BentoItem>
 *     <Card variant="glass">Small Item</Card>
 *   </BentoItem>
 * </BentoGrid>
 * ```
 */
export function BentoGrid({
  children,
  columns = 3,
  gap = 6,
  className = '',
}: BentoGridProps) {
  return (
    <div
      className={`grid gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(1, minmax(0, 1fr))`,
      }}
    >
      <style>
        {`
          @media (min-width: 640px) {
            .bento-grid-${columns} {
              grid-template-columns: repeat(${Math.min(2, columns)}, minmax(0, 1fr));
            }
          }
          @media (min-width: 1024px) {
            .bento-grid-${columns} {
              grid-template-columns: repeat(${columns}, minmax(0, 1fr));
            }
          }
        `}
      </style>
      <div className={`bento-grid-${columns} grid gap-${gap}`}>{children}</div>
    </div>
  );
}

/**
 * Bento Grid Item Component
 * 
 * Individual item in the bento grid with span control
 * 
 * @example
 * ```tsx
 * <BentoItem span={2} rowSpan={2} variant="glass">
 *   Content
 * </BentoItem>
 * ```
 */
export function BentoItem({
  children,
  span = 1,
  rowSpan = 1,
  variant = 'glass',
  className = '',
}: BentoItemProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={{
        gridColumn: `span ${span}`,
        gridRow: `span ${rowSpan}`,
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <Card variant={variant} className="h-full">
        {children}
      </Card>
    </motion.div>
  );
}

/**
 * Feature Bento Grid Component
 * 
 * Pre-configured bento grid for feature showcases
 * 
 * @example
 * ```tsx
 * <FeatureBentoGrid
 *   features={[
 *     { title: 'Feature 1', description: 'Description', icon: <Icon /> },
 *     { title: 'Feature 2', description: 'Description', icon: <Icon /> },
 *   ]}
 * />
 * ```
 */
export function FeatureBentoGrid({
  features,
  columns = 3,
}: {
  features: Array<{
    title: string;
    description: string;
    icon?: ReactNode;
    span?: 1 | 2 | 3 | 4;
    rowSpan?: 1 | 2 | 3;
    image?: string;
  }>;
  columns?: 1 | 2 | 3 | 4;
}) {
  return (
    <BentoGrid columns={columns}>
      {features.map((feature, index) => (
        <BentoItem
          key={index}
          span={feature.span || 1}
          rowSpan={feature.rowSpan || 1}
          variant="glass"
        >
          <div className="p-6 h-full flex flex-col">
            {feature.icon && (
              <div className="mb-4 text-[var(--color-primary)]">
                {feature.icon}
              </div>
            )}
            {feature.image && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-2">
              {feature.title}
            </h3>
            <p className="text-[var(--color-text-body)] flex-grow">
              {feature.description}
            </p>
          </div>
        </BentoItem>
      ))}
    </BentoGrid>
  );
}

/**
 * Stats Bento Grid Component
 * 
 * Pre-configured bento grid for statistics display
 * 
 * @example
 * ```tsx
 * <StatsBentoGrid
 *   stats={[
 *     { label: 'Users', value: '10K+', change: '+12%' },
 *     { label: 'Revenue', value: '$2M', change: '+25%' },
 *   ]}
 * />
 * ```
 */
export function StatsBentoGrid({
  stats,
}: {
  stats: Array<{
    label: string;
    value: string;
    change?: string;
    icon?: ReactNode;
  }>;
}) {
  return (
    <BentoGrid columns={4} gap={4}>
      {stats.map((stat, index) => (
        <BentoItem key={index} variant="glass">
          <div className="p-6">
            {stat.icon && (
              <div className="mb-3 text-[var(--color-primary)]">{stat.icon}</div>
            )}
            <div className="text-3xl font-bold text-[var(--color-text-heading)] mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-[var(--color-text-secondary)] mb-2">
              {stat.label}
            </div>
            {stat.change && (
              <div
                className={`text-xs font-medium ${
                  stat.change.startsWith('+')
                    ? 'text-[var(--color-success)]'
                    : 'text-[var(--color-error)]'
                }`}
              >
                {stat.change}
              </div>
            )}
          </div>
        </BentoItem>
      ))}
    </BentoGrid>
  );
}

/**
 * Masonry Bento Grid Component
 * 
 * Masonry-style bento grid with auto-placement
 * 
 * @example
 * ```tsx
 * <MasonryBentoGrid>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </MasonryBentoGrid>
 * ```
 */
export function MasonryBentoGrid({
  children,
  columns = 3,
  gap = 6,
  className = '',
}: BentoGridProps) {
  return (
    <div
      className={`grid gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(1, minmax(0, 1fr))`,
        gridAutoRows: 'auto',
        gridAutoFlow: 'dense',
      }}
    >
      <style>
        {`
          @media (min-width: 640px) {
            .masonry-grid-${columns} {
              grid-template-columns: repeat(${Math.min(2, columns)}, minmax(0, 1fr));
            }
          }
          @media (min-width: 1024px) {
            .masonry-grid-${columns} {
              grid-template-columns: repeat(${columns}, minmax(0, 1fr));
            }
          }
        `}
      </style>
      <div className={`masonry-grid-${columns} grid gap-${gap}`}>
        {children}
      </div>
    </div>
  );
}

export default BentoGrid;
