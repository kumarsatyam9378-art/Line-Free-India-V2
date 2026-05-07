/**
 * Example: Using BusinessStatsCard with Responsive Layout
 * 
 * This example demonstrates how to use multiple BusinessStatsCard components
 * with the responsive layout pattern specified in Task 8:
 * - Mobile (≤480px): Vertical stack with 16px gap
 * - Tablet (481-1023px): Horizontal layout with 24px gap
 * - Desktop (≥1024px): 2-column grid with 32px gap
 */

import BusinessStatsCard from './BusinessStatsCard';

export default function BusinessStatsExample() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:grid lg:grid-cols-2 lg:gap-8">
      <BusinessStatsCard
        icon="👥"
        label="Total Customers"
        value="1,234"
        change={12.5}
        color="#10B981"
      />
      
      <BusinessStatsCard
        icon="📅"
        label="Appointments Today"
        value="42"
        change={-5.2}
        color="#6366F1"
      />
      
      <BusinessStatsCard
        icon="💰"
        label="Revenue This Month"
        value="$45,678"
        change={18.3}
        color="#F59E0B"
      />
      
      <BusinessStatsCard
        icon="⭐"
        label="Average Rating"
        value="4.8"
        change={2.1}
        color="#EF4444"
      />
    </div>
  );
}
