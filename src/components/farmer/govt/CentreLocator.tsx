import React, { useState } from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  MapPin,
  Phone,
  Navigation,
  Crosshair,
  Search,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  AlertCircle
} from 'lucide-react';

export const CentreLocator: React.FC = () => {
  const {
    centres,
    selectedCentreId,
    setSelectedCentreId,
    userCoords,
    isLocating,
    locationError,
    detectUserLocation
  } = useAgriStore();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCentres = centres.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <span>📍</span> Nearby Agricultural Centers
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Verified APMC market yards and government procurement terminals.
          </p>
        </div>

        {/* Use My Location Button */}
        <button
          onClick={detectUserLocation}
          disabled={isLocating}
          className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto disabled:opacity-60 touch-target"
        >
          <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detecting GPS...' : t('use_my_location')}</span>
        </button>
      </div>

      {/* GPS Status / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {userCoords ? (
          <div className="flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 pulse-soft" />
            <span className="font-bold">Live GPS Active:</span>
            <span>{userCoords.lat.toFixed(3)}°N, {userCoords.lng.toFixed(3)}°E</span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded text-emerald-800 font-semibold border border-emerald-200">
              Real Distances Verified
            </span>
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Click "Use My Location" to calculate real road distance to nearby mandis.
          </p>
        )}

        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search mandi or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Centers List */}
      {filteredCentres.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="font-bold text-gray-700 text-sm">
            {t('no_centers_verified')}
          </p>
          <p className="text-xs text-gray-400">
            Try adjusting your search query or enabling device GPS.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCentres.map((centre) => {
            const isSelected = centre.id === selectedCentreId;
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${centre.latitude || 17.9689},${centre.longitude || 79.5941}`;

            return (
              <div
                key={centre.id}
                className={`p-5 rounded-3xl border-2 transition-all space-y-4 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/20 shadow-sm ring-1 ring-emerald-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {centre.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {centre.mandiCode}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{centre.district}, {centre.state}</span>
                    </p>

                    <p className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Operating: {centre.operatingHours}</span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 ml-1" />
                      <span className="text-[11px] text-emerald-700 font-semibold">Open</span>
                    </p>
                  </div>

                  {/* Distance Pill */}
                  <div className="self-start sm:self-auto sm:text-right shrink-0">
                    <span className="inline-block px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs sm:text-sm">
                      📍 {centre.distanceKm} km away
                    </span>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {centre.liveTruckCount} trucks on site
                    </p>
                  </div>
                </div>

                {/* Bottom Actions: Call & Directions */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-gray-500 font-medium">
                    Allowed Produce: <strong>{centre.currentCrop}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Call Button */}
                    <a
                      href={`tel:${centre.contactPhone}`}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors flex items-center gap-1.5 touch-target"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>📞 Call</span>
                    </a>

                    {/* Directions Button */}
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs touch-target"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>🧭 Directions</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
