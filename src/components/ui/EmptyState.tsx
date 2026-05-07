import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: string;
}

/**
 * Ultra-Premium Empty State Component
 * 
 * Features:
 * - Centered layout (vertically and horizontally)
 * - Optional icon or illustration
 * - Heading and description text
 * - Optional call-to-action button
 * - Smooth fade-in animation
 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  illustration,
}: EmptyStateProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Icon or Illustration */}
      {illustration ? (
        <img
          src={illustration}
          alt=""
          className="w-48 h-48 mb-6 opacity-60"
          aria-hidden="true"
        />
      ) : icon ? (
        <div className="mb-6 text-[var(--color-text-secondary)] opacity-40">
          {icon}
        </div>
      ) : (
        <div className="mb-6 text-6xl opacity-40" aria-hidden="true">
          📭
        </div>
      )}

      {/* Title */}
      <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text-heading)] mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-base text-[var(--color-text-secondary)] max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
};

/**
 * Empty State variants for common scenarios
 */
export const EmptyStateNoResults = ({ onReset }: { onReset?: () => void }) => (
  <EmptyState
    icon={
      <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    }
    title="No results found"
    description="We couldn't find anything matching your search. Try adjusting your filters or search terms."
    action={onReset ? { label: 'Clear filters', onClick: onReset } : undefined}
  />
);

export const EmptyStateNoData = ({ onCreate }: { onCreate?: () => void }) => (
  <EmptyState
    icon={
      <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    }
    title="No data yet"
    description="Get started by creating your first item. It only takes a few seconds."
    action={onCreate ? { label: 'Create new', onClick: onCreate } : undefined}
  />
);

export const EmptyStateError = ({ onRetry }: { onRetry?: () => void }) => (
  <EmptyState
    icon={
      <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    }
    title="Something went wrong"
    description="We encountered an error while loading your data. Please try again."
    action={onRetry ? { label: 'Try again', onClick: onRetry } : undefined}
  />
);

export default EmptyState;
