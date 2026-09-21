import React, { useState, useEffect } from 'react';
import { CUSTOM_LOGO_MAP } from './CustomStockLogos';
import { USER_STOCK_LOGOS } from '../data/userStockLogos';

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
  Technology: '#2563EB',
  Healthcare: '#059669',
  Industrials: '#475569',
};

// Exact official corporate brand image files for Ghana Stock Exchange equities
export const GSE_LOGO_FILES: Record<string, string> = {
  SCBPREF: '/stock-logos/SCB.png',
  ASG: '/stock-logos/ASG.png',
  ALLGH: '/stock-logos/ALLGH.png',
  AADS: '/stock-logos/AGA.jpeg',
  RBGH: '/stock-logos/RBGH.png',
  KASA: '/stock-logos/KASA.png',
  MTNGH: '/stock-logos/MTNGH.jpeg',
  GCB: '/stock-logos/GCB.jpeg',
  BOPP: '/stock-logos/BOPP.webp',
  TOTAL: '/stock-logos/TOTAL.svg',
  FML: '/stock-logos/FML.jpeg',
  SCB: '/stock-logos/SCB.png',
  CAL: '/stock-logos/CAL.png',
  EGH: '/stock-logos/EGH.jpeg',
  ETI: '/stock-logos/ETI.jpeg',
  GOIL: '/stock-logos/GOIL.png',
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
  AYRTN: '/stock-logos/AYRTN.png',
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
  SIC: '/stock-logos/SIC.png',
  TLW: '/stock-logos/TLW.png',
  GLD: '/stock-logos/GLD.svg',
  PZC: '/stock-logos/PZC.svg',
  SWL: '/stock-logos/SWL.svg',
  GWEB: '/stock-logos/GWEB.svg',
};

export const StockLogo: React.FC<StockLogoProps> = ({
  ticker,
  name,
  sector = 'Financials',
  size = 40,
  className = '',
}) => {
  const normTicker = (ticker || '').toUpperCase().trim();
  const [imgFailed, setImgFailed] = useState(false);

  // Reset failure state when ticker changes
  useEffect(() => {
    setImgFailed(false);
  }, [normTicker]);

  // 1. Primary: Inlined authentic official brand logo (Guaranteed 100% available without network requests)
  const inlinedLogo = USER_STOCK_LOGOS[normTicker];
  const gseLogoUrl = inlinedLogo || GSE_LOGO_FILES[normTicker];

  if (gseLogoUrl && !imgFailed) {
    return (
      <div
        className={`rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 flex items-center justify-center p-0.5 ${className}`}
        style={{ width: size, height: size }}
        title={`${name || normTicker} (${sector})`}
      >
        <img
          src={gseLogoUrl}
          alt={`${normTicker} logo`}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain rounded-lg"
          loading="eager"
        />
      </div>
    );
  }

  // 2. Secondary: Authentic vector SVG brand logo for US & Global Equities (AAPL, MSFT, NVDA, etc.)
  const CustomLogo = CUSTOM_LOGO_MAP[normTicker];
  if (CustomLogo) {
    return <CustomLogo size={size} className={className} />;
  }

  // 3. Fallback: Styled sector monogram squircle (Zero external favicon scrapers)
  const bgColor = SECTOR_COLORS[sector] || '#1E293B';
  const initials = normTicker ? normTicker.slice(0, 4) : 'GSE';
  const fontSize = Math.max(9, Math.round(size * 0.28));

  return (
    <div
      className={`rounded-xl flex items-center justify-center font-black text-white shadow-sm shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        fontSize,
      }}
      title={`${name || normTicker} (${sector})`}
    >
      {initials}
    </div>
  );
};
