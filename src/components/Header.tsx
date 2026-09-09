import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  DollarSign, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Calendar, 
  ArrowRightLeft, 
  Bell, 
  Briefcase, 
  Sun, 
  Moon, 
  Newspaper, 
  Calculator, 
  GraduationCap, 
  Activity,
  Search,
  Zap,
  ShieldCheck,
  User,
  SlidersHorizontal,
  Menu,
  Crown
} from 'lucide-react';
import { MarketIndex, UserProfile } from '../types';
import { RisingCediLogo } from './RisingCediLogo';

interface HeaderProps {
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  showPro?: boolean;
  onTogglePro?: (val: boolean) => void;
  exchangeRateUsd: number;
  onOpenExchangeRateModal: () => void;
  indices: MarketIndex[];
  onOpenJargon: (id: string) => void;
  onOpenDividendCalendar: () => void;
  currency: 'GHS' | 'USD';
  onToggleCurrency: () => void;
  onOpenAlertsModal: () => void;
  alertsCount: number;
  triggeredAlertsCount: number;
  onOpenPortfolioTab?: () => void;
  portfolioHoldingsCount?: number;
  onOpenNewsTab?: () => void;
  newsCount?: number;
  onOpenCalculatorsTab?: () => void;
  onOpenLearnTab?: () => void;
  onOpenMarketCloseReport?: () => void;
  onOpenOnboardingTour?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenMeridianAI?: () => void;
  onOpenAuthModal?: () => void;
  userProfile?: UserProfile | null;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenCommandPalette?: () => void;
  onOpenMobileMenu?: () => void;
  proPassExpiry?: number | null;
  onOpenSubscriptionModal?: () => void;
  subscriptionTier?: string;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isRefreshing,
  onRefresh,
  exchangeRateUsd,
  onOpenExchangeRateModal,
  indices,
  onOpenJargon,
  onOpenDividendCalendar,
  currency,
  onToggleCurrency,
  onOpenAlertsModal,
  alertsCount,
  triggeredAlertsCount,
  onOpenPortfolioTab,
  portfolioHoldingsCount = 0,
  onOpenNewsTab,
  newsCount = 0,
  onOpenCalculatorsTab,
  onOpenLearnTab,
  onOpenMarketCloseReport,
  onOpenOnboardingTour,
  theme,
  onToggleTheme,
  onOpenMeridianAI,
  onOpenAuthModal,
  userProfile,
  searchQuery = '',
  onSearchChange,
  onOpenCommandPalette,
  onOpenMobileMenu,
  proPassExpiry,
  onOpenSubscriptionModal,
  subscriptionTier = 'FREE'
}) => {
  const [marketOpen, setMarketOpen] = useState(false);
  const [currentTimeGmt, setCurrentTimeGmt] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getUTCHours();
      const day = now.getUTCDay();
      // GSE trading hours: Mon-Fri 10:00 - 15:00 GMT
      const isWeekday = day >= 1 && day <= 5;
      const isOpen = isWeekday && hours >= 10 && hours < 15;
      setMarketOpen(isOpen);
      setCurrentTimeGmt(now.toUTCString().slice(17, 22) + ' GMT');
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#070D1F] text-white border-b border-white/[0.08] shadow-2xl sticky top-0 z-40">
      {/* 1. Top Market Ticker Tape / Indices Ribbon */}
      <div className="bg-[#03060F] border-b border-white/[0.08] px-2.5 sm:px-6 py-1 overflow-x-hidden flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono select-none w-full max-w-full">
        {/* Left: GSE Live Clock & Status */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full ${marketOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="font-bold text-slate-300">{currentTimeGmt || '12:00 GMT'}</span>
          <span className="text-slate-700">•</span>
          <span 
            className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider shrink-0 ${
              marketOpen 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
            title={marketOpen ? "Ghana Stock Exchange Trading Floor is OPEN" : "Ghana Stock Exchange is CLOSED"}
          >
            <span className={`w-1 h-1 rounded-full ${marketOpen ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span>{marketOpen ? 'OPEN' : 'CLOSED'}</span>
          </span>
        </div>

        {/* Right: USD/GHS Rate & Macro Telemetry */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          <button
            type="button"
            onClick={onOpenExchangeRateModal}
            className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer group text-[10px] sm:text-[11px] shrink-0"
            title="View Real-Time FX Conversion & Benchmark History"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0" />
            <span className="text-slate-400 group-hover:text-amber-300">USD/GHS</span>
            <span className="text-amber-400 font-bold">GH₵ {exchangeRateUsd.toFixed(2)}</span>
            <ArrowRightLeft className="w-2.5 h-2.5 text-slate-500 group-hover:text-amber-300 shrink-0" />
          </button>

          {/* Cocoa & Gold Spot (desktop only) */}
          <div className="flex items-center gap-3 hidden sm:flex text-slate-400 shrink-0">
            <span>COCOA: <strong className="text-slate-200">$7,850/t</strong></span>
            <span>GOLD: <strong className="text-slate-200">$2,490/oz</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Main Executive Header Bar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-3 w-full overflow-hidden">
        {/* Left: Brand Identity & Mobile Menu Bar Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink min-w-0">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="p-1.5 rounded-xl bg-[#0B132B] border border-white/[0.08] text-slate-300 hover:text-white hover:border-amber-500/40 md:hidden flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-amber-400" />
            </button>
          )}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#080E20] rounded-[8px] sm:rounded-[9px] flex items-center justify-center overflow-hidden p-0.5">
                <RisingCediLogo size={18} showBadge={false} className="shrink-0" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <h1 className="text-xs sm:text-lg font-black text-white tracking-tight flex items-center gap-1 truncate">
                  <span>MERIDIAN</span>
                  <span className="text-amber-400 hidden sm:inline">EQUITIES</span>
                </h1>
                <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hidden md:inline-block shrink-0">
                  GSE TERMINAL
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 hidden sm:block truncate">
                Ghana Stock Exchange • Global Asset Desks • Institutional Analytics
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Command Palette & Global Search (Desktop only) */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-2 hidden md:block">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="w-full bg-[#0B132B] hover:bg-[#0F1A3A] border border-white/[0.08] hover:border-amber-500/50 rounded-xl px-3.5 py-1.5 text-xs text-slate-400 hover:text-white flex items-center justify-between transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
              <span className="font-sans text-xs">Search stocks, desks, tools...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-slate-400 group-hover:text-white border border-white/10">
              <span>⌘K</span>
            </kbd>
          </button>
        </div>

        {/* Right: Actions Cluster (Clean, Guaranteed Mobile Fit) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Meridian AI Quick Launch (desktop/tablet) */}
          {onOpenMeridianAI && (
            <button
              type="button"
              onClick={onOpenMeridianAI}
              className="hidden sm:flex px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-black items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95 group shrink-0"
              title="Launch Meridian AI Research Desk"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="font-mono">AI DESK</span>
            </button>
          )}

          {/* Visible GO PRO Upgrade Button (desktop/tablet) */}
          {onOpenSubscriptionModal && (
            <button
              type="button"
              onClick={onOpenSubscriptionModal}
              className={`hidden sm:flex px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95 group shrink-0 ${
                subscriptionTier && subscriptionTier !== 'FREE'
                  ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/40 text-purple-300 hover:border-purple-300 shadow-purple-500/10'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-amber-500/25 hover:shadow-amber-500/40'
              }`}
              title={
                subscriptionTier && subscriptionTier !== 'FREE'
                  ? `Active Plan: ${subscriptionTier} • Click to manage`
                  : 'Upgrade to Meridian PRO for advanced tools, statement export & real-time alerts'
              }
            >
              <Crown className={`w-3.5 h-3.5 ${subscriptionTier && subscriptionTier !== 'FREE' ? 'text-purple-400 fill-purple-400' : 'text-slate-950 fill-slate-950'}`} />
              <span className="tracking-tight">
                {subscriptionTier && subscriptionTier !== 'FREE' ? `${subscriptionTier}` : 'GO PRO'}
              </span>
            </button>
          )}

          {/* 1. Currency Toggle (GHS / USD) */}
          <button
            id="currency-toggle-btn"
            type="button"
            onClick={onToggleCurrency}
            className="px-2 py-1 sm:py-1.5 rounded-xl bg-[#0B132B] border border-white/[0.08] hover:border-slate-600 text-[11px] sm:text-xs font-mono font-bold text-amber-400 flex items-center gap-0.5 transition-all cursor-pointer shrink-0"
            title="Toggle Base Currency (GHS ₵ / USD $)"
          >
            <span>{currency === 'GHS' ? '₵' : '$'}</span>
            <span className="hidden sm:inline">{currency === 'GHS' ? 'GHS' : 'USD'}</span>
          </button>

          {/* 2. Price Alerts Bell Button */}
          <button
            type="button"
            onClick={onOpenAlertsModal}
            className={`p-1.5 sm:p-2 rounded-xl border transition-colors relative cursor-pointer shrink-0 ${
              triggeredAlertsCount > 0
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                : alertsCount > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                : 'bg-[#0B132B] border-white/[0.08] text-slate-400 hover:text-white hover:border-slate-600'
            }`}
            title="Price Alerts Center"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-500 text-slate-950 font-mono text-[8px] sm:text-[9px] font-black flex items-center justify-center">
                {alertsCount}
              </span>
            )}
          </button>

          {/* 3. Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 sm:p-2 rounded-xl bg-[#0B132B] border border-white/[0.08] hover:border-slate-600 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin text-amber-400' : 'text-slate-300'}`} />
          </button>

          {/* 4. User Profile / Verification Button */}
          {onOpenAuthModal && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                userProfile?.isVerified
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-[#0B132B] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
              title={userProfile?.isVerified ? `${userProfile.name} • Account & Profile Settings` : 'Sign In / Create Account'}
            >
              {userProfile?.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full object-cover" />
              ) : (
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          )}

          {/* Theme Toggle (Desktop only) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-[#0B132B] border border-slate-700/80 hover:border-slate-600 text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:flex items-center justify-center shrink-0"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};
