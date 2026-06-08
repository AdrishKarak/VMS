import React, { useMemo, useState } from 'react';
import { useVMS } from '../vmsContext';
import { Contract, PurchaseOrder } from '../types';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  PackageSearch,
  Plus,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  X
} from 'lucide-react';

type RegistryItem = {
  sku: string;
  name: string;
  category: string;
  preferredVendor: string;
  unit: string;
  unitPrice: number;
  stockClass: 'Critical' | 'Standard' | 'Strategic' | 'Tail Spend';
  leadTime: string;
  status: 'Active' | 'Review' | 'Blocked';
};

const seededItems: RegistryItem[] = [
  { sku: 'ITM-1001', name: 'Industrial IoT gateway kit', category: 'Manufacturing', preferredVendor: 'Apex Industrial Supplies', unit: 'Kit', unitPrice: 1280, stockClass: 'Critical', leadTime: '14 days', status: 'Active' },
  { sku: 'ITM-1002', name: 'SOC2 managed audit bundle', category: 'Technology', preferredVendor: 'Nimbus Cloud Systems', unit: 'Bundle', unitPrice: 8450, stockClass: 'Strategic', leadTime: '21 days', status: 'Active' },
  { sku: 'ITM-1003', name: 'Cold-chain packing sensors', category: 'Logistics', preferredVendor: 'Vertex Freight Partners', unit: 'Case', unitPrice: 420, stockClass: 'Standard', leadTime: '9 days', status: 'Review' },
  { sku: 'ITM-1004', name: 'Executive legal review hours', category: 'Legal', preferredVendor: 'Summit Legal Group', unit: 'Hour', unitPrice: 360, stockClass: 'Strategic', leadTime: '5 days', status: 'Active' },
  { sku: 'ITM-1005', name: 'Safety inspection consumables', category: 'Facilities', preferredVendor: 'Harbor Safety Co.', unit: 'Pack', unitPrice: 96, stockClass: 'Standard', leadTime: '7 days', status: 'Active' },
  { sku: 'ITM-1006', name: 'ERP connector support block', category: 'Software', preferredVendor: 'Oracle ERP cloud link', unit: 'Block', unitPrice: 2750, stockClass: 'Strategic', leadTime: '10 days', status: 'Active' },
  { sku: 'ITM-1007', name: 'Warehouse scanner batteries', category: 'Operations', preferredVendor: 'Apex Industrial Supplies', unit: 'Unit', unitPrice: 68, stockClass: 'Tail Spend', leadTime: '4 days', status: 'Active' },
  { sku: 'ITM-1008', name: 'ESG supplier verification report', category: 'Compliance', preferredVendor: 'Greenline Assurance', unit: 'Report', unitPrice: 1490, stockClass: 'Strategic', leadTime: '12 days', status: 'Review' },
  { sku: 'ITM-1009', name: 'Emergency repair retainers', category: 'Facilities', preferredVendor: 'Metro Field Services', unit: 'Retainer', unitPrice: 5200, stockClass: 'Critical', leadTime: '2 days', status: 'Active' },
  { sku: 'ITM-1010', name: 'Marketing print collateral', category: 'Marketing', preferredVendor: 'BrightPress Studio', unit: 'Lot', unitPrice: 740, stockClass: 'Tail Spend', leadTime: '8 days', status: 'Blocked' },
  { sku: 'ITM-1011', name: 'Data retention archive storage', category: 'Technology', preferredVendor: 'Nimbus Cloud Systems', unit: 'TB', unitPrice: 185, stockClass: 'Standard', leadTime: '6 days', status: 'Active' },
  { sku: 'ITM-1012', name: 'Loading dock maintenance kit', category: 'Facilities', preferredVendor: 'Metro Field Services', unit: 'Kit', unitPrice: 1120, stockClass: 'Critical', leadTime: '11 days', status: 'Active' },
  { sku: 'ITM-1013', name: 'Vendor background screening', category: 'Compliance', preferredVendor: 'Greenline Assurance', unit: 'Screen', unitPrice: 310, stockClass: 'Standard', leadTime: '3 days', status: 'Active' },
  { sku: 'ITM-1014', name: 'Forklift telemetry license', category: 'Operations', preferredVendor: 'Vertex Freight Partners', unit: 'Seat', unitPrice: 145, stockClass: 'Strategic', leadTime: '10 days', status: 'Review' },
  { sku: 'ITM-1015', name: 'Annual penetration test package', category: 'Technology', preferredVendor: 'Nimbus Cloud Systems', unit: 'Package', unitPrice: 18750, stockClass: 'Strategic', leadTime: '28 days', status: 'Active' },
  { sku: 'ITM-1016', name: 'Contract translation service', category: 'Legal', preferredVendor: 'Summit Legal Group', unit: 'Document', unitPrice: 680, stockClass: 'Tail Spend', leadTime: '6 days', status: 'Active' },
  { sku: 'ITM-1017', name: 'PPE replenishment bin', category: 'Facilities', preferredVendor: 'Harbor Safety Co.', unit: 'Bin', unitPrice: 235, stockClass: 'Standard', leadTime: '5 days', status: 'Active' },
  { sku: 'ITM-1018', name: 'Cloud incident response retainer', category: 'Technology', preferredVendor: 'Nimbus Cloud Systems', unit: 'Retainer', unitPrice: 9800, stockClass: 'Critical', leadTime: '1 day', status: 'Active' },
  { sku: 'ITM-1019', name: 'Freight lane benchmarking study', category: 'Logistics', preferredVendor: 'Vertex Freight Partners', unit: 'Study', unitPrice: 4200, stockClass: 'Strategic', leadTime: '18 days', status: 'Review' },
  { sku: 'ITM-1020', name: 'Office ergonomic assessment', category: 'Operations', preferredVendor: 'Harbor Safety Co.', unit: 'Assessment', unitPrice: 540, stockClass: 'Tail Spend', leadTime: '9 days', status: 'Active' }
];

const money = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const StatusPill: React.FC<{ label?: string }> = ({ label = '' }) => {
  const style =
    label.includes('Active') || label.includes('Approved') || label.includes('Received') || label.includes('Paid')
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400'
      : label.includes('Draft') || label.includes('Pending') || label.includes('Review') || label.includes('Expiring')
      ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400'
      : label.includes('Blocked') || label.includes('Cancelled') || label.includes('Expired') || label.includes('Terminated')
      ? 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-400'
      : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${style}`}>
      {label}
    </span>
  );
};

export const ProcurementModule: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    vendors,
    purchaseOrders,
    contracts,
    addPurchaseOrder,
    addContract,
    updatePurchaseOrder,
    updateContract,
    itemsRegistry: items,
    setItemsRegistry: setItems
  } = useVMS();

  const renderPriorityBadge = (priority: PurchaseOrder['priority']) => {
    const styles = {
      Urgent: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
      High: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30',
      Normal: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
      Low: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700/50'
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${styles[priority] || styles.Normal}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          priority === 'Urgent' ? 'bg-red-500' :
          priority === 'High' ? 'bg-orange-500' :
          priority === 'Normal' ? 'bg-blue-500' : 'bg-slate-400'
        }`} />
        {priority}
      </span>
    );
  };

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const activePage = currentPage === 'contracts' ? 'contracts' : currentPage === 'purchase-orders' ? 'purchase-orders' : 'items-registry';

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const text = `${item.sku} ${item.name} ${item.category} ${item.preferredVendor}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const text = `${po.id} ${po.title} ${po.vendorName} ${po.category} ${po.status}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || po.category === categoryFilter || po.status === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [purchaseOrders, search, categoryFilter]);

  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      const text = `${contract.id} ${contract.title} ${contract.vendorName} ${contract.type} ${contract.status}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || contract.type === categoryFilter || contract.status === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [contracts, search, categoryFilter]);

  const categories = useMemo(() => {
    if (activePage === 'items-registry') {
      return ['All', ...Array.from(new Set(items.map((item) => item.category)))];
    }
    if (activePage === 'purchase-orders') {
      return ['All', ...Array.from(new Set(purchaseOrders.flatMap((po) => [po.category, po.status])))];
    }
    return ['All', ...Array.from(new Set(contracts.flatMap((contract) => [contract.type, contract.status])))];
  }, [activePage, items, purchaseOrders, contracts]);

  const stats = [
    { label: 'Registry Items', value: items.length, icon: PackageSearch },
    { label: 'Open PO Value', value: money(purchaseOrders.filter((po) => po.status !== 'Cancelled').reduce((sum, po) => sum + po.amount, 0)), icon: ShoppingCart },
    { label: 'Active Contracts', value: contracts.filter((contract) => contract.status === 'Active').length, icon: FileText },
    { label: 'Urgent POs', value: purchaseOrders.filter((po) => po.priority === 'Urgent').length, icon: ClipboardList }
  ];

  const resetFilters = () => {
    setSearch('');
    setCategoryFilter('All');
  };

  return (
    <div className="pt-14 space-y-8 font-sans">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-[#161B27] border rounded-md p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] uppercase font-bold text-gray-400 block">{stat.label}</span>
                  <strong className="text-2xl font-black text-gray-950 dark:text-white block mt-2">{stat.value}</strong>
                </div>
                <div className="w-11 h-11 rounded bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#161B27] border rounded-md p-2 shadow-sm flex flex-wrap gap-2">
        {[
          { id: 'items-registry', label: 'Items Registry', icon: PackageSearch },
          { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
          { id: 'contracts', label: 'Contracts', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentPage(tab.id as typeof activePage);
                resetFilters();
              }}
              className={`flex-1 min-w-[180px] px-4 py-3 rounded font-bold text-xs uppercase flex items-center justify-center gap-2 ${
                isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#161B27] border rounded-md p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <h2 className="text-xl font-black text-gray-950 dark:text-white">
              {activePage === 'items-registry' ? 'Items Registry' : activePage === 'purchase-orders' ? 'Purchase Orders' : 'Contracts'}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {activePage === 'items-registry'
                ? 'Manage approved catalog items, vendor ownership, pricing, lead times, and stock classification.'
                : activePage === 'purchase-orders'
                ? 'Track requisitions, approvals, delivery status, payment readiness, and line item totals.'
                : 'Review agreement ownership, renewal dates, contract values, SLA terms, and active obligations.'}
            </p>
          </div>

          <button
            onClick={() => {
              if (activePage === 'items-registry') setCurrentPage('add-registry-item');
              if (activePage === 'purchase-orders') setCurrentPage('create-po');
              if (activePage === 'contracts') setCurrentPage('create-contract');
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {activePage === 'items-registry' ? 'Add Item' : activePage === 'purchase-orders' ? 'Create PO' : 'Create Contract'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, title, vendor, category, or status..."
              className="w-full h-[42px] pl-10 pr-4 border rounded bg-white dark:bg-slate-900 dark:border-[#1F2937] text-sm outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-[42px] min-w-[220px] border rounded px-3 bg-white dark:bg-[#161B27] dark:border-[#1F2937] text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button onClick={resetFilters} className="px-4 py-2 border rounded font-bold text-sm text-gray-600 dark:text-slate-300 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Reset
          </button>
        </div>

        {activePage === 'items-registry' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px] text-sm">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Preferred Vendor</th>
                  <th>Unit</th>
                  <th>Unit Price</th>
                  <th>Class</th>
                  <th>Lead Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.sku} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40">
                    <td className="font-bold text-blue-600">{item.sku}</td>
                    <td className="font-bold text-gray-950 dark:text-white">{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.preferredVendor}</td>
                    <td>{item.unit}</td>
                    <td className="font-bold">{money(item.unitPrice)}</td>
                    <td>{item.stockClass}</td>
                    <td>{item.leadTime}</td>
                    <td><StatusPill label={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activePage === 'purchase-orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1120px] text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700/60">
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">PO ID</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Vendor</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Required By</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Items</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPOs.slice(0, 30).map((po) => {
                  const isAdvanceable = po.status === 'Draft' || po.status === 'Pending Approval';
                  return (
                    <tr key={po.id} className="hover:bg-blue-50/20 dark:hover:bg-slate-800/20 transition-colors duration-150">
                      <td className="align-middle py-4 pr-3 border-b border-gray-100 dark:border-slate-800/60">
                        <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 rounded">
                          {po.id}
                        </span>
                      </td>
                      <td className="align-middle py-4 pr-3 border-b border-gray-100 dark:border-slate-800/60 max-w-[240px]">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-white truncate" title={po.title}>
                            {po.title}
                          </span>
                          <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium tracking-wide mt-0.5">
                            {po.category}
                          </span>
                        </div>
                      </td>
                      <td className="align-middle py-4 pr-3 border-b border-gray-100 dark:border-slate-800/60 font-medium text-gray-700 dark:text-slate-300">
                        {po.vendorName}
                      </td>
                      <td className="align-middle py-4 pr-3 border-b border-gray-100 dark:border-slate-800/60 text-gray-650 dark:text-slate-400">
                        <div className="flex items-center gap-1.5 text-xs">
                          <CalendarDays className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                          <span>{po.requiredBy}</span>
                        </div>
                      </td>
                      <td className="align-middle py-4 pr-3 border-b border-gray-100 dark:border-slate-800/60">
                        {renderPriorityBadge(po.priority)}
                      </td>
                      <td className="align-middle py-4 pr-3 border-b border-gray-100 dark:border-slate-800/60 text-center font-semibold text-gray-600 dark:text-slate-450 font-mono text-xs">
                        {po.itemsCount}
                      </td>
                      <td className="align-middle py-4 pr-3 border-b border-gray-100 dark:border-slate-800/60 font-bold text-gray-900 dark:text-white font-mono text-[13px]">
                        {money(po.amount)}
                      </td>
                      <td className="align-middle py-4 pr-3 border-b border-gray-100 dark:border-slate-800/60">
                        <StatusPill label={po.status} />
                      </td>
                      <td className="align-middle py-4 pr-3 border-b border-gray-100 dark:border-slate-800/60">
                        <StatusPill label={po.paymentStatus} />
                      </td>
                      <td className="align-middle py-4 border-b border-gray-100 dark:border-slate-800/60">
                        {isAdvanceable ? (
                          <button
                            onClick={() => updatePurchaseOrder({ ...po, status: po.status === 'Draft' ? 'Pending Approval' : po.status === 'Pending Approval' ? 'Approved' : po.status })}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:hover:bg-blue-900/30 dark:text-blue-400 border border-blue-150 dark:border-blue-900/40 rounded font-bold text-xs transition duration-150 cursor-pointer"
                          >
                            Advance
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 dark:text-slate-500">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activePage === 'contracts' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredContracts.slice(0, 24).map((contract) => (
              <div key={contract.id} className="border rounded-md p-5 bg-gray-50/40 dark:bg-slate-900/20 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600">{contract.id}</span>
                    <h3 className="text-base font-black text-gray-950 dark:text-white mt-1">{contract.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{contract.vendorName}</p>
                  </div>
                  <StatusPill label={contract.status} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="block text-xs text-gray-400 font-bold">Type</span>{contract.type}</div>
                  <div><span className="block text-xs text-gray-400 font-bold">Value</span>{money(contract.value)}</div>
                  <div><span className="block text-xs text-gray-400 font-bold">End Date</span>{contract.endDate}</div>
                  <div><span className="block text-xs text-gray-400 font-bold">Owner</span>{contract.owner}</div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{contract.specialTerms}</p>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <span className="text-xs text-gray-400 font-bold">{contract.autoRenew ? 'Auto renewal enabled' : 'Manual renewal'} / Notice {contract.noticePeriod}</span>
                  <button
                    onClick={() => updateContract({ ...contract, status: contract.status === 'Draft' ? 'Active' : contract.status })}
                    className="px-3 py-1.5 border rounded font-bold text-xs text-blue-600"
                  >
                    Mark Active
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProcurementModule;
