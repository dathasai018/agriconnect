import React from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Truck,
  Clock,
  Activity,
  BarChart3,
  TrendingUp,
  Radio
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const HOURLY_TRUCK_FLOW = [
  { hour: '06 AM', trucks: 8, waitMin: 12 },
  { hour: '08 AM', trucks: 22, waitMin: 28 },
  { hour: '10 AM', trucks: 34, waitMin: 45 },
  { hour: '12 PM', trucks: 42, waitMin: 65 },
  { hour: '02 PM', trucks: 28, waitMin: 32 },
  { hour: '04 PM', trucks: 18, waitMin: 22 },
  { hour: '06 PM', trucks: 10, waitMin: 15 }
];

export const TruckDashboard: React.FC = () => {
  const { rfidLogs } = useAgriStore();
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
            <Truck className="w-4 h-4 text-[#212121]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#212121]">
              {t('truck_flow_title')}
            </h3>
            <p className="text-xs text-gray-500">
              {t('truck_flow_sub')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            {t('rfid_reader_live')}
          </span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-[11px] text-gray-500">{t('active_trucks_onsite')}</p>
          <p className="text-2xl font-extrabold text-[#0D7377] mt-0.5">28</p>
          <span className="text-[10px] text-emerald-700 font-semibold">4 {t('bay_label')}s active</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-[11px] text-gray-500">{t('avg_turnaround_time')}</p>
          <p className="text-2xl font-extrabold text-[#212121] mt-0.5">34m</p>
          <span className="text-[10px] text-emerald-700 font-semibold">-22m vs manual mandi</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 col-span-2 sm:col-span-1">
          <p className="text-[11px] text-gray-500">{t('peak_inbound_hour')}</p>
          <p className="text-2xl font-extrabold text-amber-700 mt-0.5">12:00 PM</p>
          <span className="text-[10px] text-amber-700 font-semibold">42 {t('trucks_label')} expected</span>
        </div>
      </div>

      {/* Flow Chart */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={HOURLY_TRUCK_FLOW} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
              formatter={(val: any) => [`${val} trucks`, 'Volume']}
            />
            <Bar dataKey="trucks" fill="#0D7377" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
