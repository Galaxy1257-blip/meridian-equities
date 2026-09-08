import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, BarChart2, Maximize2, Layers, Eye, RefreshCw } from 'lucide-react';
import { PricePoint, Stock } from '../types';

export type TimeframeOption = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
export type ChartStyleOption = 'area' | 'combo' | 'line' | 'candle';

interface StockPriceChartProps {
  stock: Stock;
  currency: 'GHS' | 'USD';
  exchangeRateUsd: number;
}

export const StockPriceChart: React.FC<StockPriceChartProps> = ({
  stock,
  currency,
  exchangeRateUsd
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('1M');
  const [chartStyle, setChartStyle] = useState<ChartStyleOption>('area');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showReferenceLines, setShowReferenceLines] = useState<boolean>(true);

  // Rate factor
  const rateFactor = currency === 'USD' ? 1 / (exchangeRateUsd || 15.5) : 1;
  const currencySymbol = currency === 'USD' ? '$' : 'GH₵';

  // Get raw history data for the selected timeframe
  const rawHistoryData: PricePoint[] = useMemo(() => {
    if (!stock.priceHistory) return [];
    const history = stock.priceHistory[timeframe] || stock.priceHistory['1M'] || [];
    return history;
  }, [stock, timeframe]);

  // Compute enriched chart data (calculates currency conversion, Moving Average (SMA-5), and Period High/Low)
  const chartData = useMemo(() => {
    if (!rawHistoryData || rawHistoryData.length === 0) return [];

    const periodPoints = rawHistoryData.map((pt, idx) => {
      const priceConverted = Number((pt.price * rateFactor).toFixed(2));
      
      // Calculate a 5-period Simple Moving Average
      const windowStart = Math.max(0, idx - 4);
      const windowSlice = rawHistoryData.slice(windowStart, idx + 1);
      const sma = Number(
        (windowSlice.reduce((sum, item) => sum + item.price * rateFactor, 0) / windowSlice.length).toFixed(2)
      );

      return {
        ...pt,
        date: pt.date,
        priceGhs: pt.price,
        displayPrice: priceConverted,
        volume: pt.volume || 10000,
        sma: idx >= 1 ? sma : priceConverted
      };
    });

    return periodPoints;
  }, [rawHistoryData, rateFactor]);

  // Derived statistics for the selected timeframe
  const stats = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return {
        startPrice: 0,
        endPrice: 0,
        change: 0,
        changePercent: 0,
        isPositive: true,
        high: 0,
        low: 0,
        avgVolume: 0,
        totalVolume: 0
      };
    }

    const startPrice = chartData[0].displayPrice;
    const endPrice = chartData[chartData.length - 1].displayPrice;
    const change = Number((endPrice - startPrice).toFixed(2));
    const changePercent = startPrice > 0 ? Number(((change / startPrice) * 100).toFixed(2)) : 0;
    const isPositive = change >= 0;

    const prices = chartData.map((d) => d.displayPrice);
    const high = Math.max(...prices);
    const low = Math.min(...prices);

    const totalVolume = chartData.reduce((sum, d) => sum + d.volume, 0);
    const avgVolume = Math.round(totalVolume / chartData.length);

    return {
      startPrice,
      endPrice,
      change,
      changePercent,
      isPositive,
      high,
      low,
      avgVolume,
      totalVolume
    };
  }, [chartData]);

  // Color palette depending on timeframe performance
  const chartColors = useMemo(() => {
    if (stats.isPositive) {
      return {
        primary: '#10b981', // emerald-500
        secondary: '#059669', // emerald-600
        light: '#ecfdf5',
        gradientStart: '#10b981',
        gradientEnd: '#10b981',
        volume: '#a7f3d0' // emerald-200
      };
    } else {
      return {
        primary: '#f43f5e', // rose-500
        secondary: '#e11d48', // rose-600
        light: '#fff1f2',
        gradientStart: '#f43f5e',
        gradientEnd: '#f43f5e',
        volume: '#fecdd3' // rose-200
      };
    }
  }, [stats.isPositive]);

  // Custom rich Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const currentPrice = data.displayPrice;
      const pointDelta = Number((currentPrice - stats.startPrice).toFixed(2));
      const pointDeltaPct = stats.startPrice > 0 ? Number(((pointDelta / stats.startPrice) * 100).toFixed(2)) : 0;
      const isPointPositive = pointDelta >= 0;

      return (
        <div className="bg-slate-950/95 backdrop-blur-md text-white px-3.5 py-3 rounded-2xl shadow-xl border border-slate-800 text-xs space-y-1.5 min-w-[170px] z-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-slate-400 font-mono text-[11px]">
            <span>{label}</span>
            <span className="text-[10px] uppercase font-bold text-amber-400">{stock.ticker}</span>
          </div>

          <div className="pt-0.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-slate-400 text-[11px]">Price:</span>
              <span className="font-mono font-black text-sm text-white">
                {currencySymbol} {currentPrice.toFixed(2)}
              </span>
            </div>

            {currency === 'USD' && (
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>GHS Value:</span>
                <span>GH₵ {data.priceGhs.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] font-mono mt-1">
              <span className="text-slate-400">vs Period Start:</span>
              <span className={`font-bold ${isPointPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPointPositive ? '+' : ''}{pointDelta.toFixed(2)} ({isPointPositive ? '+' : ''}{pointDeltaPct.toFixed(1)}%)
              </span>
            </div>

            {showSMA && data.sma && (
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 pt-0.5 border-t border-slate-800/80">
                <span>SMA (5-period):</span>
                <span>{currencySymbol} {data.sma.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
              <span>Volume:</span>
              <span>{data.volume.toLocaleString()} shares</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCandlestick = () => {
    const candleData = chartData.map((pt, i) => {
      const prev = chartData[i - 1]?.displayPrice ?? pt.displayPrice;
      const jitter = pt.displayPrice * 0.005;
      const isGreen = pt.displayPrice >= prev;
      const open = Number((prev + (isGreen ? -jitter : jitter)).toFixed(2));
      const close = pt.displayPrice;
      const high = Number((Math.max(open, close) + jitter * 1.8).toFixed(2));
      const low = Number((Math.min(open, close) - jitter * 1.4).toFixed(2));
      return { ...pt, open, close, high, low, isGreen };
    });
    const allPrices = candleData.flatMap(c => [c.high, c.low]);
    const priceMin = Math.min(...allPrices);
    const priceMax = Math.max(...allPrices);
    const priceRange = priceMax - priceMin || 1;
    const W = 360;
    const H = 200;
    const PAD = 20;
    const colW = (W - PAD * 2) / Math.max(candleData.length, 1);
    const toY = (p: number) => PAD + ((priceMax - p) / priceRange) * (H - PAD * 2);

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        {candleData.map((c, i) => {
          const cx = PAD + i * colW + colW / 2;
          const bodyTop = toY(Math.max(c.open, c.close));
          const bodyBot = toY(Math.min(c.open, c.close));
          const bodyH = Math.max(bodyBot - bodyTop, 1);
          const color = c.isGreen ? '#10b981' : '#f43f5e';
          return (
            <g key={i}>
              <line x1={cx} y1={toY(c.high)} x2={cx} y2={toY(c.low)} stroke={color} strokeWidth="1" />
              <rect x={cx - colW * 0.35} y={bodyTop} width={colW * 0.7} height={bodyH} fill={color} fillOpacity={0.9} rx="1" />
            </g>
          );
        })}
        <text x={W - 2} y={toY(priceMax) + 4} textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">{currencySymbol}{priceMax.toFixed(2)}</text>
        <text x={W - 2} y={toY(priceMin) - 2} textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">{currencySymbol}{priceMin.toFixed(2)}</text>
      </svg>
    );
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
      {/* Top Header: Performance Summary & Timeframe Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Historical Price Trends & Analysis</span>
            </div>

            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {timeframe} Range
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-950 dark:text-white">
              {currencySymbol} {stats.endPrice.toFixed(2)}
            </span>
            <span
              className={`inline-flex items-center gap-0.5 text-xs sm:text-sm font-bold font-mono px-2 py-0.5 rounded-lg ${
                stats.isPositive
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20'
              }`}
            >
              {stats.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>
                {stats.isPositive ? '+' : ''}{stats.change.toFixed(2)} ({stats.isPositive ? '+' : ''}{stats.changePercent.toFixed(2)}%)
              </span>
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden md:inline">
              in the selected period
            </span>
          </div>
        </div>

        {/* Timeframe Switcher Tabs */}
        <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs text-xs font-bold font-mono self-start sm:self-auto overflow-x-auto max-w-full">
          {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as TimeframeOption[]).map((tf) => (
            <button
              key={tf}
              id={`timeframe-btn-${tf}`}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                timeframe === tf
                  ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Style & Indicators Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
        {/* Style selection */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setChartStyle('area')}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              chartStyle === 'area' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Area chart with smooth gradient"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Area</span>
          </button>

          <button
            onClick={() => setChartStyle('combo')}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              chartStyle === 'combo' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Combined Price Trend + Volume Bars"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Price + Volume</span>
          </button>

          <button
            onClick={() => setChartStyle('line')}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              chartStyle === 'line' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Clean Line Chart"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Line</span>
          </button>

          <button
            onClick={() => setChartStyle('candle')}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              chartStyle === 'candle' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Japanese Candlestick OHLC Chart"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Candle</span>
          </button>
        </div>

        {/* Technical Indicators Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`px-2.5 py-1 rounded-lg font-bold border transition-colors flex items-center gap-1.5 ${
              showSMA
                ? 'bg-amber-500/15 border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title="Toggle Simple Moving Average (SMA)"
          >
            <div className={`w-2 h-2 rounded-full ${showSMA ? 'bg-amber-500' : 'bg-slate-400'}`} />
            <span>SMA (5)</span>
          </button>

          <button
            onClick={() => setShowReferenceLines(!showReferenceLines)}
            className={`px-2.5 py-1 rounded-lg font-bold border transition-colors flex items-center gap-1.5 ${
              showReferenceLines
                ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title="Toggle High/Low and Opening Base Reference Lines"
          >
            <div className={`w-2 h-2 rounded-full ${showReferenceLines ? 'bg-white' : 'bg-slate-400'}`} />
            <span>High/Low Guides</span>
          </button>
        </div>
      </div>

      {/* Main Recharts Visualization Canvas */}
      <div className="h-64 sm:h-72 w-full bg-white dark:bg-slate-950 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-2xs relative">
        <ResponsiveContainer width="100%" height="100%">
          {chartStyle === 'combo' ? (
            <ComposedChart data={chartData} margin={{ top: 12, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradientCombo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.gradientStart} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={chartColors.gradientEnd} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415525" />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                axisLine={{ stroke: '#475569' }}
                tickLine={false}
              />

              {/* Left Y-Axis for Price */}
              <YAxis
                yAxisId="priceAxis"
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${currencySymbol}${v}`}
              />

              {/* Right Y-Axis for Trading Volume */}
              <YAxis
                yAxisId="volumeAxis"
                orientation="right"
                domain={[0, (dataMax: number) => dataMax * 4]} // Scale down volume bars
                tick={false}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* High / Low reference guides */}
              {showReferenceLines && (
                <>
                  <ReferenceLine
                    yAxisId="priceAxis"
                    y={stats.high}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    label={{
                      value: `H: ${currencySymbol}${stats.high.toFixed(2)}`,
                      position: 'top',
                      fill: '#10b981',
                      fontSize: 10,
                      fontWeight: 'bold'
                    }}
                  />
                  <ReferenceLine
                    yAxisId="priceAxis"
                    y={stats.low}
                    stroke="#f43f5e"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    label={{
                      value: `L: ${currencySymbol}${stats.low.toFixed(2)}`,
                      position: 'bottom',
                      fill: '#f43f5e',
                      fontSize: 10,
                      fontWeight: 'bold'
                    }}
                  />
                  <ReferenceLine
                    yAxisId="priceAxis"
                    y={stats.startPrice}
                    stroke="#64748b"
                    strokeDasharray="2 2"
                    strokeWidth={1}
                  />
                </>
              )}

              {/* Trading Volume Bar Chart (Secondary Axis) */}
              <Bar
                yAxisId="volumeAxis"
                dataKey="volume"
                fill={chartColors.volume}
                opacity={0.65}
                radius={[4, 4, 0, 0]}
              />

              {/* Primary Price Area */}
              <Area
                yAxisId="priceAxis"
                type="monotone"
                dataKey="displayPrice"
                stroke={chartColors.secondary}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#priceGradientCombo)"
                activeDot={{ r: 6, fill: chartColors.secondary, stroke: '#ffffff', strokeWidth: 2 }}
              />

              {/* SMA Moving Average Line */}
              {showSMA && (
                <Line
                  yAxisId="priceAxis"
                  type="monotone"
                  dataKey="sma"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 3"
                />
              )}
            </ComposedChart>
          ) : chartStyle === 'line' ? (
            <LineChart data={chartData} margin={{ top: 12, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415525" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                axisLine={{ stroke: '#475569' }}
                tickLine={false}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${currencySymbol}${v}`}
              />
              <Tooltip content={<CustomTooltip />} />

              {showReferenceLines && (
                <>
                  <ReferenceLine
                    y={stats.high}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    label={{
                      value: `H: ${currencySymbol}${stats.high.toFixed(2)}`,
                      position: 'top',
                      fill: '#10b981',
                      fontSize: 10,
                      fontWeight: 'bold'
                    }}
                  />
                  <ReferenceLine
                    y={stats.low}
                    stroke="#f43f5e"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    label={{
                      value: `L: ${currencySymbol}${stats.low.toFixed(2)}`,
                      position: 'bottom',
                      fill: '#f43f5e',
                      fontSize: 10,
                      fontWeight: 'bold'
                    }}
                  />
                </>
              )}

              <Line
                type="monotone"
                dataKey="displayPrice"
                stroke={chartColors.secondary}
                strokeWidth={2.5}
                dot={{ r: 3, fill: chartColors.secondary, strokeWidth: 0 }}
                activeDot={{ r: 7, fill: chartColors.secondary, stroke: '#ffffff', strokeWidth: 2 }}
              />

              {showSMA && (
                <Line
                  type="monotone"
                  dataKey="sma"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 3"
                />
              )}
            </LineChart>
          ) : chartStyle === 'candle' ? (
            renderCandlestick()
          ) : (
            <AreaChart data={chartData} margin={{ top: 12, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradientArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.gradientStart} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={chartColors.gradientEnd} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415525" />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                axisLine={{ stroke: '#475569' }}
                tickLine={false}
              />

              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${currencySymbol}${v}`}
              />

              <Tooltip content={<CustomTooltip />} />

              {showReferenceLines && (
                <>
                  <ReferenceLine
                    y={stats.high}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    label={{
                      value: `H: ${currencySymbol}${stats.high.toFixed(2)}`,
                      position: 'top',
                      fill: '#10b981',
                      fontSize: 10,
                      fontWeight: 'bold'
                    }}
                  />
                  <ReferenceLine
                    y={stats.low}
                    stroke="#f43f5e"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    label={{
                      value: `L: ${currencySymbol}${stats.low.toFixed(2)}`,
                      position: 'bottom',
                      fill: '#f43f5e',
                      fontSize: 10,
                      fontWeight: 'bold'
                    }}
                  />
                  <ReferenceLine
                    y={stats.startPrice}
                    stroke="#64748b"
                    strokeDasharray="2 2"
                    strokeWidth={1}
                  />
                </>
              )}

              <Area
                type="monotone"
                dataKey="displayPrice"
                stroke={chartColors.secondary}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#priceGradientArea)"
                activeDot={{ r: 6, fill: chartColors.secondary, stroke: '#ffffff', strokeWidth: 2 }}
              />

              {showSMA && (
                <Line
                  type="monotone"
                  dataKey="sma"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 3"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Period Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <div className="bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase block">Period Open</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
            {currencySymbol} {stats.startPrice.toFixed(2)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase block">Period High</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
            {currencySymbol} {stats.high.toFixed(2)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase block">Period Low</span>
          <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">
            {currencySymbol} {stats.low.toFixed(2)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase block">Avg Period Volume</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
            {stats.avgVolume.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
