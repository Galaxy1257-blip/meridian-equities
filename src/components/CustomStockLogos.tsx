import React from 'react';

export interface LogoProps {
  size?: number;
  className?: string;
}

// Helper for squircle corner radius
const getRx = (size: number) => Math.round(size * 0.25);

// ─── GSE EQUITIES (GHANA STOCK EXCHANGE) ────────────────────────────────────────

export const MTNGHLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="MTN Ghana logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFCC00" />
    <ellipse cx="50" cy="50" rx="38" ry="24" fill="none" stroke="#000000" strokeWidth="5.5" />
    <text x="50" y="58" textAnchor="middle" fontFamily="'Arial Black', Impact, sans-serif" fontWeight="900" fontSize="22" fill="#000000" letterSpacing="-1">MTN</text>
  </svg>
);

export const GCBLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="GCB Bank logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#002D62" />
    <path d="M50 22 C56 26, 68 22, 78 30 C70 34, 62 34, 56 36 C66 38, 74 44, 80 52 C70 50, 60 48, 52 50 C44 48, 34 50, 24 52 C30 44, 38 38, 48 36 C42 34, 34 34, 26 30 C36 22, 48 26, 50 22 Z" fill="#F5A623" />
    <text x="50" y="74" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="20" fill="#F5A623" letterSpacing="1">GCB</text>
    <text x="50" y="86" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="7" fill="#FFFFFF" letterSpacing="1.5">BANK PLC</text>
  </svg>
);

export const BOPPLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="BOPP logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#007A3D" />
    <circle cx="50" cy="50" r="38" fill="#006332" stroke="#48BB78" strokeWidth="2" />
    <path d="M50 22 C50 22, 58 35, 74 38 C64 42, 56 40, 50 44 C50 44, 58 52, 72 58 C60 58, 54 54, 50 56 V72 H46 V56 C42 54, 36 58, 24 58 C38 52, 46 44, 46 44 C40 40, 32 42, 22 38 C38 35, 46 22, 50 22 Z" fill="#F6AD55" />
    <circle cx="50" cy="52" r="5" fill="#DD6B20" />
    <text x="50" y="84" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="1">BOPP</text>
  </svg>
);

export const CALLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="CalBank logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#0B1B3D" />
    <path d="M30 32 L46 48 L30 64 L38 64 L54 48 L38 32 Z" fill="#F37021" />
    <path d="M46 32 L62 48 L46 64 L54 64 L70 48 L54 32 Z" fill="#FFFFFF" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="15" fill="#FFFFFF" letterSpacing="0.5">CalBank</text>
  </svg>
);

export const EGHLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Ecobank Ghana logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#005B60" />
    <circle cx="50" cy="46" r="32" fill="#00474B" />
    <path d="M32 42 C36 30, 50 28, 64 30 C58 35, 50 38, 42 40 C56 40, 68 44, 74 50 C64 50, 52 48, 40 50 C52 54, 62 60, 66 68 C52 64, 40 58, 32 48 Z" fill="#00A3E0" />
    <path d="M30 39 C35 28, 48 24, 61 26 C55 31, 46 34, 38 36 C51 36, 63 40, 69 46 C59 46, 48 44, 36 46 C47 50, 57 56, 61 64 C47 60, 36 54, 30 39 Z" fill="#FFFFFF" />
    <text x="50" y="78" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="12" fill="#FFFFFF" letterSpacing="1">ECOBANK</text>
    <text x="50" y="88" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="6" fill="#00D2D3" letterSpacing="1">GHANA PLC</text>
  </svg>
);

export const ETILogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Ecobank Transnational logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#005B60" />
    <circle cx="50" cy="50" r="38" fill="#00474B" />
    <path d="M30 45 C35 32, 50 30, 65 32 C58 37, 50 40, 42 42 C56 42, 68 46, 75 52 C65 52, 52 50, 40 52 C52 56, 62 62, 66 70 C52 66, 40 60, 32 50 Z" fill="#00A3E0" />
    <path d="M28 42 C34 30, 48 26, 62 28 C56 33, 46 36, 38 38 C52 38, 64 42, 70 48 C60 48, 48 46, 36 48 C48 52, 58 58, 62 66 C48 62, 36 56, 28 42 Z" fill="#FFFFFF" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="11" fill="#FFFFFF" letterSpacing="1.5">ECOBANK</text>
    <text x="50" y="91" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="7" fill="#00D2D3" letterSpacing="1">ETI GROUP</text>
  </svg>
);

export const UNILLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Unilever Ghana logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <path d="M32 25 C32 48, 36 68, 50 68 C64 68, 68 48, 68 25 C64 25, 62 30, 62 42 C62 58, 58 62, 50 62 C42 62, 38 58, 38 42 C38 30, 36 25, 32 25 Z" fill="#1F36C7" />
    <circle cx="35" cy="30" r="3" fill="#1F36C7" />
    <circle cx="65" cy="30" r="3" fill="#1F36C7" />
    <circle cx="50" cy="38" r="2.5" fill="#1F36C7" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="12" fill="#1F36C7" letterSpacing="0.5">Unilever</text>
  </svg>
);

export const FMLLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Fan Milk logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <path d="M20 48 C30 35, 50 35, 60 48 C70 60, 80 50, 80 50 C80 50, 70 68, 55 64 C40 60, 30 70, 20 48 Z" fill="#ED1C24" />
    <path d="M22 42 C32 30, 52 30, 62 42 C72 54, 82 45, 82 45 C82 45, 72 60, 57 56 C42 52, 32 62, 22 42 Z" fill="#003399" />
    <text x="50" y="78" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="14" fill="#003399" letterSpacing="-0.5">FanMilk</text>
  </svg>
);

export const EGLLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Enterprise Group logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#003366" />
    <polygon points="50,22 72,44 50,66 28,44" fill="none" stroke="#D4AF37" strokeWidth="4" />
    <polygon points="50,28 66,44 50,60 34,44" fill="#D4AF37" opacity="0.3" />
    <circle cx="50" cy="44" r="5" fill="#D4AF37" />
    <text x="50" y="80" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="11" fill="#FFFFFF" letterSpacing="1">ENTERPRISE</text>
    <text x="50" y="88" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="6" fill="#D4AF37" letterSpacing="1">GROUP PLC</text>
  </svg>
);

export const GGBLLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Guinness Ghana logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#121212" />
    <path d="M42 24 C46 22, 58 24, 62 30 C58 32, 54 36, 52 42 C58 40, 64 42, 66 48 C62 48, 56 48, 52 54 C58 54, 62 58, 62 64 C56 62, 50 62, 46 68 L42 68 C40 60, 38 40, 42 24 Z" fill="#C5A059" />
    <line x1="44" y1="30" x2="56" y2="30" stroke="#C5A059" strokeWidth="1.5" />
    <line x1="43" y1="40" x2="53" y2="40" stroke="#C5A059" strokeWidth="1.5" />
    <line x1="43" y1="50" x2="52" y2="50" stroke="#C5A059" strokeWidth="1.5" />
    <line x1="43" y1="60" x2="48" y2="60" stroke="#C5A059" strokeWidth="1.5" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', serif" fontWeight="900" fontSize="13" fill="#C5A059" letterSpacing="2">GUINNESS</text>
  </svg>
);

export const TOTALLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="TotalEnergies logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <path d="M22 65 C22 45, 38 30, 60 30 C72 30, 80 36, 84 45 C78 38, 68 35, 58 35 C42 35, 30 48, 30 65 Z" fill="#EE3124" />
    <path d="M35 72 C45 82, 60 82, 70 75 C78 69, 82 58, 80 48 C78 58, 72 65, 65 70 C57 75, 45 74, 38 68 Z" fill="#0066B2" />
    <path d="M48 45 C54 40, 64 42, 68 48 C72 54, 70 64, 62 68 C56 71, 48 68, 45 62 C48 64, 54 65, 58 62 C63 59, 64 53, 61 49 C58 46, 52 45, 48 45 Z" fill="#F8A51D" />
  </svg>
);

export const GOILLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="GOIL logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <circle cx="50" cy="50" r="38" fill="#FFCC00" stroke="#006633" strokeWidth="4" />
    <circle cx="50" cy="50" r="26" fill="#006633" />
    <text x="50" y="58" textAnchor="middle" fontFamily="'Arial Black', Impact, sans-serif" fontWeight="900" fontSize="22" fill="#FFFFFF" letterSpacing="-1">GOIL</text>
  </svg>
);

export const SCBLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Standard Chartered logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <g transform="translate(15, 15) scale(0.7)">
      <path d="M20 50 C20 30, 35 20, 50 20 C65 20, 80 32, 80 48 C80 62, 68 70, 50 70 C35 70, 20 80, 20 90 C20 100, 32 108, 48 108" fill="none" stroke="#009944" strokeWidth="12" strokeLinecap="round" />
      <path d="M80 50 C80 70, 65 80, 50 80 C35 80, 20 68, 20 52 C20 38, 32 30, 50 30 C65 30, 80 20, 80 10 C80 0, 68 -8, 52 -8" fill="none" stroke="#0077C8" strokeWidth="12" strokeLinecap="round" />
    </g>
  </svg>
);

export const SICLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="SIC Insurance logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#005A36" />
    <circle cx="50" cy="50" r="38" fill="#004D2E" stroke="#D4AF37" strokeWidth="3.5" />
    <path d="M50 20 L72 32 V52 C72 66, 62 76, 50 80 C38 76, 28 66, 28 52 V32 Z" fill="#006837" stroke="#FDB913" strokeWidth="2.5" />
    <text x="50" y="55" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="18" fill="#FFFFFF" letterSpacing="1">SIC</text>
    <text x="50" y="66" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="7" fill="#FDB913" letterSpacing="0.5">INSURANCE</text>
  </svg>
);

export const TLWLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Tullow Oil logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#0A1833" />
    <path d="M40 22 C40 22, 62 38, 54 56 C49 68, 36 62, 36 50 C36 40, 48 30, 40 22 Z" fill="#E30613" />
    <path d="M60 30 C60 30, 76 44, 68 62 C63 72, 52 68, 52 56 C52 46, 64 38, 60 30 Z" fill="#F39200" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF" letterSpacing="1">TULLOW</text>
  </svg>
);

export const GLDLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="NewGold ETF logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#1C1808" />
    <circle cx="50" cy="50" r="38" fill="#AA7C11" stroke="#FFE87C" strokeWidth="2.5" />
    <polygon points="32,45 68,45 74,62 26,62" fill="#FFE87C" stroke="#AA7C11" strokeWidth="1.5" />
    <text x="50" y="55" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="8" fill="#422E00">999.9 GOLD</text>
    <text x="50" y="80" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#FFE87C" letterSpacing="1">GLD</text>
  </svg>
);

export const ACCESSLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Access Bank logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#001233" />
    <path d="M26 38 L42 24 L52 32 L42 42 Z" fill="#FF6600" />
    <path d="M44 54 L58 42 L68 50 L58 60 Z" fill="#0055FF" />
    <path d="M58 38 L72 26 L80 34 L70 42 Z" fill="#FF6600" />
    <text x="50" y="80" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF" letterSpacing="1">access</text>
  </svg>
);

export const ADBLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="ADB logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#006837" />
    <circle cx="50" cy="46" r="30" fill="#00502A" stroke="#FDB913" strokeWidth="2.5" />
    <path d="M50 30 C56 36, 62 44, 62 52 C56 50, 52 46, 50 42 C48 46, 44 50, 38 52 C38 44, 44 36, 50 30 Z" fill="#FDB913" />
    <text x="50" y="80" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="18" fill="#FFFFFF" letterSpacing="1">adb</text>
  </svg>
);

export const AGALogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="AngloGold Ashanti logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#1C1917" />
    <path d="M30 62 L50 24 L70 62 L60 62 L50 40 L40 62 Z" fill="#FFD700" />
    <text x="50" y="78" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="10" fill="#FFD700" letterSpacing="1">ANGLOGOLD</text>
    <text x="50" y="88" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="7" fill="#A8A29E" letterSpacing="1.5">ASHANTI</text>
  </svg>
);

export const ALWLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Aluworks logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#334155" />
    <rect x="25" y="30" width="50" height="14" rx="3" fill="#94A3B8" />
    <rect x="25" y="48" width="50" height="14" rx="3" fill="#CBD5E1" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="15" fill="#FFFFFF" letterSpacing="1">ALUWORKS</text>
  </svg>
);

export const CLYDLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Clydestone logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#1E1B4B" />
    <circle cx="50" cy="38" r="8" fill="#06B6D4" />
    <circle cx="34" cy="56" r="6" fill="#3B82F6" />
    <circle cx="66" cy="56" r="6" fill="#3B82F6" />
    <line x1="50" y1="38" x2="34" y2="56" stroke="#06B6D4" strokeWidth="2.5" />
    <line x1="50" y1="38" x2="66" y2="56" stroke="#06B6D4" strokeWidth="2.5" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="12" fill="#FFFFFF" letterSpacing="1">CLYDESTONE</text>
  </svg>
);

export const CMLTLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Camelot logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#4A1525" />
    <circle cx="50" cy="46" r="28" fill="none" stroke="#F6AD55" strokeWidth="3" strokeDasharray="4 2" />
    <text x="50" y="52" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF">CPC</text>
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#F6AD55" letterSpacing="1">CAMELOT</text>
  </svg>
);

export const CPCLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Cocoa Processing logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#3D1C06" />
    <ellipse cx="50" cy="46" rx="22" ry="28" fill="#DAA520" transform="rotate(-15 50 46)" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="12" fill="#DAA520" letterSpacing="1">GOLDEN TREE</text>
    <text x="50" y="90" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="6" fill="#D7CCC8" letterSpacing="1">COCOA PROCESSING</text>
  </svg>
);

export const DASPHARMALogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Dannex Pharma logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#0D47A1" />
    <rect x="44" y="24" width="12" height="36" rx="3" fill="#00E5FF" />
    <rect x="32" y="36" width="36" height="12" rx="3" fill="#00E5FF" />
    <text x="50" y="76" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="0.5">DANNEX</text>
    <text x="50" y="86" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="7" fill="#00E5FF" letterSpacing="1">PHARMA PLC</text>
  </svg>
);

export const DIGICUTLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="DigiCut logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#7B1FA2" />
    <circle cx="50" cy="46" r="24" fill="none" stroke="#E1BEE7" strokeWidth="4" />
    <polygon points="44,36 62,46 44,56" fill="#FFFFFF" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="1">DIGICUT</text>
  </svg>
);

export const FABLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="First Atlantic Bank logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#4A148C" />
    <polygon points="50,22 56,38 72,38 59,48 64,64 50,54 36,64 41,48 28,38 44,38" fill="#FFD700" />
    <text x="50" y="78" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="11" fill="#FFFFFF" letterSpacing="0.5">1ST ATLANTIC</text>
    <text x="50" y="87" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="6" fill="#FFD700" letterSpacing="1">BANK PLC</text>
  </svg>
);

export const HORDSLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Hords logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#1B5E20" />
    <path d="M50 24 C62 24, 72 36, 70 52 C54 52, 42 42, 38 32 C42 27, 46 24, 50 24 Z" fill="#FBC02D" />
    <text x="50" y="78" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF" letterSpacing="1">HORDS</text>
  </svg>
);

export const IILLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Intravenous Infusions logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#00838F" />
    <path d="M50 24 C50 24, 64 42, 64 52 C64 60, 58 66, 50 66 C42 66, 36 60, 36 52 C36 42, 50 24, 50 24 Z" fill="#E0F7FA" />
    <rect x="47" y="44" width="6" height="16" fill="#00838F" />
    <rect x="42" y="49" width="16" height="6" fill="#00838F" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="15" fill="#FFFFFF" letterSpacing="1">IIL</text>
  </svg>
);

export const MACLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Mega African Capital logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#1E293B" />
    <polygon points="50,26 74,64 26,64" fill="none" stroke="#10B981" strokeWidth="4" />
    <polygon points="50,38 64,60 36,60" fill="#10B981" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="15" fill="#FFFFFF" letterSpacing="1">MAC</text>
  </svg>
);

export const MMHLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Apex Marshalls logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#1565C0" />
    <path d="M50 24 L68 36 L50 48 L32 36 Z" fill="#F59E0B" />
    <line x1="68" y1="36" x2="68" y2="54" stroke="#F59E0B" strokeWidth="3" />
    <text x="50" y="74" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF" letterSpacing="1">MMH</text>
    <text x="50" y="84" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="6" fill="#93C5FD" letterSpacing="1">MARSHALLS</text>
  </svg>
);

export const PBCLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Produce Buying Co logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#2E7D32" />
    <circle cx="50" cy="46" r="26" fill="#1B5E20" stroke="#FFD54F" strokeWidth="3" />
    <text x="50" y="53" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="16" fill="#FFD54F">PBC</text>
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="11" fill="#FFFFFF" letterSpacing="1">PRODUCE BUYING</text>
  </svg>
);

export const SAMBALogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Samba Foods logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#C62828" />
    <circle cx="50" cy="46" r="26" fill="#B71C1C" stroke="#FFF" strokeWidth="2" />
    <path d="M50 28 C54 36, 62 42, 60 52 C58 60, 42 60, 40 52 C38 42, 46 36, 50 28 Z" fill="#FFEB3B" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="1">SAMBA</text>
  </svg>
);

export const SOGEGHLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Societe Generale Ghana logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#111111" />
    <rect x="25" y="24" width="50" height="23" rx="4" fill="#E2001A" />
    <rect x="25" y="47" width="50" height="23" rx="4" fill="#000000" stroke="#333333" strokeWidth="1" />
    <rect x="25" y="45" width="50" height="4" fill="#FFFFFF" />
    <text x="50" y="84" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="10" fill="#FFFFFF" letterSpacing="0.5">SOCIETE GENERALE</text>
  </svg>
);

export const TBLLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Trust Bank logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#0D47A1" />
    <circle cx="50" cy="46" r="28" fill="#1565C0" stroke="#FFB300" strokeWidth="2.5" />
    <text x="50" y="53" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="16" fill="#FFB300">TBL</text>
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="12" fill="#FFFFFF" letterSpacing="1">TRUST BANK</text>
  </svg>
);

export const ZENLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Zenith Bank logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <path d="M28 30 H72 L42 62 H72 V72 H28 L58 40 H28 Z" fill="#D32F2F" />
    <text x="50" y="88" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="11" fill="#333333" letterSpacing="1">ZENITH</text>
  </svg>
);

export const PZCLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="PZ Cussons logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#E4002B" />
    <rect x="12" y="24" width="76" height="52" rx="16" fill="#FFFFFF" />
    <text x="50" y="52" textAnchor="middle" fontFamily="'Arial Black', Impact, sans-serif" fontWeight="900" fontSize="28" fill="#E4002B" letterSpacing="-1.5">PZ</text>
    <text x="50" y="68" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="9" fill="#002D72" letterSpacing="1.5">CUSSONS</text>
  </svg>
);

export const SWLLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Sam-Woode logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#6B1D2F" />
    <circle cx="50" cy="50" r="38" fill="#521523" stroke="#FDB913" strokeWidth="2.5" />
    <path d="M50 36 C44 32, 34 33, 26 36 V62 C34 59, 44 58, 50 62 C56 58, 66 59, 74 62 V36 C66 33, 56 32, 50 36 Z" fill="#FDB913" />
    <text x="50" y="78" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="1">SAM-WOODE</text>
  </svg>
);

export const GWEBLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Golden Web logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#E67E22" />
    <circle cx="50" cy="48" r="32" fill="#D35400" stroke="#F1C40F" strokeWidth="3" />
    <path d="M50 28 C50 28, 62 44, 62 52 C62 58.6, 56.6 64, 50 64 C43.4 64, 38 58.6, 38 52 C38 44, 50 28, 50 28 Z" fill="#F1C40F" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="11" fill="#FFFFFF" letterSpacing="1">GOLDEN WEB</text>
  </svg>
);

export const AYRTNLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Ayrton Drug logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#1A5276" />
    <circle cx="50" cy="46" r="30" fill="#154360" stroke="#5DADE2" strokeWidth="2.5" />
    <rect x="45" y="28" width="10" height="34" rx="3" fill="#E74C3C" />
    <rect x="33" y="40" width="34" height="10" rx="3" fill="#E74C3C" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="12" fill="#FFFFFF" letterSpacing="1">AYRTON</text>
  </svg>
);

// ─── TOP US EQUITIES ────────────────────────────────────────────────────────────

export const AAPLLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Apple logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#000000" />
    <path d="M52 22 C55 18, 60 16, 64 16 C65 20, 63 24, 60 27 C57 30, 52 30, 52 22 Z" fill="#FFFFFF" />
    <path d="M68 46 C68 38, 74 34, 75 33 C71 27, 65 26, 62 26 C56 26, 52 29, 48 29 C44 29, 41 26, 36 26 C30 26, 24 30, 21 37 C15 48, 19 64, 25 73 C28 77, 32 82, 37 82 C41 82, 43 79, 48 79 C53 79, 55 82, 60 82 C64 82, 68 77, 71 73 C75 67, 76 61, 77 60 C76 60, 68 57, 68 46 Z" fill="#FFFFFF" />
  </svg>
);

export const MSFTLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Microsoft logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#1E293B" />
    <rect x="24" y="24" width="23" height="23" fill="#F25022" />
    <rect x="53" y="24" width="23" height="23" fill="#7FBA00" />
    <rect x="24" y="53" width="23" height="23" fill="#00A4EF" />
    <rect x="53" y="53" width="23" height="23" fill="#FFB900" />
  </svg>
);

export const NVDALogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="NVIDIA logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#000000" />
    <path d="M48 24 C34 24, 24 35, 24 50 C24 65, 34 76, 48 76 C58 76, 68 70, 74 62 C71 66, 62 70, 52 70 C40 70, 32 61, 32 50 C32 39, 40 30, 52 30 C62 30, 70 34, 74 38 C68 30, 58 24, 48 24 Z" fill="#76B900" />
    <circle cx="50" cy="50" r="8" fill="#76B900" />
  </svg>
);

export const GOOGLLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Google logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <path d="M76 50 C76 48, 75.8 46, 75.5 44 H50 V56 H65 C64.3 59.8, 62 63, 58.5 65.2 V73 H69 C75.1 67.4, 76 59, 76 50 Z" fill="#4285F4" />
    <path d="M50 77 C57.3 77, 63.4 74.6, 67.8 70.5 L57.3 62.7 C55.3 64, 52.8 64.8, 50 64.8 C43 64.8, 37 60, 34.8 53.6 H24 V62 C28.4 70.8, 38.5 77, 50 77 Z" fill="#34A853" />
    <path d="M34.8 53.6 C34.2 51.8, 33.9 49.9, 33.9 48 C33.9 46.1, 34.2 44.2, 34.8 42.4 V34 H24 C22.2 37.6, 21.2 42.7, 21.2 48 C21.2 53.3, 22.2 58.4, 24 62 L34.8 53.6 Z" fill="#FBBC05" />
    <path d="M50 31.2 C54 31.2, 57.5 32.6, 60.3 35.3 L68.2 27.4 C63.4 22.9, 57.3 20.2, 50 20.2 C38.5 20.2, 28.4 26.4, 24 35.2 L34.8 43.6 C37 37.2, 43 31.2, 50 31.2 Z" fill="#EA4335" />
  </svg>
);

export const AMZNLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Amazon logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#131921" />
    <text x="32" y="54" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="36" fill="#FFFFFF">a</text>
    <path d="M26 62 C38 72, 62 72, 74 60" fill="none" stroke="#FF9900" strokeWidth="4.5" strokeLinecap="round" />
    <polygon points="73,56 79,61 71,65" fill="#FF9900" />
  </svg>
);

export const METALogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Meta logo">
    <defs>
      <linearGradient id="metaGradReact" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0064E0" />
        <stop offset="100%" stopColor="#833AB4" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx={getRx(100)} fill="#0F172A" />
    <path d="M32 40 C24 40, 18 46, 18 53 C18 60, 24 66, 32 66 C40 66, 46 58, 50 53 C54 48, 60 40, 68 40 C76 40, 82 46, 82 53 C82 60, 76 66, 68 66 C60 66, 54 58, 50 53 C46 48, 40 40, 32 40 Z" fill="none" stroke="url(#metaGradReact)" strokeWidth="7" strokeLinecap="round" />
  </svg>
);

export const TSLALogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Tesla logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <path d="M22 26 C36 22, 64 22, 78 26 L74 32 C62 29, 38 29, 26 32 Z" fill="#E82127" />
    <path d="M50 36 C42 36, 30 38, 26 42 L24 37 C32 32, 44 32, 50 32 C56 32, 68 32, 76 37 L74 42 C70 38, 58 36, 50 36 Z" fill="#E82127" />
    <path d="M47 38 H53 V74 C53 74, 52 78, 50 78 C48 78, 47 74, 47 74 Z" fill="#E82127" />
  </svg>
);

export const JPMLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="JPMorgan Chase logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#0A2540" />
    <polygon points="50,22 74,32 84,56 74,80 50,90 26,80 16,56 26,32" fill="none" stroke="#FFFFFF" strokeWidth="3" />
    <text x="50" y="58" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="16" fill="#FFFFFF" letterSpacing="1">JPM</text>
  </svg>
);

export const BACLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Bank of America logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <rect x="24" y="32" width="22" height="6" fill="#E31837" />
    <rect x="24" y="42" width="22" height="6" fill="#E31837" />
    <rect x="54" y="32" width="22" height="6" fill="#002D72" />
    <rect x="54" y="42" width="22" height="6" fill="#002D72" />
    <text x="50" y="72" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="12" fill="#002D72" letterSpacing="0.5">Bank of America</text>
  </svg>
);

export const VLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Visa logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#1A1F71" />
    <text x="50" y="65" textAnchor="middle" fontFamily="'Arial Black', Impact, sans-serif" fontWeight="900" fontStyle="italic" fontSize="34" fill="#FFFFFF" letterSpacing="-1">VISA</text>
    <polygon points="26,38 34,38 31,45 28,45" fill="#F7B600" />
  </svg>
);

export const MALogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Mastercard logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#0A1128" />
    <circle cx="39" cy="50" r="22" fill="#EB001B" />
    <circle cx="61" cy="50" r="22" fill="#F79E1B" />
    <path d="M50 33 C55 38, 58 44, 58 50 C58 56, 55 62, 50 67 C45 62, 42 56, 42 50 C42 44, 45 38, 50 33 Z" fill="#FF5F00" />
  </svg>
);

export const WMTLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Walmart logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#0071DC" />
    <g transform="translate(50, 50)">
      <rect x="-3" y="-24" width="6" height="16" rx="3" fill="#FFC220" />
      <rect x="-3" y="8" width="6" height="16" rx="3" fill="#FFC220" />
      <rect x="-3" y="-24" width="6" height="16" rx="3" fill="#FFC220" transform="rotate(60)" />
      <rect x="-3" y="8" width="6" height="16" rx="3" fill="#FFC220" transform="rotate(60)" />
      <rect x="-3" y="-24" width="6" height="16" rx="3" fill="#FFC220" transform="rotate(120)" />
      <rect x="-3" y="8" width="6" height="16" rx="3" fill="#FFC220" transform="rotate(120)" />
    </g>
  </svg>
);

export const JNJLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Johnson & Johnson logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <text x="50" y="58" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontStyle="italic" fontSize="22" fill="#D51900">J&amp;J</text>
    <text x="50" y="78" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="7" fill="#666666" letterSpacing="1">JOHNSON &amp; JOHNSON</text>
  </svg>
);

export const PGLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Procter & Gamble logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#003CAE" />
    <circle cx="50" cy="50" r="38" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
    <text x="50" y="60" textAnchor="middle" fontFamily="'Times New Roman', serif" fontWeight="900" fontStyle="italic" fontSize="28" fill="#FFFFFF">P&amp;G</text>
  </svg>
);

export const UNHLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="UnitedHealth logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#002677" />
    <path d="M50 22 L72 32 V54 C72 68, 62 76, 50 80 C38 76, 28 68, 28 54 V32 Z" fill="#0056B3" stroke="#FFFFFF" strokeWidth="2" />
    <text x="50" y="58" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF">UNH</text>
  </svg>
);

export const XOMLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="ExxonMobil logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#0C2340" />
    <text x="36" y="58" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="28" fill="#FF0000">X</text>
    <text x="64" y="58" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="28" fill="#FF0000">X</text>
    <text x="50" y="78" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="9" fill="#FFFFFF" letterSpacing="1">EXXONMOBIL</text>
  </svg>
);

export const CVXLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Chevron logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <path d="M26 30 L50 48 L74 30 L64 30 L50 40 L36 30 Z" fill="#005B94" />
    <path d="M26 46 L50 64 L74 46 L64 46 L50 56 L36 46 Z" fill="#E21D38" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="11" fill="#005B94" letterSpacing="0.5">CHEVRON</text>
  </svg>
);

export const ABBVLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="AbbVie logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#071D49" />
    <circle cx="50" cy="45" r="22" fill="none" stroke="#00A3E0" strokeWidth="6" strokeDasharray="25 8" />
    <text x="50" y="80" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="1">abbvie</text>
  </svg>
);

export const LLYLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Eli Lilly logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <text x="50" y="60" textAnchor="middle" fontFamily="'Brush Script MT', cursive, serif" fontSize="36" fontWeight="bold" fill="#D52B1E">Lilly</text>
    <text x="50" y="80" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="8" fill="#666666" letterSpacing="1">ELI LILLY</text>
  </svg>
);

export const MRKLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Merck logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#00857C" />
    <circle cx="38" cy="42" r="10" fill="#FFFFFF" opacity="0.9" />
    <circle cx="62" cy="42" r="10" fill="#FFFFFF" opacity="0.9" />
    <circle cx="38" cy="62" r="10" fill="#FFFFFF" opacity="0.9" />
    <circle cx="62" cy="62" r="10" fill="#FFFFFF" opacity="0.9" />
    <text x="50" y="84" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="1">MERCK</text>
  </svg>
);

export const HDLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Home Depot logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#F96302" />
    <rect x="22" y="22" width="56" height="56" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
    <text x="50" y="44" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="10" fill="#FFFFFF">THE HOME</text>
    <text x="50" y="62" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF">DEPOT</text>
  </svg>
);

export const COSTLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Costco logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <text x="50" y="52" textAnchor="middle" fontFamily="'Arial Black', Impact, sans-serif" fontWeight="900" fontSize="17" fill="#E31837" letterSpacing="0.5">COSTCO</text>
    <rect x="24" y="60" width="52" height="4" fill="#005DAA" />
    <text x="50" y="76" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="8" fill="#005DAA" letterSpacing="1.5">WHOLESALE</text>
  </svg>
);

export const AVGOLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Broadcom logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#CC092F" />
    <circle cx="50" cy="44" r="16" fill="#FFFFFF" />
    <circle cx="50" cy="44" r="8" fill="#CC092F" />
    <text x="50" y="78" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="10" fill="#FFFFFF" letterSpacing="0.5">BROADCOM</text>
  </svg>
);

export const ORCLLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Oracle logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#222222" />
    <rect x="22" y="32" width="56" height="36" rx="18" fill="#F80000" />
    <rect x="30" y="40" width="40" height="20" rx="10" fill="#222222" />
    <text x="50" y="86" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="11" fill="#FFFFFF" letterSpacing="1">ORACLE</text>
  </svg>
);

export const CSCOLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Cisco logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#049FD9" />
    <g fill="#FFFFFF">
      <rect x="24" y="44" width="4" height="16" rx="2" />
      <rect x="34" y="34" width="4" height="26" rx="2" />
      <rect x="44" y="24" width="4" height="36" rx="2" />
      <rect x="54" y="24" width="4" height="36" rx="2" />
      <rect x="64" y="34" width="4" height="26" rx="2" />
      <rect x="74" y="44" width="4" height="16" rx="2" />
    </g>
    <text x="50" y="80" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="12" fill="#FFFFFF" letterSpacing="1">CISCO</text>
  </svg>
);

export const INTCLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Intel logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#0068B5" />
    <text x="50" y="60" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="24" fill="#FFFFFF" letterSpacing="-1">intel</text>
  </svg>
);

export const AMDLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="AMD logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#000000" />
    <polygon points="30,34 50,34 60,44 60,56 50,66 30,66" fill="#00875A" />
    <polygon points="40,42 48,42 54,48 54,52 48,58 40,58" fill="#000000" />
    <text x="50" y="84" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF" letterSpacing="1">AMD</text>
  </svg>
);

export const CRMLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Salesforce logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <path d="M36 56 C30 56, 26 50, 28 44 C30 38, 38 36, 42 38 C46 30, 58 28, 64 34 C70 32, 78 36, 76 44 C82 46, 82 54, 76 56 Z" fill="#00A1E0" />
    <text x="50" y="78" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="10" fill="#00A1E0" letterSpacing="0.5">salesforce</text>
  </svg>
);

export const ADBELogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Adobe logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FF0000" />
    <polygon points="28,24 44,74 36,74 28,50" fill="#FFFFFF" />
    <polygon points="72,24 56,74 64,74 72,50" fill="#FFFFFF" />
    <polygon points="50,42 60,74 54,74 48,56" fill="#FFFFFF" />
  </svg>
);

export const NFLXLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Netflix logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#000000" />
    <polygon points="32,22 42,22 42,78 32,78" fill="#B81D24" />
    <polygon points="58,22 68,22 68,78 58,78" fill="#B81D24" />
    <polygon points="32,22 42,22 68,78 58,78" fill="#E50914" />
  </svg>
);

export const DISLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Disney logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#113CCF" />
    <path d="M50 24 L54 36 H46 Z M38 38 L42 48 H34 Z M62 38 L66 48 H58 Z M32 50 H68 V66 H32 Z" fill="#FFFFFF" />
    <text x="50" y="82" textAnchor="middle" fontFamily="'Brush Script MT', cursive, serif" fontSize="20" fontWeight="bold" fill="#FFFFFF">Disney</text>
  </svg>
);

export const KOLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Coca-Cola logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#F40009" />
    <text x="50" y="58" textAnchor="middle" fontFamily="'Brush Script MT', cursive, serif" fontSize="34" fontWeight="bold" fill="#FFFFFF">Coke</text>
    <path d="M24 68 C40 60, 60 76, 76 68" fill="none" stroke="#FFFFFF" strokeWidth="3" />
  </svg>
);

export const PEPLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Pepsi logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FFFFFF" />
    <circle cx="50" cy="50" r="34" fill="#004B93" />
    <path d="M16 50 C28 35, 45 35, 55 50 C65 65, 82 65, 84 50 A34 34 0 0 0 16 50 Z" fill="#E32934" />
    <path d="M16 50 C28 35, 45 35, 55 50 C65 65, 82 65, 84 50 C80 58, 65 58, 55 46 C45 34, 28 34, 16 50 Z" fill="#FFFFFF" />
  </svg>
);

export const NKELogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Nike logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#000000" />
    <path d="M22 56 C38 66, 56 64, 78 30 C76 44, 58 66, 42 68 C32 69, 24 64, 22 56 Z" fill="#FFFFFF" />
  </svg>
);

export const MCDLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="McDonald's logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#DA291C" />
    <path d="M26 74 C26 40, 36 26, 43 26 C48 26, 50 36, 50 44 C50 36, 52 26, 57 26 C64 26, 74 40, 74 74 H66 C66 44, 58 32, 54 32 C50 32, 48 40, 48 60 H42 C42 40, 40 32, 36 32 C32 32, 34 44, 34 74 Z" fill="#FFC72C" />
  </svg>
);

export const IBMLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="IBM logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#0A1128" />
    <text x="50" y="62" textAnchor="middle" fontFamily="'Arial Black', Impact, sans-serif" fontWeight="900" fontSize="28" fill="#1F70C1" letterSpacing="2">IBM</text>
    <line x1="20" y1="40" x2="80" y2="40" stroke="#0A1128" strokeWidth="2" />
    <line x1="20" y1="46" x2="80" y2="46" stroke="#0A1128" strokeWidth="2" />
    <line x1="20" y1="52" x2="80" y2="52" stroke="#0A1128" strokeWidth="2" />
    <line x1="20" y1="58" x2="80" y2="58" stroke="#0A1128" strokeWidth="2" />
  </svg>
);

export const BABALogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Alibaba logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FF6A00" />
    <circle cx="50" cy="50" r="32" fill="#FFFFFF" />
    <text x="50" y="62" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="34" fill="#FF6A00">a</text>
  </svg>
);

export const UBERLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Uber logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#000000" />
    <text x="50" y="60" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="20" fill="#FFFFFF" letterSpacing="1">Uber</text>
  </svg>
);

export const ABNBLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Airbnb logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#FF5A5F" />
    <path d="M50 24 C44 24, 32 46, 32 60 C32 70, 40 76, 50 76 C60 76, 68 70, 68 60 C68 46, 56 24, 50 24 Z M50 66 C46 66, 42 62, 42 58 C42 52, 48 42, 50 42 C52 42, 58 52, 58 58 C58 62, 54 66, 50 66 Z" fill="#FFFFFF" />
  </svg>
);

export const SPOTLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Spotify logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#191414" />
    <circle cx="50" cy="50" r="32" fill="#1DB954" />
    <path d="M34 42 C44 38, 58 40, 66 45" fill="none" stroke="#191414" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M36 50 C44 47, 56 48, 64 52" fill="none" stroke="#191414" strokeWidth="4" strokeLinecap="round" />
    <path d="M38 58 C44 56, 54 57, 60 60" fill="none" stroke="#191414" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

export const SBUXLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Starbucks logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#00704A" />
    <circle cx="50" cy="50" r="34" fill="none" stroke="#FFFFFF" strokeWidth="3" />
    <polygon points="50,30 53,40 63,40 55,46 58,56 50,50 42,56 45,46 37,40 47,40" fill="#FFFFFF" />
    <text x="50" y="74" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="9" fill="#FFFFFF" letterSpacing="1">STARBUCKS</text>
  </svg>
);

export const PYPLLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="PayPal logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#003087" />
    <text x="44" y="64" fontFamily="'Arial Black', Impact, sans-serif" fontWeight="900" fontStyle="italic" fontSize="40" fill="#0079C1">P</text>
    <text x="54" y="64" fontFamily="'Arial Black', Impact, sans-serif" fontWeight="900" fontStyle="italic" fontSize="40" fill="#00457C" opacity="0.8">P</text>
  </svg>
);

export const GSLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Goldman Sachs logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#7399C6" />
    <text x="50" y="58" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="bold" fontSize="28" fill="#FFFFFF">GS</text>
    <text x="50" y="76" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="7" fill="#FFFFFF" letterSpacing="1">GOLDMAN SACHS</text>
  </svg>
);

export const MSLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Morgan Stanley logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#002B49" />
    <text x="50" y="58" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="26" fill="#FFFFFF" letterSpacing="1">MS</text>
    <text x="50" y="76" textAnchor="middle" fontFamily="'Arial', sans-serif" fontWeight="700" fontSize="7" fill="#88A0B5" letterSpacing="1">MORGAN STANLEY</text>
  </svg>
);

export const TXNLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Texas Instruments logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#CC0000" />
    <text x="50" y="62" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="30" fill="#FFFFFF">ti</text>
  </svg>
);

export const QCOMLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Qualcomm logo">
    <rect width="100" height="100" rx={getRx(100)} fill="#14529E" />
    <text x="50" y="62" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="30" fill="#FFFFFF">Q</text>
  </svg>
);

// ─── MASTER LOGO MAP ───────────────────────────────────────────────────────────

export const CUSTOM_LOGO_MAP: Record<string, React.FC<LogoProps>> = {
  // GSE Equities
  MTNGH: MTNGHLogo,
  GCB: GCBLogo,
  BOPP: BOPPLogo,
  TOTAL: TOTALLogo,
  SCB: SCBLogo,
  CAL: CALLogo,
  EGH: EGHLogo,
  ETI: ETILogo,
  GOIL: GOILLogo,
  UNIL: UNILLogo,
  FML: FMLLogo,
  EGL: EGLLogo,
  GGBL: GGBLLogo,
  ACCESS: ACCESSLogo,
  ADB: ADBLogo,
  AGA: AGALogo,
  ALW: ALWLogo,
  CLYD: CLYDLogo,
  CMLT: CMLTLogo,
  CPC: CPCLogo,
  DASPHARMA: DASPHARMALogo,
  DIGICUT: DIGICUTLogo,
  DGCUT: DIGICUTLogo,
  FAB: FABLogo,
  HORDS: HORDSLogo,
  IIL: IILLogo,
  MAC: MACLogo,
  MMH: MMHLogo,
  PBC: PBCLogo,
  SAMBA: SAMBALogo,
  SOGEGH: SOGEGHLogo,
  TBL: TBLLogo,
  ZEN: ZENLogo,
  SIC: SICLogo,
  TLW: TLWLogo,
  GLD: GLDLogo,
  PZC: PZCLogo,
  SWL: SWLLogo,
  GWEB: GWEBLogo,
  AYRTN: AYRTNLogo,

  // US & Global Equities
  AAPL: AAPLLogo,
  MSFT: MSFTLogo,
  NVDA: NVDALogo,
  GOOGL: GOOGLLogo,
  GOOG: GOOGLLogo,
  AMZN: AMZNLogo,
  META: METALogo,
  TSLA: TSLALogo,
  JPM: JPMLogo,
  BAC: BACLogo,
  V: VLogo,
  MA: MALogo,
  WMT: WMTLogo,
  JNJ: JNJLogo,
  PG: PGLogo,
  UNH: UNHLogo,
  XOM: XOMLogo,
  CVX: CVXLogo,
  ABBV: ABBVLogo,
  LLY: LLYLogo,
  MRK: MRKLogo,
  HD: HDLogo,
  COST: COSTLogo,
  AVGO: AVGOLogo,
  ORCL: ORCLLogo,
  CSCO: CSCOLogo,
  INTC: INTCLogo,
  AMD: AMDLogo,
  CRM: CRMLogo,
  ADBE: ADBELogo,
  NFLX: NFLXLogo,
  DIS: DISLogo,
  KO: KOLogo,
  PEP: PEPLogo,
  NKE: NKELogo,
  MCD: MCDLogo,
  IBM: IBMLogo,
  BABA: BABALogo,
  UBER: UBERLogo,
  ABNB: ABNBLogo,
  SPOT: SPOTLogo,
  SBUX: SBUXLogo,
  PYPL: PYPLLogo,
  GS: GSLogo,
  MS: MSLogo,
  TXN: TXNLogo,
  QCOM: QCOMLogo,
};
