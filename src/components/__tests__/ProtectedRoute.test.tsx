import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { AuthProvider } from '../../contexts/AuthContext';
import type { User } from '../../contexts/AuthContext';

// Mock the useAuth hook
vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

const mockUseAuth = vi.mocked(
  (await import('../../contexts/AuthContext')).useAuth
);

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  const renderProtectedRoute = (moduleId: any, children: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute moduleId={moduleId}>{children}</ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  describe('Authentication', () => {
    it('should redirect to dashboard when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
        hasPermission: vi.fn(),
      });

      renderProtectedRoute('dashboard', <div>Protected Content</div>);

      // Should not render protected content
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should render protected content when user is authenticated and has access', () => {
      const mockUser: User = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@bri.co.id',
        phone: '+62 21 1234 5678',
        role: 'Direksi',
        assignedArea: { type: 'national' },
        permissions: ['view:all'],
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        hasPermission: vi.fn(),
      });

      renderProtectedRoute('dashboard', <div>Protected Content</div>);

      // Should render protected content
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('Authorization', () => {
    it('should show access denied for RM trying to access data-management', () => {
      const mockUser: User = {
        id: 'user-4',
        name: 'RM User',
        email: 'rm@bri.co.id',
        phone: '+62 21 4567 8901',
        role: 'RM',
        assignedArea: {
          type: 'portfolio',
          portfolioId: 'portfolio-1',
        },
        permissions: ['view:portfolio'],
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        hasPermission: vi.fn(),
      });

      renderProtectedRoute('data-management', <div>Data Management Page</div>);

      // Should show access denied
      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(screen.getByText('Insufficient Permissions')).toBeInTheDocument();
      expect(screen.queryByText('Data Management Page')).not.toBeInTheDocument();
    });

    it('should show access denied for Branch Manager trying to access campaign', () => {
      const mockUser: User = {
        id: 'user-3',
        name: 'Branch Manager',
        email: 'branch@bri.co.id',
        phone: '+62 21 3456 7890',
        role: 'Branch Manager',
        assignedArea: {
          type: 'branch',
          branchId: 'branch-menteng',
        },
        permissions: ['view:branch'],
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        hasPermission: vi.fn(),
      });

      renderProtectedRoute('campaign', <div>Campaign Page</div>);

      // Should show access denied
      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(screen.queryByText('Campaign Page')).not.toBeInTheDocument();
    });

    it('should allow Direksi to access all modules', () => {
      const mockUser: User = {
        id: 'user-1',
        name: 'Direktur',
        email: 'direksi@bri.co.id',
        phone: '+62 21 1234 5678',
        role: 'Direksi',
        assignedArea: { type: 'national' },
        permissions: ['view:all'],
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        hasPermission: vi.fn(),
      });

      // Test multiple modules
      const modules = [
        'dashboard',
        'data-management',
        'campaign',
        'market-intelligence',
      ];

      modules.forEach((moduleId) => {
        const { unmount } = renderProtectedRoute(
          moduleId as any,
          <div>{moduleId} Content</div>
        );
        expect(screen.getByText(`${moduleId} Content`)).toBeInTheDocument();
        unmount();
      });
    });

    it('should allow Regional Head to access most modules except data-management', () => {
      const mockUser: User = {
        id: 'user-2',
        name: 'Regional Head',
        email: 'regional@bri.co.id',
        phone: '+62 21 2345 6789',
        role: 'Regional Head',
        assignedArea: {
          type: 'regional',
          regionId: 'region-jakarta',
        },
        permissions: ['view:regional'],
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        hasPermission: vi.fn(),
      });

      // Should have access to campaign
      const { unmount: unmount1 } = renderProtectedRoute(
        'campaign',
        <div>Campaign Content</div>
      );
      expect(screen.getByText('Campaign Content')).toBeInTheDocument();
      unmount1();

      // Should NOT have access to data-management
      renderProtectedRoute('data-management', <div>Data Management Content</div>);
      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(
        screen.queryByText('Data Management Content')
      ).not.toBeInTheDocument();
    });
  });

  describe('Access Denied UI', () => {
    it('should display user information in access denied page', () => {
      const mockUser: User = {
        id: 'user-4',
        name: 'Test RM',
        email: 'rm@bri.co.id',
        phone: '+62 21 4567 8901',
        role: 'RM',
        assignedArea: {
          type: 'portfolio',
          portfolioId: 'portfolio-1',
        },
        permissions: ['view:portfolio'],
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        hasPermission: vi.fn(),
      });

      renderProtectedRoute('campaign', <div>Campaign Page</div>);

      // Should show user name and role
      expect(screen.getByText(/Test RM/)).toBeInTheDocument();
      expect(screen.getByText(/RM/)).toBeInTheDocument();
    });

    it('should display custom access denied message when provided', () => {
      const mockUser: User = {
        id: 'user-4',
        name: 'Test RM',
        email: 'rm@bri.co.id',
        phone: '+62 21 4567 8901',
        role: 'RM',
        assignedArea: {
          type: 'portfolio',
          portfolioId: 'portfolio-1',
        },
        permissions: ['view:portfolio'],
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        hasPermission: vi.fn(),
      });

      const customMessage = 'This feature requires administrator privileges.';

      render(
        <BrowserRouter>
          <AuthProvider>
            <ProtectedRoute
              moduleId="data-management"
              accessDeniedMessage={customMessage}
            >
              <div>Protected Content</div>
            </ProtectedRoute>
          </AuthProvider>
        </BrowserRouter>
      );

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('should provide navigation options in access denied page', () => {
      const mockUser: User = {
        id: 'user-4',
        name: 'Test RM',
        email: 'rm@bri.co.id',
        phone: '+62 21 4567 8901',
        role: 'RM',
        assignedArea: {
          type: 'portfolio',
          portfolioId: 'portfolio-1',
        },
        permissions: ['view:portfolio'],
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        hasPermission: vi.fn(),
      });

      renderProtectedRoute('campaign', <div>Campaign Page</div>);

      // Should show navigation buttons
      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Go Back')).toBeInTheDocument();
    });
  });

  describe('Security Logging', () => {
    it('should log unauthorized access attempts', () => {
      const mockUser: User = {
        id: 'user-4',
        name: 'Test RM',
        email: 'rm@bri.co.id',
        phone: '+62 21 4567 8901',
        role: 'RM',
        assignedArea: {
          type: 'portfolio',
          portfolioId: 'portfolio-1',
        },
        permissions: ['view:portfolio'],
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        hasPermission: vi.fn(),
      });

      // Spy on console.warn
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      renderProtectedRoute('data-management', <div>Data Management Page</div>);

      // Should log to console in development
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[Security] Unauthorized access attempt:',
        expect.objectContaining({
          event: 'UNAUTHORIZED_ACCESS_ATTEMPT',
          userId: 'user-4',
          userName: 'Test RM',
          role: 'RM',
          attemptedModule: 'data-management',
          severity: 'WARNING',
        })
      );

      consoleWarnSpy.mockRestore();
    });
  });
});
