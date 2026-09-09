export const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://localhost:5000/api'
  : 'https://agriconnect-api-q2bv.onrender.com/api';

function getToken(): string | null {
  return localStorage.getItem('agri_token');
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as Record<string, string>).error || `HTTP ${res.status}`);
  }
  return res.json() as T;
}

export const api = {
  // Auth
  sendOtp: (phone: string) =>
    request<{ message: string; devOtp?: string; smsDispatched?: boolean; phone?: string }>('POST', '/auth/send-otp', { phone }),
  verifyOtp: (phone: string, otp: string, role?: string, name?: string) =>
    request<{ token: string; user: Record<string, unknown> }>('POST', '/auth/verify-otp', { phone, otp, role, name }),
  verifyAadhaar: (aadhaarNumber: string) =>
    request<{ verified: boolean; aadhaar?: string; message?: string }>('POST', '/auth/verify-aadhaar', { aadhaarNumber }),
  getMe: () => request<Record<string, unknown>>('GET', '/auth/me'),

  // Centres
  getCentres: (lat?: number, lng?: number) =>
    request<unknown[]>('GET', `/centres${lat ? `?lat=${lat}&lng=${lng}` : ''}`),

  // Slots
  getSlots: (centreId?: string, date?: string) =>
    request<unknown[]>('GET', `/slots?${centreId ? `centreId=${centreId}` : ''}${date ? `&date=${date}` : ''}`),
  bookSlot: (slotId: string, crop: string) =>
    request<unknown>('POST', '/slots/book', { slotId, crop }),
  getMySlots: () => request<unknown[]>('GET', '/slots/my'),

  // Queue
  getQueue: (centreId?: string) =>
    request<unknown[]>('GET', `/queue${centreId ? `?centreId=${centreId}` : ''}`),
  updateQueueStatus: (tokenNumber: string, status: string, centreId?: string) =>
    request<unknown>('POST', '/queue/status', { tokenNumber, status, centreId }),

  // Trucks
  truckEntry: (data: Record<string, string>) => request<unknown>('POST', '/trucks/entry', data),
  truckExit: (rfidTag: string, truckNumber: string) =>
    request<unknown>('POST', '/trucks/exit', { rfidTag, truckNumber }),
  getTrucksByCentre: (centreId: string) =>
    request<unknown[]>('GET', `/trucks/centre/${centreId}`),

  // Procurement
  getMyProcurement: () => request<unknown[]>('GET', '/procurement/my'),
  getAllProcurement: (centreId?: string) =>
    request<unknown[]>('GET', `/procurement${centreId ? `?centreId=${centreId}` : ''}`),
  updateProcurementStatus: (id: string, data: Record<string, unknown>) =>
    request<unknown>('PATCH', `/procurement/${id}/status`, data),

  // Marketplace
  getListings: (params?: Record<string, string>) =>
    request<unknown[]>('GET', `/listings?${params ? new URLSearchParams(params).toString() : ''}`),
  getMyListings: () => request<unknown[]>('GET', '/listings/my'),
  getListing: (id: string) => request<unknown>('GET', `/listings/${id}`),
  createListing: (data: unknown) => request<unknown>('POST', '/listings', data),
  updateListing: (id: string, data: unknown) => request<unknown>('PUT', `/listings/${id}`, data),
  deleteListing: (id: string) => request<unknown>('DELETE', `/listings/${id}`),
  toggleSold: (id: string) => request<unknown>('PATCH', `/listings/${id}/sold`),
  getPriceSuggestion: (crop: string) =>
    request<{ mspPrice: number; minSuggested: number; maxSuggested: number; suggestedPrice: number; basis: string }>(
      'GET', `/listings/price-suggestion?crop=${encodeURIComponent(crop)}`
    ),

  // MSP
  getMspPrices: (crop?: string) =>
    request<unknown[]>('GET', `/msp/prices${crop ? `?crop=${encodeURIComponent(crop)}` : ''}`),

  // Weather
  getWeather: (lat?: number, lng?: number) =>
    request<{ source: string; forecast: unknown[] }>('GET', `/weather${lat ? `?lat=${lat}&lng=${lng}` : ''}`),

  // Admin
  getAdminKpi: () => request<Record<string, number>>('GET', '/admin/kpi'),

  // AI
  chat: (message: string, language?: string, apiKey?: string) =>
    request<{ text?: string; richCardType?: string; richData?: unknown; ticketId?: string; source?: string; error?: string; suggestions?: string[] }>(
      'POST', '/ai/chat', { message, language, apiKey }
    ),

  // Notifications
  getNotifications: () => request<unknown[]>('GET', '/notifications/my'),

  // Payments (legacy)
  getPayments: () => request<unknown[]>('GET', '/payments'),
  updatePayment: (recordId: string, status: string, grade?: string) =>
    request<unknown>('POST', '/payments/update', { recordId, status, grade }),
};

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem('agri_token', token);
  else localStorage.removeItem('agri_token');
}

export function getStoredUser(): Record<string, unknown> | null {
  const u = localStorage.getItem('agri_user');
  return u ? JSON.parse(u) : null;
}

export function setStoredUser(user: Record<string, unknown> | null) {
  if (user) localStorage.setItem('agri_user', JSON.stringify(user));
  else localStorage.removeItem('agri_user');
}
