import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  TrendingUp, 
  Briefcase, 
  Newspaper, 
  MessageSquare, 
  Users, 
  Calculator, 
  BookOpen, 
  Home, 
  Sparkles, 
  ArrowRightLeft, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  HelpCircle, 
  Moon, 
  Sun, 
  DollarSign, 
  Sliders, 
  CornerDownLeft, 
  X,
  ArrowUpRight,
  ArrowDownRight,
  Building2
} from 'lucide-react';
import { Stock, MainNavTab } from '../types';
import { StockLogo } from './StockLogo';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: Stock[];
  currency: 'GHS' | 'USD';
  exchangeRateUsd: number;
  showPro: boolean;
  theme: 'dark' | 'light';
  onSelectStock: (stock: Stock) => void;
  onNavigateTab: (tab: MainNavTab) => void;
  onOpenMeridianAI: () => void;
  onOpenFXShield: () => void;

  onLockBiometric: () => void;
  onOpenDividendCalendar: () => void;
  onOpenJargon: (id: string) => void;
  onOpenBrokers?: () => void;
  onToggleCurrency: () => void;
  onTogglePro: () => void;
  onToggleTheme: () => void;
  onRefresh: () => void;
}

interface PaletteAction {
  id: string;
  category: 'Desks & Navigation' | 'Terminal Engines & Tools' | 'Preferences & Operations';
  label: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  stocks,
  currency,
  exchangeRateUsd,
  showPro,
  theme,
  onSelectStock,
  onNavigateTab,
  onOpenMeridianAI,
  onOpenFXShield,

  onLockBiometric,
  onOpenDividendCalendar,
  onOpenJargon,
  onOpenBrokers,
  onToggleCurrency,
  onTogglePro,
  onToggleTheme,
  onRefresh
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Actions list
  const actions: PaletteAction[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-home',
      category: 'Desks & Navigation',
      label: 'Executive Cockpit',
      subtitle: 'Market overview, indices pulse, fundamental leaders',
      icon: Home,
      iconColor: 'text-cyan-400',
      action: () => onNavigateTab('home')
    },
    {
      id: 'nav-markets',
      category: 'Desks & Navigation',
      label: 'Equities Screener',
      subtitle: 'Browse & filter GSE 31 + global stocks in table or grid',
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      action: () => onNavigateTab('markets')
    },
    {
      id: 'nav-portfolio',
      category: 'Desks & Navigation',
      label: 'Position Book (Portfolio)',
      subtitle: 'Track cost basis, unrealized P&L, contract notes',
      icon: Briefcase,
      iconColor: 'text-amber-400',
      action: () => onNavigateTab('portfolio')
    },
    {
      id: 'nav-news',
      category: 'Desks & Navigation',
      label: 'Disclosures & Financial News',
      subtitle: 'Audited filings, earnings releases, dividend notices',
      icon: Newspaper,
      iconColor: 'text-blue-400',
      action: () => onNavigateTab('news')
    },
    {
      id: 'nav-chat',
      category: 'Desks & Navigation',
      label: 'Investor Live Desk',
      subtitle: 'Real-time discussions with verified market participants',
      icon: MessageSquare,
      iconColor: 'text-purple-400',
      action: () => onNavigateTab('chat')
    },
    {
      id: 'nav-community',
      category: 'Desks & Navigation',
      label: 'Community Sentiment & Signals',
      subtitle: 'Trending tickers, bulls vs bears, market pulse',
      icon: Users,
      iconColor: 'text-teal-400',
      action: () => onNavigateTab('community')
    },
    {
      id: 'nav-calc',
      category: 'Desks & Navigation',
      label: 'Financial Calculation Engines',
      subtitle: 'Compound interest, dividend reinvestment, loan amortization',
      icon: Calculator,
      iconColor: 'text-orange-400',
      action: () => onNavigateTab('calculators')
    },
    {
      id: 'nav-learn',
      category: 'Desks & Navigation',
      label: 'GSE Academy',
      subtitle: 'Stock market fundamentals, jargon guides, tutorials',
      icon: BookOpen,
      iconColor: 'text-indigo-400',
      action: () => onNavigateTab('learn')
    },

    // Tools
    {
      id: 'tool-ai',
      category: 'Terminal Engines & Tools',
      label: 'Meridian AI Research Assistant',
      subtitle: 'Local instant financial intelligence & stock explanations',
      icon: Sparkles,
      iconColor: 'text-cyan-400',
      action: onOpenMeridianAI
    },
    {
      id: 'tool-fx-shield',
      category: 'Terminal Engines & Tools',
      label: 'USD to Cedi Transfer & Remittance Calculator',
      subtitle: 'Calculate real Cedi payouts after hidden bank markups, wire fees & taxes',
      icon: ArrowRightLeft,
      iconColor: 'text-amber-400',
      action: onOpenFXShield
    },

    {
      id: 'tool-dividend-calendar',
      category: 'Terminal Engines & Tools',
      label: 'GSE Dividend Calendar',
      subtitle: 'Upcoming record dates, payment schedules, and cash yields',
      icon: Calendar,
      iconColor: 'text-emerald-400',
      action: onOpenDividendCalendar
    },
    {
      id: 'tool-jargon',
      category: 'Terminal Engines & Tools',
      label: 'Financial Glossary & Jargon Explainer',
      subtitle: 'P/E ratios, beta, liquidity, market cap clarified',
      icon: HelpCircle,
      iconColor: 'text-purple-400',
      action: () => onOpenJargon('liquidity')
    },
    {
      id: 'tool-biometric',
      category: 'Terminal Engines & Tools',
      label: 'Lock Terminal (Biometric Sandbox)',
      subtitle: 'Secure terminal session with 4-digit PIN / FaceID',
      icon: Lock,
      iconColor: 'text-rose-400',
      action: onLockBiometric
    },
    ...(onOpenBrokers ? [{
      id: 'tool-stock-brokers',
      category: 'Terminal Engines & Tools' as const,
      label: 'GSE Licensed Stock Brokers Directory',
      subtitle: 'Accredited SEC dealing members, CSD accounts, MoMo brokers & contacts',
      icon: Building2,
      iconColor: 'text-emerald-400',
      action: onOpenBrokers
    }] : []),

    // Preferences
    {
      id: 'pref-currency',
      category: 'Preferences & Operations',
      label: `Switch Currency to ${currency === 'GHS' ? 'USD ($)' : 'GHS (GH₵)'}`,
      subtitle: `Currently displaying in ${currency}. FX Rate: 1 USD = GH₵ ${exchangeRateUsd.toFixed(2)}`,
      icon: DollarSign,
      iconColor: 'text-amber-400',
      action: onToggleCurrency
    },
    {
      id: 'pref-pro',
      category: 'Preferences & Operations',
      label: `Switch Mode to ${showPro ? 'Beginner / Easy Mode' : 'Institutional / Pro Mode'}`,
      subtitle: showPro ? 'Simplify financial terminology across the terminal' : 'Show full institutional metrics (Beta, P/E, SMA, Liquidity)',
      icon: Sliders,
      iconColor: 'text-cyan-400',
      action: onTogglePro
    },
    {
      id: 'pref-theme',
      category: 'Preferences & Operations',
      label: `Switch to ${theme === 'dark' ? 'Light Theme' : 'Dark Obsidian Theme'}`,
      subtitle: `Current theme: ${theme}`,
      icon: theme === 'dark' ? Sun : Moon,
      iconColor: theme === 'dark' ? 'text-amber-400' : 'text-slate-400',
      action: onToggleTheme
    },
  ], [
    currency, exchangeRateUsd, showPro, theme, 
    onNavigateTab, onOpenMeridianAI, onOpenFXShield, 
    onLockBiometric, onOpenDividendCalendar, onOpenJargon, onToggleCurrency, 
    onTogglePro, onToggleTheme
  ]);

  // Filter stocks
  const matchingStocks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return stocks.filter((s) => 
      s.ticker.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query, stocks]);

  // Filter actions
  const matchingActions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) =>
      a.label.toLowerCase().includes(q) ||
      (a.subtitle && a.subtitle.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q)
    );
  }, [query, actions]);

  // Total selectable items
  const totalItems = matchingStocks.length + matchingActions.length;

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (totalItems === 0 ? 0 : (prev + 1) % totalItems));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (totalItems === 0 ? 0 : (prev - 1 + totalItems) % totalItems));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (totalItems === 0) return;

        if (selectedIndex < matchingStocks.length) {
          const s = matchingStocks[selectedIndex];
          onSelectStock(s);
          onClose();
        } else {
          const actionIdx = selectedIndex - matchingStocks.length;
          const a = matchingActions[actionIdx];
          if (a) {
            a.action();
            onClose();
          }
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, totalItems, matchingStocks, matchingActions, onSelectStock, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#040814]/85 backdrop-blur-md flex items-start justify-center pt-2 sm:pt-16 pb-3 px-2 sm:px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#080E24] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[82vh] shadow-[0_0_50px_-10px_rgba(6,182,212,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 border-b border-white/[0.08] bg-[#060B1A]">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search stocks (MTNGH, GCB), desks, tools..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white cursor-pointer"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {/* Explicit X Close button for mobile and desktop */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer shrink-0 flex items-center gap-1 border border-white/10"
            aria-label="Close search"
            title="Close Search"
          >
            <X className="w-4 h-4 text-white" />
            <span className="text-[11px] font-mono font-bold hidden sm:inline">CLOSE</span>
          </button>
        </div>

        {/* Results Body */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
          {totalItems === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching stocks, desks, or commands found for &ldquo;{query}&rdquo;.
            </div>
          )}

          {/* Matching Stocks Group */}
          {matchingStocks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-400/80">
                GSE & Global Equities
              </div>
              <div className="mt-1 space-y-1">
                {matchingStocks.map((stock, idx) => {
                  const isSelected = selectedIndex === idx;
                  const priceFormatted = currency === 'USD' 
                    ? `$${(stock.price / exchangeRateUsd).toFixed(2)}`
                    : `GH₵ ${stock.price.toFixed(2)}`;
                  const isPositive = stock.change >= 0;

                  return (
                    <button
                      key={stock.ticker}
                      type="button"
                      onClick={() => {
                        onSelectStock(stock);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left ${
                        isSelected 
                          ? 'bg-cyan-500/15 border border-cyan-500/30 text-white shadow-xs' 
                          : 'hover:bg-white/[0.04] text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <StockLogo ticker={stock.ticker} size={32} className="shrink-0" />
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-white">{stock.ticker}</span>
                            <span className="text-[11px] text-slate-400 font-medium truncate">{stock.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{stock.sector}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-xs text-white tabular-nums">{priceFormatted}</div>
                        <div className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          <span>{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Actions / Navigation Group */}
          {matchingActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">
                Commands, Desks & Tools
              </div>
              <div className="mt-1 space-y-1">
                {matchingActions.map((action, idx) => {
                  const itemIndex = matchingStocks.length + idx;
                  const isSelected = selectedIndex === itemIndex;
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => {
                        action.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left ${
                        isSelected 
                          ? 'bg-cyan-500/15 border border-cyan-500/30 text-white shadow-xs' 
                          : 'hover:bg-white/[0.04] text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg bg-white/5 ${action.iconColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-white truncate">{action.label}</div>
                          {action.subtitle && (
                            <div className="text-[11px] text-slate-400 truncate">{action.subtitle}</div>
                          )}
                        </div>
                      </div>

                      <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-500">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </kbd>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Quick Controls Guide */}
        <div className="px-3 sm:px-4 py-2.5 border-t border-white/10 bg-[#050A18] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[9px] text-slate-300">↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[9px] text-slate-300">↵</kbd>
              <span>Open</span>
            </span>
            <span className="sm:hidden text-[10px] text-slate-300">
              Tap any result to view details
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close (X)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
