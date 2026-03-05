import { FC, useState } from 'react';
import { Filter, X, Calendar, MapPin, Building2, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFilters } from '../contexts/FilterContext';

interface PageFiltersProps {
  showTerritoryFilter?: boolean;
  showDateRangeFilter?: boolean;
  showBranchFilter?: boolean;
  showProductFilter?: boolean;
}

/**
 * PageFilters Component
 * Reusable filter component that connects to global FilterContext
 * 
 * Features:
 * - Territory filter (province, city, district, village)
 * - Date range filter
 * - Branch filter
 * - Product filter
 * - Connected to FilterContext for global filter state
 * - Filter reset functionality
 * - Responsive design
 * 
 * Requirements: 2.7, 11.2, 12.4
 */
const PageFilters: FC<PageFiltersProps> = ({
  showTerritoryFilter = true,
  showDateRangeFilter = true,
  showBranchFilter = true,
  showProductFilter = true
}) => {
  const { filters, updateFilters, resetFilters } = useFilters();
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock data - in production, these would come from API
  const territories = ['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur'];
  const branches = ['Jakarta Pusat', 'Jakarta Selatan', 'Bandung', 'Surabaya'];
  const products = ['CASA', 'Credit', 'QRIS', 'Savings'];

  const handleTerritoryChange = (territory: string) => {
    const newTerritories = filters.territory.includes(territory)
      ? filters.territory.filter(t => t !== territory)
      : [...filters.territory, territory];
    
    updateFilters({ territory: newTerritories });
  };

  const handleBranchChange = (branch: string) => {
    const newBranches = filters.branch.includes(branch)
      ? filters.branch.filter(b => b !== branch)
      : [...filters.branch, branch];
    
    updateFilters({ branch: newBranches });
  };

  const handleProductChange = (product: string) => {
    const newProducts = filters.product.includes(product)
      ? filters.product.filter(p => p !== product)
      : [...filters.product, product];
    
    updateFilters({ product: newProducts });
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const newDate = new Date(value);
    updateFilters({
      dateRange: {
        ...filters.dateRange,
        [type === 'start' ? 'startDate' : 'endDate']: newDate
      }
    });
  };

  const activeFilterCount = 
    filters.territory.length + 
    filters.branch.length + 
    filters.product.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Filter Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Filters</h3>
            {activeFilterCount > 0 && (
              <p className="text-xs text-slate-500">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Reset All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
          >
            {isExpanded ? (
              <X className="w-4 h-4" />
            ) : (
              <Filter className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Date Range Filter */}
              {showDateRangeFilter && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <Calendar className="w-4 h-4" />
                    Date Range
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Start Date</label>
                      <input
                        type="date"
                        value={filters.dateRange.startDate.toISOString().split('T')[0]}
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">End Date</label>
                      <input
                        type="date"
                        value={filters.dateRange.endDate.toISOString().split('T')[0]}
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Territory Filter */}
              {showTerritoryFilter && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <MapPin className="w-4 h-4" />
                    Territory
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {territories.map((territory) => (
                      <button
                        key={territory}
                        onClick={() => handleTerritoryChange(territory)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          filters.territory.includes(territory)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {territory}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Branch Filter */}
              {showBranchFilter && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <Building2 className="w-4 h-4" />
                    Branch
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {branches.map((branch) => (
                      <button
                        key={branch}
                        onClick={() => handleBranchChange(branch)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          filters.branch.includes(branch)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {branch}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Filter */}
              {showProductFilter && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <Package className="w-4 h-4" />
                    Product
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {products.map((product) => (
                      <button
                        key={product}
                        onClick={() => handleProductChange(product)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          filters.product.includes(product)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {product}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageFilters;
