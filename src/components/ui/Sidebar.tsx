import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SidebarItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string | number;
  subItems?: Array<{ label: string; href: string }>;
}

interface SidebarProps {
  items: SidebarItem[];
  logo?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
}

/**
 * Sleek Sidebar Navigation Component
 * 
 * Features:
 * - Glassmorphic background with backdrop-blur
 * - Navigation item hover states with smooth transitions
 * - Consistent icon sizing (20px-24px)
 * - Active navigation item indicator
 * - Collapsible sidebar
 * - Badge support
 * - Sub-menu support
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <Sidebar
 *   items={[
 *     { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
 *     { label: 'Analytics', href: '/analytics', icon: <AnalyticsIcon />, badge: 3 },
 *   ]}
 *   logo={<Logo />}
 * />
 * ```
 */
export function Sidebar({
  items,
  logo,
  footer,
  collapsed: controlledCollapsed,
  onCollapse,
  className = '',
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const collapsed = controlledCollapsed ?? internalCollapsed;

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    setInternalCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const toggleSubMenu = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={`fixed left-0 top-0 bottom-0 z-40 bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl border-r border-white/10 ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              >
                {logo}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse Button */}
          <motion.button
            onClick={handleCollapse}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className="w-5 h-5 text-[var(--color-text-secondary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  collapsed
                    ? 'M13 5l7 7-7 7M5 5l7 7-7 7'
                    : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'
                }
              />
            </svg>
          </motion.button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {items.map((item, index) => (
              <div key={item.href}>
                <motion.a
                  href={item.href}
                  onClick={() => {
                    setActiveItem(index);
                    if (item.subItems) {
                      toggleSubMenu(index);
                    }
                  }}
                  className={`
                    relative flex items-center gap-3 px-3 py-3 rounded-xl
                    transition-all duration-200
                    ${
                      activeItem === index
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        : 'text-[var(--color-text-body)] hover:bg-white/5 hover:text-white'
                    }
                  `}
                  whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Active Indicator */}
                  {activeItem === index && (
                    <motion.div
                      layoutId="activeSidebarItem"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--color-primary)] rounded-r-full"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {item.icon}
                  </div>

                  {/* Label */}
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                        className="flex-1 font-medium text-sm"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Badge */}
                  {!collapsed && item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full"
                    >
                      {item.badge}
                    </motion.span>
                  )}

                  {/* Expand Arrow */}
                  {!collapsed && item.subItems && (
                    <motion.svg
                      animate={{
                        rotate: expandedItems.includes(index) ? 180 : 0,
                      }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  )}
                </motion.a>

                {/* Sub Items */}
                <AnimatePresence>
                  {!collapsed &&
                    item.subItems &&
                    expandedItems.includes(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                        className="ml-9 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.subItems.map((subItem) => (
                          <a
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-body)] rounded-lg hover:bg-white/5 transition-colors"
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-white/10">
            <AnimatePresence mode="wait">
              {!collapsed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                >
                  {footer}
                </motion.div>
              ) : (
                <div className="flex justify-center">{footer}</div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

/**
 * Sidebar Layout Component
 * 
 * Wrapper for pages with sidebar navigation
 * 
 * @example
 * ```tsx
 * <SidebarLayout sidebar={<Sidebar items={items} />}>
 *   <PageContent />
 * </SidebarLayout>
 * ```
 */
export function SidebarLayout({
  sidebar,
  children,
  className = '',
}: {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-h-screen ${className}`}>
      {sidebar}
      <main className="flex-1 ml-[280px] transition-all duration-300">
        {children}
      </main>
    </div>
  );
}

export default Sidebar;
