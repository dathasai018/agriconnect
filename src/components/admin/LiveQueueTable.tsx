import React, { useState } from 'react';
import { useAgriStore } from '../../context/AgriStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { QueueToken } from '../../types';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Truck,
  ArrowRight
} from 'lucide-react';

export const LiveQueueTable: React.FC = () => {
  const { queueTokens, updateQueueStatus, addToast } = useAgriStore();
  const { t } = useLanguage();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = queueTokens.filter((q) => {
    if (filterStatus === 'all') return true;
    return q.status === filterStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
              <Users className="w-4 h-4 text-[#212121]" />
            </div>
            <h3 className="text-base font-bold text-[#212121]">
              {t('live_queue_operations')}
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            {t('live_queue_sub')}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs">
          {['all', 'waiting', 'in-progress', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg font-semibold uppercase text-[10px] transition-all ${
                filterStatus === st ? 'bg-white text-[#0D7377] shadow-xs' : 'text-gray-500'
              }`}
            >
              {st === 'all' ? t('all') : st === 'waiting' ? t('waiting') : st === 'in-progress' ? t('in_progress') : t('completed')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-3.5 pl-5">Token #</th>
              <th className="p-3.5">{t('farmer')}</th>
              <th className="p-3.5">{t('crop')} & {t('quantity')}</th>
              <th className="p-3.5">{t('trucks_label')} / {t('bay_label')}</th>
              <th className="p-3.5">{t('est_turnaround')}</th>
              <th className="p-3.5">{t('status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item) => {
              let badge = 'bg-amber-100 text-amber-800 border-amber-200';
              if (item.status === 'in-progress') badge = 'bg-teal-100 text-[#0D7377] border-teal-200';
              if (item.status === 'completed') badge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
              if (item.status === 'no-show') badge = 'bg-rose-100 text-rose-800 border-rose-200';

              return (
                <tr key={item.tokenNumber} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-3.5 pl-5 font-mono font-bold text-[#0D7377]">
                    {item.tokenNumber}
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-[#212121]">{item.farmerName}</p>
                    <p className="text-[10px] text-gray-400">{item.farmerPhone}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-gray-800">{item.crop}</p>
                    <p className="text-[10px] text-gray-500">{item.quantityQuintals} Quintals</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-mono text-gray-700">{item.truckNumber}</p>
                    <span className="text-[10px] font-bold text-[#0D7377]">{t('bay_label')} #{item.assignedBay}</span>
                  </td>
                  <td className="p-3.5">
                    {item.status === 'completed' ? (
                      <span className="text-emerald-700 font-semibold text-[11px]">{t('completed')}</span>
                    ) : (
                      <span className="font-medium text-gray-700">{item.estMinutesLeft} mins</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {/* Status Pill Switcher */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const nextStatus: QueueToken['status'] =
                            item.status === 'waiting'
                              ? 'in-progress'
                              : item.status === 'in-progress'
                              ? 'completed'
                              : 'waiting';
                          updateQueueStatus(item.tokenNumber, nextStatus);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 ${badge}`}
                        title="Click to advance status"
                      >
                        <span className="capitalize">
                          {item.status === 'waiting' ? t('waiting') : item.status === 'in-progress' ? t('in_progress') : t('completed')}
                        </span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>

                      {item.status !== 'no-show' && item.status !== 'completed' && (
                        <button
                          onClick={() => updateQueueStatus(item.tokenNumber, 'no-show')}
                          className="text-[10px] text-rose-500 hover:text-rose-700 font-medium px-1.5 py-0.5 rounded hover:bg-rose-50"
                          title="Mark absent"
                        >
                          {t('no_show')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
