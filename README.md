# Apex Equities 🇬🇭 📈

> **Next-Generation Ghana Stock Exchange (GSE) & Global Equities Intelligence Platform**

[![Live on Vercel](https://img.shields.io/badge/Vercel-Live%20Deployment-black?style=flat&logo=vercel)](https://apex-equities.vercel.app/)
[![Vite 6](https://img.shields.io/badge/Vite-6.2.3-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.14-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

**Apex Equities** is an institutional-grade financial analytics and market intelligence web application designed for investors in the Ghana Stock Exchange (GSE) and major global equity markets (NYSE, NASDAQ). It provides real-time and resilient market quotes, deterministic 5-factor valuation models, curated market news, interactive portfolio tracking, an AI financial analyst, and a financial jargon translator.

---

## 🚀 Live Demo

- **Production URL:** [https://apex-equities.vercel.app/](https://apex-equities.vercel.app/)
- **Live Bundle:** `assets/index-BDLgahgk.js`

---

## ✨ Key Features

### 1. 📊 GSE Floor Quotes & Ticker Catalog
- **Comprehensive Coverage:** Tracks all actively traded equities on the Ghana Stock Exchange, including large-cap blue chips (`MTNGH`, `GCB`, `SCB`, `EGH`, `TOTAL`, `GOIL`, `BOPP`), mining and energy giants (`AGA`, `AADS`, `TLW`, `ASG`, `ALLGH`), manufacturing & consumer goods (`UNIL`, `FML`, `GGBL`, `KASA`, `CPC`, `PBC`), insurance & finance (`SIC`, `EGL`, `RBGH`, `ACCESS`, `ADB`, `CAL`, `ETI`, `SOGEGH`), ETFs (`GLD`), and preference shares (`SCBPREF`).
- **3-Tier Live Data Pipeline:**
  - **Tier 1:** Direct live floor quotes and trade volumes from `dev.kwayisi.org/apis/gse/live`.
  - **Tier 2:** Secondary summary and search aggregation from `api.ghana-api.dev/api/v1/stock-market`.
  - **Tier 3:** Deterministic real-world fallback dataset reconstructed from official GSE Daily Official Lists (DOL) when the exchange is closed or upstream endpoints experience network timeouts.

### 2. 🛡️ 100% Inlined Authentic Corporate Brand Assets
- Every single listed company features its authentic, high-resolution corporate logo (Kasapreko, SIC Insurance, GOIL, Republic Bank, AngloGold Ashanti, Atlantic Lithium, Asante Gold, Standard Chartered, Tullow Oil, Absa NewGold, MTN, GCB, etc.).
- Logos are inlined as Base64 Data URIs directly within the application bundle (`src/data/userStockLogos.ts`), eliminating 404 errors, network latency, and SPA asset routing issues during production minification.

### 3. 🌐 Global & US Equities Explorer
- Real-world institutional market data for top US and international equities (`AAPL`, `MSFT`, `NVDA`, `AMZN`, `GOOGL`, `META`, `TSLA`, `BRK.B`, `JPM`, `V`, etc.).
- Allows Ghanaian and diaspora investors to benchmark local equity performance against international markets.

### 4. ❄️ Snowflake 5-Factor Valuation Model
- Deterministic 5-factor stock health engine assessing:
  - **Value:** P/E ratio, P/B ratio, and 52-week price position.
  - **Future:** Sector growth outlook and earnings trajectory.
  - **Past:** Multi-year track record and historical returns.
  - **Health:** Debt-to-equity ratio, current ratio, and balance sheet strength.
  - **Dividend:** Dividend yield, payout stability, and historical distribution.

### 5. 💼 Interactive Portfolio Tracker
- Real-time portfolio valuation with zero-balance detection (shows GHS 0.00 when empty without synthetic chart inflation).
- Holding-level P&L tracking, asset allocation breakdown, and transaction logging.

### 6. 🤖 AI Market Analyst & Jargon Buster
- Context-aware financial assistant powered by Google Gemini AI.
- Instant financial jargon translator explaining complex terms (e.g., EPS, P/E, Depository Shares, Dividend Yield, Capital Gains Tax) in plain English and Ghanaian market context.

### 7. 📰 Curated Market News & Announcements
- Contextually accurate, up-to-date market news covering SEC Ghana approvals, IPOs (e.g., Atlantic Lithium), dividend declarations, earnings releases, and commodity price trends.

---

## 🛠️ Architecture & Tech Stack

```
apex-equities/
├── public/                 # Static assets & stock logo master files
│   └── stock-logos/        # Official PNG/JPEG/SVG corporate brand assets
├── src/
│   ├── components/         # Reusable UI & financial visualization components
│   │   ├── StockLogo.tsx   # Primary brand logo renderer (inlined Data URI first)
│   │   ├── StockCard.tsx   # Equities display card with sparkline
│   │   └── ...
│   ├── data/               # Grounded market datasets & inlined logos
│   │   ├── userStockLogos.ts # 100% inlined Base64 corporate logos dictionary
│   │   ├── stocksData.ts   # GSE floor equities & deterministic price history
│   │   ├── usMarketData.ts # Authentic US/Global equities dataset
│   │   ├── newsData.ts     # Curated GSE market news
│   │   └── stockIntelligence.ts # Snowflake 5-factor scoring engine
│   ├── services/
│   │   └── ghanaStockApi.ts # 3-Tier resilient GSE API service
│   ├── types.ts            # TypeScript data contracts & schemas
│   ├── App.tsx             # Root application with responsive navigation & search
│   └── index.css           # Modern design system & Tailwind v4 styling
├── android/                # Native Android wrapper project for APK deployment
├── package.json
└── vite.config.ts
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18.0 or higher)
- npm or bun

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-repo/apex-equities.git
cd apex-equities

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY if using AI Chat features

# 4. Start local development server
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## 📦 Production Build & Deployment

### Build Command
```bash
npm run build
```
Generates production-optimized static files in `dist/`.

### Deploying to Vercel
1. Connect the GitHub repository to [Vercel](https://vercel.com).
2. Set Build Command: `vite build` (or `npm run build`).
3. Set Output Directory: `dist`.
4. Deploy. Live updates are pushed automatically on every commit to `main`.

---

## ⚖️ Financial & Data Disclaimer

*Apex Equities is an independent financial analytics, market intelligence, and portfolio tracking platform. Quotes displayed may be delayed in accordance with exchange regulations. The platform does not provide licensed investment advice, nor does it act as an SEC-licensed broker-dealer. Users are advised to consult a licensed broker or investment advisor prior to executing financial trades.*

---

## 📄 License
Private & Proprietary. All corporate logos and trademarks are the property of their respective company owners.


---

## 📱 Google Play Store Submission Package

The repository includes a ready-to-publish Google Play Store submission package in [`playstore/`](playstore):
- **[`playstore/STORE_LISTING.md`](playstore/STORE_LISTING.md):** Formatted Short & Full store descriptions, tags, category, and declarations.
- **[`playstore/RELEASE_NOTES.md`](playstore/RELEASE_NOTES.md):** Version 1.0.0 release notes for Google Play Console.
- **[`playstore/GRAPHIC_ASSETS_GUIDE.md`](playstore/GRAPHIC_ASSETS_GUIDE.md):** Exact specifications for App Icon (512x512), Feature Graphic (1024x500), and store screenshots.
- **[`docs/PLAYSTORE_SUBMISSION_GUIDE.md`](docs/PLAYSTORE_SUBMISSION_GUIDE.md):** Step-by-step submission walkthrough for Google Play Console.
