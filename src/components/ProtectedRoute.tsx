import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hasModuleAccess, ModuleId } from '../services/auth/permissions';
import { AlertCircle, Lock } from 'lucide-react';

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  /**
   * The content to render if the user is authorized
   */
  children: ReactNode;

  /**
   * The module ID that this route belongs to
   * Used to check if the user's role has access to this module
   */
  moduleId: ModuleId;

  /**
   * Optional custom redirect path for unauthorized users
   * Defaults to the user's appropriate landing page based on role
   */
  redirectTo?: string;

  /**
   * Optional custom message to display when access is denied
   */
  accessDeniedMessage?: string;
}

/**
 * Get the appropriate landing page for a user based on their role
 * 
 * @param role - The user's role
 * @returns The path to redirect to
 */
const getLandingPageForRole = (role: string): string => {
  switch (role) {
    case 'Direksi':
      return '/dashboard';
    case 'Regional Head':
      return '/dashboard';
    case 'Branch Manager':
      return '/dashboard';
    case 'RM':
      return '/performance/rm-performance';
    default:
      return '/dashboard';
  }
};

/**
 * Log unauthorized access attempts for security monitoring
 * 
 * @param userId - The ID of the user attempting access
 * @param userName - The name of the user
 * @param role - The user's role
 * @param moduleId - The module they attempted to access
 * @param path - The path they attempted to access
 */
const logUnauthorizedAccess = (
  userId: string,
  userName: string,
  role: string,
  moduleId: ModuleId,
  path: string
): void => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event: 'UNAUTHORIZED_ACCESS_ATTEMPT',
    userId,
    userName,
    role,
    attemptedModule: moduleId,
    attemptedPath: path,
    severity: 'WARNING',
  };

  // Log to console in development
  const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
  
  if (isDev) {
    console.warn('[Security] Unauthorized access attempt:', logEntry);
  }

  // In production, this would send to a logging service
  // Example: sendToLoggingService(logEntry);
  
  // Store in localStorage for debugging (in development only)
  if (isDev) {
    try {
      const existingLogs = localStorage.getItem('unauthorized_access_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(logEntry);
      // Keep only last 50 logs
      if (logs.length > 50) {
        logs.shift();
      }
      localStorage.setItem('unauthorized_access_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to store access log:', error);
    }
  }
};

/**
 * AccessDenied component to display when user doesn't have permission
 */
const AccessDenied: React.FC<{
  message: string;
  redirectPath: string;
  userName: string;
  role: string;
}> = ({ message, redirectPath, userName, role }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
          Access Restricted
        </h1>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 mb-1">
                Insufficient Permissions
              </p>
              <p className="text-sm text-amber-800">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-slate-600 space-y-1">
            <p>
              <span className="font-medium">User:</span> {userName}
            </p>
            <p>
              <span className="font-medium">Role:</span> {role}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={redirectPath}
            className="block w-full bg-indigo-600 text-white text-center py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </a>
          
          <button
            onClick={() => window.history.back()}
            className="block w-full bg-slate-100 text-slate-700 text-center py-2.5 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Go Back
          </button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-6">
          If you believe you should have access to this module, please contact your administrator.
        </p>
      </div>
    </div>
  );
};

/**
 * ProtectedRoute component
 * 
 * A route guard component that checks user permissions before rendering protected content.
 * 
 * Features:
 * - Checks if user is authenticated
 * - Verifies user has access to the specified module based on their role
 * - Redirects unauthorized users to appropriate landing page
 * - Displays informative message about access restrictions
 * - Logs unauthorized access attempts for security monitoring
 * 
 * Usage:
 * ```tsx
 * <ProtectedRoute moduleId="data-management">
 *   <DataManagementPage />
 * </ProtectedRoute>
 * ```
 * 
 * @example
 * // Protect a route with default behavior
 * <ProtectedRoute moduleId="campaign">
 *   <CampaignPage />
 * </ProtectedRoute>
 * 
 * @example
 * // Protect a route with custom redirect and message
 * <ProtectedRoute 
 *   moduleId="data-management"
 *   redirectTo="/dashboard"
 *   accessDeniedMessage="Data management is only available to administrators."
 * >
 *   <DataManagementPage />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  moduleId,
  redirectTo,
  accessDeniedMessage,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  // In this implementation, we redirect to dashboard which will handle auth
  if (!isAuthenticated || !user) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // Check if user has access to this module
  const hasAccess = hasModuleAccess(user.role, moduleId);

  // If user doesn't have access, log the attempt and show access denied
  if (!hasAccess) {
    // Log unauthorized access attempt
    logUnauthorizedAccess(
      user.id,
      user.name,
      user.role,
      moduleId,
      location.pathname
    );

    // Determine redirect path
    const redirectPath = redirectTo || getLandingPageForRole(user.role);

    // Determine access denied message
    const message =
      accessDeniedMessage ||
      `Your role (${user.role}) does not have access to the ${moduleId.replace(/-/g, ' ')} module. Please contact your administrator if you need access.`;

    // Show access denied page with option to redirect
    return (
      <AccessDenied
        message={message}
        redirectPath={redirectPath}
        userName={user.name}
        role={user.role}
      />
    );
  }

  // User has access, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
