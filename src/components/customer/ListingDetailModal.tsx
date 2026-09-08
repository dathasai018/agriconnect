import React, { useState } from 'react';
import { MarketListing } from '../../types';
import { useAgriStore } from '../../context/AgriStoreContext';
import {
  X,
  Phone,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  Droplets,
  PackageCheck,
  ShoppingBag
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: MarketListing | null;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose
}) => {
  const { addToast } = useAgriStore();
  const [showPhone, setShowPhone] = useState(false);
  const [offerQuantity, setOfferQuantity] = useState(25);
  const [isOrdering, setIsOrdering] = useState(false);

  if (!listing) return null;

  const handleSimulateCall = () => {
    setShowPhone(true);
    addToast(
      'info',
      'Connecting Call to Farmer',
      `Dialing ${listing.farmerPhone} (${listing.farmerName}). Connecting via AgriConnect secure bridge...`
    );
  };

  const handleSimulateWhatsApp = () => {
    addToast(
      'success',
      'WhatsApp Inquiry Opened',
      `Pre-filled inquiry sent for ${offerQuantity} Qtl of ${listing.crop} to ${listing.farmerName}.`
    );
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      addToast(
        'success',
        'Direct Purchase Inquiry Submitted',
        `Contract for ${offerQuantity} Qtl of ${listing.crop} (₹${(offerQuantity * listing.pricePerQuintal).toLocaleString()}) sent to ${listing.farmerName}.`
      );
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header Image */}
        <div className="relative h-56 w-full flex-shrink-0">
          <img
            src={listing.imageUrl}
            alt={listing.crop}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-[#212121] p-1.5 rounded-full shadow-md backdrop-blur-xs transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 flex gap-2">
            {listing.isOrganic && (
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                Certified Organic
              </span>
            )}
            <span className="bg-[#0D7377] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
              {listing.qualityGrade}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-extrabold text-[#212121]">{listing.crop}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{listing.variety}</p>
              <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0D7377]" />
                <span>{listing.farmerLocation}, {listing.state}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#0D7377]">
                ₹{listing.pricePerQuintal.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 font-normal"> /Quintal</span>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                {listing.quantityQuintals} Quintals Available
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed">
            {listing.description}
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 bg-[#FAFAFA] rounded-lg border border-gray-200/80">
              <span className="text-gray-400 text-[10px] block">Moisture Content</span>
              <strong className="text-[#212121] font-bold">{listing.moistureContent}</strong>
            </div>
            <div className="p-2.5 bg-[#FAFAFA] rounded-lg border border-gray-200/80">
              <span className="text-gray-400 text-[10px] block">Min Order Size</span>
              <strong className="text-[#212121] font-bold">{listing.minOrderQuintals} Qtl</strong>
            </div>
            <div className="p-2.5 bg-[#FAFAFA] rounded-lg border border-gray-200/80">
              <span className="text-gray-400 text-[10px] block">Harvest Season</span>
              <strong className="text-[#212121] font-bold">{listing.harvestDate}</strong>
            </div>
            <div className="p-2.5 bg-[#FAFAFA] rounded-lg border border-gray-200/80">
              <span className="text-gray-400 text-[10px] block">Verification</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Farm
              </span>
            </div>
          </div>

          {/* Farmer Contact & Purchase Actions */}
          <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 block">Cultivated by</span>
                <strong className="text-sm font-bold text-[#212121]">{listing.farmerName}</strong>
              </div>

              {showPhone ? (
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block">Farmer Mobile</span>
                  <a
                    href={`tel:${listing.farmerPhone}`}
                    className="text-xs font-mono font-bold text-[#0D7377] underline"
                  >
                    {listing.farmerPhone}
                  </a>
                </div>
              ) : (
                <button
                  onClick={handleSimulateCall}
                  className="px-3 py-1.5 bg-white border border-[#0D7377] text-[#0D7377] hover:bg-[#0D7377] hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Reveal Phone & Call</span>
                </button>
              )}
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={handleSimulateCall}
                className="flex-1 py-2.5 bg-[#0D7377] text-white rounded-xl font-bold text-xs hover:bg-[#095457] transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call Farmer Now</span>
              </button>
              <button
                onClick={handleSimulateWhatsApp}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Order Inquiry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
