import { User, AssignedArea } from '../../contexts/AuthContext';
import { ViewLevel, getViewLevel } from './permissions';

/**
 * Generic data item with territorial assignment
 * All filterable data types should have these properties
 */
interface TerritorialData {
  regionId?: string;
  branchId?: string;
  portfolioId?: string;
  territory?: string;
  branch?: string;
}

/**
 * Region data structure for filtering
 */
export interface Region extends TerritorialData {
  id: string;
  name: string;
  level?: 'province' | 'city' | 'district' | 'village';
  parentId?: string;
}

/**
 * Branch data structure for filtering
 */
export interface Branch extends TerritorialData {
  id: string;
  name: string;
  code?: string;
  territory: string;
}

/**
 * RM (Relationship Manager) data structure for filtering
 */
export interface RM extends TerritorialData {
  id: string;
  name: string;
  territory: string;
  branch: string;
  portfolioId?: string;
}

/**
 * Customer data structure for filtering
 */
export interface Customer extends TerritorialData {
  id: string;
  name: string;
  assignedRM?: string;
}

/**
 * Merchant data structure for filtering
 */
export interface Merchant extends TerritorialData {
  id: string;
  name: string;
  assignedRM?: string;
}

/**
 * Campaign data structure for filtering
 */
export interface Campaign extends TerritorialData {
  id: string;
  name: string;
  targetRegions?: string[];
  assignedRMs?: string[];
}

/**
 * Check if a data item matches the user's assigned area
 * 
 * @param item - The data item to check
 * @param assignedArea - The user's assigned area
 * @param viewLevel - The user's view level
 * @returns true if the item should be visible to the user
 */
const matchesAssignedArea = (
  item: TerritorialData,
  assignedArea: AssignedArea | undefined,
  viewLevel: ViewLevel
): boolean => {
  // National level: see everything
  if (viewLevel === 'national') {
    return true;
  }

  // No assigned area means no access (except national)
  if (!assignedArea) {
    return false;
  }

  // Regional level: filter by regionId or territory
  if (viewLevel === 'regional') {
    if (assignedArea.regionId) {
      // Check direct regionId match
      if (item.regionId === assignedArea.regionId) {
        return true;
      }
      // Check territory string match (for legacy data)
      if (item.territory && assignedArea.regionId.includes(item.territory.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  // Branch level: filter by branchId or branch
  if (viewLevel === 'branch') {
    if (assignedArea.branchId) {
      // Check direct branchId match
      if (item.branchId === assignedArea.branchId) {
        return true;
      }
      // Check branch string match (for legacy data)
      if (item.branch && assignedArea.branchId.includes(item.branch.toLowerCase())) {
        return true;
      }
    }
    // Also check if item belongs to the same region
    if (assignedArea.regionId && item.regionId === assignedArea.regionId) {
      return true;
    }
    return false;
  }

  // Portfolio level: filter by portfolioId or assignedRM
  if (viewLevel === 'portfolio') {
    if (assignedArea.portfolioId) {
      // Check direct portfolioId match
      if (item.portfolioId === assignedArea.portfolioId) {
        return true;
      }
    }
    // Also check if item belongs to the same branch
    if (assignedArea.branchId && item.branchId === assignedArea.branchId) {
      return true;
    }
    return false;
  }

  return false;
};

/**
 * Filter data array based on user role and assigned area
 * 
 * @param data - Array of data items to filter
 * @param user - The current user with role and assigned area
 * @returns Filtered array containing only items the user should see
 * 
 * @example
 * ```typescript
 * const regions = await fetchRegions();
 * const filteredRegions = filterDataByRole(regions, currentUser);
 * ```
 */
export function filterDataByRole<T extends TerritorialData>(
  data: T[],
  user: User | null
): T[] {
  // No user means no access
  if (!user) {
    return [];
  }

  // Get the user's view level
  const viewLevel = getViewLevel(user.role);

  // National level sees everything
  if (viewLevel === 'national') {
    return data;
  }

  // Filter based on assigned area
  return data.filter((item) =>
    matchesAssignedArea(item, user.assignedArea, viewLevel)
  );
}

/**
 * Filter regions based on user role and assigned area
 * 
 * @param regions - Array of regions to filter
 * @param user - The current user
 * @returns Filtered array of regions
 */
export function filterRegions(regions: Region[], user: User | null): Region[] {
  if (!user) {
    return [];
  }

  const viewLevel = getViewLevel(user.role);

  // National level sees all regions
  if (viewLevel === 'national') {
    return regions;
  }

  // Regional level sees assigned region and its children
  if (viewLevel === 'regional' && user.assignedArea?.regionId) {
    const assignedRegionId = user.assignedArea.regionId;
    return regions.filter(
      (region) =>
        region.id === assignedRegionId ||
        region.parentId === assignedRegionId ||
        region.regionId === assignedRegionId
    );
  }

  // Branch and Portfolio levels see regions related to their branch
  if (
    (viewLevel === 'branch' || viewLevel === 'portfolio') &&
    user.assignedArea?.regionId
  ) {
    return regions.filter(
      (region) => region.id === user.assignedArea?.regionId
    );
  }

  return [];
}

/**
 * Filter branches based on user role and assigned area
 * 
 * @param branches - Array of branches to filter
 * @param user - The current user
 * @returns Filtered array of branches
 */
export function filterBranches(branches: Branch[], user: User | null): Branch[] {
  if (!user) {
    return [];
  }

  const viewLevel = getViewLevel(user.role);

  // National level sees all branches
  if (viewLevel === 'national') {
    return branches;
  }

  // Regional level sees branches in assigned region
  if (viewLevel === 'regional' && user.assignedArea?.regionId) {
    return branches.filter(
      (branch) =>
        branch.regionId === user.assignedArea?.regionId ||
        branch.territory === user.assignedArea?.regionId
    );
  }

  // Branch level sees only assigned branch
  if (viewLevel === 'branch' && user.assignedArea?.branchId) {
    return branches.filter(
      (branch) =>
        branch.id === user.assignedArea?.branchId ||
        branch.branchId === user.assignedArea?.branchId
    );
  }

  // Portfolio level sees assigned branch
  if (viewLevel === 'portfolio' && user.assignedArea?.branchId) {
    return branches.filter(
      (branch) =>
        branch.id === user.assignedArea?.branchId ||
        branch.branchId === user.assignedArea?.branchId
    );
  }

  return [];
}

/**
 * Filter RMs based on user role and assigned area
 * 
 * @param rms - Array of RMs to filter
 * @param user - The current user
 * @returns Filtered array of RMs
 */
export function filterRMs(rms: RM[], user: User | null): RM[] {
  if (!user) {
    return [];
  }

  const viewLevel = getViewLevel(user.role);

  // National level sees all RMs
  if (viewLevel === 'national') {
    return rms;
  }

  // Regional level sees RMs in assigned region
  if (viewLevel === 'regional' && user.assignedArea?.regionId) {
    return rms.filter(
      (rm) =>
        rm.regionId === user.assignedArea?.regionId ||
        rm.territory === user.assignedArea?.regionId
    );
  }

  // Branch level sees RMs in assigned branch
  if (viewLevel === 'branch' && user.assignedArea?.branchId) {
    return rms.filter(
      (rm) =>
        rm.branchId === user.assignedArea?.branchId ||
        rm.branch === user.assignedArea?.branchId
    );
  }

  // Portfolio level sees only self (if RM)
  if (viewLevel === 'portfolio') {
    return rms.filter((rm) => rm.id === user.id);
  }

  return [];
}

/**
 * Filter customers based on user role and assigned area
 * 
 * @param customers - Array of customers to filter
 * @param user - The current user
 * @returns Filtered array of customers
 */
export function filterCustomers(
  customers: Customer[],
  user: User | null
): Customer[] {
  if (!user) {
    return [];
  }

  const viewLevel = getViewLevel(user.role);

  // National level sees all customers
  if (viewLevel === 'national') {
    return customers;
  }

  // Regional level sees customers in assigned region
  if (viewLevel === 'regional' && user.assignedArea?.regionId) {
    return customers.filter(
      (customer) =>
        customer.regionId === user.assignedArea?.regionId ||
        customer.territory === user.assignedArea?.regionId
    );
  }

  // Branch level sees customers in assigned branch
  if (viewLevel === 'branch' && user.assignedArea?.branchId) {
    return customers.filter(
      (customer) =>
        customer.branchId === user.assignedArea?.branchId ||
        customer.branch === user.assignedArea?.branchId
    );
  }

  // Portfolio level sees customers in assigned portfolio
  if (viewLevel === 'portfolio') {
    if (user.assignedArea?.portfolioId) {
      return customers.filter(
        (customer) => customer.portfolioId === user.assignedArea?.portfolioId
      );
    }
    // Fallback: filter by assigned RM
    return customers.filter((customer) => customer.assignedRM === user.id);
  }

  return [];
}

/**
 * Filter merchants based on user role and assigned area
 * 
 * @param merchants - Array of merchants to filter
 * @param user - The current user
 * @returns Filtered array of merchants
 */
export function filterMerchants(
  merchants: Merchant[],
  user: User | null
): Merchant[] {
  if (!user) {
    return [];
  }

  const viewLevel = getViewLevel(user.role);

  // National level sees all merchants
  if (viewLevel === 'national') {
    return merchants;
  }

  // Regional level sees merchants in assigned region
  if (viewLevel === 'regional' && user.assignedArea?.regionId) {
    return merchants.filter(
      (merchant) =>
        merchant.regionId === user.assignedArea?.regionId ||
        merchant.territory === user.assignedArea?.regionId
    );
  }

  // Branch level sees merchants in assigned branch
  if (viewLevel === 'branch' && user.assignedArea?.branchId) {
    return merchants.filter(
      (merchant) =>
        merchant.branchId === user.assignedArea?.branchId ||
        merchant.branch === user.assignedArea?.branchId
    );
  }

  // Portfolio level sees merchants in assigned portfolio
  if (viewLevel === 'portfolio') {
    if (user.assignedArea?.portfolioId) {
      return merchants.filter(
        (merchant) => merchant.portfolioId === user.assignedArea?.portfolioId
      );
    }
    // Fallback: filter by assigned RM
    return merchants.filter((merchant) => merchant.assignedRM === user.id);
  }

  return [];
}

/**
 * Filter campaigns based on user role and assigned area
 * 
 * @param campaigns - Array of campaigns to filter
 * @param user - The current user
 * @returns Filtered array of campaigns
 */
export function filterCampaigns(
  campaigns: Campaign[],
  user: User | null
): Campaign[] {
  if (!user) {
    return [];
  }

  const viewLevel = getViewLevel(user.role);

  // National level sees all campaigns
  if (viewLevel === 'national') {
    return campaigns;
  }

  // Regional level sees campaigns targeting assigned region
  if (viewLevel === 'regional' && user.assignedArea?.regionId) {
    return campaigns.filter(
      (campaign) =>
        campaign.targetRegions?.includes(user.assignedArea!.regionId!) ||
        campaign.regionId === user.assignedArea?.regionId
    );
  }

  // Branch level sees campaigns targeting assigned branch
  if (viewLevel === 'branch' && user.assignedArea?.branchId) {
    return campaigns.filter(
      (campaign) =>
        campaign.branchId === user.assignedArea?.branchId ||
        campaign.branch === user.assignedArea?.branchId
    );
  }

  // Portfolio level sees campaigns assigned to user
  if (viewLevel === 'portfolio') {
    return campaigns.filter(
      (campaign) =>
        campaign.assignedRMs?.includes(user.id) ||
        campaign.portfolioId === user.assignedArea?.portfolioId
    );
  }

  return [];
}

/**
 * Check if a user can view a specific data item
 * Useful for single-item access checks
 * 
 * @param item - The data item to check
 * @param user - The current user
 * @returns true if the user can view the item
 * 
 * @example
 * ```typescript
 * if (canViewItem(region, currentUser)) {
 *   // Show region details
 * }
 * ```
 */
export function canViewItem<T extends TerritorialData>(
  item: T,
  user: User | null
): boolean {
  if (!user) {
    return false;
  }

  const viewLevel = getViewLevel(user.role);
  return matchesAssignedArea(item, user.assignedArea, viewLevel);
}

/**
 * Get the filtering scope description for a user
 * Useful for displaying in the UI what data the user can see
 * 
 * @param user - The current user
 * @returns Human-readable description of the user's data scope
 * 
 * @example
 * ```typescript
 * const scope = getFilterScope(currentUser);
 * // Returns: "Regional: Jakarta" or "Branch: Menteng" or "National: All Data"
 * ```
 */
export function getFilterScope(user: User | null): string {
  if (!user) {
    return 'No Access';
  }

  const viewLevel = getViewLevel(user.role);

  switch (viewLevel) {
    case 'national':
      return 'National: All Data';
    case 'regional':
      return `Regional: ${user.assignedArea?.regionId || 'Unknown'}`;
    case 'branch':
      return `Branch: ${user.assignedArea?.branchId || 'Unknown'}`;
    case 'portfolio':
      return `Portfolio: ${user.assignedArea?.portfolioId || user.name}`;
    default:
      return 'Unknown Scope';
  }
}
