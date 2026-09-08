import React from 'react';
import { TrendingUp, TrendingDown, Flame, BarChart3, Newspaper, Sparkles, ChevronRight } from 'lucide-react';
import { Stock, GSEMarketNews } from '../types';

interface MarketOverviewProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
  latestNews?: GSEMarketNews | null;
  onSelectNews?: (news: GSEMarketNews) => void;
  onOpenNewsTab?: () => void;
  currency?: 'GHS' | 'USD';
  exchangeRateUsd?: number;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  stocks,
  onSelectStock,
  latestNews,
  onSelectNews,
  onOpenNewsTab,
  currency = 'GHS',
  exchangeRateUsd = 15.5
}) => {
  const currencySymbol = currency === 'USD' ? '$' : 'GH₵';
  const rateFactor = currency === 'USD' ? (1 / exchangeRateUsd) : 1;
  const formatPrice = (p: number) => `${currencySymbol} ${(p * rateFactor).toFixed(2)}`;

  const sortedGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const sortedActive = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 3);

  return (
    <div className="space-y-3.5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Top Gainers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Today's Top Gainers</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">GSE Floor</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {sortedGainers.map((s) => (
              <div
                key={s.ticker}
                onClick={() => onSelectStock(s)}
                className="bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    {s.ticker}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/80 px-1 rounded">
                    +{s.changePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 mt-1">
                  {formatPrice(s.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Traded by Volume */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
              <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Highest Trading Volume</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Liquidity Leaders</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {sortedActive.map((s) => (
              <div
                key={s.ticker}
                onClick={() => onSelectStock(s)}
                className="bg-slate-50 dark:bg-slate-800 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300">
                    {s.ticker}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    {(s.volume / 1000).toFixed(0)}k sh
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 mt-1">
                  {formatPrice(s.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Market Bulletin Wire Strip */}
      {latestNews && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:px-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-bold text-[11px] shrink-0">
              <Sparkles className="w-3 h-3" />
              <span>GSE Wire</span>
            </div>

            <button
              onClick={() => onSelectNews ? onSelectNews(latestNews) : onOpenNewsTab && onOpenNewsTab()}
              className="text-left truncate font-semibold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              {latestNews.title}
            </button>
          </div>

          <button
            onClick={() => onOpenNewsTab && onOpenNewsTab()}
            className="text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1 hover:underline shrink-0 self-end sm:self-center"
          >
            <span>All News & IPOs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

