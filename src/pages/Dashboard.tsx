import React, { useState, useEffect } from 'react';
import { useVMS, CurrentPage } from '../vmsContext';
import { CATEGORY_COLORS } from '../mockData';
import { spendTrendData } from '../mockData';
import {
  Building2,
  FileText,
  Clock,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  UserPlus,
  ShoppingCart,
  FileSearch,
  Upload,
  Calendar,
  CheckCircle,
  XCircle,
  MinusCircle,
  HelpCircle,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Dashboard: React.FC = () => {
  const {
    vendors,
    purchaseOrders,
    contracts,
    riskAssessments,
    activityLogs,
    setCurrentPage,
    setSelectedVendorId,
    addToast
  } = useVMS();

  // Counting animation simulation states
  const [counts, setCounts] = useState({ vendors: 0, contracts: 0, approvals: 0, spend: 0, risks: 0 });

  // GitHub contributions style state
  const [contributions, setContributions] = useState<Record<string, { count: number; activities: string[] }>>(() => {
    const result: Record<string, { count: number; activities: string[] }> = {};
    // Backwards 371 days
    for (let i = 0; i < 371; i++) {
      const d = new Date(2026, 5, 6 - i);
      const dateStr = d.toISOString().split('T')[0];
      const hash = (i * 2654435761) % 100;
      let count = 0;
      let activities: string[] = [];
      
      if (hash < 12) {
        count = 0;
        activities = [];
      } else if (hash < 50) {
        count = 1;
        activities = ['Routine compliance certificate validation'];
      } else if (hash < 75) {
        count = 3;
        activities = [
          'Vendor risk validation re-score threshold tier-2 approved',
          'Automated PO dispatch dispatch invoice matched',
          'Supplier capability mapping review document signed'
        ];
      } else if (hash < 92) {
        count = 5;
        activities = [
          'Critical vulnerability sanction list screening completed',
          'Contract payment milestones wire clear check done',
          'Sourcing RFP technical evaluation opening open',
          'System backup archival rotate successful key generated',
          'Quality checkup audit tier-1 strategic supplier passed'
        ];
      } else {
        count = 8;
        activities = [
          'Smart AI contract clause validation review',
          'Bulk ISO quality certificate re-scan diagnostics',
          'Vendor financial audit tier-2 clearance checklist',
          'New risk scenario simulation initialized on-the-fly',
          'Tender RFQ proposal evaluation finalized match',
          'BofA disbursement approval handshake clearance',
          'NDA SLA expiration counter configured warning',
          'System logs rotation checkpoint scheduled cron'
        ];
      }
      result[dateStr] = { count, activities };
    }
    return result;
  });
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-06');
  const [newActivityText, setNewActivityText] = useState('');

  useEffect(() => {
    // Count up animation stimulation
    const timer = setTimeout(() => {
      setCounts({
        vendors: 248,
        contracts: 134,
        approvals: 27,
        spend: 4.2,
        risks: 11
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Compute status distributions for Pie chart
  const pieData = [
    { name: 'Active', value: 148, color: '#2563EB' },
    { name: 'Pending', value: 42, color: '#D97706' },
    { name: 'Under Review', value: 31, color: '#7C3AED' },
    { name: 'Inactive', value: 18, color: '#6B7280' },
    { name: 'Blocked', value: 9, color: '#DC2626' }
  ];

  // Table lists filters
  const [poFilter, setPoFilter] = useState<'All' | 'Pending Approval' | 'Approved' | 'Cancelled'>('All');

  // Heatmap quadrant items
  const riskHeatmap = [
    { row: 'Tier 1', col: 'Financial Risk', score: 3.2, level: 'high' },
    { row: 'Tier 1', col: 'Compliance Risk', score: 1.8, level: 'low' },
    { row: 'Tier 1', col: 'Operational Risk', score: 4.1, level: 'critical' },
    { row: 'Tier 1', col: 'Cybersecurity Risk', score: 2.5, level: 'medium' },
    { row: 'Tier 1', col: 'Geopolitical Risk', score: 2.9, level: 'medium' },

    { row: 'Tier 2', col: 'Financial Risk', score: 2.1, level: 'medium' },
    { row: 'Tier 2', col: 'Compliance Risk', score: 3.5, level: 'high' },
    { row: 'Tier 2', col: 'Operational Risk', score: 1.2, level: 'low' },
    { row: 'Tier 2', col: 'Cybersecurity Risk', score: 3.9, level: 'high' },
    { row: 'Tier 2', col: 'Geopolitical Risk', score: 2.2, level: 'medium' },

    { row: 'Tier 3', col: 'Financial Risk', score: 1.1, level: 'low' },
    { row: 'Tier 3', col: 'Compliance Risk', score: 1.5, level: 'low' },
    { row: 'Tier 3', col: 'Operational Risk', score: 2.4, level: 'medium' },
    { row: 'Tier 3', col: 'Cybersecurity Risk', score: 4.5, level: 'critical' },
    { row: 'Tier 3', col: 'Geopolitical Risk', score: 1.7, level: 'low' },
  ];

  const getHeatmapColor = (level: string) => {
    switch (level) {
      case 'low': // #DCFCE7
        return 'bg-emerald-100/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300';
      case 'medium': // #FEF3C7
        return 'bg-amber-100/70 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300';
      case 'high': // #FED7AA
        return 'bg-orange-100/70 dark:bg-orange-950/30 text-orange-850 dark:text-orange-300';
      case 'critical': // #DC2626
        return 'bg-red-100 dark:bg-red-950/40 text-red-750 dark:text-red-300 border border-red-200 dark:border-red-900/50';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const recentPOs = purchaseOrders
    .filter(p => poFilter === 'All' || p.status === poFilter)
    .slice(0, 5);

  const contractRenewals = contracts
    .filter(c => c.status === 'Expiring Soon' || c.daysRemaining < 90)
    .slice(0, 5);

  const topVendorsByScore = [...vendors]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 6);

  return (
    <div className="space-y-6 font-sans">
      {/* 1. TOP KPI CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Vendors */}
        <div className="bg-white dark:bg-[#161B27] p-6 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-500 dark:text-slate-400 font-sans">Total Vendors</span>
            <div className="w-9 h-9 rounded bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-roboto font-extrabold text-[32px] text-gray-900 dark:text-white leading-none">
              {counts.vendors}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-450 flex items-center gap-1 mt-1 font-sans font-semibold">
              ↑ 12 this month
            </span>
          </div>
        </div>

        {/* Card 2: Active Contracts */}
        <div className="bg-white dark:bg-[#161B27] p-6 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-500 dark:text-slate-400 font-sans">Active Contracts</span>
            <div className="w-9 h-9 rounded bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-roboto font-extrabold text-[32px] text-gray-900 dark:text-white leading-none">
              {counts.contracts}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1 mt-1 font-sans font-semibold">
              ↑ 8 renewed
            </span>
          </div>
        </div>

        {/* Card 3: Pending Approvals */}
        <div className="bg-white dark:bg-[#161B27] p-6 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-500 dark:text-slate-400 font-sans">Pending Approvals</span>
            <div className="w-9 h-9 rounded bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-roboto font-extrabold text-[32px] text-gray-900 dark:text-white leading-none">
              {counts.approvals}
            </span>
            <span className="text-xs text-red-500 flex items-center gap-1 mt-1 font-sans font-semibold">
              ↓ 4 from last week
            </span>
          </div>
        </div>

        {/* Card 4: Total Spend MTD */}
        <div className="bg-white dark:bg-[#161B27] p-6 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-500 dark:text-slate-400 font-sans">Spend This Month</span>
            <div className="w-9 h-9 rounded bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-roboto font-extrabold text-[32px] text-gray-900 dark:text-white leading-none">
              ${counts.spend}M
            </span>
            <span className="text-xs text-emerald-650 dark:text-emerald-450 flex items-center gap-1 mt-1 font-sans font-semibold">
              ↑ 6.4% vs last month
            </span>
          </div>
        </div>

        {/* Card 5: Open Risk Issues */}
        <div className="bg-white dark:bg-[#161B27] p-6 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-500 dark:text-slate-400 font-sans">Open Risk Issues</span>
            <div className="w-9 h-9 rounded bg-red-50 dark:bg-red-950/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-650 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-roboto font-extrabold text-[32px] text-gray-900 dark:text-white leading-none">
              {counts.risks}
            </span>
            <span className="text-xs text-red-500/80 dark:text-red-400 flex items-center gap-1 mt-1 font-sans font-semibold">
              3 critical, 8 medium
            </span>
          </div>
        </div>
      </div>

      {/* 2. SECOND ROW: Spend Overview (60%) & Status Distribution (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel: Spend Trend */}
        <div className="bg-white dark:bg-[#161B27] p-6 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[16px] font-semibold text-gray-950 dark:text-white font-sans">Spend Overview</h2>
              <span className="text-xs text-gray-400 dark:text-slate-400 block mt-0.5">Last 12 months · All categories</span>
            </div>
            <button
              onClick={() => setCurrentPage('spend-analytics')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Analyze spend &rarr;
            </button>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" className="hidden dark:block" />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    color: '#FFFFFF'
                  }}
                  itemStyle={{ fontSize: 12 }}
                  labelStyle={{ fontSize: 12, fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="Spend" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Panel: Status Distribution */}
        <div className="bg-white dark:bg-[#161B27] p-6 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[16px] font-semibold text-gray-950 dark:text-white font-sans">Vendor Status</h2>
              <span className="text-xs text-gray-400 dark:text-slate-400 block mt-0.5">Classification Breakdown</span>
            </div>
          </div>
          <div className="flex items-center justify-center h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-roboto font-bold text-[22px] text-gray-900 dark:text-white leading-none">248</span>
              <span className="text-[11px] uppercase text-gray-400 tracking-wider mt-1">Total Vendors</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 max-h-[105px] overflow-y-auto">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs font-sans">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-gray-650 dark:text-slate-400 truncate flex-1">{d.name}</span>
                <span className="font-bold text-gray-905 dark:text-slate-200">{d.value} ({Math.round(d.value / 248 * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. THIRD ROW: Top Performing Vendors | Recent POs | Renewals Due */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Panel A: Top Scoring Vendors */}
        <div className="bg-white dark:bg-[#161B27] p-5 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-gray-150 dark:border-gray-800 pb-2">
              <h3 className="text-[14px] font-semibold text-gray-950 dark:text-slate-200 font-sans uppercase tracking-wide">Top Vendors by Score</h3>
              <button onClick={() => setCurrentPage('performance')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                View All &rarr;
              </button>
            </div>
            <div className="space-y-2.5 max-h-[280px] overflow-y-auto">
              {topVendorsByScore.map((v, i) => (
                <div
                  key={v.id}
                  onClick={() => {
                    setSelectedVendorId(v.id);
                    setCurrentPage('vendor-detail');
                  }}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-800/40 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                      {v.logoInitials}
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <span className="font-bold text-gray-900 dark:text-white block text-[13px] truncate leading-tight">
                        {v.name}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-slate-500 block leading-none truncate mt-1">
                        {v.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-[80px] h-1.5 bg-gray-150 dark:bg-slate-800 rounded overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${v.performanceScore}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {v.performanceScore}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel B: Recent Purchase Orders */}
        <div className="bg-white dark:bg-[#161B27] p-5 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 border-b border-gray-150 dark:border-gray-800 pb-2">
              <h3 className="text-[14px] font-semibold text-gray-950 dark:text-slate-200 font-sans uppercase tracking-wide">Recent POs</h3>
              <div className="flex bg-gray-100 dark:bg-slate-800 p-0.5 rounded gap-0.5 text-[10px] uppercase font-bold">
                {(['All', 'Pending Approval', 'Approved'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPoFilter(tab)}
                    className={`px-2 py-0.5 rounded-sm transition ${
                      poFilter === tab ? 'bg-white dark:bg-[#161B27] text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab === 'Pending Approval' ? 'Pending' : tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-slate-800 max-h-[280px] overflow-y-auto">
              {recentPOs.map((po) => (
                <div
                  key={po.id}
                  onClick={() => setCurrentPage('purchase-orders')}
                  className="py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/40 px-1 cursor-pointer rounded transition"
                >
                  <div className="overflow-hidden pr-3">
                    <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 block font-bold">
                      {po.id}
                    </span>
                    <span className="text-xs text-gray-850 dark:text-slate-100 block font-semibold truncate leading-tight mt-0.5">
                      {po.vendorName}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[13px] font-roboto font-bold text-gray-950 dark:text-white block">
                      ${po.amount.toLocaleString()}
                    </span>
                    <span
                      className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-sm mt-0.5 leading-none ${
                        po.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450'
                          : po.status === 'Received'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-450'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450'
                      }`}
                    >
                      {po.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel C: Upcoming Contract Renewals */}
        <div className="bg-white dark:bg-[#161B27] p-5 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-gray-150 dark:border-gray-800 pb-2">
              <h3 className="text-[14px] font-semibold text-gray-950 dark:text-slate-200 font-sans uppercase tracking-wide">Renewals Due</h3>
              <button onClick={() => setCurrentPage('contracts')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                View All &rarr;
              </button>
            </div>
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {contractRenewals.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setCurrentPage('contracts')}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-800/40 cursor-pointer transition border border-gray-100 dark:border-slate-800"
                >
                  <div className="overflow-hidden min-w-0 pr-2">
                    <span className="font-bold text-gray-900 dark:text-white text-[13px] block truncate leading-tight">
                      {c.vendorName}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 block leading-none truncate mt-1">
                      {c.title}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[12px] font-bold block text-gray-900 dark:text-white font-roboto">
                      ${(c.value / 1000).toFixed(0)}K
                    </span>
                    <span
                      className={`inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm mt-1 leading-none ${
                        c.daysRemaining < 30
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-450'
                          : c.daysRemaining < 90
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450'
                      }`}
                    >
                      {c.daysRemaining} days remaining
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. FOURTH ROW: Risk Heatmap Matrix */}
      <div className="bg-white dark:bg-[#161B27] p-6 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-gray-150 dark:border-gray-800 pb-2">
          <div>
            <h3 className="text-[15px] font-semibold text-gray-950 dark:text-slate-200 font-sans uppercase tracking-wide">
              Risk Heatmap by Vendor Tier
            </h3>
            <span className="text-xs text-gray-400 dark:text-slate-500 font-sans leading-none block mt-1">
              Evaluated financial, cybersecurity, geopolitical and compliance factors across operational quadrants.
            </span>
          </div>
          <button onClick={() => setCurrentPage('risk')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            Compliance matrix &rarr;
          </button>
        </div>

        {/* 5x3 Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[650px] space-y-2">
            {/* Headers row */}
            <div className="grid grid-cols-6 gap-2 text-center text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 font-sans">
              <span className="text-left py-1 capitalize">Quadrant Nodes</span>
              <span className="py-1">Financial Risk</span>
              <span className="py-1">Compliance Risk</span>
              <span className="py-1">Operational Risk</span>
              <span className="py-1">Cybersecurity Risk</span>
              <span className="py-1">Geopolitical Risk</span>
            </div>

            {/* Rows */}
            {['Tier 1', 'Tier 2', 'Tier 3'].map((tier) => (
              <div key={tier} className="grid grid-cols-6 gap-2 items-center">
                <span className="text-xs font-bold text-gray-900 dark:text-white capitalize font-sans">{tier}</span>
                {riskHeatmap
                  .filter((item) => item.row === tier)
                  .map((cell, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-sm flex flex-col items-center justify-center ${getHeatmapColor(
                        cell.level
                      )}`}
                    >
                      <span className="font-roboto font-extrabold text-[15px]">{cell.score}</span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">
                        {cell.level}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center gap-4 mt-4 justify-end text-[11px] text-gray-400 dark:text-slate-500 font-sans select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-100/70 border dark:bg-emerald-950/20" />
            <span>Low Risk (0-2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-100/70 border dark:bg-amber-950/20" />
            <span>Medium Risk (2-3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-orange-100/70 border dark:bg-orange-950/20" />
            <span>High Risk (3-4)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-100 border dark:bg-red-950/40" />
            <span>Critical Risk (4-5)</span>
          </div>
        </div>
      </div>

      {/* Dynamic GitHub Contributions Grid */}
      {(() => {
        const totalDays = 371;
        const cells: { dateStr: string; dayIndex: number; monthLabel: string }[] = [];
        for (let i = totalDays - 1; i >= 0; i--) {
          const d = new Date(2026, 5, 6 - i);
          const dateStr = d.toISOString().split('T')[0];
          const dayIndex = d.getDay();
          const monthLabel = d.toLocaleString('default', { month: 'short' });
          cells.push({ dateStr, dayIndex, monthLabel });
        }

        const columns: { dateStr: string; dayIndex: number; monthLabel: string }[][] = [];
        for (let c = 0; c < 53; c++) {
          columns.push(cells.slice(c * 7, (c + 1) * 7));
        }

        const contribDays = Object.values(contributions) as { count: number; activities: string[] }[];
        const totalOperations = contribDays.reduce((sum, item) => sum + item.count, 0);

        let currentStreak = 0;
        for (let i = 0; i < 371; i++) {
          const d = new Date(2026, 5, 6 - i);
          const dateStr = d.toISOString().split('T')[0];
          const data = contributions[dateStr];
          if (data && data.count > 0) {
            currentStreak++;
          } else {
            break;
          }
        }

        return (
          <div className="bg-white dark:bg-[#161B27] p-5 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm space-y-4 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 border-gray-150 dark:border-gray-800">
              <div>
                <h3 className="text-[13px] font-black text-gray-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500 animate-pulse" /> Platform Operations Activity Ledger
                </h3>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 block mt-0.5">
                  Interactive real-time visual tracking grid indicating day-to-day compliance check-ups, purchases, and audit activities.
                </span>
              </div>
              <div className="flex gap-4 mt-2 sm:mt-0 font-mono text-[10.5px]">
                <div>
                  <span className="text-gray-400 dark:text-gray-500 block text-[9px] uppercase leading-none font-bold">ANNUAL TASKS</span>
                  <strong className="text-sm font-black text-gray-900 dark:text-white mt-1 block leading-none">{totalOperations.toLocaleString()}</strong>
                </div>
                <div className="border-l pl-4 border-gray-200 dark:border-gray-800">
                  <span className="text-gray-400 dark:text-gray-500 block text-[9px] uppercase leading-none font-bold font-sans">ACTIVE STREAK</span>
                  <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1 block leading-none flex items-center gap-1 font-sans">
                    🔥 {currentStreak} Days
                  </strong>
                </div>
              </div>
            </div>

            {/* Scrollable grid card */}
            <div className="overflow-x-auto scrollbar-thin pb-2">
              <div className="min-w-[760px] flex gap-2">
                {/* Days of week */}
                <div className="flex flex-col justify-between text-[9px] font-bold font-mono text-gray-400 dark:text-slate-500 select-none pr-1.5 py-0.5 h-[88px] w-6 text-right leading-none">
                  <span>Sun</span>
                  <span>Tue</span>
                  <span>Thu</span>
                  <span>Sat</span>
                </div>

                {/* Columns array */}
                <div className="flex gap-[3.5px]">
                  {columns.map((col, cIdx) => (
                    <div key={cIdx} className="flex flex-col gap-[3.5px]">
                      {col.map((cell, rIdx) => {
                        const data = contributions[cell.dateStr] || { count: 0, activities: [] };
                        const cellCount = data.count;

                        // Grid BG Density Map
                        let cellBg = 'bg-gray-100 dark:bg-slate-800/50';
                        if (cellCount > 0 && cellCount <= 2) cellBg = 'bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300/10';
                        else if (cellCount > 2 && cellCount <= 4) cellBg = 'bg-emerald-200 dark:bg-emerald-900/60 border border-emerald-300/20';
                        else if (cellCount > 4 && cellCount <= 6) cellBg = 'bg-emerald-400 dark:bg-emerald-700/60';
                        else if (cellCount > 6) cellBg = 'bg-emerald-500 dark:bg-emerald-500';

                        const isSelected = selectedDate === cell.dateStr;

                        return (
                          <button
                            key={rIdx}
                            onClick={() => setSelectedDate(cell.dateStr)}
                            className={`w-[10px] h-[10px] rounded-[1.5px] transition-all cursor-pointer relative block ${cellBg} ${
                              isSelected
                                ? 'ring-2 ring-indigo-550 dark:ring-indigo-400 scale-125 z-10'
                                : 'hover:scale-125 hover:ring-[1px] hover:ring-indigo-400'
                            }`}
                            title={`${cell.dateStr} · ${cellCount} activity files logged`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-slate-500 pt-2 select-none font-sans">
                <span className="italic">Click map squares to view dynamic operational details or append manual checks. Current Operations Base: 2026-06-06.</span>
                <div className="flex items-center gap-1 font-mono">
                  <span>Less</span>
                  <span className="w-2.5 h-2.5 rounded-[1px] bg-gray-100 dark:bg-slate-800/50" />
                  <span className="w-2.5 h-2.5 rounded-[1px] bg-emerald-100 dark:bg-emerald-950/40" />
                  <span className="w-2.5 h-2.5 rounded-[1px] bg-emerald-250 dark:bg-emerald-900/60" />
                  <span className="w-2.5 h-2.5 rounded-[1px] bg-emerald-400 dark:bg-emerald-700/60" />
                  <span className="w-2.5 h-2.5 rounded-[1px] bg-emerald-500" />
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* Inspect details drawer panel */}
            <div className="p-3 bg-gray-50/60 dark:bg-slate-900/30 rounded border border-gray-150 dark:border-gray-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-sans">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[9.5px] text-indigo-650 dark:text-blue-400 uppercase tracking-widest font-mono font-sans">INSPECTING DATE TARGET</span>
                  <span className="px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800 font-extrabold rounded font-mono text-[10.5px] text-gray-800 dark:text-slate-300">
                    {selectedDate}
                  </span>
                  <span className="text-[10px] text-gray-405 font-mono">
                    ({(contributions[selectedDate]?.count || 0)} operations logged)
                  </span>
                </div>

                <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1 scrollbar-thin">
                  {!(contributions[selectedDate]?.activities?.length) ? (
                    <p className="text-gray-450 dark:text-gray-500 italic text-[11px] py-1">No custom activities logged for this simulation slot.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                      {contributions[selectedDate].activities.map((act, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[10.5px] text-gray-750 dark:text-gray-300">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                          <span className="truncate" title={act}>{act}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newActivityText.trim()) return;

                  setContributions(prev => {
                    const current = prev[selectedDate] || { count: 0, activities: [] };
                    return {
                      ...prev,
                      [selectedDate]: {
                        count: current.count + 1,
                        activities: [...current.activities, newActivityText.trim()]
                      }
                    };
                  });

                  addToast('success', 'Logged Activity Ledger', `Custom action added successfully to ${selectedDate}.`);
                  setNewActivityText('');
                }}
                className="flex gap-2 items-center flex-shrink-0"
              >
                <input
                  type="text"
                  placeholder="Insert custom operation log..."
                  className="p-1 px-2.5 h-[32px] border dark:border-gray-700 rounded bg-white dark:bg-slate-900 outline-none w-[200px] text-xs text-gray-800 dark:text-white"
                  value={newActivityText}
                  onChange={(e) => setNewActivityText(e.target.value)}
                />
                <button
                  type="submit"
                  className="h-[32px] px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded flex items-center gap-1 uppercase text-[10px] tracking-wider cursor-pointer font-sans"
                >
                  + Append
                </button>
              </form>
            </div>
          </div>
        );
      })()}

      {/* 5. BOTTOM ROW: Recent Activity Feed (60%) & Quick Actions (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Activity Feed */}
        <div className="bg-white dark:bg-[#161B27] p-5 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm lg:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-150 dark:border-gray-800 pb-2">
              <h3 className="text-[14px] font-semibold text-gray-950 dark:text-slate-200 font-sans uppercase tracking-wide">Recent Activity Feed</h3>
              <button onClick={() => setCurrentPage('audit-logs')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Audit logs &rarr;
              </button>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {activityLogs.slice(0, 7).map((log) => (
                <div key={log.id} className="flex gap-3 text-xs items-start">
                  <div className="mt-0.5">
                    {log.status === 'Success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 font-sans">
                    <p className="text-gray-800 dark:text-slate-200 leading-normal">
                      <strong>{log.user}</strong> {log.description.replace(`${log.user} systematically `, '')}
                    </p>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 block">
                      {log.timestamp} · IP: {log.ipAddress} · Module: {log.module}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions (40%) - 2x3 Grid */}
        <div className="bg-white dark:bg-[#161B27] p-5 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-[14px] font-semibold text-gray-950 dark:text-slate-200 font-sans uppercase tracking-wide">Quick Action Board</h3>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 block mt-0.5">Accelerate key management modules directly</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Add New Vendor */}
            <button
              onClick={() => {
                setCurrentPage('onboarding');
                addToast('info', 'Onboarding Action Triggered', 'Launched new vendor request pipeline.');
              }}
              className="h-[80px] border border-blue-100 hover:border-blue-400 dark:border-slate-800/80 bg-blue-50/10 hover:bg-blue-50/30 dark:bg-slate-900/10 dark:hover:bg-slate-800/40 rounded flex flex-col items-center justify-center transition p-2 cursor-pointer gap-1.5 group"
            >
              <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition" />
              <span className="text-[11.5px] font-semibold text-blue-700 dark:text-blue-300 font-sans leading-none">Add New Vendor</span>
            </button>

            {/* Create Purchase Order */}
            <button
              onClick={() => {
                setCurrentPage('purchase-orders');
                addToast('info', 'PO Action Triggered', 'Launched Purchase Orders wizard.');
              }}
              className="h-[80px] border border-emerald-100 hover:border-emerald-400 dark:border-slate-800/80 bg-emerald-50/10 hover:bg-emerald-50/30 dark:bg-slate-900/10 dark:hover:bg-slate-800/40 rounded flex flex-col items-center justify-center transition p-2 cursor-pointer gap-1.5 group"
            >
              <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition" />
              <span className="text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-300 font-sans leading-none">Create PO</span>
            </button>

            {/* Generate RFQ */}
            <button
              onClick={() => {
                setCurrentPage('rfq');
                addToast('info', 'RFQ Action Triggered', 'Launched RFQ sourcing tender wizard.');
              }}
              className="h-[80px] border border-cyan-100 hover:border-cyan-400 dark:border-slate-800/80 bg-cyan-50/10 hover:bg-cyan-50/30 dark:bg-slate-900/10 dark:hover:bg-slate-800/40 rounded flex flex-col items-center justify-center transition p-2 cursor-pointer gap-1.5 group"
            >
              <FileSearch className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition" />
              <span className="text-[11.5px] font-semibold text-cyan-700 dark:text-cyan-300 font-sans leading-none">Generate RFQ</span>
            </button>

            {/* Upload Document */}
            <button
              onClick={() => {
                setCurrentPage('compliance');
                addToast('info', 'Document Action Triggered', 'Opened compliance file catalog module.');
              }}
              className="h-[80px] border border-amber-100 hover:border-amber-400 dark:border-slate-800/80 bg-amber-50/10 hover:bg-amber-50/30 dark:bg-slate-900/10 dark:hover:bg-slate-800/40 rounded flex flex-col items-center justify-center transition p-2 cursor-pointer gap-1.5 group"
            >
              <Upload className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition" />
              <span className="text-[11.5px] font-semibold text-amber-700 dark:text-amber-300 font-sans leading-none">Archive Doc</span>
            </button>

            {/* Run Risk Assessment */}
            <button
              onClick={() => {
                setCurrentPage('risk');
                addToast('info', 'Risk Audit Triggered', 'Launched risk diagnostics matrix.');
              }}
              className="h-[80px] border border-red-100 hover:border-red-400 dark:border-slate-800/80 bg-red-50/10 hover:bg-red-50/30 dark:bg-slate-900/10 dark:hover:bg-red-800/20 rounded flex flex-col items-center justify-center transition p-2 cursor-pointer gap-1.5 group"
            >
              <ShieldAlert className="w-5 h-5 text-red-650 dark:text-red-400 group-hover:scale-105 transition" />
              <span className="text-[11.5px] font-semibold text-red-700 dark:text-red-300 font-sans leading-none">Risk Assess</span>
            </button>

            {/* Schedule Audit */}
            <button
              onClick={() => {
                setCurrentPage('calendar');
                addToast('info', 'Alert Calendar Displayed', 'Opened planning schedule.');
              }}
              className="h-[80px] border border-purple-100 hover:border-purple-400 dark:border-slate-800/80 bg-purple-50/10 hover:bg-purple-50/30 dark:bg-slate-900/10 dark:hover:bg-slate-800/40 rounded flex flex-col items-center justify-center transition p-2 cursor-pointer gap-1.5 group"
            >
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition" />
              <span className="text-[11.5px] font-semibold text-purple-700 dark:text-purple-300 font-sans leading-none">Schedule Audit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
