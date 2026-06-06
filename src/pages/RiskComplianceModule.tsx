import React, { useState, useMemo, useEffect } from 'react';
import { useVMS } from '../vmsContext';
import { Vendor } from '../types';
import {
  ShieldAlert,
  FileCheck2,
  Leaf,
  Activity,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Users,
  Compass,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  Info,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from 'recharts';

export const RiskComplianceModule: React.FC = () => {
  const {
    vendors,
    complianceDocs,
    activityLogs,
    addToast,
    currentPage
  } = useVMS();

  // Tab: 'risk' | 'compliance' | 'esg' | 'audit'
  const [tab, setTab] = useState<'risk' | 'compliance' | 'esg' | 'audit'>('risk');

  // Align active tab with outer route click
  useEffect(() => {
    if (currentPage === 'risk') {
      setTab('risk');
    } else if (currentPage === 'compliance') {
      setTab('compliance');
    } else if (currentPage === 'esg') {
      setTab('esg');
    } else if (currentPage === 'audit-logs') {
      setTab('audit');
    }
  }, [currentPage]);

  // Heatmap focus state
  const [selectedVendorChipId, setSelectedVendorChipId] = useState<string | null>(null);

  // Questionnaire accordion items state
  const [questionnaireActiveId, setQuestionnaireActiveId] = useState<number | null>(null);
  const [q1, setQ1] = useState(30);
  const [q2, setQ2] = useState(20);
  const [q3, setQ3] = useState(25);

  // ESG Sliders states
  const [eSla, setESla] = useState(80);
  const [sSla, setSSla] = useState(75);
  const [gSla, setGSla] = useState(85);

  // JSON Diff state
  const [selectedLogId, setSelectedLogId] = useState<string | null>(activityLogs[0]?.id || null);

  // Compliance Documents Filters State
  const [compSearchText, setCompSearchText] = useState('');
  const [compCatFilter, setCompCatFilter] = useState('All');
  const [compStatusFilter, setCompStatusFilter] = useState('All');

  const filteredComplianceDocs = useMemo(() => {
    return complianceDocs.filter((doc) => {
      const matchesSearch =
        doc.id.toLowerCase().includes(compSearchText.toLowerCase()) ||
        doc.name.toLowerCase().includes(compSearchText.toLowerCase()) ||
        doc.vendorId.toLowerCase().includes(compSearchText.toLowerCase());
      const matchesCat = compCatFilter === 'All' || doc.category === compCatFilter;
      const matchesStatus = compStatusFilter === 'All' || doc.status === compStatusFilter;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [complianceDocs, compSearchText, compCatFilter, compStatusFilter]);

  // Audit Activity Logs Filters State
  const [auditSearchText, setAuditSearchText] = useState('');
  const [auditRoleFilter, setAuditRoleFilter] = useState('All');

  const filteredActivityLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      const matchesSearch =
        log.id.toLowerCase().includes(auditSearchText.toLowerCase()) ||
        log.action.toLowerCase().includes(auditSearchText.toLowerCase()) ||
        log.user.toLowerCase().includes(auditSearchText.toLowerCase()) ||
        log.entityId.toLowerCase().includes(auditSearchText.toLowerCase());
      const matchesRole = auditRoleFilter === 'All' || log.role === auditRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [activityLogs, auditSearchText, auditRoleFilter]);

  // Upload compliant doc dialog
  const [docUploadOpen, setDocUploadOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docCat, setDocCat] = useState('NDA');
  const [docExpiry, setDocExpiry] = useState('2026-12-31');

  // Compute Coordinates on 5x5 heatmap for each vendor dynamically based on risk scores
  // Likelihood Y coordinate range (1-5), Impact X coordinate range (1-5).
  // Lower scores -> lower coordinates.
  const heatmapVendors = useMemo(() => {
    return vendors.map((v) => {
      let x = 1; // Impact
      let y = 1; // Likelihood

      if (v.riskScore < 25) {
        x = 1; y = 2;
      } else if (v.riskScore < 40) {
        x = 2; y = 2;
      } else if (v.riskScore < 60) {
        x = 3; y = 3;
      } else if (v.riskScore < 75) {
        x = 4; y = 3;
      } else {
        x = 5; y = 4;
      }

      return { ...v, x, y };
    });
  }, [vendors]);

  // Handle selected card focus from heatmap
  const focusedVendorChip = useMemo(() => {
    return vendors.find((v) => v.id === selectedVendorChipId) || null;
  }, [vendors, selectedVendorChipId]);

  // Compute calculated overall risk score from Y-likelihood and X-impact
  const computedQuestionnaireScore = Math.max(10, Math.min(100, Math.round((q1 + q2 + q3) * 1.1)));

  // ESG Scatter plot dataset
  const esgScatterData = useMemo(() => {
    return vendors.map((v) => ({
      e: v.esgScore || 70,
      s: 75,
      g: 80,
      name: v.name,
      id: v.id,
      tier: v.esgTier || 'Silver'
    }));
  }, [vendors]);

  const activeDiffLog = useMemo(() => {
    return filteredActivityLogs.find(l => l.id === selectedLogId) || filteredActivityLogs[0];
  }, [filteredActivityLogs, selectedLogId]);

  const handleAddNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;
    addToast('success', 'Document Received', `Successfully compiled and cataloged compliance verification file: ${docName}. Expiring ${docExpiry}.`);
    setDocUploadOpen(false);
    setDocName('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Sub tabs indicators navigation */}
      <div className="bg-white dark:bg-[#161B27] border rounded p-1 flex font-sans overflow-x-auto gap-1">
        {(
          [
            { id: 'risk', label: '5x5 Risk Heatmap', icon: ShieldAlert },
            { id: 'compliance', label: 'Compliance Ledger', icon: FileCheck2 },
            { id: 'esg', label: 'ESG / Sustainability', icon: Leaf },
            { id: 'audit', label: 'System Audit Logs', icon: Activity }
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 min-w-[130px] whitespace-nowrap py-2 text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-1.5 ${
                tab === t.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-550 hover:text-gray-905 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: 5x5 RISK HEATMAP MATRIX GRID */}
      {tab === 'risk' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* 5x5 CSS layout viewport (66%) */}
          <div className="xl:col-span-2 bg-white dark:bg-[#161B27] border rounded-md p-6 shadow-sm space-y-6 text-xs font-sans">
            <div className="border-b pb-3">
              <h3 className="font-bold text-gray-901 uppercase tracking-wider text-[11px]">Visual Risk Heatmap Matrix (Likelihood vs Impact)</h3>
              <p className="text-gray-400 mt-1">Provider nodes categorized into Risk Quadrants. Higher right-top coordinates indicate high risk.</p>
            </div>

            {/* Matrix grid container Y-axis likelihood (5 down to 1), X-axis impact (1 to 5) */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Likelihood Label Indicator (Vertical) */}
              <div className="flex flex-col justify-between text-right text-[10px] font-bold text-gray-400 py-4 h-[300px] w-20 leading-none">
                <span>5 / Almost Certain</span>
                <span>4 / Likely</span>
                <span>3 / Possible</span>
                <span>2 / Unlikely</span>
                <span>1 / Rare</span>
              </div>

              {/* Grid 5x5 */}
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-5 gap-2 h-[300px]">
                  {Array.from({ length: 5 }).map((_, rIdx) => {
                    const rowNum = 5 - rIdx; // row number from 5 down to 1
                    return Array.from({ length: 5 }).map((_, cIdx) => {
                      const colNum = cIdx + 1; // col number from 1 to 5

                      // Discover vendors matching these coordinates mapping X & Y
                      const matchingChips = heatmapVendors.filter(
                        (v) => v.x === colNum && v.y === rowNum
                      );

                      // Determine color band based on risk coordinates (Y * X)
                      const cellWeight = rowNum * colNum;
                      let bgStyle = 'bg-emerald-50/45 dark:bg-emerald-950/20 hover:bg-emerald-100'; // low risk
                      if (cellWeight >= 12) {
                        bgStyle = 'bg-red-50/45 dark:bg-red-950/20 hover:bg-red-100'; // high risk
                      } else if (cellWeight >= 6) {
                        bgStyle = 'bg-amber-50/45 dark:bg-amber-950/20 hover:bg-amber-100'; // moderate risk
                      }

                      return (
                        <div
                          key={`${rowNum}-${colNum}`}
                          className={`border rounded flex flex-wrap gap-1 p-1.5 items-center justify-center relative min-h-[50px] transition duration-150 ${bgStyle}`}
                        >
                          {matchingChips.map((chip) => (
                            <button
                              key={chip.id}
                              onClick={() => {
                                setSelectedVendorChipId(chip.id);
                                addToast('info', 'Active Focus Highlighted', `Active scorecard profiling risk values: ${chip.name}.`);
                              }}
                              className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold font-sans text-[10px] flex items-center justify-center border shadow-sm cursor-pointer select-none truncate hover:scale-110 transform transition"
                              title={`${chip.name} (Risk score: ${chip.riskScore})`}
                            >
                              {chip.logoInitials}
                            </button>
                          ))}
                        </div>
                      );
                    });
                  })}
                </div>

                {/* X-Axis labels */}
                <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold text-gray-405 dark:text-slate-400 pt-1">
                  <span>1 / Negligible</span>
                  <span>2 / Minor</span>
                  <span>3 / Moderate</span>
                  <span>4 / Major</span>
                  <span>5 / Critical</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sorter focus card AND Questionnaire slider accordions (34%) */}
          <div className="xl:col-span-1 space-y-6 text-xs font-sans">
            {/* Selected Focus info panel */}
            {focusedVendorChip ? (
              <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h4 className="font-bold text-gray-901 uppercase tracking-wider text-[10.5px]">Selected Profile Node</h4>
                  <button onClick={() => setSelectedVendorChipId(null)} className="text-gray-400 font-serif text-lg leading-none">&times;</button>
                </div>
                <div>
                  <strong className="text-sm font-extrabold text-[#475569] dark:text-slate-105 block leading-tight">{focusedVendorChip.name}</strong>
                  <span className="text-[10px] text-gray-400 block mt-1 font-mono">{focusedVendorChip.id} · Cat: {focusedVendorChip.category}</span>
                </div>
                <div className="p-3 bg-red-50/10 border rounded flex justify-between items-center text-red-650 dark:text-red-400">
                  <span>Risk score rating:</span>
                  <strong className="font-mono text-base">{focusedVendorChip.riskScore}/100</strong>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm p-5 text-center text-gray-400">
                Click a vendor avatar badge on the 5x5 heatmap to reveal risk profile indicators.
              </div>
            )}

            {/* Accordion Questionnaire calculator */}
            <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-gray-901 uppercase tracking-wider text-[10.5px] pb-1 border-b">Operational Risk Assessor questionnaire</h3>

              <div className="space-y-2">
                {[
                  { id: 1, q: 'A. Treasury and capital liquidity status', val: q1, setVal: setQ1, desc: 'Assesses financial stability risk factors.' },
                  { id: 2, q: 'B. Disaster recovery network plan', val: q2, setVal: setQ2, desc: 'Validates backup hosting options checklists.' },
                  { id: 3, q: 'C. Cyber security & penetration audits', val: q3, setVal: setQ3, desc: 'Vets network vulnerability records.' }
                ].map((item) => (
                  <div key={item.id} className="border rounded">
                    <button
                      type="button"
                      onClick={() => setQuestionnaireActiveId(questionnaireActiveId === item.id ? null : item.id)}
                      className="w-full text-left p-3 flex justify-between font-bold text-gray-700 dark:text-slate-205"
                    >
                      {item.q}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {questionnaireActiveId === item.id && (
                      <div className="p-3 bg-gray-50/50 dark:bg-slate-850/10 border-t space-y-3 text-[11px] text-gray-500">
                        <p className="font-medium text-gray-400">{item.desc}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between font-bold">
                            <span>Evaluated score weighting:</span>
                            <span className="font-mono text-blue-600">{item.val}/33 points</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="33"
                            value={item.val}
                            onChange={(e) => item.setVal(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Questionnaire output result matching alerts */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between font-bold">
                  <span>Compound Score average:</span>
                  <strong className="font-mono text-xs text-blue-650">{computedQuestionnaireScore}/100</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addToast('success', 'Calculated assessment saved', `Newly calculated audit compound score recorded: ${computedQuestionnaireScore}/100.`);
                  }}
                  className="w-full py-2 bg-[#0F1729] hover:bg-slate-800 text-white font-bold rounded"
                >
                  Save Calculated Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLIANCE DOCUMENTS REGISTRY EXPIRING CHECKERS */}
      {tab === 'compliance' && (
        <div className="space-y-6 font-sans">
          {/* Controls CTA row */}
          <div className="bg-white dark:bg-[#161B27] p-4 rounded border flex justify-between items-center flex-wrap gap-4 text-xs">
            <span className="text-gray-400 pl-1 font-semibold">Active vetting documents monitored on vendor network.</span>
            <button
              onClick={() => setDocUploadOpen(true)}
              className="px-3 h-[32px] bg-blue-600 hover:bg-blue-700 font-semibold text-white text-xs rounded flex items-center gap-1.5 shadow-sm leading-none mr-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Upload Compliance Doc
            </button>
          </div>

          {/* Compliance Filters bar */}
          <div className="bg-white dark:bg-[#161B27] p-3 rounded-md border flex flex-wrap md:flex-nowrap gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by doc name, ID, or vendor account..."
                value={compSearchText}
                onChange={(e) => setCompSearchText(e.target.value)}
                className="w-full h-[36px] pl-9 pr-4 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-[#1F2937] text-[13px] rounded-sm text-gray-950 dark:text-white outline-none"
              />
            </div>

            {/* Document Category Select */}
            <select
              value={compCatFilter}
              onChange={(e) => setCompCatFilter(e.target.value)}
              className="h-[36px] border border-gray-200 dark:border-[#1F2937] text-xs rounded-sm px-2.5 bg-white dark:bg-[#161B27] text-gray-705 dark:text-slate-300 outline-none font-semibold"
            >
              <option value="All">All Categories</option>
              <option value="NDA">NDA Signed Covenants</option>
              <option value="W-9">W-9 Forms Tax checks</option>
              <option value="Insurance">General Liability cert</option>
              <option value="SOC2">SOC2 Security audit</option>
            </select>

            {/* Compliance status filter */}
            <select
              value={compStatusFilter}
              onChange={(e) => setCompStatusFilter(e.target.value)}
              className="h-[36px] border border-gray-200 dark:border-[#1F2937] text-xs rounded-sm px-2.5 bg-white dark:bg-[#161B27] text-gray-705 dark:text-slate-300 outline-none font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active (Vetted OK)</option>
              <option value="Expiring">Expiring (Review Required)</option>
            </select>

            {(compSearchText || compCatFilter !== 'All' || compStatusFilter !== 'All') && (
              <button
                onClick={() => {
                  setCompSearchText('');
                  setCompCatFilter('All');
                  setCompStatusFilter('All');
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-1 cursor-pointer font-bold shrink-0"
              >
                Clear
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm overflow-x-auto w-full text-xs">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-widest font-sans">
                <tr>
                  <th className="p-3 pl-4">Document Ref ID</th>
                  <th className="p-3">Doc Name context</th>
                  <th className="p-3">Vendor Account</th>
                  <th className="p-3 font-mono">Category</th>
                  <th className="p-3">Compliance Expiry</th>
                  <th className="p-3">File capacity size</th>
                  <th className="p-3">Expiration Checker status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-803 text-slate-700 dark:text-slate-200">
                {filteredComplianceDocs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400 italic font-semibold">No compliance documents matching the selection parameters.</td>
                  </tr>
                ) : (
                  filteredComplianceDocs.map((doc) => {
                    const isExpiringSoon = doc.status === 'Expiring';
                    return (
                      <tr key={doc.id} className="hover:bg-gray-50/25">
                        <td className="p-3 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">{doc.id}</td>
                        <td className="p-3 font-semibold text-gray-900 dark:text-white">{doc.name}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-200">{doc.vendorId}</td>
                        <td className="p-3 font-semibold font-mono text-[11px] text-gray-700 dark:text-slate-300">{doc.category}</td>
                        <td className="p-3 text-gray-500 dark:text-slate-400 font-bold font-mono">{doc.expiryDate}</td>
                        <td className="p-3 text-gray-500 dark:text-slate-400">{doc.fileSize}</td>
                        <td className="p-3">
                          <span className={`inline-block border text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            doc.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/60'
                              : 'bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/60 font-black'
                          }`}>
                            {doc.status === 'Active' ? 'Vetted OK' : 'Expiration Review Required'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ESG & SUSTAINABILITY SCORECARD */}
      {tab === 'esg' && (
        <div className="space-y-6 font-sans text-xs">
          {/* Classification stats highlight cards (Platinum gold bronze) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#161B27] p-5 border rounded flex flex-col justify-between hover:shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Platinum tier class</span>
              <div className="flex gap-1.5 items-baseline mt-2">
                <strong className="text-xl text-gray-955 dark:text-white font-roboto">2</strong>
                <span className="text-xs text-gray-400 font-medium">vendors authorized</span>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1 py-0.5 rounded-sm block mt-2 max-w-max">Score &gt;85</span>
            </div>
            <div className="bg-white dark:bg-[#161B27] p-5 border rounded flex flex-col justify-between hover:shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gold tier class</span>
              <div className="flex gap-1.5 items-baseline mt-2">
                <strong className="text-xl text-gray-955 dark:text-white font-roboto">5</strong>
                <span className="text-xs text-gray-400 font-medium">vendors authorized</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-750 font-bold px-1 py-0.5 rounded-sm block mt-2 max-w-max">Score &gt;70</span>
            </div>
            <div className="bg-white dark:bg-[#161B27] p-5 border rounded flex flex-col justify-between hover:shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Silver tier class</span>
              <div className="flex gap-1.5 items-baseline mt-2">
                <strong className="text-xl text-gray-955 dark:text-white font-roboto">4</strong>
                <span className="text-xs text-gray-400 font-medium">vendors authorized</span>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1 py-0.5 rounded-sm block mt-2 max-w-max font-semibold">Score &gt;50</span>
            </div>
            <div className="bg-white dark:bg-[#161B27] p-5 border rounded flex flex-col justify-between hover:shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Bronze tier class</span>
              <div className="flex gap-1.5 items-baseline mt-2">
                <strong className="text-xl text-gray-955 dark:text-white font-roboto">1</strong>
                <span className="text-xs text-gray-400 font-medium font-bold">vendors flagged</span>
              </div>
              <span className="text-[10px] bg-red-50 text-red-800 font-black px-1 py-0.5 rounded-sm block mt-2 max-w-max">Score &lt;50</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* 15 Sub-dimensions ESG grid blocks (66%) */}
            <div className="xl:col-span-2 bg-white dark:bg-[#161B27] border rounded-md p-5 space-y-4 shadow-sm">
              <h3 className="font-bold text-gray-901 uppercase tracking-wider text-[11px] pb-1 border-b">Scope 3 Sustainability Heatmap (15 Indicators)</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3.5">
                {[
                  { name: 'Scope 3 Greenhouse', score: 84 },
                  { name: 'Fair labor wage coefficient', score: 78 },
                  { name: 'Circular packing usage', score: 92 },
                  { name: 'Renewable power levels', score: 80 },
                  { name: 'Hazardous garbage metrics', score: 71 },
                  { name: 'Water audit standards', score: 68 },
                  { name: 'Fair workplace policy', score: 85 },
                  { name: 'Transparency of ownership', score: 90 },
                  { name: 'Anti bribery guidelines', score: 95 },
                  { name: 'Employee safety limits', score: 88 },
                  { name: 'Modern slavery prevention', score: 91 },
                  { name: 'Carbon emission target', score: 75 },
                  { name: 'Gender wage balance', score: 83 },
                  { name: 'Data secrecy compliance', score: 94 },
                  { name: 'Whistleblower path safety', score: 89 }
                ].map((item, id) => {
                  let badgeCol = 'bg-emerald-50 text-emerald-800 border-emerald-100';
                  if (item.score < 75) badgeCol = 'bg-amber-50 text-amber-850';
                  if (item.score < 70) badgeCol = 'bg-red-50 text-red-800';
                  return (
                    <div key={id} className={`p-3 border rounded text-center space-y-1 hover:shadow transition duration-150 ${badgeCol}`}>
                      <strong className="font-mono font-extrabold text-[#111827] dark:text-white text-sm block leading-none">{item.score}%</strong>
                      <span className="text-[10px] uppercase font-semibold text-gray-500 leading-tight block">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-accordion ESG slider matching criteria widget (34%) */}
            <div className="xl:col-span-1 bg-white dark:bg-[#161B27] p-5 border rounded space-y-5 shadow-sm">
              <div className="border-b pb-1.5">
                <h3 className="font-bold text-gray-901 uppercase tracking-wider text-[11px]">Carbon Matching Target Criteria</h3>
                <p className="text-gray-400 mt-1">Specify environmental, social, and governance rules threshold.</p>
              </div>

              {[
                { label: 'E / Scope 3 Carbon compliance', val: eSla, setVal: setESla, color: 'text-emerald-500' },
                { label: 'S / Quality safety covenants', val: sSla, setVal: setSSla, color: 'text-blue-500' },
                { label: 'G / Treasury transparency rules', val: gSla, setVal: setGSla, color: 'text-purple-500' }
              ].map((sla, id) => (
                <div key={id} className="space-y-1.5">
                  <div className="flex justify-between font-bold text-gray-500 uppercase text-[10.5px]">
                    <span>{sla.label}</span>
                    <span className={`font-mono font-extrabold ${sla.color}`}>{sla.val}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="95"
                    value={sla.val}
                    onChange={(e) => sla.setVal(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              ))}

              <div className="p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded text-center space-y-1.5 select-none z-10 relative">
                <span className="text-[9.5px] text-gray-500 dark:text-slate-400 uppercase tracking-widest block font-extrabold pb-0.5">Auto-calculated match rank standard</span>
                <strong className="text-sm text-emerald-600 dark:text-emerald-400 block font-black uppercase font-mono">Verified Gold Category Class</strong>
                <p className="text-[10px] text-gray-600 dark:text-slate-300 leading-normal max-w-[200px] mx-auto text-center font-semibold">
                  Providers within scope criteria are safely verified.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM AUDIT LOG SYSTEM AND JSON DIFF VIEWERS */}
      {tab === 'audit' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Timeline Table log lists (66%) */}
          <div className="xl:col-span-2 space-y-4">
            {/* Audit Logs filter strip */}
            <div className="bg-white dark:bg-[#161B27] p-3 rounded rounded-md border flex flex-wrap md:flex-nowrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search actions, ID, operator user..."
                  value={auditSearchText}
                  onChange={(e) => setAuditSearchText(e.target.value)}
                  className="w-full h-[36px] pl-9 pr-4 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-[#1F2937] text-[13px] rounded-sm text-gray-950 dark:text-white outline-none"
                />
              </div>

              <select
                value={auditRoleFilter}
                onChange={(e) => setAuditRoleFilter(e.target.value)}
                className="h-[36px] border border-gray-200 dark:border-[#1F2937] text-xs rounded-sm px-2.5 bg-white dark:bg-[#161B27] text-gray-705 dark:text-slate-300 outline-none font-semibold"
              >
                <option value="All">All Auditor Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Procurement Specialist">Procurement Specialist</option>
                <option value="Risk Assessor">Risk Assessor</option>
                <option value="Compliance Analyst">Compliance Analyst</option>
              </select>

              {(auditSearchText || auditRoleFilter !== 'All') && (
                <button
                  onClick={() => {
                    setAuditSearchText('');
                    setAuditRoleFilter('All');
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-1 cursor-pointer font-bold shrink-0"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="bg-white dark:bg-[#161B27] border rounded shadow-sm overflow-x-auto w-full text-xs">
              <table className="w-full text-left font-sans min-w-[750px]">
                <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-widest font-sans">
                  <tr>
                    <th className="p-3 pl-4">Audit ID</th>
                    <th className="p-3">Action Description</th>
                    <th className="p-3">Auditor Operator</th>
                    <th className="p-3 text-center">Timestamp UTC</th>
                    <th className="p-3 pr-4 text-right">JSON Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-803 text-slate-700 dark:text-slate-250">
                  {filteredActivityLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 italic">No audit logs matching selection search.</td>
                    </tr>
                  ) : (
                    filteredActivityLogs.map((log) => (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLogId(log.id)}
                        className={`hover:bg-blue-50/15 dark:hover:bg-slate-850/20 cursor-pointer transition ${
                          selectedLogId === log.id ? 'bg-blue-50/10 dark:bg-blue-900/5 font-bold border-l-2 border-blue-600' : ''
                        }`}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">{log.id}</td>
                        <td className="p-3 font-semibold text-gray-900 dark:text-white">{log.action}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-200">{log.user} ({log.role})</td>
                        <td className="p-3 text-center text-gray-500 dark:text-slate-450 font-mono">{log.timestamp}</td>
                        <td className="p-3 pr-4 text-right text-gray-400 hover:text-blue-600 font-semibold cursor-pointer">
                          Inspect Draft Diff
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side-by-side JSON schema diff inspectors (34%) */}
          <div className="xl:col-span-1 bg-white dark:bg-[#161B27] border rounded shadow-sm p-4 space-y-4 text-xs font-sans">
            {activeDiffLog ? (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <span className="text-[10px] uppercase font-bold text-gray-405 tracking-wider font-mono">JSON Difference Inspector</span>
                  <h3 className="font-roboto font-bold text-base mt-1 text-gray-901 leading-tight">{activeDiffLog.id} - {activeDiffLog.action}</h3>
                  <p className="text-[10.5px] text-gray-400 mt-1">Chronological diff checks mapping prior parameter allocations vs validated states.</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono leading-relaxed h-[240px] overflow-y-auto">
                  {/* Original column */}
                  <div className="bg-red-50/45 dark:bg-red-950/20 dark:text-red-300 p-2 text-red-800 rounded border border-red-100 dark:border-red-950 overflow-hidden truncate">
                    <span className="font-bold uppercase text-red-900 block border-b pb-1 mb-1.5">- ORIGINAL</span>
                    {`{\n  id: "${activeDiffLog.entityId}",\n  state: "Awaiting_Check",\n  operator: "${activeDiffLog.user}",\n  covenants_met: false,\n  vatCode: "N/A"\n}`}
                  </div>

                  {/* Updated Column */}
                  <div className="bg-emerald-50/45 dark:bg-emerald-950/20 p-2 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-100 dark:border-emerald-950 overflow-hidden truncate">
                    <span className="font-bold uppercase text-emerald-900 block border-b pb-1 mb-1.5">+ UPDATED (VETTED)</span>
                    {`{\n  id: "${activeDiffLog.entityId}",\n  state: "Authorized_Ok",\n  operator: "${activeDiffLog.user}",\n  covenants_met: true,\n  vatCode: "US-821"\n}`}
                  </div>
                </div>

                <div className="p-3 bg-red-50/5 text-gray-450 border rounded text-[11px] leading-relaxed text-center font-semibold">
                  Operator logs are cryptographic and locked from systemic de-registration.
                </div>
              </div>
            ) : (
              <p className="p-8 text-center text-gray-400">Select log entry to examine.</p>
            )}
          </div>
        </div>
      )}

      {/* COMPLIANT DOCUMENT UPLOAD DIALOG PANEL */}
      {docUploadOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm" onClick={() => setDocUploadOpen(false)} />
          <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white dark:bg-[#161B27] border border-gray-250 dark:border-[#1F2937] rounded-md p-6 shadow-2xl z-50 flex flex-col font-sans">
            <div className="flex justify-between items-center pb-3 border-b mb-4 flex-shrink-0">
              <h2 className="text-sm font-black text-gray-955 dark:text-white uppercase">Upload Certified Vett Documents</h2>
              <button onClick={() => setDocUploadOpen(false)} className="text-gray-405 hover:text-gray-901 font-serif text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleAddNewDoc} className="space-y-4 text-xs font-sans">
              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-450 uppercase text-[10.5px]">Compliant Document file Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Apex Certified NDA signed.pdf"
                  className="h-[36px] bg-transparent border dark:border-[#1F2937] outline-none px-2 rounded focus:border-blue-500 text-gray-805 dark:text-white"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1 mr-1">
                  <label className="font-bold text-gray-450 uppercase text-[10.5px]">Compliant Category</label>
                  <select
                    className="h-[36px] bg-transparent border dark:border-[#1F2937] px-2 rounded font-semibold text-gray-805 dark:text-white"
                    value={docCat}
                    onChange={(e) => setDocCat(e.target.value)}
                  >
                    <option value="NDA">NDA Signed Covenants</option>
                    <option value="W-9">W-9 Forms Tax checks</option>
                    <option value="Insurance">General Liability cert</option>
                    <option value="SOC2">SOC2 Security audit</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-gray-450 uppercase text-[10.5px]">Expiration date Check</label>
                  <input
                    type="date"
                    className="h-[36px] bg-transparent border dark:border-[#1F2937] px-2 rounded font-mono text-gray-850 dark:text-white"
                    value={docExpiry}
                    onChange={(e) => setDocExpiry(e.target.value)}
                  />
                </div>
              </div>

              {/* Simulating File selector dropzone */}
              <div
                onClick={() => alert('Launching system file explorer upload checker...')}
                className="p-6 border border-dashed border-gray-300 dark:border-gray-800 rounded text-center cursor-pointer hover:bg-slate-50/50 space-y-1.5"
              >
                <span className="font-bold block text-blue-600">Select or Drag Vetting PDF</span>
                <span className="text-[10px] text-gray-400 block font-semibold">Maximum safe capacity limit: 25MB</span>
              </div>

              <div className="border-t pt-4 flex justify-end gap-2 pr-1 font-semibold">
                <button
                  type="button"
                  onClick={() => setDocUploadOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded"
                >
                  Upload File Vetting
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
