export type UserRole = 'farmer' | 'customer' | 'admin';

export type FarmerInterfaceTab = 'govt' | 'market';

export type FarmerView = 'home' | 'mandi' | 'nearby' | 'weather' | 'prices' | 'ai' | 'bookings' | 'schemes' | 'help' | 'market';

export interface ProcurementCentre {
  id: string;
  name: string;
  mandiCode: string;
  district: string;
  state: string;
  distanceKm: number;
  latitude?: number;
  longitude?: number;
  liveTruckCount: number;
  queueLength: number;
  currentCrop: string;
  operatingHours: string;
  coordinates: { x: number; y: number };
  congestionStatus: 'low' | 'medium' | 'high';
  avgWaitMinutes: number;
  contactPhone: string;
}

export interface MandiSlot {
  id: string;
  centreId: string;
  centreName: string;
  date: string;
  dayLabel: string;
  timeWindow: string;
  congestion: 'low' | 'medium' | 'high';
  waitMinutes: number;
  totalEstMinutes: number;
  capacity: number;
  bookedCount: number;
  isUserBooked?: boolean;
  bayNumber: number;
  cropAllowed: string;
}

export interface QueueToken {
  tokenNumber: string;
  farmerName: string;
  farmerPhone: string;
  farmerId: string;
  crop: string;
  quantityQuintals: number;
  truckNumber: string;
  slotTime: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'no-show';
  estMinutesLeft: number;
  assignedBay: number;
  entryTimestamp: string;
}

export interface PaymentStage {
  id: 'registered' | 'produce_verified' | 'quality_checked' | 'payment_processing' | 'payment_completed';
  label: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  timestamp?: string;
  badge?: string;
}

export interface PaymentRecord {
  id: string;
  farmerName: string;
  farmerPhone: string;
  crop: string;
  quantityQuintals: number;
  ratePerQuintal: number;
  totalAmount: number;
  qualityGrade: 'Grade A' | 'Grade B' | 'Grade C';
  paymentStatus: 'pending' | 'processing' | 'paid';
  bankAccountMasked: string;
  utrNumber?: string;
  disbursedDate?: string;
  updatedAt: string;
}

export interface MarketListing {
  id: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  state: string;
  crop: string;
  variety: string;
  quantityQuintals: number;
  pricePerQuintal: number;
  minOrderQuintals: number;
  isOrganic: boolean;
  qualityGrade: 'Grade A' | 'Grade B' | 'Fair Average Quality';
  imageUrl: string;
  status: 'active' | 'sold';
  description: string;
  postedDate: string;
  harvestDate: string;
  moistureContent: string;
}

export interface WeatherDay {
  day: string;
  date: string;
  tempC: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Light Rain' | 'Heavy Rain';
  icon: string;
  rainProbability: number;
  humidity: number;
  windSpeedKmh: number;
  advisory: string;
}

export interface RFIDLog {
  id: string;
  tagId: string;
  truckNumber: string;
  driverName: string;
  entryTime: string;
  exitTime?: string;
  durationMinutes: number;
  gateStatus: 'At Gate' | 'Weighbridge' | 'Unloading' | 'Departed';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
  suggestions?: string[];
  richCardType?: 'slot' | 'ticket' | 'price_check';
  richData?: any;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'alert';
  title: string;
  message: string;
}
