import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { MeshGradientBackground } from './AnimatedGradientMesh';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ErrorPageProps {
  code?: string | number;
  title: string;
  description?: string;
  illustration?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Error Page Component
 * 
 * Features:
 * - Creative branded design
 * - Animated graphics
 * - Helpful navigation links
 * - Gradient mesh background
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <ErrorPage
 *   code="404"
 *   title="Page Not Found"
 *   description="The page you're looking for doesn't exist."
 *   actions={
 *     <>
 *       <Button onClick={() => navigate('/')}>Go Home</Button>
 *       <Button variant="ghost" onClick={() => navigate(-1)}>Go Back</Button>
 *     </>
 *   }
 * />
 * ```
 */
export function ErrorPage({
  code,
  title,
  description,
  illustration,
  actions,
  className = '',
}: ErrorPageProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden ${className}`}>
      {/* Background */}
      <MeshGradientBackground />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Error Code */}
        {code && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="mb-8"
          >
            <div className="text-[150px] md:text-[200px] font-bold leading-none bg-gradient-to-br from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
              {code}
            </div>
          </motion.div>
        )}

        {/* Illustration */}
        {illustration && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              delay: prefersReducedMotion ? 0 : 0.2,
            }}
            className="mb-8"
          >
            {illustration}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            delay: prefersReducedMotion ? 0 : 0.3,
          }}
          className="text-4xl md:text-5xl font-bold text-[var(--color-text-heading)] mb-4"
        >
          {title}
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              delay: prefersReducedMotion ? 0 : 0.4,
            }}
            className="text-lg text-[var(--color-text-body)] mb-8"
          >
            {description}
          </motion.p>
        )}

        {/* Actions */}
        {actions && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              delay: prefersReducedMotion ? 0 : 0.5,
            }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/**
 * 404 Not Found Page
 * 
 * Pre-configured 404 error page
 * 
 * @example
 * ```tsx
 * <NotFoundPage onGoHome={() => navigate('/')} />
 * ```
 */
export function NotFoundPage({
  onGoHome,
  onGoBack,
}: {
  onGoHome?: () => void;
  onGoBack?: () => void;
}) {
  return (
    <ErrorPage
      code="404"
      title="Page Not Found"
      description="Oops! The page you're looking for seems to have wandered off. Let's get you back on track."
      illustration={
        <div className="w-64 h-64 mx-auto">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeDasharray="502"
              initial={{ strokeDashoffset: 502 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667EEA" />
                <stop offset="100%" stopColor="#764BA2" />
              </linearGradient>
            </defs>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              fontSize="48"
              fill="#667EEA"
              fontWeight="bold"
            >
              ?
            </text>
          </svg>
        </div>
      }
      actions={
        <>
          {onGoHome && (
            <Button variant="primary" onClick={onGoHome}>
              Go Home
            </Button>
          )}
          {onGoBack && (
            <Button variant="ghost" onClick={onGoBack}>
              Go Back
            </Button>
          )}
        </>
      }
    />
  );
}

/**
 * 500 Server Error Page
 * 
 * Pre-configured 500 error page
 * 
 * @example
 * ```tsx
 * <ServerErrorPage onRetry={() => window.location.reload()} />
 * ```
 */
export function ServerErrorPage({
  onRetry,
  onGoHome,
}: {
  onRetry?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <ErrorPage
      code="500"
      title="Server Error"
      description="Something went wrong on our end. We're working to fix it. Please try again in a moment."
      illustration={
        <div className="w-64 h-64 mx-auto">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <motion.path
              d="M100 40 L160 160 L40 160 Z"
              fill="none"
              stroke="url(#gradient2)"
              strokeWidth="4"
              strokeDasharray="400"
              initial={{ strokeDashoffset: 400 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
            </defs>
            <text
              x="100"
              y="120"
              textAnchor="middle"
              fontSize="48"
              fill="#EF4444"
              fontWeight="bold"
            >
              !
            </text>
          </svg>
        </div>
      }
      actions={
        <>
          {onRetry && (
            <Button variant="primary" onClick={onRetry}>
              Try Again
            </Button>
          )}
          {onGoHome && (
            <Button variant="ghost" onClick={onGoHome}>
              Go Home
            </Button>
          )}
        </>
      }
    />
  );
}

/**
 * 403 Forbidden Page
 * 
 * Pre-configured 403 error page
 * 
 * @example
 * ```tsx
 * <ForbiddenPage onGoHome={() => navigate('/')} />
 * ```
 */
export function ForbiddenPage({
  onGoHome,
}: {
  onGoHome?: () => void;
}) {
  return (
    <ErrorPage
      code="403"
      title="Access Denied"
      description="You don't have permission to access this page. Please contact support if you believe this is an error."
      illustration={
        <div className="w-64 h-64 mx-auto">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#gradient3)"
              strokeWidth="4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.path
              d="M70 100 L130 100"
              stroke="url(#gradient3)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            <defs>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      }
      actions={
        onGoHome && (
          <Button variant="primary" onClick={onGoHome}>
            Go Home
          </Button>
        )
      }
    />
  );
}

/**
 * Maintenance Page
 * 
 * Page for scheduled maintenance
 * 
 * @example
 * ```tsx
 * <MaintenancePage estimatedTime="2 hours" />
 * ```
 */
export function MaintenancePage({
  estimatedTime,
}: {
  estimatedTime?: string;
}) {
  return (
    <ErrorPage
      title="Under Maintenance"
      description={`We're currently performing scheduled maintenance to improve your experience. ${
        estimatedTime ? `We'll be back in approximately ${estimatedTime}.` : "We'll be back soon."
      }`}
      illustration={
        <div className="w-64 h-64 mx-auto">
          <motion.svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#gradient4)"
              strokeWidth="4"
              strokeDasharray="20 10"
            />
            <defs>
              <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667EEA" />
                <stop offset="100%" stopColor="#764BA2" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>
      }
    />
  );
}

export default ErrorPage;
