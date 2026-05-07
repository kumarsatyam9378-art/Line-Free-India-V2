import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedChartProps {
  data: ChartData[];
  title?: string;
  subtitle?: string;
  type?: 'bar' | 'line' | 'donut';
  height?: number;
  className?: string;
}

/**
 * Animated Chart Component
 * 
 * Features:
 * - Smooth chart animations on data load
 * - Multiple chart types (bar, line, donut)
 * - Design token colors
 * - Glassmorphic card wrapper
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <AnimatedChart
 *   type="bar"
 *   title="Monthly Revenue"
 *   data={[
 *     { label: 'Jan', value: 4500 },
 *     { label: 'Feb', value: 5200 },
 *   ]}
 * />
 * ```
 */
export function AnimatedChart({
  data,
  title,
  subtitle,
  type = 'bar',
  height = 300,
  className = '',
}: AnimatedChartProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Card variant="glass" className={`p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-[var(--color-text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div style={{ height: `${height}px` }}>
        {type === 'bar' && <BarChart data={data} height={height} />}
        {type === 'line' && <LineChart data={data} height={height} />}
        {type === 'donut' && <DonutChart data={data} />}
      </div>
    </Card>
  );
}

/**
 * Bar Chart Component
 */
function BarChart({ data, height }: { data: ChartData[]; height: number }) {
  const prefersReducedMotion = useReducedMotion();
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end justify-between gap-4 h-full">
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * (height - 60);
        const color = item.color || 'var(--color-primary)';

        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="relative w-full flex items-end justify-center h-full">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: barHeight, opacity: 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.8,
                  delay: prefersReducedMotion ? 0 : index * 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="w-full rounded-t-lg relative group cursor-pointer"
                style={{
                  background: `linear-gradient(to top, ${color}, ${color}80)`,
                }}
              >
                {/* Value Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-bg-secondary)] px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                  {item.value.toLocaleString()}
                </div>
              </motion.div>
            </div>
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Line Chart Component
 */
function LineChart({ data, height }: { data: ChartData[]; height: number }) {
  const prefersReducedMotion = useReducedMotion();
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const chartHeight = height - 60;
  const chartWidth = 100;
  const stepX = chartWidth / (data.length - 1);

  const points = data
    .map((item, index) => {
      const x = index * stepX;
      const y = chartHeight - ((item.value - minValue) / range) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  const pathD = `M 0,${chartHeight} L ${points} L ${chartWidth},${chartHeight} Z`;

  return (
    <div className="relative w-full h-full">
      <svg
        width="100%"
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="none"
        className="mb-4"
      >
        {/* Gradient */}
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-primary)"
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor="var(--color-primary)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Area */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          d={pathD}
          fill="url(#lineGradient)"
        />

        {/* Line */}
        <motion.polyline
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1.5,
            ease: 'easeInOut',
          }}
          points={points}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data Points */}
        {data.map((item, index) => {
          const x = index * stepX;
          const y =
            chartHeight - ((item.value - minValue) / range) * chartHeight;

          return (
            <motion.circle
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : index * 0.1 + 0.5,
              }}
              cx={`${x}%`}
              cy={y}
              r="3"
              fill="var(--color-primary)"
              className="cursor-pointer hover:r-4 transition-all"
            />
          );
        })}
      </svg>

      {/* Labels */}
      <div className="flex justify-between">
        {data.map((item, index) => (
          <span
            key={index}
            className="text-xs font-medium text-[var(--color-text-secondary)]"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Donut Chart Component
 */
function DonutChart({ data }: { data: ChartData[] }) {
  const prefersReducedMotion = useReducedMotion();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const size = 200;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentAngle = 0;

  const colors = [
    '#667EEA',
    '#764BA2',
    '#F093FB',
    '#4FACFE',
    '#43E97B',
    '#FA709A',
  ];

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${
              (percentage / 100) * circumference
            } ${circumference}`;
            const strokeDashoffset =
              circumference - (currentAngle / 360) * circumference;

            currentAngle += (percentage / 100) * 360;

            const color = item.color || colors[index % colors.length];

            return (
              <motion.circle
                key={index}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 1,
                  delay: prefersReducedMotion ? 0 : index * 0.2,
                  ease: 'easeInOut',
                }}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDashoffset={strokeDashoffset}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[var(--color-text-heading)]">
            {total.toLocaleString()}
          </span>
          <span className="text-sm text-[var(--color-text-secondary)]">
            Total
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          const color = item.color || colors[index % colors.length];

          return (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--color-text-body)]">
                  {item.label}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  {item.value.toLocaleString()} ({percentage}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AnimatedChart;
