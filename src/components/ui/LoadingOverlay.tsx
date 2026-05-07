import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import Spinner from './Spinner';

export interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children?: ReactNode;
}

/**
 * Ultra-Premium Loading Overlay Component
 * 
 * Features:
 * - Full-page blur backdrop
 * - Centered spinner with optional text
 * - Smooth fade in/out animation
 * - Prevents interaction while loading
 */
export const LoadingOverlay = ({ isLoading, text = 'Loading...', children }: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return createPortal(
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4 p-8 bg-[var(--color-bg-elevated)] border border-[rgba(255,255,255,0.1)] rounded-3xl shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <Spinner size="lg" />
            {text && (
              <p className="text-sm font-medium text-[var(--color-text-body)]">
                {text}
              </p>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LoadingOverlay;
