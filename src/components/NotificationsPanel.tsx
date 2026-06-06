import React, { useState } from 'react';
import { useVMS } from '../vmsContext';
import { Bell, X, ShieldAlert, FileText, ShoppingCart, CheckCircle, Clock, Settings } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'alert' | 'approval' | 'system' | 'general';
  title: string;
  desc: string;
  time: string;
  read: boolean;
  meta?: string;
}

export const NotificationsPanel: React.FC = () => {
  const { notificationPanelOpen, setNotificationPanelOpen, addToast, setCurrentPage } = useVMS();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'alerts' | 'approvals' | 'system'>('all');
  const [items, setItems] = useState<NotificationItem[]>([
    { id: '1', type: 'approval', title: 'Approval Required', desc: 'PO-2026-004 requires secondary authorization from Procurement Manager.', time: '10 mins ago', read: false },
    { id: '2', type: 'alert', title: 'Contract Expiring Soon', desc: 'Master agreement with Apex Technologies is due for renewal in 44 days.', time: '2 hours ago', read: false, meta: 'CTR-2025-1001' },
    { id: '3', type: 'alert', title: 'Critical Risk Alert', desc: 'Vanguard Industrial showed a drop in cybersecurity compliance standards.', time: '4 hours ago', read: false, meta: 'VND-007' },
    { id: '4', type: 'system', title: 'System Compliance Verification', desc: 'SOC2 checklist and certificates matching complete for Swift Delivery.', time: '1 day ago', read: true },
    { id: '5', type: 'general', title: 'Invoice Processed', desc: 'Finance released $42,500 fund block to Meridian Supplies Inc.', time: '2 days ago', read: true }
  ]);

  if (!notificationPanelOpen) return null;

  const handleMarkAllRead = () => {
    setItems(prev => prev.map(item => ({ ...item, read: true })));
    addToast('success', 'Inbox Cleared', 'All outstanding notifications marked as read.');
  };

  const handleToggleRead = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, read: !item.read } : item));
  };

  const filteredItems = items.filter(item => {
    if (activeTab === 'unread') return !item.read;
    if (activeTab === 'alerts') return item.type === 'alert';
    if (activeTab === 'approvals') return item.type === 'approval';
    if (activeTab === 'system') return item.type === 'system';
    return true;
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/45 dark:bg-black/60 transition-opacity duration-200"
        onClick={() => setNotificationPanelOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-[#161B27] border-l border-gray-200 dark:border-[#1F2937] shadow-[0_24px_80px_rgba(0,0,0,0.25)] z-50 flex flex-col font-sans animate-slide-left duration-200">
        {/* Header */}
        <div className="h-[60px] border-b border-gray-100 dark:border-[#1F2937] px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-[16px] font-semibold text-gray-900 dark:text-white font-sans">Notifications</h2>
            {items.some(i => !i.read) && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {items.filter(i => !i.read).length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Mark all read
            </button>
            <button
              onClick={() => setCurrentPage('settings')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              title="Notification Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setNotificationPanelOpen(false)}
              className="text-gray-400 hover:text-gray-650 dark:hover:text-[#CBD5E1]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-gray-100 dark:border-[#1F2937] bg-gray-50/50 dark:bg-[#0c1221]/50">
          {(['all', 'unread', 'alerts', 'approvals', 'system'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-3 text-[11px] font-semibold uppercase tracking-wider relative transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-150 dark:divide-gray-800">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center px-6">
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200">No notifications</h3>
              <p className="text-xs text-gray-550 dark:text-slate-400 mt-1">There are no outstanding updates or alerts in this mailbox.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const bgClass = item.read ? 'bg-white dark:bg-[#161B27]' : 'bg-blue-50/20 dark:bg-blue-900/10';
              return (
                <div
                  key={item.id}
                  className={`p-4 flex items-start gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/40 relative group ${bgClass}`}
                >
                  {/* Icon section */}
                  <div className="mt-0.5 flex-shrink-0">
                    {item.type === 'alert' && (
                      <div className="w-[32px] h-[32px] bg-yellow-50 dark:bg-yellow-900/20 rounded flex items-center justify-center">
                        <ShieldAlert className="w-[16px] h-[16px] text-yellow-600 dark:text-yellow-400" />
                      </div>
                    )}
                    {item.type === 'approval' && (
                      <div className="w-[32px] h-[32px] bg-[#EDE9FE] dark:bg-purple-900/20 rounded flex items-center justify-center">
                        <Clock className="w-[16px] h-[16px] text-[#7C3AED] dark:text-purple-400" />
                      </div>
                    )}
                    {item.type === 'system' && (
                      <div className="w-[32px] h-[32px] bg-emerald-50 dark:bg-emerald-900/20 rounded flex items-center justify-center">
                        <CheckCircle className="w-[16px] h-[16px] text-emerald-600 dark:text-emerald-400" />
                      </div>
                    )}
                    {item.type === 'general' && (
                      <div className="w-[32px] h-[32px] bg-[#EFF6FF] dark:bg-blue-900/20 rounded flex items-center justify-center">
                        <FileText className="w-[16px] h-[16px] text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                  </div>

                  {/* Body text */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-start justify-between">
                      <h4 className="text-[13px] font-semibold text-gray-900 dark:text-slate-100 font-sans leading-tight">
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-normal font-sans">
                      {item.desc}
                    </p>
                    <span className="text-[11px] text-gray-400 dark:text-slate-500 block mt-2 font-sans">
                      {item.time}
                    </span>
                  </div>

                  {/* Context Actions */}
                  <button
                    onClick={() => handleToggleRead(item.id)}
                    className="absolute top-4 right-4 text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {item.read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-[#0c1221]">
          <button
            onClick={() => {
              setCurrentPage('dashboard');
              setNotificationPanelOpen(false);
              addToast('info', 'Workspace Synced', 'Transferred to audit overview dashboard.');
            }}
            className="w-full text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline py-1"
          >
            Go to dashboard notifications centre &rarr;
          </button>
        </div>
      </div>
    </>
  );
};
