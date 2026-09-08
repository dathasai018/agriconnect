import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  TrendingUp,
  BarChart2,
  Sparkles,
  Info,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const MSP_DATA = [
  { crop: 'Paddy (Grade A)', currentMSP: 2320, lastYearMSP: 2183, trend3Yr: [2040, 2183, 2320], gain: '+6.3%' },
  { crop: 'Wheat (Sharbati)', currentMSP: 2275, lastYearMSP: 2125, trend3Yr: [2015, 2125, 2275], gain: '+7.1%' },
  { crop: 'Raw Cotton', currentMSP: 7121, lastYearMSP: 6620, trend3Yr: [6080, 6620, 7121], gain: '+7.6%' },
  { crop: 'Maize (Yellow)', currentMSP: 2090, lastYearMSP: 1962, trend3Yr: [1870, 1962, 2090], gain: '+6.5%' },
  { crop: 'Desi Chana', currentMSP: 5440, lastYearMSP: 5335, trend3Yr: [5100, 5335, 5440], gain: '+2.0%' },
  { crop: 'Yellow Mustard', currentMSP: 5650, lastYearMSP: 5450, trend3Yr: [5050, 5450, 5650], gain: '+3.7%' }
];

const HISTORICAL_TREND = [
  { year: '2023-24', Paddy: 2040, Wheat: 2015, Cotton: 6080, Maize: 1870 },
  { year: '2024-25', Paddy: 2183, Wheat: 2125, Cotton: 6620, Maize: 1962 },
  { year: '2025-26', Paddy: 2320, Wheat: 2275, Cotton: 7121, Maize: 2090 }
];

export const MSPPriceDashboard: React.FC = () => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
              <TrendingUp className="w-4 h-4 text-[#212121]" />
            </div>
            <h3 className="text-base font-bold text-[#212121]">
              {t('msp_dashboard_title')}
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            {t('msp_dashboard_sub')}
          </p>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              chartType === 'bar' ? 'bg-white text-[#0D7377] shadow-xs' : 'text-gray-500'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{t('yoy_comparison')}</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              chartType === 'line' ? 'bg-white text-[#0D7377] shadow-xs' : 'text-gray-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('three_year_trend')}</span>
          </button>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
        {MSP_DATA.map((item, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200/80">
            <p className="text-[11px] font-bold text-gray-700 truncate">{item.crop.split(' ')[0]}</p>
            <p className="text-base font-extrabold text-[#0D7377] mt-0.5">₹{item.currentMSP}</p>
            <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
              <span>{t('last_year_msp')}: ₹{item.lastYearMSP}</span>
              <span className="font-bold text-emerald-600">{item.gain}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={MSP_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="crop" tick={{ fontSize: 10, fill: '#475569' }} interval={0} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                formatter={(val: any) => [`₹${val}/Quintal`, 'MSP Rate']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="currentMSP" name={t('current_msp_label')} fill="#0D7377" radius={[6, 6, 0, 0]} />
              <Bar dataKey="lastYearMSP" name={t('last_year_msp')} fill="#cbd5e1" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={HISTORICAL_TREND} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#475569' }} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="Paddy" stroke="#0D7377" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Wheat" stroke="#eab308" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Cotton" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Maize" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
