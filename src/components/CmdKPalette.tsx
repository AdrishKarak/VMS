import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useVMS, CurrentPage } from '../vmsContext';
import {
  UserPlus,
  ShoppingCart,
  FileSearch,
  FileText,
  ShieldAlert,
  Upload,
  Wallet,
  Building,
  ArrowRight,
  Clipboard,
  Receipt,
  Search,
  LayoutDashboard
} from 'lucide-react';

interface PaletteCommand {
  id: string;
  type: 'action' | 'page' | 'vendor' | 'po' | 'contract' | 'invoice';
  title: string;
  subtitle: string;
  shortcut?: string;
  icon: React.ComponentType<any>;
  onClick: (ctx: any) => void;
  meta?: any;
}

export const CmdKPalette: React.FC = () => {
  const {
    cmdPaletteOpen,
    setCmdPaletteOpen,
    setCurrentPage,
    setSelectedVendorId,
    vendors,
    purchaseOrders,
    contracts,
    invoices,
    addToast
  } = useVMS();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdPaletteOpen(!cmdPaletteOpen);
      }
      if (e.key === 'Escape') {
        setCmdPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cmdPaletteOpen, setCmdPaletteOpen]);

  // Focus input on open
  useEffect(() => {
    if (cmdPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [cmdPaletteOpen]);

  // Commands and pages
  const staticCommands = useMemo<PaletteCommand[]>(() => [
    {
      id: 'act-new-vendor',
      type: 'action',
      title: 'Create New Vendor',
      subtitle: 'Register and start onboarding pipelines for a new provider',
      shortcut: 'N V',
      icon: UserPlus,
      onClick: () => {
        setCurrentPage('onboarding');
        setCmdPaletteOpen(false);
      }
    },
    {
      id: 'act-new-po',
      type: 'action',
      title: 'New Purchase Order',
      subtitle: 'Create a new release or authorization order draft',
      shortcut: 'N P',
      icon: ShoppingCart,
      onClick: () => {
        setCurrentPage('purchase-orders');
        setCmdPaletteOpen(false);
      }
    },
    {
      id: 'act-new-rfq',
      type: 'action',
      title: 'Generate RFQ / Sourcing tender',
      subtitle: 'Publish strategic specifications for bids',
      shortcut: 'G R',
      icon: FileSearch,
      onClick: () => {
        setCurrentPage('rfq');
        setCmdPaletteOpen(false);
      }
    },
    {
      id: 'act-new-contract',
      type: 'action',
      title: 'New Contract Agreement',
      subtitle: 'Draft a Master, SLA, or Service arrangement',
      shortcut: 'N C',
      icon: FileText,
      onClick: () => {
        setCurrentPage('contracts');
        setCmdPaletteOpen(false);
      }
    },
    {
      id: 'act-risk',
      type: 'action',
      title: 'Run Risk Assessment',
      subtitle: 'Compile financial or cybersecurity diagnostic charts',
      shortcut: 'R R',
      icon: ShieldAlert,
      onClick: () => {
        setCurrentPage('risk');
        setCmdPaletteOpen(false);
      }
    },
    {
      id: 'act-upload',
      type: 'action',
      title: 'Upload Compliance Files',
      subtitle: 'Catalog an archived certificate or tax slip',
      shortcut: 'U D',
      icon: Upload,
      onClick: () => {
        setCurrentPage('compliance');
        setCmdPaletteOpen(false);
      }
    },
    {
      id: 'act-payment',
      type: 'action',
      title: 'Schedule Payment Voucher',
      subtitle: 'Issue general fund authorizations matched to invoices',
      shortcut: 'S P',
      icon: Wallet,
      onClick: () => {
        setCurrentPage('payments');
        setCmdPaletteOpen(false);
      }
    },
    {
      id: 'page-dashboard',
      type: 'page',
      title: 'Navigate to Dashboard Overview',
      subtitle: 'View general enterprise KPI matrices and MTD spend indicators',
      shortcut: 'G D',
      icon: LayoutDashboard,
      onClick: () => {
        setCurrentPage('dashboard');
        setCmdPaletteOpen(false);
      }
    },
    {
      id: 'page-directory',
      type: 'page',
      title: 'Navigate to Vendor Directory',
      subtitle: 'Consult the list of registered nodes and custom contact tags',
      shortcut: 'G V',
      icon: Building,
      onClick: () => {
        setCurrentPage('vendors');
        setCmdPaletteOpen(false);
      }
    }
  ], [setCurrentPage, setCmdPaletteOpen]);

  // Dynamic entity search based on prefixes:
  // "> vendor blah" -> show only vendors
  // "> po blah" -> show only POs
  // "> contract blah" -> show only contracts
  const filteredResults = useMemo<PaletteCommand[]>(() => {
    let searchType: 'all' | 'vendor' | 'po' | 'contract' | 'invoice' = 'all';
    let cleanQuery = query.toLowerCase().trim();

    if (cleanQuery.startsWith('>vendor')) {
      searchType = 'vendor';
      cleanQuery = cleanQuery.substring(7).trim();
    } else if (cleanQuery.startsWith('>po')) {
      searchType = 'po';
      cleanQuery = cleanQuery.substring(3).trim();
    } else if (cleanQuery.startsWith('>contract')) {
      searchType = 'contract';
      cleanQuery = cleanQuery.substring(9).trim();
    } else if (cleanQuery.startsWith('>go')) {
      cleanQuery = cleanQuery.substring(3).trim();
    }

    // Default suggestions when query is empty
    if (!cleanQuery && searchType === 'all') {
      return staticCommands;
    }

    const output: PaletteCommand[] = [];

    // Filter and map Vendors
    if (searchType === 'all' || searchType === 'vendor') {
      vendors
        .filter(v => v.name.toLowerCase().includes(cleanQuery) || v.id.toLowerCase().includes(cleanQuery) || v.category.toLowerCase().includes(cleanQuery))
        .slice(0, 4)
        .forEach(v => {
          output.push({
            id: `ent-vendor-${v.id}`,
            type: 'vendor',
            title: v.name,
            subtitle: `${v.id} · ${v.category} · ${v.tier} · ${v.country}`,
            icon: Building,
            onClick: () => {
              setSelectedVendorId(v.id);
              setCurrentPage('vendor-detail');
              setCmdPaletteOpen(false);
            },
            meta: v
          });
        });
    }

    // Filter and map POs
    if (searchType === 'all' || searchType === 'po') {
      purchaseOrders
        .filter(p => p.id.toLowerCase().includes(cleanQuery) || p.vendorName.toLowerCase().includes(cleanQuery) || p.title.toLowerCase().includes(cleanQuery))
        .slice(0, 3)
        .forEach(p => {
          output.push({
            id: `ent-po-${p.id}`,
            type: 'po',
            title: `${p.id} - ${p.title}`,
            subtitle: `${p.vendorName} · $${p.amount.toLocaleString()} · ${p.status}`,
            icon: ShoppingCart,
            onClick: () => {
              setCurrentPage('purchase-orders');
              setCmdPaletteOpen(false);
              addToast('info', 'PO Selected', `Transferred to ledger matching ${p.id}.`);
            },
            meta: p
          });
        });
    }

    // Filter and map Contracts
    if (searchType === 'all' || searchType === 'contract') {
      contracts
        .filter(c => c.id.toLowerCase().includes(cleanQuery) || c.vendorName.toLowerCase().includes(cleanQuery) || c.title.toLowerCase().includes(cleanQuery))
        .slice(0, 3)
        .forEach(c => {
          output.push({
            id: `ent-contract-${c.id}`,
            type: 'contract',
            title: `${c.id} - ${c.title}`,
            subtitle: `${c.vendorName} · Value: $${c.value.toLocaleString()} · Status: ${c.status}`,
            icon: FileText,
            onClick: () => {
              setCurrentPage('contracts');
              setCmdPaletteOpen(false);
              addToast('info', 'Contract Selected', `Navigated to legal covenants matching ${c.id}.`);
            },
            meta: c
          });
        });
    }

    // Static actions mapping on text match
    staticCommands.forEach(cmd => {
      if (cmd.title.toLowerCase().includes(cleanQuery) || cmd.subtitle.toLowerCase().includes(cleanQuery)) {
        output.push(cmd);
      }
    });

    return output;
  }, [query, staticCommands, vendors, purchaseOrders, contracts, setSelectedVendorId, setCurrentPage, setCmdPaletteOpen, addToast]);

  // Adjust scroll when moving items
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        filteredResults[selectedIndex].onClick(null);
      }
    }
  };

  if (!cmdPaletteOpen) return null;

  const currentSelection = filteredResults[selectedIndex];

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 z-[9990] bg-black/55 backdrop-blur-sm"
        onClick={() => setCmdPaletteOpen(false)}
      />

      {/* Palette Modal - spotlight style positioned 80px from top */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-[850px] bg-white dark:bg-[#161B27] border border-gray-250 dark:border-[#1F2937] shadow-[0_24px_80px_rgba(0,0,0,0.25)] rounded-lg z-[9991] flex flex-col font-sans overflow-hidden animate-scale-up duration-150">
        {/* Search row */}
        <div className="h-14 flex items-center px-4 border-b border-gray-150 dark:border-[#1F2937] gap-3">
          <Search className="w-5 h-5 text-gray-400 dark:text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 h-full bg-transparent border-0 outline-none text-base text-gray-900 dark:text-white font-sans placeholder-gray-400 dark:placeholder-slate-500"
            placeholder="Search anything or type a directive like '>vendor Apex'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[10px] bg-gray-100 dark:bg-[#2D3748] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-slate-400 font-mono px-1.5 py-0.5 rounded leading-none">
              ESC
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-550">to close</span>
          </div>
        </div>

        {/* Prefixes list chips */}
        {query === '' && (
          <div className="px-4 py-2 bg-gray-50 dark:bg-[#0c1221]/50 border-b border-gray-150 dark:border-gray-800/80 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Filters:</span>
            <button
              onClick={() => setQuery('>vendor ')}
              className="px-2 py-0.5 h-[22px] bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-semibold rounded text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700"
            >
              &gt; vendor
            </button>
            <button
              onClick={() => setQuery('>po ')}
              className="px-2 py-0.5 h-[22px] bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-semibold rounded text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-700"
            >
              &gt; po
            </button>
            <button
              onClick={() => setQuery('>contract ')}
              className="px-2 py-0.5 h-[22px] bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-semibold rounded text-purple-600 dark:text-purple-400 border border-gray-200 dark:border-gray-700"
            >
              &gt; contract
            </button>
          </div>
        )}

        {/* Dynamic Column Split: 570px Sorter list | 280px Preview Panel */}
        <div className="flex h-[380px] divide-x divide-gray-155 dark:divide-[#1F2937]">
          {/* List items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredResults.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm font-semibold text-gray-500 dark:text-slate-400 font-sans">No matching directories found</p>
                <span className="text-xs text-gray-400 block mt-1">Refine your query parameters or reset prefixes tags.</span>
              </div>
            ) : (
              filteredResults.map((cmd, idx) => {
                const IconComp = cmd.icon;
                const isSelected = indexToMatch(idx, selectedIndex);
                return (
                  <button
                    key={cmd.id}
                    onClick={() => cmd.onClick(null)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left h-12 flex items-center px-4 rounded-sm gap-3 duration-100 transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-900/10 text-gray-900 dark:text-slate-50 border-l-[3px] border-blue-600'
                        : 'text-gray-700 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <IconComp
                      className={`w-5 h-5 flex-shrink-0 ${
                        isSelected
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-400 dark:text-slate-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-[13.5px] font-semibold truncate leading-tight font-sans">
                        {highlightMatch(cmd.title, query)}
                      </h4>
                      <p className="text-xs text-gray-400 dark:text-slate-500 truncate mt-0.5 leading-none font-sans">
                        {cmd.subtitle}
                      </p>
                    </div>
                    {cmd.shortcut && (
                      <span className="text-[9px] bg-gray-100 dark:bg-[#1E293B] text-gray-500 dark:text-slate-400 border border-gray-180 dark:border-gray-800 uppercase px-1.5 py-0.5 font-bold font-mono rounded">
                        {cmd.shortcut}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Right Live Preview Panel */}
          <div className="w-[280px] bg-gray-50/50 dark:bg-[#0c1221]/20 p-4 font-sans flex flex-col justify-between overflow-y-auto">
            {currentSelection ? (
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block font-sans">
                  Current Selection Preview
                </span>

                {/* Vendor Preview */}
                {currentSelection.type === 'vendor' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold font-roboto text-sm border dark:border-slate-700">
                        {currentSelection.meta?.logoInitials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[14px] font-bold text-gray-900 dark:text-white leading-tight font-sans truncate">
                          {currentSelection.meta?.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
                          {currentSelection.meta?.id} · {currentSelection.meta?.category}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-white dark:bg-[#192135] p-2.5 rounded border border-gray-150 dark:border-gray-800">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block font-sans">
                          Performance
                        </span>
                        <span className="text-sm font-bold text-gray-800 dark:text-slate-200 block mt-1 font-roboto">
                          {currentSelection.meta?.performanceScore}/100
                        </span>
                      </div>
                      <div className="bg-white dark:bg-[#192135] p-2.5 rounded border border-gray-150 dark:border-gray-800">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block font-sans">
                          Risk Score
                        </span>
                        <span className="text-sm font-bold text-red-650 dark:text-red-400 block mt-1 font-roboto">
                          {currentSelection.meta?.riskScore}/100
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1 text-xs">
                      <p className="text-gray-500 dark:text-slate-400">
                        <strong className="text-gray-700 dark:text-slate-350">Country:</strong> {currentSelection.meta?.country}
                      </p>
                      <p className="text-gray-500 dark:text-slate-400">
                        <strong className="text-gray-700 dark:text-slate-350">Contracts:</strong> ${currentSelection.meta?.contractValue.toLocaleString()}
                      </p>
                      <p className="text-gray-500 dark:text-slate-400">
                        <strong className="text-gray-700 dark:text-slate-350">Status:</strong> {currentSelection.meta?.status}
                      </p>
                    </div>
                  </div>
                )}

                {/* Purchase Order Preview */}
                {currentSelection.type === 'po' && (
                  <div className="space-y-3">
                    <h3 className="text-[13.5px] font-bold text-gray-900 dark:text-white font-sans truncate">
                      {currentSelection.meta?.title}
                    </h3>
                    <div className="space-y-2 text-xs text-gray-500 dark:text-slate-400 pt-1">
                      <p><strong>PO Code:</strong> <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded text-gray-700 dark:text-slate-300">{currentSelection.meta?.id}</span></p>
                      <p><strong>Vendor Name:</strong> {currentSelection.meta?.vendorName}</p>
                      <p><strong>Total Value:</strong> <span className="text-sm font-bold text-gray-950 dark:text-white">${currentSelection.meta?.amount.toLocaleString()}</span></p>
                      <p><strong>Approval Status:</strong> <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currentSelection.meta?.status}</span></p>
                    </div>
                  </div>
                )}

                {/* Contract Preview */}
                {currentSelection.type === 'contract' && (
                  <div className="space-y-3">
                    <h3 className="text-[13.5px] font-bold text-gray-900 dark:text-white font-sans truncate">
                      {currentSelection.meta?.title}
                    </h3>
                    <div className="space-y-2 text-xs text-gray-500 dark:text-slate-400 pt-1">
                      <p><strong>Contract ID:</strong> <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded text-gray-700 dark:text-slate-300">{currentSelection.meta?.id}</span></p>
                      <p><strong>Vendor Name:</strong> {currentSelection.meta?.vendorName}</p>
                      <p><strong>SLA Agreement:</strong> {currentSelection.meta?.type}</p>
                      <p><strong>Value Base:</strong> <span className="text-sm font-semibold text-gray-900 dark:text-white">${currentSelection.meta?.value.toLocaleString()}</span></p>
                      <p><strong>Expiration:</strong> {currentSelection.meta?.endDate} ({currentSelection.meta?.daysRemaining} days)</p>
                    </div>
                  </div>
                )}

                {/* Action Preview */}
                {currentSelection.type === 'action' && (
                  <div className="pt-2 text-center text-xs text-gray-500 dark:text-slate-400 space-y-2">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ArrowRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="font-semibold text-gray-800 dark:text-slate-300">Run Action Workflow</p>
                    <p className="font-sans leading-relaxed">Selecting this command will trigger a direct UI navigation swap or launch a matching form wizard immediately on your screen.</p>
                  </div>
                )}

                {/* Page Preview */}
                {currentSelection.type === 'page' && (
                  <div className="pt-2 text-center text-xs text-gray-500 dark:text-slate-400 space-y-2">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ArrowRight className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="font-semibold text-gray-800 dark:text-slate-300">Workspace Redirect</p>
                    <p className="font-sans leading-relaxed">Swap current workspace viewport directly onto this page index. Any edits or active forms will be cached locally.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-xs text-gray-400 font-sans py-16">
                Hover over search matches to see live parameters previews right inside this sidebar module.
              </div>
            )}

            <div className="pt-4 border-t border-gray-155 dark:border-gray-804 text-[10px] text-gray-400 dark:text-slate-500 select-none font-sans">
              Press <kbd className="font-mono font-bold">↵</kbd> key to navigate directly.
            </div>
          </div>
        </div>

        {/* Footer info row */}
        <div className="h-[38px] bg-gray-50 dark:bg-[#0c1221] border-t border-gray-150 dark:border-[#1F2937] px-4 flex items-center justify-between text-[11px] text-gray-400 dark:text-slate-500 select-none font-sans">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-700" />
            <span>↵ Select</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-700" />
            <span>ESC Close</span>
          </div>
          <div>
            <span>Global Sourcing Registry ⌘K</span>
          </div>
        </div>
      </div>
    </>
  );
};

// Index comparisons and custom highlighting helpers:
function indexToMatch(idx: number, index: number) {
  return idx === index;
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const match = query.toLowerCase().replace(/^[>][a-z]+\s+/, '').trim();
  if (!match) return text;

  const parts = text.split(new RegExp(`(${match})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === match ? (
          <mark key={i} className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-905 dark:text-yellow-300 rounded-[2px] px-0.5 py-[1px]">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
