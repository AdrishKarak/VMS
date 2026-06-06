import React, { useMemo } from 'react';
import { useVMS } from '../vmsContext';
import { CATEGORY_COLORS } from '../mockData';
import {
  GitCompare,
  Trash2,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star,
  Users,
  AlertCircle
} from 'lucide-react';

export const Compare: React.FC = () => {
  const {
    vendors,
    comparedVendors,
    toggleCompareVendor,
    clearComparedVendors,
    setCurrentPage,
    setSelectedVendorId,
    addToast
  } = useVMS();

  // Look up full vendor objects in selection
  const selectedVendorsList = useMemo(() => {
    return vendors.filter((v) => comparedVendors.includes(v.id)).slice(0, 4);
  }, [vendors, comparedVendors]);

  const handleRemoveCompare = (id: string, name: string) => {
    toggleCompareVendor(id);
    addToast('info', 'Comparison removed', `Removed ${name} from comparing queue.`);
  };

  const getRiskColor = (score: number) => {
    if (score < 40) return 'text-emerald-600 bg-emerald-50';
    if (score < 70) return 'text-amber-600 bg-amber-50';
    return 'text-red-650 bg-red-50';
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Upper controls banner card */}
      <div className="bg-white dark:bg-[#161B27] p-4 rounded-md border border-gray-200 dark:border-gray-803 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-[16px] font-semibold text-gray-950 dark:text-white uppercase tracking-wide">Side-by-Side Comparison</h2>
          <span className="text-xs text-gray-400">Conduct multi-factor, quantitative vendor evaluations across spend, SLA compliance, risk and ESG.</span>
        </div>

        {comparedVendors.length > 0 && (
          <button
            onClick={() => {
              clearComparedVendors();
              addToast('info', 'Cleared Comparison list', 'Reset comparing roster registries.');
            }}
            className="px-3.5 py-1.5 border border-red-905 text-red-650 hover:bg-red-50 font-bold text-xs rounded transition flex items-center gap-1 leading-none mr-1 cursor-pointer"
          >
            <Trash2 className="w-4.5 h-4.5" />
            Clear items
          </button>
        )}
      </div>

      {/* RENDER COMPARISON MATRIX COLS */}
      {selectedVendorsList.length < 2 ? (
        /* PLACEHOLDER AND SELECTOR PANELS */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Instructions Panel */}
          <div className="bg-white dark:bg-[#161B27] border p-6 rounded-md shadow-sm space-y-4 lg:col-span-1 text-xs">
            <div className="w-12 h-12 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <GitCompare className="w-6 h-6 stroke-[2.3]" />
            </div>
            <h3 className="font-extrabold text-sm uppercase text-gray-901">Pick matching partners</h3>
            <p className="text-gray-400 leading-relaxed font-semibold">
              Select 2 to 4 vendors from the right-hand checklist matrix directory. We will compare their procurement contracts costs, ESG standards, risk matrices indices and support quality metrics side-by-side.
            </p>
          </div>

          {/* Checklist Selector Matrix */}
          <div className="bg-white dark:bg-[#161B27] border rounded-md shadow-sm xl:col-span-2 overflow-hidden text-xs">
            <div className="p-4 border-b bg-gray-50/50 dark:bg-slate-900/10 font-bold">
              Select providers for evaluation criteria comparison
            </div>
            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
              {vendors.map((v) => {
                const isChecked = comparedVendors.includes(v.id);
                return (
                  <label key={v.id} className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 select-none">
                    <div className="flex gap-3 items-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          toggleCompareVendor(v.id);
                          addToast('success', 'Roster lists modified', `Toggled comparison for ${v.name}.`);
                        }}
                        className="scale-110 cursor-pointer"
                      />
                      <div>
                        <strong className="font-extrabold text-gray-905 dark:text-white block">{v.name}</strong>
                        <span className="text-[10px] text-gray-400 block font-mono mt-0.5">{v.id} · Category: {v.category} · Score: {v.performanceScore}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 font-mono font-bold">${v.contractValue.toLocaleString()} spend</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* COMPARISON PANELS ROWS SIDE BY SIDE */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {selectedVendorsList.map((v) => {
            const tagStyles = CATEGORY_COLORS[v.category] || CATEGORY_COLORS['Other'];
            return (
              <div
                key={v.id}
                className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-803 rounded-md shadow p-5 space-y-5 flex flex-col justify-between relative overflow-hidden text-xs"
              >
                {/* Deselect trigger button */}
                <button
                  onClick={() => handleRemoveCompare(v.id, v.name)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-950 p-1 bg-gray-100 dark:bg-slate-800 rounded-full"
                  title="Remove from compare list"
                >
                  &times;
                </button>

                {/* Vendor Profile Header info */}
                <div className="text-center space-y-2 mt-2">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto uppercase">
                    {v.logoInitials}
                  </div>
                  <div>
                    <strong className="text-sm font-extrabold text-[#475569] dark:text-slate-105 block leading-tight truncate px-2">{v.name}</strong>
                    <span className="text-[10px] text-gray-400 font-mono block mt-1">{v.id}</span>
                  </div>
                  <div>
                    <span className={`inline-block text-[10px] font-bold px-1.5 rounded-sm ${tagStyles.bg} ${tagStyles.text}`}>
                      {v.category}
                    </span>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-100 dark:bg-slate-800" />

                {/* Score breakdown metrics list */}
                <div className="space-y-4 text-xs font-sans">
                  {/* Spend metric item */}
                  <div className="flex justify-between items-center bg-gray-50/50 p-2 border rounded">
                    <span className="text-gray-400 font-bold uppercase text-[9.5px]">Historical Spend</span>
                    <strong className="font-mono text-[12.5px] font-bold text-gray-955">${v.contractValue.toLocaleString()}</strong>
                  </div>

                  {/* Performance metric item */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-gray-400 uppercase text-[9.5px]">
                      <span>Performance rating</span>
                      <strong className="font-mono text-emerald-600">{v.performanceScore}/100</strong>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded">
                      <div className="h-full bg-emerald-500 rounded" style={{ width: `${v.performanceScore}%` }} />
                    </div>
                  </div>

                  {/* Risk metric item */}
                  <div className="space-y-1">
                    <span className="text-gray-400 block font-bold uppercase text-[9.5px]">Risk audit index</span>
                    <div className={`p-2 rounded text-center font-mono font-bold font-sans ${getRiskColor(v.riskScore)}`}>
                      {v.riskScore} / 100 Risk Band
                    </div>
                  </div>

                  {/* sustainability metric item */}
                  <div className="space-y-1">
                    <span className="text-gray-400 block font-bold uppercase text-[9.5px]">ESG Sustainability tier</span>
                    <div className="p-2 bg-indigo-50/50 text-indigo-805 rounded text-center font-black dark:bg-slate-800 dark:text-slate-200">
                      {v.esgTier || 'Gold'} (Score: {v.esgScore || 70}%)
                    </div>
                  </div>

                  {/* SLA Deliveries indicator */}
                  <div className="flex justify-between font-medium text-gray-550 dark:text-slate-400 pt-1">
                    <span>Target delivery SLA:</span>
                    <strong className="text-gray-901">94.8% SLA</strong>
                  </div>
                </div>

                {/* Card profile actions click */}
                <div className="pt-3 border-t">
                  <button
                    onClick={() => {
                      setSelectedVendorId(v.id);
                      setCurrentPage('vendor-detail');
                    }}
                    className="w-full py-2 bg-[#0F1729] hover:bg-slate-800 text-white font-bold rounded text-xs leading-none flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Inspect Profile profile
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
