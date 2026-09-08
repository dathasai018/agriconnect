import React from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  CheckCircle2,
  Clock,
  Circle,
  FileCheck,
  CreditCard,
  Building2,
  Sparkles
} from 'lucide-react';

export const PaymentTracker: React.FC = () => {
  const { paymentStages, updatePaymentRecord } = useAgriStore();
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
              <CreditCard className="w-4 h-4 text-[#212121]" />
            </div>
            <h3 className="text-base font-bold text-[#212121]">
              {t('payment_tracker_title')}
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            {t('payment_tracker_sub')}
          </p>
        </div>

        {/* Demo Fast-Advance Button */}
        <button
          onClick={() => updatePaymentRecord('pay-3', 'paid', 'Grade A')}
          className="px-3 py-1 rounded-xl bg-teal-50 border border-teal-200 text-[#0D7377] hover:bg-teal-100 font-bold text-xs transition-all flex items-center gap-1 shadow-2xs"
          title="Simulate bank disbursement instant trigger"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('simulate_dbt_payout')}</span>
        </button>
      </div>

      {/* Stepper Display */}
      <div className="relative">
        {/* Horizontal Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-gray-200 -z-0" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {paymentStages.map((stage, idx) => {
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';

            return (
              <div key={stage.id} className="flex md:flex-col items-start md:items-center gap-3 md:text-center">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                      : isCurrent
                      ? 'bg-[#0D7377] text-white ring-4 ring-[#14FFEC]/40 animate-pulse'
                      : 'bg-gray-100 text-gray-400 border border-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Step Text Info */}
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-[#212121] leading-tight">
                    {stage.label}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug hidden md:block">
                    {stage.description}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800'
                        : isCurrent
                        ? 'bg-teal-50 text-[#0D7377]'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? t('completed') : isCurrent ? t('in_progress') : t('pending')} • {stage.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
