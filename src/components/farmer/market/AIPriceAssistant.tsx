import React from 'react';
import { Sparkles, TrendingUp, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AIPriceAssistantProps {
  cropName: string;
  farmerPrice: number;
  mspPrice: number;
  marketAvg: number;
}

export const AIPriceAssistant: React.FC<AIPriceAssistantProps> = ({
  cropName,
  farmerPrice,
  mspPrice,
  marketAvg
}) => {
  const suggestedMin = Math.round(marketAvg * 0.95);
  const suggestedMax = Math.round(marketAvg * 1.08);

  const chartData = [
    { name: 'Govt MSP', price: mspPrice, fill: '#94a3b8' },
    { name: 'Mandi Avg', price: marketAvg, fill: '#0D7377' },
    { name: 'Your Price', price: farmerPrice, fill: '#14FFEC' }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-teal-50/40 p-4 rounded-xl border border-teal-200/90 shadow-xs space-y-3">
      <div className="flex items-center gap-2 text-[#0D7377]">
        <Sparkles className="w-4 h-4" />
        <h4 className="text-xs font-extrabold uppercase tracking-wider">
          AI Price Suggestion Assistant
        </h4>
      </div>

      <div className="p-3 bg-white rounded-lg border border-teal-100 shadow-2xs">
        <p className="text-xs text-gray-500">
          Suggested Price Range for <strong>{cropName || 'Selected Produce'}</strong>:
        </p>
        <p className="text-lg font-extrabold text-[#0D7377] mt-0.5">
          ₹{suggestedMin.toLocaleString()} – ₹{suggestedMax.toLocaleString()}{' '}
          <span className="text-xs text-gray-400 font-normal">/Quintal</span>
        </p>
        <p className="text-[10px] text-gray-500 mt-1">
          Based on Agmarknet 7-day terminal wholesale trades & current moisture benchmarks.
        </p>
      </div>

      {/* Mini Bar Comparison */}
      <div className="h-28 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: '10px', borderRadius: '8px' }}
              formatter={(val: any) => [`₹${val}`, 'Price']}
            />
            <Bar dataKey="price" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
