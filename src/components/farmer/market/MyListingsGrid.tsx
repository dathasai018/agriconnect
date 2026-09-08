import React, { useState } from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { useLanguage } from '../../../context/LanguageContext';
import { MarketListing } from '../../../types';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  Tag,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const MyListingsGrid: React.FC<{ onOpenCreateModal: () => void }> = ({
  onOpenCreateModal
}) => {
  const { marketListings, deleteListing, toggleListingStatus } = useAgriStore();
  const { t } = useLanguage();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter listings by current demo farmer (Rameshwar Patel)
  const myListings = marketListings.filter((l) => l.farmerName.includes('Rameshwar'));

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
              <ShoppingBag className="w-4 h-4 text-[#212121]" />
            </div>
            <h3 className="text-base font-bold text-[#212121]">
              {t('my_active_listings')}
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            {t('manage_listings_sub')}
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-3.5 py-2 rounded-xl gradient-agri text-[#212121] font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 glow-btn"
        >
          <Plus className="w-4 h-4" />
          <span>{t('post_new_produce')}</span>
        </button>
      </div>

      {myListings.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-[#212121]">{t('no_listings_yet')}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {t('no_listings_sub')}
          </p>
          <button
            onClick={onOpenCreateModal}
            className="mt-3 px-3 py-1.5 bg-[#0D7377] text-white rounded-lg text-xs font-bold"
          >
            {t('post_new_produce')}
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myListings.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-soft transition-all"
            >
              <div className="relative h-36 bg-gray-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.crop}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                      item.status === 'active'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    {item.status === 'active' ? t('active_status') : t('sold_status')}
                  </span>
                  {item.isOrganic && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                      Organic
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#212121]">{item.crop}</h4>
                  <p className="text-[11px] text-gray-500">{item.variety}</p>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-extrabold text-[#0D7377]">
                        ₹{item.pricePerQuintal.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400"> /Qtl</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      {item.quantityQuintals} Qtl in Stock
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleListingStatus(item.id)}
                    className="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-all"
                  >
                    {t('toggle_status_btn')}
                  </button>
                  <button
                    onClick={() => deleteListing(item.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title={t('delete_btn')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
