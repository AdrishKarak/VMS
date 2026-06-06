import React, { useEffect } from 'react';
import { VMSProvider, useVMS } from './vmsContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ToastCenter } from './components/ToastCenter';
import { CmdKPalette } from './components/CmdKPalette';
import { NotificationsPanel } from './components/NotificationsPanel';

// Import All Page Components
import { Dashboard } from './pages/Dashboard';
import { VendorDirectory } from './pages/VendorDirectory';
import { VendorDetail } from './pages/VendorDetail';
import { Onboarding } from './pages/Onboarding';
import { Performance } from './pages/Performance';
import { Compare } from './pages/Compare';
import { ProcurementModule } from './pages/ProcurementModule';
import { FinanceModule } from './pages/FinanceModule';
import { RiskComplianceModule } from './pages/RiskComplianceModule';
import { AdminModule } from './pages/AdminModule';

const AppContent: React.FC = () => {
  const { currentPage, darkMode } = useVMS();

  // Handle document level theme sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Map currentPage routing state to exact page component or tab views
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;

      case 'vendors':
        return <VendorDirectory />;

      case 'vendor-detail':
        return <VendorDetail />;

      case 'compare':
        return <Compare />;

      case 'onboarding':
        return <Onboarding />;

      case 'performance':
        return <Performance />;

      case 'calendar':
      case 'users':
      case 'settings':
        return <AdminModule />;

      case 'purchase-orders':
      case 'rfq':
      case 'contracts':
        return <ProcurementModule />;

      case 'invoices':
      case 'payments':
      case 'savings':
      case 'spend-analytics':
        return <FinanceModule />;

      case 'esg':
      case 'risk':
      case 'compliance':
      case 'audit-logs':
        return <RiskComplianceModule />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0F1115] text-gray-900 dark:text-[#E2E8F0] flex overflow-x-hidden max-w-full">
      {/* Visual Collapsible Sidebar Navigation Panel */}
      <Sidebar />

      {/* Main content body viewport panel */}
      <div className="flex-1 flex flex-col pl-14 md:pl-[240px] transition-all duration-200 min-w-0 max-w-full overflow-x-hidden">
        <TopHeader />

        {/* Dynamic page contents template */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 pb-24 overflow-x-hidden">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center h-[50vh]">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            {renderPage()}
          </React.Suspense>
        </main>
      </div>

      {/* Global Modals, Toast dispatchers overlays */}
      <ToastCenter />
      <CmdKPalette />
      <NotificationsPanel />
    </div>
  );
};

export default function App() {
  return (
    <VMSProvider>
      <AppContent />
    </VMSProvider>
  );
}
