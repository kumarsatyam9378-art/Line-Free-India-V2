import React from 'react';

export interface GradientButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantMap = {
  primary: {
    background: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: 'var(--color-card-2)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  },
  danger: {
    background: 'var(--color-danger)',
    color: '#fff',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-primary)',
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: 'var(--color-primary)',
    border: '1.5px solid var(--color-primary)',
  },
};

const sizeMap = {
  sm: { padding: '8px 16px', fontSize: 14, borderRadius: 10, height: 36 },
  md: { padding: '12px 20px', fontSize: 16, borderRadius: 12, height: 48 },
  lg: { padding: '14px 24px', fontSize: 17, borderRadius: 14, height: 54 },
};

export default function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  icon,
  fullWidth = false,
  className = '',
  type = 'button',
}: GradientButtonProps) {
  const v = variantMap[variant];
  const s = sizeMap[size];
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: fullWidth ? '100%' : undefined,
        height: s.height,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        borderRadius: s.borderRadius,
        letterSpacing: '-0.01em',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transition: 'opacity 0.15s, transform 0.1s',
        ...v,
      }}
    >
      {loading ? (
        <span style={{
          width: 18, height: 18,
          border: `2px solid ${variant === 'primary' ? 'rgba(255,255,255,0.3)' : 'var(--color-border)'}`,
          borderTopColor: variant === 'primary' ? '#fff' : 'var(--color-primary)',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'spin 0.7s linear infinite',
        }} />
      ) : (
        <>
          {icon && <span style={{ display: 'flex', alignItems: 'center', fontSize: '1em' }}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
