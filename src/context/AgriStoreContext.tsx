import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE, api } from '../api/client';
import {
  UserRole,
  FarmerInterfaceTab,
  ProcurementCentre,
  MandiSlot,
  QueueToken,
  PaymentStage,
  PaymentRecord,
  MarketListing,
  WeatherDay,
  RFIDLog,
  ChatMessage,
  ToastNotification
} from '../types';

const INITIAL_CENTRES: ProcurementCentre[] = [
  {
    id: 'centre-1',
    name: 'Warangal Agricultural Market Committee (Enumamula)',
    mandiCode: 'TS-WGL-01',
    district: 'Warangal',
    state: 'Telangana',
    latitude: 17.9689,
    longitude: 79.5941,
    distanceKm: 4.2,
    liveTruckCount: 28,
    queueLength: 14,
    currentCrop: 'Paddy (Basmati / Common), Cotton',
    operatingHours: '06:00 AM - 07:00 PM',
    coordinates: { x: 38, y: 44 },
    congestionStatus: 'medium',
    avgWaitMinutes: 34,
    contactPhone: '+91 870 242 1102'
  },
  {
    id: 'centre-2',
    name: 'Nizamabad Grain Mandi & Electronic APMC',
    mandiCode: 'TS-NZB-04',
    district: 'Nizamabad',
    state: 'Telangana',
    latitude: 18.6725,
    longitude: 78.0941,
    distanceKm: 18.5,
    liveTruckCount: 16,
    queueLength: 6,
    currentCrop: 'Turmeric, Maize, Paddy',
    operatingHours: '06:30 AM - 06:30 PM',
    coordinates: { x: 26, y: 32 },
    congestionStatus: 'low',
    avgWaitMinutes: 18,
    contactPhone: '+91 846 223 4401'
  },
  {
    id: 'centre-3',
    name: 'Karimnagar Main APMC Yard',
    mandiCode: 'TS-KRN-02',
    district: 'Karimnagar',
    state: 'Telangana',
    latitude: 18.4386,
    longitude: 79.1288,
    distanceKm: 31.0,
    liveTruckCount: 42,
    queueLength: 22,
    currentCrop: 'Paddy, Cotton, Chana',
    operatingHours: '06:00 AM - 08:00 PM',
    coordinates: { x: 52, y: 28 },
    congestionStatus: 'high',
    avgWaitMinutes: 72,
    contactPhone: '+91 878 224 8819'
  },
  {
    id: 'centre-4',
    name: 'Suryapet Modern Grain Terminal',
    mandiCode: 'TS-SRY-07',
    district: 'Suryapet',
    state: 'Telangana',
    latitude: 17.1397,
    longitude: 79.6223,
    distanceKm: 44.8,
    liveTruckCount: 12,
    queueLength: 4,
    currentCrop: 'Paddy, Pulses, Groundnut',
    operatingHours: '07:00 AM - 06:00 PM',
    coordinates: { x: 64, y: 62 },
    congestionStatus: 'low',
    avgWaitMinutes: 15,
    contactPhone: '+91 868 422 1040'
  },
  {
    id: 'centre-5',
    name: 'Khanna Regional Wheat Terminal',
    mandiCode: 'PB-KHN-01',
    district: 'Ludhiana',
    state: 'Punjab',
    latitude: 30.7046,
    longitude: 76.2179,
    distanceKm: 120.0,
    liveTruckCount: 54,
    queueLength: 30,
    currentCrop: 'Wheat (Sharbati), Mustard',
    operatingHours: '05:30 AM - 08:30 PM',
    coordinates: { x: 78, y: 20 },
    congestionStatus: 'high',
    avgWaitMinutes: 85,
    contactPhone: '+91 162 822 5500'
  },
  {
    id: 'centre-6',
    name: 'Hyderabad Malakpet Agriculture Market Yard',
    mandiCode: 'TS-HYD-01',
    district: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.3753,
    longitude: 78.5028,
    distanceKm: 12.4,
    liveTruckCount: 38,
    queueLength: 10,
    currentCrop: 'Paddy, Onion, Chilli',
    operatingHours: '05:00 AM - 09:00 PM',
    coordinates: { x: 42, y: 50 },
    congestionStatus: 'medium',
    avgWaitMinutes: 40,
    contactPhone: '+91 40 2452 3311'
  },
  {
    id: 'centre-7',
    name: 'Guntur Mirchi & Cotton APMC Yard',
    mandiCode: 'AP-GNT-01',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    latitude: 16.3067,
    longitude: 80.4365,
    distanceKm: 65.0,
    liveTruckCount: 62,
    queueLength: 25,
    currentCrop: 'Red Chilli, Cotton, Paddy',
    operatingHours: '06:00 AM - 07:30 PM',
    coordinates: { x: 55, y: 70 },
    congestionStatus: 'high',
    avgWaitMinutes: 55,
    contactPhone: '+91 863 223 4810'
  },
  {
    id: 'centre-8',
    name: 'Pune Gultekdi Market Yard (APMC)',
    mandiCode: 'MH-PUN-01',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.4908,
    longitude: 73.8654,
    distanceKm: 110.0,
    liveTruckCount: 45,
    queueLength: 15,
    currentCrop: 'Soybean, Onion, Wheat',
    operatingHours: '05:30 AM - 08:00 PM',
    coordinates: { x: 20, y: 55 },
    congestionStatus: 'low',
    avgWaitMinutes: 30,
    contactPhone: '+91 20 2426 1234'
  },
  {
    id: 'centre-9',
    name: 'Lasalgaon Onion Terminal APMC',
    mandiCode: 'MH-NSK-02',
    district: 'Nashik',
    state: 'Maharashtra',
    latitude: 20.1455,
    longitude: 74.2289,
    distanceKm: 140.0,
    liveTruckCount: 78,
    queueLength: 35,
    currentCrop: 'Onion, Maize, Soybean',
    operatingHours: '06:00 AM - 07:00 PM',
    coordinates: { x: 22, y: 40 },
    congestionStatus: 'high',
    avgWaitMinutes: 60,
    contactPhone: '+91 255 026 6224'
  },
  {
    id: 'centre-10',
    name: 'Bengaluru Yeshwantpur APMC Yard',
    mandiCode: 'KA-BLR-01',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    latitude: 13.0238,
    longitude: 77.5505,
    distanceKm: 180.0,
    liveTruckCount: 35,
    queueLength: 8,
    currentCrop: 'Ragi, Maize, Pulses',
    operatingHours: '06:00 AM - 08:00 PM',
    coordinates: { x: 40, y: 85 },
    congestionStatus: 'low',
    avgWaitMinutes: 25,
    contactPhone: '+91 80 2337 5500'
  },
  {
    id: 'centre-11',
    name: 'Azadpur APMC National Market',
    mandiCode: 'DL-AZD-01',
    district: 'North Delhi',
    state: 'Delhi',
    latitude: 28.7121,
    longitude: 77.1755,
    distanceKm: 250.0,
    liveTruckCount: 95,
    queueLength: 45,
    currentCrop: 'Wheat, Basmati Rice, Mustard',
    operatingHours: '04:00 AM - 10:00 PM',
    coordinates: { x: 50, y: 15 },
    congestionStatus: 'high',
    avgWaitMinutes: 75,
    contactPhone: '+91 11 2769 1818'
  }
];

const INITIAL_SLOTS: MandiSlot[] = [
  {
    id: 'slot-1',
    centreId: 'centre-1',
    centreName: 'Warangal Agricultural Market Committee',
    date: '2026-09-08',
    dayLabel: 'Today',
    timeWindow: '08:00 AM - 10:00 AM',
    congestion: 'high',
    waitMinutes: 65,
    totalEstMinutes: 95,
    capacity: 25,
    bookedCount: 24,
    bayNumber: 2,
    cropAllowed: 'Paddy / Cotton',
    isUserBooked: false
  },
  {
    id: 'slot-2',
    centreId: 'centre-1',
    centreName: 'Warangal Agricultural Market Committee',
    date: '2026-09-08',
    dayLabel: 'Today',
    timeWindow: '10:00 AM - 12:00 PM',
    congestion: 'medium',
    waitMinutes: 35,
    totalEstMinutes: 60,
    capacity: 25,
    bookedCount: 19,
    bayNumber: 4,
    cropAllowed: 'Paddy / Cotton',
    isUserBooked: true
  },
  {
    id: 'slot-3',
    centreId: 'centre-1',
    centreName: 'Warangal Agricultural Market Committee',
    date: '2026-09-08',
    dayLabel: 'Today',
    timeWindow: '12:00 PM - 02:00 PM',
    congestion: 'high',
    waitMinutes: 70,
    totalEstMinutes: 105,
    capacity: 25,
    bookedCount: 25,
    bayNumber: 1,
    cropAllowed: 'Paddy / Cotton',
    isUserBooked: false
  },
  {
    id: 'slot-4',
    centreId: 'centre-1',
    centreName: 'Warangal Agricultural Market Committee',
    date: '2026-09-08',
    dayLabel: 'Today',
    timeWindow: '02:00 PM - 04:00 PM',
    congestion: 'low',
    waitMinutes: 20,
    totalEstMinutes: 45,
    capacity: 25,
    bookedCount: 11,
    bayNumber: 3,
    cropAllowed: 'Paddy / Cotton',
    isUserBooked: false
  },
  {
    id: 'slot-5',
    centreId: 'centre-1',
    centreName: 'Warangal Agricultural Market Committee',
    date: '2026-09-08',
    dayLabel: 'Today',
    timeWindow: '04:00 PM - 06:00 PM',
    congestion: 'low',
    waitMinutes: 15,
    totalEstMinutes: 40,
    capacity: 25,
    bookedCount: 9,
    bayNumber: 5,
    cropAllowed: 'Paddy / Cotton',
    isUserBooked: false
  },
  {
    id: 'slot-6',
    centreId: 'centre-1',
    centreName: 'Warangal Agricultural Market Committee',
    date: '2026-09-09',
    dayLabel: 'Tomorrow',
    timeWindow: '07:00 AM - 09:00 AM',
    congestion: 'low',
    waitMinutes: 18,
    totalEstMinutes: 42,
    capacity: 30,
    bookedCount: 8,
    bayNumber: 1,
    cropAllowed: 'Paddy / Cotton',
    isUserBooked: false
  },
  {
    id: 'slot-7',
    centreId: 'centre-1',
    centreName: 'Warangal Agricultural Market Committee',
    date: '2026-09-09',
    dayLabel: 'Tomorrow',
    timeWindow: '09:00 AM - 11:00 AM',
    congestion: 'medium',
    waitMinutes: 40,
    totalEstMinutes: 65,
    capacity: 30,
    bookedCount: 21,
    bayNumber: 2,
    cropAllowed: 'Paddy / Cotton',
    isUserBooked: false
  },
  {
    id: 'slot-8',
    centreId: 'centre-1',
    centreName: 'Warangal Agricultural Market Committee',
    date: '2026-09-09',
    dayLabel: 'Tomorrow',
    timeWindow: '11:00 AM - 01:00 PM',
    congestion: 'high',
    waitMinutes: 75,
    totalEstMinutes: 110,
    capacity: 30,
    bookedCount: 29,
    bayNumber: 3,
    cropAllowed: 'Paddy / Cotton',
    isUserBooked: false
  },
  {
    id: 'slot-9',
    centreId: 'centre-1',
    centreName: 'Warangal Agricultural Market Committee',
    date: '2026-09-09',
    dayLabel: 'Tomorrow',
    timeWindow: '02:00 PM - 04:00 PM',
    congestion: 'low',
    waitMinutes: 22,
    totalEstMinutes: 48,
    capacity: 30,
    bookedCount: 14,
    bayNumber: 4,
    cropAllowed: 'Paddy / Cotton',
    isUserBooked: false
  }
];

const INITIAL_QUEUE: QueueToken[] = [
  {
    tokenNumber: 'TK-101',
    farmerName: 'Kishan Rao Goud',
    farmerPhone: '+91 98481 11201',
    farmerId: 'TS-FARM-9912',
    crop: 'Paddy (Basmati)',
    quantityQuintals: 45,
    truckNumber: 'TS 03 UA 4419',
    slotTime: '08:30 AM',
    status: 'completed',
    estMinutesLeft: 0,
    assignedBay: 1,
    entryTimestamp: '08:22 AM'
  },
  {
    tokenNumber: 'TK-102',
    farmerName: 'Balwant Singh Dhillon',
    farmerPhone: '+91 98140 22319',
    farmerId: 'PB-FARM-4410',
    crop: 'Paddy (Common Grade)',
    quantityQuintals: 60,
    truckNumber: 'PB 10 CT 8892',
    slotTime: '09:00 AM',
    status: 'completed',
    estMinutesLeft: 0,
    assignedBay: 2,
    entryTimestamp: '08:52 AM'
  },
  {
    tokenNumber: 'TK-103',
    farmerName: 'Venkata Narayana',
    farmerPhone: '+91 94401 55662',
    farmerId: 'TS-FARM-3829',
    crop: 'Cotton (Long Staple)',
    quantityQuintals: 35,
    truckNumber: 'TS 04 EB 1109',
    slotTime: '09:30 AM',
    status: 'in-progress',
    estMinutesLeft: 8,
    assignedBay: 3,
    entryTimestamp: '09:25 AM'
  },
  {
    tokenNumber: 'TK-104',
    farmerName: 'Devender Reddy',
    farmerPhone: '+91 98492 88441',
    farmerId: 'TS-FARM-5120',
    crop: 'Paddy (Basmati)',
    quantityQuintals: 50,
    truckNumber: 'TS 03 UB 6710',
    slotTime: '10:00 AM',
    status: 'in-progress',
    estMinutesLeft: 16,
    assignedBay: 4,
    entryTimestamp: '09:50 AM'
  },
  {
    tokenNumber: 'TK-105',
    farmerName: 'Rameshwar Patel (You)',
    farmerPhone: '+91 98480 23456',
    farmerId: 'TS-FARM-8742',
    crop: 'Paddy (Grade A)',
    quantityQuintals: 65,
    truckNumber: 'TS 03 UA 8842',
    slotTime: '10:30 AM',
    status: 'waiting',
    estMinutesLeft: 24,
    assignedBay: 4,
    entryTimestamp: '10:15 AM'
  },
  {
    tokenNumber: 'TK-106',
    farmerName: 'Anji Reddy Thota',
    farmerPhone: '+91 94901 77209',
    farmerId: 'TS-FARM-2201',
    crop: 'Maize (Yellow)',
    quantityQuintals: 40,
    truckNumber: 'TS 07 TR 9021',
    slotTime: '11:00 AM',
    status: 'waiting',
    estMinutesLeft: 45,
    assignedBay: 2,
    entryTimestamp: '10:28 AM'
  },
  {
    tokenNumber: 'TK-107',
    farmerName: 'Suresh Kurva',
    farmerPhone: '+91 98488 44321',
    farmerId: 'TS-FARM-6019',
    crop: 'Cotton',
    quantityQuintals: 30,
    truckNumber: 'TS 03 TA 3311',
    slotTime: '11:30 AM',
    status: 'waiting',
    estMinutesLeft: 65,
    assignedBay: 1,
    entryTimestamp: '10:45 AM'
  }
];

const INITIAL_PAYMENT_STAGES: PaymentStage[] = [
  {
    id: 'registered',
    label: 'Slot Registered & Gate Inward',
    description: 'RFID vehicle check-in logged at North Mandi Gate #2',
    status: 'completed',
    timestamp: 'Today, 10:15 AM',
    badge: 'RFID Verified'
  },
  {
    id: 'produce_verified',
    label: 'Electronic Weighbridge Verification',
    description: 'Gross: 8.45 Tonnes | Tare: 1.95 Tonnes | Net: 65.0 Quintals',
    status: 'completed',
    timestamp: 'Today, 10:32 AM',
    badge: 'Net: 65.0 Qtl'
  },
  {
    id: 'quality_checked',
    label: 'Digital Moisture & Quality Grading',
    description: 'Moisture: 13.8% (Target <14%) | Assigned Grade A bonus',
    status: 'current',
    timestamp: 'Today, 10:48 AM',
    badge: 'Grade A Assigned'
  },
  {
    id: 'payment_processing',
    label: 'e-NAM & PFMS Invoice Generation',
    description: 'Invoice #WGL-2026-8891 generated at MSP ₹2,320/Qtl',
    status: 'upcoming',
    badge: 'eKYC Linked'
  },
  {
    id: 'payment_completed',
    label: 'Direct Benefit Transfer (DBT)',
    description: 'Direct bank credit into SBI A/c ending 8742',
    status: 'upcoming',
    badge: 'Govt Treasury Guarantee'
  }
];

const INITIAL_PAYMENT_RECORDS: PaymentRecord[] = [
  {
    id: 'pay-1',
    farmerName: 'Kishan Rao Goud',
    farmerPhone: '+91 98481 11201',
    crop: 'Paddy (Basmati)',
    quantityQuintals: 45,
    ratePerQuintal: 2320,
    totalAmount: 104400,
    qualityGrade: 'Grade A',
    paymentStatus: 'paid',
    bankAccountMasked: 'SBI •••• 1109',
    utrNumber: 'SBIN2026090881920',
    disbursedDate: '08 Sep 2026, 09:45 AM',
    updatedAt: '09:45 AM'
  },
  {
    id: 'pay-2',
    farmerName: 'Balwant Singh Dhillon',
    farmerPhone: '+91 98140 22319',
    crop: 'Paddy (Common)',
    quantityQuintals: 60,
    ratePerQuintal: 2300,
    totalAmount: 138000,
    qualityGrade: 'Grade B',
    paymentStatus: 'paid',
    bankAccountMasked: 'HDFC •••• 4410',
    utrNumber: 'HDFC2026090877192',
    disbursedDate: '08 Sep 2026, 10:10 AM',
    updatedAt: '10:10 AM'
  },
  {
    id: 'pay-3',
    farmerName: 'Rameshwar Patel (You)',
    farmerPhone: '+91 98480 23456',
    crop: 'Paddy (Grade A)',
    quantityQuintals: 65,
    ratePerQuintal: 2320,
    totalAmount: 150800,
    qualityGrade: 'Grade A',
    paymentStatus: 'processing',
    bankAccountMasked: 'SBI •••• 8742',
    updatedAt: '10:48 AM'
  },
  {
    id: 'pay-4',
    farmerName: 'Devender Reddy',
    farmerPhone: '+91 98492 88441',
    crop: 'Paddy (Basmati)',
    quantityQuintals: 50,
    ratePerQuintal: 2320,
    totalAmount: 116000,
    qualityGrade: 'Grade A',
    paymentStatus: 'pending',
    bankAccountMasked: 'Andhra Bank •••• 5120',
    updatedAt: '10:00 AM'
  }
];

const INITIAL_MARKET_LISTINGS: MarketListing[] = [
  {
    id: 'listing-1',
    farmerName: 'Rameshwar Patel',
    farmerPhone: '+91 98480 23456',
    farmerLocation: 'Narsampet, Warangal',
    state: 'Telangana',
    crop: 'Basmati Paddy (Pusa 1121)',
    variety: 'Pusa 1121 Extra Long Grain',
    quantityQuintals: 120,
    pricePerQuintal: 3850,
    minOrderQuintals: 10,
    isOrganic: true,
    qualityGrade: 'Grade A',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    description: 'Naturally cultivated premium aged Basmati grain with superior aroma and minimal broken grains. Stored in climate-controlled warehouse.',
    postedDate: 'Yesterday',
    harvestDate: 'August 2026',
    moistureContent: '12.4%'
  },
  {
    id: 'listing-2',
    farmerName: 'Gurpreet Singh Brar',
    farmerPhone: '+91 98765 43210',
    farmerLocation: 'Samrala, Ludhiana',
    state: 'Punjab',
    crop: 'Sharbati Wheat (Golden Grain)',
    variety: 'Sharbati Premium Gold',
    quantityQuintals: 250,
    pricePerQuintal: 2750,
    minOrderQuintals: 20,
    isOrganic: false,
    qualityGrade: 'Grade A',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    description: 'High-protein, heavy amber grain Sharbati wheat ideal for premium artisanal flour mills and domestic bulk buyers.',
    postedDate: '2 days ago',
    harvestDate: 'July 2026',
    moistureContent: '11.8%'
  },
  {
    id: 'listing-3',
    farmerName: 'Koteswara Rao',
    farmerPhone: '+91 94412 78901',
    farmerLocation: 'Nalgonda',
    state: 'Telangana',
    crop: 'Long Staple Raw Cotton',
    variety: 'Shankar-6 Hybrid',
    quantityQuintals: 80,
    pricePerQuintal: 7450,
    minOrderQuintals: 15,
    isOrganic: true,
    qualityGrade: 'Grade A',
    imageUrl: 'https://images.unsplash.com/photo-1594488554274-b97c02b1154c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    description: 'Clean hand-picked seed cotton with 30mm staple length and high tensile strength. Direct farm gate dispatch available.',
    postedDate: '3 days ago',
    harvestDate: 'September 2026',
    moistureContent: '8.2%'
  },
  {
    id: 'listing-4',
    farmerName: 'Rameshwar Patel',
    farmerPhone: '+91 98480 23456',
    farmerLocation: 'Narsampet, Warangal',
    state: 'Telangana',
    crop: 'Organic Lakadong Turmeric',
    variety: 'High Curcumin (7.2%)',
    quantityQuintals: 40,
    pricePerQuintal: 14200,
    minOrderQuintals: 5,
    isOrganic: true,
    qualityGrade: 'Grade A',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    description: 'High-potency organic polished turmeric fingers, tested 7.2% curcumin. Certificate of organic analysis provided with lot.',
    postedDate: '5 days ago',
    harvestDate: 'August 2026',
    moistureContent: '9.0%'
  },
  {
    id: 'listing-5',
    farmerName: 'Manjula Devi',
    farmerPhone: '+91 93901 22890',
    farmerLocation: 'Armoor, Nizamabad',
    state: 'Telangana',
    crop: 'Desi Brown Chana (Chickpeas)',
    variety: 'JG-11 High Yield',
    quantityQuintals: 95,
    pricePerQuintal: 5650,
    minOrderQuintals: 10,
    isOrganic: false,
    qualityGrade: 'Fair Average Quality',
    imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    description: 'Sun-dried wholesome brown chickpeas cleaned via gravity separator. Zero pesticide residue test passed.',
    postedDate: '1 week ago',
    harvestDate: 'August 2026',
    moistureContent: '10.5%'
  },
  {
    id: 'listing-6',
    farmerName: 'Harpreet Kaur',
    farmerPhone: '+91 98721 99120',
    farmerLocation: 'Kotkapura, Faridkot',
    state: 'Punjab',
    crop: 'Yellow Mustard Seed',
    variety: 'Pusa Bold High Oil',
    quantityQuintals: 110,
    pricePerQuintal: 5950,
    minOrderQuintals: 10,
    isOrganic: true,
    qualityGrade: 'Grade A',
    imageUrl: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    description: '41.5% oil content certified yellow mustard seed. Ideal for cold pressed kachi ghani expeller units.',
    postedDate: '1 week ago',
    harvestDate: 'July 2026',
    moistureContent: '7.8%'
  }
];

const INITIAL_RFID_LOGS: RFIDLog[] = [
  {
    id: 'rfid-1',
    tagId: 'RF-TS-8842',
    truckNumber: 'TS 03 UA 8842',
    driverName: 'Rameshwar Patel',
    entryTime: '10:15 AM',
    durationMinutes: 38,
    gateStatus: 'Unloading'
  },
  {
    id: 'rfid-2',
    tagId: 'RF-TS-6710',
    truckNumber: 'TS 03 UB 6710',
    driverName: 'Devender Reddy',
    entryTime: '09:50 AM',
    durationMinutes: 62,
    gateStatus: 'Weighbridge'
  },
  {
    id: 'rfid-3',
    tagId: 'RF-TS-1109',
    truckNumber: 'TS 04 EB 1109',
    driverName: 'Venkata Narayana',
    entryTime: '09:25 AM',
    durationMinutes: 85,
    gateStatus: 'Unloading'
  },
  {
    id: 'rfid-4',
    tagId: 'RF-PB-8892',
    truckNumber: 'PB 10 CT 8892',
    driverName: 'Balwant Singh',
    entryTime: '08:52 AM',
    exitTime: '10:12 AM',
    durationMinutes: 80,
    gateStatus: 'Departed'
  },
  {
    id: 'rfid-5',
    tagId: 'RF-TS-4419',
    truckNumber: 'TS 03 UA 4419',
    driverName: 'Kishan Rao',
    entryTime: '08:22 AM',
    exitTime: '09:50 AM',
    durationMinutes: 88,
    gateStatus: 'Departed'
  }
];

const INITIAL_WEATHER: WeatherDay[] = [
  {
    day: 'Today',
    date: '08 Sep',
    tempC: 31,
    condition: 'Light Rain',
    icon: 'CloudRain',
    rainProbability: 75,
    humidity: 82,
    windSpeedKmh: 18,
    advisory: 'Rain expected between 2 PM - 5 PM. Keep produce covered with tarpaulins.'
  },
  {
    day: 'Wed',
    date: '09 Sep',
    tempC: 33,
    condition: 'Partly Cloudy',
    icon: 'CloudSun',
    rainProbability: 25,
    humidity: 68,
    windSpeedKmh: 14,
    advisory: 'Clear skies in morning. Excellent time for grain drying and mandi transport.'
  },
  {
    day: 'Thu',
    date: '10 Sep',
    tempC: 34,
    condition: 'Sunny',
    icon: 'Sun',
    rainProbability: 10,
    humidity: 58,
    windSpeedKmh: 11,
    advisory: 'Optimal weather for harvesting and direct delivery to procurement bays.'
  },
  {
    day: 'Fri',
    date: '11 Sep',
    tempC: 32,
    condition: 'Sunny',
    icon: 'Sun',
    rainProbability: 15,
    humidity: 62,
    windSpeedKmh: 12,
    advisory: 'Dry conditions continuing. Low moisture readings expected.'
  },
  {
    day: 'Sat',
    date: '12 Sep',
    tempC: 29,
    condition: 'Heavy Rain',
    icon: 'CloudLightning',
    rainProbability: 85,
    humidity: 89,
    windSpeedKmh: 24,
    advisory: 'Heavy thunderstorms predicted. Avoid open mandi transport.'
  }
];

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'gemini',
    text: 'Namaste Rameshwar ji! I am your AgriConnect Assistant powered by Gemini AI. I can help you forecast mandi wait times, book procurement slots, check MSP prices, or create direct marketplace listings. How can I help you today?',
    timestamp: '10:00 AM',
    suggestions: [
      'Book a slot for tomorrow',
      'Compare Paddy MSP vs Open Market',
      'Check live queue at Warangal Mandi',
      'Track my payment status',
      'I have a payment delay issue'
    ]
  }
];

interface AgriStoreContextType {
  activeRole: UserRole | null;
  setActiveRole: (role: UserRole | null) => void;
  farmerTab: FarmerInterfaceTab;
  setFarmerTab: (tab: FarmerInterfaceTab) => void;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authPreselectedRole: UserRole;
  openAuthModal: (role?: UserRole) => void;
  closeAuthModal: () => void;
  loginAs: (role: UserRole, customName?: string) => void;
  logout: () => void;
  currentUser: {
    name: string;
    phone: string;
    aadhaar: string;
    village: string;
    selectedCentreId: string;
    aadhaarVerified?: boolean;
  };
  updateCurrentUserAadhaar: (aadhaarNum: string) => void;
  centres: ProcurementCentre[];
  selectedCentreId: string;
  setSelectedCentreId: (id: string) => void;
  userCoords: { lat: number; lng: number } | null;
  isLocating: boolean;
  locationError: string | null;
  detectUserLocation: () => Promise<void>;
  geminiApiKey: string | null;
  setGeminiApiKey: (key: string | null) => void;
  slots: MandiSlot[];
  myBookedSlot: MandiSlot | null;
  bookSlot: (slotId: string, crop: string) => Promise<boolean>;
  missedSlotSeconds: number;
  isReassigningSlot: boolean;
  fastForwardTimer: () => void;
  triggerMissedSlotReassignment: () => void;
  queueTokens: QueueToken[];
  userToken: QueueToken | null;
  updateQueueStatus: (tokenNumber: string, status: QueueToken['status']) => void;
  paymentStages: PaymentStage[];
  paymentRecords: PaymentRecord[];
  updatePaymentRecord: (recordId: string, status: PaymentRecord['paymentStatus'], grade?: PaymentRecord['qualityGrade']) => void;
  marketListings: MarketListing[];
  isLoadingListings: boolean;
  fetchMyListings: () => Promise<void>;
  fetchAllListings: (params?: Record<string, string>) => Promise<void>;
  createListing: (listing: Omit<MarketListing, 'id' | 'postedDate' | 'status'>) => Promise<boolean>;
  updateListing: (id: string, listing: Partial<MarketListing>) => Promise<boolean>;
  deleteListing: (id: string) => Promise<boolean>;
  toggleListingStatus: (id: string) => Promise<boolean>;
  rfidLogs: RFIDLog[];
  weatherForecast: WeatherDay[];
  smsAlertActive: boolean;
  toggleSmsAlert: () => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  isAiThinking: boolean;
  sendChatMessage: (text: string) => void;
  toasts: ToastNotification[];
  addToast: (type: ToastNotification['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  runSimulatedE2EFlow: () => void;
  isE2ERunning: boolean;
}

const AgriStoreContext = createContext<AgriStoreContextType | undefined>(undefined);

export const AgriStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check localStorage for saved session
  const [activeRole, setActiveRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('agri_role');
    return (saved as UserRole) || null;
  });
  const [farmerTab, setFarmerTab] = useState<FarmerInterfaceTab>('govt');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('agri_token');
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authPreselectedRole, setAuthPreselectedRole] = useState<UserRole>('farmer');

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('agri_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        return {
          name: u.name || 'Registered Farmer',
          phone: u.phone ? `+91 ${u.phone}` : '+91 98480 23456',
          aadhaar: u.aadhaar || 'XXXX XXXX 8742',
          village: u.village || 'Warangal Rural',
          selectedCentreId: u.centreId || 'centre-1',
          aadhaarVerified: u.aadhaarVerified || false
        };
      } catch (_) {}
    }
    return {
      name: 'Rameshwar Patel',
      phone: '+91 98480 23456',
      aadhaar: 'XXXX XXXX 8742',
      village: 'Narsampet, Warangal Rural',
      selectedCentreId: 'centre-1',
      aadhaarVerified: true
    };
  });

  const updateCurrentUserAadhaar = (aadhaarNum: string) => {
    const masked = aadhaarNum.length === 12
      ? `XXXX XXXX ${aadhaarNum.slice(-4)}`
      : aadhaarNum;
    setCurrentUser(prev => {
      const updated = { ...prev, aadhaar: masked, aadhaarVerified: true };
      const savedUser = localStorage.getItem('agri_user');
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          u.aadhaar = masked;
          u.aadhaarVerified = true;
          localStorage.setItem('agri_user', JSON.stringify(u));
        } catch (_) {}
      }
      return updated;
    });
  };

  const [centres, setCentres] = useState<ProcurementCentre[]>(INITIAL_CENTRES);
  const [selectedCentreId, setSelectedCentreId] = useState<string>('centre-1');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(() => localStorage.getItem('agri_gemini_key') || null);

  const setGeminiApiKey = (key: string | null) => {
    setGeminiApiKeyState(key);
    if (key) {
      localStorage.setItem('agri_gemini_key', key);
    } else {
      localStorage.removeItem('agri_gemini_key');
    }
  };

  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
  };

  const detectUserLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      addToast('alert', 'GPS Unavailable', 'Your browser does not support GPS geolocation.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setIsLocating(false);

        // Calculate real distance to each APMC mandi from user's live physical GPS
        setCentres((prev) => {
          const updated = prev.map((c) => {
            const dist = (c.latitude && c.longitude)
              ? calculateDistanceKm(coords.lat, coords.lng, c.latitude, c.longitude)
              : c.distanceKm;
            return { ...c, distanceKm: dist };
          });
          // Sort closest to furthest
          updated.sort((a, b) => a.distanceKm - b.distanceKm);
          if (updated.length > 0) {
            setSelectedCentreId(updated[0].id);
          }
          return updated;
        });

        addToast(
          'success',
          'Live GPS Coordinates Detected',
          `GPS Fix: ${coords.lat.toFixed(3)}°N, ${coords.lng.toFixed(3)}°E. Mandis sorted by real proximity!`
        );
      },
      (err) => {
        setIsLocating(false);
        const errMsg = err.code === 1 ? 'Location permission was denied' : 'Unable to acquire satellite GPS fix';
        setLocationError(errMsg);
        addToast('warning', 'GPS Notice', `${errMsg}. Displaying regional market committees.`);
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  const [slots, setSlots] = useState<MandiSlot[]>(INITIAL_SLOTS);
  const [myBookedSlot, setMyBookedSlot] = useState<MandiSlot | null>(INITIAL_SLOTS[1]);
  const [missedSlotSeconds, setMissedSlotSeconds] = useState<number>(60);
  const [isReassigningSlot, setIsReassigningSlot] = useState<boolean>(false);
  const [queueTokens, setQueueTokens] = useState<QueueToken[]>(INITIAL_QUEUE);
  const [paymentStages, setPaymentStages] = useState<PaymentStage[]>(INITIAL_PAYMENT_STAGES);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(INITIAL_PAYMENT_RECORDS);
  const [marketListings, setMarketListings] = useState<MarketListing[]>(INITIAL_MARKET_LISTINGS);
  const [rfidLogs] = useState<RFIDLog[]>(INITIAL_RFID_LOGS);
  const [weatherForecast] = useState<WeatherDay[]>(INITIAL_WEATHER);
  const [smsAlertActive, setSmsAlertActive] = useState<boolean>(true);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isE2ERunning, setIsE2ERunning] = useState<boolean>(false);

  useEffect(() => {
    if (missedSlotSeconds <= 0 || isReassigningSlot) return;
    const interval = setInterval(() => {
      setMissedSlotSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          triggerMissedSlotReassignment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [missedSlotSeconds, isReassigningSlot]);

  const addToast = (type: ToastNotification['type'], title: string, message: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openAuthModal = (role?: UserRole) => {
    if (role) setAuthPreselectedRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginAs = (role: UserRole, customName?: string) => {
    setActiveRole(role);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    localStorage.setItem('agri_role', role);
    
    // Check if stored user was saved by auth client
    const saved = localStorage.getItem('agri_user');
    let u: any = null;
    if (saved) {
      try {
        u = JSON.parse(saved);
      } catch (_) {}
    }

    const finalName = customName?.trim() || u?.name || (role === 'farmer' ? 'Rameshwar Patel' : role === 'customer' ? 'FreshGrain Buyer' : 'Mandi Secretary');

    setCurrentUser({
      name: finalName,
      phone: u?.phone ? `+91 ${u.phone}` : '+91 98480 23456',
      aadhaar: u?.aadhaar || 'XXXX XXXX 8742',
      village: u?.village || 'Warangal Rural',
      selectedCentreId: u?.centreId || 'centre-1',
      aadhaarVerified: u?.aadhaarVerified ?? true
    });

    localStorage.setItem('agri_user', JSON.stringify({
      ...(u || {}),
      name: finalName,
      role
    }));
    
    addToast('success', 'Signed In Successfully', `Welcome to AgriConnect, ${finalName}!`);
  };

  const logout = () => {
    setActiveRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('agri_role');
    localStorage.removeItem('agri_token');
    localStorage.removeItem('agri_user');
    addToast('info', 'Logged Out', 'You have been safely signed out of your session.');
  };

  const bookSlot = async (slotId: string, crop: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSlots((prev) =>
          prev.map((s) => ({
            ...s,
            isUserBooked: s.id === slotId,
            bookedCount: s.id === slotId ? s.bookedCount + 1 : s.bookedCount
          }))
        );
        const booked = slots.find((s) => s.id === slotId) || null;
        if (booked) {
          const updatedBooked = { ...booked, isUserBooked: true, cropAllowed: crop };
          setMyBookedSlot(updatedBooked);
          setMissedSlotSeconds(90);
          addToast(
            'success',
            'Slot Confirmed by Vertex AI',
            `Booked ${booked.timeWindow} at ${booked.centreName}. Bay #${booked.bayNumber} allocated.`
          );
        }
        resolve(true);
      }, 500);
    });
  };

  const triggerMissedSlotReassignment = () => {
    setIsReassigningSlot(true);
    addToast(
      'alert',
      'Slot Window Elapsed',
      'Allocated time elapsed. Initiating automatic Vertex AI reallocation...'
    );

    setTimeout(() => {
      const nextAvailableSlot = slots.find((s) => !s.isUserBooked && s.congestion !== 'high') || slots[3];
      setMyBookedSlot({
        ...nextAvailableSlot,
        isUserBooked: true,
        dayLabel: 'Today (Rescheduled)'
      });
      setIsReassigningSlot(false);
      setMissedSlotSeconds(120);

      addToast(
        'info',
        'Reassigned to Next Open Slot',
        `Reallocated to ${nextAvailableSlot.timeWindow} at Bay #${nextAvailableSlot.bayNumber}. SMS token updated.`
      );
    }, 2000);
  };

  const fastForwardTimer = () => {
    setMissedSlotSeconds(2);
  };

  const updateQueueStatus = (tokenNumber: string, status: QueueToken['status']) => {
    setQueueTokens((prev) =>
      prev.map((q) => (q.tokenNumber === tokenNumber ? { ...q, status } : q))
    );
    addToast(
      'info',
      'Farmer SMS Dispatched',
      `Token ${tokenNumber} status updated to "${status.toUpperCase()}". Real-time SMS pushed to farmer mobile.`
    );
  };

  const updatePaymentRecord = (
    recordId: string,
    status: PaymentRecord['paymentStatus'],
    grade?: PaymentRecord['qualityGrade']
  ) => {
    setPaymentRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          const updated = {
            ...r,
            paymentStatus: status,
            qualityGrade: grade || r.qualityGrade,
            updatedAt: 'Just now'
          };
          if (status === 'paid' && !r.utrNumber) {
            updated.utrNumber = 'SBIN' + Date.now().toString().slice(-9);
            updated.disbursedDate = 'Today, Just now';
          }
          return updated;
        }
        return r;
      })
    );

    if (recordId === 'pay-3') {
      if (status === 'paid') {
        setPaymentStages((prev) =>
          prev.map((stage) => ({
            ...stage,
            status: 'completed',
            timestamp: stage.id === 'payment_completed' ? 'Just now' : stage.timestamp
          }))
        );
        addToast(
          'success',
          'Payment Credited ₹1,50,800',
          'Direct Benefit Transfer (DBT) confirmed by PFMS into SBI A/c ending 8742.'
        );
      } else if (status === 'processing') {
        setPaymentStages((prev) =>
          prev.map((stage) => {
            if (stage.id === 'quality_checked' || stage.id === 'produce_verified' || stage.id === 'registered') {
              return { ...stage, status: 'completed' };
            }
            if (stage.id === 'payment_processing') {
              return { ...stage, status: 'current', timestamp: 'In progress' };
            }
            return stage;
          })
        );
        addToast('info', 'Invoice Processing', 'Payment invoice generated and undergoing bank clearance.');
      }
    } else {
      addToast('success', 'Admin Action Recorded', `Record ${recordId} updated to ${status.toUpperCase()}`);
    }
  };

  const [isLoadingListings, setIsLoadingListings] = useState(false);

  const fetchMyListings = async () => {
    try {
      setIsLoadingListings(true);
      const data = await api.getMyListings() as MarketListing[];
      setMarketListings(data);
    } catch (err) {
      addToast('alert', 'Error', 'Failed to fetch your listings.');
    } finally {
      setIsLoadingListings(false);
    }
  };

  const fetchAllListings = async (params?: Record<string, string>) => {
    try {
      setIsLoadingListings(true);
      const data = await api.getListings(params) as MarketListing[];
      setMarketListings(data);
    } catch (err) {
      addToast('alert', 'Error', 'Failed to fetch marketplace listings.');
    } finally {
      setIsLoadingListings(false);
    }
  };

  const createListing = async (listingData: Omit<MarketListing, 'id' | 'postedDate' | 'status'>) => {
    try {
      setIsLoadingListings(true);
      await api.createListing(listingData);
      await fetchMyListings();
      addToast(
        'success',
        'Listing Published Live',
        `${listingData.crop} is now visible to wholesale buyers in the open marketplace.`
      );
      return true;
    } catch (err) {
      addToast('alert', 'Error', 'Failed to create listing.');
      return false;
    } finally {
      setIsLoadingListings(false);
    }
  };

  const updateListing = async (id: string, listingData: Partial<MarketListing>) => {
    try {
      setIsLoadingListings(true);
      await api.updateListing(id, listingData);
      await fetchMyListings();
      addToast('success', 'Listing Updated', 'Your produce listing has been updated successfully.');
      return true;
    } catch (err) {
      addToast('alert', 'Error', 'Failed to update listing.');
      return false;
    } finally {
      setIsLoadingListings(false);
    }
  };

  const deleteListing = async (id: string) => {
    try {
      await api.deleteListing(id);
      await fetchMyListings();
      addToast('info', 'Listing Removed', 'Produce listing was removed from the open marketplace.');
      return true;
    } catch (err) {
      addToast('alert', 'Error', 'Failed to delete listing.');
      return false;
    }
  };

  const toggleListingStatus = async (id: string) => {
    try {
      await api.toggleSold(id);
      await fetchMyListings();
      addToast('success', 'Listing Status Changed', 'Successfully toggled listing status.');
      return true;
    } catch (err) {
      addToast('alert', 'Error', 'Failed to toggle listing status.');
      return false;
    }
  };

  const toggleSmsAlert = () => {
    const next = !smsAlertActive;
    setSmsAlertActive(next);
    addToast(
      'info',
      next ? 'Weather SMS Alerts Enabled' : 'Weather SMS Alerts Muted',
      next
        ? 'Real-time rain warning broadcasts active for your registered phone.'
        : 'Weather SMS alerts temporarily silenced.'
    );
  };

  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      const language = localStorage.getItem('agri_lang') || 'en';
      const storedKey = geminiApiKey || localStorage.getItem('agri_gemini_key') || undefined;
      // Send message to real backend AI service (uses dynamic local/production URL)
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language, apiKey: storedKey })
      });
      const data = await res.json();
      setIsAiThinking(false);

      // If server returned an error or failed
      if (!res.ok || data.error) {
        console.error('[Backend AI Error]', data.error || `HTTP ${res.status}`);
        const errReply: ChatMessage = {
          id: 'msg-' + Date.now() + 1,
          sender: 'gemini',
          text: 'AI Assistant is temporarily unavailable. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ['Try again', 'Check Mandi Prices', 'Book Slot']
        };
        setChatMessages((prev) => [...prev, errReply]);
        return;
      }

      const aiReply: ChatMessage = {
        id: 'msg-' + Date.now() + 1,
        sender: 'gemini',
        text: data.text || 'I have analyzed your query and updated mandi records.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        richCardType: data.richCardType,
        richData: data.richData,
        suggestions: data.suggestions || data.richData?.suggestions || ['Book Tomorrow Slot', 'Check Weather Radar', 'View Open Market']
      };
      setChatMessages((prev) => [...prev, aiReply]);
      return;
    } catch (networkErr: any) {
      console.error('[Network Error connecting to AI Assistant]', networkErr?.message);
      setIsAiThinking(false);
      const errReply: ChatMessage = {
        id: 'msg-' + Date.now() + 1,
        sender: 'gemini',
        text: 'AI Assistant is temporarily unavailable. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Try again', 'Check Mandi Prices', 'Book Slot']
      };
      setChatMessages((prev) => [...prev, errReply]);
      return;
    }

    // Fallback if backend is warming up
    setTimeout(() => {
      setIsAiThinking(false);
      const lower = text.toLowerCase();
      let aiReply: ChatMessage;

      if (lower.includes('slot') || lower.includes('book') || lower.includes('tomorrow')) {
        aiReply = {
          id: 'msg-' + Date.now() + 1,
          sender: 'gemini',
          text: 'I analyzed historical queue flow with Vertex AI. Tomorrow 07:00 AM - 09:00 AM has the lowest congestion (estimated wait: 18 mins). Would you like me to book this slot for you?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          richCardType: 'slot',
          richData: {
            centreName: 'Warangal APMC Yard',
            time: 'Tomorrow, 07:00 AM - 09:00 AM',
            waitEst: '18 mins',
            bay: 'Bay #1',
            action: 'Book This Slot Now'
          },
          suggestions: ['Confirm Booking', 'Show afternoon slots', 'Check nearby mandis']
        };
      } else if (lower.includes('dispute') || lower.includes('delay') || lower.includes('issue') || lower.includes('payment')) {
        aiReply = {
          id: 'msg-' + Date.now() + 1,
          sender: 'gemini',
          text: 'I understand your concern regarding procurement payment. I have prioritized your grievance and opened an official electronic Mandi Escalation Ticket with the District Marketing Officer.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          richCardType: 'ticket',
          richData: {
            ticketId: 'AGRI-TKT-1234',
            category: 'Payment Settlement Escalation',
            farmerName: 'Rameshwar Patel',
            mandi: 'Warangal Enumamula APMC',
            status: 'Assigned to Mandi Secretary',
            eta: 'Resolution within 4 hours'
          },
          suggestions: ['Track Ticket #1234', 'Talk to Human Officer', 'Back to Dashboard']
        };
      } else if (lower.includes('msp') || lower.includes('price') || lower.includes('market')) {
        aiReply = {
          id: 'msg-' + Date.now() + 1,
          sender: 'gemini',
          text: 'Paddy Grade A MSP is set at ₹2,320/Quintal (+₹140 YoY). However, open market Basmati (Pusa 1121) is trading at ₹3,850/Quintal (+66% premium over MSP). If you have Grade A Basmati, selling on our Open Marketplace will maximize your return.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ['Create Listing on Open Market', 'View Full MSP Table', 'Check Cotton Prices']
        };
      } else {
        aiReply = {
          id: 'msg-' + Date.now() + 1,
          sender: 'gemini',
          text: `Understood! I've noted: "${text}". Mandi operations at Warangal are currently operating normally with an average unloading time of 34 minutes per truck. Let me know if you need to book a bay or check weather alerts.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ['Book Tomorrow Slot', 'Check Weather Radar', 'View Open Market']
        };
      }

      setChatMessages((prev) => [...prev, aiReply]);
    }, 700);
  };

  const runSimulatedE2EFlow = () => {
    if (isE2ERunning) return;
    setIsE2ERunning(true);
    addToast('info', 'Starting E2E Demo Simulation', 'Step 1/4: Farmer booking slot at Warangal Mandi...');

    setTimeout(() => {
      bookSlot('slot-4', 'Paddy (Grade A)');
      addToast('success', 'E2E Demo Step 2/4', 'Mandi Gate: Truck arrived with RFID tag RF-TS-8842.');

      setTimeout(() => {
        updateQueueStatus('TK-105', 'in-progress');
        updatePaymentRecord('pay-3', 'processing', 'Grade A');
        addToast('info', 'E2E Demo Step 3/4', 'Centre Admin verified weight (65 Qtl) & graded produce Grade A.');

        setTimeout(() => {
          updateQueueStatus('TK-105', 'completed');
          updatePaymentRecord('pay-3', 'paid', 'Grade A');
          setIsE2ERunning(false);
          addToast(
            'success',
            'E2E Demo Complete! 🎉',
            '₹1,50,800 DBT credited to Farmer Bank Account. Full cycle verified!'
          );
        }, 3000);
      }, 3000);
    }, 1500);
  };

  const userToken = queueTokens.find((q) => q.tokenNumber === 'TK-105') || null;

  return (
    <AgriStoreContext.Provider
      value={{
        activeRole,
        setActiveRole,
        farmerTab,
        setFarmerTab,
        isAuthenticated,
        isAuthModalOpen,
        authPreselectedRole,
        openAuthModal,
        closeAuthModal,
        loginAs,
        logout,
        currentUser,
        updateCurrentUserAadhaar,
        centres,
        selectedCentreId,
        setSelectedCentreId,
        userCoords,
        isLocating,
        locationError,
        detectUserLocation,
        geminiApiKey,
        setGeminiApiKey,
        slots,
        myBookedSlot,
        bookSlot,
        missedSlotSeconds,
        isReassigningSlot,
        fastForwardTimer,
        triggerMissedSlotReassignment,
        queueTokens,
        userToken,
        updateQueueStatus,
        paymentStages,
        paymentRecords,
        updatePaymentRecord,
        marketListings,
        isLoadingListings,
        fetchMyListings,
        fetchAllListings,
        createListing,
        updateListing,
        deleteListing,
        toggleListingStatus,
        rfidLogs,
        weatherForecast,
        smsAlertActive,
        toggleSmsAlert,
        isAssistantOpen,
        setIsAssistantOpen,
        chatMessages,
        isAiThinking,
        sendChatMessage,
        toasts,
        addToast,
        removeToast,
        runSimulatedE2EFlow,
        isE2ERunning
      }}
    >
      {children}
    </AgriStoreContext.Provider>
  );
};

export const useAgriStore = () => {
  const context = useContext(AgriStoreContext);
  if (!context) throw new Error('useAgriStore must be used within AgriStoreProvider');
  return context;
};
