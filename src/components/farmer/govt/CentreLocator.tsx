import React, { useState } from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  MapPin,
  Truck,
  Users,
  Clock,
  Navigation,
  List,
  Map as MapIcon,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Search,
  Crosshair
} from 'lucide-react';

export const CentreLocator: React.FC = () => {
  const {
    centres,
    selectedCentreId,
    setSelectedCentreId,
    addToast,
    userCoords,
    isLocating,
    locationError,
    detectUserLocation
  } = useAgriStore();
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCentres = centres.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.currentCrop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCentre = centres.find((c) => c.id === selectedCentreId) || filteredCentres[0] || centres[0];

  const handleSelectCentre = (id: string, name: string) => {
    setSelectedCentreId(id);
    addToast('info', t('nearby_centres_title'), `${t('switch_to_centre')}: ${name}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft overflow-hidden">
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-white via-teal-50/10 to-white">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
              <MapPin className="w-4 h-4 text-[#212121]" />
            </div>
            <h3 className="text-base font-bold text-[#212121]">
              {t('nearby_centres_title')}
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {userCoords ? 'Real-time GPS proximity calculated' : t('nearby_centres_sub')}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs">
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'map' ? 'bg-white text-[#0D7377] shadow-xs' : 'text-gray-500'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{t('interactive_map')}</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'list' ? 'bg-white text-[#0D7377] shadow-xs' : 'text-gray-500'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>{t('centre_list')} ({filteredCentres.length})</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5">
        {/* Live GPS Bar & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-teal-50/70 border border-teal-100 rounded-xl mb-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={detectUserLocation}
              disabled={isLocating}
              className="px-3 py-2 bg-[#0D7377] hover:bg-[#095457] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-60"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? 'Detecting GPS...' : '📍 Use Live GPS Location'}
            </button>
            {userCoords ? (
              <div className="flex items-center gap-2 text-xs text-teal-900 bg-white/90 px-3 py-1.5 rounded-lg border border-teal-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold">Live GPS:</span>
                <span>{userCoords.lat.toFixed(3)}°N, {userCoords.lng.toFixed(3)}°E</span>
                <span className="text-[10px] text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded font-semibold">Real Distances</span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">
                Click to detect your exact GPS coordinates and sort mandis by real distance
              </span>
            )}
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <input
              type="text"
              placeholder="Search mandi, district, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 focus:border-[#0D7377] focus:ring-1 focus:ring-[#0D7377] outline-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        {viewMode === 'map' ? (
          <div className="space-y-4">
            {/* Stylized Interactive Map Canvas */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-50 border border-gray-200 rounded-xl overflow-hidden shadow-inner">
              {/* Grid Background Pattern */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: 'radial-gradient(#0D7377 0.75px, transparent 0.75px)',
                  backgroundSize: '16px 16px'
                }}
              />

              {/* Road / Route Visual Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <path d="M 50 150 Q 180 80 280 120 T 500 180" fill="none" stroke="#0D7377" strokeWidth="2.5" strokeDasharray="6 4" />
                <path d="M 120 40 Q 220 180 340 140 T 600 90" fill="none" stroke="#14FFEC" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              {/* Mandi Pins on Map */}
              {filteredCentres.map((c) => {
                const isSelected = c.id === selectedCentreId;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCentre(c.id, c.name)}
                    style={{ left: `${c.coordinates.x}%`, top: `${c.coordinates.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    <div className="relative flex items-center justify-center">
                      {isSelected && (
                        <div className="absolute w-8 h-8 rounded-full bg-[#14FFEC]/40 pulse-beacon" />
                      )}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 transition-transform duration-200 group-hover:scale-110 ${
                          isSelected
                            ? 'bg-[#0D7377] border-white text-[#14FFEC]'
                            : 'bg-white border-[#0D7377] text-[#0D7377]'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="absolute top-8 whitespace-nowrap bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded shadow text-[10px] font-bold border border-gray-200 text-[#212121]">
                        {c.name.split(' ')[0]} ({c.distanceKm}k)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Centre Snapshot Strip */}
            <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D7377] text-white flex items-center justify-center font-bold text-xs">
                  {selectedCentre.distanceKm}k
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-[#212121]">
                      {selectedCentre.name}
                    </h4>
                    <span className="text-[10px] bg-teal-100 text-[#0D7377] font-bold px-2 py-0.5 rounded-full">
                      {t('currently_selected')}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    {selectedCentre.district}, {selectedCentre.state} • {selectedCentre.distanceKm} {t('distance_km')} • {t('hours_label')}: {selectedCentre.operatingHours}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-center">
                  <p className="text-gray-400 text-[10px]">{t('trucks_label')}</p>
                  <p className="font-bold text-[#0D7377] text-sm">{selectedCentre.liveTruckCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-[10px]">{t('queue_label')}</p>
                  <p className="font-bold text-[#212121] text-sm">{selectedCentre.queueLength}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-[10px]">{t('est_turnaround')}</p>
                  <p className="font-bold text-emerald-700 text-sm">{selectedCentre.avgWaitMinutes}m</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-2.5">
            {filteredCentres.map((centre) => {
              const isSelected = centre.id === selectedCentreId;
              return (
                <div
                  key={centre.id}
                  onClick={() => handleSelectCentre(centre.id, centre.name)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-wrap items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#0D7377] bg-teal-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-[#0D7377] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {centre.distanceKm}k
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#212121]">{centre.name}</h4>
                      <p className="text-[11px] text-gray-500">
                        {centre.district}, {centre.state} • {t('crops_label')}: {centre.currentCrop}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Truck className="w-3.5 h-3.5 text-[#0D7377]" />
                      <strong>{centre.liveTruckCount}</strong> {t('trucks_label')}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Users className="w-3.5 h-3.5 text-[#0D7377]" />
                      <strong>{centre.queueLength}</strong> {t('waiting')}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        centre.congestionStatus === 'low'
                          ? 'bg-emerald-100 text-emerald-800'
                          : centre.congestionStatus === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {centre.avgWaitMinutes}m Wait
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
