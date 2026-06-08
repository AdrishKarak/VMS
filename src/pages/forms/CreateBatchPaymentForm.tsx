import React, { useState, useMemo } from 'react';
import { useVMS } from '../../vmsContext';
import { Layers, ArrowLeft, Calendar, CreditCard, DollarSign, Users, CheckSquare, Square, CheckCircle2 } from 'lucide-react';

export const CreateBatchPaymentForm: React.FC = () => {
  const { invoices, addBatchPayment, addToast, setCurrentPage } = useVMS();

  // Form states
  const [batchName, setBatchName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ACH' | 'Wire' | 'Check' | 'Bank Transfer'>('ACH');
  const [scheduledDate, setScheduledDate] = useState(() => {
    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);

  // Filter for pending invoices that are unpaid
  const pendingInvoices = useMemo(() => {
    return invoices.filter(inv => inv.status !== 'Paid' && inv.paymentStatus !== 'Paid');
  }, [invoices]);

  // Selected invoices list
  const selectedInvoices = useMemo(() => {
    return pendingInvoices.filter(inv => selectedInvoiceIds.includes(inv.id));
  }, [pendingInvoices, selectedInvoiceIds]);

  // Dynamically calculate batch summary based on selected invoices
  const totalAmount = useMemo(() => {
    return selectedInvoices.reduce((sum, inv) => sum + inv.total, 0);
  }, [selectedInvoices]);

  const uniqueVendorsCount = useMemo(() => {
    const vendors = new Set(selectedInvoices.map(inv => inv.vendorId));
    return vendors.size;
  }, [selectedInvoices]);

  // Handle invoice checkbox toggle
  const handleToggleInvoice = (invoiceId: string) => {
    setSelectedInvoiceIds(prev => 
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  // Select all pending invoices
  const handleSelectAllInvoices = () => {
    if (selectedInvoiceIds.length === pendingInvoices.length) {
      setSelectedInvoiceIds([]);
    } else {
      setSelectedInvoiceIds(pendingInvoices.map(inv => inv.id));
    }
  };

  const handleSubmitBatch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!batchName.trim()) {
      addToast('error', 'Incomplete Form', 'Please provide a descriptive name for the batch payment.');
      return;
    }

    if (selectedInvoiceIds.length === 0) {
      addToast('error', 'No Invoices Selected', 'Please select at least one invoice to include in the batch payment.');
      return;
    }

    addBatchPayment({
      name: batchName,
      paymentMethod,
      scheduledDate,
      invoiceRefs: selectedInvoiceIds,
      totalAmount,
      vendorCount: uniqueVendorsCount
    });

    setCurrentPage('batch-payments');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0D14] text-gray-900 dark:text-[#E2E8F0] p-6 lg:p-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-[#111622] border border-gray-200 dark:border-[#1F2937] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div id="form-header-banner" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-655 p-8 text-white flex items-center justify-between form-header-gradient">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setCurrentPage('batch-payments')}
              type="button"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-white"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-2xl font-extrabold font-roboto tracking-wide flex items-center gap-3 text-white">
                <Layers className="w-7 h-7 text-indigo-200" /> Batch Clearing Run Planner
              </h2>
              <p className="text-white text-white/80 text-xs mt-1">Bundle multiple pending invoices into a single unified disbursal execution run.</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="bg-white/10 border border-white/20 text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-md text-white">
              Bulk Treasury Settlements
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitBatch} className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Inputs Section (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Batch Definition & Logistics
            </h3>

            {/* Batch Name */}
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700 dark:text-slate-350 text-xs">
                Batch Run Name / Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Q2 Silicon Supplier Consolidated Settlement"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="w-full h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] text-sm rounded-xl outline-none text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                required
              />
            </div>

            {/* Payment Method & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Payment Method</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full h-11 pl-11 pr-4 border border-gray-200 dark:border-[#1F2937] rounded-xl bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm cursor-pointer"
                  >
                    <option value="ACH">ACH Direct Disbursal</option>
                    <option value="Wire">International SWIFT Wire</option>
                    <option value="Check">Treasury Check Clearing</option>
                    <option value="Bank Transfer">Bank Wire Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Scheduled Settlement Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 border border-gray-200 dark:border-[#1F2937] rounded-xl bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Invoices Selection List */}
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-[#1F2937]">
                <label className="font-bold text-gray-400 dark:text-gray-500 uppercase text-[10px] tracking-wider">
                  Choose Pending Invoices ({pendingInvoices.length})
                </label>
                {pendingInvoices.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAllInvoices}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {selectedInvoiceIds.length === pendingInvoices.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>

              {pendingInvoices.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-gray-200 dark:border-[#1F2937] rounded-2xl text-center text-gray-400 dark:text-slate-500 italic">
                  All outstanding invoices are fully cleared! No pending balances.
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 border border-gray-200 dark:border-[#1F2937] rounded-2xl p-4 bg-gray-50/10 dark:bg-slate-900/5 shadow-inner">
                  {pendingInvoices.map((inv) => {
                    const isChecked = selectedInvoiceIds.includes(inv.id);
                    return (
                      <div
                        key={inv.id}
                        onClick={() => handleToggleInvoice(inv.id)}
                        className={`flex items-start gap-4 p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                          isChecked 
                            ? 'bg-indigo-50/20 dark:bg-indigo-900/10 border-indigo-500/30' 
                            : 'border-gray-150 dark:border-slate-800/30 hover:border-gray-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="mt-0.5 text-indigo-600">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-300 dark:text-slate-700" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                            <span className="font-mono text-indigo-500 dark:text-indigo-455 text-xs">{inv.id}</span>
                            <span className="font-mono text-sm">${inv.total.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-400 dark:text-slate-500 mt-1">
                            <span className="truncate max-w-[180px]">{inv.vendorName}</span>
                            <span>Due: {inv.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Live Summary View (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Aggregated Run Metrics
            </h3>

            {selectedInvoiceIds.length > 0 ? (
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50/20 dark:from-[#141928] dark:to-[#1D172E] border border-indigo-100/30 dark:border-[#1F2937] rounded-2xl space-y-5 shadow-md animate-fade-in">
                <div className="flex justify-between items-center border-b border-gray-200/50 dark:border-[#1F2937]/50 pb-3">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest font-mono">Consolidated Settlement</span>
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 animate-pulse" />
                </div>

                <div className="space-y-4 font-mono text-xs text-gray-655 dark:text-slate-350">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-450">
                      <Layers className="w-4 h-4" /> Selected Invoices
                    </span>
                    <strong className="text-gray-950 dark:text-white font-sans text-sm">{selectedInvoiceIds.length} bills</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-455">
                      <Users className="w-4 h-4" /> Distinct Vendors
                    </span>
                    <strong className="text-gray-955 dark:text-white font-sans text-sm">{uniqueVendorsCount} suppliers</strong>
                  </div>

                  <div className="flex justify-between items-center border-t dark:border-indigo-950/40 pt-4 mt-4">
                    <span className="flex items-center gap-2 text-gray-455 font-bold">
                      <DollarSign className="w-4 h-4" /> Grand Total Clearing
                    </span>
                    <strong className="text-xl text-indigo-650 dark:text-indigo-400 font-extrabold font-sans">
                      ${totalAmount.toLocaleString()} USD
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-44 p-6 border-2 border-dashed border-gray-250 dark:border-[#1F2937] rounded-2xl flex flex-col items-center justify-center text-center text-gray-400 dark:text-slate-500">
                <Layers className="w-8 h-8 mb-2 stroke-[1.5] text-gray-300 dark:text-slate-700" />
                <p className="text-xs">Mark one or more pending bills from the invoice selector list to compute the aggregate settlement ledger run.</p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="lg:col-span-5 border-t border-gray-100 dark:border-[#1F2937] pt-6 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs text-gray-400 max-w-md">
              Batch processing runs gather bills under a single descriptor to streamline matching and accounting overhead.
            </span>
            <div className="flex items-center gap-3 font-semibold">
              <button
                type="button"
                onClick={() => setCurrentPage('batch-payments')}
                className="px-6 py-3 border border-gray-250 dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#161B27] text-gray-700 dark:text-slate-300 rounded-xl text-xs transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedInvoiceIds.length === 0}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Layers className="w-4 h-4" /> Run Batch Disbursal
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
