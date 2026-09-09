import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Bot, 
  Calculator, 
  BookOpen, 
  Target, 
  DollarSign, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  HelpCircle, 
  ShieldCheck, 
  Newspaper, 
  ArrowRight, 
  Zap,
  Activity,
  ArrowRightLeft,
  Award,
  Briefcase,
  Plus,
  Wallet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { Stock, MarketIndex, GSEMarketNews, MainNavTab, PortfolioHolding } from '../types';
import { StockLogo } from './StockLogo';
import { InfoButton } from './InfoButton';

interface HomeDashboardProps {
  stocks: Stock[];
  holdings?: PortfolioHolding[];
  onOpenAddHolding?: () => void;
  currency?: 'GHS' | 'USD';
  exchangeRateUsd?: number;
  indices?: MarketIndex[];
  showPro?: boolean;
  onSelectStock: (stock: Stock) => void;
  onNavigateTab: (tab: MainNavTab) => void;
  onOpenJargonGuide: (id?: string) => void;
  onOpenFxModal: () => void;
  onOpenDividendModal: () => void;
  onOpenAlertsModal: () => void;
  onOpenMarketCloseReport?: () => void;
  onOpenOnboardingTour?: () => void;
  latestNews?: GSEMarketNews;
  onSelectNews?: (news: GSEMarketNews) => void;
  onOpenMeridianAI?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  stocks,
  holdings = [],
  onOpenAddHolding,
  currency = 'GHS',
  exchangeRateUsd = 11.41,
  indices,
  showPro = false,
  onSelectStock,
  onNavigateTab,
  onOpenJargonGuide,
  onOpenFxModal,
  onOpenDividendModal,
  onOpenAlertsModal,
  onOpenMarketCloseReport,
  onOpenOnboardingTour,
  latestNews,
  onSelectNews,
  onOpenMeridianAI
}) => {
  // Sort stocks into categorized groupings
  const gainers = [...stocks].filter(s => s.change > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers = [...stocks].filter(s => s.change < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const mostActive = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 5);
  const axisChampions = [...stocks]
    .map(s => ({ stock: s, score: s.meridianAxis?.total ?? Math.round((s.easyToSellScore + s.bargainScore + s.cashBackScore) / 10) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const quickActions = [
    {
      id: 'meridian-ai',
      label: 'Meridian AI',
      sublabel: 'GSE Research Desk',
      icon: Zap,
      badge: 'PRO',
      color: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
      action: onOpenMeridianAI || (() => onNavigateTab('chat'))
    },
    {
      id: 'market-close',
      label: 'Daily Close Report',
      sublabel: 'GSE Session Summary',
      icon: Activity,
      badge: 'REPORT',
      color: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      action: onOpenMarketCloseReport || (() => onNavigateTab('markets'))
    },
    {
      id: 'screener',
      label: 'Stocks',
      sublabel: 'All Listed Stocks',
      icon: TrendingUp,
      badge: 'LIVE',
      color: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
      action: () => onNavigateTab('markets')
    },
    {
      id: 'dividends',
      label: 'Dividend Calendar',
      sublabel: 'Yield & Payouts',
      icon: Calendar,
      badge: 'CASH',
      color: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      action: onOpenDividendModal
    },
    {
      id: 'fx-rates',
      label: 'USD / GHS Rate',
      sublabel: 'Live Bank Rates',
      icon: ArrowRightLeft,
      badge: currency === 'USD' ? `$1 = GH₵${exchangeRateUsd.toFixed(2)}` : `GH₵${exchangeRateUsd.toFixed(2)}`,
      color: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      action: onOpenFxModal
    },
    {
      id: 'calculators',
      label: 'Financial Engines',
      sublabel: 'ROI, MoMo & Tax',
      icon: Calculator,
      badge: 'TOOLS',
      color: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
      action: () => onNavigateTab('calculators')
    }
  ];

  // Portfolio standing calculations
  const rateFactor = currency === 'USD' ? 1 / (exchangeRateUsd || 15.5) : 1;
  const currencySymbol = currency === 'USD' ? '$' : 'GH₵';

  let totalCostGhs = 0;
  let totalCurrentValueGhs = 0;
  let totalTodayGainGhs = 0;
  let totalAnnualDividendGhs = 0;

  const enrichedHoldings = holdings.map((h) => {
    const liveStock = stocks.find((s) => s.ticker === h.ticker);
    const currentPrice = liveStock?.price ?? h.buyPrice;
    const todayChange = liveStock?.change ?? 0;
    const cost = h.sharesCount * h.buyPrice;
    const value = h.sharesCount * currentPrice;
    const dayGain = h.sharesCount * todayChange;
    const dividend = liveStock?.dividendAmount ? h.sharesCount * liveStock.dividendAmount : 0;

    totalCostGhs += cost;
    totalCurrentValueGhs += value;
    totalTodayGainGhs += dayGain;
    totalAnnualDividendGhs += dividend;

    return {
      ...h,
      stock: liveStock,
      currentPrice,
      cost,
      value,
      dayGain,
      gain: value - cost,
      gainPct: cost > 0 ? ((value - cost) / cost) * 100 : 0
    };
  });

  const totalGainGhs = totalCurrentValueGhs - totalCostGhs;
  const totalGainPct = totalCostGhs > 0 ? (totalGainGhs / totalCostGhs) * 100 : 0;
  const prevValue = totalCurrentValueGhs - totalTodayGainGhs;
  const todayGainPct = prevValue > 0 ? (totalTodayGainGhs / prevValue) * 100 : 0;
  const isOverallPositive = totalGainGhs >= 0;
  const isTodayPositive = totalTodayGainGhs >= 0;

  // Generate responsive trajectory points for the portfolio standing chart
  const portfolioChartData = useMemo(() => {
    if (holdings.length === 0) {
      return [
        { label: 'Wk 1', value: 5000 },
        { label: 'Wk 2', value: 5200 },
        { label: 'Wk 3', value: 5150 },
        { label: 'Wk 4', value: 5450 },
        { label: 'Live', value: 5800 }
      ];
    }

    const baseline = totalCostGhs * rateFactor;
    const current = totalCurrentValueGhs * rateFactor;
    const prevDay = (totalCurrentValueGhs - totalTodayGainGhs) * rateFactor;

    return [
      { label: 'Inception', value: Number(baseline.toFixed(2)) },
      { label: 'Wk 1', value: Number((baseline * 0.95 + current * 0.05).toFixed(2)) },
      { label: 'Wk 2', value: Number((baseline * 0.70 + current * 0.30).toFixed(2)) },
      { label: 'Wk 3', value: Number((baseline * 0.40 + current * 0.60).toFixed(2)) },
      { label: 'Yesterday', value: Number(prevDay.toFixed(2)) },
      { label: 'Live Today', value: Number(current.toFixed(2)) }
    ];
  }, [holdings.length, totalCostGhs, totalCurrentValueGhs, totalTodayGainGhs, rateFactor]);

  return (
    <div className="space-y-6 pb-20 w-full max-w-full overflow-x-hidden">
      {/* 1. Executive Portfolio Standing Hero Row (Replacing GSE-CI / GSE-FSI) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Standing Chart Card (Spans 2 columns on lg) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#080E24] via-[#0D1636] to-[#080E24] border border-cyan-500/30 p-5 sm:p-6 text-white shadow-2xl group flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 gap-3">
              <div>
                <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs font-mono font-bold text-cyan-400">
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  <span>PORTFOLIO STANDING</span>
                  <span className="hidden sm:inline">•</span>
                  <span>ACCRA LIVE</span>
                  <InfoButton 
                    onClick={() => onOpenJargonGuide('portfolio')} 
                    title="Portfolio Standing: Live total value and returns across your GSE equity positions." 
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {holdings.length > 0 
                    ? `Tracking ${holdings.length} active position${holdings.length === 1 ? '' : 's'} on Ghana Stock Exchange`
                    : 'Personal equity portfolio performance & asset trajectory'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigateTab('portfolio')}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Open Portfolio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Metric Value & Returns Row */}
            <div className="relative z-10 mt-4 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight tabular-nums text-white">
                    {currencySymbol} {(totalCurrentValueGhs * rateFactor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  {currency === 'GHS' && exchangeRateUsd && (
                    <span className="text-xs font-mono text-slate-400">
                      ≈ ${(totalCurrentValueGhs / exchangeRateUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 font-mono text-xs font-bold">
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg ${
                    isOverallPositive 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {isOverallPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>
                      {isOverallPositive ? '+' : ''}{currencySymbol} {(totalGainGhs * rateFactor).toFixed(2)} ({isOverallPositive ? '+' : ''}{totalGainPct.toFixed(2)}%) Total Return
                    </span>
                  </div>

                  <div className={`flex items-center gap-1 text-[11px] ${
                    isTodayPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    <span>
                      {isTodayPositive ? '+' : ''}{currencySymbol} {(totalTodayGainGhs * rateFactor).toFixed(2)} ({isTodayPositive ? '+' : ''}{todayGainPct.toFixed(2)}%) Today
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick cost basis badge */}
              <div className="text-right font-mono text-xs text-slate-400">
                <span className="text-[10px] uppercase text-slate-500 block">Cost Basis / Invested</span>
                <span className="text-white font-bold text-sm">
                  {currencySymbol} {(totalCostGhs * rateFactor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Area Chart */}
          <div className="mt-4 relative z-10 w-full h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="portfolioStandingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isOverallPositive ? '#10B981' : '#06B6D4'} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={isOverallPositive ? '#10B981' : '#06B6D4'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="label" 
                  stroke="#64748b" 
                  fontSize={10} 
                  fontFamily="monospace"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  hide={true} 
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0B132B',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${currencySymbol} ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Standing']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isOverallPositive ? '#10B981' : '#06B6D4'} 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#portfolioStandingGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Capital Health & Annual Dividend Inflow */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#080E24] via-[#0E1838] to-[#080E24] border border-white/[0.08] p-5 sm:p-6 text-white shadow-xl flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
              <div className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                <span>INCOME & POSITIONS</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                CASH FLOW
              </span>
            </div>

            <div className="mt-3">
              <span className="text-[11px] font-mono text-slate-400 block">Est. Annual Cash Dividend</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tabular-nums">
                  {currencySymbol} {(totalAnnualDividendGhs * rateFactor).toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">/ year</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Passive cash payouts deposited straight to your CSD broker account.
              </p>
            </div>

            {/* Positions pill list or empty state */}
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                TOP HOLDINGS ALLOCATION
              </span>
              {holdings.length > 0 ? (
                <div className="space-y-1.5 max-h-28 overflow-y-auto custom-scrollbar pr-1">
                  {enrichedHoldings.slice(0, 3).map((h) => (
                    <div 
                      key={h.id}
                      onClick={() => h.stock && onSelectStock(h.stock)}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#060B18] border border-white/[0.06] hover:border-cyan-500/40 cursor-pointer transition-all text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <StockLogo ticker={h.ticker} size={22} />
                        <div>
                          <span className="font-mono font-bold text-white block leading-tight">{h.ticker}</span>
                          <span className="text-[10px] font-mono text-slate-400">{h.sharesCount.toLocaleString()} shs</span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-white font-bold block">{currencySymbol} {(h.value * rateFactor).toFixed(2)}</span>
                        <span className={`text-[10px] ${h.gain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {h.gain >= 0 ? '+' : ''}{h.gainPct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.04] text-center">
                  <p className="text-xs text-slate-300 font-medium">No shares tracked yet</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Add your GSE holdings to unlock automated valuation & alerts</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Footer */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onOpenDividendModal}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold font-mono transition-colors cursor-pointer"
            >
              Dividend Calendar
            </button>
            <button
              type="button"
              onClick={onOpenAddHolding || (() => onNavigateTab('portfolio'))}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Shares</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Terminal Desks Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {quickActions.map((qa) => {
          const Icon = qa.icon;
          return (
            <button
              key={qa.id}
              onClick={qa.action}
              className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-white/[0.08] hover:border-amber-400 dark:hover:border-cyan-500/50 shadow-xs hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${qa.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {qa.badge && (
                  <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                    {qa.badge}
                  </span>
                )}
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block group-hover:text-cyan-400 transition-colors">
                  {qa.label}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block truncate mt-0.5">
                  {qa.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Latest Exchange Disclosure Banner */}
      {latestNews && (
        <div className="bg-gradient-to-r from-[#070D1F] via-[#0B132B] to-[#070D1F] rounded-2xl p-4 text-white border border-cyan-500/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30 mt-0.5">
              <Newspaper className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  OFFICIAL DISCLOSURE • {latestNews.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {latestNews.source}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
                {latestNews.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {onSelectNews && (
              <button
                onClick={() => onSelectNews(latestNews)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer shadow"
              >
                <span>Read Disclosure</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Top Movers & Meridian Champions Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1: Top Session Gainers */}
        <div className="bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white font-mono">
                    TOP GAINERS
                  </h3>
                  <InfoButton onClick={() => onOpenJargonGuide('variation')} title="What is Price Variation? Measured in %. Higher is better for holders." />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Daily % Outperformers • Higher is better ↑</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('markets')}
              className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 hover:underline flex items-center gap-0.5 cursor-pointer font-mono"
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {gainers.map((stock) => (
              <button
                key={stock.ticker}
                onClick={() => onSelectStock(stock)}
                className="w-full py-2.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-[#0F1A3A] rounded-xl px-2 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StockLogo ticker={stock.ticker} name={stock.name} sector={stock.sector} size={34} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold font-mono text-slate-900 dark:text-white truncate group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {stock.ticker}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-medium">
                      {currencySymbol} {(stock.price * rateFactor).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-mono text-xs font-black bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 tabular-nums shrink-0 shadow-2xs">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+{stock.changePercent.toFixed(2)}%</span>
                  </div>
                  <span className="block text-[8px] font-mono text-emerald-800 dark:text-emerald-400 font-bold mt-0.5">
                    Gain (Higher ↑)
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Top Value Dips & Losers */}
        <div className="bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white font-mono">
                    VALUE DIPS
                  </h3>
                  <InfoButton onClick={() => onOpenJargonGuide('variation')} title="What is a Value Dip? Price drop offering a cheaper discount buy." />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Discount Buys • Lower entry price ↓</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('markets')}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer font-mono"
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {losers.map((stock) => (
              <button
                key={stock.ticker}
                onClick={() => onSelectStock(stock)}
                className="w-full py-2.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-[#0F1A3A] rounded-xl px-2 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StockLogo ticker={stock.ticker} name={stock.name} sector={stock.sector} size={34} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold font-mono text-slate-900 dark:text-white truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {stock.ticker}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-medium">
                      {currencySymbol} {(stock.price * rateFactor).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-mono text-xs font-black bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 tabular-nums shrink-0 shadow-2xs">
                    <ArrowDownRight className="w-3 h-3" />
                    <span>{stock.changePercent.toFixed(2)}%</span>
                  </div>
                  <span className="block text-[8px] font-mono text-rose-800 dark:text-rose-400 font-bold mt-0.5">
                    Dip (Discount ↓)
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Column 3: Meridian 5-Axis Champions */}
        <div className="bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white font-mono">
                    MERIDIAN AXIS PICKS
                  </h3>
                  <InfoButton onClick={() => onOpenJargonGuide('axis')} title="Meridian Axis: Scale 0-30. Higher is better!" />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Top Health Scores • Scale 0-30 ↑</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('markets')}
              className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 hover:underline flex items-center gap-0.5 cursor-pointer font-mono"
            >
              <span>Screener</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {axisChampions.map(({ stock, score }) => (
              <button
                key={stock.ticker}
                onClick={() => onSelectStock(stock)}
                className="w-full py-2.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-[#0F1A3A] rounded-xl px-2 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StockLogo ticker={stock.ticker} name={stock.name} sector={stock.sector} size={34} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold font-mono text-slate-900 dark:text-white truncate group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {stock.ticker}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-medium">
                      Yield: <strong className="text-amber-800 dark:text-amber-400">{stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(1)}%` : '0%'}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-black text-amber-900 dark:text-amber-400 tabular-nums">
                      {score}/30
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                      {score >= 22 ? 'EXCEPTIONAL' : 'STRONG'}
                    </span>
                  </div>
                  <span className="text-[8px] font-mono text-amber-800 dark:text-amber-400 mt-0.5 font-bold">
                    Higher ↑
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Prominent Upcoming Dividends & Cash Yields Section */}
      <div className="bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  UPCOMING DIVIDENDS & CASH PAYOUTS
                </h3>
                <InfoButton onClick={() => onOpenJargonGuide('dividend')} title="Dividends: Cash rewards paid to shareholders. Higher is better!" />
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  HIGH CASH YIELD • HIGHER ↑
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Top GSE cash dividend distributions, announced record dates & payout yields
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDividendModal}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <span>Open Dividend Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Rule Banner */}
        <div className="p-3 bg-amber-500/10 dark:bg-amber-500/5 rounded-xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-mono text-[11px]">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>Rule of Capture:</strong> To receive cash dividends, you must purchase and hold shares <strong>before</strong> the Ex-Dividend cutoff date.
            </span>
            <InfoButton onClick={() => onOpenJargonGuide('ex_dividend')} title="Ex-Dividend Cutoff Date: Buy before this deadline to receive payout." />
          </div>
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
            Ghana Withholding Tax: <strong className="text-emerald-500">8.0% final WHT</strong>
          </span>
        </div>

        {/* Dividend Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {[...stocks]
            .filter((s) => (s.dividendYield && s.dividendYield > 0) || s.exDividendDate || s.dividendAmount)
            .sort((a, b) => (b.dividendYield || 0) - (a.dividendYield || 0))
            .slice(0, 6)
            .map((stock) => (
              <div
                key={stock.ticker}
                onClick={() => onSelectStock(stock)}
                className="p-4 rounded-xl bg-slate-50 dark:bg-[#070D1F] hover:bg-slate-100 dark:hover:bg-[#0F1A3A] border border-slate-200/80 dark:border-white/[0.08] transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <StockLogo
                      ticker={stock.ticker}
                      name={stock.name}
                      sector={stock.sector}
                      size={40}
                      className="rounded-xl shadow-xs shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-amber-400 transition-colors">
                        {stock.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {stock.ticker} • {stock.sector}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {stock.dividendYield ? `${stock.dividendYield.toFixed(1)}%` : 'Active'}
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Payout / Share</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {stock.dividendAmount
                        ? `${currencySymbol} ${(stock.dividendAmount * rateFactor).toFixed(2)}`
                        : `~${currencySymbol} ${(stock.price * rateFactor * (stock.dividendYield || 5) / 100).toFixed(2)}`}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Cutoff Date</span>
                    <span className="font-semibold text-amber-500 dark:text-amber-400">
                      {stock.exDividendDate || 'Announced Annually'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
