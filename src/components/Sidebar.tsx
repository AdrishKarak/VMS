import React from 'react';
import { useVMS, CurrentPage } from '../vmsContext';
import {
  LayoutDashboard,
  Building2,
  UserPlus,
  BarChart3,
  Star,
  ShoppingCart,
  FileSearch,
  FileText,
  Receipt,
  ShieldAlert,
  FolderLock,
  ClipboardList,
  Wallet,
  TrendingUp,
  Users,
  Settings,
  Bell,
  GitCompare,
  PiggyBank,
  CalendarDays,
  Leaf,
  LogOut,
  Hexagon,
  ChevronRight
} from 'lucide-react';

interface NavItemProps {
  page: CurrentPage;
  icon: React.ComponentType<any>;
  label: string;
}

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, comparedVendors } = useVMS();

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { page: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { page: 'calendar', icon: CalendarDays, label: 'Calendar' }
      ]
    },
    {
      title: 'VENDORS',
      items: [
        { page: 'vendors', icon: Building2, label: 'Vendor Directory' },
        { page: 'compare', icon: GitCompare, label: `Compare Vendors ${comparedVendors.length > 0 ? `(${comparedVendors.length})` : ''}` },
        { page: 'onboarding', icon: UserPlus, label: 'Onboarding' },
        { page: 'performance', icon: BarChart3, label: 'Performance' },
        { page: 'esg', icon: Leaf, label: 'ESG Scorecard' }
      ]
    },
    {
      title: 'PROCUREMENT',
      items: [
        { page: 'purchase-orders', icon: ShoppingCart, label: 'Purchase Orders' },
        { page: 'rfq', icon: FileSearch, label: 'RFQ / Sourcing' },
        { page: 'contracts', icon: FileText, label: 'Contracts' },
        { page: 'invoices', icon: Receipt, label: 'Invoices' }
      ]
    },
    {
      title: 'COMPLIANCE & RISK',
      items: [
        { page: 'risk', icon: ShieldAlert, label: 'Risk Assessment' },
        { page: 'compliance', icon: FolderLock, label: 'Compliance Documents' },
        { page: 'audit-logs', icon: ClipboardList, label: 'Audit Logs' }
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { page: 'payments', icon: Wallet, label: 'Payments' },
        { page: 'savings', icon: PiggyBank, label: 'Savings Tracker' },
        { page: 'spend-analytics', icon: TrendingUp, label: 'Spend Analytics' }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { page: 'users', icon: Users, label: 'User Management' },
        { page: 'settings', icon: Settings, label: 'Settings' }
      ]
    }
  ];

  const handleLogout = () => {
    alert('Logged out Mercer Alex (Procurement Manager).');
  };

  return (
    <aside className="w-14 md:w-[240px] flex-shrink-0 bg-white text-slate-700 dark:bg-[#14181F] dark:text-[#E2E8F0] flex flex-col h-screen fixed left-0 top-0 border-r border-sky-100 dark:border-[#2D3748] z-35 overflow-hidden">
      {/* Brand area */}
      <div className="h-20 flex-shrink-0 flex items-center justify-center md:justify-start px-2 md:px-6 border-b border-sky-100 dark:border-[#2D3748] gap-3 bg-sky-50/50 dark:bg-[#1A202C]">
        <div className="p-1.5 bg-indigo-600 rounded">
          <Hexagon className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
        <div className="hidden md:block">
          <span className="font-roboto font-bold text-base text-slate-800 dark:text-white tracking-tight block leading-none">NEXUS_VMS</span>
          <span className="text-[9px] uppercase tracking-widest text-sky-600 dark:text-indigo-400 font-mono block mt-0.5">EST: OPTIMAL</span>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 py-4 px-1.5 md:px-3 space-y-4 overflow-y-auto scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h3 className="hidden md:block px-3 text-[9px] font-bold text-sky-600 dark:text-gray-500 uppercase tracking-widest font-mono">
              {group.title}
            </h3>
            <div className="space-y-[1px] mt-1.5">
              {group.items.map((item) => {
                const isActive = currentPage === item.page || (item.page === 'vendors' && currentPage === 'vendor-detail');
                const IconComp = item.icon;
                return (
                  <button
                    key={item.page}
                    onClick={() => setCurrentPage(item.page as CurrentPage)}
                    className={`nav-item-el w-full h-8 flex items-center justify-center md:justify-start px-2 md:px-3 rounded gap-2 font-sans font-medium text-xs duration-150 transition-colors ${
                      isActive
                        ? 'bg-sky-100 text-sky-850 border border-sky-200 dark:bg-indigo-600/15 dark:text-indigo-400 dark:border-indigo-600/20'
                        : 'text-slate-600 hover:bg-sky-50 hover:text-slate-900 dark:text-[#CBD5E1] dark:hover:bg-[#1A202C]/60 dark:hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <IconComp className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-sky-600 dark:text-indigo-400' : 'text-slate-400 dark:text-gray-400'}`} />
                    <span className="hidden md:inline truncate pr-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Area with logged in user avatar */}
      <div className="p-3 pb-4 pt-3 border-t border-sky-100 dark:border-[#2D3748] bg-sky-50/30 dark:bg-[#101318] flex items-center justify-center md:justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-xs select-none border border-sky-100 dark:border-[#2D3748]">
            AM
          </div>
          <div className="hidden md:block overflow-hidden">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-white font-sans leading-tight truncate">Alex Mercer</h4>
            <span className="text-[10px] text-slate-500 dark:text-gray-500 font-mono block leading-none truncate">SYS_MGR</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="hidden md:block p-1 px-1.5 text-slate-400 hover:text-slate-900 hover:bg-sky-100 dark:hover:text-white dark:hover:bg-gray-800 rounded transition"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
