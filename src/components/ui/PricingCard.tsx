import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingCardProps {
  name: string;
  description?: string;
  price: string | number;
  period?: string;
  features: PricingFeature[];
  buttonText?: string;
  onSelect?: () => void;
  popular?: boolean;
  highlighted?: boolean;
  badge?: string;
  className?: string;
}

/**
 * Pricing Card Component
 * 
 * Features:
 * - Elevated styling with glassmorphic background
 * - Enhanced shadows
 * - Popular badge
 * - Feature list with checkmarks
 * - Hover lift effect
 * - 3-column grid layout support
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <PricingCard
 *   name="Pro"
 *   price={29}
 *   period="month"
 *   features={[
 *     { text: 'Unlimited users', included: true },
 *     { text: 'Advanced analytics', included: true },
 *   ]}
 *   popular
 *   onSelect={() => handleSelect('pro')}
 * />
 * ```
 */
export function PricingCard({
  name,
  description,
  price,
  period = 'month',
  features,
  buttonText = 'Get Started',
  onSelect,
  popular = false,
  highlighted = false,
  badge,
  className = '',
}: PricingCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={
        !prefersReducedMotion
          ? {
              y: -8,
              boxShadow: highlighted
                ? '0 20px 60px rgba(102, 126, 234, 0.3)'
                : '0 20px 60px rgba(0, 0, 0, 0.3)',
            }
          : undefined
      }
      transition={{
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={`relative ${className}`}
    >
      {/* Popular Badge */}
      {(popular || badge) && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-1 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white text-xs font-semibold rounded-full shadow-lg">
            {badge || 'Most Popular'}
          </div>
        </div>
      )}

      <Card
        variant="glass"
        className={`p-8 h-full flex flex-col ${
          highlighted
            ? 'border-2 border-[var(--color-primary)] shadow-[0_0_40px_rgba(102,126,234,0.2)]'
            : ''
        }`}
      >
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[var(--color-text-heading)] mb-2">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-[var(--color-text-body)]">
              {description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-[var(--color-text-heading)]">
              {typeof price === 'number' ? `$${price}` : price}
            </span>
            {period && (
              <span className="text-[var(--color-text-secondary)]">
                /{period}
              </span>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="flex-1 mb-8 space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : index * 0.05,
              }}
              className="flex items-start gap-3"
            >
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  feature.included
                    ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                    : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-text-secondary)]'
                }`}
              >
                {feature.included ? (
                  <svg
                    className="w-3 h-3"
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
                ) : (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm ${
                  feature.highlight
                    ? 'text-[var(--color-primary)] font-semibold'
                    : feature.included
                    ? 'text-[var(--color-text-body)]'
                    : 'text-[var(--color-text-secondary)] line-through'
                }`}
              >
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          variant={highlighted ? 'primary' : 'secondary'}
          fullWidth
          onClick={onSelect}
        >
          {buttonText}
        </Button>
      </Card>
    </motion.div>
  );
}

/**
 * Pricing Grid Component
 * 
 * Grid layout for pricing cards
 * 
 * @example
 * ```tsx
 * <PricingGrid>
 *   <PricingCard name="Basic" price={9} features={[...]} />
 *   <PricingCard name="Pro" price={29} features={[...]} popular />
 *   <PricingCard name="Enterprise" price={99} features={[...]} />
 * </PricingGrid>
 * ```
 */
export function PricingGrid({
  children,
  columns = 3,
  className = '',
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-${Math.min(
        2,
        columns
      )} lg:grid-cols-${columns} gap-8 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Pricing Comparison Table Component
 * 
 * Detailed feature comparison table
 * 
 * @example
 * ```tsx
 * <PricingComparison
 *   plans={['Basic', 'Pro', 'Enterprise']}
 *   features={[
 *     { name: 'Users', values: ['5', '25', 'Unlimited'] },
 *     { name: 'Storage', values: ['10GB', '100GB', '1TB'] },
 *   ]}
 * />
 * ```
 */
export function PricingComparison({
  plans,
  features,
  className = '',
}: {
  plans: string[];
  features: Array<{
    name: string;
    values: (string | boolean)[];
    category?: string;
  }>;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        {/* Header */}
        <thead>
          <tr className="border-b border-[rgba(255,255,255,0.1)]">
            <th className="text-left py-4 px-6 text-sm font-semibold text-[var(--color-text-heading)]">
              Features
            </th>
            {plans.map((plan, index) => (
              <th
                key={index}
                className="text-center py-4 px-6 text-sm font-semibold text-[var(--color-text-heading)]"
              >
                {plan}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {features.map((feature, featureIndex) => (
            <motion.tr
              key={featureIndex}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : featureIndex * 0.05,
              }}
              className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
            >
              <td className="py-4 px-6 text-sm text-[var(--color-text-body)]">
                {feature.name}
              </td>
              {feature.values.map((value, valueIndex) => (
                <td
                  key={valueIndex}
                  className="py-4 px-6 text-center text-sm text-[var(--color-text-body)]"
                >
                  {typeof value === 'boolean' ? (
                    value ? (
                      <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)]">
                        <svg
                          className="w-3 h-3"
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
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(255,255,255,0.05)] text-[var(--color-text-secondary)]">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    )
                  ) : (
                    value
                  )}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PricingCard;
