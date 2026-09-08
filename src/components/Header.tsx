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
      <div className="bg-[#03060F] border-b border-white/[0.08] px-3 sm:px-6 py-1.5 overflow-x-auto no-scrollbar flex items-center justify-between gap-4 text-[11px] font-mono select-none">
        {/* Left: GSE Live Clock & Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <span className={`w-2 h-2 rounded-full ${marketOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{currentTimeGmt || '12:00 GMT'}</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span 
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
              marketOpen 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs shadow-emerald-500/10' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
            title={marketOpen ? "Ghana Stock Exchange Trading Floor is OPEN (09:30 - 15:00 GMT)" : "Ghana Stock Exchange is CLOSED (Opens Mon-Fri 09:30 GMT)"}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${marketOpen ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span>{marketOpen ? 'MARKET IS OPEN' : 'MARKET CLOSED'}</span>
          </span>
        </div>

        {/* Middle: USD/GHS Rate & Key Macro Telemetry (Clean & Non-Redundant) */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* USD/GHS Rate */}
          <button
            type="button"
            onClick={onOpenExchangeRateModal}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer group"
            title="View Real-Time FX Conversion & Benchmark History"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-slate-400 group-hover:text-amber-300">USD/GHS</span>
            <span className="text-amber-400 font-black">GH₵ {exchangeRateUsd.toFixed(2)}</span>
            <ArrowRightLeft className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
          </button>

          {/* Cocoa & Gold Spot */}
          <div className="flex items-center gap-3 hidden sm:flex text-slate-400">
            <span>COCOA: <strong className="text-slate-200">$7,850/t</strong></span>
            <span>GOLD: <strong className="text-slate-200">$2,490/oz</strong></span>
          </div>
        </div>


      </div>

      {/* 2. Main Executive Header Bar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Left: Brand Identity & Mobile Menu Bar Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="p-1.5 sm:p-2 rounded-xl bg-[#0B132B] border border-white/[0.08] text-slate-300 hover:text-white hover:border-cyan-500/40 md:hidden flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-amber-400" />
            </button>
          )}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#080E20] rounded-[9px] sm:rounded-[10px] flex items-center justify-center overflow-hidden p-0.5">
                <RisingCediLogo size={22} showBadge={false} className="shrink-0" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-xs sm:text-lg font-black text-white tracking-tight flex items-center gap-1 truncate">
                  <span>MERIDIAN</span>
                  <span className="text-amber-400">EQUITIES</span>
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

        {/* Middle: Command Palette & Global Search */}
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

        {/* Right: Actions Cluster */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile Command Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 md:hidden flex items-center justify-center cursor-pointer"
              title="Search and Commands"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}

          {/* Meridian AI Quick Launch (desktop/tablet) */}
          {onOpenMeridianAI && (
            <button
              type="button"
              onClick={onOpenMeridianAI}
              className="hidden sm:flex px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-black items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95 group"
              title="Launch Meridian AI Research Desk"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="font-mono">AI DESK</span>
            </button>
          )}

          {/* Visible GO PRO Upgrade Button */}
          {onOpenSubscriptionModal && (
            <button
              type="button"
              onClick={onOpenSubscriptionModal}
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95 group ${
                subscriptionTier && subscriptionTier !== 'FREE'
                  ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/40 text-purple-300 hover:border-purple-300 shadow-purple-500/10'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.03]'
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

          {/* Currency Toggle (GHS / USD) */}
          <button
            id="currency-toggle-btn"
            type="button"
            onClick={onToggleCurrency}
            className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-[#0B132B] border border-white/[0.08] hover:border-slate-600 text-[10px] sm:text-xs font-mono font-bold text-amber-400 flex items-center gap-0.5 sm:gap-1 transition-all cursor-pointer"
            title="Toggle Base Currency (GHS ₵ / USD $)"
          >
            <span>{currency === 'GHS' ? '₵' : '$'}</span>
            <span className="hidden xs:inline">{currency === 'GHS' ? 'GHS' : 'USD'}</span>
          </button>

          {/* Price Alerts Button */}
          <button
            type="button"
            onClick={onOpenAlertsModal}
            className={`p-1.5 sm:p-2 rounded-xl border transition-colors relative cursor-pointer ${
              triggeredAlertsCount > 0
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                : alertsCount > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                : 'bg-[#0B132B] border-white/[0.08] text-slate-400 hover:text-white hover:border-slate-600'
            }`}
            title="Price Alerts Center"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-500 text-slate-950 font-mono text-[8px] sm:text-[9px] font-black flex items-center justify-center">
                {alertsCount}
              </span>
            )}
          </button>

          {/* User Profile / Verification Button - NO CHAT USERNAME DISPLAYED */}
          {onOpenAuthModal && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
                userProfile?.isVerified
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-[#0B132B] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
              title={userProfile?.isVerified ? `${userProfile.name} • Account & Profile Settings` : 'Sign In / Create Account'}
            >
              {userProfile?.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt="" className="w-4 h-4 rounded-full object-cover" />
              ) : (
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          )}

          {/* Theme Toggle (hidden on small phone viewports) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-[#0B1329] border border-slate-700/80 hover:border-slate-600 text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:flex items-center justify-center"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />}
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 sm:p-2 rounded-xl bg-[#0B1329] border border-slate-700/80 hover:border-slate-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
