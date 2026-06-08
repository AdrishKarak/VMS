import React, { useState, useMemo } from 'react';
import { useVMS } from '../../vmsContext';
import { Wallet, ArrowLeft, Calendar, CreditCard, DollarSign, User, Building, FileText, CheckCircle2 } from 'lucide-react';

export const CreatePaymentForm: React.FC = () => {
  const { invoices, addPayment, addToast, setCurrentPage } = useVMS();

  // Form states
  const [payInvoiceRef, setPayInvoiceRef] = useState('');
  const [payMethod, setPayMethod] = useState<'Bank Transfer' | 'ACH' | 'Wire' | 'Check'>('ACH');
  const [payDate, setPayDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Find the selected invoice for auto-completion
  const selectedPaymentInvoice = useMemo(() => {
    return invoices.find(inv => inv.id === payInvoiceRef);
  }, [invoices, payInvoiceRef]);

  // Unpaid invoices for the dropdown selector
  const unpaidInvoices = useMemo(() => {
    return invoices.filter(inv => inv.status !== 'Paid' && inv.paymentStatus !== 'Paid');
  }, [invoices]);

  const handleCreatePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payInvoiceRef) {
      addToast('error', 'Incomplete Form', 'Please select an invoice reference.');
      return;
    }
    const inv = selectedPaymentInvoice;
    if (!inv) return;

    addPayment({
      vendorId: inv.vendorId,
      vendorName: inv.vendorName,
      invoiceRef: inv.id,
      amount: inv.total,
      currency: 'USD',
      method: payMethod,
      scheduledDate: payDate,
      processedDate: new Date().toISOString().split('T')[0],
      status: 'Scheduled',
      referenceNumber: `TXN-${100000 + Math.floor(Math.random() * 900000)}`
    });

    addToast('success', 'Clearance Dispatch Initialized', `Direct disbursal voucher scheduled for ${inv.id}`);
    setCurrentPage('payments');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0D14] text-gray-900 dark:text-[#E2E8F0] p-6 lg:p-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-[#111622] border border-gray-200 dark:border-[#1F2937] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300">
        
        {/* Header Bar */}
        <div id="form-header-banner" className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white flex items-center justify-between form-header-gradient">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setCurrentPage('payments')}
              type="button"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-white"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-2xl font-extrabold font-roboto tracking-wide flex items-center gap-3 text-white">
                <Wallet className="w-7 h-7 text-blue-200" /> Direct Disbursal Planner
              </h2>
              <p className="text-white text-white/80 text-xs mt-1">Schedule and dispatch individual cash disbursements for outstanding ledger accounts.</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="bg-white/10 border border-white/20 text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-md text-white">
              Finance Clearing House
            </span>
          </div>
        </div>

        {/* Spacious Grid Content */}
        <form onSubmit={handleCreatePaymentSubmit} className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Form Inputs Block (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Clearing Specifications
            </h3>

            {/* Select Invoice */}
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700 dark:text-slate-350 text-xs">
                Select Outstanding Invoice <span className="text-red-500">*</span>
              </label>
              <select
                value={payInvoiceRef}
                onChange={(e) => setPayInvoiceRef(e.target.value)}
                className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-4 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all duration-200 cursor-pointer"
                required
              >
                <option value="" className="dark:bg-[#111622]">-- Select Invoice from Outstanding Ledger --</option>
                {unpaidInvoices.map(inv => (
                  <option key={inv.id} value={inv.id} className="dark:bg-[#111622]">
                    {inv.id} - {inv.vendorName} (${inv.total.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Disbursal Method */}
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">
                Disbursal Method <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full h-11 pl-11 pr-4 border border-gray-200 dark:border-[#1F2937] rounded-xl bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all duration-200 cursor-pointer"
                >
                  <option value="ACH">ACH Transfer Direct</option>
                  <option value="Wire">International SWIFT Wire</option>
                  <option value="Bank Transfer">Direct Bank Transfer</option>
                  <option value="Check">Physical Check Clearance</option>
                </select>
              </div>
            </div>

            {/* Scheduled Dispatch Date */}
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">
                Scheduled Dispatch Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 border border-gray-200 dark:border-[#1F2937] rounded-xl bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column: Invoice Summary View (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Payment Summary
            </h3>

            {selectedPaymentInvoice ? (
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-[#131926] dark:to-[#171D2F] border border-blue-100/30 dark:border-[#1F2937] rounded-2xl space-y-4 shadow-inner animate-fade-in">
                <div className="flex justify-between items-start border-b border-gray-200/50 dark:border-[#1F2937]/50 pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest font-mono">Invoice Reference</span>
                    <strong className="text-base text-gray-900 dark:text-white block font-mono">{selectedPaymentInvoice.id}</strong>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>

                <div className="space-y-3 font-mono text-xs text-gray-655 dark:text-slate-350">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-400">
                      <Building className="w-4 h-4" /> Payee Vendor
                    </span>
                    <strong className="text-gray-900 dark:text-white font-sans">{selectedPaymentInvoice.vendorName}</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-400">
                      <FileText className="w-4 h-4" /> PO Reference
                    </span>
                    <strong className="text-gray-900 dark:text-white">{selectedPaymentInvoice.poReference}</strong>
                  </div>

                  <div className="flex justify-between items-center border-t dark:border-[#1F2937]/50 pt-3 mt-3">
                    <span className="flex items-center gap-2 text-gray-400 font-bold">
                      <DollarSign className="w-4 h-4" /> Clearing Sum
                    </span>
                    <strong className="text-lg text-blue-600 dark:text-blue-400 font-extrabold font-sans">
                      ${selectedPaymentInvoice.total.toLocaleString()} USD
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-44 p-6 border-2 border-dashed border-gray-250 dark:border-[#1F2937] rounded-2xl flex flex-col items-center justify-center text-center text-gray-400 dark:text-slate-500">
                <Wallet className="w-8 h-8 mb-2 stroke-[1.5] text-gray-300 dark:text-slate-700" />
                <p className="text-xs">Select an outstanding invoice from the left panel to load the disbursal summary ledger.</p>
              </div>
            )}
          </div>

          {/* Form Footer Covenants */}
          <div className="lg:col-span-5 border-t border-gray-100 dark:border-[#1F2937] pt-6 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs text-gray-400 max-w-md">
              Cleared transactions are automatically posted to the cash disbursement ledger and marked as "Scheduled" until processed.
            </span>
            <div className="flex items-center gap-3 font-semibold">
              <button
                type="button"
                onClick={() => setCurrentPage('payments')}
                className="px-6 py-3 border border-gray-250 dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#161B27] text-gray-700 dark:text-slate-300 rounded-xl text-xs transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!payInvoiceRef}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" /> Schedule Payment
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
