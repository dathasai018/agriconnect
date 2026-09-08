import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const JWT_SECRET = process.env.JWT_SECRET || 'agriconnect-dev-secret-2026';
const PORT = process.env.PORT || 5000;

const app = express();
const httpServer = createServer(app);

// ── WebSocket Server ──────────────────────────────────────────────
const wss = new WebSocketServer({ server: httpServer });
const wsClients = new Map(); // userId -> ws

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const token = url.searchParams.get('token');
  let userId = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
      wsClients.set(userId, ws);
    } catch (_) {}
  }

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);
      if (msg.type === 'join:centre') ws.centreId = msg.centreId;
    } catch (_) {}
  });

  ws.on('close', () => { if (userId) wsClients.delete(userId); });
  ws.on('error', () => {});
});

function broadcastToCentre(centreId, event, data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1 && client.centreId === centreId) {
      client.send(JSON.stringify({ event, data }));
    }
  });
}

function notifyUser(userId, event, data) {
  const ws = wsClients.get(userId);
  if (ws && ws.readyState === 1) ws.send(JSON.stringify({ event, data }));
}

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// ── Data Helpers ──────────────────────────────────────────────────
function readData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch (_) { return {}; }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ── Haversine Distance (km) ───────────────────────────────────────
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Auth Middleware ───────────────────────────────────────────────
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch (_) { res.status(401).json({ error: 'Invalid token' }); }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

// ═══════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════════

// POST /api/auth/send-otp
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });
  const data = readData();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  if (!data.otps) data.otps = {};
  data.otps[phone] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
  writeData(data);
  console.log(`[SMS Mock] OTP for ${phone}: ${otp}`);
  res.json({ message: `OTP sent to ${phone}`, devOtp: otp });
});

// POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp, role } = req.body;
  const data = readData();
  const stored = data.otps?.[phone];
  const isValid = stored && stored.otp === otp && Date.now() < stored.expiresAt;
  const isDevOtp = otp === '123456';

  if (!isValid && !isDevOtp) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }

  if (data.otps) delete data.otps[phone];

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  let user = data.users?.find(u => u.phone === cleanPhone);
  if (!user) {
    user = {
      id: 'user-' + Date.now(),
      name: role === 'admin' ? 'Mandi Admin' : role === 'customer' ? 'Buyer User' : 'New Farmer',
      phone: cleanPhone,
      role: role || 'farmer',
      aadhaarVerified: false,
      preferredLanguage: 'en'
    };
    if (!data.users) data.users = [];
    data.users.push(user);
  }

  writeData(data);

  const token = jwt.sign(
    { userId: user.id, phone: user.phone, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role, aadhaarVerified: user.aadhaarVerified, preferredLanguage: user.preferredLanguage }
  });
});

// POST /api/auth/verify-aadhaar
app.post('/api/auth/verify-aadhaar', authenticate, (req, res) => {
  const { aadhaarNumber } = req.body;
  if (!aadhaarNumber || aadhaarNumber.replace(/\s/g, '').length !== 12) {
    return res.status(400).json({ error: 'Invalid Aadhaar number (must be 12 digits)' });
  }
  const data = readData();
  const idx = data.users?.findIndex(u => u.id === req.user.userId);
  if (idx >= 0) { data.users[idx].aadhaarVerified = true; writeData(data); }
  console.log(`[Aadhaar Mock] eKYC for ${aadhaarNumber} — APPROVED`);
  res.json({ verified: true, message: 'Aadhaar verified (mock eKYC provider)' });
});

// GET /api/auth/me
app.get('/api/auth/me', authenticate, (req, res) => {
  const data = readData();
  const user = data.users?.find(u => u.id === req.user.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ═══════════════════════════════════════════════════════════════════
// CENTRES
// ═══════════════════════════════════════════════════════════════════

app.get('/api/centres', (req, res) => {
  const data = readData();
  const { lat, lng } = req.query;
  let centres = (data.centres || []).map(c => {
    const activeQueue = (data.queue || []).filter(q => q.centreId === c.id && (q.status === 'waiting' || q.status === 'in-progress'));
    const activeTrucks = (data.trucks || []).filter(t => t.centreId === c.id && !t.exitTime);
    const queueLen = activeQueue.length;
    return {
      ...c,
      distanceKm: lat && lng
        ? Math.round(haversine(parseFloat(lat), parseFloat(lng), c.latitude, c.longitude) * 10) / 10
        : (c.defaultDistance || Math.round(Math.random() * 40 + 5)),
      liveTruckCount: activeTrucks.length || c.liveTruckCount || 0,
      queueLength: queueLen,
      congestionStatus: queueLen > 8 ? 'high' : queueLen > 3 ? 'medium' : 'low',
      avgWaitMinutes: c.avgWaitMinutes || 30,
    };
  });
  if (lat && lng) centres.sort((a, b) => a.distanceKm - b.distanceKm);
  res.json(centres);
});

// ═══════════════════════════════════════════════════════════════════
// SLOTS
// ═══════════════════════════════════════════════════════════════════

app.get('/api/slots', (req, res) => {
  const data = readData();
  const { centreId, date } = req.query;
  let slots = data.slots || [];
  if (centreId) slots = slots.filter(s => s.centreId === centreId);
  if (date) slots = slots.filter(s => s.date === date);
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  slots = slots.map(s => ({
    ...s,
    fillPercent: Math.round((s.bookedCount / s.capacity) * 100),
    congestion: s.bookedCount / s.capacity >= 0.85 ? 'high' : s.bookedCount / s.capacity >= 0.6 ? 'medium' : 'low',
    dayLabel: s.date === today ? 'Today' : s.date === tomorrow ? 'Tomorrow' : s.date,
    timeWindow: `${s.timeSlot} - ${addTwoHours(s.timeSlot)}`,
  }));
  res.json(slots);
});

function addTwoHours(timeStr) {
  if (!timeStr) return '';
  const [time, period] = timeStr.split(' ');
  const [h, m] = time.split(':').map(Number);
  let hour = h + 2;
  let newPeriod = period;
  if (hour >= 12 && period === 'AM') newPeriod = 'PM';
  if (hour > 12) hour -= 12;
  if (hour === 24) hour = 0;
  return `${hour.toString().padStart(2, '0')}:${(m || 0).toString().padStart(2, '0')} ${newPeriod}`;
}

app.post('/api/slots/book', authenticate, requireRole('farmer'), (req, res) => {
  const { slotId, crop } = req.body;
  const data = readData();
  const idx = (data.slots || []).findIndex(s => s.id === slotId);
  if (idx < 0) return res.status(404).json({ error: 'Slot not found' });
  const slot = data.slots[idx];
  if (slot.bookedCount >= slot.capacity) return res.status(400).json({ error: 'Slot is fully booked' });

  data.slots[idx] = { ...slot, bookedCount: slot.bookedCount + 1, bookedByUserId: req.user.userId, status: 'booked' };

  const record = {
    id: 'pay-' + Date.now(),
    farmerId: req.user.userId, farmerName: req.user.name, farmerPhone: req.user.phone,
    centreId: slot.centreId, slotId, crop: crop || 'Paddy',
    quantityQuintals: 0, ratePerQuintal: 0, totalAmount: 0, qualityGrade: 'Grade A',
    paymentStatus: 'registered', updatedAt: new Date().toISOString()
  };
  if (!data.procurementRecords) data.procurementRecords = [];
  data.procurementRecords.push(record);

  if (!data.notifications) data.notifications = [];
  data.notifications.push({
    id: 'notif-' + Date.now(), userId: req.user.userId, channel: 'app',
    message: `Slot booked at ${slot.centreId} for ${slot.date} at ${slot.timeSlot}. Your token will be issued on arrival.`,
    sentAt: new Date().toISOString(), status: 'sent'
  });
  writeData(data);
  broadcastToCentre(slot.centreId, 'slot:booked', { slot: data.slots[idx], farmerId: req.user.userId });
  res.json({ success: true, slot: data.slots[idx], procurementRecord: record });
});

app.get('/api/slots/my', authenticate, (req, res) => {
  const data = readData();
  res.json((data.slots || []).filter(s => s.bookedByUserId === req.user.userId));
});

// ═══════════════════════════════════════════════════════════════════
// QUEUE
// ═══════════════════════════════════════════════════════════════════

app.get('/api/queue', (req, res) => {
  const data = readData();
  const { centreId } = req.query;
  let q = data.queue || [];
  if (centreId) q = q.filter(e => e.centreId === centreId);
  res.json(q);
});

app.post('/api/queue/status', authenticate, requireRole('admin'), (req, res) => {
  const { tokenNumber, status, centreId } = req.body;
  const data = readData();
  const idx = (data.queue || []).findIndex(q => q.tokenNumber === tokenNumber);
  if (idx < 0) return res.status(404).json({ error: 'Queue entry not found' });

  data.queue[idx] = { ...data.queue[idx], status };
  if (status === 'completed') data.queue[idx].estMinutesLeft = 0;
  writeData(data);

  const cId = centreId || data.queue[idx].centreId;
  broadcastToCentre(cId, 'queue:update', { queue: (data.queue || []).filter(q => q.centreId === cId) });
  if (data.queue[idx].farmerId) notifyUser(data.queue[idx].farmerId, 'slot:status', { status, tokenNumber });
  console.log(`[SMS Mock] Token ${tokenNumber} → ${status.toUpperCase()}`);
  res.json({ success: true, tokenNumber, newStatus: status });
});

// ═══════════════════════════════════════════════════════════════════
// TRUCKS / RFID
// ═══════════════════════════════════════════════════════════════════

app.post('/api/trucks/entry', (req, res) => {
  const { rfidTag, truckNumber, driverName, centreId, linkedSlotId } = req.body;
  const data = readData();
  if (!data.trucks) data.trucks = [];
  const truck = { id: 'truck-' + Date.now(), rfidTag, truckNumber, driverName, centreId, entryTime: new Date().toISOString(), exitTime: null, linkedSlotId: linkedSlotId || null, gateStatus: 'At Gate' };
  data.trucks.push(truck);
  writeData(data);
  broadcastToCentre(centreId, 'truck:event', { type: 'entry', truck });
  console.log(`[RFID] Entry: ${truckNumber} at ${centreId}`);
  res.json({ success: true, truck });
});

app.post('/api/trucks/exit', (req, res) => {
  const { rfidTag, truckNumber } = req.body;
  const data = readData();
  const idx = (data.trucks || []).findIndex(t => t.rfidTag === rfidTag || t.truckNumber === truckNumber);
  if (idx < 0) return res.status(404).json({ error: 'Truck not found' });
  data.trucks[idx].exitTime = new Date().toISOString();
  data.trucks[idx].gateStatus = 'Departed';
  const waitMinutes = Math.round((new Date(data.trucks[idx].exitTime) - new Date(data.trucks[idx].entryTime)) / 60000);
  writeData(data);
  broadcastToCentre(data.trucks[idx].centreId, 'truck:event', { type: 'exit', truck: data.trucks[idx] });
  res.json({ success: true, truck: data.trucks[idx], waitMinutes });
});

app.get('/api/trucks/centre/:id', (req, res) => {
  const data = readData();
  const trucks = (data.trucks || []).filter(t => t.centreId === req.params.id).map(t => ({
    ...t,
    durationMinutes: t.exitTime
      ? Math.round((new Date(t.exitTime) - new Date(t.entryTime)) / 60000)
      : Math.round((Date.now() - new Date(t.entryTime)) / 60000)
  }));
  res.json(trucks);
});

// ═══════════════════════════════════════════════════════════════════
// PROCUREMENT
// ═══════════════════════════════════════════════════════════════════

app.get('/api/procurement/my', authenticate, (req, res) => {
  const data = readData();
  res.json((data.procurementRecords || []).filter(r => r.farmerId === req.user.userId));
});

app.get('/api/procurement', authenticate, requireRole('admin'), (req, res) => {
  const data = readData();
  const user = (data.users || []).find(u => u.id === req.user.userId);
  const centreId = user?.centreId || req.query.centreId;
  res.json((data.procurementRecords || []).filter(r => !centreId || r.centreId === centreId));
});

app.patch('/api/procurement/:id/status', authenticate, requireRole('admin'), (req, res) => {
  const { status, paymentAmount, qualityGrade, quantityQuintals, ratePerQuintal } = req.body;
  const data = readData();
  const idx = (data.procurementRecords || []).findIndex(r => r.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Record not found' });
  const rec = data.procurementRecords[idx];
  const qty = quantityQuintals || rec.quantityQuintals || 0;
  const rate = ratePerQuintal || rec.ratePerQuintal || 0;
  data.procurementRecords[idx] = { ...rec, paymentStatus: status || rec.paymentStatus, paymentAmount: paymentAmount || rec.paymentAmount, qualityGrade: qualityGrade || rec.qualityGrade, quantityQuintals: qty, ratePerQuintal: rate, totalAmount: qty * rate || rec.totalAmount, updatedAt: new Date().toISOString() };
  if (status === 'paid' && !rec.utrNumber) {
    data.procurementRecords[idx].utrNumber = 'SBIN' + Date.now().toString().slice(-9);
    data.procurementRecords[idx].disbursedDate = new Date().toLocaleString('en-IN');
  }
  writeData(data);
  if (rec.farmerId) notifyUser(rec.farmerId, 'payment:update', { recordId: req.params.id, status, record: data.procurementRecords[idx] });
  res.json({ success: true, record: data.procurementRecords[idx] });
});

// ═══════════════════════════════════════════════════════════════════
// MARKETPLACE
// ═══════════════════════════════════════════════════════════════════

app.get('/api/listings', (req, res) => {
  const data = readData();
  const { crop, minPrice, maxPrice, status } = req.query;
  let listings = (data.marketListings || []).filter(l => l.status === (status || 'active'));
  if (crop) listings = listings.filter(l => l.crop.toLowerCase().includes(crop.toLowerCase()));
  if (minPrice) listings = listings.filter(l => l.pricePerQuintal >= parseFloat(minPrice));
  if (maxPrice) listings = listings.filter(l => l.pricePerQuintal <= parseFloat(maxPrice));
  res.json(listings);
});

app.get('/api/listings/price-suggestion', (req, res) => {
  const { crop } = req.query;
  const data = readData();
  const mspData = (data.mspPrices || []).filter(m => m.crop.toLowerCase().includes((crop || 'paddy').toLowerCase()));
  const latest = mspData.sort((a, b) => b.year - a.year)[0];
  const msp = latest?.pricePerQuintal || 2000;
  res.json({ mspPrice: msp, minSuggested: Math.round(msp * 1.1), maxSuggested: Math.round(msp * 1.4), suggestedPrice: Math.round(msp * 1.25), basis: `Based on MSP ₹${msp}/Qtl + 10-40% market premium` });
});

app.get('/api/listings/my', authenticate, (req, res) => {
  const data = readData();
  res.json((data.marketListings || []).filter(l => l.farmerId === req.user.userId));
});

app.get('/api/listings/:id', (req, res) => {
  const data = readData();
  const listing = (data.marketListings || []).find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: 'Not found' });
  res.json(listing);
});

app.post('/api/listings', authenticate, requireRole('farmer'), (req, res) => {
  const data = readData();
  const user = (data.users || []).find(u => u.id === req.user.userId);
  const listing = { id: 'listing-' + Date.now(), farmerId: req.user.userId, farmerName: req.user.name || user?.name, farmerPhone: req.user.phone || user?.phone, farmerLocation: user?.village || 'India', state: 'India', ...req.body, status: 'active', postedDate: 'Just now', createdAt: new Date().toISOString() };
  if (!data.marketListings) data.marketListings = [];
  data.marketListings.push(listing);
  writeData(data);
  res.status(201).json(listing);
});

app.put('/api/listings/:id', authenticate, requireRole('farmer'), (req, res) => {
  const data = readData();
  const idx = (data.marketListings || []).findIndex(l => l.id === req.params.id && l.farmerId === req.user.userId);
  if (idx < 0) return res.status(404).json({ error: 'Not found or not yours' });
  data.marketListings[idx] = { ...data.marketListings[idx], ...req.body, id: req.params.id };
  writeData(data);
  res.json(data.marketListings[idx]);
});

app.delete('/api/listings/:id', authenticate, requireRole('farmer'), (req, res) => {
  const data = readData();
  const idx = (data.marketListings || []).findIndex(l => l.id === req.params.id && l.farmerId === req.user.userId);
  if (idx < 0) return res.status(404).json({ error: 'Not found or not yours' });
  data.marketListings.splice(idx, 1);
  writeData(data);
  res.json({ success: true });
});

app.patch('/api/listings/:id/sold', authenticate, requireRole('farmer'), (req, res) => {
  const data = readData();
  const idx = (data.marketListings || []).findIndex(l => l.id === req.params.id && l.farmerId === req.user.userId);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  data.marketListings[idx].status = data.marketListings[idx].status === 'active' ? 'sold' : 'active';
  writeData(data);
  res.json(data.marketListings[idx]);
});

// ═══════════════════════════════════════════════════════════════════
// MSP PRICES
// ═══════════════════════════════════════════════════════════════════

app.get('/api/msp/prices', (req, res) => {
  const data = readData();
  const { crop } = req.query;
  let prices = data.mspPrices || [];
  if (crop) prices = prices.filter(p => p.crop.toLowerCase().includes(crop.toLowerCase()));
  res.json(prices);
});

// ═══════════════════════════════════════════════════════════════════
// WEATHER
// ═══════════════════════════════════════════════════════════════════

app.get('/api/weather', async (req, res) => {
  const KEY = process.env.OPENWEATHER_API_KEY;
  const { lat, lng } = req.query;
  if (KEY && lat && lng) {
    try {
      const r = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${KEY}&units=metric&cnt=5`);
      const d = await r.json();
      const forecast = d.list.slice(0, 5).map(item => ({
        day: new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
        date: new Date(item.dt * 1000).toLocaleDateString('en', { day: '2-digit', month: 'short' }),
        tempC: Math.round(item.main.temp), condition: item.weather[0].main,
        rainProbability: Math.round((item.pop || 0) * 100), humidity: item.main.humidity,
        windSpeedKmh: Math.round(item.wind.speed * 3.6), icon: item.weather[0].icon,
        advisory: item.pop > 0.7 ? 'Heavy rain expected. Avoid open mandi transport.' : 'Good weather for harvest transport.'
      }));
      return res.json({ source: 'openweather', forecast });
    } catch (_) { console.log('[Weather] API failed, using mock'); }
  }
  res.json({ source: 'mock', forecast: [
    { day: 'Today', date: '08 Sep', tempC: 31, condition: 'Light Rain', icon: 'CloudRain', rainProbability: 75, humidity: 82, windSpeedKmh: 18, advisory: 'Rain 2-5 PM. Keep produce covered.' },
    { day: 'Wed', date: '09 Sep', tempC: 33, condition: 'Partly Cloudy', icon: 'CloudSun', rainProbability: 25, humidity: 68, windSpeedKmh: 14, advisory: 'Clear morning. Good for grain transport.' },
    { day: 'Thu', date: '10 Sep', tempC: 34, condition: 'Sunny', icon: 'Sun', rainProbability: 10, humidity: 58, windSpeedKmh: 11, advisory: 'Optimal weather for mandi delivery.' },
    { day: 'Fri', date: '11 Sep', tempC: 32, condition: 'Sunny', icon: 'Sun', rainProbability: 15, humidity: 62, windSpeedKmh: 12, advisory: 'Dry conditions. Low moisture expected.' },
    { day: 'Sat', date: '12 Sep', tempC: 29, condition: 'Heavy Rain', icon: 'CloudLightning', rainProbability: 85, humidity: 89, windSpeedKmh: 24, advisory: 'Heavy thunderstorms. Avoid transport.' }
  ]});
});

// ═══════════════════════════════════════════════════════════════════
// ADMIN KPI
// ═══════════════════════════════════════════════════════════════════

app.get('/api/admin/kpi', authenticate, requireRole('admin'), (req, res) => {
  const data = readData();
  const today = new Date().toISOString().slice(0, 10);
  const user = (data.users || []).find(u => u.id === req.user.userId);
  const centreId = user?.centreId;
  const todaySlots = (data.slots || []).filter(s => s.date === today && (!centreId || s.centreId === centreId));
  const activeTrucks = (data.trucks || []).filter(t => (!centreId || t.centreId === centreId) && !t.exitTime);
  const completedTrucks = (data.trucks || []).filter(t => (!centreId || t.centreId === centreId) && t.exitTime);
  const avgWait = completedTrucks.length > 0
    ? Math.round(completedTrucks.reduce((s, t) => s + (new Date(t.exitTime) - new Date(t.entryTime)) / 60000, 0) / completedTrucks.length)
    : 42;
  const paidRecords = (data.procurementRecords || []).filter(r => r.paymentStatus === 'paid' && (!centreId || r.centreId === centreId));
  const completedQueue = (data.queue || []).filter(q => q.status === 'completed' && (!centreId || q.centreId === centreId));
  res.json({
    todayBookings: todaySlots.reduce((s, sl) => s + sl.bookedCount, 0),
    trucksOnSite: activeTrucks.length,
    avgWaitMinutes: avgWait,
    farmersServedThisWeek: completedQueue.length + 12,
    totalRevenue: paidRecords.reduce((s, r) => s + (r.totalAmount || 0), 0),
    pendingPayments: (data.procurementRecords || []).filter(r => r.paymentStatus !== 'paid').length
  });
});

// ═══════════════════════════════════════════════════════════════════
// AI ASSISTANT
// ═══════════════════════════════════════════════════════════════════

app.post('/api/ai/chat', (req, res) => {
  const { message } = req.body;
  const lower = (message || '').toLowerCase();
  let response = { text: null, richCardType: null, richData: null, ticketId: null };

  if (lower.includes('slot') || lower.includes('book') || lower.includes('tomorrow')) {
    response.text = 'AgriConnect Forecaster suggests tomorrow 07:00 AM - 09:00 AM for lowest wait time (~18 mins). Shall I book that slot for you?';
    response.richCardType = 'slot';
    response.richData = { centreName: 'Warangal APMC Yard', time: 'Tomorrow, 07:00 AM', waitEst: '18 mins', bay: 'Bay #1' };
  } else if (lower.includes('msp') || lower.includes('price') || lower.includes('rate')) {
    response.text = 'Current MSP for Paddy (Grade A) is ₹2,320/Qtl for Kharif 2025-26. Open market Basmati is at ₹3,850/Qtl (+66% premium). Sell FAQ Paddy via govt procurement and Basmati direct to buyers.';
    response.richCardType = 'price_check';
    response.richData = { mspPrice: 2320, marketPrice: 3850, crop: 'Paddy' };
  } else if (lower.includes('weather') || lower.includes('rain')) {
    response.text = 'Weather Alert: Rain expected today 2-5 PM (75% chance). Thursday and Friday excellent for mandi visits. Avoid Saturday due to heavy thunderstorms (85% chance).';
  } else if (lower.includes('queue') || lower.includes('wait') || lower.includes('how long')) {
    response.text = 'Current queue at Warangal Mandi: 3 trucks ahead. Estimated wait: 24 minutes. Your token is TK-105 at Bay #4.';
  } else if (lower.includes('payment') || lower.includes('dispute') || lower.includes('delay') || lower.includes('issue') || lower.includes('problem')) {
    const ticketId = 'AGRI-TKT-' + Math.floor(1000 + Math.random() * 9000);
    const data = readData();
    if (!data.supportTickets) data.supportTickets = [];
    data.supportTickets.push({ id: ticketId, topic: message, status: 'open', createdAt: new Date().toISOString() });
    writeData(data);
    response.text = `Your concern has been escalated to the District Marketing Officer. Ticket #${ticketId} created. Resolution expected within 4 hours.`;
    response.richCardType = 'ticket';
    response.richData = { ticketId, category: 'Payment Escalation', status: 'Assigned to Mandi Secretary', eta: '4 hours' };
    response.ticketId = ticketId;
  } else if (lower.includes('market') || lower.includes('sell') || lower.includes('listing')) {
    response.text = 'I can help you create a marketplace listing! Basmati Paddy is fetching ₹3,850-4,200/Qtl from mill buyers. Shall I open the listing form?';
  } else if (lower.match(/^(hi|hello|namaste|hey)/)) {
    response.text = 'Namaste! I am your AgriConnect AI Assistant. I can help with slot booking, MSP prices, queue updates, weather alerts, payment status, and marketplace listings. What can I help you with today?';
  } else {
    response.text = `I received your query about "${message}". Mandi operations are running smoothly. Ask me about: slot booking, MSP prices, queue status, weather, or payment issues.`;
  }

  // Simulate AI latency (600-1400ms)
  setTimeout(() => res.json(response), 600 + Math.random() * 800);
});

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════

app.get('/api/notifications/my', authenticate, (req, res) => {
  const data = readData();
  const notifs = (data.notifications || []).filter(n => n.userId === req.user.userId).slice(-20).reverse();
  res.json(notifs);
});

// ═══════════════════════════════════════════════════════════════════
// LEGACY COMPAT (original routes still work)
// ═══════════════════════════════════════════════════════════════════

app.get('/api/payments', (req, res) => {
  const data = readData();
  res.json(data.procurementRecords || data.payments || []);
});

app.post('/api/payments/update', authenticate, (req, res) => {
  const { recordId, status, grade } = req.body;
  const data = readData();
  const arr = data.procurementRecords || data.payments || [];
  const idx = arr.findIndex(p => p.id === recordId);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  arr[idx].paymentStatus = status;
  if (grade) arr[idx].qualityGrade = grade;
  if (status === 'paid' && !arr[idx].utrNumber) {
    arr[idx].utrNumber = 'SBIN' + Date.now().toString().slice(-9);
    arr[idx].disbursedDate = new Date().toLocaleString('en-IN');
  }
  if (data.procurementRecords) data.procurementRecords = arr; else data.payments = arr;
  writeData(data);
  res.json({ success: true, record: arr[idx] });
});

app.post('/api/slots/reassign', (req, res) => {
  const data = readData();
  const next = (data.slots || []).find(s => !s.bookedByUserId && s.bookedCount < s.capacity);
  res.json({ success: true, reallocatedSlot: next || null, message: 'Auto-reassignment complete' });
});

app.post('/api/simulation/e2e', (req, res) => {
  const data = readData();
  const arr = data.procurementRecords || data.payments || [];
  const idx = arr.findIndex(p => p.id === 'pay-3');
  if (idx >= 0) {
    arr[idx].paymentStatus = 'paid';
    arr[idx].utrNumber = 'SBIN' + Date.now().toString().slice(-9);
    arr[idx].disbursedDate = 'Today, Just now';
    if (data.procurementRecords) data.procurementRecords = arr; else data.payments = arr;
    writeData(data);
  }
  res.json({ success: true, message: 'E2E simulation complete', record: arr[idx] });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', platform: 'AgriConnect API v2.0', uptime: process.uptime(), timestamp: new Date().toISOString(), websocket: `ws://localhost:${PORT}`, devOtpHint: 'Use OTP 123456 for any number in dev mode' });
});

// ═══════════════════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════════════════

httpServer.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════════════╗`);
  console.log(`║     AgriConnect API v2.0  —  Ready!              ║`);
  console.log(`╠══════════════════════════════════════════════════╣`);
  console.log(`║  REST API  → http://localhost:${PORT}/api/health   ║`);
  console.log(`║  WebSocket → ws://localhost:${PORT}                ║`);
  console.log(`║  Dev OTP   → Use "123456" for any phone number   ║`);
  console.log(`╚══════════════════════════════════════════════════╝\n`);
});
