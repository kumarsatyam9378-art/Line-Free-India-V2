import { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Custom Toggle Switch Component
 * 
 * Features:
 * - Smooth toggle animation
 * - Design token colors
 * - Multiple sizes
 * - Label and description support
 * - Accessible with proper ARIA labels
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <Toggle
 *   label="Enable notifications"
 *   description="Receive email notifications for updates"
 *   checked={enabled}
 *   onChange={(e) => setEnabled(e.target.checked)}
 * />
 * ```
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      description,
      size = 'md',
      checked,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();

    const sizes = {
      sm: {
        track: 'w-10 h-5',
        thumb: 'w-4 h-4',
        translate: 'translate-x-5',
      },
      md: {
        track: 'w-12 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-6',
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7',
      },
    };

    const sizeConfig = sizes[size];

    return (
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0">
          {/* Hidden Checkbox */}
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="sr-only"
            {...props}
          />

          {/* Toggle Track */}
          <div
            className={`
              ${sizeConfig.track}
              rounded-full transition-colors duration-200
              ${
                checked
                  ? 'bg-[var(--color-primary)]'
                  : 'bg-[rgba(255,255,255,0.1)]'
              }
              ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
              ${!disabled ? 'group-hover:bg-opacity-80' : ''}
            `}
          >
            {/* Toggle Thumb */}
            <motion.div
              animate={{
                x: checked ? sizeConfig.translate : '0.125rem',
              }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                duration: prefersReducedMotion ? 0 : undefined,
              }}
              className={`
                ${sizeConfig.thumb}
                bg-white rounded-full shadow-lg
                flex items-center justify-center
                mt-0.5
              `}
            >
              {/* Check Icon (when enabled) */}
              {checked && (
                <motion.svg
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                  className="w-3 h-3 text-[var(--color-primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              )}
            </motion.div>
          </div>
        </div>

        {/* Label and Description */}
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <div className="text-sm font-medium text-[var(--color-text-heading)] mb-0.5">
                {label}
              </div>
            )}
            {description && (
              <div className="text-xs text-[var(--color-text-secondary)]">
                {description}
              </div>
            )}
          </div>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';

/**
 * Toggle Group Component
 * 
 * Group of related toggle switches
 * 
 * @example
 * ```tsx
 * <ToggleGroup title="Notifications">
 *   <Toggle label="Email" checked={email} onChange={setEmail} />
 *   <Toggle label="Push" checked={push} onChange={setPush} />
 * </ToggleGroup>
 * ```
 */
export function ToggleGroup({
  title,
  description,
  children,
  className = '',
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-base font-semibold text-[var(--color-text-heading)] mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-[var(--color-text-secondary)]">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/**
 * Compact Toggle Component
 * 
 * Minimal toggle without label for inline use
 * 
 * @example
 * ```tsx
 * <CompactToggle checked={enabled} onChange={setEnabled} />
 * ```
 */
export const CompactToggle = forwardRef<HTMLInputElement, Omit<ToggleProps, 'label' | 'description'>>(
  ({ size = 'sm', checked, disabled = false, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    const sizes = {
      sm: {
        track: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translate: 'translate-x-4',
      },
      md: {
        track: 'w-10 h-5',
        thumb: 'w-4 h-4',
        translate: 'translate-x-5',
      },
      lg: {
        track: 'w-12 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-6',
      },
    };

    const sizeConfig = sizes[size];

    return (
      <label className="inline-block cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`
            ${sizeConfig.track}
            rounded-full transition-colors duration-200
            ${
              checked
                ? 'bg-[var(--color-primary)]'
                : 'bg-[rgba(255,255,255,0.1)]'
            }
            ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          `}
        >
          <motion.div
            animate={{
              x: checked ? sizeConfig.translate : '0.125rem',
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              duration: prefersReducedMotion ? 0 : undefined,
            }}
            className={`
              ${sizeConfig.thumb}
              bg-white rounded-full shadow-lg mt-0.5
            `}
          />
        </div>
      </label>
    );
  }
);

CompactToggle.displayName = 'CompactToggle';

export default Toggle;
