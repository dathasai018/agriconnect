import React from 'react';
import { useAgriStore } from '../../context/AgriStoreContext';
import {
  CalendarCheck,
  Truck,
  Clock,
  Users,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Radio
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { queueTokens, slots, rfidLogs } = useAgriStore();

  const totalBookingsToday = slots.filter((s) => s.dayLabel === 'Today').reduce((acc, s) => acc + s.bookedCount, 0);
  const activeTrucks = 28;
  const avgWaitMin = 34;
  const farmersServed = 84;

  const kpis = [
    {
      title: "Today's Mandi Bookings",
      value: totalBookingsToday,
      subtext: '+12% vs yesterday',
      icon: <CalendarCheck className="w-5 h-5 text-[#0D7377]" />,
      sparkline: [24, 30, 45, 52, 68, 79, totalBookingsToday]
    },
    {
      title: 'Trucks Currently On-Site',
      value: activeTrucks,
      subtext: '4 unloading bays active',
      icon: <Truck className="w-5 h-5 text-[#0D7377]" />,
      sparkline: [14, 18, 22, 30, 26, 28, activeTrucks]
    },
    {
      title: 'Avg Turnaround Wait Time',
      value: `${avgWaitMin}m`,
      subtext: '-28% with Vertex AI scheduling',
      icon: <Clock className="w-5 h-5 text-emerald-600" />,
      sparkline: [65, 58, 48, 42, 38, 35, avgWaitMin]
    },
    {
      title: 'Farmers Processed Today',
      value: farmersServed,
      subtext: '₹1.84 Cr DBT approved',
      icon: <Users className="w-5 h-5 text-[#0D7377]" />,
      sparkline: [20, 35, 48, 62, 70, 78, farmersServed]
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-soft flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">{kpi.title}</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
              {kpi.icon}
            </div>
          </div>

          <div className="my-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#212121]">{kpi.value}</span>
            {/* Mini Sparkline SVG */}
            <svg className="w-20 h-6 overflow-visible">
              <polyline
                fill="none"
                stroke="#0D7377"
                strokeWidth="2"
                points={kpi.sparkline
                  .map((val, i) => `${(i / (kpi.sparkline.length - 1)) * 80},${24 - ((val - Math.min(...kpi.sparkline)) / (Math.max(...kpi.sparkline) - Math.min(...kpi.sparkline) || 1)) * 20}`)
                  .join(' ')}
              />
            </svg>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{kpi.subtext}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
