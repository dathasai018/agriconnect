import React, { useState } from 'react';
import { useAgriStore } from '../../context/AgriStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { MarketListing } from '../../types';
import { ListingDetailModal } from './ListingDetailModal';
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  MapPin,
  CheckCircle2,
  Phone,
  Sparkles,
  Filter,
  ArrowUpDown
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { marketListings, fetchAllListings, isLoadingListings } = useAgriStore();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Produce');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null);

  React.useEffect(() => {
    fetchAllListings();
  }, []);

  const categories = [
    { key: 'All Produce', label: t('all_produce') },
    { key: 'Cereals', label: t('cereals_cat') },
    { key: 'Pulses', label: t('pulses_cat') },
    { key: 'Cash Crops', label: t('cash_crops_cat') },
    { key: 'Oilseeds', label: t('oilseeds_cat') },
    { key: 'Organic Special', label: t('organic_special_cat') }
  ];

  // Filtering
  const filteredListings = marketListings.filter((l) => {
    const matchesSearch =
      l.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice = l.pricePerQuintal <= maxPrice;

    if (selectedCategory === 'All Produce') return matchesSearch && matchesPrice;
    if (selectedCategory === 'Organic Special') return matchesSearch && matchesPrice && l.isOrganic;
    if (selectedCategory === 'Cereals') {
      return matchesSearch && matchesPrice && (l.crop.includes('Paddy') || l.crop.includes('Wheat') || l.crop.includes('Maize'));
    }
    if (selectedCategory === 'Pulses') {
      return matchesSearch && matchesPrice && (l.crop.includes('Chana') || l.crop.includes('Moong'));
    }
    if (selectedCategory === 'Cash Crops') {
      return matchesSearch && matchesPrice && (l.crop.includes('Cotton') || l.crop.includes('Turmeric'));
    }
    if (selectedCategory === 'Oilseeds') {
      return matchesSearch && matchesPrice && (l.crop.includes('Mustard') || l.crop.includes('Soybean'));
    }
    return matchesSearch && matchesPrice;
  });

  // Sorting
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'price_asc') return a.pricePerQuintal - b.pricePerQuintal;
    if (sortBy === 'price_desc') return b.pricePerQuintal - a.pricePerQuintal;
    return 0; // default newest
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-white via-teal-50/30 to-white p-5 rounded-2xl border border-gray-200 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#212121]">
              {t('marketplace_catalog_title')}
            </h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Zero Middlemen
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('marketplace_catalog_sub')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">
            <strong>{filteredListings.length}</strong> Lots Available
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-soft space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 min-w-[220px] relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_produce_placeholder')}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0D7377] focus:bg-white text-[#212121]"
            />
          </div>

          {/* Price Range Slider Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
            <span className="text-gray-500">{t('max_price_filter')}:</span>
            <span className="font-bold text-[#0D7377]">₹{maxPrice.toLocaleString()}</span>
            <input
              type="range"
              min={2000}
              max={15000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-[#0D7377]"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent outline-none text-xs text-gray-700 font-medium"
            >
              <option value="newest">Recently Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-[#0D7377] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedListings.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs hover:shadow-soft transition-all flex flex-col justify-between"
          >
            {/* Image */}
            <div className="relative h-44 bg-gray-100 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.crop}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white shadow-xs">
                  {item.qualityGrade}
                </span>
                {item.isOrganic && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                    Organic
                  </span>
                )}
              </div>
              <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-sm border border-gray-200 text-right">
                <p className="text-[9px] text-gray-500 uppercase font-semibold">{t('price')}</p>
                <p className="text-sm font-extrabold text-[#0D7377]">
                  ₹{item.pricePerQuintal.toLocaleString()}{' '}
                  <span className="text-[10px] text-gray-500 font-normal">/Qtl</span>
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-[#212121] leading-tight">{item.crop}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.variety}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs py-2 px-2.5 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-gray-400 text-[10px]">{t('quantity')}</p>
                    <p className="font-bold text-[#212121]">{item.quantityQuintals} Quintals</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">{t('min_order')}</p>
                    <p className="font-bold text-[#212121]">{item.minOrderQuintals} Qtl</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{item.farmerLocation}</span>
                  </div>
                  <span>Moisture: {item.moistureContent}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedListing(item)}
                className="w-full py-2.5 bg-[#0D7377] hover:bg-[#095457] text-[#14FFEC] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs glow-btn"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t('contact_farmer_btn')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Listing Detail & Negotiation Modal */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
      />
    </div>
  );
};
