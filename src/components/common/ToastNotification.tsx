import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<Props> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-100'
              : toast.type === 'error'
              ? 'bg-rose-950/80 border-rose-500/30 text-rose-100'
              : 'bg-sky-950/80 border-sky-500/30 text-sky-100'
          }`}
        >
          <div className="mr-3 mt-0.5 shrink-0">
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs opacity-80 mt-1 line-clamp-2">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
