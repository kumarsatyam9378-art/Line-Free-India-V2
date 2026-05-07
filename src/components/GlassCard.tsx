import React from 'react';

export interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'filled' | 'subtle';
  hover?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  padding?: number | string;
}

export default function GlassCard({
  children,
  variant = 'default',
  hover = false,
  onClick,
  className = '',
  style,
  padding = 16,
}: GlassCardProps) {
  const baseStyle: React.CSSProperties = {
    background: variant === 'filled' ? 'var(--color-card-2)' : 'var(--color-card)',
    border: `1px solid var(--color-border)`,
    borderRadius: 12,
    padding,
    cursor: onClick ? 'pointer' : undefined,
    transition: 'background 0.1s',
    ...style,
  };

  return (
    <div
      className={className}
      style={baseStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
