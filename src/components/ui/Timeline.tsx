import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: ReactNode;
  color?: string;
  metadata?: Record<string, any>;
}

interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'compact';
  className?: string;
}

/**
 * Activity Timeline Component
 * 
 * Features:
 * - Timeline item animations on scroll
 * - Glassmorphic styling
 * - Icon support with color coding
 * - Timestamp display
 * - Hover effects
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <Timeline
 *   items={[
 *     {
 *       id: '1',
 *       title: 'New user registered',
 *       description: 'John Doe joined the platform',
 *       timestamp: '2 hours ago',
 *       icon: <UserIcon />,
 *       color: '#667EEA',
 *     },
 *   ]}
 * />
 * ```
 */
export function Timeline({
  items,
  variant = 'default',
  className = '',
}: TimelineProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`relative ${className}`}>
      {/* Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-primary)]/50 via-[var(--color-primary)]/20 to-transparent" />

      {/* Timeline Items */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              delay: prefersReducedMotion ? 0 : index * 0.1,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="relative pl-16"
          >
            {/* Icon */}
            <div
              className="absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl border-2 z-10"
              style={{
                borderColor: item.color || 'var(--color-primary)',
                color: item.color || 'var(--color-primary)',
              }}
            >
              {item.icon || (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>

            {/* Content */}
            {variant === 'default' ? (
              <Card variant="glass" className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-base font-semibold text-[var(--color-text-heading)]">
                    {item.title}
                  </h4>
                  <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap ml-4">
                    {item.timestamp}
                  </span>
                </div>
                {item.description && (
                  <p className="text-sm text-[var(--color-text-body)] mb-2">
                    {item.description}
                  </p>
                )}
                {item.metadata && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(item.metadata).map(([key, value]) => (
                      <span
                        key={key}
                        className="px-2 py-1 bg-white/5 rounded text-xs text-[var(--color-text-secondary)]"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ) : (
              <div className="py-2">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-[var(--color-text-heading)]">
                    {item.title}
                  </h4>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {item.timestamp}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-[var(--color-text-body)]">
                    {item.description}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * Horizontal Timeline Component
 * 
 * Timeline displayed horizontally for milestones
 * 
 * @example
 * ```tsx
 * <HorizontalTimeline
 *   items={[
 *     { id: '1', title: 'Started', timestamp: 'Jan 2024' },
 *     { id: '2', title: 'In Progress', timestamp: 'Feb 2024' },
 *   ]}
 * />
 * ```
 */
export function HorizontalTimeline({
  items,
  className = '',
}: {
  items: TimelineItem[];
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`relative ${className}`}>
      {/* Timeline Line */}
      <div className="absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />

      {/* Timeline Items */}
      <div className="flex justify-between">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              delay: prefersReducedMotion ? 0 : index * 0.1,
            }}
            className="flex flex-col items-center text-center max-w-[150px]"
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl border-2 mb-4 z-10"
              style={{
                borderColor: item.color || 'var(--color-primary)',
                color: item.color || 'var(--color-primary)',
              }}
            >
              {item.icon || (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>

            {/* Content */}
            <h4 className="text-sm font-semibold text-[var(--color-text-heading)] mb-1">
              {item.title}
            </h4>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {item.timestamp}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * Activity Feed Component
 * 
 * Simplified timeline for activity feeds
 * 
 * @example
 * ```tsx
 * <ActivityFeed
 *   activities={[
 *     { id: '1', user: 'John', action: 'commented', target: 'Post #123', time: '5m ago' },
 *   ]}
 * />
 * ```
 */
export function ActivityFeed({
  activities,
  className = '',
}: {
  activities: Array<{
    id: string;
    user: string;
    action: string;
    target?: string;
    time: string;
    avatar?: string;
  }>;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`space-y-4 ${className}`}>
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            delay: prefersReducedMotion ? 0 : index * 0.05,
          }}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
        >
          {/* Avatar */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#667EEA] to-[#764BA2] flex items-center justify-center text-white font-semibold text-sm">
            {activity.avatar || activity.user.charAt(0).toUpperCase()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--color-text-body)]">
              <span className="font-semibold text-[var(--color-text-heading)]">
                {activity.user}
              </span>{' '}
              {activity.action}{' '}
              {activity.target && (
                <span className="font-medium text-[var(--color-primary)]">
                  {activity.target}
                </span>
              )}
            </p>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {activity.time}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default Timeline;
