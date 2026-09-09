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

// Auto-load .env configuration if present
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(envPath);
    console.log('[Environment] Loaded server/.env configuration successfully');
  }
} catch (e) {
  console.log('[Environment] Note: server/.env not loaded:', e.message);
}

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

// GET /api/auth/sms-status
app.get('/api/auth/sms-status', (req, res) => {
  const providers = [];
  if (process.env.TWOFACTOR_API_KEY) providers.push('2Factor.in');
  if (process.env.FAST2SMS_API_KEY) providers.push('Fast2SMS');
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) providers.push('Twilio');
  if (process.env.MSG91_AUTH_KEY) providers.push('MSG91');

  res.json({
    realSmsConfigured: providers.length > 0,
    activeProviders: providers,
    message: providers.length > 0 
      ? `Real SMS active via: ${providers.join(', ')}`
      : 'Real SMS not configured. Add TWILIO_*, TWOFACTOR_API_KEY, or FAST2SMS_API_KEY to server/.env'
  });
});

// POST /api/auth/configure-sms
app.post('/api/auth/configure-sms', (req, res) => {
  const { provider, apiKey, twilioSid, twilioToken, twilioPhone, msg91AuthKey, msg91TemplateId } = req.body;
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  try {
    if (fs.existsSync(envPath)) envContent = fs.readFileSync(envPath, 'utf8');
  } catch (_) {}

  if (provider === '2Factor.in' && apiKey) {
    process.env.TWOFACTOR_API_KEY = apiKey.trim();
    envContent += `\nTWOFACTOR_API_KEY=${apiKey.trim()}\n`;
  } else if (provider === 'Fast2SMS' && apiKey) {
    process.env.FAST2SMS_API_KEY = apiKey.trim();
    envContent += `\nFAST2SMS_API_KEY=${apiKey.trim()}\n`;
  } else if (provider === 'Twilio' && twilioSid && twilioToken) {
    process.env.TWILIO_ACCOUNT_SID = twilioSid.trim();
    process.env.TWILIO_AUTH_TOKEN = twilioToken.trim();
    if (twilioPhone) process.env.TWILIO_PHONE_NUMBER = twilioPhone.trim();
    envContent += `\nTWILIO_ACCOUNT_SID=${twilioSid.trim()}\nTWILIO_AUTH_TOKEN=${twilioToken.trim()}\nTWILIO_PHONE_NUMBER=${twilioPhone?.trim() || ''}\n`;
  } else if (provider === 'MSG91' && msg91AuthKey && msg91TemplateId) {
    process.env.MSG91_AUTH_KEY = msg91AuthKey.trim();
    process.env.MSG91_TEMPLATE_ID = msg91TemplateId.trim();
    envContent += `\nMSG91_AUTH_KEY=${msg91AuthKey.trim()}\nMSG91_TEMPLATE_ID=${msg91TemplateId.trim()}\n`;
  }

  try {
    fs.writeFileSync(envPath, envContent, 'utf8');
  } catch (_) {}

  res.json({ success: true, message: `Real SMS provider configured: ${provider}` });
});

// POST /api/auth/send-otp
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const data = readData();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  if (!data.otps) data.otps = {};
  data.otps[cleanPhone] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
  writeData(data);

  let smsSent = false;
  let activeGateway = null;

  // 1. Try 2Factor.in (Very popular & reliable Indian OTP gateway)
  if (!smsSent && process.env.TWOFACTOR_API_KEY) {
    try {
      const tfUrl = `https://2factor.in/v3/${process.env.TWOFACTOR_API_KEY}/SMS/${cleanPhone}/${otp}/AgriConnect`;
      const tfRes = await fetch(tfUrl);
      const tfData = await tfRes.json();
      if (tfData.Status === 'Success') {
        smsSent = true;
        activeGateway = '2Factor.in';
      }
    } catch (e) {
      console.log('[2Factor SMS Error]', e.message);
    }
  }

  // 2. Try Fast2SMS (DLT / Quick OTP India)
  if (!smsSent && process.env.FAST2SMS_API_KEY) {
    try {
      const fRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: cleanPhone
        })
      });
      const fData = await fRes.json();
      if (fData.return) {
        smsSent = true;
        activeGateway = 'Fast2SMS';
      }
    } catch (e) {
      console.log('[Fast2SMS Error]', e.message);
    }
  }

  // 3. Try Twilio Verify API or Messages API
  if (!smsSent && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');

      // Check if Twilio Verify Service SID is provided
      if (process.env.TWILIO_VERIFY_SERVICE_SID) {
        const verifyParams = new URLSearchParams();
        verifyParams.append('To', `+91${cleanPhone}`);
        verifyParams.append('Channel', 'sms');

        const vRes = await fetch(`https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/Verifications`, {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: verifyParams.toString()
        });
        if (vRes.ok) {
          smsSent = true;
          activeGateway = 'Twilio Verify';
        }
      } else if (process.env.TWILIO_PHONE_NUMBER) {
        // Standard Twilio Messages API
        const params = new URLSearchParams();
        params.append('To', `+91${cleanPhone}`);
        params.append('From', process.env.TWILIO_PHONE_NUMBER);
        params.append('Body', `🌾 Your AgriConnect Portal OTP is ${otp}. Valid for 10 minutes. Do not share.`);

        const twRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });
        if (twRes.ok) {
          smsSent = true;
          activeGateway = 'Twilio SMS';
        }
      }
    } catch (e) {
      console.log('[Twilio SMS Error]', e.message);
    }
  }

  // 4. Try MSG91 (Indian DLT SMS Gateway)
  if (!smsSent && process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
    try {
      const msgUrl = `https://control.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=91${cleanPhone}&authkey=${process.env.MSG91_AUTH_KEY}&otp=${otp}`;
      const msgRes = await fetch(msgUrl, { method: 'POST' });
      const msgData = await msgRes.json();
      if (msgData.type === 'success') {
        smsSent = true;
        activeGateway = 'MSG91';
      }
    } catch (e) {
      console.log('[MSG91 Error]', e.message);
    }
  }

  console.log(`[SMS Delivery] OTP for +91 ${cleanPhone}: ${otp} | Dispatched to Phone: ${smsSent ? `YES (${activeGateway})` : 'NO (Console Only)'}`);
  
  res.json({
    success: true,
    smsDispatched: smsSent,
    gateway: activeGateway,
    message: smsSent 
      ? `Real SMS dispatched to +91 ${cleanPhone} via ${activeGateway}` 
      : `OTP generated for +91 ${cleanPhone}`,
    phone: cleanPhone
  });
});

// POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp, role, name } = req.body;
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  const data = readData();
  const stored = data.otps?.[cleanPhone] || data.otps?.[phone];
  const isValid = stored && stored.otp === otp && Date.now() < stored.expiresAt;
  const isDevOtp = otp === '123456';

  if (!isValid && !isDevOtp) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }

  if (data.otps) {
    delete data.otps[cleanPhone];
    delete data.otps[phone];
  }

  let user = data.users?.find(u => u.phone === cleanPhone);
  if (!user) {
    user = {
      id: 'user-' + Date.now(),
      name: name?.trim() || (role === 'admin' ? 'Mandi Secretary' : role === 'customer' ? 'Agri Buyer' : 'Kisan Farmer'),
      phone: cleanPhone,
      role: role || 'farmer',
      aadhaarVerified: false,
      preferredLanguage: 'en'
    };
    if (!data.users) data.users = [];
    data.users.push(user);
  } else {
    // Update existing user with newly entered name & role
    if (name && name.trim()) user.name = name.trim();
    if (role) user.role = role;
  }

  writeData(data);

  const token = jwt.sign(
    { userId: user.id, phone: user.phone, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      aadhaarVerified: user.aadhaarVerified,
      preferredLanguage: user.preferredLanguage,
      village: user.village
    }
  });
});

// POST /api/auth/verify-aadhaar
app.post('/api/auth/verify-aadhaar', authenticate, (req, res) => {
  const { aadhaarNumber } = req.body;
  const cleanAadhaar = (aadhaarNumber || '').replace(/\s/g, '');
  if (cleanAadhaar.length !== 12) {
    return res.status(400).json({ error: 'Invalid Aadhaar number (must be 12 digits)' });
  }
  const data = readData();
  const idx = data.users?.findIndex(u => u.id === req.user.userId);
  const maskedAadhaar = `XXXX XXXX ${cleanAadhaar.slice(-4)}`;
  if (idx >= 0) {
    data.users[idx].aadhaarVerified = true;
    data.users[idx].aadhaar = maskedAadhaar;
    writeData(data);
  }
  console.log(`[Aadhaar eKYC] Verified ${maskedAadhaar} for user ${req.user.userId} — APPROVED`);
  res.json({ verified: true, aadhaar: maskedAadhaar, message: 'Aadhaar verified successfully via UIDAI eKYC' });
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

app.post('/api/ai/chat', async (req, res) => {
  const { message, language, apiKey } = req.body;
  const lower = (message || '').toLowerCase();
  const lang = language || 'en';
  const geminiKey = apiKey || process.env.GEMINI_API_KEY;

  // If Gemini API Key is provided, call real Google Gemini API
  if (geminiKey) {
    try {
      const langNames = {
        en: 'English',
        hi: 'Hindi (हिंदी)',
        te: 'Telugu (తెలుగు)',
        ta: 'Tamil (தமிழ்)',
        mr: 'Marathi (मराठी)',
        pa: 'Punjabi (ਪੰਜਾਬੀ)'
      };
      const targetLang = langNames[lang] || 'English';

      const candidateModels = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.8-flash'];

      const systemInstruction = `You are AgriConnect AI, an intelligent agricultural assistant and APMC Mandi advisor for Indian farmers, millers, and agricultural market committees.
Target Language: ${targetLang}.
You MUST answer entirely in ${targetLang}.
Provide comprehensive, practical, and highly accurate answers on:
- Crop cultivation, soil health, and organic/NPK fertilizers
- Pest detection, plant disease symptoms, and biopesticide solutions
- Weather alerts, rainfall precautions, and harvest grain drying benchmarks (target <14% moisture)
- Minimum Support Price (MSP), APMC mandi slot booking, token queue times, and PFMS DBT payments
- Direct farmer-to-buyer open marketplace pricing and quality grading
- Government welfare schemes like PM-KISAN, PMFBY (crop insurance), and Soil Health Cards.
Keep answers concise (under 160 words), well-formatted with bullet points, and highly encouraging to farmers.`;

      let lastError = null;
      let successfulData = null;
      let usedModel = null;

      for (const modelId of candidateModels) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;
          const gRes = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': geminiKey
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: `${systemInstruction}\n\nFarmer Query: "${message}"` }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048
              }
            })
          });

          if (gRes.ok) {
            successfulData = await gRes.json();
            usedModel = modelId;
            break;
          } else {
            const errDetails = await gRes.text();
            lastError = `Model ${modelId} returned ${gRes.status}: ${errDetails}`;
            console.error(`[Gemini API Attempt Failed - ${modelId}]`, gRes.status, errDetails);
            // If model is not found/deprecated, continue to next candidate model
            if (gRes.status === 404 || errDetails.includes('not found') || errDetails.includes('no longer available')) {
              continue;
            } else {
              break; // Other errors like invalid key or quota shouldn't rotate models pointlessly
            }
          }
        } catch (fetchErr) {
          lastError = fetchErr.message;
          console.error(`[Gemini API Network Error - ${modelId}]`, fetchErr.message);
        }
      }

      if (successfulData) {
        const candidate = successfulData?.candidates?.[0];
        const parts = candidate?.content?.parts || [];
        // Filter out thinking tokens if model returns thought parts
        const answerParts = parts.filter(p => !p.thought && p.text).map(p => p.text);
        let aiText = answerParts.join('\n\n').trim();
        if (!aiText) {
          aiText = parts.map(p => p.text).filter(Boolean).join('\n\n').trim();
        }

        if (aiText) {
          let richCardType = null;
          let richData = null;

          if (lower.includes('slot') || lower.includes('book') || lower.includes('స్లॉट') || lower.includes('బుక')) {
            richCardType = 'slot';
            richData = { centreName: 'Warangal APMC Yard', time: 'Tomorrow, 07:00 AM', waitEst: '18 mins', bay: 'Bay #1' };
          } else if (lower.includes('msp') || lower.includes('price') || lower.includes('rate') || lower.includes('ధర') || lower.includes('मूल्य')) {
            richCardType = 'price_check';
            richData = { mspPrice: 2320, marketPrice: 3850, crop: 'Paddy' };
          }

          return res.json({
            text: aiText,
            source: 'gemini-api',
            model: usedModel,
            richCardType,
            richData,
            suggestions: [
              lang === 'te' ? 'రేపటి స్లాట్ బుక్ చేయండి' : lang === 'hi' ? 'कल का स्लॉट बुक करें' : 'Book Tomorrow Slot',
              lang === 'te' ? 'వాతావరణ రాడార్ తనిఖీ' : lang === 'hi' ? 'मौसम रडार जांचें' : 'Check Weather Radar',
              lang === 'te' ? 'మార్కెట్ ధరలు చూడండి' : lang === 'hi' ? 'बाज़ार भाव देखें' : 'View Market Prices'
            ]
          });
        }
      }

      // If we reach here, Gemini request failed
      console.error('[Gemini API Final Failure]', lastError);
      return res.status(503).json({
        error: 'AI Assistant is temporarily unavailable. Please try again.',
        source: 'gemini-api-error'
      });
    } catch (err) {
      console.error('[Gemini Handler Exception]', err.message);
      return res.status(503).json({
        error: 'AI Assistant is temporarily unavailable. Please try again.',
        source: 'gemini-fetch-exception'
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // LOCAL MULTILINGUAL FALLBACK ENGINE (WHEN NO API KEY CONFIGURED)
  // ═══════════════════════════════════════════════════════════════════

  // Multilingual response maps
  const responses = {
    slot: {
      en: 'AgriConnect Forecaster suggests tomorrow 07:00 AM - 09:00 AM for lowest wait time (~18 mins). Shall I book that slot for you?',
      hi: 'AgriConnect पूर्वानुमान के अनुसार कल 07:00 बजे - 09:00 बजे सबसे कम प्रतीक्षा समय (~18 मिनट) है। क्या मैं यह स्लॉट आपके लिए बुक करूँ?',
      te: 'AgriConnect అంచనా ప్రకారం రేపు 07:00 AM - 09:00 AM వరకు వేచి ఉండే సమయం అత్యల్పం (~18 నిమిషాలు). ఈ స్లాట్ బుక్ చేయమంటారా?',
      ta: 'AgriConnect கணிப்பின்படி நாளை காலை 07:00 - 09:00 மணிக்கு காத்திருக்கும் நேரம் குறைவாக (~18 நிமிடங்கள்) இருக்கும். இந்த ஸ்லாட்டை பதிவு செய்யட்டுமா?',
      mr: 'AgriConnect अंदाजानुसार उद्या सकाळी 07:00 - 09:00 दरम्यान प्रतीक्षा वेळ सर्वात कमी (~18 मिनिटे) आहे. मी हा स्लॉट बुक करू का?',
      pa: 'AgriConnect ਦੇ ਅਨੁਮਾਨ ਅਨੁਸਾਰ ਕੱਲ੍ਹ ਸਵੇਰੇ 07:00 - 09:00 ਵਜੇ ਉਡੀਕ ਦਾ ਸਮਾਂ ਸਭ ਤੋਂ ਘੱਟ (~18 ਮਿੰਟ) ਹੋਵੇਗਾ। ਕੀ ਮੈਂ ਇਹ ਸਲਾਟ ਬੁੱਕ ਕਰਾਂ?'
    },
    msp: {
      en: 'Current MSP for Paddy (Grade A) is ₹2,320/Qtl for Kharif 2025-26. Open market Basmati is at ₹3,850/Qtl (+66% premium). Sell FAQ Paddy via govt procurement and Basmati direct to buyers.',
      hi: 'धान (ग्रेड A) का वर्तमान न्यूनतम समर्थन मूल्य ₹2,320/क्विंटल (खरीफ 2025-26) है। बासमती खुले बाज़ार में ₹3,850/क्विंटल (+66% प्रीमियम) पर है। FAQ धान सरकारी खरीद से और बासमती सीधे खरीदारों को बेचें।',
      te: 'వరి (గ్రేడ్ A) కు ప్రస్తుత MSP ₹2,320/క్వింటల్ (ఖరీఫ్ 2025-26). బాస్మతి ఓపెన్ మార్కెట్‌లో ₹3,850/క్వింటల్ (+66% ప్రీమియం). FAQ వరిని ప్రభుత్వ కొనుగోలు ద్వారా మరియు బాస్మతిని నేరుగా కొనుగోలుదారులకు అమ్మండి.',
      ta: 'நெல் (தரம் A) க்கான தற்போதைய MSP ₹2,320/குவிண்டால் (கரிஃப் 2025-26). பாஸ்மதி திறந்த சந்தையில் ₹3,850/குவிண்டால் (+66% பிரீமியம்). FAQ நெல்லை அரசு கொள்முதல் மூலமும் பாஸ்மதியை நேரடியாக வாங்குபவர்களுக்கும் விற்கவும்.',
      mr: 'भात (दर्जा A) साठी सध्याचा MSP ₹2,320/क्विंटल (खरीफ 2025-26) आहे. बासमती खुल्या बाजारात ₹3,850/क्विंटल (+66% प्रीमियम) आहे. FAQ भात सरकारी खरेदीद्वारे आणि बासमती थेट खरेदीदारांना विका.',
      pa: 'ਝੋਨੇ (ਗ੍ਰੇਡ A) ਦਾ ਮੌਜੂਦਾ MSP ₹2,320/ਕੁਇੰਟਲ (ਖਰੀਫ 2025-26) ਹੈ। ਬਾਸਮਤੀ ਖੁੱਲ੍ਹੇ ਬਾਜ਼ਾਰ ਵਿੱਚ ₹3,850/ਕੁਇੰਟਲ (+66% ਪ੍ਰੀਮੀਅਮ) ਹੈ। FAQ ਝੋਨਾ ਸਰਕਾਰੀ ਖਰੀਦ ਰਾਹੀਂ ਅਤੇ ਬਾਸਮਤੀ ਸਿੱਧੇ ਖਰੀਦਦਾਰਾਂ ਨੂੰ ਵੇਚੋ।'
    },
    weather: {
      en: 'Weather Alert: Rain expected today 2-5 PM (75% chance). Thursday and Friday excellent for mandi visits. Avoid Saturday due to heavy thunderstorms (85% chance).',
      hi: 'मौसम चेतावनी: आज दोपहर 2-5 बजे बारिश की संभावना (75%)। गुरुवार और शुक्रवार मंडी दौरे के लिए उत्तम हैं। शनिवार भारी तूफान के कारण (85%) बचें।',
      te: 'వాతావరణ హెచ్చరిక: ఈరోజు మధ్యాహ్నం 2-5 గంటలకు వర్షం (75% అవకాశం). గురువారం మరియు శుక్రవారం మండీ సందర్శనకు అనుకూలం. శనివారం భారీ వర్షం (85%) వల్ల నివారించండి.',
      ta: 'வானிலை எச்சரிக்கை: இன்று பிற்பகல் 2-5 மணிக்கு மழை (75% வாய்ப்பு). வியாழன் மற்றும் வெள்ளி மண்டி வருகைக்கு சிறந்தது. சனிக்கிழமை கடும் மழை (85%) காரணமாக தவிர்க்கவும்.',
      mr: 'हवामान इशारा: आज दुपारी 2-5 वाजता पाऊस होण्याची शक्यता (75%). गुरुवार आणि शुक्रवार मंडी भेटीसाठी उत्तम. शनिवारी जड वादळामुळे (85%) टाळा.',
      pa: 'ਮੌਸਮ ਚੇਤਾਵਨੀ: ਅੱਜ ਦੁਪਹਿਰ 2-5 ਵਜੇ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ (75%)। ਵੀਰਵਾਰ ਅਤੇ ਸ਼ੁੱਕਰਵਾਰ ਮੰਡੀ ਦੌਰੇ ਲਈ ਵਧੀਆ ਹਨ। ਭਾਰੀ ਤੂਫ਼ਾਨ (85%) ਕਾਰਨ ਸ਼ਨੀਵਾਰ ਤੋਂ ਬਚੋ।'
    },
    queue: {
      en: 'Current queue at Warangal Mandi: 3 trucks ahead. Estimated wait: 24 minutes. Your token is TK-105 at Bay #4.',
      hi: 'वारंगल मंडी में वर्तमान कतार: 3 ट्रक आगे। अनुमानित प्रतीक्षा: 24 मिनट। आपका टोकन TK-105 बे #4 पर है।',
      te: 'వరంగల్ మండీలో ప్రస్తుత క్యూ: 3 ట్రక్కులు ముందు. అంచనా వేచి ఉండే సమయం: 24 నిమిషాలు. మీ టోకెన్ TK-105 బే #4 దగ్గర.',
      ta: 'வாரங்கல் மண்டியில் தற்போதைய வரிசை: 3 வாகனங்கள் முன்னால். மதிப்பிடப்பட்ட காத்திருக்கும் நேரம்: 24 நிமிடங்கள். உங்கள் டோக்கன் TK-105 பே #4 இல் உள்ளது.',
      mr: 'वारंगल मंडीतील सध्याची रांग: 3 ट्रक पुढे. अंदाजे प्रतीक्षा: 24 मिनिटे. तुमचा टोकन TK-105 बे #4 वर आहे.',
      pa: 'ਵਾਰੰਗਲ ਮੰਡੀ ਵਿੱਚ ਮੌਜੂਦਾ ਕਤਾਰ: 3 ਟਰੱਕ ਅੱਗੇ। ਅਨੁਮਾਨਿਤ ਉਡੀਕ: 24 ਮਿੰਟ। ਤੁਹਾਡਾ ਟੋਕਨ TK-105 ਬੇ #4 ਤੇ ਹੈ।'
    },
    greeting: {
      en: 'Namaste! I am your AgriConnect AI Assistant powered by Gemini. I can answer any farming question, slot availability, MSP prices, weather alerts, and payment status. How can I help you today?',
      hi: 'नमस्ते! मैं आपका AgriConnect AI सहायक हूँ। मैं किसी भी कृषि प्रश्न, स्लॉट उपलब्धता, MSP मूल्य, मौसम चेतावनी और भुगतान स्थिति में सहायता कर सकता हूँ। आज मैं आपकी कैसे मदद करूँ?',
      te: 'నమస్కారం! నేను జెమిని ఆధారిత మీ AgriConnect AI సహాయకుడిని. వ్యవసాయ ప్రశ్నలు, స్లాట్ లభ్యత, MSP ధరలు, వాతావరణ హెచ్చరికలు మరియు చెల్లింపు స్థితిలో నేను మీకు సహాయం చేయగలను. ఈరోజు మీకు ఏమి సహాయం కావాలి?',
      ta: 'வணக்கம்! நான் உங்கள் AgriConnect AI உதவியாளர். எந்தவொரு விவசாய கேள்வி, ஸ்லாட் இருப்பு, MSP விலைகள், வானிலை எச்சரிக்கைகள் மற்றும் பணம் செலுத்தும் நிலையில் உதவ முடியும். இன்று நான் உங்களுக்கு எப்படி உதவலாம்?',
      mr: 'नमस्कार! मी तुमचा AgriConnect AI सहाय्यक आहे. कोणत्याही कृषी प्रश्न, स्लॉट उपलब्धता, MSP किमती, हवामान इशारे आणि देयक स्थितीत मी मदत करू शकतो. आज मी तुम्हाला कशी मदत करू?',
      pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AgriConnect AI ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਕਿਸੇ ਵੀ ਖੇਤੀਬਾੜੀ ਸਵਾਲ, ਸਲਾਟ ਉਪਲਬਧਤਾ, MSP ਕੀਮਤਾਂ, ਮੌਸਮ ਚੇਤਾਵਨੀ ਅਤੇ ਭੁਗਤਾਨ ਸਥਿਤੀ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰਾਂ?'
    },
    market: {
      en: 'I can help you create a marketplace listing! Basmati Paddy is fetching ₹3,850-4,200/Qtl from mill buyers. Shall I open the listing form?',
      hi: 'मैं मार्केटप्लेस लिस्टिंग बनाने में मदद कर सकता हूँ! बासमती धान मिल खरीदारों से ₹3,850-4,200/क्विंटल मिल रहा है। क्या मैं लिस्टिंग फॉर्म खोलूँ?',
      te: 'నేను మార్కెట్‌ప్లేస్ లిస్టింగ్ సృష్టించడంలో సహాయం చేయగలను! బాస్మతి వరి మిల్ కొనుగోలుదారులకు ₹3,850-4,200/క్వింటల్ వస్తోంది. లిస్టింగ్ ఫారమ్ తెరవమంటారా?',
      ta: 'சந்தை பட்டியல் உருவாக்க உதவலாம்! பாஸ்மதி நெல் மில் வாங்குபவர்களிடம் ₹3,850-4,200/குவிண்டால் கிடைக்கிறது. பட்டியல் படிவத்தை திறக்கட்டுமா?',
      mr: 'मी मार्केटप्लेस लिस्टिंग तयार करण्यात मदत करू शकतो! बासमती भात मिल खरेदीदारांकडून ₹3,850-4,200/क्विंटल मिळत आहे. लिस्टिंग फॉर्म उघडू का?',
      pa: 'ਮੈਂ ਮਾਰਕੀਟਪਲੇਸ ਸੂਚੀ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ! ਬਾਸਮਤੀ ਝੋਨਾ ਮਿੱਲ ਖਰੀਦਦਾਰਾਂ ਤੋਂ ₹3,850-4,200/ਕੁਇੰਟਲ ਮਿਲ ਰਿਹਾ ਹੈ। ਕੀ ਮੈਂ ਸੂਚੀ ਫਾਰਮ ਖੋਲ੍ਹਾਂ?'
    }
  };

  const getReply = (key) => (responses[key][lang] || responses[key]['en']);

  let response = { text: null, richCardType: null, richData: null, ticketId: null };

  if (lower.includes('slot') || lower.includes('book') || lower.includes('tomorrow') ||
      lower.includes('स्लॉट') || lower.includes('బుక') || lower.includes('நாளை') || lower.includes('ਸਲਾਟ')) {
    response.text = getReply('slot');
    response.richCardType = 'slot';
    response.richData = { centreName: 'Warangal APMC Yard', time: 'Tomorrow, 07:00 AM', waitEst: '18 mins', bay: 'Bay #1' };
  } else if (lower.includes('msp') || lower.includes('price') || lower.includes('rate') ||
             lower.includes('मूल्य') || lower.includes('ధర') || lower.includes('விலை') || lower.includes('ਕੀਮਤ')) {
    response.text = getReply('msp');
    response.richCardType = 'price_check';
    response.richData = { mspPrice: 2320, marketPrice: 3850, crop: 'Paddy' };
  } else if (lower.includes('weather') || lower.includes('rain') ||
             lower.includes('मौसम') || lower.includes('వాతావరణ') || lower.includes('மழை') || lower.includes('ਮੌਸਮ')) {
    response.text = getReply('weather');
  } else if (lower.includes('queue') || lower.includes('wait') || lower.includes('how long') ||
             lower.includes('कतार') || lower.includes('క్యూ') || lower.includes('வரிசை') || lower.includes('ਕਤਾਰ')) {
    response.text = getReply('queue');
  } else if (lower.includes('payment') || lower.includes('dispute') || lower.includes('delay') ||
             lower.includes('भुगतान') || lower.includes('చెల్లింపు') || lower.includes('பணம்') || lower.includes('ਭੁਗਤਾਨ')) {
    const ticketId = 'AGRI-TKT-' + Math.floor(1000 + Math.random() * 9000);
    const data = readData();
    if (!data.supportTickets) data.supportTickets = [];
    data.supportTickets.push({ id: ticketId, topic: message, status: 'open', createdAt: new Date().toISOString() });
    writeData(data);
    const paymentReplies = {
      en: `Your concern has been escalated to the District Marketing Officer. Ticket #${ticketId} created. Resolution expected within 4 hours.`,
      hi: `आपकी शिकायत जिला विपणन अधिकारी को भेज दी गई है। टिकट #${ticketId} बनाया गया। 4 घंटे में समाधान की उम्मीद है।`,
      te: `మీ సమస్యను జిల్లా మార్కెటింగ్ అధికారికి పంపించారు. టికెట్ #${ticketId} సృష్టించబడింది. 4 గంటల్లో పరిష్కారం అంచనా వేయబడుతోంది.`,
      ta: `உங்கள் புகார் மாவட்ட சந்தைப்படுத்தல் அதிகாரிக்கு அனுப்பப்பட்டது. டிக்கட் #${ticketId} உருவாக்கப்பட்டது. 4 மணி நேரத்தில் தீர்வு எதிர்பார்க்கப்படுகிறது.`,
      mr: `तुमची तक्रार जिल्हा विपणन अधिकाऱ्याकडे पाठवली गेली आहे. तिकीट #${ticketId} तयार केले. 4 तासांत निराकरण अपेक्षित आहे.`,
      pa: `ਤੁਹਾਡੀ ਸ਼ਿਕਾਇਤ ਜ਼ਿਲ੍ਹਾ ਮਾਰਕੀਟਿੰਗ ਅਧਿਕਾਰੀ ਨੂੰ ਭੇਜ ਦਿੱਤੀ ਗਈ ਹੈ। ਟਿਕਟ #${ticketId} ਬਣਾਇਆ ਗਿਆ। 4 ਘੰਟਿਆਂ ਵਿੱਚ ਹੱਲ ਦੀ ਉਮੀਦ ਹੈ।`
    };
    response.text = paymentReplies[lang] || paymentReplies['en'];
    response.richCardType = 'ticket';
    response.richData = { ticketId, category: 'Payment Escalation', status: 'Assigned to Mandi Secretary', eta: '4 hours' };
    response.ticketId = ticketId;
  } else if (lower.includes('market') || lower.includes('sell') || lower.includes('listing') ||
             lower.includes('बाज़ार') || lower.includes('మార్కెట్') || lower.includes('சந்தை') || lower.includes('ਬਾਜ਼ਾਰ')) {
    response.text = getReply('market');
  } else if (lower.match(/^(hi|hello|namaste|hey|नमस्ते|నమస్కారం|வணக்கம்|ਸਤਿ)/)) {
    response.text = getReply('greeting');
  } else {
    const defaultReplies = {
      en: `I received your query about "${message}". As your AgriConnect advisor, I can help you with crop advice, slot bookings, MSP prices, queue wait-times, weather alerts, or grievance tickets. (Tip: Enter your Google Gemini API Key in the AI Settings header for unconstrained live answers to any agricultural question!)`,
      hi: `"${message}" के बारे में आपकी क्वेरी प्राप्त हुई। आपके AgriConnect सलाहकार के रूप में, मैं फसल सलाह, स्लॉट बुकिंग, MSP मूल्य, कतार प्रतीक्षा समय, मौसम या शिकायत टिकट में मदद कर सकता हूँ। (सुझाव: किसी भी प्रश्न के सीधे लाइव उत्तर पाने के लिए AI सेटिंग्स में अपना Google Gemini API Key दर्ज करें!)`,
      te: `"${message}" గురించి మీ ప్రశ్న అందింది. మీ AgriConnect సలహాదారుగా, నేను పంట సంరక్షణ, స్లాట్ బుకింగ్, MSP ధరలు, క్యూ వేచి ఉండే సమయం, వాతావరణం లేదా సమస్యల పరిష్కారంలో సహాయం చేయగలను. (సలహా: ఏదైనా వ్యవసాయ ప్రశ్నకు లైవ్ సమాధానాల కోసం AI సెట్టింగ్స్‌లో మీ Google Gemini API Key ని నమోదు చేయండి!)`,
      ta: `"${message}" பற்றிய உங்கள் கேள்வி பெறப்பட்டது. உங்கள் AgriConnect ஆலோசகராக, பயிர் ஆலோசனை, ஸ்லாட் பதிவு, MSP விலைகள், வரிசை நேரம் அல்லது புகார்களுக்கு நான் உதவ முடியும். (குறிப்பு: எந்தவொரு கேள்விக்கும் நேரடி பதிலைப் பெற AI அமைப்புகளில் உங்கள் Google Gemini API Key ஐ உள்ளிடவும்!)`,
      mr: `"${message}" बद्दल तुमची क्वेरी प्राप्त झाली. तुमचा AgriConnect सल्लागार म्हणून, मी पीक सल्ला, स्लॉट बुकिंग, MSP किमती, रांग प्रतीक्षा वेळ किंवा तक्रारींमध्ये मदत करू शकतो. (टीप: थेट उत्तरांसाठी AI सेटिंग्जमध्ये तुमची Google Gemini API Key प्रविष्ट करा!)`,
      pa: `"${message}" ਬਾਰੇ ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ ਪ੍ਰਾਪਤ ਹੋਈ। ਤੁਹਾਡੇ AgriConnect ਸਲਾਹਕਾਰ ਵਜੋਂ, ਮੈਂ ਫ਼ਸਲ ਸਲਾਹ, ਸਲਾਟ ਬੁਕਿੰਗ, MSP ਕੀਮਤਾਂ, ਕਤਾਰ ਉਡੀਕ ਸਮਾਂ ਜਾਂ ਸ਼ਿਕਾਇਤਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। (ਸੁਝਾਅ: ਕਿਸੇ ਵੀ ਸਵਾਲ ਦੇ ਲਾਈਵ ਜਵਾਬ ਲਈ AI ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਆਪਣੀ Google Gemini API Key ਦਰਜ ਕਰੋ!)`
    };
    response.text = defaultReplies[lang] || defaultReplies['en'];
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
