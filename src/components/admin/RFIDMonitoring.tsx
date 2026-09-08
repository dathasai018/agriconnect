import React from 'react';
import { useAgriStore } from '../../context/AgriStoreContext';
import {
  Radio,
  Truck,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const TRUCK_FLOW_TREND = [
  { time: '06:00', trucks: 6 },
  { time: '08:00', trucks: 22 },
  { time: '10:00', trucks: 38 },
  { time: '12:00', trucks: 44 },
  { time: '14:00', trucks: 29 },
  { time: '16:00', trucks: 18 },
  { time: '18:00', trucks: 12 }
];

export const RFIDMonitoring: React.FC = () => {
  const { rfidLogs } = useAgriStore();

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
              <Radio className="w-4 h-4 text-[#212121]" />
            </div>
            <h3 className="text-base font-bold text-[#212121]">
              Automated Mandi RFID Tag Inward / Outward Logs
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            Real-time optical + RFID reader data from North & South Gate antennas
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table of RFID Logs */}
        <div className="lg:col-span-2 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="p-2.5">Tag ID</th>
                <th className="p-2.5">Vehicle Number</th>
                <th className="p-2.5">Driver / Farmer</th>
                <th className="p-2.5">Entry Time</th>
                <th className="p-2.5">Duration</th>
                <th className="p-2.5">Gate State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rfidLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50">
                  <td className="p-2.5 font-mono font-bold text-[#0D7377]">{log.tagId}</td>
                  <td className="p-2.5 font-mono">{log.truckNumber}</td>
                  <td className="p-2.5 font-medium text-gray-800">{log.driverName}</td>
                  <td className="p-2.5 text-gray-500">{log.entryTime}</td>
                  <td className="p-2.5 font-bold text-gray-700">{log.durationMinutes} mins</td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.gateStatus === 'Departed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.gateStatus === 'Unloading'
                          ? 'bg-teal-100 text-[#0D7377]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.gateStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live Truck Volume Trend Line */}
        <div className="h-48 w-full p-2 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            RFID Hourly Vehicle Velocity
          </p>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TRUCK_FLOW_TREND} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="trucks" stroke="#0D7377" strokeWidth={2.5} dot={{ r: 3, fill: '#14FFEC' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
