import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

/**
 * Tabbed Interface Component
 * 
 * Features:
 * - Animated tab indicator that slides between tabs
 * - Glassmorphic styling
 * - Multiple variants (default, pills, underline)
 * - Icon and badge support
 * - Smooth content transitions
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { id: 'general', label: 'General', content: <GeneralSettings /> },
 *     { id: 'security', label: 'Security', content: <SecuritySettings /> },
 *   ]}
 *   variant="pills"
 * />
 * ```
 */
export function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const prefersReducedMotion = useReducedMotion();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab List */}
      <div
        className={`
          ${variant === 'default' ? 'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl p-1' : ''}
          ${variant === 'pills' ? 'space-x-2' : ''}
          ${variant === 'underline' ? 'border-b border-[rgba(255,255,255,0.1)]' : ''}
        `}
      >
        <div
          className={`
            relative flex
            ${variant === 'default' ? 'gap-1' : ''}
            ${variant === 'pills' ? 'gap-2' : ''}
            ${variant === 'underline' ? 'gap-6' : ''}
          `}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                relative flex items-center gap-2 px-6 py-3 rounded-xl
                font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-body)]'
                }
                ${variant === 'underline' ? 'rounded-none pb-4' : ''}
              `}
            >
              {/* Background for active tab */}
              {activeTab === tab.id && variant === 'default' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[var(--color-primary)]/10 backdrop-blur-xl rounded-xl"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}

              {activeTab === tab.id && variant === 'pills' && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-[var(--color-primary)] rounded-xl"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}

              {activeTab === tab.id && variant === 'underline' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}

              {/* Content */}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
                {tab.label}
                {tab.badge && (
                  <span className="px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="mt-6"
      >
        {activeTabContent}
      </motion.div>
    </div>
  );
}

/**
 * Vertical Tabs Component
 * 
 * Tabs displayed vertically for sidebar-style navigation
 * 
 * @example
 * ```tsx
 * <VerticalTabs
 *   tabs={[
 *     { id: 'profile', label: 'Profile', content: <Profile /> },
 *     { id: 'account', label: 'Account', content: <Account /> },
 *   ]}
 * />
 * ```
 */
export function VerticalTabs({
  tabs,
  defaultTab,
  onChange,
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const prefersReducedMotion = useReducedMotion();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={`flex gap-6 ${className}`}>
      {/* Tab List */}
      <div className="w-64 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              relative w-full flex items-center gap-3 px-4 py-3 rounded-xl
              font-medium text-sm transition-all
              ${
                activeTab === tab.id
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-body)]'
              }
            `}
          >
            {/* Active Indicator */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeVerticalTab"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--color-primary)] rounded-r-full"
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}

            {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
            <span className="flex-1 text-left">{tab.label}</span>
            {tab.badge && (
              <span className="px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="flex-1"
      >
        {activeTabContent}
      </motion.div>
    </div>
  );
}

/**
 * Segmented Control Component
 * 
 * Compact tab-like control for binary or ternary choices
 * 
 * @example
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { id: 'list', label: 'List', icon: <ListIcon /> },
 *     { id: 'grid', label: 'Grid', icon: <GridIcon /> },
 *   ]}
 *   value={view}
 *   onChange={setView}
 * />
 * ```
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  className = '',
}: {
  options: Array<{ id: string; label: string; icon?: ReactNode }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-xl p-1 ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`
            relative px-4 py-2 rounded-lg font-medium text-sm transition-colors
            ${
              value === option.id
                ? 'text-white'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-body)]'
            }
          `}
        >
          {value === option.id && (
            <motion.div
              layoutId="activeSegment"
              className="absolute inset-0 bg-[var(--color-primary)] rounded-lg"
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 30,
              }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {option.icon && <span className="w-4 h-4">{option.icon}</span>}
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default Tabs;
