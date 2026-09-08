import React, { useState } from 'react';
import { 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronRight, 
  Zap, 
  PiggyBank, 
  Tag, 
  Bell, 
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { Stock } from '../types';
import { StockLogo } from './StockLogo';
import { InfoButton } from './InfoButton';

interface StockCardProps {
  stock: Stock;
  showPro: boolean;
  currency: 'GHS' | 'USD';
  exchangeRateUsd: number;
  onToggleWatchlist: (ticker: string) => void;
  onSubmitVote: (ticker: string, isBull: boolean) => void;
  userVote: boolean | null; // true = bull, false = bear, null = none
  onSelectStock: (stock: Stock) => void;
  onOpenJargon: (jargonId: string) => void;
  onOpenAlertModalForStock?: (ticker: string) => void;
  hasActiveAlert?: boolean;
  onOpenPortfolioForStock?: (ticker: string) => void;
  holdingsCount?: number;
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  showPro,
  currency,
  exchangeRateUsd,
  onToggleWatchlist,
  onSubmitVote,
  userVote,
  onSelectStock,
  onOpenJargon,
  onOpenAlertModalForStock,
  hasActiveAlert,
  onOpenPortfolioForStock,
  holdingsCount = 0
}) => {
  const [isPressingUsd, setIsPressingUsd] = useState(false);

  const priceGhs = stock.price;
  const priceUsd = stock.price / (exchangeRateUsd || 15.5);

  const totalVotes = (stock.bullVotes || 0) + (stock.bearVotes || 0);
  const bullPercent = totalVotes === 0 ? 50 : Math.round(((stock.bullVotes || 0) / totalVotes) * 100);

  const displayPrimary = currency === 'GHS'
    ? `GH₵ ${priceGhs.toFixed(2)}`
    : `$${priceUsd.toFixed(2)}`;

  const displaySecondary = currency === 'GHS'
    ? `$${priceUsd.toFixed(2)} USD`
    : `GH₵ ${priceGhs.toFixed(2)}`;

  const activePriceDisplay = isPressingUsd ? displaySecondary : displayPrimary;
  const isPositive = stock.change >= 0;

  // Compute 5-axis score or fallback
  const axisScore = stock.meridianAxis?.total ?? Math.round((stock.easyToSellScore + stock.bargainScore + stock.cashBackScore) / 10);

  return (
    <div
      id={`stock-card-${stock.ticker}`}
      onClick={() => onSelectStock(stock)}
      className="bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200/90 dark:border-white/[0.08] hover:border-amber-500/40 dark:hover:border-amber-500/50 hover:shadow-xl dark:hover:shadow-amber-950/20 dark:hover:bg-[#0F1A3A] transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
    >
      {/* Top Accent Line on Hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Top Header: Logo, Ticker, Name, Sector & Actions */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <StockLogo ticker={stock.ticker} name={stock.name} sector={stock.sector} size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono font-black text-base text-slate-900 dark:text-white tracking-tight group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {stock.ticker}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-[#070D1F] px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/[0.08]">
                  {stock.sector}
                </span>
                {holdingsCount > 0 && (
                  <span className="text-[9px] font-mono font-black bg-amber-50 dark:bg-amber-500/15 text-amber-900 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/30">
                    {holdingsCount} HELD
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5 font-medium">
                {stock.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Quick Portfolio Add */}
            {onOpenPortfolioForStock && (
              <button
                type="button"
                onClick={() => onOpenPortfolioForStock(stock.ticker)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  holdingsCount > 0
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-400'
                    : 'border-slate-200 dark:border-white/[0.08] text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-[#070D1F]'
                }`}
                title="Add to Portfolio"
              >
                <Briefcase className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Quick Price Alert */}
            {onOpenAlertModalForStock && (
              <button
                type="button"
                onClick={() => onOpenAlertModalForStock(stock.ticker)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  hasActiveAlert
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                    : 'border-slate-200 dark:border-white/[0.08] text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-[#070D1F]'
                }`}
                title="Set Alert Target"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Watchlist Toggle */}
            <button
              type="button"
              onClick={() => onToggleWatchlist(stock.ticker)}
              className={`p-1.5 rounded-lg border transition-all active:scale-90 cursor-pointer ${
                stock.isWatchlisted
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-500 dark:text-rose-400'
                  : 'border-slate-200 dark:border-white/[0.08] text-slate-400 hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-[#070D1F]'
              }`}
              title={stock.isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${stock.isWatchlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Price & Day Change Row */}
        <div className="py-3 flex items-baseline justify-between gap-2">
          <div>
            <div 
              className="flex items-baseline gap-2 cursor-pointer select-none"
              title="Click or hold to toggle GHS/USD"
              onMouseDown={() => setIsPressingUsd(true)}
              onMouseUp={() => setIsPressingUsd(false)}
              onTouchStart={() => setIsPressingUsd(true)}
              onTouchEnd={() => setIsPressingUsd(false)}
            >
              <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                {activePriceDisplay}
              </span>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                {displaySecondary}
              </span>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-1">
              <div className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg font-mono text-xs font-black tabular-nums shadow-xs ${
                isPositive
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40'
                  : 'bg-rose-50 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40'
              }`}>
                {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
              </div>
              <InfoButton 
                onClick={() => onOpenJargon('variation')} 
                title="What is Price Variation? Measured in %. Higher is better for holders." 
              />
            </div>
            {!showPro && (
              <span className={`text-[10px] font-mono font-bold mt-0.5 ${isPositive ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-800 dark:text-rose-400'}`}>
                {isPositive ? 'Gain (Higher ↑)' : 'Dip (Discount ↓)'}
              </span>
            )}
          </div>
        </div>

        {/* Metrics Grid with Exact Scales & Direction Guidelines */}
        <div className="grid grid-cols-3 gap-2 py-2.5 bg-slate-50 dark:bg-[#070D1F]/90 rounded-xl border border-slate-200 dark:border-white/[0.08] px-2 shadow-xs">
          {/* Metric 1: Liquidity / Easy to sell */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <span className="text-[11px] font-mono text-slate-700 dark:text-slate-400 font-bold block truncate">
                {showPro ? 'LIQUIDITY' : 'EASY TO SELL'}
              </span>
              <InfoButton onClick={() => onOpenJargon('liquidity')} title="Easy to Sell / Liquidity: Scale 0-100. Higher is better!" />
            </div>
            <span className="text-xs sm:text-sm font-mono font-black text-slate-900 dark:text-white tabular-nums block">
              {stock.easyToSellScore}/100
            </span>
            <span className="text-[9px] font-mono text-emerald-800 dark:text-emerald-400 font-black block">
              Higher ↑
            </span>
          </div>

          {/* Metric 2: Yield / Cash Back */}
          <div className="text-center border-x border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <span className="text-[11px] font-mono text-slate-700 dark:text-slate-400 font-bold block truncate">
                {showPro ? 'DIV YIELD' : 'CASH BACK'}
              </span>
              <InfoButton onClick={() => onOpenJargon('dividend')} title="Cash Back / Dividend Yield: Annual % cash payout. Higher is better!" />
            </div>
            <span className="text-xs sm:text-sm font-mono font-black text-amber-900 dark:text-amber-400 tabular-nums block">
              {stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(1)}%` : '0.0%'}
            </span>
            <span className="text-[9px] font-mono text-amber-800 dark:text-amber-400 font-black block">
              Higher ↑
            </span>
          </div>

          {/* Metric 3: P/E Valuation / Bargain */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <span className="text-[11px] font-mono text-slate-700 dark:text-slate-400 font-bold block truncate">
                {showPro ? 'P/E RATIO' : 'BARGAIN'}
              </span>
              <InfoButton onClick={() => onOpenJargon('value')} title="Bargain Score & P/E: How cheap the stock is relative to profits." />
            </div>
            <span className="text-xs sm:text-sm font-mono font-black text-slate-900 dark:text-white tabular-nums block">
              {showPro 
                ? (stock.peRatio ? `${stock.peRatio.toFixed(1)}x` : 'N/A') 
                : `${stock.bargainScore}/100`}
            </span>
            <span className="text-[9px] font-mono text-blue-800 dark:text-blue-400 font-black block">
              {showPro ? 'Lower ↓' : 'Higher ↑'}
            </span>
          </div>
        </div>

        {/* Meridian Axis Diagnostic Rating */}
        <div className="mt-2.5 flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-400 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-[11px] font-mono font-bold">Meridian Axis</span>
            <InfoButton onClick={() => onOpenJargon('axis')} title="Meridian Axis: Comprehensive health score. Scale 0-30. Higher is better!" />
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="font-black text-amber-900 dark:text-amber-400">{axisScore}/30</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded shadow-xs ${
              axisScore >= 22 
                ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30' 
                : axisScore >= 16 
                ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-900 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30' 
                : 'bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
            }`}>
              {stock.meridianAxis?.rating || (axisScore >= 22 ? 'Exceptional' : axisScore >= 16 ? 'Strong' : 'Moderate')}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Sentiment & View Button */}
      <div className="pt-3.5 mt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
        {/* Bull / Bear sentiment pill */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSubmitVote(stock.ticker, true)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold flex items-center gap-1 border transition-all cursor-pointer ${
              userVote === true
                ? 'bg-emerald-600 text-white font-black border-emerald-600 shadow-sm'
                : 'bg-slate-50 dark:bg-[#070D1F] border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-emerald-600'
            }`}
            title="Vote Bullish"
          >
            <ThumbsUp className="w-3 h-3" />
            <span>{bullPercent}%</span>
          </button>
          <button
            type="button"
            onClick={() => onSubmitVote(stock.ticker, false)}
            className={`p-1 rounded-md text-[11px] font-mono font-bold border transition-all cursor-pointer ${
              userVote === false
                ? 'bg-rose-600 text-white font-black border-rose-600 shadow-sm'
                : 'bg-slate-50 dark:bg-[#070D1F] border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-rose-600'
            }`}
            title="Vote Bearish"
          >
            <ThumbsDown className="w-3 h-3" />
          </button>
        </div>

        {/* View Details CTA */}
        <button
          type="button"
          onClick={() => onSelectStock(stock)}
          className="text-xs font-black text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 flex items-center gap-1 group/btn cursor-pointer py-1"
        >
          <span>Terminal Sheet</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
