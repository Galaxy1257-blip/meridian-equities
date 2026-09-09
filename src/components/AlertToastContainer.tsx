import React, { useEffect } from 'react';
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
  // Auto-dismiss the oldest active toast after 5.5 seconds
  useEffect(() => {
    if (notifications.length === 0) return;
    const latestToast = notifications[0];
    const timer = setTimeout(() => {
      onDismiss(latestToast.id);
    }, 5500);

    return () => clearTimeout(timer);
  }, [notifications, onDismiss]);

  if (notifications.length === 0) return null;

  // Show at most 2 toasts on desktop and 1 on small mobile to avoid obstructing the UI
  const visibleNotifications = notifications.slice(0, 2);
  const remainingCount = notifications.length - visibleNotifications.length;

  return (
    <aside 
      aria-label="Real-time alerts"
      className="fixed top-3 sm:top-4 inset-x-3 sm:inset-x-auto sm:right-4 sm:w-[370px] max-w-sm sm:max-w-md mx-auto sm:mx-0 z-50 space-y-2 pointer-events-none select-none transition-all duration-300"
    >
      {visibleNotifications.map((n) => {
        const stock = n.ticker ? stocks.find((s) => s.ticker === n.ticker) : undefined;

        // Choose styling based on notification type
        let badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
        let accentBorder = 'border-amber-500/40';
        let topGlow = 'from-amber-400 via-amber-500 to-yellow-500';
        let IconComponent = Bell;
        let categoryLabel = 'ALERT';

        if (n.type === 'MARKET_OPEN') {
          badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
          accentBorder = 'border-emerald-500/40';
          topGlow = 'from-emerald-400 via-teal-300 to-cyan-400';
          IconComponent = Radio;
          categoryLabel = 'MARKET OPEN';
        } else if (n.type === 'MARKET_CLOSE') {
          badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
          accentBorder = 'border-amber-500/40';
          topGlow = 'from-amber-400 via-purple-400 to-rose-400';
          IconComponent = Clock;
          categoryLabel = 'MARKET CLOSE';
        } else if (n.type === 'MAJOR_NEWS') {
          badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
          accentBorder = 'border-cyan-500/40';
          topGlow = 'from-cyan-400 via-blue-500 to-indigo-400';
          IconComponent = Newspaper;
          categoryLabel = 'GSE NEWS';
        } else if (n.type === 'PORTFOLIO_MILESTONE' || n.type === 'DIVIDEND_REMINDER') {
          badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
          accentBorder = 'border-emerald-500/40';
          topGlow = 'from-emerald-400 via-teal-300 to-amber-400';
          IconComponent = n.type === 'DIVIDEND_REMINDER' ? Gift : Sparkles;
          categoryLabel = n.type === 'DIVIDEND_REMINDER' ? 'DIVIDEND' : 'PORTFOLIO';
        } else if (n.type === 'STOCK_SURGE') {
          const isGain = (stock?.changePercent ?? 0) >= 0;
          badgeColor = isGain ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40';
          accentBorder = isGain ? 'border-emerald-500/40' : 'border-rose-500/40';
          topGlow = isGain ? 'from-emerald-400 to-teal-300' : 'from-rose-500 to-amber-500';
          IconComponent = isGain ? TrendingUp : TrendingDown;
          categoryLabel = isGain ? 'SURGE' : 'PRICE DIP';
        }

        const handlePrimaryAction = () => {
          if (stock && onSelectStock) {
            onSelectStock(stock);
          } else if (n.type === 'MAJOR_NEWS' && onViewNews) {
            onViewNews(n.newsId);
          } else if ((n.type === 'PORTFOLIO_MILESTONE' || n.type === 'DIVIDEND_REMINDER') && onViewPortfolio) {
            onViewPortfolio();
          } else if ((n.type === 'MARKET_OPEN' || n.type === 'MARKET_CLOSE') && onViewMarkets) {
            onViewMarkets();
          } else {
            onOpenAlertsModal();
          }
          onDismiss(n.id);
        };

        return (
          <div
            key={n.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${accentBorder} bg-[#080E24]/95 backdrop-blur-2xl shadow-xl shadow-black/60 p-2.5 sm:p-3 transition-all duration-300 hover:border-white/30 animate-in slide-in-from-top-2 fade-in duration-200`}
          >
            {/* Top Slim Accent Line */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${topGlow}`} />

            <div className="flex items-center gap-2.5">
              {/* Left: Compact Circular Icon */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${badgeColor}`}>
                <IconComponent className="w-4 h-4" />
              </div>

              {/* Middle: Content with single/two-line truncate */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[8px] sm:text-[9px] font-mono font-bold tracking-wider uppercase px-1 py-0.2 rounded border ${badgeColor}`}>
                    {categoryLabel}
                  </span>
                  {n.timestamp && (
                    <span className="text-[9px] font-mono text-slate-400 truncate">
                      {n.timestamp}
                    </span>
                  )}
                </div>

                <p className="font-bold text-xs text-white truncate mt-0.5">
                  {n.title || (stock ? `${stock.name} (${stock.ticker})` : 'New Notification')}
                </p>

                {n.message && (
                  <p className="text-[10px] sm:text-[11px] text-slate-300 leading-tight truncate mt-0.5">
                    {n.message}
                  </p>
                )}
              </div>

              {/* Right: Quick Action Pill & Close Button */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center gap-0.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span>View</span>
                  <ChevronRight className="w-2.5 h-2.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDismiss(n.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Dismiss"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Subtle indicator if additional toasts are queued */}
      {remainingCount > 0 && (
        <button
          type="button"
          onClick={onOpenAlertsModal}
          className="pointer-events-auto w-full py-1 px-2.5 rounded-xl bg-[#080E24]/90 hover:bg-[#0E1736] border border-white/10 text-slate-300 text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <Bell className="w-3 h-3 text-amber-400" />
          <span>+{remainingCount} more in Notification Center</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </button>
      )}
    </aside>
  );
};
