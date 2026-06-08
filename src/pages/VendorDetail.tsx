import React, { useState, useMemo } from 'react';
import { useVMS } from '../vmsContext';
import { CATEGORY_COLORS } from '../mockData';
import {
  Building2,
  ChevronLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingCart,
  FileText,
  Activity,
  Star,
  Users,
  ShieldCheck,
  AlertTriangle,
  FolderOpen,
  Plus,
  ArrowRight,
  ShieldAlert,
  Loader,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

export const VendorDetail: React.FC = () => {
  const {
    selectedVendorId,
    setSelectedVendorId,
    setCurrentPage,
    vendors,
    purchaseOrders,
    contracts,
    invoices,
    riskAssessments,
    complianceDocs,
    activityLogs,
    addToast,
    toggleCompareVendor
  } = useVMS();

  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'contracts' | 'pos' | 'invoices' | 'risk' | 'docs' | 'activity'>('overview');

  // Look up current entity
  const vendor = useMemo(() => {
    return vendors.find((v) => v.id === selectedVendorId) || vendors[0];
  }, [vendors, selectedVendorId]);

  // If no vendor found or selected
  if (!vendor) {
    return (
      <div className="py-16 text-center font-sans bg-white border p-6 rounded">
        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-gray-800">No active profile node highlighted</h4>
        <button onClick={() => setCurrentPage('vendors')} className="mt-4 px-3 py-1.5 bg-blue-600 text-white rounded font-sans text-xs">
          Return to directory
        </button>
      </div>
    );
  }

  const catColors = CATEGORY_COLORS[vendor.category] || CATEGORY_COLORS['Other'];

  // Relational lookups matching current vendor:
  const vendorContracts = contracts.filter((c) => c.vendorId === vendor.id);
  const vendorPOs = purchaseOrders.filter((p) => p.vendorId === vendor.id);
  const vendorInvoices = invoices.filter((i) => i.vendorId === vendor.id);
  const vendorRisk = riskAssessments.find((r) => r.vendorId === vendor.id);
  const vendorDocs = complianceDocs.filter((d) => d.vendorId === vendor.id);
  const vendorLogs = activityLogs.filter((l) => l.entityId === vendor.id);

  // Performance history details
  const performanceHistoryData = [
    { month: 'Jan', Score: vendor.performanceScore - 4, Benchmark: 80, IndustryAvg: 74 },
    { month: 'Feb', Score: vendor.performanceScore - 3, Benchmark: 80, IndustryAvg: 74 },
    { month: 'Mar', Score: vendor.performanceScore - 2, Benchmark: 80, IndustryAvg: 75 },
    { month: 'Apr', Score: vendor.performanceScore + 1, Benchmark: 80, IndustryAvg: 75 },
    { month: 'May', Score: vendor.performanceScore, Benchmark: 80, IndustryAvg: 76 },
    { month: 'Jun', Score: vendor.performanceScore + 2, Benchmark: 80, IndustryAvg: 76 }
  ];

  // Radar chart dimensions
  const radarData = [
    { subject: 'Quality', A: vendor.performanceScore - 2, B: 75, fullMark: 100 },
    { subject: 'Reliability', A: vendor.performanceScore + 1, B: 74, fullMark: 100 },
    { subject: 'Pricing', A: vendor.performanceScore - 4, B: 72, fullMark: 100 },
    { subject: 'Communication', A: vendor.performanceScore + 5, B: 78, fullMark: 100 },
    { subject: 'Compliance', A: vendor.performanceScore + 2, B: 80, fullMark: 100 },
    { subject: 'Innovation', A: vendor.performanceScore - 1, B: 70, fullMark: 100 }
  ];

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500';
      case 'Pending': return 'bg-amber-500';
      case 'Under Review': return 'bg-purple-500';
      case 'Inactive': return 'bg-gray-400';
      case 'Blocked': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getRiskColorName = (overall: number) => {
    if (overall < 40) return 'text-emerald-600 dark:text-emerald-450';
    if (overall < 70) return 'text-amber-600 dark:text-amber-450';
    return 'text-red-650 dark:text-red-400';
  };

  return (
    <div className="pt-14 space-y-6 font-sans">
      {/* Top Breadcrumb Navigation Trigger */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('vendors')}
          className="text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-900 flex items-center gap-1 bg-white dark:bg-[#161B27] p-2 pl-2 rounded-sm border dark:border-[#1F2937] hover:shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Directory
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toggleCompareVendor(vendor.id);
              addToast('info', 'Comparison State modified', `Added ${vendor.name} to sidebar comparing cache.`);
            }}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-600 hover:bg-blue-50/70 p-2 rounded-sm"
          >
            Compare with Another Provider
          </button>
          <button
            onClick={() => {
              alert(`Spawning document edit module targeting ${vendor.id}`);
            }}
            className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-sm px-4"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Panel grid: Left 340px info sidebar | Right Content viewport panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* LEFT COMPACT INFO PANEL */}
        <div className="xl:col-span-1 bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800/80 shadow-sm rounded-md p-6 space-y-6">
          {/* Avatar and central branding */}
          <div className="text-center space-y-3 relative">
            <div className="relative inline-block">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-roboto font-black text-xl border-2 border-white dark:border-[#161B27] shadow uppercase select-none">
                {vendor.logoInitials}
              </div>
              <span className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#161B27] ${getStatusDot(vendor.status)}`} />
            </div>

            <div>
              <h2 className="font-roboto font-bold text-lg text-gray-950 dark:text-white leading-tight">
                {vendor.name}
              </h2>
              <span className="text-xs text-gray-400 dark:text-slate-500 block mt-1 font-mono">{vendor.id}</span>
            </div>

            <div className="flex justify-center gap-1.5">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${catColors.bg} ${catColors.text}`}>
                {vendor.category}
              </span>
              <span className="inline-block text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-slate-200 px-2 rounded">
                {vendor.tier}
              </span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-800/80" />

          {/* Details Fields */}
          <div className="space-y-4 text-xs font-sans">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans pb-1">Legal Details</h4>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-400 block col-span-1">Country:</span>
              <span className="text-gray-800 dark:text-slate-200 font-semibold block col-span-2 truncate">{vendor.country}</span>

              <span className="text-gray-400 block col-span-1">City/State:</span>
              <span className="text-gray-800 dark:text-slate-200 font-semibold block col-span-2 truncate">{vendor.city}, {vendor.state}</span>

              <span className="text-gray-400 block col-span-1">Address:</span>
              <span className="text-gray-805 dark:text-slate-100 font-semibold block col-span-2 leading-relaxed" title={vendor.address}>
                {vendor.address}
              </span>

              <span className="text-gray-400 block col-span-1">Website:</span>
              <a href={vendor.website} target="_blank" rel="referrer" className="text-blue-600 hover:underline block col-span-2 truncate">{vendor.website}</a>

              <span className="text-gray-400 block col-span-1">Tax Code:</span>
              <span className="text-gray-800 dark:text-slate-200 font-mono font-bold block col-span-2">{vendor.taxId}</span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-800/80" />

          {/* Contacts details list */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Assigned Contacts</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50/50 dark:bg-slate-850/20 border rounded space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-gray-900 dark:text-slate-200 block">Sarah Jenkins</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold px-1 py-0.5 rounded leading-none">Primary</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-gray-600 dark:text-slate-300">
                  <a href={`mailto:${vendor.email}`} className="flex items-center gap-1.5 hover:underline text-gray-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400">
                    <Mail className="w-3.5 h-3.5 text-gray-400 dark:text-slate-400" />
                    {vendor.email}
                  </a>
                  <a href={`tel:${vendor.phone}`} className="flex items-center gap-1.5 hover:underline text-gray-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400">
                    <Phone className="w-3.5 h-3.5 text-gray-400 dark:text-slate-400" />
                    {vendor.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COMPLEX MULTI-TAB VIEWPORT PANEL */}
        <div className="xl:col-span-3 space-y-6">
          {/* Navigation Tab Pills row */}
          <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800/80 p-0.5 shadow-sm rounded-md flex overflow-x-auto gap-0.5 scrollbar-thin">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'performance', label: 'Performance' },
                { id: 'contracts', label: 'Contracts' },
                { id: 'pos', label: 'Purchase Orders' },
                { id: 'invoices', label: 'Invoices' },
                { id: 'risk', label: 'Risk & Compliance' },
                { id: 'docs', label: 'Documents' },
                { id: 'activity', label: 'Activity Log' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-[12px] font-semibold whitespace-nowrap uppercase tracking-wider rounded-sm transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW COMPONENT */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats highlights row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#161B27] border rounded-md p-4 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Purchase Orders</span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="font-roboto font-bold text-xl text-gray-950 dark:text-white">{vendorPOs.length}</span>
                    <span className="text-xs text-gray-450 font-medium">all-time</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#161B27] border rounded-md p-4 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Historical Spend</span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="font-roboto font-bold text-xl text-gray-950 dark:text-white">${vendor.contractValue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#161B27] border rounded-md p-4 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Active Contracts</span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="font-roboto font-bold text-xl text-gray-950 dark:text-white">{vendorContracts.length}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#161B27] border rounded-md p-4 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Performance Average</span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="font-roboto font-bold text-xl text-emerald-650 dark:text-emerald-400">{vendor.performanceScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Vendor general notes paragraphs */}
              <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800/80 p-6 rounded-md shadow-sm space-y-4 font-sans text-xs">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Business Description Covenants</h3>
                <p className="text-gray-500 dark:text-slate-400 leading-relaxed max-w-4xl">
                  {vendor.name} represents a key, strategic alignment asset for VendorFlow operations. Officially onboarded on {vendor.registeredDate} by {vendor.onboardedBy}, this entity contributes to operations across the {vendor.category} cluster. Dedicated lines of support and active response pathways remain under key review monitors.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-slate-200 uppercase tracking-wide text-[11px] mb-2">Corporate Information</h4>
                    <div className="space-y-2 text-gray-550 dark:text-slate-400">
                      <p><strong>Business Type:</strong> Corporation Private</p>
                      <p><strong>Registry Status:</strong> Verified</p>
                      <p><strong>Employees:</strong> 420+ globally</p>
                      <p><strong>Fiscal Start Period:</strong> Q1 January</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-slate-200 uppercase tracking-wide text-[11px] mb-2">Payment terms & credit</h4>
                    <div className="space-y-2 text-gray-550 dark:text-slate-400">
                      <p><strong>Standard Payment Term:</strong> Net 30 Covenants</p>
                      <p><strong>Credit Limits authorized:</strong> $1,500,000.00 USD</p>
                      <p><strong>Billing Currency:</strong> USD ($)</p>
                      <p><strong>Account Holder:</strong> Corporate Treasury Block</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERFORMANCE DETAILED ANALYTICS (Charts & Radar) */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Score progression chart (Line) (60%) */}
                <div className="bg-white dark:bg-[#161B27] border p-5 rounded shadow-sm lg:col-span-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">6 Month Performance Tracking</h3>
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceHistoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:hidden" />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" className="hidden dark:block" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[50, 100]} />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '4px', color: '#FFF' }}
                        />
                        <Line type="monotone" dataKey="Score" stroke="#2563EB" strokeWidth={3} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Benchmark" stroke="#D97706" strokeWidth={1} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radar Chart (40%) */}
                <div className="bg-white dark:bg-[#161B27] border p-5 rounded shadow-sm lg:col-span-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Metric Dimensions Evaluation</h3>
                  <div className="h-[240px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#E5E7EB" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar name={vendor.name} dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
                        <Radar name="Industry Avg" dataKey="B" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0} strokeDasharray="3 3" />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Operations metrics score cards items */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-gray-50/65 dark:bg-slate-850/20 p-3.5 border rounded-md text-center">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">On-time Delivery</span>
                  <strong className="text-base text-gray-900 dark:text-white block mt-1 font-mono">94.8%</strong>
                  <span className="text-[9px] text-emerald-600 font-semibold block mt-1">SLA Compliant</span>
                </div>
                <div className="bg-gray-50/65 dark:bg-slate-850/20 p-3.5 border rounded-md text-center">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Defect rate</span>
                  <strong className="text-base text-gray-900 dark:text-white block mt-1 font-mono">0.64%</strong>
                  <span className="text-[9px] text-emerald-600 font-semibold block mt-1">Excellent &lt;1.5%</span>
                </div>
                <div className="bg-gray-50/65 dark:bg-slate-850/20 p-3.5 border rounded-md text-center">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Response time</span>
                  <strong className="text-base text-gray-900 dark:text-white block mt-1 font-mono">3.2 hrs</strong>
                  <span className="text-[9px] text-emerald-600 font-semibold block mt-1">Target achieved</span>
                </div>
                <div className="bg-gray-50/65 dark:bg-slate-850/20 p-3.5 border rounded-md text-center">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Invoice Accuracy</span>
                  <strong className="text-base text-gray-900 dark:text-white block mt-1 font-mono">99.1%</strong>
                  <span className="text-[9px] text-emerald-600 font-semibold block mt-1">Zero discrepancies</span>
                </div>
                <div className="bg-gray-50/65 dark:bg-slate-850/20 p-3.5 border rounded-md text-center">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Price Variance</span>
                  <strong className="text-base text-gray-900 dark:text-white block mt-1 font-mono">-1.85%</strong>
                  <span className="text-[9px] text-emerald-600 font-semibold block mt-1">Cost savings</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEGAL CONTRACTS DIRECTORY */}
          {activeTab === 'contracts' && (
            <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm overflow-hidden text-xs">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50/40 dark:bg-slate-900/10">
                <h3 className="font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">Covenants agreements list</h3>
                <button
                  onClick={() => {
                    alert('Drafting legal contract checklist index.');
                    setCurrentPage('contracts');
                  }}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 font-semibold text-white text-[11px] rounded"
                >
                  Create New Contract
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-widest border-b font-sans">
                  <tr>
                    <th className="p-3 pl-4">Contract ID</th>
                    <th className="p-3">Title Title</th>
                    <th className="p-3 text-right">Value Base</th>
                    <th className="p-3">Period Date</th>
                    <th className="p-3">Days</th>
                    <th className="p-3">Assigned Legal</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-slate-700 dark:text-slate-200">
                  {vendorContracts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">Zero active items in draft directory folder.</td>
                    </tr>
                  ) : (
                    vendorContracts.map((con) => (
                      <tr key={con.id} className="hover:bg-gray-55/10 dark:hover:bg-slate-800/10 transition">
                        <td className="p-3 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">{con.id}</td>
                        <td className="p-3 font-semibold">{con.title}</td>
                        <td className="p-3 text-right font-mono font-bold">${con.value.toLocaleString()}</td>
                        <td className="p-3 text-gray-500">{con.startDate} to {con.endDate}</td>
                        <td className="p-3 font-mono font-bold">{con.daysRemaining} remaining</td>
                        <td className="p-3">{con.owner}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            con.status === 'Active' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-850'
                          }`}>
                            {con.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: PURCHASE ORDERS (PO tracker) */}
          {activeTab === 'pos' && (
            <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm overflow-hidden text-xs">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50/45">
                <h3 className="font-bold text-gray-900 dark:text-slate-150 uppercase tracking-wider text-[11px]">Dispatched Purchase Orders ({vendorPOs.length})</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-widest border-b">
                  <tr>
                    <th className="p-3 pl-4">PO Code ID</th>
                    <th className="p-3">Order Description</th>
                    <th className="p-3 text-right">Balance</th>
                    <th className="p-3">Created Month</th>
                    <th className="p-3">Target Date</th>
                    <th className="p-3 text-center">Fulfill status</th>
                    <th className="p-3">Invoice match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-slate-700 dark:text-slate-200">
                  {vendorPOs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">Zero purchase requisitions compiled.</td>
                    </tr>
                  ) : (
                    vendorPOs.map((po) => (
                      <tr key={po.id} className="hover:bg-gray-50/30 transition cursor-pointer" onClick={() => setCurrentPage('purchase-orders')}>
                        <td className="p-3 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">{po.id}</td>
                        <td className="p-3 font-semibold truncate max-w-[200px]">{po.title}</td>
                        <td className="p-3 text-right font-mono font-bold">${po.amount.toLocaleString()}</td>
                        <td className="p-3 text-gray-500">{po.createdDate}</td>
                        <td className="p-3">{po.requiredBy}</td>
                        <td className="p-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            po.status === 'Received' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                          }`}>
                            {po.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] uppercase font-bold text-slate-500">{po.paymentStatus}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: FINANCIAL INVOICES */}
          {activeTab === 'invoices' && (
            <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm overflow-hidden text-xs">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50/45 text-xs text-gray-800 font-bold">
                Invoice Ledger list
              </div>
              <table className="w-full text-left">
                <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-widest border-b">
                  <tr>
                    <th className="p-3 pl-4">Invoice Reference</th>
                    <th className="p-3">PO matching Reference</th>
                    <th className="p-3 text-right">Billing amount</th>
                    <th className="p-3">Post Date</th>
                    <th className="p-3">Clear Limit</th>
                    <th className="p-3">Covenants status</th>
                    <th className="p-3">Balance clear status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-slate-700 dark:text-slate-200">
                  {vendorInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">Zero registered billing documents filed on entity.</td>
                    </tr>
                  ) : (
                    vendorInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50/30 transition cursor-pointer" onClick={() => setCurrentPage('invoices')}>
                        <td className="p-3 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">{inv.id}</td>
                        <td className="p-3 font-mono">{inv.poReference}</td>
                        <td className="p-3 text-right font-mono font-bold">${inv.total.toLocaleString()}</td>
                        <td className="p-3 text-gray-500">{inv.invoiceDate}</td>
                        <td className="p-3 text-gray-500">{inv.dueDate}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-800 font-black' : 'bg-orange-50 text-orange-900 border'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold uppercase font-mono text-[10px]">{inv.paymentStatus}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: SECURITY RISK & REGULATORY COMPLIANCE CHECKS */}
          {activeTab === 'risk' && (
            <div className="space-y-6">
              {/* Semicircle risk indicator and scoring factors split */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Semicircle HTML/CSS visual scoreboard (40%) */}
                <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm p-6 flex flex-col items-center justify-between md:col-span-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Calculated risk audit score</h3>
                  <div className="relative flex items-center justify-center h-[120px] w-[180px] overflow-hidden mt-4">
                    {/* HTML Semicircle display ring */}
                    <div className="absolute w-[180px] h-[180px] rounded-full border-[10px] border-emerald-500 border-b-transparent border-r-transparent transform -rotate-45" />
                    <div className="absolute w-[180px] h-[180px] rounded-full border-[10px] border-gray-150 border-b-transparent border-r-transparent transform rotate-[45deg]" />
                    <div className="absolute bottom-0 text-center select-none pt-4">
                      <span className={`font-roboto font-black text-[22px] block ${getRiskColorName(vendor.riskScore)}`}>
                        {vendor.riskScore}/100
                      </span>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Overall score</span>
                    </div>
                  </div>
                  <p className="text-[11.5px] mt-2 font-semibold text-gray-400 text-center max-w-[200px]">
                    Higher numbers indicate high risk profiles.
                  </p>
                </div>

                {/* Scoring factors grid (60%) */}
                <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm p-5 md:col-span-3 space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Compliance metrics check scorecard</h3>
                  <div className="divide-y divide-gray-100 dark:divide-slate-800 text-xs text-gray-700 dark:text-slate-300">
                    <div className="py-2.5 flex justify-between items-center">
                      <span>Treasury & Financial viability</span>
                      <strong className="font-mono">{vendorRisk?.financialScore || vendor.riskScore - 3}/100</strong>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span>Operational redundancy security</span>
                      <strong className="font-mono">{vendorRisk?.operationalScore || vendor.riskScore + 4}/100</strong>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span>Legislation compliance</span>
                      <strong className="font-mono">{vendorRisk?.complianceScore || vendor.riskScore - 1}/100</strong>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span>Cybersecurity encryption check</span>
                      <strong className="font-mono">{vendorRisk?.cyberScore || vendor.riskScore + 2}/100</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance documents checklists */}
              <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm p-5 space-y-4 text-xs">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Compliance checklist status</h3>
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {complianceDocRequirements.map((req, i) => {
                    const mappedDoc = vendorDocs.find(d => d.category.toLowerCase().includes(req.name.split(' ')[0].toLowerCase()));
                    const isPassed = !!mappedDoc && mappedDoc.status === 'Active';
                    return (
                      <div key={i} className="py-3 flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          {isPassed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          )}
                          <div>
                            <span className="font-bold text-gray-900 dark:text-slate-100">{req.name}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{req.reason}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block border text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isPassed ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-800 border-amber-100'
                          }`}>
                            {isPassed ? 'Verified OK' : 'Expiration review required'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ARCHIVED GENERAL DOCUMENTS MODULE */}
          {activeTab === 'docs' && (
            <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm overflow-hidden text-xs">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50/45 text-xs text-slate-800 font-bold border-gray-150">
                <span>Archives Document folder list</span>
                <button
                  onClick={() => {
                    alert('Preparing document drag drop overlay...');
                    setCurrentPage('compliance');
                  }}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Upload Certificate
                </button>
              </div>
              <div className="p-4 divide-y divide-gray-100 dark:divide-gray-800">
                {vendorDocs.length === 0 ? (
                  <p className="p-12 text-center text-gray-400">Zero active items in draft directory folder.</p>
                ) : (
                  vendorDocs.map((doc) => (
                    <div key={doc.id} className="py-3 flex items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <FolderOpen className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="font-bold text-gray-950 dark:text-white block">{doc.name}</span>
                          <span className="text-[10px] text-gray-400 block mt-1">Category tag: {doc.category} · Size: {doc.fileSize} · Uploaded: {doc.uploadDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${conBadgeStyles(doc.status)}`}>
                          {doc.status}
                        </span>
                        <button
                          onClick={() => {
                            addToast('success', 'Document sync locked', `Initiating file transfer download: ${doc.name}`);
                          }}
                          className="p-1 px-[7px] border rounded text-gray-400 hover:text-gray-900 overflow-hidden"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 8: ACTIVITY EVENTS LOG */}
          {activeTab === 'activity' && (
            <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm p-6 space-y-6 text-xs">
              <h3 className="font-bold text-gray-905 uppercase tracking-wider text-[11px] border-b pb-2">Audit trail events chronology</h3>
              <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-150 dark:before:bg-gray-800">
                {vendorLogs.length === 0 ? (
                  <p className="text-gray-400 text-center py-10">Zero operational entries filed on entity database.</p>
                ) : (
                  vendorLogs.map((log) => (
                    <div key={log.id} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white dark:border-[#161B27]" />
                      <div className="space-y-1">
                        <div className="flex items-start justify-between">
                          <span className="font-bold text-gray-900 dark:text-slate-100">{log.action}</span>
                          <span className="text-[11px] text-gray-400 font-mono mt-0.5">{log.timestamp}</span>
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 truncate max-w-4xl">{log.description}</p>
                        <span className="text-[10px] uppercase font-bold text-[#CBD5E1] bg-slate-800 px-1 py-0.5 rounded-sm inline-block">
                          User rep: {log.user} ({log.role})
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mappings requirements
const conBadgeStyles = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/60';
    case 'Expiring': return 'bg-amber-50 text-amber-800 border-amber-100 font-bold dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/60';
    default: return 'bg-red-50 text-red-800 border-red-100 font-bold dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/60';
  }
};

const complianceDocRequirements = [
  { name: 'Business License / Registration certificate', reason: 'Critical for regional legal verification and filings checks.' },
  { name: 'Certificate of Insurance SLA level', reason: 'Maintains third party liability safety controls limits.' },
  { name: 'Signed NDA Agreement', reason: 'Protects proprietary corporate assets systems access.' },
  { name: 'W-9 Forms registry tax checklist', reason: 'Required by tax regulatory structures and invoice audits.' }
];
