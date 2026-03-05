import { FC, useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';
import { autoLoginMockUser } from '../dev-helpers/autoLogin';
import { Loader2 } from 'lucide-react';

/**
 * Layout Component
 * Main layout wrapper with Header, Sidebar, and content area
 * 
 * Features:
 * - Responsive container structure with proper spacing
 * - Integrates Sidebar for navigation
 * - Integrates Header for top controls
 * - Uses React Router's Outlet for nested route rendering
 * - Supports mobile responsive behavior
 * 
 * Requirements: 1.1, 17.1, 17.2
 */
const Layout: FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const auth = useAuth();

  // Auto-login untuk development testing
  useEffect(() => {
    if (!auth.isAuthenticated) {
      autoLoginMockUser(auth);
    }
  }, [auth]);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <aside className="hidden md:block">
          <Sidebar 
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
          />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={handleToggleMobileMenu}
            />
            
            {/* Mobile Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 md:hidden">
              <Sidebar 
                isCollapsed={false}
                onToggleCollapse={handleToggleMobileMenu}
              />
            </aside>
          </>
        )}
        
        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header 
            onToggleMobileMenu={handleToggleMobileMenu}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          
          {/* Page content outlet with proper spacing */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
              <Suspense fallback={<PageLoadingIndicator />}>
                <Outlet />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/**
 * PageLoadingIndicator Component
 * Loading indicator shown while lazy-loaded page components are being fetched
 * 
 * Features:
 * - Centered spinner with animation
 * - Consistent with app design system
 * - Accessible loading state
 */
const PageLoadingIndicator: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-600">Loading...</p>
      </div>
    </div>
  );
};

export default Layout;
