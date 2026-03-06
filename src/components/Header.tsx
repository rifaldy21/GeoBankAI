import { FC, useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, ChevronDown, PanelLeftClose, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import FlagIcon from './FlagIcon';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

/**
 * Header Component
 * Top navigation bar dengan mobile menu toggle dan user profile dropdown
 * 
 * Features:
 * - Mobile menu toggle (Task 2.2)
 * - Sidebar collapse toggle (desktop only)
 * - Logo + app name when sidebar is collapsed
 * - User profile dropdown dengan role display (Task 9.1)
 * 
 * Requirements: 2.7, 16.1, 16.2, 16.3, 16.4, 17.1
 */
const Header: FC<HeaderProps> = ({ onToggleMobileMenu, isMobileMenuOpen, isSidebarCollapsed = false, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { locale, setLocale } = useLanguage();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

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
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials untuk avatar
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Language options
  const languages: Array<{ code: 'id' | 'en'; name: string }> = [
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'en', name: 'English' },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[1];

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6" style={{ height: '73px' }}>
      <div className="flex items-center justify-between gap-4 h-full">
        {/* Left side: Mobile menu toggle or Sidebar collapse toggle */}
        <div className="flex items-center gap-3">
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

          {/* Desktop sidebar collapse toggle (only when sidebar is expanded) */}
          {!isSidebarCollapsed && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="hidden md:flex p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-5 h-5 text-slate-600" />
            </button>
          )}

          {/* Logo + app name (shown when sidebar is collapsed on desktop) */}
          {isSidebarCollapsed && (
            <div className="hidden md:flex items-center gap-3">
              <img 
                src="/bri-logo.png" 
                alt="BRI Logo" 
                className="w-8 h-8 object-contain shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-bold text-slate-900 leading-tight">
                  Intelligence
                </h1>
                <p className="text-xs text-slate-600 leading-tight">
                  Dashboard
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          {/* Language Switcher */}
          <div className="relative" ref={languageDropdownRef}>
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              aria-label="Change language"
            >
              <Globe className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">
                <FlagIcon code={locale} className="w-5 h-4" />
              </span>
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </button>

            {/* Language dropdown */}
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                <div className="p-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        locale === lang.code
                          ? 'bg-indigo-50 text-indigo-600 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <FlagIcon code={lang.code} className="w-6 h-4" />
                      <span>{lang.name}</span>
                      {locale === lang.code && (
                        <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
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
    </header>
  );
};

export default Header;
