import React, { useState } from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { AIPriceAssistant } from './AIPriceAssistant';
import {
  X,
  UploadCloud,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  Tag
} from 'lucide-react';

const PRESET_PHOTOS = [
  { label: 'Basmati Paddy', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Golden Wheat', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Raw Cotton', url: 'https://images.unsplash.com/photo-1594488554274-b97c02b1154c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chickpeas', url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80' },
  { label: 'Organic Turmeric', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80' }
];

export const CreateListingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { createListing, currentUser } = useAgriStore();

  const [crop, setCrop] = useState('Basmati Paddy (Pusa 1121)');
  const [variety, setVariety] = useState('Aged 1-Year Extra Long Grain');
  const [quantity, setQuantity] = useState(80);
  const [price, setPrice] = useState(3800);
  const [minOrder, setMinOrder] = useState(10);
  const [isOrganic, setIsOrganic] = useState(true);
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Fair Average Quality'>('Grade A');
  const [imageUrl, setImageUrl] = useState(PRESET_PHOTOS[0].url);
  const [description, setDescription] = useState('Clean sun-dried grain harvested directly from farm gate.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createListing({
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      farmerLocation: currentUser.village,
      state: 'Telangana',
      crop,
      variety,
      quantityQuintals: Number(quantity),
      pricePerQuintal: Number(price),
      minOrderQuintals: Number(minOrder),
      isOrganic,
      qualityGrade: grade,
      imageUrl,
      description,
      harvestDate: 'August 2026',
      moistureContent: '12.2%'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#0D7377] font-bold text-xs uppercase mb-1">
          <ShoppingBag className="w-4 h-4" />
          <span>Open Direct Marketplace</span>
        </div>
        <h3 className="text-xl font-extrabold text-[#212121]">
          Create Produce Listing for Buyers
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          Sell directly to wholesale buyers, millers, and retailers at open market prices.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#212121] mb-1">Crop / Grain Name</label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:border-[#0D7377]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#212121] mb-1">Quantity (Quintals)</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:border-[#0D7377]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#212121] mb-1">Price / Quintal (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:border-[#0D7377]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#212121] mb-1">Quality Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:border-[#0D7377]"
                >
                  <option value="Grade A">Grade A (Premium)</option>
                  <option value="Grade B">Grade B (Standard)</option>
                  <option value="Fair Average Quality">Fair Average Quality (FAQ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#212121] mb-1">Cultivation</label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="organicCheck"
                    checked={isOrganic}
                    onChange={(e) => setIsOrganic(e.target.checked)}
                    className="w-4 h-4 text-[#0D7377] rounded accent-[#0D7377]"
                  />
                  <label htmlFor="organicCheck" className="text-xs text-gray-700 font-medium">
                    Certified Organic
                  </label>
                </div>
              </div>
            </div>

            {/* Photo Preset Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#212121] mb-1.5">Choose Photo Preset</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {PRESET_PHOTOS.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setImageUrl(p.url)}
                    className={`relative rounded-lg overflow-hidden w-16 h-12 flex-shrink-0 border-2 transition-all ${
                      imageUrl === p.url ? 'border-[#0D7377] ring-2 ring-[#0D7377]/30' : 'border-gray-200'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl gradient-agri text-[#212121] font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 glow-btn"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Listing to Marketplace</span>
            </button>
          </form>

          {/* Live Preview Card & AI Assistant */}
          <div className="space-y-4">
            <AIPriceAssistant
              cropName={crop}
              farmerPrice={price}
              mspPrice={2320}
              marketAvg={3750}
            />

            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Live Customer Preview Card
              </p>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden pointer-events-none">
                <div className="h-28 w-full relative">
                  <img src={imageUrl} alt={crop} className="w-full h-full object-cover" />
                  {isOrganic && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                      100% Organic
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-xs text-[#212121]">{crop}</h4>
                  <p className="text-[10px] text-gray-500">{variety}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-xs font-extrabold text-[#0D7377]">₹{price.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400"> /Qtl</span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600">{quantity} Qtl Avail</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
