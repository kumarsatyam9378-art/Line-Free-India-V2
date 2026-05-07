import { InputHTMLAttributes, useState, useEffect, forwardRef, ReactNode, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  icon?: ReactNode;
  showPasswordToggle?: boolean;
  onValidate?: (value: string) => Promise<string | undefined> | string | undefined;
  validationDebounce?: number;
}

/**
 * Ultra-Premium Input Component with Floating Labels
 * 
 * Features:
 * - Floating label animation on focus
 * - Real-time validation with debounce (300ms)
 * - Success/error states with icons
 * - Password visibility toggle
 * - Glow effect on focus
 * - Accessible with proper ARIA labels
 * - Animated validation feedback
 * - Respects prefers-reduced-motion
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success = false,
      helperText,
      icon,
      showPasswordToggle = false,
      type = 'text',
      value,
      disabled = false,
      required = false,
      onValidate,
      validationDebounce = 300,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');
    const [validationError, setValidationError] = useState<string | undefined>(error);
    const [isValidating, setIsValidating] = useState(false);
    const validationTimeoutRef = useRef<NodeJS.Timeout>();
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
      setIsFilled(!!value || !!internalValue);
    }, [value, internalValue]);

    // Update validation error when error prop changes
    useEffect(() => {
      setValidationError(error);
    }, [error]);

    // Debounced validation
    const validateValue = useCallback(
      async (val: string) => {
        if (!onValidate) return;

        // Clear previous timeout
        if (validationTimeoutRef.current) {
          clearTimeout(validationTimeoutRef.current);
        }

        // Set validating state
        setIsValidating(true);

        // Debounce validation
        validationTimeoutRef.current = setTimeout(async () => {
          try {
            const errorMessage = await onValidate(val);
            setValidationError(errorMessage);
          } catch (err) {
            console.error('Validation error:', err);
          } finally {
            setIsValidating(false);
          }
        }, validationDebounce);
      },
      [onValidate, validationDebounce]
    );

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (validationTimeoutRef.current) {
          clearTimeout(validationTimeoutRef.current);
        }
      };
    }, []);

    const isFloating = isFocused || isFilled;
    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password')
      : type;

    const displayError = validationError || error;

    // Determine border color based on state
    const getBorderColor = () => {
      if (displayError) return 'border-[rgba(239,68,68,0.5)]';
      if (success && !isValidating) return 'border-[rgba(16,185,129,0.5)]';
      if (isFocused) return 'border-[rgba(102,126,234,0.5)]';
      return 'border-[rgba(255,255,255,0.06)]';
    };

    // Determine glow effect
    const getGlowEffect = () => {
      if (displayError) return 'shadow-[0_0_0_4px_rgba(239,68,68,0.1)]';
      if (success && !isValidating) return 'shadow-[0_0_0_4px_rgba(16,185,129,0.1)]';
      if (isFocused) return 'shadow-[0_0_0_4px_rgba(102,126,234,0.1)]';
      return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      
      // Trigger validation
      if (onValidate) {
        validateValue(newValue);
      }
      
      props.onChange?.(e);
    };

    return (
      <div className="relative w-full mb-6">
        {/* Input Container */}
        <div className="relative">
          {/* Icon (if provided) */}
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none z-10">
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={inputType}
            value={value !== undefined ? value : internalValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            required={required}
            className={`
              w-full
              pt-6 pb-2 px-4
              ${icon ? 'pl-12' : 'pl-4'}
              ${showPasswordToggle ? 'pr-12' : 'pr-4'}
              bg-[rgba(255,255,255,0.03)]
              border-2 ${getBorderColor()}
              rounded-2xl
              text-[var(--color-text-body)]
              text-base
              outline-none
              transition-all duration-300
              ${getGlowEffect()}
              disabled:opacity-40 disabled:cursor-not-allowed
              placeholder:text-transparent
            `}
            placeholder={label}
            aria-label={label}
            aria-invalid={!!displayError}
            aria-describedby={displayError ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />

          {/* Floating Label */}
          <motion.label
            className={`
              absolute left-4 ${icon ? 'left-12' : 'left-4'}
              pointer-events-none
              text-[var(--color-text-secondary)]
              transition-all duration-300
              ${isFloating 
                ? 'top-2 text-xs font-medium' 
                : 'top-1/2 -translate-y-1/2 text-base'
              }
              ${isFocused && !displayError && !success ? 'text-[var(--color-primary)]' : ''}
              ${displayError ? 'text-[rgba(239,68,68,0.8)]' : ''}
              ${success && !isValidating ? 'text-[rgba(16,185,129,0.8)]' : ''}
            `}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    top: isFloating ? '8px' : '50%',
                    fontSize: isFloating ? '0.75rem' : '1rem',
                    transform: isFloating ? 'translateY(0)' : 'translateY(-50%)',
                  }
            }
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {label}
            {required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </motion.label>

          {/* Password Toggle */}
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-body)] transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}

          {/* Success/Error/Validating Icon */}
          {(success || displayError || isValidating) && !showPasswordToggle && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                isValidating
                  ? 'text-[var(--color-text-secondary)]'
                  : success
                  ? 'text-[var(--color-success)]'
                  : 'text-[var(--color-error)]'
              }`}
            >
              {isValidating ? (
                <motion.svg
                  className="w-5 h-5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </motion.svg>
              ) : success ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </motion.div>
          )}
        </div>

        {/* Helper Text / Error Message */}
        <AnimatePresence mode="wait">
          {(displayError || helperText) && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className={`mt-2 text-xs font-medium ${displayError ? 'text-[var(--color-error)]' : 'text-[var(--color-text-secondary)]'}`}
              id={displayError ? `${props.id}-error` : `${props.id}-helper`}
              role={displayError ? 'alert' : undefined}
            >
              {displayError || helperText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
