import React, { useState } from 'react';
import { useVMS } from '../../vmsContext';
import { PackageSearch, ArrowLeft, Layers, DollarSign, Clock, Barcode, CheckCircle2 } from 'lucide-react';

export const AddRegistryItemForm: React.FC = () => {
  const { vendors, addToast, setCurrentPage, itemsRegistry, setItemsRegistry } = useVMS() as any;

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Raw Materials');
  const [preferredVendor, setPreferredVendor] = useState('');
  const [unit, setUnit] = useState('units');
  const [unitPrice, setUnitPrice] = useState(0);
  const [stockClass, setStockClass] = useState('Class A');
  const [leadTime, setLeadTime] = useState('7 days');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      addToast('error', 'Incomplete Form', 'Please provide an item name.');
      return;
    }

    // Add registry item
    const itemCode = `ITM-${1000 + (itemsRegistry?.length || 0) + 1}`;
    const newItem = {
      code: itemCode,
      sku: itemCode,
      name,
      category,
      preferredVendor: preferredVendor || 'Generic supplier',
      unit,
      unitPrice,
      stockClass,
      leadTime,
      stockLevel: 100,
      minStock: 20
    };

    if (setItemsRegistry) {
      setItemsRegistry((prev: any) => [...prev, newItem]);
    }

    addToast('success', 'Registry Item Added', `Successfully added ${name} to items registry.`);
    setCurrentPage('items-registry');
  };

  const calculatedSKU = `ITM-2026-${(1000 + (itemsRegistry?.length || 0) + 1).toString()}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0D14] text-gray-900 dark:text-[#E2E8F0] p-6 lg:p-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-[#111622] border border-gray-200 dark:border-[#1F2937] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div id="form-header-banner" className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-650 p-8 text-white flex items-center justify-between form-header-gradient">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setCurrentPage('items-registry')}
              type="button"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-white"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-2xl font-extrabold font-roboto tracking-wide flex items-center gap-3 text-white">
                <PackageSearch className="w-7 h-7 text-sky-200" /> Catalog SKU Registry
              </h2>
              <p className="text-white text-white/80 text-xs mt-1">Register new stock keeping units or service items in the global procurement inventory database.</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="bg-white/10 border border-white/20 text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-md text-white">
              Inventory Ledger System
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Inputs Section (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Item Parameters & Classifications
            </h3>

            {/* Item Name */}
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700 dark:text-slate-350 text-xs">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 12-inch silicon wafer blanks"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] text-sm rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Registry Category</label>
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

              {/* Preferred Supplier */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Preferred Supplier</label>
                <select
                  value={preferredVendor}
                  onChange={(e) => setPreferredVendor(e.target.value)}
                  className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm cursor-pointer"
                >
                  <option value="">-- Select Vendor --</option>
                  {vendors.map((v: any) => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Unit */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Billing / Unit Class</label>
                <input
                  type="text"
                  placeholder="e.g. pack, box, hours, units"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-11 px-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] text-sm rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  required
                />
              </div>

              {/* Unit Price */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Base Unit Cost ($)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full h-11 pl-10 pr-4 border border-gray-200 dark:border-[#1F2937] rounded-xl bg-gray-55/55 dark:bg-[#161B27] text-gray-905 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-mono"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stock Class */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Inventory Priority Class</label>
                <select
                  value={stockClass}
                  onChange={(e) => setStockClass(e.target.value)}
                  className="w-full h-11 border border-gray-200 dark:border-[#1F2937] rounded-xl px-3 bg-gray-55/55 dark:bg-[#161B27] text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm cursor-pointer"
                >
                  <option value="Class A">Class A (High Value / Critical)</option>
                  <option value="Class B">Class B (Medium Value)</option>
                  <option value="Class C">Class C (Low Value / High Volume)</option>
                </select>
              </div>

              {/* Lead Time */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700 dark:text-slate-355 text-xs">Lead Time Vetting</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. 5 days, 2 weeks"
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 bg-gray-55/55 dark:bg-[#161B27] border border-gray-200 dark:border-[#1F2937] text-sm rounded-xl outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Catalog Barcode preview (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2 border-b border-gray-100 dark:border-[#1F2937]">
              Live Catalog Preview
            </h3>

            {name.trim() ? (
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/25 dark:from-[#131A27] dark:to-[#191F33] border border-blue-100/30 dark:border-[#1F2937] rounded-2xl space-y-5 shadow-md font-mono text-xs animate-fade-in">
                <div className="flex justify-between items-center border-b border-gray-200/50 dark:border-[#1F2937]/50 pb-3">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Catalog SKU Code</span>
                    <strong className="text-sm text-gray-905 dark:text-white font-extrabold">{calculatedSKU}</strong>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                </div>

                <div className="space-y-3 text-gray-655 dark:text-slate-350">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Item Description</span>
                    <span className="text-gray-955 dark:text-white font-sans text-sm font-bold leading-tight block mt-1">{name}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Supplier Link</span>
                      <span className="text-gray-805 dark:text-slate-200 font-sans text-[11px] truncate block mt-0.5">{preferredVendor || 'Generic supplier'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Base Price</span>
                      <span className="text-blue-600 dark:text-blue-400 font-sans text-xs font-bold block mt-0.5">${unitPrice.toLocaleString()} per {unit}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t dark:border-[#1F2937]/50 pt-4 flex flex-col items-center justify-center space-y-1 bg-white/45 dark:bg-black/10 p-3 rounded-xl">
                  <Barcode className="w-28 h-12 stroke-[1.2] text-gray-800 dark:text-slate-300" />
                  <span className="text-[9px] text-gray-450 dark:text-slate-500 font-bold tracking-widest uppercase">{calculatedSKU}</span>
                </div>
              </div>
            ) : (
              <div className="h-44 p-6 border-2 border-dashed border-gray-250 dark:border-[#1F2937] rounded-2xl flex flex-col items-center justify-center text-center text-gray-400 dark:text-slate-500">
                <Barcode className="w-8 h-8 mb-2 stroke-[1.5] text-gray-300 dark:text-slate-700" />
                <p className="text-xs">Provide an item description name on the left panel to dynamically draft the inventory barcode listing.</p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="lg:col-span-5 border-t border-gray-100 dark:border-[#1F2937] pt-6 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs text-gray-400 max-w-sm">
              Registered items immediately populate the items registry ledger and become eligible select targets for Purchase Order line entries.
            </span>
            <div className="flex items-center gap-3 font-semibold">
              <button
                type="button"
                onClick={() => setCurrentPage('items-registry')}
                className="px-6 py-3 border border-gray-250 dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#161B27] text-gray-700 dark:text-slate-300 rounded-xl text-xs transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
              >
                <PackageSearch className="w-4 h-4" /> Save Item
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
