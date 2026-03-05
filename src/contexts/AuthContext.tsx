import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// User role types
export type UserRole = 'Direksi' | 'Regional Head' | 'Branch Manager' | 'RM';

// Assigned area types
export interface AssignedArea {
  type: 'national' | 'regional' | 'branch' | 'portfolio';
  regionId?: string;
  branchId?: string;
  portfolioId?: string;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  assignedArea?: AssignedArea;
  avatar?: string;
  permissions: string[];
}

// Login credentials
export interface Credentials {
  email: string;
  password: string;
}

// Auth context value interface
export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

// Create context with undefined default
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mock users for development
const MOCK_USERS: Record<string, User> = {
  'direksi@bri.co.id': {
    id: 'user-1',
    name: 'Direktur Utama',
    email: 'direksi@bri.co.id',
    phone: '+62 21 1234 5678',
    role: 'Direksi',
    assignedArea: {
      type: 'national',
    },
    permissions: ['view:all', 'export:all', 'manage:data', 'create:campaigns'],
  },
  'regional@bri.co.id': {
    id: 'user-2',
    name: 'Kepala Regional Jakarta',
    email: 'regional@bri.co.id',
    phone: '+62 21 2345 6789',
    role: 'Regional Head',
    assignedArea: {
      type: 'regional',
      regionId: 'region-jakarta',
    },
    permissions: ['view:regional', 'export:regional', 'create:campaigns'],
  },
  'branch@bri.co.id': {
    id: 'user-3',
    name: 'Manager Cabang Menteng',
    email: 'branch@bri.co.id',
    phone: '+62 21 3456 7890',
    role: 'Branch Manager',
    assignedArea: {
      type: 'branch',
      regionId: 'region-jakarta',
      branchId: 'branch-menteng',
    },
    permissions: ['view:branch', 'export:branch'],
  },
  'rm@bri.co.id': {
    id: 'user-4',
    name: 'Relationship Manager',
    email: 'rm@bri.co.id',
    phone: '+62 21 4567 8901',
    role: 'RM',
    assignedArea: {
      type: 'portfolio',
      regionId: 'region-jakarta',
      branchId: 'branch-menteng',
      portfolioId: 'portfolio-1',
    },
    permissions: ['view:portfolio'],
  },
};

// AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Login function with mock authentication
  const login = useCallback(async (credentials: Credentials): Promise<void> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock authentication - check if user exists
    const mockUser = MOCK_USERS[credentials.email];
    
    if (!mockUser) {
      throw new Error('Invalid credentials');
    }

    // In development, accept any password for mock users
    // In production, this would validate against the backend
    setUser(mockUser);
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // Check if user has a specific permission
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      
      // Check for wildcard permissions
      if (user.permissions.includes('*')) return true;
      
      // Check for exact permission match
      if (user.permissions.includes(permission)) return true;
      
      // Check for wildcard category permissions (e.g., 'view:*' matches 'view:regional')
      const [category] = permission.split(':');
      if (user.permissions.includes(`${category}:*`)) return true;
      
      return false;
    },
    [user]
  );

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export mock users for testing purposes
export { MOCK_USERS };
