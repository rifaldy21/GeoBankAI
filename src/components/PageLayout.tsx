import { FC, ReactNode } from 'react';
import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
  loading?: boolean;
  error?: string;
}

/**
 * PageLayout Component
 * Provides consistent page structure across all pages
 * 
 * Features:
 * - Responsive grid layout with proper spacing
 * - Loading state support with skeleton UI
 * - Error boundary support with error display
 * - Flexible action buttons area
 * - Filter controls integration
 * - Styled with Tailwind CSS
 * 
 * Requirements: 1.3, 17.1, 17.2
 */
const PageLayout: FC<PageLayoutProps> = ({
  title,
  subtitle,
  actions,
  filters,
  children,
  loading = false,
  error
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          )}
        </div>
        
        {/* Action Buttons */}
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>

      {/* Filters Section */}
      {filters && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {filters}
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-900">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {/* Skeleton loaders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse"
              >
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4" />
                <div className="h-8 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Main Content */
        <div className="space-y-6">
          {children}
        </div>
      )}
    </motion.div>
  );
};

export default PageLayout;
