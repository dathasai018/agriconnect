# 🌾 AgriConnect — Smart Agricultural Procurement & Marketplace Platform

**AgriConnect** is an ultra-modern, production-grade full-stack web application designed to solve long farmer waiting times, lack of procurement visibility, and payment uncertainty at government procurement centres (APMCs / Mandis) across India.

---

## 🎨 Design System (Strict Light Theme)

- **Primary Text / Dark Headings**: `#212121`
- **Secondary Text / Dark Elements**: `#323232`
- **Primary Brand / Action Accent**: `#0D7377`
- **Secondary Accent / Live Glow**: `#14FFEC`
- **Base Background**: `#FAFAFA` / `#FFFFFF` (Airy, clean, 100% light theme SaaS layout)
- **Rounded Corners**: 12–20px rounded geometry, soft shadow cards, glassmorphism overlays
- **Icons**: Consistent `lucide-react` stroke set
- **Visuals**: Framer Motion transitions, live Recharts data visualizations

---

## 🚀 Key Features by User Role

### 1. Farmer — Interface 1: Government Procurement (Mandi Operations)
- **Nearby Centre Locator**: Uses the real **Haversine formula** to compute distances from the farmer's GPS coordinates to government procurement centres in the database.
- **Smart Slot Booking & Timetable**: Interactive multi-bay timetable with real-time congestion forecasting and instant booking confirmation.
- **Missed Slot Auto-Reallocation**: Automated grace period timer logic and background reassignment to open slot windows upon missed arrivals.
- **Live Queue & Token Status**: Real-time position tracking (`waiting` → `in-progress` → `completed`) with bay assignment and live estimated wait time countdown.
- **Truck / RFID Gate Flow Tracker**: Monitoring of vehicles at the gate, weighbridge, and unloading bays with average turnaround duration metrics.
- **MSP Comparison Dashboard**: Interactive Recharts bar/line charts comparing historical MSP figures (2021–2025) with year-over-year gains across 6 essential crops.
- **Weather Advisory & Rain Warning Alerts**: Multi-day forecast with humidity, wind speed, and threshold-based rain warnings to protect harvested produce.

### 2. Farmer — Interface 2: Open Marketplace
- **My Produce Listings**: Real-time CRUD manager to create, view, edit, and mark harvest lots as sold.
- **AI Price Recommendation Panel**: Dynamically calculates optimal farm-gate prices based on current government MSP plus current wholesale market premiums.
- **Harvest Advisory & Quality Grading**: Standardized guidelines for moisture content (<14%) and bonus grade assignment.

### 3. Customer / Bulk Buyer
- **Direct Farm Gate Marketplace**: Filterable catalog by crop variety, price range, quality grade, and origin state.
- **Direct Farmer Connect**: Modal revealing verified farmer contact information, phone numbers, and lot logistics.

### 4. Centre Admin (Mandi Secretary)
- **Live Queue Management**: Real-time status advancement (`waiting` → `in-progress` → `completed` → `no-show`) pushing live updates to farmers.
- **RFID Gate & Truck Monitor**: Instant entry/exit logger tracking active trucks on-site and turnaround times.
- **PFMS & DBT Payment Settlement**: Direct Benefit Transfer dashboard to update produce moisture, quality grades, generate PFMS invoices, and issue bank UTR transaction numbers.
- **Operational KPI Cards**: Real-time aggregation of today's bookings, trucks on-site, average turnaround time, and total procurement disbursed.

### 5. Multilingual Support
- Built-in `i18next` engine supporting **6 Indian languages**:
  - 🇬🇧 English (`en`)
  - 🇮🇳 Hindi (`hi`)
  - 🇮🇳 Telugu (`te`)
  - 🇮🇳 Tamil (`ta`)
  - 🇮🇳 Marathi (`mr`)
  - 🇮🇳 Punjabi (`pa`)
- Seamless language switcher in the navigation bar with instant UI localization.

### 6. Gemini AI Assistant (Voice + Text + Escalation)
- Multilingual conversational assistant with Web Speech API voice dictation.
- Contextual recommendations for slot selection, market price arbitrage, and weather warnings.
- **Automated Grievance Escalation**: Detects payment or operational disputes and automatically registers official support tickets with assigned escalation IDs.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React, i18next
- **Backend**: Node.js, Express, WebSocket (`ws`) layer for real-time broadcasts, JWT authentication
- **Storage / Database**: JSON-based persistent datastore (`server/data.json`) structured for PostgreSQL / Prisma swapping
- **Service Layer**: Clean architecture with simulated service providers for:
  - Mobile OTP & SMS Gateways (Dev mode OTP: `123456`)
  - UIDAI Aadhaar eKYC Verification
  - OpenWeatherMap API
  - Vertex AI Queue Forecasting & Predictive Pricing

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Backend Server Setup
Open a terminal and run:
```bash
cd server
npm install
npm start
```
The backend server will start on `http://localhost:5000` with WebSocket support on `ws://localhost:5000`.

### 3. Frontend Application Setup
In a separate terminal, run:
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Demo Accounts & Credentials
The platform includes pre-seeded demo accounts with instant one-click login in the **Sign In** modal:

| Role | Name | Phone Number | Dev OTP |
| :--- | :--- | :--- | :--- |
| **Farmer** | Rameshwar Patel | `9848023456` | `123456` |
| **Buyer / Customer** | Rajesh Agarwal | `9911223344` | `123456` |
| **Centre Admin** | Narender Kumar | `8702421102` | `123456` |

*Tip: You can also use the top **Demo Mode Quick Navigation Bar** to switch between roles with a single click.*

---

## 🔌 External Integrations & Service Swapping

All third-party services are isolated in clean interface layers in the backend:
- **SMS Gateway**: Configurable in `server/index.js` (swappable for Twilio / MSG91).
- **Aadhaar eKYC**: Isolated behind `/api/auth/verify-aadhaar` (swappable for UIDAI eKYC API).
- **Weather Provider**: Configurable with `OPENWEATHER_API_KEY` in environment variables.
- **AI Intelligence**: Configurable with `GEMINI_API_KEY` for live Google Gemini LLM responses.

---

## 📁 Project Structure

```
agriconnect/
├── server/                    # Node.js + Express + WebSocket backend
│   ├── index.js               # REST API & WebSocket server implementation
│   ├── data.json              # Seed database (Centres, Slots, Queue, Trucks, MSP)
│   └── package.json           # Backend dependencies
├── src/
│   ├── api/                   # Typed API client & JWT token management
│   ├── components/            # React UI components
│   │   ├── admin/             # Centre Admin dashboard, Queue & RFID monitoring
│   │   ├── customer/          # Customer marketplace catalog & contact modal
│   │   ├── farmer/            # Farmer Govt Procurement & Open Market views
│   │   ├── shared/            # Gemini AI assistant & Toast notifications
│   │   ├── AuthModal.tsx      # Multi-step phone, OTP & Aadhaar modal
│   │   └── Navbar.tsx         # Responsive navbar with language switcher
│   ├── context/               # AgriStoreContext & LanguageContext
│   ├── hooks/                 # useSocket WebSocket real-time hook
│   ├── i18n/                  # i18next configuration & language translation files
│   ├── types/                 # TypeScript entity definitions
│   ├── App.tsx                # Role-based root application router
│   └── main.tsx               # Vite entry point
├── tailwind.config.js         # Strict light theme design tokens
└── package.json               # Frontend dependencies & build scripts
```
