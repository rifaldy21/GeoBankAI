import { UserRole } from '../../contexts/AuthContext';

/**
 * View level types for role-based access control
 */
export type ViewLevel = 'national' | 'regional' | 'branch' | 'portfolio';

/**
 * Module identifiers for the application
 */
export type ModuleId =
  | 'dashboard'
  | 'territorial-intelligence'
  | 'market-intelligence'
  | 'performance'
  | 'intelligence-assistant'
  | 'reporting'
  | 'data-management'
  | 'campaign';

/**
 * Permission configuration for a specific role
 */
export interface RolePermissions {
  /**
   * The data view level for this role
   * - national: See all data across the organization (Direksi)
   * - regional: See data for assigned region (Regional Head)
   * - branch: See data for assigned branch (Branch Manager)
   * - portfolio: See data for assigned portfolio (RM)
   */
  viewLevel: ViewLevel;

  /**
   * Modules accessible to this role
   * Use '*' to grant access to all modules
   */
  modules: ModuleId[] | ['*'];

  /**
   * Whether this role can export data (Excel, PDF, CSV)
   */
  canExport: boolean;

  /**
   * Whether this role can upload and manage data
   */
  canManageData: boolean;

  /**
   * Whether this role can create and manage campaigns
   */
  canCreateCampaigns: boolean;
}

/**
 * Complete permissions configuration for all roles
 * 
 * Role Hierarchy:
 * 1. Direksi (Executive) - National view, full access
 * 2. Regional Head - Regional view, most features
 * 3. Branch Manager - Branch view, limited features
 * 4. RM (Relationship Manager) - Portfolio view, minimal features
 */
export const PERMISSIONS: Record<UserRole, RolePermissions> = {
  /**
   * Direksi (Executive/Director)
   * - Full national-level access to all data
   * - Can access all modules
   * - Can export data in all formats
   * - Can manage data uploads and configurations
   * - Can create and manage campaigns
   */
  Direksi: {
    viewLevel: 'national',
    modules: ['*'],
    canExport: true,
    canManageData: true,
    canCreateCampaigns: true,
  },

  /**
   * Regional Head
   * - Regional-level access to assigned region data
   * - Can access most modules except data management
   * - Can export data in all formats
   * - Cannot manage data uploads (read-only)
   * - Can create and manage campaigns for their region
   */
  'Regional Head': {
    viewLevel: 'regional',
    modules: [
      'dashboard',
      'territorial-intelligence',
      'market-intelligence',
      'performance',
      'intelligence-assistant',
      'reporting',
      'campaign',
    ],
    canExport: true,
    canManageData: false,
    canCreateCampaigns: true,
  },

  /**
   * Branch Manager
   * - Branch-level access to assigned branch data
   * - Can access core operational modules
   * - Can export data in all formats
   * - Cannot manage data uploads (read-only)
   * - Cannot create campaigns (can only view assigned campaigns)
   */
  'Branch Manager': {
    viewLevel: 'branch',
    modules: [
      'dashboard',
      'territorial-intelligence',
      'performance',
      'intelligence-assistant',
      'reporting',
    ],
    canExport: true,
    canManageData: false,
    canCreateCampaigns: false,
  },

  /**
   * RM (Relationship Manager)
   * - Portfolio-level access to assigned portfolio data
   * - Can access minimal modules for daily operations
   * - Cannot export data (view-only)
   * - Cannot manage data uploads (read-only)
   * - Cannot create campaigns (can only view assigned tasks)
   */
  RM: {
    viewLevel: 'portfolio',
    modules: ['dashboard', 'performance', 'intelligence-assistant'],
    canExport: false,
    canManageData: false,
    canCreateCampaigns: false,
  },
};

/**
 * Check if a role has access to a specific module
 * 
 * @param role - The user role to check
 * @param moduleId - The module identifier to check access for
 * @returns true if the role has access to the module, false otherwise
 */
export const hasModuleAccess = (role: UserRole, moduleId: ModuleId): boolean => {
  const permissions = PERMISSIONS[role];
  
  // Check for wildcard access
  if (permissions.modules.includes('*' as ModuleId)) {
    return true;
  }
  
  // Check for specific module access
  return permissions.modules.includes(moduleId);
};

/**
 * Check if a role can export data
 * 
 * @param role - The user role to check
 * @returns true if the role can export data, false otherwise
 */
export const canExportData = (role: UserRole): boolean => {
  return PERMISSIONS[role].canExport;
};

/**
 * Check if a role can manage data (upload, edit, delete)
 * 
 * @param role - The user role to check
 * @returns true if the role can manage data, false otherwise
 */
export const canManageData = (role: UserRole): boolean => {
  return PERMISSIONS[role].canManageData;
};

/**
 * Check if a role can create campaigns
 * 
 * @param role - The user role to check
 * @returns true if the role can create campaigns, false otherwise
 */
export const canCreateCampaigns = (role: UserRole): boolean => {
  return PERMISSIONS[role].canCreateCampaigns;
};

/**
 * Get the view level for a specific role
 * 
 * @param role - The user role to get view level for
 * @returns The view level for the role
 */
export const getViewLevel = (role: UserRole): ViewLevel => {
  return PERMISSIONS[role].viewLevel;
};

/**
 * Get all accessible modules for a specific role
 * 
 * @param role - The user role to get modules for
 * @returns Array of module IDs accessible to the role
 */
export const getAccessibleModules = (role: UserRole): ModuleId[] => {
  const permissions = PERMISSIONS[role];
  
  // If wildcard access, return all modules
  if (permissions.modules.includes('*' as ModuleId)) {
    return [
      'dashboard',
      'territorial-intelligence',
      'market-intelligence',
      'performance',
      'intelligence-assistant',
      'reporting',
      'data-management',
      'campaign',
    ];
  }
  
  return permissions.modules as ModuleId[];
};

/**
 * Get a summary of permissions for a specific role
 * Useful for displaying role capabilities in the UI
 * 
 * @param role - The user role to get summary for
 * @returns Object containing permission summary
 */
export const getPermissionSummary = (role: UserRole) => {
  const permissions = PERMISSIONS[role];
  const accessibleModules = getAccessibleModules(role);
  
  return {
    role,
    viewLevel: permissions.viewLevel,
    moduleCount: accessibleModules.length,
    modules: accessibleModules,
    capabilities: {
      export: permissions.canExport,
      manageData: permissions.canManageData,
      createCampaigns: permissions.canCreateCampaigns,
    },
  };
};
