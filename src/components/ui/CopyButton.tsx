import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CopyButtonProps {
  text: string;
  children?: ReactNode;
  successMessage?: string;
  className?: string;
  iconOnly?: boolean;
}

/**
 * Copy to Clipboard Button Component
 * 
 * Features:
 * - One-click copy functionality
 * - Visual feedback with icon animation
 * - Tooltip confirmation
 * - Haptic feedback on mobile
 * - Accessible with ARIA labels
 * 
 * @example
 * ```tsx
 * <CopyButton text="Hello World">
 *   Copy Text
 * </CopyButton>
 * 
 * <CopyButton text="npm install package" iconOnly />
 * ```
 */
export function CopyButton({
  text,
  children,
  successMessage = 'Copied!',
  className = '',
  iconOnly = false,
}: CopyButtonProps) {
  const { copy, isCopied } = useCopyToClipboard({ successDuration: 2000 });
  const prefersReducedMotion = useReducedMotion();

  const handleCopy = () => {
    copy(text);
  };

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={handleCopy}
        className={`
          relative inline-flex items-center justify-center gap-2
          px-4 py-2 rounded-lg
          bg-[rgba(255,255,255,0.05)]
          hover:bg-[rgba(255,255,255,0.08)]
          border border-[rgba(255,255,255,0.1)]
          text-[var(--color-text-body)]
          font-medium text-sm
          transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
          ${iconOnly ? 'p-2' : ''}
          ${className}
        `}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
        aria-label={isCopied ? successMessage : 'Copy to clipboard'}
      >
        <AnimatePresence mode="wait">
          {isCopied ? (
            <motion.svg
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="w-5 h-5 text-[var(--color-success)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="copy"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </motion.svg>
          )}
        </AnimatePresence>
        {!iconOnly && (
          <span className="whitespace-nowrap">
            {isCopied ? successMessage : children || 'Copy'}
          </span>
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {isCopied && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-[var(--color-bg-secondary)] backdrop-blur-lg border border-[rgba(255,255,255,0.1)] rounded-lg shadow-lg text-sm font-medium text-[var(--color-text-body)] whitespace-nowrap pointer-events-none z-50"
          >
            {successMessage}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--color-bg-secondary)] border-r border-b border-[rgba(255,255,255,0.1)] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Inline Copy Component
 * 
 * For copying inline text or code snippets
 * 
 * @example
 * ```tsx
 * <InlineCopy text="npm install package">
 *   npm install package
 * </InlineCopy>
 * ```
 */
export function InlineCopy({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  const { copy, isCopied } = useCopyToClipboard({ successDuration: 2000 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <span className="relative inline-flex items-center gap-2 group">
      <code className="px-2 py-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded text-sm font-mono">
        {children}
      </code>
      <motion.button
        onClick={() => copy(text)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[rgba(255,255,255,0.05)] rounded"
        whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
        aria-label="Copy to clipboard"
      >
        <AnimatePresence mode="wait">
          {isCopied ? (
            <motion.svg
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-4 h-4 text-[var(--color-success)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </span>
  );
}

export default CopyButton;
