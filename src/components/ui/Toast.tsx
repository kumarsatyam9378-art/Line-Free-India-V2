import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Ultra-Premium Toast Component
 * 
 * Features:
 * - Slide-in animation from right or top
 * - Auto-dismiss after 3-5 seconds
 * - Progress bar showing time until dismiss
 * - Close button for manual dismissal
 * - Variants: success (green), error (red), warning (amber), info (blue)
 * - Icon matching variant type
 * - Stacking with 8px gap
 * - Pause on hover
 */
export const Toast = ({
  id,
  variant,
  title,
  description,
  duration = 5000,
  onClose,
  action,
}: ToastProps) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 50));
        if (newProgress <= 0) {
          onClose(id);
          return 0;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, id, onClose, isPaused]);

  // Variant configurations
  const variantConfig = {
    success: {
      bg: 'bg-[rgba(16,185,129,0.1)]',
      border: 'border-[rgba(16,185,129,0.3)]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconColor: 'text-[#10B981]',
      progressColor: 'bg-[#10B981]',
    },
    error: {
      bg: 'bg-[rgba(239,68,68,0.1)]',
      border: 'border-[rgba(239,68,68,0.3)]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconColor: 'text-[#EF4444]',
      progressColor: 'bg-[#EF4444]',
    },
    warning: {
      bg: 'bg-[rgba(245,158,11,0.1)]',
      border: 'border-[rgba(245,158,11,0.3)]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      iconColor: 'text-[#F59E0B]',
      progressColor: 'bg-[#F59E0B]',
    },
    info: {
      bg: 'bg-[rgba(59,130,246,0.1)]',
      border: 'border-[rgba(59,130,246,0.3)]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconColor: 'text-[#3B82F6]',
      progressColor: 'bg-[#3B82F6]',
    },
  };

  const config = variantConfig[variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`
        relative w-full max-w-sm
        ${config.bg}
        backdrop-blur-xl
        border ${config.border}
        rounded-2xl
        shadow-lg
        overflow-hidden
        pointer-events-auto
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Content */}
      <div className="p-4 flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          {config.icon}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--color-text-heading)]">
            {title}
          </p>
          {description && (
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {description}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-xs font-semibold text-[var(--color-primary)] hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => onClose(id)}
          className="
            flex-shrink-0 p-1 rounded-lg
            text-[var(--color-text-secondary)]
            hover:text-[var(--color-text-body)]
            hover:bg-[rgba(255,255,255,0.05)]
            transition-colors
          "
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-[rgba(255,255,255,0.05)]">
        <motion.div
          className={`h-full ${config.progressColor}`}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
};

/**
 * Toast Container Component
 */
export const ToastContainer = ({ children }: { children: ReactNode }) => {
  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </div>,
    document.body
  );
};

/**
 * Toast Hook for managing toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...toast, id, onClose: removeToast }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (title: string, description?: string) => {
    addToast({ variant: 'success', title, description });
  };

  const error = (title: string, description?: string) => {
    addToast({ variant: 'error', title, description });
  };

  const warning = (title: string, description?: string) => {
    addToast({ variant: 'warning', title, description });
  };

  const info = (title: string, description?: string) => {
    addToast({ variant: 'info', title, description });
  };

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
  };
};

export default Toast;
