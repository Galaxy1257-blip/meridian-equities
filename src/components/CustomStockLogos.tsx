import React from "react";

// ─── Sector Colors ────────────────────────────────────────────────────────────
const SECTOR_COLORS: Record<string, string> = {
  Telecom: "#1565C0",
  Financials: "#1B5E20",
  Agriculture: "#E65100",
  Energy: "#BF360C",
  "Consumer Goods": "#4A148C",
  Mining: "#37474F",
  Insurance: "#006064",
};

// ─── Shared Logo Builder ──────────────────────────────────────────────────────
interface LogoProps {
  size?: number;
  className?: string;
}

function buildLogo(ticker: string, sector: string): React.FC<LogoProps> {
  const bg = SECTOR_COLORS[sector] ?? "#333333";
  const gradId = `grad-${ticker.toLowerCase()}`;

  const Logo: React.FC<LogoProps> = ({ size = 40, className }) => {
    const fontSize = size * 0.28;
    const rx = size * 0.25; // squircle corner radius proportional to size

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label={`${ticker} logo`}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* Background squircle */}
        <rect x="0" y="0" width="40" height="40" rx={rx} ry={rx} fill={bg} />

        {/* Subtle gradient overlay */}
        <rect
          x="0"
          y="0"
          width="40"
          height="40"
          rx={rx}
          ry={rx}
          fill={`url(#${gradId})`}
        />

        {/* Ticker text */}
        <text
          x="20"
          y="20"
          dominantBaseline="central"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
          fontSize={fontSize}
          fontWeight="900"
          letterSpacing="-0.5"
        >
          {ticker}
        </text>
      </svg>
    );
  };

  Logo.displayName = `${ticker}Logo`;
  return Logo;
}

// ─── 21 Named Exports ─────────────────────────────────────────────────────────

/** First Atlantic Bank — Financials */
export const FABLogo = buildLogo("FAB", "Financials");

/** MTN Ghana — Telecom */
export const MTNGHLogo = buildLogo("MTNGH", "Telecom");

/** Fan Milk — Consumer Goods */
export const FMLLogo = buildLogo("FML", "Consumer Goods");

/** GCB Bank — Financials */
export const GCBLogo = buildLogo("GCB", "Financials");

/** Societe Generale — Financials */
export const SOGEGHLogo = buildLogo("SOGEGH", "Financials");

/** Tropical Bank — Financials */
export const TBLLogo = buildLogo("TBL", "Financials");

/** Aluworks — Mining */
export const ALWLogo = buildLogo("ALW", "Mining");

/** Benso Oil Palm — Agriculture */
export const BOPPLogo = buildLogo("BOPP", "Agriculture");

/** Guinness Ghana — Consumer Goods */
export const GGBLLogo = buildLogo("GGBL", "Consumer Goods");

/** Zenith Bank — Financials */
export const ZENLogo = buildLogo("ZEN", "Financials");

/** Produce Buying Co — Agriculture */
export const PBCLogo = buildLogo("PBC", "Agriculture");

/** Camelot Ghana — Consumer Goods */
export const CPCLogo = buildLogo("CPC", "Consumer Goods");

/** Samba Foods — Consumer Goods */
export const SAMBALogo = buildLogo("SAMBA", "Consumer Goods");

/** Unilever Ghana — Consumer Goods */
export const UNILLogo = buildLogo("UNIL", "Consumer Goods");

/** Das Pharma — Consumer Goods */
export const DASPHARMALogo = buildLogo("DASPH", "Consumer Goods");

/** Clydestone Ghana — Telecom */
export const CLYDLogo = buildLogo("CLYD", "Telecom");

/** Intravenous Infusions — Consumer Goods */
export const IILLogo = buildLogo("IIL", "Consumer Goods");

/** CML — Telecom */
export const CMLTLogo = buildLogo("CMLT", "Telecom");

/** DigiCut — Telecom */
export const DIGICUTLogo = buildLogo("DGCUT", "Telecom");

/** Sam Wood — Agriculture */
export const SWLLogo = buildLogo("SWL", "Agriculture");

/** Mega African Capital — Financials */
export const MMHLogo = buildLogo("MMH", "Financials");

// ─── Export Map ───────────────────────────────────────────────────────────────

export const CUSTOM_LOGO_MAP: Record<string, React.FC<LogoProps>> = {
  FAB: FABLogo,
  MTNGH: MTNGHLogo,
  FML: FMLLogo,
  GCB: GCBLogo,
  SOGEGH: SOGEGHLogo,
  TBL: TBLLogo,
  ALW: ALWLogo,
  BOPP: BOPPLogo,
  GGBL: GGBLLogo,
  ZEN: ZENLogo,
  PBC: PBCLogo,
  CPC: CPCLogo,
  SAMBA: SAMBALogo,
  UNIL: UNILLogo,
  DASPHARMA: DASPHARMALogo,
  CLYD: CLYDLogo,
  IIL: IILLogo,
  CMLT: CMLTLogo,
  DIGICUT: DIGICUTLogo,
  SWL: SWLLogo,
  MMH: MMHLogo,
};
