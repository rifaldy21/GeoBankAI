import { FC, useEffect, useCallback, KeyboardEvent, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronRight, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_CONFIG, type MenuItem, type SubMenuItem } from '../config/menuConfig';
import { useLanguage } from '../contexts/LanguageContext';
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
 * - Logo + app name when expanded
 * - Expandable/collapsible submenu sections with Motion animations
 * - Active state highlighting based on current route
 * - Maintains expansion state in Redux navigationSlice
 * - Keyboard navigation support (Tab, Enter, Arrow keys)
 * - Dropdown submenu on hover when collapsed
 * - Toggle button when collapsed
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 17.1, 17.2, 17.3, 19.1, 19.2, 19.3, 19.4
 */
const Sidebar: FC<SidebarProps> = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { locale } = useLanguage();
  
  const expandedMenus = useSelector(selectExpandedMenus);
  const activeRoute = useSelector(selectActiveRoute);
  
  // State for collapsed submenu dropdown
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Helper function to get label based on locale
  const getLabel = (item: MenuItem | SubMenuItem): string => {
    return locale === 'id' ? item.labelId : item.labelEn;
  };

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
      // Toggle submenu expansion without collapsing sidebar
      dispatch(toggleMenu(menu.id));
      // Preload components for this menu section
      preloadMenuComponents(menu.id);
    } else if (menu.path) {
      // Navigate to route
      navigate(menu.path);
      // Preload component for this menu
      preloadMenuComponents(menu.id);
      // Only close mobile menu if it's actually mobile (not desktop sidebar)
      // We check if sidebar is collapsed to determine if it's mobile behavior
      if (onToggleCollapse && window.innerWidth < 768) {
        onToggleCollapse();
      }
    }
  }, [dispatch, navigate, onToggleCollapse]);
  
  // Handle mouse enter for collapsed sidebar
  const handleMenuMouseEnter = useCallback((menu: MenuItem, buttonElement: HTMLButtonElement) => {
    if (isCollapsed && menu.submenus) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Set new timeout to show dropdown
      hoverTimeoutRef.current = setTimeout(() => {
        const rect = buttonElement.getBoundingClientRect();
        setDropdownPosition({
          top: rect.top,
          left: rect.right + 8, // 8px gap
        });
        setHoveredMenu(menu.id);
      }, 200);
    }
  }, [isCollapsed]);
  
  // Handle mouse leave for collapsed sidebar
  const handleMenuMouseLeave = useCallback(() => {
    if (isCollapsed) {
      // Clear timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Delay hiding dropdown
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredMenu(null);
        setDropdownPosition(null);
      }, 300);
    }
  }, [isCollapsed]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Handle submenu item click
  const handleSubmenuClick = useCallback((submenu: SubMenuItem) => {
    navigate(submenu.path);
    // Only close mobile menu if it's actually mobile (not desktop sidebar)
    if (onToggleCollapse && window.innerWidth < 768) {
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
    <>
    <nav
      className={clsx(
        'h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Sidebar header */}
      <div className="border-b border-slate-200" style={{ height: '73px' }}>
        {isCollapsed ? (
          /* Toggle button when collapsed */
          <div className="h-full flex items-center justify-center">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        ) : (
          /* Logo + app name when expanded */
          <div className="h-full px-4 flex items-center gap-3">
            <img 
              src="/bri-logo.png" 
              alt="BRI Logo" 
              className="w-8 h-8 object-contain shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-slate-900 truncate leading-tight">
                Intelligence
              </h2>
              <p className="text-xs text-slate-600 truncate leading-tight">
                Dashboard
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Menu items */}
      <div className="flex-1 py-4" style={{ overflow: isCollapsed ? 'visible' : 'auto' }}>
        <ul className="space-y-1 px-2" role="menubar">
          {MENU_CONFIG.map((menu) => {
            const isExpanded = expandedMenus.includes(menu.id);
            const isActive = isMenuActive(menu);
            const Icon = menu.icon;

            return (
              <li 
                key={menu.id} 
                role="none"
                className="relative"
                onMouseLeave={handleMenuMouseLeave}
              >
                {/* Top-level menu item */}
                <button
                  ref={(el) => {
                    if (el) {
                      menuButtonRefs.current.set(menu.id, el);
                    }
                  }}
                  onClick={() => handleMenuClick(menu)}
                  onKeyDown={(e) => handleMenuKeyDown(e, menu)}
                  onMouseEnter={(e) => handleMenuMouseEnter(menu, e.currentTarget)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                    'hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-slate-700 font-medium'
                  )}
                  aria-label={getLabel(menu)}
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
                        {getLabel(menu)}
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

                {/* Submenu items with animation (expanded sidebar) */}
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
                        aria-label={`${getLabel(menu)} submenu`}
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
                                  aria-label={getLabel(submenu)}
                                  aria-current={isSubmenuItemActive ? 'page' : undefined}
                                  role="menuitem"
                                >
                                  {getLabel(submenu)}
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
    
    {/* Dropdown submenu portal (collapsed sidebar) - rendered outside nav to avoid overflow issues */}
    {isCollapsed && hoveredMenu && dropdownPosition && (() => {
      const menu = MENU_CONFIG.find(m => m.id === hoveredMenu);
      if (!menu?.submenus) return null;
      
      return createPortal(
        <div 
          className="fixed w-56 bg-white rounded-lg shadow-2xl border border-slate-200 py-2"
          style={{ 
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            zIndex: 9999 
          }}
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
          }}
          onMouseLeave={handleMenuMouseLeave}
        >
          <div className="px-3 py-2 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-900">{getLabel(menu)}</p>
          </div>
          <div className="py-1">
            {menu.submenus.map((submenu) => {
              const isSubmenuItemActive = isSubmenuActive(submenu);
              
              return (
                <button
                  key={submenu.id}
                  onClick={() => handleSubmenuClick(submenu)}
                  className={clsx(
                    'w-full text-left px-4 py-2 text-sm transition-colors',
                    'hover:bg-slate-100',
                    isSubmenuItemActive
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-slate-700'
                  )}
                >
                  {getLabel(submenu)}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      );
    })()}
    </>
  );
};

export default Sidebar;
