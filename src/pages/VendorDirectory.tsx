import React, { useState, useMemo, useEffect } from 'react';
import { useVMS } from '../vmsContext';
import { Vendor } from '../types';
import { CATEGORY_COLORS } from '../mockData';
import {
  Search,
  Building2,
  Filter,
  Grid,
  List,
  Download,
  Plus,
  ArrowUpDown,
  Mail,
  Phone,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GitCompare,
  Trash2,
  ShieldCheck,
  Power,
  X,
  Star
} from 'lucide-react';

export const VendorDirectory: React.FC = () => {
  const {
    vendors,
    comparedVendors,
    toggleCompareVendor,
    clearComparedVendors,
    setCurrentPage,
    setSelectedVendorId,
    removeVendor,
    addToast
  } = useVMS();

  // View States
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 12;

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');

  // Multi-selection row checklists
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Sorting
  const [sortField, setSortField] = useState<keyof Vendor>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPageNum(1);
  }, [search, categoryFilter, statusFilter, tierFilter, countryFilter]);

  // Handle individual actions dropdown popovers
  const [activeActionsId, setActiveActionsId] = useState<string | null>(null);

  // Filters logic
  const filteredVendors = useMemo(() => {
    return vendors
      .filter((v) => {
        const matchesSearch =
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.id.toLowerCase().includes(search.toLowerCase()) ||
          v.city.toLowerCase().includes(search.toLowerCase()) ||
          v.email.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || v.category === categoryFilter;
        const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
        const matchesTier = tierFilter === 'All' || v.tier === tierFilter;
        const matchesCountry = countryFilter === 'All' || v.country.includes(countryFilter);

        return matchesSearch && matchesCategory && matchesStatus && matchesTier && matchesCountry;
      })
      .sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];

        if (typeof fieldA === 'string') {
          fieldA = (fieldA as string).toLowerCase();
          fieldB = (fieldB as string).toLowerCase();
        }

        if (fieldA === undefined) return 1;
        if (fieldB === undefined) return -1;

        if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [vendors, search, categoryFilter, statusFilter, tierFilter, countryFilter, sortField, sortDirection]);

  // Paginated visible rows
  const paginatedVendors = useMemo(() => {
    const startIndex = (currentPageNum - 1) * itemsPerPage;
    return filteredVendors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVendors, currentPageNum]);

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  const handleSort = (field: keyof Vendor) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = paginatedVendors.map((v) => v.id);
      setSelectedIds(ids);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const executeBulkCompare = () => {
    if (selectedIds.length < 2) {
      addToast('error', 'Select More Vendors', 'Please select at least 2 vendors to launch comparison charts.');
      return;
    }
    clearComparedVendors();
    selectedIds.slice(0, 4).forEach((id) => toggleCompareVendor(id));
    setCurrentPage('compare');
    addToast('success', 'Launching Comparison', `Comparing ${Math.min(4, selectedIds.length)} selected vendors side by side.`);
    setSelectedIds([]);
  };

  const executeBulkDelete = () => {
    const confirm = window.confirm(`Proceed to de-register and delete ${selectedIds.length} select nodes?`);
    if (confirm) {
      selectedIds.forEach((id) => removeVendor(id));
      setSelectedIds([]);
      addToast('info', 'Bulk Clean complete', 'Deleted selected nodes ledger entries.');
    }
  };

  const triggerExport = (format: string) => {
    addToast('info', 'Preparing File Download', `Synthesizing registration entries in ${format} document index.`);
    setTimeout(() => {
      addToast('success', 'Export Complete', `Successfully compiled and downloaded VendorList.${format.toLowerCase()}`);
    }, 1500);
  };

  // Get status dots color mappings
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400';
      case 'Under Review':
        return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400';
      case 'Inactive':
        return 'bg-gray-150 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-400';
      case 'Blocked':
        return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 40) return 'text-emerald-600 dark:text-emerald-400';
    if (score < 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-450';
  };

  // Extract unique categories and countries for select dropdowns
  const uniqueCategories = useMemo(() => Array.from(new Set(vendors.map(v => v.category))), [vendors]);
  const uniqueCountries = useMemo(() => Array.from(new Set(vendors.map(v => v.country.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '').trim()))), [vendors]);

  return (
    <div className="pt-14 space-y-6 font-sans relative w-full max-w-full overflow-hidden">
      {/* Search and Filters Controls Row */}
      <div className="bg-white dark:bg-[#161B27] p-4 rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm space-y-4 w-full">
        <div className="flex flex-col xl:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              className="w-full h-[38px] pl-9 pr-4 bg-gray-50/55 dark:bg-[#1C2333]/70 text-[13px] border border-gray-200 dark:border-[#1F2937] rounded-sm focus:border-blue-600 text-gray-950 dark:text-white outline-none"
              placeholder="Search by legal name, registration code ID, email or contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Sorter select buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category selection */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-[38px] border border-gray-200 dark:border-[#1F2937] text-[13px] rounded-sm px-2.5 bg-white dark:bg-[#161B27] text-gray-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status selection */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[38px] border border-gray-200 dark:border-[#1F2937] text-[13px] rounded-sm px-2.5 bg-white dark:bg-[#161B27] text-gray-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>

            {/* Tier selection */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="h-[38px] border border-gray-200 dark:border-[#1F2937] text-[13px] rounded-sm px-2.5 bg-white dark:bg-[#161B27] text-gray-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Tiers</option>
              <option value="Tier 1">Tier 1 - Strategic</option>
              <option value="Tier 2">Tier 2 - Preferred</option>
              <option value="Tier 3">Tier 3 - Transactional</option>
            </select>

            {/* Country selectors */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="h-[38px] border border-gray-200 dark:border-[#1F2937] text-[13px] rounded-sm px-2.5 bg-white dark:bg-[#161B27] text-gray-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Countries</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Clear filters trigger */}
            {(categoryFilter !== 'All' || statusFilter !== 'All' || tierFilter !== 'All' || countryFilter !== 'All' || search !== '') && (
              <button
                onClick={() => {
                  setCategoryFilter('All');
                  setStatusFilter('All');
                  setTierFilter('All');
                  setCountryFilter('All');
                  setSearch('');
                  setSelectedIds([]);
                  addToast('info', 'Filters Reset', 'Consulting unrestricted vendor registry database.');
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2 h-[38px] flex items-center justify-center cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="xl:ml-auto flex items-center gap-2">
            {/* View selectors */}
            <div className="flex border border-gray-200 dark:border-slate-800 p-0.5 rounded-sm">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-sm ${viewMode === 'table' ? 'bg-gray-100 dark:bg-slate-800 text-blue-600' : 'text-gray-400 hover:text-gray-650'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-sm ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-slate-800 text-blue-600' : 'text-gray-400 hover:text-gray-650'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            {/* Export registers */}
            <button
              onClick={() => triggerExport('CSV')}
              className="h-[38px] px-3 border border-gray-200 dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-sm text-gray-755 dark:text-[#CBD5E1] flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            {/* General New Onboard */}
            <button
              onClick={() => setCurrentPage('onboarding')}
              className="h-[38px] px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-sm flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Applied filter chips */}
        {(categoryFilter !== 'All' || statusFilter !== 'All' || tierFilter !== 'All' || countryFilter !== 'All') && (
          <div className="flex flex-wrap gap-2 items-center text-xs border-t border-gray-100 dark:border-gray-800/80 pt-3">
            <span className="text-gray-400 font-semibold block">Active Parameters:</span>
            {categoryFilter !== 'All' && (
              <span className="px-2 py-0.5 bg-blue-50/70 dark:bg-blue-900/10 border dark:border-slate-800 rounded font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                Cat: {categoryFilter}
                <X className="w-3 h-3 cursor-pointer hover:text-blue-950" onClick={() => setCategoryFilter('All')} />
              </span>
            )}
            {statusFilter !== 'All' && (
              <span className="px-2 py-0.5 bg-amber-50/70 dark:bg-amber-900/10 border dark:border-slate-800 rounded font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                Status: {statusFilter}
                <X className="w-3 h-3 cursor-pointer hover:text-amber-950" onClick={() => setStatusFilter('All')} />
              </span>
            )}
            {tierFilter !== 'All' && (
              <span className="px-2 py-0.5 bg-purple-50/70 dark:bg-purple-900/10 border dark:border-slate-800 rounded font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                Tier: {tierFilter}
                <X className="w-3 h-3 cursor-pointer hover:text-purple-950" onClick={() => setTierFilter('All')} />
              </span>
            )}
            {countryFilter !== 'All' && (
              <span className="px-2 py-0.5 bg-rose-50/70 dark:bg-rose-900/10 border dark:border-slate-800 rounded font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                Country: {countryFilter}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-950" onClick={() => setCountryFilter('All')} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* TABLE DATA visualizer layout */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-[#161B27] rounded-md border border-gray-200 dark:border-gray-800/80 shadow-sm overflow-hidden transition-all duration-150">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-[13px] border-collapse min-w-[1100px]">
              <thead className="bg-gray-50/60 dark:bg-[#1C2333]/90 text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider border-b border-gray-150 dark:border-gray-804">
                <tr>
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === paginatedVendors.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="p-4 cursor-pointer hover:text-blue-600 w-[120px]" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1">
                      Vendor ID
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="p-4 cursor-pointer hover:text-blue-600" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Legal Entity name
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Tier Matrix</th>
                  <th className="p-4">Geographic Node</th>
                  <th className="p-4 text-center">Score Card</th>
                  <th className="p-4 text-center">Risk Score</th>
                  <th className="p-4 text-right" onClick={() => handleSort('contractValue')}>
                    <div className="flex items-center gap-1 justify-end cursor-pointer hover:text-blue-600">
                      Contracts MTD
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="p-4">Status Checkpoint</th>
                  <th className="p-4 w-[60px]" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                {paginatedVendors.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-20 text-center font-sans text-gray-500">
                      <div className="max-w-md mx-auto">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200">No matching vendor nodes found</h4>
                        <p className="text-xs text-gray-400 mt-1">Refine your search parameters or check filters configurations.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedVendors.map((v) => {
                    const isSelected = selectedIds.includes(v.id);
                    const catColors = CATEGORY_COLORS[v.category] || CATEGORY_COLORS['Other'];
                    return (
                      <tr
                        key={v.id}
                        className={`transition hover:bg-blue-50/20 dark:hover:bg-slate-850/40 ${isSelected ? 'bg-blue-50/10 dark:bg-blue-900/5' : ''}`}
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(v.id, e.target.checked)}
                          />
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              setSelectedVendorId(v.id);
                              setCurrentPage('vendor-detail');
                            }}
                            className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800"
                          >
                            {v.id}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-[34px] h-[34px] bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-slate-200 font-bold rounded-full flex items-center justify-center font-roboto text-xs flex-shrink-0 border uppercase">
                              {v.logoInitials}
                            </div>
                            <div className="overflow-hidden min-w-0">
                              <span className="font-bold text-gray-905 dark:text-white block leading-tight truncate">
                                {v.name}
                              </span>
                              <span className="text-[11px] text-gray-500 dark:text-slate-500 truncate block mt-0.5">
                                {v.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${catColors.bg} ${catColors.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${catColors.dot}`} />
                            {v.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block text-[11.5px] font-semibold px-2 py-0.5 rounded-sm ${
                              v.tier === 'Tier 1'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                : v.tier === 'Tier 2'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                            }`}
                          >
                            {v.tier}
                          </span>
                        </td>
                        <td className="p-4 text-gray-700 dark:text-slate-300 truncate max-w-[150px]">
                          {v.country}
                        </td>
                        <td className="p-4 text-center font-mono font-bold text-slate-800 dark:text-slate-300">
                          {v.performanceScore}/100
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-mono font-extrabold text-[13.5px] ${getRiskScoreColor(v.riskScore)}`}>
                            {v.riskScore}
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-gray-805 dark:text-white">
                          ${v.contractValue.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className={`inline-block border text-[11.5px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeStyles(v.status)}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-4 relative">
                          <button
                            onClick={() => setActiveActionsId(activeActionsId === v.id ? null : v.id)}
                            className="p-1 hover:bg-gray-150 dark:hover:bg-slate-800 rounded text-gray-500 hover:text-gray-900 transition"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeActionsId === v.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveActionsId(null)} />
                              <div className="absolute right-4 mt-1 w-44 bg-white dark:bg-[#161B27] border border-gray-205 dark:border-gray-803 rounded-md shadow-lg p-1 z-25 py-1.5 animate-scale-up duration-150">
                                <button
                                  onClick={() => {
                                    setSelectedVendorId(v.id);
                                    setCurrentPage('vendor-detail');
                                    setActiveActionsId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-850 text-xs font-semibold text-gray-850 dark:text-slate-333"
                                >
                                  View profile
                                </button>
                                <button
                                  onClick={() => {
                                    toggleCompareVendor(v.id);
                                    setActiveActionsId(null);
                                    addToast('info', 'Registry compare toggled', `Added ${v.name} to comparison card cache.`);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-850 text-xs font-semibold text-gray-850 dark:text-slate-333 flex items-center gap-1.5"
                                >
                                  <GitCompare className="w-3.5 h-3.5 text-blue-500" />
                                  Compare node
                                </button>
                                <button
                                  onClick={() => {
                                    alert(`Directing risk appraisal audit module mapping VND reference: ${v.id}.`);
                                    setCurrentPage('risk');
                                    setActiveActionsId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-850 text-xs font-semibold text-gray-850 dark:text-slate-333"
                                >
                                  Assess risks
                                </button>
                                <button
                                  onClick={() => {
                                    const confirm = window.confirm(`Deactivate node mapping matching ${v.name}?`);
                                    if (confirm) {
                                      removeVendor(v.id);
                                    }
                                    setActiveActionsId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold text-red-650"
                                >
                                  Deactivate
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="bg-gray-50 dark:bg-[#1C2333]/30 p-4 border-t border-gray-150 dark:border-gray-844 flex items-center justify-between text-xs text-gray-450 dark:text-slate-400 font-sans select-none">
            <span>
              Showing {(currentPageNum - 1) * itemsPerPage + 1}–{Math.min(currentPageNum * itemsPerPage, filteredVendors.length)} of{' '}
              <strong className="text-gray-900 dark:text-white">{filteredVendors.length}</strong> folders
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPageNum === 1}
                onClick={() => setCurrentPageNum((p) => p - 1)}
                className="p-1 px-2 border border-gray-200 dark:border-gray-803 disabled:opacity-40 rounded bg-white hover:bg-gray-50 dark:bg-slate-800 font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPageNum(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center font-bold font-sans rounded border ${
                    currentPageNum === i + 1
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'border-gray-200 dark:border-gray-803 bg-white hover:bg-gray-50 dark:bg-slate-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPageNum === totalPages}
                onClick={() => setCurrentPageNum((p) => p + 1)}
                className="p-1 px-2 border border-gray-200 dark:border-gray-803 disabled:opacity-40 rounded bg-white hover:bg-gray-50 dark:bg-slate-800 font-semibold"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* GRID DATA visualizer layout */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedVendors.length === 0 ? (
              <div className="col-span-full py-16 text-center text-gray-500 bg-white border rounded">
                No matching registers found.
              </div>
            ) : (
              paginatedVendors.map((v) => {
                const catColors = CATEGORY_COLORS[v.category] || CATEGORY_COLORS['Other'];
                const isSelected = selectedIds.includes(v.id);
                return (
                  <div
                    key={v.id}
                    className={`bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800/80 rounded shadow-sm flex flex-col justify-between overflow-hidden relative transition hover:shadow-md ${
                      isSelected ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    {/* Header color band */}
                    <div className="h-10 bg-gradient-to-r from-blue-700/80 to-indigo-800/80 relative">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(v.id, e.target.checked)}
                        className="absolute left-3 top-3 scale-100 cursor-pointer z-10"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-mono text-white/80 uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded leading-none">
                        {v.id}
                      </span>
                    </div>

                    {/* Logo centered overlap */}
                    <div className="-mt-6 flex justify-center sticky z-10">
                      <div className="w-[52px] h-[52px] rounded-full bg-slate-50 dark:bg-[#161B27] p-1 shadow-sm">
                        <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs uppercase">
                          {v.logoInitials}
                        </div>
                      </div>
                    </div>

                    {/* Body contents */}
                    <div className="p-4 text-center space-y-2 mt-1">
                      <h3
                        onClick={() => {
                          setSelectedVendorId(v.id);
                          setCurrentPage('vendor-detail');
                        }}
                        className="text-[14px] font-extrabold text-gray-905 dark:text-white leading-tight truncate hover:underline hover:text-blue-500 cursor-pointer"
                      >
                        {v.name}
                      </h3>
                      <div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${catColors.bg} ${catColors.text}`}>
                          {v.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-center text-amber-500 gap-0.5 text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-gray-755 dark:text-slate-300 font-mono text-[11.5px]">{v.performanceScore}/100</span>
                      </div>

                      {/* Spark Grid metrics */}
                      <div className="grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-gray-800/80 mt-1.5 pt-3 text-[11px] font-sans">
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Spend</span>
                          <strong className="text-gray-900 dark:text-white block mt-0.5 font-roboto leading-none">
                            ${v.contractValue >= 1000000 ? `${(v.contractValue / 1000000).toFixed(1)}M` : `${v.contractValue / 1000}K`}
                          </strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Risk Score</span>
                          <strong className={`block mt-0.5 font-mono leading-none ${getRiskScoreColor(v.riskScore)}`}>
                            {v.riskScore}
                          </strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Tier</span>
                          <strong className="text-gray-900 dark:text-white block mt-0.5 leading-none">
                            T-{v.tier.substring(5)}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer action row */}
                    <div className="bg-gray-50/75 dark:bg-[#1C2333]/40 p-3 flex items-center justify-between border-t border-gray-150 dark:border-gray-844 mt-auto">
                      <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${getStatusBadgeStyles(v.status)} border`}>
                        {v.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedVendorId(v.id);
                          setCurrentPage('vendor-detail');
                        }}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                      >
                        View Profile &rarr;
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* BULK ACTIONS BANNER PANEL */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-16 md:left-[264px] right-4 md:right-6 bg-[#0F1729] dark:bg-[#090E1A] text-white p-3.5 px-6 rounded border border-slate-700 shadow-[0_15px_40px_rgba(0,0,0,0.35)] flex flex-col md:flex-row md:items-center justify-between gap-4 z-40 animate-slide-up duration-200 font-sans">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold flex items-center gap-2">
              <span className="bg-blue-600 text-white leading-none flex items-center justify-center p-1 px-1.5 text-xs font-bold rounded-sm">
                {selectedIds.length}
              </span>
              folders selected for bulk dispatch procedures
            </span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-400 hover:text-white text-xs underline"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={executeBulkCompare}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded transition flex items-center gap-1 cursor-pointer"
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare Selected
            </button>
            <button
              onClick={() => {
                alert(`Batch updating ${selectedIds.length} select nodes categorical flags.`);
                setSelectedIds([]);
              }}
              className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs rounded font-semibold transition"
            >
              Assign Category
            </button>
            <button
              onClick={executeBulkDelete}
              className="px-3 py-1.5 border border-red-900 bg-red-900/30 hover:bg-red-900 text-white text-xs rounded font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Deactivate Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
