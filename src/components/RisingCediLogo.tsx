import React from 'react';

interface RisingCediLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showBadge?: boolean;
  badgeText?: string;
}

export const RisingCediLogo: React.FC<RisingCediLogoProps> = ({
  className = '',
  size = 'md',
  showBadge = false,
  badgeText = 'Research Lab'
}) => {
  const isNumberSize = typeof size === 'number';
  const sizeMap: Record<string, string> = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const containerSizes: Record<string, string> = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl'
  };

  const sizeClass = !isNumberSize ? (sizeMap[size] || 'w-10 h-10') : '';
  const roundedClass = !isNumberSize ? (containerSizes[size] || 'rounded-xl') : 'rounded-lg';
  const styleDimensions = isNumberSize ? { width: `${size}px`, height: `${size}px`, maxWidth: `${size}px`, maxHeight: `${size}px` } : undefined;

  return (
    <div 
      className={`inline-flex items-center gap-2.5 select-none shrink-0 ${className}`}
      title="Meridian Equities - Research & Analytics"
    >
      {/* The Equity Pulse App Icon Vector Squircle */}
      <div 
        style={styleDimensions}
        className={`relative ${sizeClass} ${roundedClass} overflow-hidden shadow-sm border border-cyan-500/30 flex items-center justify-center shrink-0 bg-[#0B1329]`}
      >
        {/* Adaptive Icon Canvas matching the App Drawer Icon */}
        <svg 
          viewBox="0 0 108 108" 
          className="w-full h-full drop-shadow-sm max-w-full max-h-full block" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Deep Midnight Navy Background */}
          <rect width="108" height="108" rx="24" fill="#0B1329" />
          <rect width="108" height="108" rx="24" fill="url(#bg-glow)" fillOpacity="0.4" />

          <defs>
            <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0891B2" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0B1329" stopOpacity="0" />
            </radialGradient>
            
            <linearGradient id="neon-arrow" x1="30" y1="70" x2="80" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#67E8F9" />
            </linearGradient>

            <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Compass Outer Ring with Glow */}
          <circle cx="54" cy="54" r="33" stroke="#00D2E0" strokeWidth="1.8" strokeOpacity="0.85" />
          <circle cx="54" cy="54" r="29" stroke="#0891B2" strokeWidth="1" strokeOpacity="0.4" />

          {/* Compass Dial Ticks */}
          <line x1="54" y1="18" x2="54" y2="22" stroke="#00D2E0" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="54" y1="86" x2="54" y2="90" stroke="#00D2E0" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="54" x2="22" y2="54" stroke="#00D2E0" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="86" y1="54" x2="90" y2="54" stroke="#00D2E0" strokeWidth="1.5" strokeLinecap="round" />

          {/* Cardinal Points (N, E, S, W) in Gold/Cyan */}
          <path d="M54,14 L57.5,20 L50.5,20 Z" fill="#F4C430" />
          <text x="54" y="27" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">N</text>
          
          <path d="M54,94 L50.5,88 L57.5,88 Z" fill="#F4C430" />
          <text x="54" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">S</text>

          <path d="M14,54 L20,50.5 L20,57.5 Z" fill="#F4C430" />
          <text x="26" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">W</text>

          <path d="M94,54 L88,57.5 L88,50.5 Z" fill="#F4C430" />
          <text x="82" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">E</text>

          {/* Glowing Brain Silhouette */}
          {/* Left Hemisphere */}
          <path
            d="M51,36 C46,33 41,35 38,39 C35,43 35,48 38,52 C35,55 35,60 38,63 C41,66 46,67 51,64 Z"
            fill="#0E7490"
            fillOpacity="0.8"
            stroke="#22D3EE"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Hemisphere */}
          <path
            d="M57,36 C62,33 67,35 70,39 C73,43 73,48 70,52 C73,55 73,60 70,63 C67,66 62,67 57,64 Z"
            fill="#0E7490"
            fillOpacity="0.8"
            stroke="#22D3EE"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Brain Sulci & Folds */}
          <path
            d="M42,42 C45,45 43,48 40,50 M41,54 C45,56 45,60 43,62 M66,42 C63,45 65,48 68,50 M67,54 C63,56 63,60 65,62"
            stroke="#67E8F9"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />

          {/* Upward Rising Zigzag Trend Lightning Arrow */}
          <path
            d="M32,69 L45,55 L52,63 L74,38"
            stroke="#083344"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32,69 L45,55 L52,63 L74,38"
            stroke="url(#neon-arrow)"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#cyan-glow)"
          />
          <path
            d="M33,68 L45,55 L52,63 L73,39"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Arrowhead */}
          <path
            d="M79,33 L66,37 L75,46 Z"
            fill="#22D3EE"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>

        {/* Small cyan pulse sparkle in the corner */}
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-900 flex items-center justify-center">
          <span className="text-[5px] font-black text-slate-950">✦</span>
        </div>
      </div>

      {/* Brand Name & Tag */}
      {showBadge && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1">
              <span>Meridian</span>
              <span className="text-cyan-400">Equities</span>
            </span>
            <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-2xs">
              {badgeText}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Global &amp; GSE Stock Terminal
          </span>
        </div>
      )}
    </div>
  );
};

