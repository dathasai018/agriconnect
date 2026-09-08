import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAgriStore } from '../../context/AgriStoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAgriStore();

  return (
    <div className="fixed top-20 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
          let border = 'border-emerald-200';
          let bg = 'bg-white';

          if (toast.type === 'alert') {
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
            border = 'border-amber-200';
          } else if (toast.type === 'info') {
            icon = <Info className="w-5 h-5 text-[#0D7377] flex-shrink-0" />;
            border = 'border-[#0D7377]/30';
          } else if (toast.type === 'warning') {
            icon = <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
            border = 'border-rose-200';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto p-4 rounded-xl shadow-lg border ${border} ${bg} flex items-start gap-3 relative overflow-hidden backdrop-blur-md`}
            >
              <div className="pt-0.5">{icon}</div>
              <div className="flex-1 pr-4">
                <p className="font-semibold text-sm text-[#212121]">{toast.title}</p>
                <p className="text-xs text-[#323232]/80 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
