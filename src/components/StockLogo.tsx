import React, { useState, useEffect } from 'react';

interface StockLogoProps {
  ticker: string;
  name?: string;
  sector?: string;
  size?: number;
  className?: string;
}

const SECTOR_COLORS: Record<string, string> = {
  Telecom: '#1565C0',
  Financials: '#1B5E20',
  Agriculture: '#E65100',
  Energy: '#BF360C',
  'Consumer Goods': '#4A148C',
  Mining: '#37474F',
  Insurance: '#006064',
};

// Ghana Stock Exchange actual brand logo mappings (Local High-Resolution Vector SVGs & Images)
export const GSE_LOGO_FILES: Record<string, string> = {
  MTNGH: '/stock-logos/MTNGH.jpeg',
  GCB: '/stock-logos/GCB.jpeg',
  BOPP: '/stock-logos/BOPP.webp',
  TOTAL: '/stock-logos/TOTAL.svg',
  FML: '/stock-logos/FML.jpeg',
  SCB: '/stock-logos/SCB.png',
  CAL: '/stock-logos/CAL.png',
  EGH: '/stock-logos/EGH.jpeg',
  GOIL: '/stock-logos/GOIL.svg',
  UNIL: '/stock-logos/UNIL.jpeg',
  EGL: '/stock-logos/EGL.jpeg',
  GGBL: '/stock-logos/GGBL.png',
  ACCESS: '/stock-logos/ACCESS.jpeg',
  ADB: '/stock-logos/ADB.png',
  AGA: '/stock-logos/AGA.jpeg',
  ALW: '/stock-logos/ALW.png',
  CLYD: '/stock-logos/CLYD.jpeg',
  CMLT: '/stock-logos/CMLT.jpeg',
  CPC: '/stock-logos/CPC.jpeg',
  DASPHARMA: '/stock-logos/DASPHARMA.png',
  DIGICUT: '/stock-logos/DIGICUT.jpeg',
  DGCUT: '/stock-logos/DIGICUT.jpeg',
  FAB: '/stock-logos/FAB.jpeg',
  HORDS: '/stock-logos/HORDS.png',
  IIL: '/stock-logos/IIL.png',
  MAC: '/stock-logos/MAC.png',
  MMH: '/stock-logos/MMH.jpeg',
  PBC: '/stock-logos/PBC.jpeg',
  SAMBA: '/stock-logos/SAMBA.jpeg',
  SOGEGH: '/stock-logos/SOGEGH.png',
  TBL: '/stock-logos/TBL.png',
  ZEN: '/stock-logos/ZEN.png',
  SIC: '/stock-logos/SIC.svg',
  TLW: '/stock-logos/TLW.svg',
  ETI: '/stock-logos/ETI.svg',
  GLD: '/stock-logos/GLD.svg',
  PZC: '/stock-logos/PZC.svg',
  SWL: '/stock-logos/SWL.svg',
  GWEB: '/stock-logos/GWEB.svg',
  AYRTN: '/stock-logos/AYRTN.svg',
};

// Researched official company domains for high-resolution Google/DuckDuckGo favicon fetching
export const COMPANY_DOMAINS: Record<string, string> = {
  // Ghana Stock Exchange Equities
  MTNGH: 'mtn.com.gh',
  GCB: 'gcbbank.com.gh',
  BOPP: 'wilmar-international.com',
  TOTAL: 'totalenergies.com.gh',
  FML: 'danone.com',
  SCB: 'sc.com',
  CAL: 'calbank.net',
  EGH: 'ecobank.com',
  GOIL: 'goil.com.gh',
  UNIL: 'unilever.com',
  EGL: 'myenterprisegroup.io',
  GGBL: 'diageo.com',
  ACCESS: 'ghana.accessbankplc.com',
  ADB: 'agricbank.com',
  AGA: 'anglogoldashanti.com',
  ALW: 'aluworks.com',
  CLYD: 'clydestone.com',
  CMLT: 'camelotgh.com',
  CPC: 'goldentreeghana.com',
  DASPHARMA: 'dannexgh.com',
  DIGICUT: 'digicut.com.gh',
  DGCUT: 'digicut.com.gh',
  FAB: 'firstatlanticbank.com.gh',
  HORDS: 'hordsgh.com',
  IIL: 'intravenousinfusionsplc.com',
  MAC: 'megaafricancapital.com',
  MMH: 'marshalls.edu.gh',
  PBC: 'pbcgh.com',
  SAMBA: 'sambafoodsgh.com',
  SOGEGH: 'societegenerale.com.gh',
  TBL: 'tblgambia.com',
  ZEN: 'zenithbank.com.gh',
  SIC: 'sic-gh.com',
  TLW: 'tullowoil.com',
  ETI: 'ecobank.com',
  GLD: 'absa.africa',
  PZC: 'pzcussons.com',
  SWL: 'samwoode.com',
  GWEB: 'gwebgh.com',
  AYRTN: 'dannexgh.com',

  // Top US & Global Equities
  AAPL: 'apple.com',
  MSFT: 'microsoft.com',
  GOOGL: 'google.com',
  GOOG: 'google.com',
  AMZN: 'amazon.com',
  META: 'meta.com',
  NVDA: 'nvidia.com',
  TSLA: 'tesla.com',
  JPM: 'jpmorganchase.com',
  BAC: 'bankofamerica.com',
  V: 'visa.com',
  MA: 'mastercard.com',
  WMT: 'walmart.com',
  JNJ: 'jnj.com',
  PG: 'pg.com',
  UNH: 'unitedhealthgroup.com',
  XOM: 'exxonmobil.com',
  CVX: 'chevron.com',
  ABBV: 'abbvie.com',
  LLY: 'lilly.com',
  MRK: 'merck.com',
  HD: 'homedepot.com',
  DIS: 'thewaltdisneycompany.com',
  NFLX: 'netflix.com',
  AMD: 'amd.com',
  INTC: 'intel.com',
  BABA: 'alibabagroup.com',
  NKE: 'nike.com',
  KO: 'coca-colacompany.com',
  PEP: 'pepsico.com',
  COST: 'costco.com',
  CRM: 'salesforce.com',
  ORCL: 'oracle.com',
  IBM: 'ibm.com',
  PYPL: 'paypal.com',
  UBER: 'uber.com',
  ABNB: 'airbnb.com',
  SPOT: 'spotify.com',
  ADBE: 'adobe.com',
  CSCO: 'cisco.com',
  QCOM: 'qualcomm.com',
  TXN: 'ti.com',
  AVGO: 'broadcom.com',
  SBUX: 'starbucks.com',
  MCD: 'mcdonalds.com',
  GS: 'goldmansachs.com',
  MS: 'morganstanley.com',
};

export const StockLogo: React.FC<StockLogoProps> = ({
  ticker,
  name,
  sector = 'Financials',
  size = 40,
  className = '',
}) => {
  const normTicker = (ticker || '').toUpperCase().trim();
  const [failStep, setFailStep] = useState<number>(0);

  // Reset failure state if ticker changes
  useEffect(() => {
    setFailStep(0);
  }, [normTicker]);

  const gseLogoUrl = GSE_LOGO_FILES[normTicker];
  const domain = COMPANY_DOMAINS[normTicker] || `${normTicker.toLowerCase()}.com`;

  // Candidate sources in order of preference
  const candidateSources: string[] = [];
  if (gseLogoUrl) {
    candidateSources.push(gseLogoUrl);
  }
  candidateSources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
  candidateSources.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
  candidateSources.push(`https://logo.clearbit.com/${domain}`);

  const currentSrc = candidateSources[failStep];

  // If all image sources failed, show custom SVG from CustomStockLogos or styled monogram squircle
  if (!currentSrc || failStep >= candidateSources.length) {


    const bgColor = SECTOR_COLORS[sector] || '#334155';
    const initials = normTicker ? normTicker.slice(0, 4) : 'GSE';

    return (
      <div
        className={`rounded-xl flex items-center justify-center font-black text-white shadow-sm shrink-0 select-none ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: bgColor,
          fontSize: Math.max(9, Math.round(size * 0.28)),
        }}
        title={`${name || normTicker} (${sector})`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 flex items-center justify-center p-0.5 ${className}`}
      style={{ width: size, height: size }}
      title={`${name || normTicker} (${sector})`}
    >
      <img
        src={currentSrc}
        alt={`${normTicker} logo`}
        onError={() => setFailStep((prev) => prev + 1)}
        className="w-full h-full object-contain rounded-lg"
        loading="lazy"
      />
    </div>
  );
};
