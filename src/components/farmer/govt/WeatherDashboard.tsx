import React from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  CloudSun,
  Droplets,
  Wind,
  BellRing,
  Sun,
  CloudRain,
  CloudLightning
} from 'lucide-react';

export const WeatherDashboard: React.FC = () => {
  const { weatherForecast, smsAlertActive, toggleSmsAlert } = useAgriStore();
  const { t } = useLanguage();

  const today = weatherForecast[0] || {
    day: 'Today',
    date: '09 Sep',
    tempC: 32,
    condition: 'Partly Cloudy',
    rainProbability: 20,
    humidity: 65,
    windSpeedKmh: 12,
    advisory: 'Clear conditions. Good weather for harvest transport and mandi delivery.'
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <span>🌦</span> Weather Advisory
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Rainfall predictions and harvest transport guidance for Warangal region.
          </p>
        </div>

        {/* SMS Weather Alerts Button */}
        <button
          onClick={toggleSmsAlert}
          className={`px-4 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto ${
            smsAlertActive
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
          }`}
        >
          <BellRing className="w-4 h-4 text-emerald-700" />
          <span>{smsAlertActive ? 'SMS Weather Alerts: ON' : 'SMS Weather Alerts: OFF'}</span>
        </button>
      </div>

      {/* Main Visual Weather Card (Required Example) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/40 border-2 border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 text-sm font-extrabold">
            <span className="text-2xl">🌤</span>
            <span>Today</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight">
              {today.tempC}°C
            </span>
            <span className="text-lg sm:text-xl font-bold text-gray-600">
              {today.condition}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-emerald-800 font-medium">
            {today.advisory || 'Clear conditions. Good weather for harvest transport.'}
          </p>
        </div>

        {/* 3 Key Metrics: Rain, Humidity, Wind */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-8">
          <div className="text-center sm:text-left p-3 rounded-2xl bg-white/80 border border-gray-100 shadow-2xs">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-blue-600 mb-1">
              <Droplets className="w-4 h-4" />
              <span className="text-[11px] font-bold">Rain</span>
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-gray-900">
              {today.rainProbability}%
            </p>
          </div>

          <div className="text-center sm:text-left p-3 rounded-2xl bg-white/80 border border-gray-100 shadow-2xs">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-teal-600 mb-1">
              <span className="text-xs">💧</span>
              <span className="text-[11px] font-bold">Humidity</span>
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-gray-900">
              {today.humidity}%
            </p>
          </div>

          <div className="text-center sm:text-left p-3 rounded-2xl bg-white/80 border border-gray-100 shadow-2xs">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-gray-600 mb-1">
              <Wind className="w-4 h-4" />
              <span className="text-[11px] font-bold">Wind</span>
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-gray-900">
              {today.windSpeedKmh} km/h
            </p>
          </div>
        </div>
      </div>

      {/* 5-Day Strip */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          5-Day Forecast
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {weatherForecast.map((day, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-col items-center text-center space-y-1.5"
            >
              <span className="text-xs font-bold text-gray-900">{day.day}</span>
              <span className="text-[10px] text-gray-400">{day.date}</span>
              <span className="text-2xl my-1">
                {day.condition.includes('Rain') ? '🌧' : day.condition.includes('Cloud') ? '⛅' : '☀️'}
              </span>
              <p className="text-base font-extrabold text-gray-900">{day.tempC}°C</p>
              <span className="text-[11px] text-gray-500 truncate max-w-[80px]">{day.condition}</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                💧 {day.rainProbability}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
