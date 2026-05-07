import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { MeshGradientBackground } from './AnimatedGradientMesh';

interface AuthLayoutProps {
  children: ReactNode;
  illustration?: ReactNode;
  title?: string;
  subtitle?: string;
  showIllustration?: boolean;
  className?: string;
}

/**
 * Auth Split Layout Component
 * 
 * Features:
 * - Split layout (50/50 on desktop)
 * - Illustration or gradient background on left side
 * - Glassmorphic form container on right side
 * - Responsive (stacks on mobile)
 * - Animated entrance
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <AuthLayout
 *   title="Welcome Back"
 *   subtitle="Sign in to your account"
 *   illustration={<LoginIllustration />}
 * >
 *   <LoginForm />
 * </AuthLayout>
 * ```
 */
export function AuthLayout({
  children,
  illustration,
  title,
  subtitle,
  showIllustration = true,
  className = '',
}: AuthLayoutProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`min-h-screen flex ${className}`}>
      {/* Left Side - Illustration/Gradient */}
      {showIllustration && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--color-bg-secondary)]"
        >
          {/* Gradient Background */}
          <MeshGradientBackground />

          {/* Illustration Content */}
          <div className="relative z-10 flex items-center justify-center w-full p-12">
            {illustration || (
              <div className="text-center max-w-md">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.8,
                    delay: prefersReducedMotion ? 0 : 0.2,
                  }}
                >
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Welcome to Line Free India
                  </h2>
                  <p className="text-lg text-white/80">
                    Experience the future of queue management with our ultra-premium platform
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Right Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
        className={`flex-1 flex items-center justify-center p-6 md:p-12 ${
          showIllustration ? 'lg:w-1/2' : 'w-full'
        }`}
      >
        <div className="w-full max-w-md">
          {/* Header */}
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.5,
                delay: prefersReducedMotion ? 0 : 0.3,
              }}
              className="mb-8 text-center"
            >
              {title && (
                <h1 className="text-3xl font-bold text-[var(--color-text-heading)] mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-[var(--color-text-body)]">{subtitle}</p>
              )}
            </motion.div>
          )}

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.4,
            }}
            className="bg-[var(--color-bg-secondary)]/50 backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 shadow-2xl"
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Auth Card Component
 * 
 * Centered auth card for simpler layouts
 * 
 * @example
 * ```tsx
 * <AuthCard title="Sign In">
 *   <LoginForm />
 * </AuthCard>
 * ```
 */
export function AuthCard({
  children,
  title,
  subtitle,
  footer,
  className = '',
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative ${className}`}>
      {/* Background */}
      <MeshGradientBackground />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          {(title || subtitle) && (
            <div className="mb-6 text-center">
              {title && (
                <h1 className="text-2xl font-bold text-[var(--color-text-heading)] mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-[var(--color-text-body)]">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          {children}

          {/* Footer */}
          {footer && (
            <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.1)] text-center">
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Auth Steps Layout Component
 * 
 * Multi-step auth flow with progress indicator
 * 
 * @example
 * ```tsx
 * <AuthStepsLayout
 *   currentStep={1}
 *   totalSteps={3}
 *   steps={['Account', 'Profile', 'Verify']}
 * >
 *   <StepContent />
 * </AuthStepsLayout>
 * ```
 */
export function AuthStepsLayout({
  children,
  currentStep,
  totalSteps,
  steps,
  onBack,
  className = '',
}: {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  steps?: string[];
  onBack?: () => void;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative ${className}`}>
      <MeshGradientBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.5,
        }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex items-center flex-1">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    index < currentStep
                      ? 'bg-[var(--color-primary)] text-white'
                      : index === currentStep
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]'
                      : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {index < currentStep ? (
                    <svg
                      className="w-5 h-5"
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
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step Label */}
                {steps && steps[index] && (
                  <span className="ml-2 text-sm font-medium text-[var(--color-text-body)]">
                    {steps[index]}
                  </span>
                )}

                {/* Connector Line */}
                {index < totalSteps - 1 && (
                  <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)] mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 shadow-2xl">
          {/* Back Button */}
          {onBack && currentStep > 0 && (
            <button
              onClick={onBack}
              className="mb-6 flex items-center gap-2 text-[var(--color-text-body)] hover:text-[var(--color-text-heading)] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          )}

          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default AuthLayout;
