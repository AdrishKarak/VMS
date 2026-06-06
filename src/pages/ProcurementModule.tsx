import React, { useState, useMemo, useEffect } from 'react';
import { useVMS } from '../vmsContext';
import { PurchaseOrder, Contract } from '../types';
import {
  ShoppingCart,
  FileCheck2,
  GitPullRequest,
  Plus,
  Trash2,
  FileText,
  Clock,
  Sparkles,
  Award,
  ChevronDown,
  ArrowRight,
  Calculator,
  Search,
  CheckCircle,
  XCircle,
  FolderOpen,
  DollarSign
} from 'lucide-react';

export const ProcurementModule: React.FC = () => {
  const {
    purchaseOrders,
    addPurchaseOrder,
    contracts,
    addContract,
    vendors,
    addToast,
    currentPage
  } = useVMS();

  // Sub-tab selectors: 'pos' | 'rfqs' | 'contracts'
  const [subTab, setSubTab] = useState<'pos' | 'rfqs' | 'contracts'>('pos');

  // Align subTab with currentPage from context
  useEffect(() => {
    if (currentPage === 'purchase-orders') {
      setSubTab('pos');
    } else if (currentPage === 'rfq') {
      setSubTab('rfqs');
    } else if (currentPage === 'contracts') {
      setSubTab('contracts');
    }
  }, [currentPage]);

  // PO States
  const [poStatusFilter, setPoStatusFilter] = useState<string>('All');
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
  const [createPoOpen, setCreatePoOpen] = useState(false);

  // RFQ weight States
  const [priceWeight, setPriceWeight] = useState(40);
  const [qualityWeight, setQualityWeight] = useState(30);
  const [deliveryWeight, setDeliveryWeight] = useState(30);

  // Selected Tender
  const [selectedTender, setSelectedTender] = useState<string>('RFQ-2026-ITB');

  // PO Form states
  const [poVendorId, setPoVendorId] = useState(vendors[0]?.id || '');
  const [poTitle, setPoTitle] = useState('');
  const [poRequiredDays, setPoRequiredDays] = useState(30);
  const [poItems, setPoItems] = useState<{ desc: string; qty: number; rate: number }[]>([
    { desc: 'Technical consulting hours module', qty: 40, rate: 120 }
  ]);

  // Calculations for PO Form
  const tempSubtotal = poItems.reduce((acc, it) => acc + (it.qty * it.rate), 0);
  const tempTax = tempSubtotal * 0.0825; // 8.25% Sales tax
  const tempTotalSum = tempSubtotal + tempTax;

  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => poStatusFilter === 'All' || po.status === poStatusFilter);
  }, [purchaseOrders, poStatusFilter]);

  const activePO = useMemo(() => {
    return purchaseOrders.find((p) => p.id === selectedPoId) || purchaseOrders[0];
  }, [purchaseOrders, selectedPoId]);

  // Compute calculated partner recommendation based on weights
  const rfqsRecommendation = useMemo(() => {
    return vendors.map((v) => {
      // priceScore inversely proportional to riskScore slightly, plus performance
      const basePriceScore = 100 - (v.riskScore / 2);
      const baseQualityScore = v.performanceScore;
      const baseDeliveryScore = 88; // standard SLA

      const weightedScore = Math.round(
        (basePriceScore * priceWeight +
         baseQualityScore * qualityWeight +
         baseDeliveryScore * deliveryWeight) / 100
      );

      return {
        vendor: v,
        weightedScore,
        priceEst: Math.round(v.contractValue * 0.1) || 45000
      };
    }).sort((a, b) => b.weightedScore - a.weightedScore);
  }, [vendors, priceWeight, qualityWeight, deliveryWeight]);

  const handleAddPoItemRow = () => {
    setPoItems((prev) => [...prev, { desc: '', qty: 1, rate: 0 }]);
  };

  const handleRemovePoItemRow = (index: number) => {
    setPoItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemFieldChange = (index: number, field: 'desc' | 'qty' | 'rate', val: string | number) => {
    setPoItems((prev) => {
      const copy = [...prev];
      if (field === 'desc') {
        copy[index].desc = val as string;
      } else {
        copy[index][field] = Number(val);
      }
      return copy;
    });
  };

  const executeCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poTitle) return alert('Specification title required');

    addPurchaseOrder({
      vendorId: poVendorId,
      title: poTitle,
      amount: Math.round(tempTotalSum),
      createdDate: new Date().toISOString().substring(0, 10),
      requiredBy: new Date(Date.now() + poRequiredDays * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      status: 'Pending Approval',
      paymentStatus: 'Unpaid'
    });

    addToast('success', 'PO Requisition Compiled', `Purchase Order draft created successfully in Pending Approval class.`);
    setCreatePoOpen(false);
    // Reset
    setPoTitle('');
    setPoItems([{ desc: 'Technical consulting hours module', qty: 40, rate: 120 }]);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Dynamic Sub navigation tab row */}
      <div className="bg-white dark:bg-[#161B27] border p-1 rounded shadow-sm flex gap-1">
        <button
          onClick={() => setSubTab('pos')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-1.5 ${
            subTab === 'pos' ? 'bg-[#0F1729] text-white' : 'text-gray-500 dark:text-slate-400 hover:bg-slate-50'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Purchase Requisitions
        </button>
        <button
          onClick={() => setSubTab('rfqs')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-1.5 ${
            subTab === 'rfqs' ? 'bg-[#0F1729] text-white' : 'text-gray-500 dark:text-slate-400 hover:bg-slate-50'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          Sourcing & RFQ Bidding
        </button>
        <button
          onClick={() => setSubTab('contracts')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-1.5 ${
            subTab === 'contracts' ? 'bg-[#0F1729] text-white' : 'text-gray-500 dark:text-slate-400 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          General MSA Contracts
        </button>
      </div>

      {/* MODULE SCREEN 1: PURCHASE REQUISITIONS */}
      {subTab === 'pos' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Main list rows section (66%) */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white dark:bg-[#161B27] p-4 border rounded shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1">
                {(['All', 'Pending Approval', 'Issued', 'Received'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setPoStatusFilter(st)}
                    className={`px-3 py-1 text-[11px] font-bold rounded ${
                      poStatusFilter === st
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 dark:bg-slate-800 text-gray-550 dark:text-slate-350 hover:bg-gray-100'
                    }`}
                  >
                    {st === 'All' ? 'All statuses' : st}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCreatePoOpen(true)}
                className="px-3 h-[32px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded flex items-center gap-1 shadow-sm leading-none cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New Purchase Order
              </button>
            </div>

            {/* List Table container */}
            <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm overflow-x-auto w-full text-xs">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-widest font-sans">
                  <tr>
                    <th className="p-3 pl-4">PO ID</th>
                    <th className="p-3">Title Description</th>
                    <th className="p-3">Vendor</th>
                    <th className="p-3 text-right">Sum amount</th>
                    <th className="p-3">Deliver By</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-803 text-slate-700 dark:text-slate-200">
                  {filteredPOs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-gray-400">Zero matching PO requisitions.</td>
                    </tr>
                  ) : (
                    filteredPOs.map((po) => (
                      <tr
                        key={po.id}
                        onClick={() => setSelectedPoId(po.id)}
                        className={`hover:bg-blue-50/15 dark:hover:bg-slate-850/20 cursor-pointer transition ${
                          selectedPoId === po.id || (!selectedPoId && activePO?.id === po.id) ? 'bg-blue-50/10 dark:bg-blue-900/5 font-bold border-l-2 border-blue-600' : ''
                        }`}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">{po.id}</td>
                        <td className="p-3 font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">{po.title}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{po.vendorId}</td>
                        <td className="p-3 text-right font-mono font-bold text-gray-900 dark:text-slate-250">${po.amount.toLocaleString()}</td>
                        <td className="p-3 font-medium text-gray-500 dark:text-slate-400">{po.requiredBy}</td>
                        <td className="p-3">
                          <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            po.status === 'Received' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400' : po.status === 'Issued' ? 'bg-blue-50/70 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400' : 'bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400'
                          }`}>
                            {po.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Drill-down PO item Invoice detail view (34%) */}
          <div className="xl:col-span-1 bg-white dark:bg-[#161B27] border rounded shadow-sm p-5 space-y-4 font-sans text-xs">
            {activePO ? (
              <div className="space-y-4">
                <div className="border-b pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Purchase Voucher</span>
                    <h3 className="font-roboto font-bold text-lg text-gray-950 dark:text-white leading-tight mt-0.5">{activePO.id}</h3>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                    activePO.status === 'Received' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {activePO.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100 text-gray-550 dark:text-slate-400">
                  <span>Authorized Site:</span>
                  <strong className="text-right text-gray-900 dark:text-white">{activePO.vendorId}</strong>

                  <span>Issued On:</span>
                  <strong className="text-right text-gray-900 dark:text-white">{activePO.createdDate}</strong>

                  <span>Target Delivery:</span>
                  <strong className="text-right text-gray-900 dark:text-white">{activePO.requiredBy}</strong>
                </div>

                {/* Line items tables */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Authorized Scope Line items</span>
                  <div className="divide-y divide-gray-100 text-[11px]">
                    <div className="py-2 flex justify-between items-center text-gray-955 dark:text-slate-205 font-bold">
                      <span>Line item description context</span>
                      <span>Sum total</span>
                    </div>
                    {/* Hardcoded visual representation matches for mock amounts */}
                    <div className="py-2.5 flex justify-between items-center text-gray-500">
                      <div>
                        <span className="block text-gray-850 dark:text-slate-200">{activePO.title}</span>
                        <span className="block text-[10px]">1 unit package x rate</span>
                      </div>
                      <strong className="font-mono text-gray-900 dark:text-white">${activePO.amount.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-100 dark:bg-slate-800" />

                <div className="flex justify-between items-center font-bold text-gray-950 dark:text-white text-sm">
                  <span>Grand Total (USD):</span>
                  <strong className="font-mono">${activePO.amount.toLocaleString()}</strong>
                </div>

                {/* Signature box and signoff triggers */}
                <div className="p-4 bg-gray-50/50 dark:bg-slate-850/10 border border-dashed rounded text-center space-y-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 block">Approval signature</span>
                  <div className="h-10 border-b border-gray-250 flex items-center justify-center font-serif text-slate-800 dark:text-slate-200 text-sm select-auto">
                    Sarah Jenkins
                  </div>
                  <span className="text-[9px] text-gray-400 block uppercase">Controller Vetting Stamp Covenants digital</span>
                </div>
              </div>
            ) : (
              <p className="p-8 text-center text-gray-400">Highlight requisition entry line.</p>
            )}
          </div>
        </div>
      )}

      {/* MODULE SCREEN 2: RFQ TENDER SOURCE MATCHING */}
      {subTab === 'rfqs' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Weights sliders control module (34%) */}
          <div className="xl:col-span-1 bg-white dark:bg-[#161B27] border rounded shadow-sm p-5 space-y-6 text-xs font-sans">
            <div className="border-b pb-2">
              <h3 className="font-bold text-gray-909 uppercase tracking-wider text-[11px]">Source Bid Weight Evaluations</h3>
              <p className="text-gray-400 mt-1">Calibrate performance, quality standards, and budget ranges priorities.</p>
            </div>

            <div className="space-y-4">
              {/* Slider price */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-gray-500 uppercase text-[10.5px]">
                  <span>Price Priority Weight</span>
                  <span className="font-mono font-extrabold text-blue-600">{priceWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={priceWeight}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    setPriceWeight(price);
                    // Dynamically balance the remainder Quality and Delivery
                    const remainder = 100 - price;
                    setQualityWeight(Math.round(remainder / 2));
                    setDeliveryWeight(Math.round(remainder / 2));
                  }}
                  className="w-full accent-blue-650"
                />
              </div>

              {/* Slider quality */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-gray-500 uppercase text-[10.5px]">
                  <span>Quality Assurance Weight</span>
                  <span className="font-mono font-extrabold text-emerald-600">{qualityWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={qualityWeight}
                  onChange={(e) => {
                    const qual = Number(e.target.value);
                    setQualityWeight(qual);
                    const remainder = 100 - qual;
                    setPriceWeight(Math.round(remainder / 2));
                    setDeliveryWeight(Math.round(remainder / 2));
                  }}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Slider delivery */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-gray-500 uppercase text-[10.5px]">
                  <span>Delivery Speed Priority</span>
                  <span className="font-mono font-extrabold text-orange-600">{deliveryWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={deliveryWeight}
                  onChange={(e) => {
                    const deliv = Number(e.target.value);
                    setDeliveryWeight(deliv);
                    const remainder = 100 - deliv;
                    setPriceWeight(Math.round(remainder / 2));
                    setQualityWeight(Math.round(remainder / 2));
                  }}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50/50 dark:bg-slate-850/10 border rounded space-y-1">
              <span className="font-mono text-gray-400 block text-[10px] uppercase">Aggregate Weight Checklist Check</span>
              <strong className="text-sm font-black text-gray-900 dark:text-white font-mono block">
                {priceWeight + qualityWeight + deliveryWeight}% Target matching index
              </strong>
            </div>
          </div>

          {/* Supplier recommendation list results (66%) */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white dark:bg-[#161B27] p-5 rounded-md border text-xs space-y-2">
              <span className="font-mono text-gray-400 uppercase tracking-widest text-[9.5px]">Tender Sourcing Bid Catalog Matcher</span>
              <h3 className="font-black text-base text-gray-905 dark:text-white">Active RFQs Catalog Matching Results</h3>
              <div className="flex gap-2 pt-2">
                {[
                  { rfq: 'RFQ-2026-ITB', title: 'Managed Cloud Hosting Service' },
                  { rfq: 'RFQ-2026-RAW', title: 'Raw Electronics Silicon Wafer Supply' }
                ].map((r) => (
                  <button
                    key={r.rfq}
                    onClick={() => setSelectedTender(r.rfq)}
                    className={`p-3 px-4 border rounded text-left font-sans cursor-pointer transition ${
                      selectedTender === r.rfq
                        ? 'bg-indigo-600 dark:bg-indigo-600 border-indigo-600 text-white ring-2 ring-indigo-200 dark:ring-indigo-900'
                        : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-750 dark:text-slate-300 bg-white dark:bg-[#161B27] border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    <span className="font-mono font-bold block">{r.rfq}</span>
                    <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-400 block mt-0.5">{r.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendations grid list */}
            <div className="space-y-3">
              {rfqsRecommendation.slice(0, 4).map((rec, idx) => {
                const isBest = idx === 0;
                return (
                  <div
                    key={rec.vendor.id}
                    className={`bg-white dark:bg-[#161B27] p-4 border rounded shadow-sm flex items-center justify-between text-xs font-sans relative hover:shadow transition ${
                      isBest ? 'border-emerald-500 bg-emerald-50/10' : ''
                    }`}
                  >
                    {isBest && (
                      <span className="absolute left-4 -top-2.5 bg-emerald-500 text-white font-black uppercase text-[9px] tracking-widest px-2 py-0.5 rounded-sm shadow">
                        Best Option Match
                      </span>
                    )}

                    <div className="flex gap-3 items-center">
                      <div className="w-[42px] h-[42px] rounded bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs uppercase uppercase">
                        {rec.vendor.logoInitials}
                      </div>

                      <div>
                        <strong className="text-sm text-gray-905 dark:text-white font-black block">{rec.vendor.name}</strong>
                        <span className="text-[10px] text-gray-450 block font-bold font-mono mt-0.5">
                          Risk Index: {rec.vendor.riskScore}/100 · Compliance: {rec.vendor.performanceScore}%
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-6">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase">Est. Tender Price</span>
                        <strong className="text-sm font-semibold font-mono text-gray-950 dark:text-white">${rec.priceEst.toLocaleString()} USD</strong>
                      </div>

                      <div className="text-center">
                        <span className="text-gray-400 block text-[10px] uppercase">Match Probability</span>
                        <strong className={`text-base font-black font-mono block ${isBest ? 'text-emerald-550' : 'text-slate-701'}`}>
                          {rec.weightedScore}%
                        </strong>
                      </div>

                      <button
                        onClick={() => {
                          addToast('success', 'RFQ Sourcing Triggered', `Initializing digital tender contracts and NDAs packet exchange with ${rec.vendor.name}.`);
                        }}
                        className="p-1 px-[7px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer leading-none text-xs h-[30px] flex items-center"
                      >
                        Reward Tender
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODULE SCREEN 3: MSA CONTRACTS AND MILESTONES */}
      {subTab === 'contracts' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* MSA Listing contracts roster table (66%) */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm overflow-x-auto w-full text-xs">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-widest">
                  <tr>
                    <th className="p-3 pl-4">Contract MSA Code</th>
                    <th className="p-3">Title Description</th>
                    <th className="p-3">Associated Legal Entity</th>
                    <th className="p-3 text-right">Scope value</th>
                    <th className="p-3">Compliance limit</th>
                    <th className="p-3">Agreement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-803 text-slate-700 dark:text-slate-200">
                  {contracts.map((con) => (
                    <tr key={con.id} className="hover:bg-blue-50/15">
                      <td className="p-3 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">{con.id}</td>
                      <td className="p-3 font-semibold text-gray-900 dark:text-white">{con.title}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{con.vendorId}</td>
                      <td className="p-3 text-right font-mono font-bold text-gray-900 dark:text-slate-250">${con.value.toLocaleString()}</td>
                      <td className="p-3 text-gray-500 dark:text-slate-400 font-mono text-[11px]">{con.endDate}</td>
                      <td className="p-3">
                        <span className={`inline-block border text-[10px] font-bold px-1 rounded ${
                          con.status === 'Active' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800'
                        }`}>
                          {con.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Milestone checklists and timeline tracks (34%) */}
          <div className="xl:col-span-1 bg-white dark:bg-[#161B27] border rounded shadow-sm p-5 space-y-4 text-xs font-sans">
            <div className="border-b pb-2 flex justify-between items-center mr-1">
              <h3 className="font-bold text-gray-901 uppercase tracking-wider text-[11px]">MSA Milestones Tracker</h3>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {[
                { m: 'Initial Draft SLA review approvals', days: 'Passed 2026-05', completed: true },
                { m: 'Compliance vetting certificates receipt', days: 'Passed 2026-06', completed: true },
                { m: 'Cyber security certificate validation', days: 'Due in 15 days', completed: false },
                { m: 'Final legal signing of documents packet', days: 'Due in 30 days', completed: false }
              ].map((item, id) => (
                <div key={id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className={`font-bold block ${item.completed ? 'text-gray-400 line-through' : 'text-gray-950 dark:text-white'}`}>
                      {item.m}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">{item.days}</span>
                  </div>
                  <div>
                    <span className={`px-1 rounded text-[10px] uppercase font-bold leading-none ${
                      item.completed ? 'bg-emerald-50 text-emerald-850' : 'bg-amber-50 text-amber-850'
                    }`}>
                      {item.completed ? 'Vetted ok' : 'Awaiting'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE PO MODAL REQUISITIONS FORM DRAWER */}
      {createPoOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm shadow-lg border" onClick={() => setCreatePoOpen(false)} />
          <div className="fixed top-12 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-white dark:bg-[#161B27] border border-gray-250 dark:border-gray-803 rounded-md p-6 shadow-2xl z-50 flex flex-col font-sans py-6 px-8 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b mb-4 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h2 className="text-sm font-black text-gray-950 dark:text-white uppercase">Requisition Purchase order Draft</h2>
              </div>
              <button onClick={() => setCreatePoOpen(false)} className="text-gray-450 hover:text-gray-901 font-serif text-lg">&times;</button>
            </div>

            {/* Form */}
            <form onSubmit={executeCreatePO} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1 mr-1">
                  <label className="font-bold text-gray-450 uppercase text-[10.5px]">Vendor Authorized Entity</label>
                  <select
                    className="h-[36px] bg-transparent border dark:border-[#1F2937] outline-none px-2 rounded font-semibold text-gray-805 dark:text-white"
                    value={poVendorId}
                    onChange={(e) => setPoVendorId(e.target.value)}
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-450 uppercase text-[10.5px]">Deliver within period (Days)</label>
                  <input
                    type="number"
                    className="h-[36px] bg-transparent border dark:border-[#1F2937] outline-none px-2 rounded text-gray-805 dark:text-white"
                    value={poRequiredDays}
                    onChange={(e) => setPoRequiredDays(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-450 uppercase text-[10.5px]">Specification description scope Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Q3 Managed Network security infrastructure consulting hours"
                  className="h-[36px] bg-transparent border dark:border-[#1F2937] outline-none px-2 rounded focus:border-blue-500 text-gray-805 dark:text-white"
                  value={poTitle}
                  onChange={(e) => setPoTitle(e.target.value)}
                />
              </div>

              {/* Dynamic Items Row Grid lists */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pb-1 border-b">
                  <span className="font-bold text-gray-400 uppercase text-[10px]">Authorized line items</span>
                  <button
                    type="button"
                    onClick={handleAddPoItemRow}
                    className="text-[10px] font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
                  >
                    + Add scope row
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[150px] overflow-y-auto pr-1">
                  {poItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6 mr-1">
                        <input
                          required
                          type="text"
                          placeholder="Scope details description..."
                          className="w-full h-[32px] bg-transparent border dark:border-[#1F2937] text-xs outline-none px-2 rounded text-gray-805 dark:text-white"
                          value={item.desc}
                          onChange={(e) => handleItemFieldChange(index, 'desc', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 mr-1">
                        <input
                          required
                          type="number"
                          placeholder="qty"
                          className="w-full h-[32px] bg-transparent border dark:border-[#1F2937] text-xs outline-none px-2 rounded text-gray-805 dark:text-white"
                          value={item.qty}
                          onChange={(e) => handleItemFieldChange(index, 'qty', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3 mr-1">
                        <input
                          required
                          type="number"
                          placeholder="rate"
                          className="w-full h-[32px] bg-transparent border dark:border-[#1F2937] text-xs outline-none px-1.5 rounded text-gray-805 dark:text-white"
                          value={item.rate}
                          onChange={(e) => handleItemFieldChange(index, 'rate', e.target.value)}
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          disabled={poItems.length === 1}
                          onClick={() => handleRemovePoItemRow(index)}
                          className="p-1 text-red-500 disabled:opacity-30 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic calculations list */}
              <div className="p-3 bg-gray-50/50 dark:bg-slate-850/10 border rounded space-y-1.5 font-bold font-mono text-[11px] text-right">
                <div>Subtotal: ${tempSubtotal.toLocaleString()}</div>
                <div>Sales Tax (8.25%): ${tempTax.toFixed(2)}</div>
                <div className="text-xs font-black text-blue-600 border-t pt-1">
                  Aggregate Total sum: ${tempTotalSum.toLocaleString()} USD
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end gap-2 pr-1">
                <button
                  type="button"
                  onClick={() => setCreatePoOpen(false)}
                  className="px-4 py-2 border rounded font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
                >
                  Validate Requisition
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
