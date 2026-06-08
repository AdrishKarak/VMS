import React, { useState } from 'react';
import { useVMS } from '../../vmsContext';
import { ShoppingCart, ArrowLeft, Calendar, DollarSign, FileText, CheckCircle2, Clipboard } from 'lucide-react';

export const CreatePOForm: React.FC = () => {
  const { vendors, addPurchaseOrder, addToast, setCurrentPage } = useVMS();

  // Form states
  const [vendorId, setVendorId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Raw Materials');
  const [qty, setQty] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Normal' | 'High' | 'Urgent'>('Normal');
  const [requiredBy, setRequiredBy] = useState(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 14); // 2 weeks out
    return defaultDate.toISOString().split('T')[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendorId || !title.trim()) {
      addToast('error', 'Incomplete Form', 'Please provide a PO title and select a vendor.');
      return;
    }

    const selectedVendor = vendors.find(v => v.id === vendorId);
    if (!selectedVendor) return;

    addPurchaseOrder({
      vendorId,
      vendorName: selectedVendor.name,
      title,
      category: category || selectedVendor.category,
      status: 'Draft',
      paymentStatus: 'Unpaid',
      amount: qty * unitPrice,
      itemsCount: qty,
      createdDate: new Date().toISOString().split('T')[0],
      requiredBy,
      approvedBy: 'Unassigned',
      paymentTerms: 'Net 30',
      shipToAddress: 'Primary Warehouse',
      priority: priority as any,
      notes: description || '',
      lineItems: [
        {
          code: 'PO-ITEM-01',
          description: description || title,
          qty,
          unit: 'units',
          unitPrice,
          discount: 0,
          taxRate: 0.08,
          total: qty * unitPrice
        }
      ]
    });

    setCurrentPage('purchase-orders');
  };

  const selectedVendor = vendors.find(v => v.id === vendorId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0D14] text-gray-900 dark:text-[#E2E8F0] p-6 lg:p-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-[#111622] border border-gray-200 dark:border-[#1F2937] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div id="form-header-banner" className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-650 p-8 text-white flex items-center justify-between form-header-gradient">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setCurrentPage('purchase-orders')}
              type="button"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-white"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-2xl font-extrabold font-roboto tracking-wide flex items-center gap-3 text-white">
                <ShoppingCart className="w-7 h-7 text-blue-200" /> Purchase Order Builder
              </h2>
              <p className="text-white text-white/80 text-xs mt-1">Generate a commercial purchase order dispatch for procurement items and vendor fulfilment.</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="bg-white/10 border border-white/20 text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-md text-white">
              Order Requisition Panel
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Inputs Section (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Requisition Profile
            </h3>

            {/* PO Title */}
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700 dark:text-slate-350 text-xs">
                PO Requisition Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Q2 hardware inventory restocking"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] text-sm rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vendor */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">
                  Target Vendor <span className="text-red-500">*</span>
                </label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm cursor-pointer"
                  required
                >
                  <option value="">-- Select Vendor --</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm cursor-pointer"
                >
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Office Supplies">Office Supplies</option>
                </select>
              </div>
            </div>

            {/* Line Item breakdown card */}
            <div className="border dark:border-[#1F2937] rounded-2xl p-5 space-y-4 bg-gray-50/20 dark:bg-slate-900/5 shadow-inner">
              <span className="font-bold text-gray-400 dark:text-gray-500 uppercase text-[10px] tracking-wider block border-b pb-2 dark:border-[#1F2937]/50">Primary Item Line</span>
              
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Item Description</label>
                <input
                  type="text"
                  placeholder="Line item description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] text-xs rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Quantity</label>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] text-xs rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 transition font-mono"
                    min="1"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Unit Cost ($)</label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(Number(e.target.value))}
                      className="w-full h-10 pl-8 pr-3 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] text-xs rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 transition font-mono"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Delivery date */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Required Delivery Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={requiredBy}
                    onChange={(e) => setRequiredBy(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 border border-gray-200 dark:border-[#1F2937] rounded-xl bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Priority */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Priority Classification</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm cursor-pointer"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Normal">Normal Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent Priority</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: PO slip voucher preview (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Commercial Voucher Slip
            </h3>

            {title.trim() && vendorId ? (
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/20 dark:from-[#131926] dark:to-[#171D2F] border border-blue-100/30 dark:border-[#1F2937] rounded-2xl space-y-5 shadow-md font-mono text-xs animate-fade-in">
                <div className="flex justify-between items-center border-b border-gray-200/50 dark:border-[#1F2937]/50 pb-3">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Document Vetting Class</span>
                    <strong className="text-sm text-gray-900 dark:text-white font-extrabold flex items-center gap-1">
                      <Clipboard className="w-3.5 h-3.5 text-blue-500" /> Purchase Order
                    </strong>
                  </div>
                  <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold px-2 py-0.5 rounded text-[9px] uppercase border dark:border-amber-900/60 font-sans">
                    Draft Status
                  </span>
                </div>

                <div className="space-y-4 text-gray-655 dark:text-slate-350">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">PO Covenants Title</span>
                    <span className="text-gray-955 dark:text-white font-sans text-sm font-bold leading-tight block mt-1">{title}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Fulfilment Partner</span>
                      <span className="text-gray-900 dark:text-white font-sans text-[11px] truncate block mt-0.5">{selectedVendor?.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Priority Status</span>
                      <span className="text-gray-900 dark:text-white font-sans text-[11px] block mt-0.5">{priority}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/45 dark:bg-black/10 rounded-xl space-y-1.5 border dark:border-[#1F2937]/30 text-[10px]">
                    <div className="flex justify-between">
                      <span>Quantity ordered:</span>
                      <strong className="text-gray-900 dark:text-white">{qty} units</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Standard Tax Rate:</span>
                      <strong>8% GST</strong>
                    </div>
                    <div className="flex justify-between border-t dark:border-[#1F2937]/50 pt-1.5 mt-1.5 text-gray-900 dark:text-white font-bold text-xs">
                      <span>Total Clearing Sum:</span>
                      <span className="text-blue-600 dark:text-blue-400">${(qty * unitPrice).toLocaleString()} USD</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-44 p-6 border-2 border-dashed border-gray-250 dark:border-[#1F2937] rounded-2xl flex flex-col items-center justify-center text-center text-gray-400 dark:text-slate-500">
                <ShoppingCart className="w-8 h-8 mb-2 stroke-[1.5] text-gray-300 dark:text-slate-700" />
                <p className="text-xs">Provide a PO Title and select an associated vendor on the left panel to display the live voucher slip draft.</p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="lg:col-span-5 border-t border-gray-100 dark:border-[#1F2937] pt-6 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs text-gray-400 max-w-sm">
              Purchase orders remain in "Draft" state upon creation, pending three-way invoice matching verification runs.
            </span>
            <div className="flex items-center gap-3 font-semibold">
              <button
                type="button"
                onClick={() => setCurrentPage('purchase-orders')}
                className="px-6 py-3 border border-gray-250 dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#161B27] text-gray-700 dark:text-slate-300 rounded-xl text-xs transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Purchase Order
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
