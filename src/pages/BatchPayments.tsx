import React, { useMemo } from 'react';
import { useVMS } from '../vmsContext';
import { BatchPayment } from '../types';
import {
  Layers,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  DollarSign,
  CreditCard,
  Plus
} from 'lucide-react';

export const BatchPayments: React.FC = () => {
  const {
    batchPayments,
    updateBatchStatus,
    setCurrentPage
  } = useVMS();

  // Stats
  const stats = useMemo(() => {
    const pending = batchPayments.filter(b => b.status === 'Pending Approval' || b.status === 'Processing');
    const completed = batchPayments.filter(b => b.status === 'Completed');
    const failed = batchPayments.filter(b => b.status === 'Failed');

    const totalPendingAmount = pending.reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      pendingAmount: totalPendingAmount,
      pendingCount: pending.length,
      completedCount: completed.length,
      failedCount: failed.length,
      totalCount: batchPayments.length
    };
  }, [batchPayments]);

  // Get status color helper
  const getStatusBadge = (status: BatchPayment['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 border border-emerald-800 bg-emerald-950/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 border border-blue-800 bg-blue-950/20 text-blue-400 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase animate-pulse">
            <Play className="w-3 h-3 rotate-90" /> Processing
          </span>
        );
      case 'Pending Approval':
        return (
          <span className="inline-flex items-center gap-1 border border-amber-800 bg-amber-950/20 text-amber-400 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
            <Clock className="w-3 h-3" /> Pending Approval
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 border border-red-800 bg-red-950/20 text-red-400 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
            <XCircle className="w-3 h-3" /> Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Batch Payment Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#161B27] p-4 border dark:border-[#1F2937] rounded flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Queue Value</span>
            <strong className="font-roboto font-extrabold text-xl text-gray-950 dark:text-white block mt-1">
              ${stats.pendingAmount.toLocaleString()}
            </strong>
          </div>
          <div className="p-2 bg-blue-500/10 text-blue-500 rounded">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B27] p-4 border dark:border-[#1F2937] rounded flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Batches in Queue</span>
            <strong className="font-roboto font-extrabold text-xl text-gray-950 dark:text-white block mt-1">
              {stats.pendingCount}
            </strong>
          </div>
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B27] p-4 border dark:border-[#1F2937] rounded flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Completed Batches</span>
            <strong className="font-roboto font-extrabold text-xl text-gray-950 dark:text-white block mt-1">
              {stats.completedCount}
            </strong>
          </div>
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B27] p-4 border dark:border-[#1F2937] rounded flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Failed Batches</span>
            <strong className="font-roboto font-extrabold text-xl text-gray-950 dark:text-white block mt-1">
              {stats.failedCount}
            </strong>
          </div>
          <div className="p-2 bg-red-500/10 text-red-500 rounded">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white dark:bg-[#161B27] border dark:border-[#1F2937] rounded-md shadow-sm overflow-hidden text-xs">
        <div className="p-4 border-b dark:border-[#1F2937] flex justify-between items-center bg-gray-50/45 dark:bg-slate-900/10">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Batch Cash Disbursements</h3>
            <span className="text-gray-400 block mt-0.5 font-normal">Review and approve scheduled bulk invoice payments.</span>
          </div>
          <button
            onClick={() => setCurrentPage('create-batch-payment')}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer transition uppercase text-[10px] flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule Batch Clearance
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[750px]">
            <thead className="bg-[#1C2333]/90 text-[10px] text-white/50 uppercase tracking-widest font-sans">
              <tr>
                <th className="p-3 pl-4">Batch ID</th>
                <th className="p-3">Batch Name</th>
                <th className="p-3">Method</th>
                <th className="p-3 text-center">Invoices</th>
                <th className="p-3 text-center">Vendors</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3">Execution Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-gray-800 text-slate-700 dark:text-slate-200">
              {batchPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400 italic">No batch payments logged.</td>
                </tr>
              ) : (
                batchPayments.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50/10 transition">
                    <td className="p-3 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">{batch.id}</td>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white max-w-[200px] truncate" title={batch.name}>
                      {batch.name}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                        {batch.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold">{batch.invoiceRefs.length}</td>
                    <td className="p-3 text-center font-mono font-bold">{batch.vendorCount}</td>
                    <td className="p-3 text-right font-mono font-bold text-gray-900 dark:text-slate-100">
                      ${batch.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-500 dark:text-slate-400 font-medium">
                      {batch.scheduledDate}
                    </td>
                    <td className="p-3">{getStatusBadge(batch.status)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {batch.status === 'Pending Approval' && (
                          <>
                            <button
                              onClick={() => updateBatchStatus(batch.id, 'Completed')}
                              title="Approve & Disburse"
                              className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded cursor-pointer transition border border-emerald-500/20"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => updateBatchStatus(batch.id, 'Failed')}
                              title="Cancel Batch"
                              className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-50/20 rounded cursor-pointer transition border border-red-500/20"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {batch.status === 'Processing' && (
                          <button
                            onClick={() => updateBatchStatus(batch.id, 'Completed')}
                            title="Finalize Clearance"
                            className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[9px] font-bold cursor-pointer transition uppercase"
                          >
                            Clear
                          </button>
                        )}
                        {batch.status === 'Completed' && (
                          <span className="text-[10px] text-gray-400 font-mono">Released</span>
                        )}
                        {batch.status === 'Failed' && (
                          <span className="text-[10px] text-red-400 font-mono">Aborted</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
