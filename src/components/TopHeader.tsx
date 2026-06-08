import React, { useState } from 'react';
import { useVMS, CurrentPage } from '../vmsContext';
import { Bell, Search, Sun, Moon, Sparkles, LogOut, ChevronDown, User, ShieldCheck } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    setCmdPaletteOpen,
    setNotificationPanelOpen,
    darkMode,
    setDarkMode,
    toasts,
    vendors
  } = useVMS();

  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  // Derive breadcrumbs and labels
  const getPageInfo = (): { title: string; breadcrumb: string } => {
    switch (currentPage) {
      case 'dashboard':
        return { title: 'Dashboard Overview', breadcrumb: 'VendorFlow / Dashboard' };
      case 'calendar':
        return { title: 'Event Calendar', breadcrumb: 'VendorFlow / Calendar' };
      case 'vendors':
        return { title: 'Vendor Directory', breadcrumb: 'VendorFlow / Directory' };
      case 'vendor-detail':
        return { title: 'Vendor Profile Detail', breadcrumb: 'VendorFlow / Directory / Profile' };
      case 'compare':
        return { title: 'Vendor Comparison', breadcrumb: 'VendorFlow / Directory / Compare' };
      case 'onboarding':
        return { title: 'Vendor Onboarding', breadcrumb: 'VendorFlow / Onboarding' };
      case 'performance':
        return { title: 'Performance Core', breadcrumb: 'VendorFlow / Performance' };
      case 'esg':
        return { title: 'ESG & Sustainability', breadcrumb: 'VendorFlow / Compliance / ESG' };
      case 'items-registry':
        return { title: 'Items Registry', breadcrumb: 'VendorFlow / Procurement / Items' };
      case 'purchase-orders':
        return { title: 'Purchase Orders', breadcrumb: 'VendorFlow / Procurement / PO' };
      case 'rfq':
        return { title: 'RFQ & Sourcing', breadcrumb: 'VendorFlow / Procurement / RFQ' };
      case 'contracts':
        return { title: 'Contracts Directory', breadcrumb: 'VendorFlow / Procurement / Contracts' };
      case 'invoices':
        return { title: 'Financial Invoices', breadcrumb: 'VendorFlow / Procurement / Invoices' };
      case 'risk':
        return { title: 'Risk Assessment', breadcrumb: 'VendorFlow / Compliance & Risk' };
      case 'compliance':
        return { title: 'Compliance Documents', breadcrumb: 'VendorFlow / Compliance / Docs' };
      case 'audit-logs':
        return { title: 'Audit Trail Logs', breadcrumb: 'VendorFlow / Compliance / Audit' };
      case 'payments':
        return { title: 'Payments Register', breadcrumb: 'VendorFlow / Finance / Payments' };
      case 'savings':
        return { title: 'Negotiated Savings Tracker', breadcrumb: 'VendorFlow / Finance / Savings' };
      case 'spend-analytics':
        return { title: 'Spend Analytics', breadcrumb: 'VendorFlow / Finance / Analytics' };
      case 'users':
        return { title: 'User Management', breadcrumb: 'VendorFlow / Administration / Users' };
      case 'settings':
        return { title: 'System Settings', breadcrumb: 'VendorFlow / Administration / Settings' };
      default:
        return { title: 'Overview Panel', breadcrumb: 'VendorFlow / App' };
    }
  };

  const info = getPageInfo();

  return (
    <header className="h-20 bg-white dark:bg-[#1A202C] border-b border-gray-200 dark:border-[#2D3748] px-6 py-2 flex items-center justify-between fixed top-0 left-14 md:left-[240px] right-0 z-40 transition-colors duration-200">
      {/* Left side Titles and Breadcrumbs */}
      <div className="flex flex-col">
        <h1 className="font-sans font-bold text-base text-gray-900 dark:text-[#E2E8F0] leading-none tracking-tight">
          {info.title}
        </h1>
        <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-500 mt-1 block">
          {info.breadcrumb.toUpperCase()}
        </span>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Search button referencing CmdK palette */}
        <button
          onClick={() => setCmdPaletteOpen(true)}
          className="hidden sm:flex w-[160px] md:w-[240px] h-8 bg-gray-50 hover:bg-gray-100 dark:bg-[#14181F] border border-gray-200 dark:border-[#2D3748] rounded items-center px-3 justify-between text-gray-400 font-sans transition-all group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-slate-300" />
            <span className="text-xs text-gray-400 group-hover:text-gray-500 dark:group-hover:text-slate-400 font-mono">
              SEARCH_QUERY...
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono text-gray-500 bg-gray-150 dark:bg-[#1A202C] px-1 py-0.5 rounded border dark:border-[#2D3748] leading-none">
              CTRL+K
            </span>
          </div>
        </button>

        {/* Theme select button Sun/Moon toggle with sliding bg */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="relative w-[52px] h-7 bg-gray-150 dark:bg-slate-800 rounded-full flex items-center p-0.5 transition-colors duration-300 pointer-events-auto shadow-inner"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {/* Slider ball */}
          <div
            className={`w-[22px] h-[22px] rounded-full bg-white dark:bg-[#111827] flex items-center justify-center shadow-sm transform duration-200 ${
              darkMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          >
            {darkMode ? (
              <Moon className="w-[13px] h-[13px] text-indigo-400" />
            ) : (
              <Sun className="w-[13px] h-[13px] text-amber-500" />
            )}
          </div>
          {/* Subtle static indicators inside path */}
          <Sun className={`w-3.5 h-3.5 text-amber-600/30 absolute left-[6px] ${darkMode ? 'opacity-100' : 'opacity-0'}`} />
          <Moon className={`w-3.5 h-3.5 text-blue-400/30 absolute right-[6px] ${darkMode ? 'opacity-0' : 'opacity-100'}`} />
        </button>

        {/* Notification indicator bell */}
        <button
          onClick={() => setNotificationPanelOpen(true)}
          className="p-1.5 text-gray-500 hover:text-gray-950 dark:text-slate-400 dark:hover:text-white rounded hover:bg-gray-150 dark:hover:bg-[#14181F] relative transition border border-gray-200 dark:border-[#2D3748] bg-gray-50 dark:bg-[#14181F]"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white dark:border-[#1A202C]">
            3
          </span>
        </button>

        <div className="w-[1px] h-5 bg-gray-200 dark:bg-[#2D3748]" />

        {/* Profile menu circular selector dropdown */}
        <div className="relative">
          <button
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border border-slate-200 dark:border-slate-800 text-white flex items-center justify-center font-bold text-xs select-none">
              AM
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400" />
          </button>

          {avatarMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setAvatarMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#161B27] border border-gray-205 dark:border-gray-803 rounded-md shadow-lg z-40 p-1 font-sans py-2 animate-scale-up duration-150">
                <div className="px-3.5 py-1.5 border-b border-gray-100 dark:border-gray-800 mb-1">
                  <span className="text-xs text-gray-400 dark:text-slate-500 block uppercase font-bold tracking-wider font-sans">Currently Logged In</span>
                  <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate font-sans">Alex Mercer</p>
                  <span className="text-[11px] text-gray-550 dark:text-slate-400 truncate block">alex.mercer@vendorflow.com</span>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('settings');
                    setAvatarMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-slate-850 text-xs text-gray-750 dark:text-slate-333 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  My Settings
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('users');
                    setAvatarMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-slate-850 text-xs text-gray-750 dark:text-slate-333 flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                  Access Privileges
                </button>
                <button
                  onClick={() => {
                    alert('Logging out general sandbox user session.');
                    setAvatarMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-slate-850 text-xs text-red-600 dark:text-red-450 border-t border-gray-100 dark:border-gray-800 mt-1.5 pt-2 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out of Session
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
