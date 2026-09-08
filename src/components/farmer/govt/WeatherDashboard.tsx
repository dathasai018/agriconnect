import React from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  CloudRain,
  Sun,
  CloudSun,
  CloudLightning,
  AlertTriangle,
  BellRing,
  Wind,
  Droplets
} from 'lucide-react';

export const WeatherDashboard: React.FC = () => {
  const { weatherForecast, smsAlertActive, toggleSmsAlert } = useAgriStore();
  const { t } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-6 h-6 text-cyan-600 animate-bounce" />;
      case 'Sun':
        return <Sun className="w-6 h-6 text-amber-500 animate-spin" style={{ animationDuration: '12s' }} />;
      case 'CloudSun':
        return <CloudSun className="w-6 h-6 text-amber-600" />;
      case 'CloudLightning':
        return <CloudLightning className="w-6 h-6 text-purple-600 animate-pulse" />;
      default:
        return <Sun className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
              <CloudSun className="w-4 h-4 text-[#212121]" />
            </div>
            <h3 className="text-base font-bold text-[#212121]">
              {t('weather_radar_title')}
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            {t('weather_radar_sub')}
          </p>
        </div>

        {/* SMS Toggle */}
        <button
          onClick={toggleSmsAlert}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
            smsAlertActive
              ? 'bg-teal-50 border-teal-200 text-[#0D7377]'
              : 'bg-gray-50 border-gray-200 text-gray-400'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>{smsAlertActive ? t('sms_alerts_active') : t('sms_alerts_off')}</span>
        </button>
      </div>

      {/* 5-Day Forecast Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {weatherForecast.map((day, idx) => {
          const isHighRain = day.rainProbability >= 70;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col items-center text-center justify-between space-y-2 transition-all ${
                isHighRain
                  ? 'bg-rose-50/60 border-rose-200 ring-1 ring-rose-300'
                  : 'bg-gray-50/60 border-gray-200/90'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-[#212121]">{day.day}</span>
                <p className="text-[10px] text-gray-400">{day.date}</p>
              </div>

              <div className="my-1">{getIcon(day.icon)}</div>

              <div>
                <p className="text-base font-extrabold text-[#212121]">{day.tempC}°C</p>
                <p className="text-[10px] text-gray-500 font-medium truncate max-w-[80px]">
                  {day.condition}
                </p>
              </div>

              <div className="w-full pt-1.5 border-t border-gray-200/60 flex items-center justify-around text-[10px]">
                <span className="flex items-center gap-0.5 text-cyan-700 font-semibold" title={t('rain_chance')}>
                  <Droplets className="w-3 h-3 text-cyan-600" />
                  {day.rainProbability}%
                </span>
                <span className="flex items-center gap-0.5 text-gray-500" title={t('wind_speed')}>
                  <Wind className="w-3 h-3 text-gray-400" />
                  {day.windSpeedKmh}k
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
