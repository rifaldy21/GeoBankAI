import { FC, useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, ChevronDown, Calendar, MapPin } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import { useAuth } from '../contexts/AuthContext';
import { useFilters } from '../contexts/FilterContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

/**
 * Header Component
 * Top navigation bar dengan mobile menu toggle, breadcrumb navigation,
 * user profile dropdown, dan global filter controls
 * 
 * Features:
 * - Mobile menu toggle (Task 2.2)
 * - Breadcrumb navigation (Task 8.1)
 * - Application title dan logo
 * - User profile dropdown dengan role display (Task 9.1)
 * - Global filter controls untuk date range dan territory (Task 9.1)
 * 
 * Requirements: 2.7, 16.1, 16.2, 16.3, 16.4, 17.1
 */
const Header: FC<HeaderProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const { filters, updateFilters, resetFilters } = useFilters();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date untuk display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Handle date range change
  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const newDate = new Date(value);
    updateFilters({
      dateRange: {
        ...filters.dateRange,
        [type === 'start' ? 'startDate' : 'endDate']: newDate,
      },
    });
  };

  // Handle territory change
  const handleTerritoryChange = (territory: string) => {
    const currentTerritories = filters.territory;
    const isSelected = currentTerritories.includes(territory);
    
    updateFilters({
      territory: isSelected
        ? currentTerritories.filter((t) => t !== territory)
        : [...currentTerritories, territory],
    });
  };

  // Get user initials untuk avatar
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Territory options (mock data - akan diganti dengan data real)
  const territoryOptions = [
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'Banten',
  ];

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 md:px-6 md:py-4">
      <div className="flex flex-col gap-3">
        {/* Top row: Mobile menu toggle, title, filters, dan user profile */}
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </button>

          {/* Application title dan logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BRI</span>
            </div>
            <h1 className="hidden sm:block text-lg md:text-xl font-bold text-slate-900">
              BRI Intelligence Dashboard
            </h1>
          </div>

          {/* Global filter controls dan user profile */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Global filter controls */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                aria-label="Global filters"
              >
                <Calendar className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline text-sm text-slate-700">
                  {formatDate(filters.dateRange.startDate)} - {formatDate(filters.dateRange.endDate)}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-600" />
              </button>

              {/* Filter dropdown */}
              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                  <div className="p-4 space-y-4">
                    {/* Date range filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Periode Tanggal
                      </label>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">
                            Tanggal Mulai
                          </label>
                          <input
                            type="date"
                            value={filters.dateRange.startDate.toISOString().split('T')[0]}
                            onChange={(e) => handleDateRangeChange('start', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">
                            Tanggal Akhir
                          </label>
                          <input
                            type="date"
                            value={filters.dateRange.endDate.toISOString().split('T')[0]}
                            onChange={(e) => handleDateRangeChange('end', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Territory filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Wilayah
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {territoryOptions.map((territory) => (
                          <label
                            key={territory}
                            className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={filters.territory.includes(territory)}
                              onChange={() => handleTerritoryChange(territory)}
                              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-700">{territory}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Filter actions */}
                    <div className="flex gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={resetFilters}
                        className="flex-1 px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setIsFilterDropdownOpen(false)}
                        className="flex-1 px-3 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Terapkan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User profile dropdown */}
            {user && (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                  aria-label="User profile menu"
                >
                  {/* User avatar */}
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {getUserInitials(user.name)}
                      </span>
                    </div>
                  )}
                  
                  {/* User info (hidden on mobile) */}
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-600">{user.role}</div>
                  </div>
                  
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>

                {/* Profile dropdown menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                    {/* User info */}
                    <div className="p-4 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg font-medium">
                              {getUserInitials(user.name)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900 truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-slate-600">{user.role}</div>
                          <div className="text-xs text-slate-500 truncate">{user.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          // Navigate to profile page (akan diimplementasi nanti)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profil Saya</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumb navigation */}
        <Breadcrumb />
      </div>
    </header>
  );
};

export default Header;
