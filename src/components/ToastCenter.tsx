import React from 'react';
import { useVMS } from '../vmsContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastCenter: React.FC = () => {
  const { toasts, removeToast } = useVMS();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded bg-white dark:bg-[#161B27] border-l-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)] animate-slide-in duration-200 ${
            toast.type === 'success'
              ? 'border-emerald-500'
              : toast.type === 'error'
              ? 'border-red-500'
              : 'border-blue-500'
          }`}
          style={{ contentVisibility: 'auto' }}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold font-sans text-gray-900 dark:text-slate-100 leading-tight">
              {toast.title}
            </h4>
            <p className="text-xs font-sans text-gray-500 dark:text-slate-400 mt-1 leading-normal">
              {toast.description}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-slate-100 p-0.5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
