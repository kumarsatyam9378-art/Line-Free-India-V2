import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Skeleton } from './Skeleton';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

/**
 * Data Table Component
 * 
 * Features:
 * - Custom styled table with glassmorphic container
 * - Row hover effects with background color change
 * - Sortable columns
 * - Loading skeleton states
 * - Empty state
 * - Responsive design
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <DataTable
 *   data={users}
 *   columns={[
 *     { key: 'name', header: 'Name', sortable: true },
 *     { key: 'email', header: 'Email' },
 *     { key: 'status', header: 'Status', render: (value) => <Badge>{value}</Badge> },
 *   ]}
 *   onRowClick={(user) => handleRowClick(user)}
 * />
 * ```
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onRowClick,
  emptyMessage = 'No data available',
  className = '',
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const prefersReducedMotion = useReducedMotion();

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = sortColumn
    ? [...data].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        const modifier = sortDirection === 'asc' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * modifier;
        }
        return (aValue > bValue ? 1 : -1) * modifier;
      })
    : data;

  return (
    <Card variant="glass" className={`overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.1)]">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`text-left py-4 px-6 text-sm font-semibold text-[var(--color-text-heading)] ${
                    column.sortable ? 'cursor-pointer select-none' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() =>
                    column.sortable && handleSort(column.key as string)
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <svg
                          className={`w-3 h-3 ${
                            sortColumn === column.key && sortDirection === 'asc'
                              ? 'text-[var(--color-primary)]'
                              : 'text-[var(--color-text-secondary)]'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-[rgba(255,255,255,0.05)]">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="py-4 px-6">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-[var(--color-text-secondary)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data Rows
              sortedData.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.2,
                    delay: prefersReducedMotion ? 0 : rowIndex * 0.03,
                  }}
                  className={`border-b border-[rgba(255,255,255,0.05)] transition-colors ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-[rgba(255,255,255,0.03)]'
                      : ''
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, colIndex) => {
                    const value = row[column.key as keyof T];
                    return (
                      <td
                        key={colIndex}
                        className="py-4 px-6 text-sm text-[var(--color-text-body)]"
                      >
                        {column.render ? column.render(value, row) : value}
                      </td>
                    );
                  })}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/**
 * Compact Data Table Component
 * 
 * Minimal table for dense layouts
 * 
 * @example
 * ```tsx
 * <CompactDataTable
 *   data={items}
 *   columns={[
 *     { key: 'name', header: 'Name' },
 *     { key: 'value', header: 'Value' },
 *   ]}
 * />
 * ```
 */
export function CompactDataTable<T extends Record<string, any>>({
  data,
  columns,
  className = '',
}: {
  data: T[];
  columns: Column<T>[];
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[rgba(255,255,255,0.1)]">
            {columns.map((column, index) => (
              <th
                key={index}
                className="text-left py-2 px-4 text-xs font-semibold text-[var(--color-text-heading)]"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
            >
              {columns.map((column, colIndex) => {
                const value = row[column.key as keyof T];
                return (
                  <td
                    key={colIndex}
                    className="py-2 px-4 text-xs text-[var(--color-text-body)]"
                  >
                    {column.render ? column.render(value, row) : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Table Pagination Component
 * 
 * Pagination controls for data tables
 * 
 * @example
 * ```tsx
 * <TablePagination
 *   currentPage={page}
 *   totalPages={10}
 *   onPageChange={setPage}
 * />
 * ```
 */
export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
  );

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-[var(--color-text-secondary)]">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-body)] hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => {
          const prevPage = visiblePages[index - 1];
          const showEllipsis = prevPage && page - prevPage > 1;

          return (
            <div key={page} className="flex items-center gap-2">
              {showEllipsis && (
                <span className="text-[var(--color-text-secondary)]">...</span>
              )}
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-body)] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                {page}
              </button>
            </div>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-body)] hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataTable;
