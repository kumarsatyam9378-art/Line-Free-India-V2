import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  percentage: number;
}

/**
 * Password Strength Meter Component
 * 
 * Features:
 * - Real-time strength calculation
 * - Color gradient indicator (red → yellow → green)
 * - Strength label (Weak, Fair, Good, Strong)
 * - Optional requirements checklist
 * - Animated progress bar
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <PasswordStrength
 *   password={password}
 *   showRequirements
 * />
 * ```
 */
export function PasswordStrength({
  password,
  showRequirements = true,
  className = '',
}: PasswordStrengthProps) {
  const prefersReducedMotion = useReducedMotion();

  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  const requirements = useMemo(() => checkRequirements(password), [password]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Meter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            Password Strength
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: strength.color }}
          >
            {strength.label}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${strength.percentage}%` }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="h-full rounded-full transition-colors"
            style={{
              background: `linear-gradient(to right, ${strength.color}, ${strength.color}dd)`,
            }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && password.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          className="space-y-2"
        >
          {requirements.map((req, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : index * 0.05,
              }}
              className="flex items-center gap-2 text-xs"
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                  req.met
                    ? 'bg-[var(--color-success)]'
                    : 'bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                {req.met && (
                  <svg
                    className="w-3 h-3 text-white"
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
                  </svg>
                )}
              </div>
              <span
                className={
                  req.met
                    ? 'text-[var(--color-success)]'
                    : 'text-[var(--color-text-secondary)]'
                }
              >
                {req.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/**
 * Calculate password strength
 */
function calculatePasswordStrength(password: string): StrengthResult {
  if (!password) {
    return {
      score: 0,
      label: '',
      color: '#6B7280',
      percentage: 0,
    };
  }

  let score = 0;

  // Length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Patterns (reduce score for common patterns)
  if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
  if (/^[0-9]+$/.test(password)) score -= 1; // Only numbers
  if (/^[a-zA-Z]+$/.test(password)) score -= 1; // Only letters

  // Normalize score to 0-4
  score = Math.max(0, Math.min(4, score));

  const levels = [
    { score: 0, label: 'Very Weak', color: '#EF4444', percentage: 20 },
    { score: 1, label: 'Weak', color: '#F59E0B', percentage: 40 },
    { score: 2, label: 'Fair', color: '#F59E0B', percentage: 60 },
    { score: 3, label: 'Good', color: '#10B981', percentage: 80 },
    { score: 4, label: 'Strong', color: '#10B981', percentage: 100 },
  ];

  return levels[score];
}

/**
 * Check password requirements
 */
function checkRequirements(password: string) {
  return [
    {
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      label: 'Contains lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      label: 'Contains uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      label: 'Contains number',
      met: /[0-9]/.test(password),
    },
    {
      label: 'Contains special character',
      met: /[^a-zA-Z0-9]/.test(password),
    },
  ];
}

/**
 * Compact Password Strength Component
 * 
 * Minimal version without requirements
 * 
 * @example
 * ```tsx
 * <CompactPasswordStrength password={password} />
 * ```
 */
export function CompactPasswordStrength({
  password,
  className = '',
}: {
  password: string;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {[1, 2, 3, 4].map((level) => (
        <motion.div
          key={level}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            delay: prefersReducedMotion ? 0 : level * 0.05,
          }}
          className="h-1 flex-1 rounded-full transition-colors origin-left"
          style={{
            backgroundColor:
              level <= strength.score
                ? strength.color
                : 'rgba(255,255,255,0.1)',
          }}
        />
      ))}
    </div>
  );
}

export default PasswordStrength;
