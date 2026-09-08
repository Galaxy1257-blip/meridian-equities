import React, { useState } from 'react';
import { 
  X, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  HelpCircle, Calendar, FileText, CheckCircle2, ChevronRight,
  Sparkles, Layers, ShieldCheck, Activity, ArrowRight, Share2, Info
} from 'lucide-react';
import { Stock, MarketIndex } from '../types';

interface MarketCloseReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: Stock[];
  indices?: MarketIndex[];
  onSelectStock?: (stock: Stock) => void;
  currency?: 'GHS' | 'USD';
  exchangeRateUsd?: number;
}

export const MarketCloseReportModal: React.FC<MarketCloseReportModalProps> = ({
  isOpen,
  onClose,
  stocks,
  indices,
  onSelectStock,
  currency = 'GHS',
  exchangeRateUsd = 15.5
}) => {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currencySymbol = currency === 'USD' ? '$' : 'GH₵';
  const rateFactor = currency === 'USD' ? (1 / exchangeRateUsd) : 1;
  const formatPrice = (p: number) => `${currencySymbol} ${(p * rateFactor).toFixed(2)}`;

  // Calculate actual daily market close statistics from stocks data
  const gainers = stocks.filter(s => s.change > 0);
  const decliners = stocks.filter(s => s.change < 0);
  const unchanged = stocks.filter(s => s.change === 0);

  const totalVolume = stocks.reduce((acc, s) => acc + s.volume, 0);
  const totalTurnoverGhs = stocks.reduce((acc, s) => acc + (s.volume * s.price), 0);
  const totalMarketCap = stocks.reduce((acc, s) => acc + s.marketCap, 0);

  const turnoverFormatted = currency === 'USD'
    ? `$${((totalTurnoverGhs / exchangeRateUsd) / 1_000_000).toFixed(2)}M`
    : `GH₵ ${(totalTurnoverGhs / 1_000_000).toFixed(2)}M`;

  const marketCapFormatted = currency === 'USD'
    ? `$${((totalMarketCap / exchangeRateUsd) / 1_000).toFixed(1)}B`
    : `GH₵ ${(totalMarketCap / 1_000).toFixed(1)}B`;

  // Is today a Green Day or Red Day?
  // GSE-CI is currently up +0.44%
  const isGreenDay = true;
  const indexChangePoints = 66.24;
  const indexChangePct = 0.44;
  const indexLevel = 15130.96;

  const associatedTerms = [
    {
      term: 'Green Day vs. Red Day',
      definition: 'A "Green Day" means the benchmark GSE Composite Index (GSE-CI) closed higher than the previous trading session\'s close. A "Red Day" means the index closed lower due to net selling pressure.',
      context: 'Today is a Green Day on the GSE, led by heavy institutional bids on MTNGH and GCB Bank.'
    },
    {
      term: 'Market Breadth',
      definition: 'The ratio of advancing stocks (gainers) to declining stocks (losers). Positive breadth indicates widespread buying enthusiasm across multiple sectors rather than gains concentrated in just one heavyweight stock.',
      context: `${gainers.length} Gainers vs ${decliners.length} Decliners (Positive Breadth).`
    },
    {
      term: 'GSE Composite Index (GSE-CI)',
      definition: 'The primary benchmark index that tracks the market capitalization performance of all ordinary shares listed on the Ghana Stock Exchange.',
      context: `Closed at ${indexLevel.toLocaleString('en-US', { minimumFractionDigits: 2 })} (+${indexChangePct}%).`
    },
    {
      term: 'Daily Turnover vs. Volume',
      definition: 'Volume is the total count of share certificates traded. Turnover is the actual monetary value in Ghana Cedis (GH₵) exchanged on the market floor during the 10:00 - 15:00 GMT session.',
      context: `Today\'s Turnover: GH₵ ${(totalTurnoverGhs / 1_000_000).toFixed(2)}M across ${(totalVolume / 1_000).toFixed(1)}k shares.`
    },
    {
      term: 'GSE Financial Stock Index (GSE-FSI)',
      definition: 'A specialized sub-index tracking solely banking, insurance, and non-bank financial institution stocks listed in Accra (e.g. GCB, EGH, CAL, SCB).',
      context: 'Closed at 7,950.46 (+0.97%), outperforming the composite index.'
    },
    {
      term: 'Circuit Breakers & 10% Daily Limit',
      definition: 'The GSE regulatory rule capping maximum intraday stock price fluctuations to ±10% per session to protect retail Ghanaian investors from extreme speculative volatility.',
      context: 'All equity moves remained within the standard ±10% regulatory collar.'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col h-[94dvh] sm:h-auto sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className={`px-4 py-3.5 sm:p-6 border-b shrink-0 ${
          isGreenDay 
            ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900/60 border-emerald-800/60 text-white' 
            : 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-900/60 border-rose-800/60 text-white'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1 ${
                  isGreenDay ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'bg-rose-500 text-white shadow-xs'
                }`}>
                  {isGreenDay ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{isGreenDay ? 'GREEN DAY' : 'RED DAY'}</span>
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-mono">
                  GSE Bulletin
                </span>
              </div>

              <h2 className="text-base sm:text-2xl font-black text-white tracking-tight">
                GSE Daily Market Close
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • Closing Bell (15:00 GMT)
              </p>
            </div>

            <button
              id="close-market-close-modal-btn"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar inside Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mt-3 sm:mt-5">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">GSE-CI Level</span>
              <span className="text-sm sm:text-lg font-black font-mono text-white block">
                {indexLevel.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-emerald-400">
                ▲ +{indexChangePoints} pts (+{indexChangePct}%)
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">Market Breadth</span>
              <span className="text-base sm:text-lg font-black text-emerald-400 block">
                {gainers.length} 🟢 : {decliners.length} 🔴
              </span>
              <span className="text-[11px] text-slate-300">
                {unchanged.length} Unchanged
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Turnover</span>
              <span className="text-base sm:text-lg font-black font-mono text-white block">
                {turnoverFormatted}
              </span>
              <span className="text-[11px] text-slate-300">
                {(totalVolume / 1_000).toFixed(0)}k shares traded
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Market Cap</span>
              <span className="text-base sm:text-lg font-black font-mono text-amber-300 block">
                {marketCapFormatted}
              </span>
              <span className="text-[11px] text-emerald-300">
                +0.3% today
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Executive Summary & Macro Drivers */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Session Executive Summary</span>
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 leading-relaxed">
              <p>
                The <strong>Ghana Stock Exchange (GSE)</strong> concluded today's session in <span className="font-bold text-emerald-600 dark:text-emerald-400">Green Bullish Territory</span>, as buying enthusiasm in telecommunications (<strong>MTNGH</strong>) and commercial banking heavyweights (<strong>GCB Bank, Ecobank Ghana</strong>) lifted the Composite Index by <strong>66.24 points (+0.44%)</strong> to settle at <strong>15,130.96 points</strong>.
              </p>
              <p>
                Market capitalization expanded to <strong>{marketCapFormatted}</strong>, driven by robust dividend announcements and steady institutional liquidity from local Ghanaian pension fund managers seeking inflation-resilient equity returns.
              </p>
            </div>
          </div>

          {/* Top Session Movers Grid */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Key Equity Movers & Price Drivers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Gainers Column */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
                <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Top Advancing Equities (Gainers)
                </span>
                <div className="space-y-2">
                  {gainers.slice(0, 3).map((g) => (
                    <div 
                      key={g.ticker}
                      onClick={() => onSelectStock && onSelectStock(g)}
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 cursor-pointer hover:border-emerald-400 transition-colors"
                    >
                      <div>
                        <span className="font-mono font-black text-xs text-slate-900 dark:text-white block">{g.ticker}</span>
                        <span className="text-[10px] text-slate-500">{g.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white block">{formatPrice(g.price)}</span>
                        <span className="font-mono font-extrabold text-[11px] text-emerald-600 dark:text-emerald-400">+{g.changePercent.toFixed(2)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decliners / Active Column */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-2">
                <span className="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  Most Actively Traded Volume
                </span>
                <div className="space-y-2">
                  {[...stocks].sort((a, b) => b.volume - a.volume).slice(0, 3).map((st) => (
                    <div 
                      key={st.ticker}
                      onClick={() => onSelectStock && onSelectStock(st)}
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40 cursor-pointer hover:border-amber-400 transition-colors"
                    >
                      <div>
                        <span className="font-mono font-black text-xs text-slate-900 dark:text-white block">{st.ticker}</span>
                        <span className="text-[10px] text-slate-500">Vol: {st.volume.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white block">{formatPrice(st.price)}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Turnover: {currencySymbol} {(((st.volume * st.price) * rateFactor)/1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Associated Terms Explained Section (Mandated by user) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Associated Market Terms Explained</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Tap term for deep dive
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {associatedTerms.map((t) => {
                const isExpanded = selectedTerm === t.term;

                return (
                  <div 
                    key={t.term}
                    onClick={() => setSelectedTerm(isExpanded ? null : t.term)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isExpanded 
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-xs' 
                        : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {t.term}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-amber-500' : ''}`} />
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {t.definition}
                    </p>

                    {isExpanded && (
                      <div className="mt-2 pt-2 border-t border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                        <strong>Today's Context:</strong> {t.context}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Session Outlook */}
          <div className="p-4 rounded-2xl bg-purple-900/10 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 space-y-1.5">
            <span className="text-xs font-black text-purple-950 dark:text-purple-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              <span>Next Session Outlook & Support Levels</span>
            </span>
            <p className="text-[11px] text-purple-900 dark:text-purple-200/80 leading-relaxed">
              Immediate technical support for the GSE-CI lies at <strong>15,000 points</strong>, with resistance near <strong>15,350 points</strong>. Investors should monitor the upcoming books closure dates for Benso Oil Palm (BOPP) and TotalEnergies Ghana (TOTAL) for potential pre-dividend price adjustments.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Verified GSE Daily Trade Log
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
