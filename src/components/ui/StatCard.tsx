import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: ReactNode;
  sparklineData?: number[];
  className?: string;
}

/**
 * Stat Card Component with Sparkline
 * 
 * Features:
 * - Glassmorphic background
 * - Sparkline chart for trend visualization
 * - Change indicator with color coding
 * - Icon support
 * - Hover effects
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <StatCard
 *   label="Total Revenue"
 *   value="$45,231"
 *   change={{ value: '+12.5%', trend: 'up' }}
 *   icon={<DollarIcon />}
 *   sparklineData={[10, 20, 15, 30, 25, 40, 35]}
 * />
 * ```
 */
export function StatCard({
  label,
  value,
  change,
  icon,
  sparklineData,
  className = '',
}: StatCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Card variant="glass" className={`p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
            {label}
          </p>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            className="text-3xl font-bold text-[var(--color-text-heading)]"
          >
            {value}
          </motion.h3>
        </div>

        {icon && (
          <div className="flex-shrink-0 p-3 bg-[var(--color-primary)]/10 rounded-xl text-[var(--color-primary)]">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {change && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              change.trend === 'up'
                ? 'text-[var(--color-success)]'
                : change.trend === 'down'
                ? 'text-[var(--color-error)]'
                : 'text-[var(--color-text-secondary)]'
            }`}
          >
            {change.trend === 'up' && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            )}
            {change.trend === 'down' && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            )}
            <span>{change.value}</span>
          </div>
        )}

        {sparklineData && (
          <div className="flex-1 max-w-[120px]">
            <Sparkline data={sparklineData} color="var(--color-primary)" />
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Sparkline Chart Component
 * 
 * Minimal line chart for trend visualization
 * 
 * @example
 * ```tsx
 * <Sparkline data={[10, 20, 15, 30, 25, 40]} color="#667EEA" />
 * ```
 */
export function Sparkline({
  data,
  color = 'var(--color-primary)',
  height = 40,
  strokeWidth = 2,
  className = '',
}: {
  data: number[];
  color?: string;
  height?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const width = data.length * 10;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
    >
      {/* Gradient Fill */}
      <defs>
        <linearGradient id="sparklineGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
        d={`M 0,${height} L ${points} L ${width},${height} Z`}
        fill="url(#sparklineGradient)"
      />

      {/* Line */}
      <motion.polyline
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 1,
          ease: 'easeInOut',
        }}
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Stat Grid Component
 * 
 * Grid layout for multiple stat cards
 * 
 * @example
 * ```tsx
 * <StatGrid>
 *   <StatCard label="Users" value="10,234" />
 *   <StatCard label="Revenue" value="$45,231" />
 * </StatGrid>
 * ```
 */
export function StatGrid({
  children,
  columns = 4,
  gap = 6,
  className = '',
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: number;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-${gap} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Compact Stat Card Component
 * 
 * Smaller version for dense layouts
 * 
 * @example
 * ```tsx
 * <CompactStatCard
 *   label="Active Users"
 *   value="1,234"
 *   change="+5.2%"
 * />
 * ```
 */
export function CompactStatCard({
  label,
  value,
  change,
  icon,
  className = '',
}: {
  label: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-colors ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
          {label}
        </span>
        {icon && (
          <div className="text-[var(--color-primary)] opacity-50">{icon}</div>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-[var(--color-text-heading)]">
          {value}
        </span>
        {change && (
          <span
            className={`text-xs font-medium ${
              change.startsWith('+')
                ? 'text-[var(--color-success)]'
                : change.startsWith('-')
                ? 'text-[var(--color-error)]'
                : 'text-[var(--color-text-secondary)]'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
