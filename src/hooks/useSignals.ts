import { useMemo } from 'react';
import { Stock, PricePoint } from '../types';

export type SignalType =
  | 'RSI_OVERSOLD'
  | 'RSI_OVERBOUGHT'
  | 'WEEK52_BREAKOUT'
  | 'WEEK52_BREACH'
  | 'VOLUME_SPIKE'
  | 'MACD_BULLISH'
  | 'MACD_BEARISH'
  | 'GOLDEN_CROSS'
  | 'DEATH_CROSS'
  | 'CONSECUTIVE_GREEN'
  | 'CONSECUTIVE_RED';

export interface Signal {
  type: SignalType;
  ticker: string;
  label: string;
  description: string;
  severity: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-100
  detectedAt: string;
}

export function computeRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - diff) / period;
    }
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Number((100 - 100 / (1 + rs)).toFixed(1));
}

export function computeEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const ema: number[] = [prices[0] || 0];
  for (let i = 1; i < prices.length; i++) {
    ema.push(prices[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
}

export function computeMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
  if (prices.length < 26) {
    return { macd: 0, signal: 0, histogram: 0 };
  }
  const ema12 = computeEMA(prices, 12);
  const ema26 = computeEMA(prices, 26);
  const macdLine: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    macdLine.push(ema12[i] - ema26[i]);
  }
  const signalLine = computeEMA(macdLine, 9);
  const lastIndex = prices.length - 1;
  const macd = Number(macdLine[lastIndex].toFixed(3));
  const signal = Number(signalLine[lastIndex].toFixed(3));
  const histogram = Number((macd - signal).toFixed(3));
  return { macd, signal, histogram };
}

export function computeSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] || 0;
  const slice = prices.slice(-period);
  const sum = slice.reduce((a, b) => a + b, 0);
  return sum / period;
}

export function detectSignals(stock: Stock): Signal[] {
  const signals: Signal[] = [];
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Extract price arrays
  const historyPoints: PricePoint[] =
    stock.priceHistory?.['1M'] || stock.priceHistory?.['1W'] || stock.priceHistory?.['1D'] || [];
  const prices = historyPoints.map((p) => p.price);
  if (prices.length === 0) {
    prices.push(stock.price);
  }

  // 1 & 2: RSI Signals
  const rsi = computeRSI(prices);
  if (rsi <= 32) {
    signals.push({
      type: 'RSI_OVERSOLD',
      ticker: stock.ticker,
      label: `RSI Oversold (${rsi})`,
      description: `${stock.name} has touched oversold territory. Potential value accumulation level.`,
      severity: 'bullish',
      strength: Math.min(100, Math.round((35 - rsi) * 4 + 60)),
      detectedAt: now,
    });
  } else if (rsi >= 68) {
    signals.push({
      type: 'RSI_OVERBOUGHT',
      ticker: stock.ticker,
      label: `RSI Overbought (${rsi})`,
      description: `${stock.name} is reading overbought. Momentum may face near-term resistance.`,
      severity: 'bearish',
      strength: Math.min(100, Math.round((rsi - 65) * 4 + 60)),
      detectedAt: now,
    });
  }

  // 3 & 4: 52-Week High / Low
  if (stock.high52W && stock.price >= stock.high52W * 0.98) {
    signals.push({
      type: 'WEEK52_BREAKOUT',
      ticker: stock.ticker,
      label: '52-Week High Breakout',
      description: `Trading near 52-week peak of GH₵${stock.high52W.toFixed(2)}. Bullish expansion.`,
      severity: 'bullish',
      strength: 88,
      detectedAt: now,
    });
  }
  if (stock.low52W && stock.price <= stock.low52W * 1.03) {
    signals.push({
      type: 'WEEK52_BREACH',
      ticker: stock.ticker,
      label: '52-Week Low Test',
      description: `Testing 52-week support floor of GH₵${stock.low52W.toFixed(2)}. Monitor downside risk.`,
      severity: 'bearish',
      strength: 78,
      detectedAt: now,
    });
  }

  // 5: Volume Spike
  const avgVol = historyPoints.length > 0
    ? historyPoints.reduce((acc, p) => acc + (p.volume || 10000), 0) / historyPoints.length
    : 50000;
  if (stock.volume > avgVol * 2.2) {
    signals.push({
      type: 'VOLUME_SPIKE',
      ticker: stock.ticker,
      label: `Volume Spike (${(stock.volume / (avgVol || 1)).toFixed(1)}x avg)`,
      description: `Surge in trading volume (${stock.volume.toLocaleString()} shares). Institutional interest indicated.`,
      severity: stock.change >= 0 ? 'bullish' : 'bearish',
      strength: 85,
      detectedAt: now,
    });
  }

  // 6 & 7: MACD Bullish / Bearish
  const macdData = computeMACD(prices);
  if (macdData.histogram > 0 && macdData.macd > macdData.signal) {
    signals.push({
      type: 'MACD_BULLISH',
      ticker: stock.ticker,
      label: 'MACD Bullish Crossover',
      description: `MACD line (+${macdData.macd}) crossed above 9-day signal (+${macdData.signal}).`,
      severity: 'bullish',
      strength: 75,
      detectedAt: now,
    });
  } else if (macdData.histogram < 0 && macdData.macd < macdData.signal) {
    signals.push({
      type: 'MACD_BEARISH',
      ticker: stock.ticker,
      label: 'MACD Bearish Divergence',
      description: `MACD line (${macdData.macd}) dipped below signal (${macdData.signal}). Negative momentum.`,
      severity: 'bearish',
      strength: 72,
      detectedAt: now,
    });
  }

  // 8 & 9: Golden / Death Cross
  const shortMA = computeSMA(prices, 5);
  const longMA = computeSMA(prices, 15);
  if (shortMA > longMA * 1.01) {
    signals.push({
      type: 'GOLDEN_CROSS',
      ticker: stock.ticker,
      label: 'Short-Term Golden Cross',
      description: `Short moving average (GH₵${shortMA.toFixed(2)}) is trending comfortably above trendline (GH₵${longMA.toFixed(2)}).`,
      severity: 'bullish',
      strength: 80,
      detectedAt: now,
    });
  } else if (shortMA < longMA * 0.99) {
    signals.push({
      type: 'DEATH_CROSS',
      ticker: stock.ticker,
      label: 'Moving Average Bear Cross',
      description: `Short moving average (GH₵${shortMA.toFixed(2)}) is lagging below long trendline.`,
      severity: 'bearish',
      strength: 70,
      detectedAt: now,
    });
  }

  // 10 & 11: Consecutive Days
  if (prices.length >= 4) {
    const last4 = prices.slice(-4);
    const allRising = last4[3] > last4[2] && last4[2] > last4[1] && last4[1] > last4[0];
    const allFalling = last4[3] < last4[2] && last4[2] < last4[1] && last4[1] < last4[0];

    if (allRising) {
      signals.push({
        type: 'CONSECUTIVE_GREEN',
        ticker: stock.ticker,
        label: '4-Session Green Streak',
        description: `${stock.name} has recorded 4 consecutive upward closing intervals.`,
        severity: 'bullish',
        strength: 82,
        detectedAt: now,
      });
    } else if (allFalling) {
      signals.push({
        type: 'CONSECUTIVE_RED',
        ticker: stock.ticker,
        label: 'Consecutive Red Sessions',
        description: `Persistent selling pressure observed across the last four sessions.`,
        severity: 'bearish',
        strength: 76,
        detectedAt: now,
      });
    }
  }

  return signals;
}

export function useSignals(stocks: Stock[]): Record<string, Signal[]> {
  return useMemo(() => {
    const map: Record<string, Signal[]> = {};
    for (const s of stocks) {
      map[s.ticker] = detectSignals(s);
    }
    return map;
  }, [stocks]);
}
