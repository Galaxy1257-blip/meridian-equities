import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Bell, 
  Plus, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { Stock, PriceAlert, PortfolioHolding } from '../types';
import { StockLogo } from './StockLogo';
import { InfoButton } from './InfoButton';

interface StockTableProps {
  stocks: Stock[];
  currency: 'GHS' | 'USD';
  exchangeRateUsd: number;
  showPro: boolean;
  onSelectStock: (stock: Stock) => void;
  onToggleWatchlist: (ticker: string, e?: React.MouseEvent) => void;
  onOpenAlertModalForStock: (ticker: string, e?: React.MouseEvent) => void;
  onOpenPortfolioForStock: (ticker: string, e?: React.MouseEvent) => void;
  onOpenJargon?: (jargonId: string) => void;
  alerts: PriceAlert[];
  holdings: PortfolioHolding[];
}

export const StockTable: React.FC<StockTableProps> = ({
  stocks,
  currency,
  exchangeRateUsd,
  showPro,
  onSelectStock,
  onToggleWatchlist,
  onOpenAlertModalForStock,
  onOpenPortfolioForStock,
  onOpenJargon,
  alerts,
  holdings
}) => {
  const formatPrice = (priceGhs: number) => {
    if (currency === 'USD') {
      const priceUsd = priceGhs / exchangeRateUsd;
      return `$${priceUsd.toFixed(2)}`;
    }
    return `GH₵ ${priceGhs.toFixed(2)}`;
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
    if (vol >= 1_000) return `${(vol / 1_000).toFixed(0)}k`;
    return vol.toLocaleString();
  };

  const formatMarketCap = (capM: number) => {
    if (currency === 'USD') {
      const capUsd = capM / exchangeRateUsd;
      return `$${capUsd.toFixed(1)}M`;
    }
    return `GH₵ ${capM.toFixed(1)}M`;
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B132B] shadow-sm">
      <div className="overflow-auto custom-scrollbar max-h-[70vh]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="sticky top-0 z-10 border-b border-slate-200 dark:border-white/[0.08] bg-slate-100/95 dark:bg-[#070D1F]/95 backdrop-blur-md text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none shadow-sm">
              <th className="py-3 px-4 w-10 text-center">⭐</th>
              <th className="py-3 px-4 font-bold">Asset / Company</th>
              <th className="py-3 px-4 font-bold text-right">Price ({currency})</th>
              <th className="py-3 px-4 font-bold text-right">
                <div className="inline-flex items-center justify-end gap-1">
                  <span>24h Change</span>
                  {onOpenJargon && <InfoButton onClick={() => onOpenJargon('variation')} title="Price Variation: Daily % move. Higher is better for holders." />}
                </div>
              </th>
              <th className="py-3 px-4 font-bold text-right">24h Volume</th>
              <th className="py-3 px-4 font-bold text-right">
                <div className="inline-flex items-center justify-end gap-1">
                  <span>Market Cap</span>
                  {onOpenJargon && <InfoButton onClick={() => onOpenJargon('market_cap')} title="Market Cap: Total company size" />}
                </div>
              </th>
              <th className="py-3 px-4 font-bold text-right">
                <div className="inline-flex items-center justify-end gap-1">
                  <span>{showPro ? 'P/E Ratio' : 'Bargain'}</span>
                  {onOpenJargon && <InfoButton onClick={() => onOpenJargon('value')} title="Bargain Score & P/E: How cheap the stock is relative to earnings" />}
                </div>
              </th>
              <th className="py-3 px-4 font-bold text-right">
                <div className="inline-flex items-center justify-end gap-1">
                  <span>{showPro ? 'Div Yield' : 'Cash Yield'}</span>
                  {onOpenJargon && <InfoButton onClick={() => onOpenJargon('dividend')} title="Cash Yield / Dividend: Annual cash return. Higher is better!" />}
                </div>
              </th>
              <th className="py-3 px-4 font-bold text-center">
                <div className="inline-flex items-center justify-center gap-1">
                  <span>Meridian Axis</span>
                  {onOpenJargon && <InfoButton onClick={() => onOpenJargon('axis')} title="Meridian Axis: Scale 0-30. Higher is better!" />}
                </div>
              </th>
              <th className="py-3 px-4 font-bold text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] text-xs font-medium">
            {stocks.map((stock) => {
              const isPositive = stock.change > 0;
              const isNegative = stock.change < 0;
              const hasActiveAlert = alerts.some(a => a.ticker === stock.ticker && a.isActive && !a.triggered);
              const holdingCount = holdings.filter(h => h.ticker === stock.ticker).length;
              const axisScore = stock.meridianAxis?.total ?? Math.round((stock.easyToSellScore + stock.bargainScore + stock.cashBackScore) / 10);

              return (
                <tr
                  key={stock.ticker}
                  onClick={() => onSelectStock(stock)}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#0F1A3A] transition-colors cursor-pointer group"
                >
                  {/* Watchlist Toggle */}
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => onToggleWatchlist(stock.ticker, e)}
                      className={`p-1 rounded-lg transition-transform active:scale-90 cursor-pointer ${
                        stock.isWatchlisted
                          ? 'text-rose-500 dark:text-rose-400'
                          : 'text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-400'
                      }`}
                      title={stock.isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Heart className={`w-4 h-4 ${stock.isWatchlisted ? 'fill-current' : ''}`} />
                    </button>
                  </td>

                  {/* Asset Identity */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <StockLogo ticker={stock.ticker} name={stock.name} sector={stock.sector} size={36} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white font-mono tracking-tight text-sm group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                            {stock.ticker}
                          </span>
                          {holdingCount > 0 && (
                            <span className="text-[9px] font-mono bg-amber-50 dark:bg-amber-500/15 text-amber-900 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/30 font-bold" title="In Portfolio">
                              {holdingCount} HELD
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[140px] sm:max-w-[200px] font-medium">
                          {stock.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold font-mono text-sm text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatPrice(stock.price)}
                    </span>
                  </td>

                  {/* 24h Change */}
                  <td className="py-3 px-4 text-right">
                    <div className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-mono text-xs font-black tabular-nums shadow-2xs ${
                      isPositive
                        ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                        : isNegative
                        ? 'bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : isNegative ? <ArrowDownRight className="w-3 h-3" /> : null}
                      <span>{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                    </div>
                    {!showPro && (
                      <span className={`block text-[8px] font-mono font-bold mt-0.5 ${isPositive ? 'text-emerald-800 dark:text-emerald-400' : isNegative ? 'text-rose-800 dark:text-rose-400' : 'text-slate-400'}`}>
                        {isPositive ? 'Gain ↑' : isNegative ? 'Dip ↓' : 'Flat'}
                      </span>
                    )}
                  </td>

                  {/* 24h Volume */}
                  <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                    {formatVolume(stock.volume)}
                  </td>

                  {/* Market Cap */}
                  <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                    {formatMarketCap(stock.marketCap)}
                  </td>

                  {/* Valuation / P/E */}
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    {showPro ? (
                      <div>
                        <span className="text-slate-800 dark:text-slate-300 font-bold">{stock.peRatio ? `${stock.peRatio.toFixed(1)}x` : '—'}</span>
                        <span className="block text-[8px] text-blue-700 dark:text-blue-400 font-bold">Lower ↓</span>
                      </div>
                    ) : (
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{stock.bargainScore}/100</span>
                        <span className="block text-[8px] text-emerald-800 dark:text-emerald-400 font-bold">Higher ↑</span>
                      </div>
                    )}
                  </td>

                  {/* Dividend Yield */}
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    {stock.dividendYield > 0 ? (
                      <div>
                        <span className="text-amber-900 dark:text-amber-400 font-bold">
                          {stock.dividendYield.toFixed(2)}%
                        </span>
                        <span className="block text-[8px] text-amber-800 dark:text-amber-400 font-bold">Higher ↑</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">0.0%</span>
                    )}
                  </td>

                  {/* Meridian Axis Diagnostic Score */}
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 font-mono text-[11px] font-bold">
                      <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>{axisScore}/30</span>
                    </div>
                    <span className="block text-[8px] font-mono text-amber-800 dark:text-amber-400 mt-0.5 font-bold">Higher ↑</span>
                  </td>

                  {/* Actions Column */}
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => onOpenAlertModalForStock(stock.ticker, e)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          hasActiveAlert
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-500'
                            : 'border-slate-200 dark:border-white/[0.08] text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-[#070D1F]'
                        }`}
                        title="Set Price Alert"
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => onOpenPortfolioForStock(stock.ticker, e)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-[#070D1F] transition-colors cursor-pointer"
                        title="Add to Portfolio"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectStock(stock)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] text-slate-400 hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-[#070D1F] transition-colors cursor-pointer"
                        title="View Research & Chart"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
