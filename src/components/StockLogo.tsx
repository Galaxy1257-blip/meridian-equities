import React from 'react';
import { CUSTOM_LOGO_MAP } from './CustomStockLogos';

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

// Backwards-compatible logo files map pointing to authentic vector SVGs
export const GSE_LOGO_FILES: Record<string, string> = {
  MTNGH: '/stock-logos/MTNGH.svg',
  GCB: '/stock-logos/GCB.svg',
  BOPP: '/stock-logos/BOPP.svg',
  TOTAL: '/stock-logos/TOTAL.svg',
  FML: '/stock-logos/FML.svg',
  SCB: '/stock-logos/SCB.svg',
  CAL: '/stock-logos/CAL.svg',
  EGH: '/stock-logos/EGH.svg',
  GOIL: '/stock-logos/GOIL.svg',
  UNIL: '/stock-logos/UNIL.svg',
  EGL: '/stock-logos/EGL.svg',
  GGBL: '/stock-logos/GGBL.svg',
  ACCESS: '/stock-logos/ACCESS.svg',
  ADB: '/stock-logos/ADB.svg',
  AGA: '/stock-logos/AGA.svg',
  ALW: '/stock-logos/ALW.svg',
  CLYD: '/stock-logos/CLYD.svg',
  CMLT: '/stock-logos/CMLT.svg',
  CPC: '/stock-logos/CPC.svg',
  DASPHARMA: '/stock-logos/DASPHARMA.svg',
  DIGICUT: '/stock-logos/DIGICUT.svg',
  DGCUT: '/stock-logos/DGCUT.svg',
  FAB: '/stock-logos/FAB.svg',
  HORDS: '/stock-logos/HORDS.svg',
  IIL: '/stock-logos/IIL.svg',
  MAC: '/stock-logos/MAC.svg',
  MMH: '/stock-logos/MMH.svg',
  PBC: '/stock-logos/PBC.svg',
  SAMBA: '/stock-logos/SAMBA.svg',
  SOGEGH: '/stock-logos/SOGEGH.svg',
  TBL: '/stock-logos/TBL.svg',
  ZEN: '/stock-logos/ZEN.svg',
  SIC: '/stock-logos/SIC.svg',
  TLW: '/stock-logos/TLW.svg',
  ETI: '/stock-logos/ETI.svg',
  GLD: '/stock-logos/GLD.svg',
  PZC: '/stock-logos/PZC.svg',
  SWL: '/stock-logos/SWL.svg',
  GWEB: '/stock-logos/GWEB.svg',
  AYRTN: '/stock-logos/AYRTN.svg',
};

export const StockLogo: React.FC<StockLogoProps> = ({
  ticker,
  name,
  sector = 'Financials',
  size = 40,
  className = '',
}) => {
  const normTicker = (ticker || '').toUpperCase().trim();

  // 1. Direct authentic vector brand SVG component (Immediate rendering, zero scrapers, zero mockups)
  const CustomLogo = CUSTOM_LOGO_MAP[normTicker];
  if (CustomLogo) {
    return <CustomLogo size={size} className={className} />;
  }

  // 2. High-aesthetic sector monogram squircle fallback for any custom or unlisted equity
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
