import { FC, ReactNode } from 'react';
import { motion } from 'motion/react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/**
 * PageHeader Component
 * Displays page title, subtitle, and action buttons
 * 
 * Features:
 * - Page title and optional subtitle display
 * - Action buttons area (export, refresh, etc.)
 * - Responsive layout for mobile devices
 * - Consistent typography and spacing
 * 
 * Requirements: 1.3
 */
const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
    >
      {/* Title Section */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-slate-600">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action Buttons Section */}
      {actions && (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </motion.div>
  );
};

export default PageHeader;
