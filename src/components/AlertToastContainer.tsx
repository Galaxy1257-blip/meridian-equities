import React from 'react';
import { 
  Bell, X, ArrowUpRight, ArrowDownRight, ChevronRight, Radio, Clock, 
  TrendingUp, TrendingDown, Newspaper, Sparkles, Gift
} from 'lucide-react';
import { AlertNotification, Stock } from '../types';

interface AlertToastContainerProps {
  notifications: AlertNotification[];
  onDismiss: (id: string) => void;
  onSelectStock: (stock: Stock) => void;
  stocks: Stock[];
  onOpenAlertsModal: () => void;
  onViewMarkets?: () => void;
  onViewPortfolio?: () => void;
  onViewNews?: (newsId?: string) => void;
}

export const AlertToastContainer: React.FC<AlertToastContainerProps> = ({
  notifications,
  onDismiss,
  onSelectStock,
  stocks,
  onOpenAlertsModal,
  onViewMarkets,
  onViewPortfolio,
  onViewNews
}) => {
  if (notifications.length === 0) return null;

  // Show at most the top 3 most recent toasts to prevent screen clutter
  const visibleNotifications = notifications.slice(0, 3);
  const remainingCount = notifications.length - visibleNotifications.length;

  return (
    <div className="fixed top-20 left-3 right-3 sm:left-auto sm:right-4 sm:w-[340px] z-50 space-y-2 pointer-events-none select-none">
      {visibleNotifications.map((n) => {
        // 1. Market Open / Close notification
        if (n.type === 'MARKET_OPEN' || n.type === 'MARKET_CLOSE') {
          const isOpen = n.type === 'MARKET_OPEN';
          return (
            <div
              key={n.id}
              className="pointer-events-auto group relative overflow-hidden rounded-2xl border border-white/10 bg-[#080E24]/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-3 flex flex-col gap-2 transition-all duration-200 hover:border-white/20 animate-in slide-in-from-top-3 fade-in duration-300"
            >
              {/* Sleek top accent gradient */}
              <div 
                className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
                  isOpen 
                    ? 'from-emerald-400 via-teal-300 to-cyan-400' 
                    : 'from-amber-400 via-purple-400 to-rose-400'
                }`} 
              />

              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                    isOpen 
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  }`}>
                    {isOpen ? <Radio className="w-4 h-4 animate-pulse" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                      <span className={`text-[9px] font-mono font-bold tracking-wider uppercase truncate ${
                        isOpen ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {isOpen ? 'FLOOR IS OPEN' : 'FLOOR CLOSED'}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-white truncate">
                      {n.title || (isOpen ? 'Trading Floor Active' : 'After-Hours Desk')}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => onDismiss(n.id)}
                  className="shrink-0 -mr-1 -mt-1 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Dismiss notification"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Message */}
              {n.message && (
                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 px-0.5">
                  {n.message}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 pt-0.5">
                {onViewMarkets && (
                  <button
                    onClick={() => {
                      onViewMarkets();
                      onDismiss(n.id);
                    }}
                    className={`flex-1 py-1.5 px-2.5 rounded-xl text-slate-950 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm ${
                      isOpen 
                        ? 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20' 
                        : 'bg-amber-400 hover:bg-amber-300 shadow-amber-500/20'
                    }`}
                  >
                    <span>View Markets</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => onDismiss(n.id)}
                  className="py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-semibold transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        }

        // 2. Portfolio Milestone & Dividend Reminders
        if (n.type === 'PORTFOLIO_MILESTONE' || n.type === 'DIVIDEND_REMINDER') {
          const isDividend = n.type === 'DIVIDEND_REMINDER';
          return (
            <div
              key={n.id}
              className="pointer-events-auto group relative overflow-hidden rounded-2xl border border-white/10 bg-[#080E24]/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-3 flex flex-col gap-2 transition-all duration-200 hover:border-white/20 animate-in slide-in-from-top-3 fade-in duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400" />

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    {isDividend ? <Gift className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-emerald-400 truncate">
                        {isDividend ? 'DIVIDEND ALERT' : 'PORTFOLIO MILESTONE'}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-white truncate">
                      {n.title || (isDividend ? 'Upcoming Distribution' : 'Target Reached')}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => onDismiss(n.id)}
                  className="shrink-0 -mr-1 -mt-1 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Dismiss notification"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {n.message && (
                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 px-0.5">
                  {n.message}
                </p>
              )}

              <div className="flex items-center gap-1.5 pt-0.5">
                {onViewPortfolio && (
                  <button
                    onClick={() => {
                      onViewPortfolio();
                      onDismiss(n.id);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm shadow-emerald-500/20"
                  >
                    <span>View Portfolio</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => onDismiss(n.id)}
                  className="py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-semibold transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        }

        // 3. Major News Alert
        if (n.type === 'MAJOR_NEWS') {
          return (
            <div
              key={n.id}
              className="pointer-events-auto group relative overflow-hidden rounded-2xl border border-white/10 bg-[#080E24]/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-3 flex flex-col gap-2 transition-all duration-200 hover:border-white/20 animate-in slide-in-from-top-3 fade-in duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400" />

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-cyan-400 truncate">
                        GSE BREAKING NEWS
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-white truncate">
                      {n.title || 'Market Filing'}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => onDismiss(n.id)}
                  className="shrink-0 -mr-1 -mt-1 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Dismiss notification"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {n.message && (
                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 px-0.5">
                  {n.message}
                </p>
              )}

              <div className="flex items-center gap-1.5 pt-0.5">
                {onViewNews && (
                  <button
                    onClick={() => {
                      onViewNews(n.newsId);
                      onDismiss(n.id);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm shadow-cyan-500/20"
                  >
                    <span>Read Story</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => onDismiss(n.id)}
                  className="py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-semibold transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        }

        // 4. Intraday Stock Surge / Dip
        if (n.type === 'STOCK_SURGE') {
          const stock = stocks.find(s => s.ticker === n.ticker);
          const isGain = (stock?.changePercent ?? 0) >= 0;
          return (
            <div
              key={n.id}
              className="pointer-events-auto group relative overflow-hidden rounded-2xl border border-white/10 bg-[#080E24]/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-3 flex flex-col gap-2 transition-all duration-200 hover:border-white/20 animate-in slide-in-from-top-3 fade-in duration-300"
            >
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
                isGain ? 'from-emerald-400 to-teal-300' : 'from-rose-500 to-amber-500'
              }`} />

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                    isGain 
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                  }`}>
                    {isGain ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isGain ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
                      <span className={`text-[9px] font-mono font-bold tracking-wider uppercase truncate ${
                        isGain ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isGain ? 'STOCK SURGE' : 'PRICE DIP'}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-white truncate">
                      {n.stockName || n.ticker} ({n.ticker})
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => onDismiss(n.id)}
                  className="shrink-0 -mr-1 -mt-1 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Dismiss notification"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {n.message && (
                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 px-0.5">
                  {n.message}
                </p>
              )}

              <div className="flex items-center gap-1.5 pt-0.5">
                {stock && (
                  <button
                    onClick={() => {
                      onSelectStock(stock);
                      onDismiss(n.id);
                    }}
                    className={`flex-1 py-1.5 px-2.5 rounded-xl text-slate-950 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm ${
                      isGain 
                        ? 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20' 
                        : 'bg-rose-400 hover:bg-rose-300 shadow-rose-500/20'
                    }`}
                  >
                    <span>Inspect {n.ticker}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => onDismiss(n.id)}
                  className="py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-semibold transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        }

        // 5. Default Price Target Alerts
        const stock = stocks.find(s => s.ticker === n.ticker);
        const isAbove = n.condition === 'ABOVE';

        return (
          <div
            key={n.id}
            className="pointer-events-auto group relative overflow-hidden rounded-2xl border border-white/10 bg-[#080E24]/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-3 flex flex-col gap-2 transition-all duration-200 hover:border-white/20 animate-in slide-in-from-top-3 fade-in duration-300"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500" />

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 animate-bounce" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-amber-400 truncate">
                      PRICE TARGET REACHED
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-white truncate">
                    {n.stockName || n.ticker} ({n.ticker})
                  </h4>
                </div>
              </div>

              <button
                onClick={() => onDismiss(n.id)}
                className="shrink-0 -mr-1 -mt-1 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Compact Price Comparison Strip */}
            <div className="bg-white/[0.04] rounded-xl px-2.5 py-1.5 border border-white/[0.06] text-[11px] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 mr-1.5">Target:</span>
                <span className="font-mono font-bold text-amber-300">
                  {isAbove ? '≥' : '≤'} GH₵ {(n.targetPrice || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 mr-1">Now:</span>
                <span className={`font-mono font-bold flex items-center gap-0.5 ${
                  isAbove ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isAbove ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  GH₵ {(n.actualPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-0.5">
              {stock && (
                <button
                  onClick={() => {
                    onSelectStock(stock);
                    onDismiss(n.id);
                  }}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm shadow-amber-500/20"
                >
                  <span>View Stock</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => {
                  onOpenAlertsModal();
                  onDismiss(n.id);
                }}
                className="py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-semibold transition-all cursor-pointer"
              >
                Manage
              </button>
            </div>
          </div>
        );
      })}

      {/* Overflow pill indicator if more alerts exist */}
      {remainingCount > 0 && (
        <button
          onClick={onOpenAlertsModal}
          className="pointer-events-auto w-full py-1.5 px-3 rounded-xl bg-[#080E24]/90 hover:bg-[#0E1736] border border-white/10 text-slate-300 text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <Bell className="w-3 h-3 text-amber-400" />
          <span>+{remainingCount} more in Alerts Hub</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </button>
      )}
    </div>
  );
};

