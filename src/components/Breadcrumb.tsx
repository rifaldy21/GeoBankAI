import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { MENU_CONFIG } from '../config/menuConfig';

interface BreadcrumbItem {
  label: string;
  path: string;
}

/**
 * Breadcrumb Component
 * Displays breadcrumb trail showing current location hierarchy
 * 
 * Features:
 * - Generates breadcrumbs from current route path
 * - Provides navigation links to parent routes
 * - Styled with Tailwind CSS for consistent appearance
 * - Integrates with navigationSlice for breadcrumb data
 * 
 * Requirements: 1.5
 */
const Breadcrumb: FC = () => {
  const location = useLocation();

  /**
   * Generate breadcrumbs from current route path
   * Matches route segments against menu configuration
   */
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // Always start with home/dashboard
    if (pathSegments.length > 0 && pathSegments[0] !== 'dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        path: '/dashboard',
      });
    }

    // Build breadcrumbs from path segments
    let currentPath = '';
    
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`;
      
      // Find matching menu item
      const menuItem = MENU_CONFIG.find(
        (item) => item.path === currentPath || item.id === pathSegments[i]
      );

      if (menuItem) {
        // Determine the path for parent menu item
        // If menu has submenus but no direct path, use first submenu path
        const parentPath = menuItem.path || 
          (menuItem.submenus && menuItem.submenus.length > 0 
            ? menuItem.submenus[0].path 
            : currentPath);

        // Add parent menu item
        breadcrumbs.push({
          label: menuItem.label,
          path: parentPath,
        });

        // Check if there's a submenu item
        if (menuItem.submenus && i + 1 < pathSegments.length) {
          const submenuPath = `${currentPath}/${pathSegments[i + 1]}`;
          const submenuItem = menuItem.submenus.find(
            (sub) => sub.path === submenuPath
          );

          if (submenuItem) {
            breadcrumbs.push({
              label: submenuItem.label,
              path: submenuItem.path,
            });
            i++; // Skip next segment as we've processed it
            currentPath = submenuPath;
          }
        }
      } else {
        // Fallback: create breadcrumb from path segment
        const label = pathSegments[i]
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        breadcrumbs.push({
          label,
          path: currentPath,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on dashboard root
  if (location.pathname === '/' || location.pathname === '/dashboard') {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {/* Home icon link */}
      <Link
        to="/dashboard"
        className="text-slate-500 hover:text-slate-700 transition-colors"
        aria-label="Go to dashboard"
      >
        <Home className="w-4 h-4" />
      </Link>

      {/* Breadcrumb items */}
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={crumb.path} className="flex items-center space-x-2">
            {/* Separator */}
            <ChevronRight className="w-4 h-4 text-slate-400" />

            {/* Breadcrumb link or text */}
            {isLast ? (
              <span
                className="text-slate-900 font-medium"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
