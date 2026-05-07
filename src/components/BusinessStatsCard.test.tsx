import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BusinessStatsCard from './BusinessStatsCard';

describe('BusinessStatsCard', () => {
  it('renders with theme-aware classes', () => {
    const { container } = render(
      <BusinessStatsCard
        icon="📊"
        label="Total Sales"
        value="$12,345"
        color="#10B981"
      />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-card', 'border', 'border-border');
  });

  it('renders label with theme-aware text color', () => {
    render(
      <BusinessStatsCard
        icon="📊"
        label="Total Sales"
        value="$12,345"
        color="#10B981"
      />
    );

    const label = screen.getByText('Total Sales');
    expect(label).toHaveClass('text-text-dim');
  });

  it('renders value with theme-aware text color', () => {
    const { container } = render(
      <BusinessStatsCard
        icon="📊"
        label="Total Sales"
        value="$12,345"
        color="#10B981"
      />
    );

    const value = screen.getByText('$12,345');
    expect(value).toHaveClass('text-text');
  });

  it('renders change indicator with correct color for positive change', () => {
    render(
      <BusinessStatsCard
        icon="📊"
        label="Total Sales"
        value="$12,345"
        change={15.5}
        color="#10B981"
      />
    );

    const changeText = screen.getByText(/15.5%/);
    expect(changeText).toHaveClass('text-success');
    expect(screen.getByText('▲')).toBeInTheDocument();
  });

  it('renders change indicator with correct color for negative change', () => {
    render(
      <BusinessStatsCard
        icon="📊"
        label="Total Sales"
        value="$12,345"
        change={-8.2}
        color="#10B981"
      />
    );

    const changeText = screen.getByText(/8.2%/);
    expect(changeText).toHaveClass('text-danger');
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  it('does not render change indicator when change is undefined', () => {
    render(
      <BusinessStatsCard
        icon="📊"
        label="Total Sales"
        value="$12,345"
        color="#10B981"
      />
    );

    expect(screen.queryByText(/vs last week/)).not.toBeInTheDocument();
  });

  it('renders icon container with theme-aware background', () => {
    const { container } = render(
      <BusinessStatsCard
        icon="📊"
        label="Total Sales"
        value="$12,345"
        color="#10B981"
      />
    );

    const iconContainer = container.querySelector('.w-8.h-8');
    expect(iconContainer).toHaveClass('bg-card-2', 'border', 'border-border');
  });
});
