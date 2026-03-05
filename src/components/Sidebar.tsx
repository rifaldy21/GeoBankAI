import { FC, useEffect, useCallback, KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_CONFIG, type MenuItem, type SubMenuItem } from '../config/menuConfig';
import {
  toggleMenu,
  setActiveRoute,
  expandMenu,
  selectExpandedMenus,
  selectActiveRoute,
} from '../store/slices/navigationSlice';
import { clsx } from 'clsx';
import { preloadMenuComponents } from '../utils/componentPreloader';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

/**
 * Sidebar Component
 * Multi-level navigation with expandable submenus
 * 
 * Features:
 * - Renders all 8 top-level menu items from MENU_CONFIG
 * - Expandable/collapsible submenu sections with Motion animations
 * - Active state highlighting based on current route
 * - Maintains expansion state in Redux navigationSlice
 * - Keyboard navigation support (Tab, Enter, Arrow keys)
 * - ARIA labels and accessibility attributes
 * - Responsive behavior (full sidebar on desktop, collapsible on mobile)
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 17.1, 17.2, 17.3, 19.1, 19.2, 19.3, 19.4
 */
const Sidebar: FC<SidebarProps> = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const expandedMenus = useSelector(selectExpandedMenus);
  const activeRoute = useSelector(selectActiveRoute);

  // Preload components for expanded menus on mount
  useEffect(() => {
    expandedMenus.forEach((menuId) => {
      preloadMenuComponents(menuId);
    });
  }, [expandedMenus]);

  // Update active route when location changes
  useEffect(() => {
    dispatch(setActiveRoute(location.pathname));
    
    // Auto-expand parent menu if current route is a submenu item
    MENU_CONFIG.forEach((menu) => {
      if (menu.submenus) {
        const isSubmenuActive = menu.submenus.some(
          (submenu) => location.pathname === submenu.path
        );
        if (isSubmenuActive && !expandedMenus.includes(menu.id)) {
          dispatch(expandMenu(menu.id));
        }
      }
    });
  }, [location.pathname, dispatch, expandedMenus]);

  // Handle menu item click
  const handleMenuClick = useCallback((menu: MenuItem) => {
    if (menu.submenus) {
      // Toggle submenu expansion
      dispatch(toggleMenu(menu.id));
      // Preload components for this menu section
      preloadMenuComponents(menu.id);
    } else if (menu.path) {
      // Navigate to route
      navigate(menu.path);
      // Preload component for this menu
      preloadMenuComponents(menu.id);
      // Close mobile menu if callback provided
      if (onToggleCollapse) {
        onToggleCollapse();
      }
    }
  }, [dispatch, navigate, onToggleCollapse]);

  // Handle submenu item click
  const handleSubmenuClick = useCallback((submenu: SubMenuItem) => {
    navigate(submenu.path);
    // Close mobile menu if callback provided
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  }, [navigate, onToggleCollapse]);

  // Keyboard navigation handler for menu items
  const handleMenuKeyDown = useCallback((
    event: KeyboardEvent<HTMLButtonElement>,
    menu: MenuItem
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMenuClick(menu);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      // Focus next menu item
      const currentButton = event.currentTarget;
      const nextButton = currentButton.parentElement?.nextElementSibling?.querySelector('button');
      if (nextButton instanceof HTMLElement) {
        nextButton.focus();
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      // Focus previous menu item
      const currentButton = event.currentTarget;
      const prevButton = currentButton.parentElement?.previousElementSibling?.querySelector('button');
      if (prevButton instanceof HTMLElement) {
        prevButton.focus();
      }
    }
  }, [handleMenuClick]);

  // Keyboard navigation handler for submenu items
  const handleSubmenuKeyDown = useCallback((
    event: KeyboardEvent<HTMLButtonElement>,
    submenu: SubMenuItem
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSubmenuClick(submenu);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const currentButton = event.currentTarget;
      const nextButton = currentButton.parentElement?.nextElementSibling?.querySelector('button');
      if (nextButton instanceof HTMLElement) {
        nextButton.focus();
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const currentButton = event.currentTarget;
      const prevButton = currentButton.parentElement?.previousElementSibling?.querySelector('button');
      if (prevButton instanceof HTMLElement) {
        prevButton.focus();
      }
    }
  }, [handleSubmenuClick]);

  // Check if menu is active (either direct match or has active submenu)
  const isMenuActive = useCallback((menu: MenuItem): boolean => {
    if (menu.path && activeRoute === menu.path) {
      return true;
    }
    if (menu.submenus) {
      return menu.submenus.some((submenu) => activeRoute === submenu.path);
    }
    return false;
  }, [activeRoute]);

  // Check if submenu is active
  const isSubmenuActive = useCallback((submenu: SubMenuItem): boolean => {
    return activeRoute === submenu.path;
  }, [activeRoute]);

  return (
    <nav
      className={clsx(
        'h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Sidebar header */}
      <div className="p-4 border-b border-slate-200">
        {!isCollapsed && (
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Menu
          </h2>
        )}
      </div>

      {/* Menu items */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2" role="menubar">
          {MENU_CONFIG.map((menu) => {
            const isExpanded = expandedMenus.includes(menu.id);
            const isActive = isMenuActive(menu);
            const Icon = menu.icon;

            return (
              <li key={menu.id} role="none">
                {/* Top-level menu item */}
                <button
                  onClick={() => handleMenuClick(menu)}
                  onKeyDown={(e) => handleMenuKeyDown(e, menu)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                    'hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-slate-700 font-medium'
                  )}
                  aria-label={menu.label}
                  aria-expanded={menu.submenus ? isExpanded : undefined}
                  aria-haspopup={menu.submenus ? 'menu' : undefined}
                  role="menuitem"
                  data-menu-id={menu.id}
                >
                  <Icon
                    className={clsx(
                      'w-5 h-5 shrink-0',
                      isActive ? 'text-indigo-600' : 'text-slate-500'
                    )}
                    aria-hidden="true"
                  />
                  
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm">
                        {menu.label}
                      </span>
                      
                      {menu.submenus && (
                        <span className="shrink-0">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="w-4 h-4" aria-hidden="true" />
                          )}
                        </span>
                      )}
                    </>
                  )}
                </button>

                {/* Submenu items with animation */}
                {menu.submenus && !isCollapsed && (
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                        role="menu"
                        aria-label={`${menu.label} submenu`}
                      >
                        <div className="mt-1 space-y-1 pl-11">
                          {menu.submenus.map((submenu) => {
                            const isSubmenuItemActive = isSubmenuActive(submenu);

                            return (
                              <li key={submenu.id} role="none">
                                <button
                                  onClick={() => handleSubmenuClick(submenu)}
                                  onKeyDown={(e) => handleSubmenuKeyDown(e, submenu)}
                                  className={clsx(
                                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-all',
                                    'hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                                    isSubmenuItemActive
                                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                                      : 'text-slate-600 font-medium'
                                  )}
                                  aria-label={submenu.label}
                                  aria-current={isSubmenuItemActive ? 'page' : undefined}
                                  role="menuitem"
                                >
                                  {submenu.label}
                                </button>
                              </li>
                            );
                          })}
                        </div>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
