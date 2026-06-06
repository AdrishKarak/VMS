import React, { useState, useMemo, useEffect } from 'react';
import { useVMS } from '../vmsContext';
import { Invoice } from '../types';
import {
  DollarSign,
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  Layers,
  ChevronDown,
  ArrowRight,
  Download,
  Calendar,
  Sparkles,
  Award,
  Wallet,
  Coins,
  History,
  CheckCircle,
  HelpCircle,
  Plus,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';

export const FinanceModule: React.FC = () => {
  const {
    invoices,
    updateInvoiceStatus,
    addToast,
    currentPage
  } = useVMS();

  // Tab: 'invoices' | 'spend' | 'payments' | 'savings'
  const [tab, setTab] = useState<'invoices' | 'spend' | 'payments' | 'savings'>('invoices');

  // Align active tab with outer route click
  useEffect(() => {
    if (currentPage === 'invoices') {
      setTab('invoices');
    } else if (currentPage === 'payments') {
      setTab('payments');
    } else if (currentPage === 'savings') {
      setTab('savings');
    } else if (currentPage === 'spend-analytics') {
      setTab('spend');
    }
  }, [currentPage]);

  // Currently open invoice for 3-way matching checker
  const [matchingInvoiceId, setMatchingInvoiceId] = useState<string | null>(null);

  // Checks state for 3-way match
  const [poCheck, setPoCheck] = useState(false);
  const [grnCheck, setGrnCheck] = useState(false);
  const [rateCheck, setRateCheck] = useState(false);

  // New initiative state
  const [initOpen, setInitOpen] = useState(false);
  const [initName, setInitName] = useState('');
  const [initSavings, setInitSavings] = useState(15000);

  // Savings initiatives state
  const [initiatives, setInitiatives] = useState([
    { id: 'INI-01', name: 'Silicon wafer volume bulk discount', target: '$45,000', achieved: 38000, category: 'Logistics' },
    { id: 'INI-02', name: 'Software licensing consolidation', target: '$25,000', achieved: 22000, category: 'IT Services' },
    { id: 'INI-03', name: 'Facilities maintenance service consolidation', target: '$12,000', achieved: 10500, category: 'Facilities' }
  ]);

  // Aggregate stats
  const [invoiceSearchText, setInvoiceSearchText] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('All');

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.id.toLowerCase().includes(invoiceSearchText.toLowerCase()) ||
        inv.vendorId.toLowerCase().includes(invoiceSearchText.toLowerCase()) ||
        inv.poReference.toLowerCase().includes(invoiceSearchText.toLowerCase());
      const matchesStatus =
        invoiceStatusFilter === 'All' || inv.status === invoiceStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, invoiceSearchText, invoiceStatusFilter]);

  const totalDraftInvoiced = useMemo(() => {
    return filteredInvoices.reduce((acc, inv) => acc + inv.total, 0);
  }, [filteredInvoices]);

  const activeInvoice = useMemo(() => {
    return filteredInvoices.find(inv => inv.id === matchingInvoiceId) || filteredInvoices[0];
  }, [filteredInvoices, matchingInvoiceId]);

  // Stacked Area Chart data 6 months spend allocation
  const areaChartData = [
    { month: 'Jan', IT_Services: 40000, Raw_Materials: 24000, Logistics: 12000, Other: 5000 },
    { month: 'Feb', IT_Services: 45000, Raw_Materials: 13000, Logistics: 23000, Other: 6000 },
    { month: 'Mar', IT_Services: 32000, Raw_Materials: 34000, Logistics: 15000, Other: 8000 },
    { month: 'Apr', IT_Services: 50000, Raw_Materials: 28000, Logistics: 30000, Other: 9005 },
    { month: 'May', IT_Services: 65050, Raw_Materials: 40020, Logistics: 20050, Other: 12000 },
    { month: 'Jun', IT_Services: 70000, Raw_Materials: 48000, Logistics: 32000, Other: 15000 }
  ];

  // BarChart savings comparison
  const savingsBarData = initiatives.map(init => ({
    name: init.id,
    NameLong: init.name,
    Achieved: init.achieved,
    Target: Number(init.target.replace(/[^0-9]/g, ''))
  }));

  const handleExecute3WayMatch = (id: string) => {
    if (!poCheck || !grnCheck || !rateCheck) {
      addToast('error', 'Incomplete Match Vetting', 'Please complete PO, Quality delivery GRN verify and contract rate matches checklists.');
      return;
    }
    updateInvoiceStatus(id, 'Paid', 'Approved');
    addToast('success', 'Match Vetting Complete', `Invoice ${id} verified and updated as paid. Voucher released to accounts ledger.`);
    setMatchingInvoiceId(null);
    // Reset flags
    setPoCheck(false);
    setGrnCheck(false);
    setRateCheck(false);
  };

  const handleDisputeInvoice = (id: string, reason: string) => {
    updateInvoiceStatus(id, 'Disputed', 'Blocked');
    addToast('info', 'Invoice Disputes Filed', `Lodging pricing dispute mapping invoice ID reference: ${id}.`);
    setMatchingInvoiceId(null);
  };

  const handleCreateInitiative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initName) return;
    setInitiatives(prev => [
      ...prev,
      {
        id: `INI-0${prev.length + 1}`,
        name: initName,
        target: `$${initSavings.toLocaleString()}`,
        achieved: Math.round(initSavings * 0.8),
        category: 'Services'
      }
    ]);
    addToast('success', 'Savings Initiative Registered', 'Trackers launched for negotiated discount margin.');
    setInitOpen(false);
    setInitName('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Dynamic Tab selector header row */}
      <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm flex font-sans overflow-x-auto p-1 gap-1">
        {(
          [
            { id: 'invoices', label: '3-Way Invoice Match', icon: FileCheck2 },
            { id: 'spend', label: 'Spend Allocation', icon: TrendingUp },
            { id: 'payments', label: 'Direct Disbursal', icon: Wallet },
            { id: 'savings', label: 'Savings & Margins', icon: Coins }
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setMatchingInvoiceId(null);
              }}
              className={`flex-1 min-w-[130px] whitespace-nowrap py-2 text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-1.5 ${
                tab === t.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: 3-WAY MATCH INVOICES PORTAL */}
      {tab === 'invoices' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* List Table panel (66%) */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white dark:bg-[#161B27] p-5 rounded-md border text-xs flex justify-between items-center bg-gray-50/45 dark:bg-slate-900/10 border-gray-150">
              <div className="space-y-1">
                <h3 className="font-bold text-gray-901 dark:text-slate-105 uppercase tracking-wider text-[11px]">Accounts Payable Ledger</h3>
                <span className="text-gray-400">Validate active vendor bills prior to cash disbursements.</span>
              </div>
              <div className="text-right font-mono font-bold">
                <span className="text-gray-450 text-[10px] uppercase block">Cumulative Liability</span>
                <span className="text-sm text-gray-905 dark:text-white">${totalDraftInvoiced.toLocaleString()} USD</span>
              </div>
            </div>

            {/* Invoices Filter Strip */}
            <div className="bg-white dark:bg-[#161B27] p-3 rounded-md border flex flex-wrap md:flex-nowrap gap-3 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search invoice ID, vendor, or PO reference..."
                  value={invoiceSearchText}
                  onChange={(e) => setInvoiceSearchText(e.target.value)}
                  className="w-full h-[36px] pl-9 pr-4 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-[#1F2937] text-[13px] rounded-sm text-gray-950 dark:text-white outline-none"
                />
              </div>

              {/* Status Select */}
              <select
                value={invoiceStatusFilter}
                onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                className="h-[36px] border border-gray-200 dark:border-[#1F2937] text-xs rounded-sm px-2.5 bg-white dark:bg-[#161B27] text-gray-705 dark:text-slate-300 outline-none"
              >
                <option value="All">All Hold Statuses</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
                <option value="Disputed">Disputed</option>
              </select>

              {(invoiceSearchText || invoiceStatusFilter !== 'All') && (
                <button
                  onClick={() => {
                    setInvoiceSearchText('');
                    setInvoiceStatusFilter('All');
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-1 cursor-pointer font-bold shrink-0"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm overflow-x-auto w-full text-xs">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-widest font-sans">
                  <tr>
                    <th className="p-3 pl-4">Invoice Code ID</th>
                    <th className="p-3">Vendor Account</th>
                    <th className="p-3">Attached PO code</th>
                    <th className="p-3 text-right font-mono">Invoice Sum</th>
                    <th className="p-3">Terms Days</th>
                    <th className="p-3">Hold Status</th>
                    <th className="p-3">Match Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-803 text-slate-700 dark:text-slate-200">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400 italic">No invoices matching active filters.</td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr
                        key={inv.id}
                        onClick={() => {
                          setMatchingInvoiceId(inv.id);
                          setPoCheck(inv.status === 'Paid');
                          setGrnCheck(inv.status === 'Paid');
                          setRateCheck(inv.status === 'Paid');
                        }}
                        className={`hover:bg-blue-50/15 dark:hover:bg-slate-850/20 cursor-pointer transition ${
                          matchingInvoiceId === inv.id || (!matchingInvoiceId && activeInvoice?.id === inv.id) ? 'bg-blue-50/10 dark:bg-blue-900/5 font-bold border-l-2 border-blue-600' : ''
                        }`}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">{inv.id}</td>
                        <td className="p-3 font-semibold text-gray-900 dark:text-white">{inv.vendorId}</td>
                        <td className="p-3 font-mono text-gray-700 dark:text-slate-300">{inv.poReference}</td>
                        <td className="p-3 text-right font-mono font-bold text-gray-900 dark:text-slate-100">${inv.total.toLocaleString()}</td>
                        <td className="p-3 text-gray-500 dark:text-slate-400">{inv.dueDate}</td>
                        <td className="p-3">
                          <span className={`inline-block border text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800' : inv.status === 'Disputed' ? 'bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800' : 'bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-block border text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900' : 'bg-amber-55/70 text-amber-850 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900'
                          }`}>
                            {inv.status === 'Paid' ? 'Verified Pass' : 'Verification Required'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3-Way Match Verification Checklist Drawer/Panel (34%) */}
          <div className="xl:col-span-1 bg-white dark:bg-[#161B27] border rounded shadow-sm p-4 space-y-4 text-xs font-sans">
            {activeInvoice ? (
              <div className="space-y-4">
                <div className="border-b pb-3.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">Invoice Matcher Drawer</span>
                  <h3 className="font-roboto font-bold text-lg text-gray-955 dark:text-white mt-0.5 leading-none">{activeInvoice.id}</h3>
                  <p className="text-gray-400 mt-1 font-semibold">Match billing lines to corresponding purchase order and goods received.</p>
                </div>

                <div className="p-3.5 bg-gray-50/50 dark:bg-slate-850/10 rounded space-y-3 font-mono text-[11px] border">
                  <div className="flex justify-between">
                    <span>Vendor:</span>
                    <strong>{activeInvoice.vendorId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Invoice Sum:</span>
                    <strong className="text-gray-909 dark:text-white">${activeInvoice.total.toLocaleString()} USD</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Contract rate:</span>
                    <strong>SLA Compliant rates</strong>
                  </div>
                </div>

                {/* 3 checklists */}
                <div className="space-y-3.5 pt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Match Vetting checklists</span>

                  <label className="p-3 border rounded flex items-start gap-2.5 cursor-pointer select-none hover:bg-gray-50/30">
                    <input
                      type="checkbox"
                      checked={poCheck}
                      disabled={activeInvoice.status === 'Paid'}
                      onChange={(e) => setPoCheck(e.target.checked)}
                      className="scale-110 mt-0.5"
                    />
                    <div>
                      <strong className="font-bold text-gray-901 dark:text-slate-201 block leading-tight">1. Purchase Order Match</strong>
                      <span className="text-[10px] text-gray-400 block mt-0.5">PO reference check balances match within 2.5% threshold.</span>
                    </div>
                  </label>

                  <label className="p-3 border rounded flex items-start gap-2.5 cursor-pointer select-none hover:bg-gray-50/30">
                    <input
                      type="checkbox"
                      checked={grnCheck}
                      disabled={activeInvoice.status === 'Paid'}
                      onChange={(e) => setGrnCheck(e.target.checked)}
                      className="scale-110 mt-0.5"
                    />
                    <div>
                      <strong className="font-bold text-[#475569] dark:text-slate-201 block leading-tight">2. Goods Receipt Match</strong>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Quantities on GRN match quantities physically received.</span>
                    </div>
                  </label>

                  <label className="p-3 border rounded flex items-start gap-2.5 cursor-pointer select-none hover:bg-gray-50/30">
                    <input
                      type="checkbox"
                      checked={rateCheck}
                      disabled={activeInvoice.status === 'Paid'}
                      onChange={(e) => setRateCheck(e.target.checked)}
                      className="scale-110 mt-0.5"
                    />
                    <div>
                      <strong className="font-bold text-[#475569] dark:text-slate-201 block leading-tight">3. Contract Rate Verification</strong>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Price schedules match prenegotiated MSA framework limits.</span>
                    </div>
                  </label>
                </div>

                <div className="pt-3 border-t flex justify-between gap-2 flex-wrap">
                  <button
                    disabled={activeInvoice.status === 'Paid'}
                    onClick={() => {
                      const reason = window.prompt("Lodge dispute reason description details:");
                      if (reason !== null) {
                        handleDisputeInvoice(activeInvoice.id, reason);
                      }
                    }}
                    className="px-3.5 py-1.5 border border-red-900 text-red-650 hover:bg-red-50 disabled:opacity-40 rounded font-semibold cursor-pointer"
                  >
                    Hold / Dispute
                  </button>
                  <button
                    disabled={activeInvoice.status === 'Paid'}
                    onClick={() => handleExecute3WayMatch(activeInvoice.id)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-45 rounded cursor-pointer flex items-center gap-1.5"
                  >
                    Match Approved Payments
                  </button>
                </div>
              </div>
            ) : (
              <p className="p-8 text-center text-gray-400 font-sans">Highlight invoice entry line.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SPEND ALLOCATION ANALYSIS (Stacked Areas) */}
      {tab === 'spend' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#161B27] p-4 border rounded">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">IT Tech Services Spend</span>
              <strong className="font-roboto font-extrabold text-xl text-gray-950 dark:text-white block mt-1.5">$219,000</strong>
            </div>
            <div className="bg-white dark:bg-[#161B27] p-4 border rounded">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Raw silicon supply spend</span>
              <strong className="font-roboto font-extrabold text-xl text-gray-950 dark:text-white block mt-1.5">$187,000</strong>
            </div>
            <div className="bg-white dark:bg-[#161B27] p-4 border rounded">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Logistics & Freight Spend</span>
              <strong className="font-roboto font-extrabold text-xl text-gray-950 dark:text-white block mt-1.5">$132,050</strong>
            </div>
            <div className="bg-white dark:bg-[#161B27] p-4 border rounded">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total operating capital Q1-Q2</span>
              <strong className="font-roboto font-extrabold text-xl text-gray-950 dark:text-white block mt-1.5">$541,050</strong>
            </div>
          </div>

          <div className="bg-white dark:bg-[#161B27] border p-5 rounded-md shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 leading-none">6-Month Stacked Spend Category Distribution</h3>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" className="hidden dark:block" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '4px', color: '#FFF' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="IT_Services" stackId="1" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="Raw_Materials" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="Logistics" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENTS DISBURSEMENT */}
      {tab === 'payments' && (
        <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm overflow-hidden text-xs font-sans">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50/45 dark:bg-slate-900/10 text-xs font-bold">
            Cash Disbursements scheduling lists
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-widest">
              <tr>
                <th className="p-3 pl-4">Authorized Bank Account</th>
                <th className="p-3">Method Class</th>
                <th className="p-3">Estimated Post Date</th>
                <th className="p-3 text-right">Sum balance</th>
                <th className="p-3 text-center">Transfer Confirmation Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-gray-803 text-slate-700 dark:text-slate-200">
              {[
                { acc: 'NovaStar Logistics (BofA Wire)', method: 'International Swift Wire', date: '2026-06-15', sum: '$24,500', ref: 'SW-827361-CA' },
                { acc: 'ClearPath IT consulting (Wells Fargo ACH)', method: 'ACH Transfer Direct', date: '2026-06-18', sum: '$12,200', ref: 'ACH-9821-X9' },
                { acc: 'Apex Strategic (Treasury Check)', method: 'Standard Corporate Check Match', date: '2026-06-25', sum: '$88,090', ref: 'CHK-2026-IT' }
              ].map((pay, id) => (
                <tr key={id} className="hover:bg-gray-50/10">
                  <td className="p-3 pl-4 font-bold text-gray-900 dark:text-white">{pay.acc}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{pay.method}</td>
                  <td className="p-3 text-gray-500 dark:text-slate-400">{pay.date}</td>
                  <td className="p-3 text-right font-mono font-bold text-gray-900 dark:text-slate-200">{pay.sum}</td>
                  <td className="p-3 text-center text-gray-400 dark:text-slate-400 font-mono">{pay.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: NEGOTIATED SAVINGS TRACKER */}
      {tab === 'savings' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Savings initiatives visual progression charts (66%) */}
          <div className="xl:col-span-2 bg-white dark:bg-[#161B27] border p-5 rounded space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-bold text-gray-901 uppercase tracking-wider text-[11px]">Negotiated Cost Savings</h3>
                <span className="text-gray-400 text-xs">Comparing targeted savings with actual achieved values.</span>
              </div>
              <button
                onClick={() => setInitOpen(true)}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] rounded flex items-center gap-1 leading-none shadow-sm mr-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Initiative
              </button>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={savingsBarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" className="hidden dark:block" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '4px', color: '#FFF', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Target" fill="#D97706" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Achieved" fill="#10B981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Savings list initiatives descriptions (34%) */}
          <div className="xl:col-span-1 bg-white dark:bg-[#161B27] border rounded shadow-sm p-4 space-y-4 text-xs font-sans">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] pb-1 border-b">Consolidation Initiatives</h3>
            <div className="divide-y divide-gray-150 dark:divide-slate-800">
              {initiatives.map((init) => (
                <div key={init.id} className="py-2.5 space-y-1">
                  <div className="flex justify-between font-bold text-gray-900 dark:text-slate-101">
                    <span>{init.name}</span>
                    <span className="font-mono text-[11px] font-extrabold text-emerald-600">${init.achieved.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Category: {init.category}</span>
                    <span>Target: {init.target}</span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 dark:bg-slate-800 rounded mt-1.5 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded" style={{ width: `${Math.round((init.achieved / Number(init.target.replace(/[^0-9]/g, ''))) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE SAVINGS INITIATIVE MODAL */}
      {initOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm" onClick={() => setInitOpen(false)} />
          <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white dark:bg-[#161B27] border border-gray-250 dark:border-gray-833 rounded-md p-6 shadow-2xl z-50 flex flex-col font-sans">
            <div className="flex justify-between items-center pb-3 border-b mb-4 flex-shrink-0">
              <h2 className="text-sm font-black text-gray-955 dark:text-white uppercase">Register Cost Saving Initiative</h2>
              <button onClick={() => setInitOpen(false)} className="text-gray-450 hover:text-gray-901 font-serif text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleCreateInitiative} className="space-y-4 text-xs font-sans">
              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-450 uppercase text-[10.5px]">Negotiated Agreement Initiative Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. AWS reserved instance consolidation discount"
                  className="h-[36px] bg-transparent border dark:border-[#1F2937] outline-none px-2 rounded focus:border-blue-500 text-gray-805 dark:text-white"
                  value={initName}
                  onChange={(e) => setInitName(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-450 uppercase text-[10.5px]">Target Savings quota Amount ($)</label>
                <input
                  required
                  type="number"
                  className="h-[36px] bg-transparent border dark:border-[#1F2937] outline-none px-2 rounded text-gray-805 dark:text-white"
                  value={initSavings}
                  onChange={(e) => setInitSavings(Number(e.target.value))}
                />
              </div>

              <div className="border-t pt-4 flex justify-end gap-2 pr-1 font-semibold">
                <button
                  type="button"
                  onClick={() => setInitOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded"
                >
                  Launch Initiative
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
