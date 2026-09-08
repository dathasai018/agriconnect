import React from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Users,
  Ticket,
  Clock,
  CheckCircle2,
  Radio,
  ArrowRight
} from 'lucide-react';

export const QueueTokenWidget: React.FC = () => {
  const { queueTokens, userToken } = useAgriStore();
  const { t } = useLanguage();

  const currentServing = queueTokens.find((q) => q.status === 'in-progress') || queueTokens[2];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
            <Ticket className="w-4 h-4 text-[#212121]" />
          </div>
          <h3 className="text-base font-bold text-[#212121]">
            {t('live_queue_title')}
          </h3>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
          {t('live_token_display')}
        </span>
      </div>

      {/* Token Counters Row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Currently Serving Counter */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t('now_serving')}</p>
          <p className="text-3xl font-extrabold text-[#212121] mt-1 font-mono">
            {currentServing.tokenNumber}
          </p>
          <p className="text-[11px] text-[#0D7377] font-semibold mt-1">
            {t('bay_label')} #{currentServing.assignedBay} • {currentServing.farmerName.split(' ')[0]}
          </p>
        </div>

        {/* Your Token Counter */}
        <div className="p-4 bg-teal-50/70 border-2 border-[#0D7377] rounded-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#0D7377] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
            {t('your_token')}
          </div>
          <p className="text-[11px] font-bold text-[#0D7377] uppercase tracking-wider">{t('your_token')}</p>
          <p className="text-3xl font-extrabold text-[#0D7377] mt-1 font-mono">
            {userToken?.tokenNumber || 'TK-105'}
          </p>
          <p className="text-[11px] text-emerald-700 font-bold mt-1">
            {userToken?.estMinutesLeft || 24} {t('mins_to_bay')} #{userToken?.assignedBay || 4}
          </p>
        </div>
      </div>

      {/* Progress Line */}
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span className="text-gray-600 font-medium">
            3 {t('trucks_label')} {t('waiting')}
          </span>
        </div>
        <span className="font-bold text-[#0D7377]">
          {t('status_open')}
        </span>
      </div>
    </div>
  );
};
