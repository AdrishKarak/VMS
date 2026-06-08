import React, { useState, useMemo } from 'react';
import { useVMS } from '../vmsContext';
import { Vendor } from '../types';
import {
  Award,
  TrendingUp,
  TrendingDown,
  Calendar,
  Layers,
  Sparkles,
  BarChart4,
  Target,
  FileCheck2,
  Users,
  ChevronDown,
  ArrowRight,
  Eye,
  AlertCircle,
  FileWarning,
  Plus,
  Compass
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

export const Performance: React.FC = () => {
  const { vendors, addToast } = useVMS();

  // Selected period
  const [period, setPeriod] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4' | 'All'>('All');

  // Selected vendor node for deep-dive Scorecard Modal/Drawer
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

  // Filter and sort for Top 3 and Bottom 3 leaders
  const sortedByPerformance = useMemo(() => {
    return [...vendors].sort((a, b) => b.performanceScore - a.performanceScore);
  }, [vendors]);

  const top3 = useMemo(() => sortedByPerformance.slice(0, 3), [sortedByPerformance]);
  const bottom3 = useMemo(() => [...sortedByPerformance].reverse().slice(0, 3).filter(v => v.performanceScore > 0), [sortedByPerformance]);

  // Map performance scores to multiple dimension indicators for the BarChart
  const barChartData = useMemo(() => {
    return vendors.slice(0, 8).map((v) => ({
      name: v.id,
      nameLong: v.name,
      Quality: Math.round(v.performanceScore * 1.02) > 100 ? 100 : Math.round(v.performanceScore * 1.02),
      Service: Math.round(v.performanceScore * 0.98) < 0 ? 0 : Math.round(v.performanceScore * 0.98),
      Cost: Math.round(v.performanceScore * 0.95),
      Compliance: v.performanceScore >= 80 ? 95 : 75
    }));
  }, [vendors]);

  // Scatter plot data mapping Performance vs Spend
  const scatterData = useMemo(() => {
    return vendors.map((v) => ({
      x: v.contractValue / 1000, // Spend in Thousands
      y: v.performanceScore,
      name: v.name,
      id: v.id
    }));
  }, [vendors]);

  // Active auditor modal detail
  const auditVendor = useMemo(() => {
    return vendors.find((v) => v.id === selectedAuditId) || null;
  }, [selectedAuditId, vendors]);

  return (
    <div className="pt-14 space-y-6 font-sans">
      {/* Top filter select header card */}
      <div className="bg-white dark:bg-[#161B27] border rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-[16px] font-semibold text-gray-950 dark:text-white uppercase tracking-wide">Performance Scorecard Metrics</h2>
          <span className="text-xs text-gray-400">Benchmarked analytics across quality delivery, SLA targets compliance, and price optimization.</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mr-2">Evaluation Period:</span>
          <div className="flex border rounded p-0.5 bg-gray-50/70 dark:bg-slate-800">
            {(['All', 'Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setPeriod(q)}
                className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${
                  period === q ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-slate-350'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION A: TOP 3 & BOTTOM 3 LEADERS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP PERFORMERS CARD (Gold Award) */}
        <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-803 rounded-md p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 pb-2 border-b border-gray-100 dark:border-slate-800">
            <Award className="w-5 h-5 stroke-[2.5]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Top Tier Category Leaders (Gold class)</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-800 space-y-3">
            {top3.map((v, i) => (
              <div key={v.id} className="pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-sans font-black text-gray-300 dark:text-slate-700 text-base">#{i + 1}</span>
                  <div>
                    <span className="font-bold text-gray-905 dark:text-white block">{v.name}</span>
                    <span className="text-[10px] text-gray-400 block font-mono mt-0.5">{v.id} · Cat: {v.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-[13.5px] text-emerald-600 dark:text-emerald-400 block">{v.performanceScore}/100</span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 font-bold px-1.5 py-0.5 rounded leading-none block mt-1">Excellent (SLA OK)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM PERFORMERS CARD (Critial Watch) */}
        <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-833 rounded-md p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 pb-2 border-b border-gray-150 dark:border-slate-805">
            <FileWarning className="w-5 h-5 stroke-[2.5]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-755">Underperforming Watchlist (Performance Audit required)</h3>
          </div>
          <div className="divide-y divide-gray-101 dark:divide-slate-800 space-y-3">
            {bottom3.map((v, i) => (
              <div key={v.id} className="pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-sans font-black text-gray-300 dark:text-slate-700 text-base">#{bottom3.length - i}</span>
                  <div>
                    <span className="font-bold text-gray-905 dark:text-white block">{v.name}</span>
                    <span className="text-[10px] text-gray-400 block font-mono mt-0.5">{v.id} · Spend: ${(v.contractValue / 1000).toFixed(0)}k</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-[13.5px] text-red-650 dark:text-red-400 block">{v.performanceScore}/100</span>
                  <span className="text-[9px] bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-400 border border-red-100 font-bold px-1.5 py-0.5 rounded leading-none block mt-1">Action plan advised</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION B: MULTIPLE RECHARTS CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* CHART 1: Multi-metric Grouped BarChart (60%) */}
        <div className="bg-white dark:bg-[#161B27] border p-5 rounded-md shadow-sm xl:col-span-3 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 leading-none">Factor score dimensions benchmark</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" className="hidden dark:block" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '4px', color: '#FFF' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Quality" fill="#2563EB" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Service" fill="#10B981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Compliance" fill="#F59E0B" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Performance vs Spend ScatterPlot (40%) */}
        <div className="bg-white dark:bg-[#161B27] border p-5 rounded-md shadow-sm xl:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 leading-none">Spend value vs performance matrix</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" className="hidden dark:block" />
                <XAxis type="number" dataKey="x" name="Spend" unit="k" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis type="number" dataKey="y" name="Score" domain={[50, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <ZAxis dataKey="name" name="Vendor" />
                <RechartsTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '4px', color: '#FFF', fontSize: '11px' }}
                />
                <Scatter name="Providers" data={scatterData} fill="#6366F1" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION C: PERFORMANCE AUDIT LEDGER ROW TRIGGERS */}
      <div className="bg-white dark:bg-[#161B27] border rounded-md shadow-sm overflow-hidden text-xs">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/45 dark:bg-slate-900/10">
          <h3 className="font-bold text-gray-900 dark:text-slate-205 uppercase tracking-wider text-[11px]">Audit ledger rosters</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-widest">
            <tr>
              <th className="p-3 pl-4">Provider Code</th>
              <th className="p-3">Partner Legal Representative</th>
              <th className="p-3">Category Class</th>
              <th className="p-3 text-center">Score rating</th>
              <th className="p-3">Audit status</th>
              <th className="p-3">Vetting validation</th>
              <th className="p-3 text-right">Operational triggers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-slate-700 dark:text-slate-300">
            {vendors.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50/20">
                <td className="p-3 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">{v.id}</td>
                <td className="p-3 font-semibold">{v.name}</td>
                <td className="p-3">{v.category}</td>
                <td className="p-3 text-center">
                  <span className="font-mono font-extrabold text-[12.5px] text-gray-900 dark:text-white">{v.performanceScore}/100</span>
                </td>
                <td className="p-3">
                  <span className={`inline-block border text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                    v.performanceScore >= 85 ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-800 border-amber-100'
                  }`}>
                    {v.performanceScore >= 85 ? 'Optimized' : 'Evaluation Recommended'}
                  </span>
                </td>
                <td className="p-3">Verified 2026-06</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => {
                      setSelectedAuditId(v.id);
                    }}
                    className="px-2.5 py-1.5 border border-indigo-250 text-indigo-700 hover:bg-slate-50 hover:border-slate-300 dark:text-slate-300 hover:dark:bg-slate-800 font-semibold cursor-pointer rounded"
                  >
                    Performance Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECTION C: DETAILED PERFORMANCE ASSESSMENT SCORECARD DRAWER */}
      {selectedAuditId && auditVendor && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-40" onClick={() => setSelectedAuditId(null)} />

          {/* Slide out Drawer / Drawer Panel from right */}
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-[500px] bg-white dark:bg-[#161B27] border-l dark:border-[#1F2937] shadow-[0_0_50px_rgba(0,0,0,0.3)] z-50 flex flex-col font-sans py-6 px-7 slide-in-right transform transition-transform duration-300 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-base font-semibold text-gray-950 dark:text-white uppercase">SLA Audit Scorecard</h2>
                  <span className="text-[11px] text-gray-400 font-mono block">Node mapping: {auditVendor.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAuditId(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded font-bold text-gray-400 hover:text-gray-900"
              >
                &times; Close
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 space-y-6 text-xs font-sans">
              {/* Score card summary and details banner */}
              <div className="p-5 bg-blue-50/10 border dark:border-slate-800 rounded text-center space-y-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black block">Compound Score Average</span>
                <strong className="text-3xl font-roboto font-bold text-blue-600 block">{auditVendor.performanceScore}/100</strong>
                <span className="text-[11px] text-gray-500 font-medium block">Evaluation benchmark standard: 80%</span>
              </div>

              {/* Sub-dimension grading sliders */}
              <div className="space-y-4">
                <h3 className="font-bold uppercase tracking-wider text-[#CBD5E1]">Evaluation Dimension Indicators</h3>

                {/* Slider 1: Quality SLA */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-gray-400 font-bold uppercase text-[10.5px]">
                    <span>Product & Deliverables Quality</span>
                    <span className="font-bold font-mono text-gray-950 dark:text-white">{Math.round(auditVendor.performanceScore * 1.02) > 100 ? 100 : Math.round(auditVendor.performanceScore * 1.02)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded">
                    <div className="h-full bg-emerald-500 rounded" style={{ width: `${Math.round(auditVendor.performanceScore * 1.02)}%` }} />
                  </div>
                </div>

                {/* Slider 2: Lead times */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-gray-400 font-bold uppercase text-[10.5px]">
                    <span>Response times & support SLA</span>
                    <span className="font-bold font-mono text-gray-950 dark:text-white">{Math.round(auditVendor.performanceScore * 0.98)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded">
                    <div className="h-full bg-blue-500 rounded" style={{ width: `${Math.round(auditVendor.performanceScore * 0.98)}%` }} />
                  </div>
                </div>

                {/* Slider 3: Financial Pricing */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-gray-400 font-bold uppercase text-[10.5px]">
                    <span>Cost Management & pricing adherence</span>
                    <span className="font-bold font-mono text-gray-950 dark:text-white">{Math.round(auditVendor.performanceScore * 0.95)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded">
                    <div className="h-full bg-indigo-500 rounded" style={{ width: `${Math.round(auditVendor.performanceScore * 0.95)}%` }} />
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-gray-100 dark:bg-slate-800" />

              {/* Performance improvement plan editor form controls */}
              <div className="space-y-3.5">
                <h3 className="font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  Performance Improvement Covenant Plan (PIP)
                </h3>
                <p className="text-gray-400 leading-relaxed font-semibold">
                  Specify corrective activities if SLA deliverables remain below limits.
                </p>

                <div className="p-3.5 border border-amber-100 bg-amber-50/10 rounded space-y-2 text-slate-705 dark:text-slate-350">
                  <label className="flex gap-2 items-start cursor-pointer select-none">
                    <input type="checkbox" defaultChecked className="mt-0.5 scale-110" />
                    <span>Deploy bi-weekly quality assurance monitoring registers.</span>
                  </label>
                  <label className="flex gap-2 items-start cursor-pointer select-none">
                    <input type="checkbox" defaultChecked={auditVendor.performanceScore < 80} className="mt-0.5 scale-110" />
                    <span>Verify raw materials logs via 3rd party certification path.</span>
                  </label>
                  <label className="flex gap-2 items-start cursor-pointer select-none">
                    <input type="checkbox" className="mt-0.5 scale-110" />
                    <span>Deescalate outstanding payment processing terms cycles.</span>
                  </label>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-450 uppercase text-[10px]">Add Custom Action Task</label>
                  <input
                    type="text"
                    placeholder="Enter actionable KPI remediation task..."
                    className="h-[36px] bg-transparent border dark:border-[#1F2937] text-xs outline-none px-2 rounded focus:border-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addToast('success', 'Plan modification saved', 'Successfully injected new actionable target checklist.');
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Footer with modal submit triggers */}
            <div className="border-t pt-4 mt-6 flex justify-end gap-2 flex-shrink-0">
              <button
                onClick={() => setSelectedAuditId(null)}
                className="px-4 py-2 border rounded font-semibold text-xs text-gray-700 hover:bg-gray-100"
              >
                Back To Ledger
              </button>
              <button
                onClick={() => {
                  addToast('success', 'Scorecard updated', `Audit evaluations on ${auditVendor.name} recorded to log matrices.`);
                  setSelectedAuditId(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded hover:bg-blue-700"
              >
                Save Appraisal Audit
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
