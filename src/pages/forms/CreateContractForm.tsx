import React, { useState } from 'react';
import { useVMS } from '../../vmsContext';
import { FileText, ArrowLeft, Calendar, DollarSign, User, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const CreateContractForm: React.FC = () => {
  const { vendors, addContract, addToast, setCurrentPage } = useVMS();

  // Form states
  const [vendorId, setVendorId] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'MSA' | 'SLA' | 'NDA' | 'Addendum' | 'SOW'>('MSA');
  const [value, setValue] = useState(50000);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split('T')[0];
  });
  const [owner, setOwner] = useState('Alex Mercer');
  const [autoRenew, setAutoRenew] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendorId || !title.trim()) {
      addToast('error', 'Incomplete Form', 'Please provide a contract title and select a vendor.');
      return;
    }

    const selectedVendor = vendors.find(v => v.id === vendorId);
    if (!selectedVendor) return;

    addContract({
      vendorId,
      vendorName: selectedVendor.name,
      title,
      type,
      status: 'Draft',
      value,
      startDate,
      endDate,
      daysRemaining: 365,
      owner,
      autoRenew,
      noticePeriod: '30 Days',
      governingLaw: 'Delaware',
      kpis: [],
      specialTerms: 'Standard corporate framework service agreements.'
    });

    setCurrentPage('contracts');
  };

  const selectedVendor = vendors.find(v => v.id === vendorId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0D14] text-gray-900 dark:text-[#E2E8F0] p-6 lg:p-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-[#111622] border border-gray-200 dark:border-[#1F2937] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div id="form-header-banner" className="bg-gradient-to-r from-blue-700 via-indigo-755 to-indigo-660 p-8 text-white flex items-center justify-between form-header-gradient">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setCurrentPage('contracts')}
              type="button"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-white"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-2xl font-extrabold font-roboto tracking-wide flex items-center gap-3 text-white">
                <FileText className="w-7 h-7 text-indigo-200" /> Legal Agreement Builder
              </h2>
              <p className="text-white text-white/80 text-xs mt-1">Register new service level agreements, nondisclosure covenants, or master framework contracts.</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="bg-white/10 border border-white/20 text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-md text-white">
              Legal Covenants Control
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Inputs Section (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Agreement Specifications
            </h3>

            {/* Contract Title */}
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700 dark:text-slate-350 text-xs">
                Agreement Name / Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Master Services Agreement for silicon raw materials supply"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] text-sm rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vendor Selection */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">
                  Vendor Party Account <span className="text-red-500">*</span>
                </label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm cursor-pointer"
                  required
                >
                  <option value="">-- Choose Vendor Account --</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                  ))}
                </select>
              </div>

              {/* Agreement Type */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Agreement Vetting Class</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm cursor-pointer"
                >
                  <option value="MSA">Master Services Agreement (MSA)</option>
                  <option value="SLA">Service Level Agreement (SLA)</option>
                  <option value="SOW">Statement of Work (SOW)</option>
                  <option value="NDA">Non-Disclosure Agreement (NDA)</option>
                  <option value="Addendum">Addendum Amendment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contract Value */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Total Agreement Valuation ($)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full h-11 pl-11 pr-4 border border-gray-200 dark:border-[#1F2937] rounded-xl bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-mono"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Owner */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Strategic Contract Owner</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Alex Mercer"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] rounded-xl outline-none text-gray-905 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Contract Effective Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 border border-gray-200 dark:border-[#1F2937] rounded-xl bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                    required
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Contract Expiration Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 border border-gray-200 dark:border-[#1F2937] rounded-xl bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Auto Renew checkbox */}
            <label className="flex items-start gap-3 p-3.5 border dark:border-[#1F2937] rounded-xl bg-gray-50/20 dark:bg-slate-900/10 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className="mt-1 accent-blue-600 scale-105"
              />
              <div>
                <strong className="font-bold text-gray-900 dark:text-slate-200 block text-xs leading-none">Enable Automated Renewal</strong>
                <span className="text-[10.5px] text-gray-400 block mt-1">
                  Enabling this enforces automatic 12-month extensions upon reaching the expiration period unless written disputes are filed.
                </span>
              </div>
            </label>
          </div>

          {/* Right Column: Legal Agreement Preview (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Legal Agreement Summary
            </h3>

            {title.trim() && vendorId ? (
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50/20 dark:from-[#131627] dark:to-[#181D33] border border-indigo-100/30 dark:border-[#1F2937] rounded-2xl space-y-5 shadow-md font-mono text-xs animate-fade-in">
                <div className="flex justify-between items-center border-b border-gray-200/50 dark:border-[#1F2937]/50 pb-3">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Document Vetting Class</span>
                    <strong className="text-sm text-gray-900 dark:text-white font-extrabold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" /> MSA Agreement
                    </strong>
                  </div>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold px-2 py-0.5 rounded text-[9px] uppercase border dark:border-blue-900/60 font-sans">
                    Draft Status
                  </span>
                </div>

                <div className="space-y-4 text-gray-655 dark:text-slate-350">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Agreement Title</span>
                    <span className="text-gray-955 dark:text-white font-sans text-sm font-bold leading-tight block mt-1">{title}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">First Signee Party</span>
                      <span className="text-gray-900 dark:text-white font-sans text-[11px] truncate block mt-0.5">{selectedVendor?.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Strategic Owner</span>
                      <span className="text-gray-900 dark:text-white font-sans text-[11px] block mt-0.5">{owner}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/45 dark:bg-black/10 rounded-xl space-y-1.5 border dark:border-[#1F2937]/30 text-[10px]">
                    <div className="flex justify-between">
                      <span>Valuation Limit:</span>
                      <strong className="text-gray-900 dark:text-white">${value.toLocaleString()} USD</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Renewal Covenant:</span>
                      <strong>{autoRenew ? 'Auto-renew active' : 'Manual negotiation'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Governing Jurisdiction:</span>
                      <strong>State of Delaware</strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-44 p-6 border-2 border-dashed border-gray-250 dark:border-[#1F2937] rounded-2xl flex flex-col items-center justify-center text-center text-gray-400 dark:text-slate-500">
                <FileText className="w-8 h-8 mb-2 stroke-[1.5] text-gray-300 dark:text-slate-700" />
                <p className="text-xs">Provide a contract name and select an associated supplier on the left panel to load the live legal document draft.</p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="lg:col-span-5 border-t border-gray-100 dark:border-[#1F2937] pt-6 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs text-gray-400 max-w-sm">
              Agreements remain inactive in "Draft" state upon creation, pending audit vetting runs and signature dispatch.
            </span>
            <div className="flex items-center gap-3 font-semibold">
              <button
                type="button"
                onClick={() => setCurrentPage('contracts')}
                className="px-6 py-3 border border-gray-250 dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#161B27] text-gray-700 dark:text-slate-300 rounded-xl text-xs transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-755 text-white rounded-xl text-xs shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Contract
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
