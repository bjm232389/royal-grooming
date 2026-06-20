import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bgColor = 'bg-neutral-900/95 border-neutral-800';
        let icon = <Info className="w-5 h-5 text-brand-cyan" />;
        
        if (toast.type === 'success') {
          bgColor = 'bg-neutral-900/95 border-gold-500/20';
          icon = <CheckCircle className="w-5 h-5 text-gold-500" />;
        } else if (toast.type === 'warn') {
          bgColor = 'bg-neutral-900/95 border-amber-500/20';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md animate-[slideIn_0.3s_ease-out] ${bgColor}`}
            style={{
              boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 text-sm font-medium text-neutral-200">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
