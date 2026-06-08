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

  // Tab: only 'risk' retained
  const [tab, setTab] = useState<'risk'>('risk');

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
    <div className="pt-14 space-y-6 font-sans">
      {/* Sub tabs indicators navigation */}
      <div className="bg-white dark:bg-[#161B27] border rounded p-1 flex font-sans overflow-x-auto gap-1">
        {(
            [
              { id: 'risk', label: '5x5 Risk Heatmap', icon: ShieldAlert }
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

      {/* Compliance, ESG, and Audit tabs removed per request */}

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
