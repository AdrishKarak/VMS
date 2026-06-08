import React, { useState } from 'react';
import { useVMS } from '../../vmsContext';
import { PiggyBank, ArrowLeft, Percent, DollarSign, Calendar, FileText, TrendingDown, ClipboardCheck } from 'lucide-react';

export const AddInitiativeForm: React.FC = () => {
  const { vendors, addSavingsInitiative, addToast, setCurrentPage } = useVMS();

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('IT Services');
  const [vendorId, setVendorId] = useState('');
  const [type, setType] = useState<'Negotiation' | 'Volume Discount' | 'Process' | 'Demand Reduction' | 'Specification Change' | 'Payment Terms'>('Negotiation');
  const [baselineCost, setBaselineCost] = useState(100000);
  const [negotiatedCost, setNegotiatedCost] = useState(85000);
  const [recurring, setRecurring] = useState<'One-Time' | 'Recurring'>('Recurring');
  const [status, setStatus] = useState<'Realized' | 'Projected' | 'Pipeline' | 'On Hold'>('Pipeline');
  const [owner, setOwner] = useState('Alex Mercer');
  const [targetDate, setTargetDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !vendorId) {
      addToast('error', 'Incomplete Form', 'Please provide an initiative title and select a vendor.');
      return;
    }

    const selectedVendor = vendors.find(v => v.id === vendorId);
    const amount = Math.max(0, baselineCost - negotiatedCost);
    const percentage = baselineCost > 0 ? (amount / baselineCost) * 100 : 0;

    addSavingsInitiative({
      title,
      category,
      vendorId,
      vendorName: selectedVendor?.name || 'Generic Vendor',
      type,
      baselineCost,
      negotiatedCost,
      amount,
      percentage,
      recurring,
      annualizedValue: recurring === 'Recurring' ? amount : amount,
      notes,
      status,
      owner,
      targetDate,
      verified: status === 'Realized'
    });

    addToast('success', 'Initiative Registered', `Savings target "${title}" created successfully.`);
    setCurrentPage('savings');
  };

  const computedSavings = Math.max(0, baselineCost - negotiatedCost);
  const computedPercentage = baselineCost > 0 ? (computedSavings / baselineCost) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0D14] text-gray-900 dark:text-[#E2E8F0] p-6 lg:p-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-[#111622] border border-gray-200 dark:border-[#1F2937] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div id="form-header-banner" className="bg-gradient-to-r from-emerald-600 via-teal-650 to-cyan-700 p-8 text-white flex items-center justify-between form-header-gradient">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setCurrentPage('savings')}
              type="button"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-white"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-2xl font-extrabold font-roboto tracking-wide flex items-center gap-3 text-white">
                <PiggyBank className="w-7 h-7 text-emerald-200" /> Savings Initiative Registry
              </h2>
              <p className="text-white text-white/80 text-xs mt-1">Log, audit, and track negotiated contract savings or demand rationalization programs.</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="bg-white/10 border border-white/20 text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-md text-white">
              Spend Avoidance Tracker
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Inputs Section (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Strategic Procurement Details
            </h3>

            {/* Initiative Title */}
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700 dark:text-slate-350 text-xs">
                Initiative Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. AWS bulk reserved instances renegotiation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] text-sm rounded-xl outline-none text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Spend Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm cursor-pointer"
                >
                  <option value="IT Services">IT Services</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Legal">Legal</option>
                  <option value="Services">Services</option>
                </select>
              </div>

              {/* Associated Vendor */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">
                  Associated Supplier <span className="text-red-500">*</span>
                </label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm cursor-pointer"
                  required
                >
                  <option value="">-- Select Vendor Account --</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Savings Strategy</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm cursor-pointer"
                >
                  <option value="Negotiation">Commercial Rate Negotiation</option>
                  <option value="Volume Discount">Volume Consolidation Discount</option>
                  <option value="Process">Operational Process Optimization</option>
                  <option value="Demand Reduction">Demand Rationalization</option>
                  <option value="Specification Change">Material Specification Change</option>
                  <option value="Payment Terms">Payment Terms Arbitrage</option>
                </select>
              </div>

              {/* Recurring */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Schedule Frequency</label>
                <select
                  value={recurring}
                  onChange={(e) => setRecurring(e.target.value as any)}
                  className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm cursor-pointer"
                >
                  <option value="Recurring">Recurring Annual Savings</option>
                  <option value="One-Time">One-Time Avoidance Gain</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Status */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Initiative Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm cursor-pointer"
                >
                  <option value="Pipeline">Pipeline (Drafting)</option>
                  <option value="Projected">Projected (Target set)</option>
                  <option value="Realized">Realized (Verified cost cut)</option>
                  <option value="On Hold">On Hold (Deferred)</option>
                </select>
              </div>

              {/* Target Date */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Realization Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 border border-gray-200 dark:border-[#1F2937] rounded-xl bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Owner */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Strategic Owner</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] text-sm rounded-xl outline-none text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Initiative Strategy Notes</label>
              <div className="relative">
                <FileText className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                <textarea
                  rows={3}
                  placeholder="Summarize negotiation tactics, baseline benchmarks, audit terms, and renewal cycles..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-55/55 dark:bg-slate-900 border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm focus:bg-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Comparative Calculator (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Financial Optimization Audit
            </h3>

            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50/20 dark:from-[#121B1C] dark:to-[#132023] border border-emerald-100/30 dark:border-[#1F2937] rounded-2xl space-y-6 shadow-md">
              <div className="flex justify-between items-center border-b border-gray-200/50 dark:border-[#1F2937]/50 pb-3">
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest font-mono">Cost Clearance Covenants</span>
                <ClipboardCheck className="w-5 h-5 text-emerald-500" />
              </div>

              {/* Baseline Cost Input */}
              <div className="flex flex-col space-y-2">
                <label className="font-bold text-gray-400 dark:text-slate-500 uppercase text-[9px] tracking-wider">Annual Baseline Cost ($)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={baselineCost}
                    onChange={(e) => setBaselineCost(Number(e.target.value))}
                    className="w-full h-10 pl-8 pr-3 border border-gray-250 dark:border-[#1F2937] rounded-xl bg-white dark:bg-[#161B27] text-gray-900 dark:text-white outline-none focus:border-emerald-500 text-sm font-mono"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Negotiated Cost Input */}
              <div className="flex flex-col space-y-2">
                <label className="font-bold text-gray-400 dark:text-slate-500 uppercase text-[9px] tracking-wider">New Negotiated Cost ($)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={negotiatedCost}
                    onChange={(e) => setNegotiatedCost(Number(e.target.value))}
                    className="w-full h-10 pl-8 pr-3 border border-gray-250 dark:border-[#1F2937] rounded-xl bg-white dark:bg-[#161B27] text-gray-900 dark:text-white outline-none focus:border-emerald-500 text-sm font-mono"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Computed Live Avoidance */}
              {computedSavings > 0 ? (
                <div className="p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-xl space-y-3 font-mono text-xs text-gray-700 dark:text-slate-350 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <TrendingDown className="w-3.5 h-3.5" /> Savings / Yr
                    </span>
                    <strong className="text-gray-950 dark:text-white font-sans text-sm">${computedSavings.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Percent className="w-3.5 h-3.5" /> Margin avoidance
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-sans text-sm font-extrabold">{computedPercentage.toFixed(1)}%</strong>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-2 border-dashed border-gray-200 dark:border-[#1F2937] rounded-xl text-center text-gray-400 text-[11px] leading-relaxed">
                  Enter costs above. Savings rate computes dynamically.
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="lg:col-span-5 border-t border-gray-100 dark:border-[#1F2937] pt-6 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs text-gray-400 max-w-sm">
              Logging savings values allows financial officers to audit strategic avoidance indices against yearly budgeting targets.
            </span>
            <div className="flex items-center gap-3 font-semibold">
              <button
                type="button"
                onClick={() => setCurrentPage('savings')}
                className="px-6 py-3 border border-gray-250 dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#161B27] text-gray-700 dark:text-slate-300 rounded-xl text-xs transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
              >
                <PiggyBank className="w-4 h-4" /> Save Initiative
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
