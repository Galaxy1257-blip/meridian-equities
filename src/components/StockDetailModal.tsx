import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Calculator, 
  Calendar, 
  DollarSign, 
  Activity, 
  AlertCircle, 
  Share2, 
  Check, 
  Zap, 
  PiggyBank, 
  Tag, 
  Bell, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Trash2, 
  Briefcase, 
  Newspaper, 
  FileText, 
  ChevronRight, 
  Sparkles, 
  Flame,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Scale,
  Layers
} from 'lucide-react';
import { Stock, PriceAlert, AlertCondition, PortfolioHolding, GSEMarketNews } from '../types';
import { StockPriceChart } from './StockPriceChart';
import { SnowflakeRadar } from './SnowflakeRadar';
import { StockLogo } from './StockLogo';
import { InfoButton } from './InfoButton';
import { BankStatementView } from './BankStatementView';
import { getSnowflakeScore, getAiStockNarrative, getPeerComparison } from '../data/stockIntelligence';

interface StockDetailModalProps {
  stock: Stock | null;
  onClose: () => void;
  currency: 'GHS' | 'USD';
  exchangeRateUsd: number;
  showPro: boolean;
  onToggleWatchlist: (ticker: string) => void;
  onSubmitVote: (ticker: string, isBull: boolean) => void;
  userVote: boolean | null;
  onOpenJargon: (jargonId: string) => void;
  stockAlerts?: PriceAlert[];
  onAddAlert?: (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => void;
  onDeleteAlert?: (id: string) => void;
  onOpenAllAlerts?: () => void;
  onOpenPortfolioModal?: (ticker: string) => void;
  stockHoldings?: PortfolioHolding[];
  relatedNews?: GSEMarketNews[];
  onSelectNews?: (news: GSEMarketNews) => void;
  allStocks?: Stock[];
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock,
  onClose,
  currency,
  exchangeRateUsd,
  showPro,
  onToggleWatchlist,
  onSubmitVote,
  userVote,
  onOpenJargon,
  stockAlerts = [],
  onAddAlert,
  onDeleteAlert,
  onOpenAllAlerts,
  onOpenPortfolioModal,
  stockHoldings = [],
  relatedNews = [],
  onSelectNews,
  allStocks = []
}) => {
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'meridian' | 'financials' | 'peers' | 'orders' | 'all'>('overview');
  const [calcAmountGhs, setCalcAmountGhs] = useState<number>(500);
  const [copied, setCopied] = useState(false);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>('');
  const [alertCondition, setAlertCondition] = useState<AlertCondition>('ABOVE');
  const [alertNote, setAlertNote] = useState<string>('');
  const [alertSuccessMsg, setAlertSuccessMsg] = useState<string>('');

  if (!stock) return null;

  const priceGhs = stock.price;
  const priceUsd = stock.price / (exchangeRateUsd || 15.5);
  const isPositive = stock.change >= 0;

  // Investment intelligence data
  const snowflakeScore = getSnowflakeScore(stock);
  const aiNarrative = getAiStockNarrative(stock);
  const peers = getPeerComparison(stock, allStocks.length > 0 ? allStocks : [stock]);

  // Investment calculator math
  const sharesCanBuy = Math.floor(calcAmountGhs / stock.price);
  const totalCost = sharesCanBuy * stock.price;
  const changeRemaining = calcAmountGhs - totalCost;
  const estimatedAnnualDividend = (stock.dividendAmount || (stock.price * (stock.dividendYield || 0) / 100)) * sharesCanBuy;

  const totalVotes = (stock.bullVotes || 0) + (stock.bearVotes || 0);
  const bullPercent = totalVotes === 0 ? 50 : Math.round(((stock.bullVotes || 0) / totalVotes) * 100);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `📊 GSE Stock: ${stock.name} (${stock.ticker}) currently trading at GH₵ ${stock.price.toFixed(2)} on the Ghana Stock Exchange! Check on Meridian Equities.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040814]/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#080E24] w-full max-w-4xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/[0.12] dark:shadow-[0_0_50px_-10px_rgba(245,158,11,0.15)] overflow-hidden flex flex-col h-[94dvh] sm:h-auto sm:max-h-[90vh] my-0 sm:my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact & Mobile-Optimized Executive Header */}
        <div className="bg-slate-900 dark:bg-[#060B1A] text-white px-3 sm:px-6 py-2.5 sm:py-4 border-b border-slate-800 dark:border-white/[0.08] shrink-0">
          {/* Top Row: Brand & Identity + Action Controls */}
          <div className="flex items-center justify-between gap-2">
            {/* Left: Logo, Ticker, Name, Sector */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <StockLogo ticker={stock.ticker} name={stock.name} sector={stock.sector} size={36} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shrink-0 shadow-xs" />
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                <span className="font-mono text-xs sm:text-sm font-black px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 shrink-0">
                  {stock.ticker}
                </span>
                <h2 className="text-sm sm:text-lg lg:text-xl font-black text-white tracking-tight truncate" title={stock.name}>
                  {stock.name}
                </h2>
                <span className="hidden md:inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                  {stock.sector}
                </span>
              </div>
            </div>

            {/* Right: Controls Cluster (Ultra-Compact on Mobile) */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Portfolio Holding Pill */}
              {onOpenPortfolioModal && (
                <button
                  id="modal-portfolio-btn"
                  onClick={() => onOpenPortfolioModal(stock.ticker)}
                  className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl transition-all flex items-center gap-1 text-xs font-bold cursor-pointer ${
                    stockHoldings.length > 0
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-amber-400 border border-slate-700'
                  }`}
                  title={stockHoldings.length > 0 ? `${stockHoldings.reduce((sum, h) => sum + h.sharesCount, 0).toLocaleString()} Shares Owned` : "Add to Portfolio"}
                >
                  <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  {stockHoldings.length > 0 ? (
                    <span className="text-[10px] font-mono font-black">
                      <span className="sm:hidden">{stockHoldings.reduce((sum, h) => sum + h.sharesCount, 0).toLocaleString()}</span>
                      <span className="hidden sm:inline">{stockHoldings.reduce((sum, h) => sum + h.sharesCount, 0).toLocaleString()} Shares</span>
                    </span>
                  ) : (
                    <span className="hidden sm:inline">+ Portfolio</span>
                  )}
                </button>
              )}

              {/* Price Alerts */}
              {onOpenAllAlerts && (
                <button
                  id="modal-alert-btn"
                  onClick={onOpenAllAlerts}
                  className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer ${
                    stockAlerts.length > 0 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Price Alerts"
                >
                  <Bell className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stockAlerts.length > 0 ? 'fill-slate-950' : ''}`} />
                </button>
              )}

              {/* Share */}
              <button
                id="modal-share-btn"
                onClick={handleShare}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Copy Details"
              >
                {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>

              {/* Bank Statement PDF */}
              <button
                id="modal-download-statement-btn"
                onClick={() => setIsStatementOpen(true)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-amber-400 border border-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Download Valuation Statement (PDF)"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span className="hidden lg:inline">PDF</span>
              </button>

              {/* Watchlist */}
              <button
                id="modal-watchlist-btn"
                onClick={() => onToggleWatchlist(stock.ticker)}
                className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer ${
                  stock.isWatchlisted ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title={stock.isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stock.isWatchlisted ? 'fill-white' : ''}`} />
              </button>

              {/* Close Button */}
              <button
                id="modal-close-btn"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Live Price & Day Change (Strictly Horizontal on Phone) */}
          <div className="mt-2 pt-2 border-t border-slate-800/80 dark:border-white/[0.06] flex items-center justify-between gap-2 flex-nowrap">
            {/* Price & USD Conversion */}
            <div className="flex items-baseline gap-1.5 sm:gap-3 min-w-0">
              <span className="text-lg sm:text-2xl lg:text-3xl font-black font-mono text-white tabular-nums tracking-tight">
                {currency === 'GHS' ? `GH₵ ${priceGhs.toFixed(2)}` : `$ ${priceUsd.toFixed(2)}`}
              </span>
              <span className="text-[10px] sm:text-sm font-mono text-slate-400 truncate">
                {currency === 'GHS' ? `($${priceUsd.toFixed(2)})` : `(GH₵${priceGhs.toFixed(2)})`}
              </span>
            </div>

            {/* 24h Variation Badge & Direction Tag */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <span className={`font-mono text-xs sm:text-sm font-black px-2 py-0.5 rounded-md tabular-nums shrink-0 ${
                isPositive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </span>
              <InfoButton 
                onClick={() => onOpenJargon('variation')} 
                title="What is Price Variation? Measured in %. Higher is better for holders." 
              />
              {!showPro && (
                <span className="hidden sm:inline text-[10px] font-mono text-slate-400 font-bold shrink-0">
                  {isPositive ? 'Gain ↑' : 'Dip ↓'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Terminal Sub-Desk Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-6 py-1.5 sm:py-2 bg-slate-950 dark:bg-[#040814] border-b border-slate-800 dark:border-white/[0.08] overflow-x-auto no-scrollbar shrink-0 text-xs font-bold select-none whitespace-nowrap">
          {[
            { id: 'overview', label: 'Price & Overview', icon: TrendingUp },
            { id: 'meridian', label: 'Meridian 5-Axis & AI', icon: Sparkles },
            { id: 'financials', label: 'Valuation & Multiples', icon: BarChart3 },
            { id: 'peers', label: 'Sector Peers', icon: Scale },
            { id: 'orders', label: 'Orders & Alerts', icon: Calculator },
            { id: 'all', label: 'Full Dossier', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeModalTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveModalTab(tab.id as any)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap text-[11px] sm:text-xs shrink-0 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          {/* Overview Tab: Price Chart & Trading Stats */}
          {(activeModalTab === 'overview' || activeModalTab === 'all') && (
            <>
              {/* Interactive Recharts Historical Price Trends Component */}
              <StockPriceChart
                stock={stock}
                currency={currency}
                exchangeRateUsd={exchangeRateUsd}
              />

          {/* Key Statistics Grid */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              GSE Trading Statistics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Market Cap</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  GH₵ {(stock.marketCap).toLocaleString()} M
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">52-Week Range</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  GH₵ {stock.low52W.toFixed(2)} - {stock.high52W.toFixed(2)}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">P/E Ratio</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {stock.peRatio}x
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Today's Volume</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {stock.volume.toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Ex-Dividend Date</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {stock.exDividendDate || 'None announced'}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Dividend Amount</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {stock.dividendAmount ? `GH₵ ${stock.dividendAmount.toFixed(2)} / share` : 'N/A'}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Dividend Yield</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {(stock.dividendYield || 0).toFixed(1)}% p.a.
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Trading Currency</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  Ghana Cedi (GHS)
                </span>
              </div>
            </div>
          </div>
          </>
          )}

          {/* Orders Desk: Investment Return Calculator */}
          {(activeModalTab === 'orders' || activeModalTab === 'all') && (
          <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-blue-500/10 dark:from-amber-500/15 dark:via-emerald-500/15 dark:to-blue-500/15 p-5 rounded-2xl border border-amber-500/20 dark:border-amber-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wide">
                Share Investment & Dividend Estimator
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
                  How much would you like to invest? (GH₵)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-500 text-sm">GH₵</span>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={calcAmountGhs}
                    onChange={(e) => setCalcAmountGhs(Math.max(1, Number(e.target.value)))}
                    className="w-full pl-12 pr-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-base"
                  />
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[200, 500, 1000, 5000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCalcAmountGhs(preset)}
                      className="px-2 py-1 text-[11px] font-mono font-semibold rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">You will acquire approximately:</span>
                <span className="font-mono font-black text-xl text-slate-900 dark:text-white">
                  {sharesCanBuy.toLocaleString()} Shares
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5 font-mono">
                  Total Cost: GH₵ {totalCost.toFixed(2)} (Remainder: GH₵ {changeRemaining.toFixed(2)})
                </span>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Est. Annual Cash Dividend:</span>
                <span className="font-mono font-black text-xl text-emerald-600 dark:text-emerald-400">
                  GH₵ {estimatedAnnualDividend.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                  {(stock.dividendYield || 0) > 0 ? `Based on ${(stock.dividendYield || 0).toFixed(1)}% yield` : 'No recent dividend declared'}
                </span>
              </div>
            </div>
          </div>
          )}

          {/* Valuation & Multiples Desk: Metric Jargon Breakdown */}
          {(activeModalTab === 'financials' || activeModalTab === 'all') && (
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Scores & Practical Glossary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div 
                onClick={() => onOpenJargon('liquidity')}
                className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <Zap className="w-4 h-4" />
                    <span>{showPro ? 'Liquidity' : 'Easy to Sell'}</span>
                    <InfoButton onClick={() => onOpenJargon('liquidity')} title="Easy to Sell / Liquidity. Scale 0-100. Higher is better!" />
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-black">{stock.easyToSellScore}/100</span>
                    <span className="block text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      Higher is better ↑
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  How swiftly you can cash out on MoMo or Bank. Scale: 0 to 100.
                </p>
              </div>

              <div 
                onClick={() => onOpenJargon('dividend')}
                className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <PiggyBank className="w-4 h-4" />
                    <span>{showPro ? 'Dividend Yield' : 'Cash Back'}</span>
                    <InfoButton onClick={() => onOpenJargon('dividend')} title="Cash Back / Dividend Yield. Annual %. Higher is better!" />
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-black">{showPro ? `${(stock.dividendYield || 0).toFixed(1)}%` : `${stock.cashBackScore}/100`}</span>
                    <span className="block text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      Higher is better ↑
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  Annual cash paid directly to your account. Higher yield means more cash per share.
                </p>
              </div>

              <div 
                onClick={() => onOpenJargon('value')}
                className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <Tag className="w-4 h-4" />
                    <span>{showPro ? 'P/E Valuation' : 'Bargain Score'}</span>
                    <InfoButton onClick={() => onOpenJargon('value')} title="Bargain Score & P/E Ratio. How cheap the stock is relative to profits." />
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-black">{showPro ? `${stock.peRatio}x` : `${stock.bargainScore}/100`}</span>
                    <span className="block text-[9px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {showPro ? 'Lower is cheaper ↓' : 'Higher is cheaper ↑'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {showPro 
                    ? 'P/E multiple. A lower P/E ratio means you pay fewer cedis per profit.'
                    : 'Bargain score out of 100. Higher score means a bigger discount.'}
                </p>
              </div>
            </div>
          </div>
          )}

          {/* Overview Desk: Company Background */}
          {(activeModalTab === 'overview' || activeModalTab === 'all') && (
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              About {stock.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {stock.description}
            </p>
          </div>
          )}

          {/* Meridian 5-Axis & AI Desk: Radar & Narrative */}
          {(activeModalTab === 'meridian' || activeModalTab === 'all') && (
          <>
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-white">
                      Meridian 5-Axis Diagnostics
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Meridian Pro
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Comprehensive multi-factor fundamental health & growth radar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Score</span>
                  <span className="text-xl font-black font-mono text-cyan-400">
                    {snowflakeScore.total} <span className="text-xs text-slate-500 font-normal">/ 30</span>
                  </span>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${
                  snowflakeScore.rating === 'Exceptional' ? 'bg-emerald-500 text-slate-950' :
                  snowflakeScore.rating === 'Strong' ? 'bg-cyan-500 text-slate-950' :
                  snowflakeScore.rating === 'Moderate' ? 'bg-amber-500 text-slate-950' :
                  'bg-rose-500 text-white'
                }`}>
                  {snowflakeScore.rating}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
              {/* Interactive SVG Radar */}
              <div className="flex justify-center p-2 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                <SnowflakeRadar score={snowflakeScore} size={230} />
              </div>

              {/* Factor Breakdown Bars */}
              <div className="space-y-3">
                {[
                  { label: 'Value / Multiple', val: snowflakeScore.value, max: 6, desc: `P/E of ${stock.peRatio}x relative to sector historical average.` },
                  { label: 'Future Growth', val: snowflakeScore.future, max: 6, desc: `${stock.sector} macro expansion and digitisation trajectory.` },
                  { label: 'Past Performance', val: snowflakeScore.past, max: 6, desc: '52-week price stability and resilience on GSE floor.' },
                  { label: 'Financial Health', val: snowflakeScore.health, max: 6, desc: 'Balance sheet strength, liquidity & trading volume.' },
                  { label: 'Dividend Reliability', val: snowflakeScore.dividend, max: 6, desc: `${(stock.dividendYield || 0).toFixed(1)}% yield and track record of cash distributions.` }
                ].map(factor => (
                  <div key={factor.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">{factor.label}</span>
                      <span className="font-mono text-cyan-400">{factor.val} / {factor.max}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(factor.val / factor.max) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 block leading-tight">{factor.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Stock Narratives (per-stock Bull vs Bear & Catalysts) */}
          <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    AI Stock Narrative & Catalyst Thesis
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Algorithmic investment case generated from GSE quarterly reports & market flows
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800">
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">12M AI Target Price:</span>
                <span className="font-mono font-black text-xs text-purple-900 dark:text-purple-200">
                  GH₵ {aiNarrative.targetPriceGhs.toFixed(2)} (+{(((aiNarrative.targetPriceGhs - stock.price) / stock.price) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bull Case */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-300 uppercase">
                  <TrendingUp className="w-4 h-4" />
                  <span>The Bull Case (Growth Catalysts)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {aiNarrative.bullThesis.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span className="leading-snug">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bear Case */}
              <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-rose-700 dark:text-rose-300 uppercase">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Key Risk Factors (Downside Risks)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {aiNarrative.bearThesis.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span className="leading-snug">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">2026 Core Growth Driver:</span>
                <span className="text-slate-600 dark:text-slate-300">{aiNarrative.catalyst2026}</span>
              </div>
              <div className="sm:text-right shrink-0">
                <span className="font-bold text-slate-900 dark:text-white block">Valuation Verdict:</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">{aiNarrative.valuationVerdict}</span>
              </div>
            </div>
          </div>
          </>
          )}

          {/* Sector Peers Desk: Comparison Matrix */}
          {(activeModalTab === 'peers' || activeModalTab === 'all') && (
          <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Financial Analyzer & GSE Peer Comparison
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comparing valuation multiples and dividend yields with industry rivals
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold">
                    <th className="py-2 px-3">Company</th>
                    <th className="py-2 px-3">Price (GHS)</th>
                    <th className="py-2 px-3">P/E Ratio</th>
                    <th className="py-2 px-3">Div Yield</th>
                    <th className="py-2 px-3">Market Cap</th>
                    <th className="py-2 px-3">ROE (Est)</th>
                    <th className="py-2 px-3">Profit Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {peers.map((peer) => {
                    const isTarget = peer.ticker === stock.ticker;
                    return (
                      <tr 
                        key={peer.ticker}
                        className={`transition-colors ${
                          isTarget ? 'bg-amber-500/10 font-black text-slate-950 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-sans font-bold flex items-center gap-2">
                          <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                            {peer.ticker}
                          </span>
                          <span className="truncate max-w-[120px]">{peer.name}</span>
                          {isTarget && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                              THIS
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">GH₵ {peer.price.toFixed(2)}</td>
                        <td className="py-2.5 px-3 font-bold">{peer.peRatio}x</td>
                        <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                          {peer.dividendYield.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          GH₵ {peer.marketCapGhs >= 1000 ? `${(peer.marketCapGhs / 1000).toFixed(1)}B` : `${peer.marketCapGhs}M`}
                        </td>
                        <td className="py-2.5 px-3 text-blue-600 dark:text-blue-400 font-bold">
                          {peer.roeEstimate}%
                        </td>
                        <td className="py-2.5 px-3">{peer.profitMargin}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* Orders & Alerts Desk: Price Target Alert Card */}
          {(activeModalTab === 'orders' || activeModalTab === 'all') && (
          <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Set Price Alert for {stock.ticker}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Receive immediate notifications when {stock.ticker} crosses your price target
                  </p>
                </div>
              </div>

              {onOpenAllAlerts && (
                <button
                  type="button"
                  onClick={onOpenAllAlerts}
                  className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 underline underline-offset-2"
                >
                  Manage All Alerts ({stockAlerts.length} for {stock.ticker})
                </button>
              )}
            </div>

            {/* List existing active alerts for this ticker */}
            {stockAlerts.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Active Alerts for {stock.ticker}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stockAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-amber-200 dark:border-amber-500/40 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {alert.condition === 'ABOVE' ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {alert.condition === 'ABOVE' ? '≥' : '≤'} GH₵ {alert.targetPrice.toFixed(2)}
                        </span>
                        {alert.triggered && (
                          <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-200">
                            HIT
                          </span>
                        )}
                      </div>
                      {onDeleteAlert && (
                        <button
                          type="button"
                          onClick={() => onDeleteAlert(alert.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title="Remove alert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick alert creator */}
            <div className="bg-white dark:bg-slate-800/90 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              {alertSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{alertSuccessMsg}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-1 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setAlertCondition('ABOVE');
                      if (!alertTargetPrice) setAlertTargetPrice((stock.price * 1.05).toFixed(2));
                    }}
                    className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      alertCondition === 'ABOVE'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Rises Above (≥)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAlertCondition('BELOW');
                      if (!alertTargetPrice) setAlertTargetPrice((stock.price * 0.95).toFixed(2));
                    }}
                    className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      alertCondition === 'BELOW'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>Falls Below (≤)</span>
                  </button>
                </div>

                <div className="relative flex-1 w-full">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-500 dark:text-slate-400">GH₵</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={`e.g. ${(stock.price * 1.05).toFixed(2)}`}
                    value={alertTargetPrice}
                    onChange={(e) => setAlertTargetPrice(e.target.value)}
                    className="w-full pl-11 pr-3 py-1.5 bg-slate-50 dark:bg-slate-750 rounded-lg border border-slate-300 dark:border-slate-600 font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const priceNum = parseFloat(alertTargetPrice);
                    if (isNaN(priceNum) || priceNum <= 0) return;
                    if (onAddAlert) {
                      onAddAlert({
                        ticker: stock.ticker,
                        stockName: stock.name,
                        targetPrice: Number(priceNum.toFixed(2)),
                        condition: alertCondition,
                        initialPrice: stock.price,
                        note: alertNote.trim() || undefined,
                        isActive: true
                      });
                      setAlertSuccessMsg(`Alert set for ${stock.ticker} at GH₵ ${priceNum.toFixed(2)}!`);
                      setAlertTargetPrice('');
                      setAlertNote('');
                      setTimeout(() => setAlertSuccessMsg(''), 3000);
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1 transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Alert</span>
                </button>
              </div>

              {/* Quick % offsets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Quick presets:</span>
                {[-10, -5, +5, +10].map(pct => {
                  const target = stock.price * (1 + pct / 100);
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        setAlertCondition(pct >= 0 ? 'ABOVE' : 'BELOW');
                        setAlertTargetPrice(target.toFixed(2));
                      }}
                      className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                    >
                      {pct > 0 ? `+${pct}%` : `${pct}%`} (GH₵{target.toFixed(2)})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          )}

          {/* Overview Desk: Related Company News & Corporate Filings */}
          {(activeModalTab === 'overview' || activeModalTab === 'all') && (
          <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Recent News & GSE Filings for {stock.ticker}
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                {relatedNews.length} {relatedNews.length === 1 ? 'Announcement' : 'Announcements'}
              </span>
            </div>

            {relatedNews.length === 0 ? (
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No direct corporate filings in the past 30 days for {stock.name}. Check the main News tab for broader market updates.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {relatedNews.map((news) => (
                  <div
                    key={news.id}
                    onClick={() => {
                      if (onSelectNews) {
                        onSelectNews(news);
                      }
                    }}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          news.category === 'DIVIDEND' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                          news.category === 'EARNINGS' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                          news.category === 'TRADES' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                          'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {news.category}
                        </span>
                        {news.isBreaking && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-500 text-[9px] font-black uppercase">
                            Breaking
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {news.timestamp}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                        {news.title}
                      </h5>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {news.summary}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0 flex items-center gap-0.5 mt-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Community Sentiment Vote In Modal */}
          <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Community Trader Sentiment
              </span>
              <p className="text-xs text-slate-300">
                {bullPercent}% of GSE community members anticipate {stock.ticker} will appreciate.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id={`modal-vote-bull-${stock.ticker}`}
                onClick={() => onSubmitVote(stock.ticker, true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  userVote === true
                    ? 'bg-emerald-500 text-slate-950 font-black ring-2 ring-emerald-300'
                    : 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Bullish ({stock.bullVotes})</span>
              </button>

              <button
                id={`modal-vote-bear-${stock.ticker}`}
                onClick={() => onSubmitVote(stock.ticker, false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  userVote === false
                    ? 'bg-rose-500 text-slate-950 font-black ring-2 ring-rose-300'
                    : 'bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>Bearish ({stock.bearVotes})</span>
              </button>
            </div>
          </div>

          {/* Institutional Regulatory Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-700 dark:text-slate-300 font-bold block mb-0.5">
                Disclaimer: Not Financial Advice
              </strong>
              <span>
                All market data, Meridian Axis diagnostic ratings, and predictive ratios displayed are for informational and educational analysis only. Past financial performance does not guarantee future results on the Ghana Stock Exchange. Always consult an SEC-licensed stockbroker or certified financial advisor before executing trades.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 dark:bg-[#060B1A] p-4 px-6 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Ghana Stock Exchange • Real-time Data
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-[#0B132B] hover:bg-slate-800 dark:hover:bg-[#0F1A3A] border border-transparent dark:border-white/[0.08] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Close Analytics
          </button>
        </div>
      </div>

      {/* Official Bank-Grade Valuation Statement Modal (ISO A4 Printable) */}
      <BankStatementView
        isOpen={isStatementOpen}
        onClose={() => setIsStatementOpen(false)}
        mode="single"
        singleStock={stock}
        singleHolding={stockHoldings.length > 0 ? stockHoldings[0] : null}
        currency={currency}
        exchangeRateUsd={exchangeRateUsd}
      />
    </div>
  );
};
