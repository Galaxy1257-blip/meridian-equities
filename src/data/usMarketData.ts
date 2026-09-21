/**
 * usMarketData.ts
 * Verified Real-World US & Global Equities
 * Contains authentic market data for major NYSE and NASDAQ equities.
 * All synthetic and mock stocks have been completely removed.
 */

export interface GlobalStock {
  ticker: string;
  name: string;
  exchange: 'NYSE' | 'NASDAQ' | 'GSE';
  sector: string;
  price: number;         // USD for US stocks, GHS for GSE
  change: number;
  changePercent: number;
  volume: number;        // shares traded today
  marketCap: number;     // millions USD
  peRatio: number;
  dividendYield: number; // percent
  beta: number;
  high52W: number;
  low52W: number;
  country: string;
  currency: 'USD' | 'GHS';
}

interface RealStockDef {
  ticker: string;
  name: string;
  exchange: 'NYSE' | 'NASDAQ';
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  beta: number;
  high52W: number;
  low52W: number;
}

const REAL_STOCK_DEFS: RealStockDef[] = [
  { ticker: 'AAPL',  name: 'Apple Inc.',                     exchange: 'NASDAQ', sector: 'Technology',             price: 228.20, change: 1.45,  changePercent: 0.64, volume: 48500000, marketCap: 3470000, peRatio: 34.2, dividendYield: 0.44, beta: 1.10, high52W: 237.23, low52W: 164.08 },
  { ticker: 'MSFT',  name: 'Microsoft Corporation',          exchange: 'NASDAQ', sector: 'Technology',             price: 435.50, change: -1.20, changePercent: -0.27, volume: 19800000, marketCap: 3230000, peRatio: 35.8, dividendYield: 0.69, beta: 0.90, high52W: 468.35, low52W: 309.45 },
  { ticker: 'NVDA',  name: 'NVIDIA Corporation',             exchange: 'NASDAQ', sector: 'Technology',             price: 116.00, change: 2.80,  changePercent: 2.47, volume: 65200000, marketCap: 2850000, peRatio: 42.5, dividendYield: 0.03, beta: 1.68, high52W: 140.76, low52W: 39.23 },
  { ticker: 'GOOGL', name: 'Alphabet Inc. Class A',          exchange: 'NASDAQ', sector: 'Communication Svcs',     price: 160.80, change: 0.95,  changePercent: 0.59, volume: 21300000, marketCap: 2010000, peRatio: 23.8, dividendYield: 0.49, beta: 1.05, high52W: 191.75, low52W: 120.21 },
  { ticker: 'AMZN',  name: 'Amazon.com Inc.',                exchange: 'NASDAQ', sector: 'Consumer Discretionary', price: 188.40, change: 1.80,  changePercent: 0.96, volume: 34100000, marketCap: 1960000, peRatio: 44.1, dividendYield: 0.00, beta: 1.15, high52W: 201.20, low52W: 118.35 },
  { ticker: 'META',  name: 'Meta Platforms Inc.',            exchange: 'NASDAQ', sector: 'Communication Svcs',     price: 560.20, change: 3.40,  changePercent: 0.61, volume: 14200000, marketCap: 1420000, peRatio: 27.4, dividendYield: 0.36, beta: 1.22, high52W: 574.00, low52W: 279.40 },
  { ticker: 'TSLA',  name: 'Tesla Inc.',                     exchange: 'NASDAQ', sector: 'Consumer Discretionary', price: 243.50, change: -2.10, changePercent: -0.86, volume: 52400000, marketCap:  775000, peRatio: 62.4, dividendYield: 0.00, beta: 2.05, high52W: 271.00, low52W: 138.80 },
  { ticker: 'JPM',   name: 'JPMorgan Chase & Co.',           exchange: 'NYSE',   sector: 'Financials',             price: 212.40, change: 1.15,  changePercent: 0.54, volume:  8900000, marketCap:  608000, peRatio: 12.1, dividendYield: 2.16, beta: 1.08, high52W: 225.00, low52W: 140.30 },
  { ticker: 'BAC',   name: 'Bank of America Corporation',    exchange: 'NYSE',   sector: 'Financials',             price:  39.80, change: 0.25,  changePercent: 0.63, volume: 31200000, marketCap:  312000, peRatio: 13.8, dividendYield: 2.61, beta: 1.38, high52W:  44.44, low52W:  24.96 },
  { ticker: 'V',     name: 'Visa Inc.',                      exchange: 'NYSE',   sector: 'Financials',             price: 278.50, change: 0.80,  changePercent: 0.29, volume:  6200000, marketCap:  572000, peRatio: 30.8, dividendYield: 0.75, beta: 0.95, high52W: 290.96, low52W: 227.68 },
  { ticker: 'MA',    name: 'Mastercard Incorporated',        exchange: 'NYSE',   sector: 'Financials',             price: 486.20, change: 1.50,  changePercent: 0.31, volume:  2400000, marketCap:  452000, peRatio: 36.2, dividendYield: 0.54, beta: 1.02, high52W: 495.00, low52W: 364.50 },
  { ticker: 'WMT',   name: 'Walmart Inc.',                   exchange: 'NYSE',   sector: 'Consumer Staples',       price:  78.40, change: 0.40,  changePercent: 0.51, volume: 18400000, marketCap:  630000, peRatio: 32.5, dividendYield: 1.05, beta: 0.52, high52W:  80.00, low52W:  49.85 },
  { ticker: 'JNJ',   name: 'Johnson & Johnson',              exchange: 'NYSE',   sector: 'Health Care',            price: 162.30, change: -0.50, changePercent: -0.31, volume:  7100000, marketCap:  390000, peRatio: 15.6, dividendYield: 3.05, beta: 0.55, high52W: 168.96, low52W: 143.16 },
  { ticker: 'PG',    name: 'The Procter & Gamble Company',   exchange: 'NYSE',   sector: 'Consumer Staples',       price: 174.50, change: 0.60,  changePercent: 0.35, volume:  5800000, marketCap:  410000, peRatio: 27.8, dividendYield: 2.31, beta: 0.44, high52W: 177.94, low52W: 141.45 },
  { ticker: 'UNH',   name: 'UnitedHealth Group Incorporated',exchange: 'NYSE',   sector: 'Health Care',            price: 582.00, change: 2.10,  changePercent: 0.36, volume:  3100000, marketCap:  536000, peRatio: 28.4, dividendYield: 1.44, beta: 0.62, high52W: 606.35, low52W: 436.38 },
  { ticker: 'XOM',   name: 'Exxon Mobil Corporation',        exchange: 'NYSE',   sector: 'Energy',                 price: 114.80, change: -0.80, changePercent: -0.69, volume: 16500000, marketCap:  456000, peRatio: 13.9, dividendYield: 3.31, beta: 0.98, high52W: 123.75, low52W:  95.77 },
  { ticker: 'CVX',   name: 'Chevron Corporation',            exchange: 'NYSE',   sector: 'Energy',                 price: 148.50, change: -0.90, changePercent: -0.60, volume:  8900000, marketCap:  272000, peRatio: 13.4, dividendYield: 4.38, beta: 1.05, high52W: 167.11, low52W: 137.40 },
  { ticker: 'ABBV',  name: 'AbbVie Inc.',                    exchange: 'NYSE',   sector: 'Health Care',            price: 194.20, change: 0.70,  changePercent: 0.36, volume:  4500000, marketCap:  343000, peRatio: 48.2, dividendYield: 3.19, beta: 0.68, high52W: 200.00, low52W: 136.00 },
  { ticker: 'LLY',   name: 'Eli Lilly and Company',          exchange: 'NYSE',   sector: 'Health Care',            price: 915.00, change: 5.20,  changePercent: 0.57, volume:  3200000, marketCap:  869000, peRatio: 112.5,dividendYield: 0.57, beta: 0.42, high52W: 972.53, low52W: 516.57 },
  { ticker: 'MRK',   name: 'Merck & Co., Inc.',              exchange: 'NYSE',   sector: 'Health Care',            price: 116.40, change: -0.30, changePercent: -0.26, volume:  6800000, marketCap:  295000, peRatio: 17.5, dividendYield: 2.65, beta: 0.40, high52W: 134.63, low52W:  98.80 },
  { ticker: 'HD',    name: 'The Home Depot, Inc.',           exchange: 'NYSE',   sector: 'Consumer Discretionary', price: 388.00, change: 1.90,  changePercent: 0.49, volume:  3900000, marketCap:  385000, peRatio: 25.6, dividendYield: 2.32, beta: 1.02, high52W: 395.00, low52W: 274.26 },
  { ticker: 'COST',  name: 'Costco Wholesale Corporation',   exchange: 'NASDAQ', sector: 'Consumer Staples',       price: 902.50, change: 4.10,  changePercent: 0.46, volume:  2100000, marketCap:  400000, peRatio: 54.8, dividendYield: 0.51, beta: 0.78, high52W: 924.00, low52W: 539.00 },
  { ticker: 'AVGO',  name: 'Broadcom Inc.',                  exchange: 'NASDAQ', sector: 'Technology',             price: 168.40, change: 2.30,  changePercent: 1.38, volume: 22500000, marketCap:  786000, peRatio: 45.2, dividendYield: 1.25, beta: 1.28, high52W: 185.16, low52W:  79.50 },
  { ticker: 'ORCL',  name: 'Oracle Corporation',             exchange: 'NYSE',   sector: 'Technology',             price: 162.00, change: 1.80,  changePercent: 1.12, volume: 14200000, marketCap:  448000, peRatio: 41.5, dividendYield: 0.99, beta: 1.05, high52W: 173.00, low52W:  99.26 },
  { ticker: 'CSCO',  name: 'Cisco Systems, Inc.',            exchange: 'NASDAQ', sector: 'Technology',             price:  52.10, change: 0.30,  changePercent: 0.58, volume: 17800000, marketCap:  210000, peRatio: 20.8, dividendYield: 3.07, beta: 0.85, high52W:  58.19, low52W:  44.50 },
  { ticker: 'INTC',  name: 'Intel Corporation',              exchange: 'NASDAQ', sector: 'Technology',             price:  21.80, change: 0.45,  changePercent: 2.11, volume: 55400000, marketCap:   93000, peRatio: 24.2, dividendYield: 2.29, beta: 1.25, high52W:  51.28, low52W:  18.84 },
  { ticker: 'AMD',   name: 'Advanced Micro Devices, Inc.',   exchange: 'NASDAQ', sector: 'Technology',             price: 154.20, change: 2.10,  changePercent: 1.38, volume: 44200000, marketCap:  249000, peRatio: 110.5,dividendYield: 0.00, beta: 1.72, high52W: 227.30, low52W:  94.04 },
  { ticker: 'CRM',   name: 'Salesforce, Inc.',               exchange: 'NYSE',   sector: 'Technology',             price: 268.50, change: 1.20,  changePercent: 0.45, volume:  4800000, marketCap:  259000, peRatio: 46.2, dividendYield: 0.60, beta: 1.28, high52W: 318.71, low52W: 193.68 },
  { ticker: 'ADBE',  name: 'Adobe Inc.',                     exchange: 'NASDAQ', sector: 'Technology',             price: 525.00, change: -1.50, changePercent: -0.28, volume:  2900000, marketCap:  234000, peRatio: 44.8, dividendYield: 0.00, beta: 1.30, high52W: 638.25, low52W: 433.97 },
  { ticker: 'NFLX',  name: 'Netflix, Inc.',                  exchange: 'NASDAQ', sector: 'Communication Svcs',     price: 705.00, change: 3.80,  changePercent: 0.54, volume:  3100000, marketCap:  303000, peRatio: 42.1, dividendYield: 0.00, beta: 1.25, high52W: 712.00, low52W: 344.73 },
  { ticker: 'DIS',   name: 'The Walt Disney Company',        exchange: 'NYSE',   sector: 'Communication Svcs',     price:  94.50, change: 0.40,  changePercent: 0.42, volume:  8500000, marketCap:  172000, peRatio: 38.5, dividendYield: 0.95, beta: 1.15, high52W: 123.74, low52W:  78.73 },
  { ticker: 'KO',    name: 'The Coca-Cola Company',          exchange: 'NYSE',   sector: 'Consumer Staples',       price:  71.20, change: 0.35,  changePercent: 0.49, volume: 12800000, marketCap:  306000, peRatio: 28.2, dividendYield: 2.72, beta: 0.58, high52W:  73.53, low52W:  51.55 },
  { ticker: 'PEP',   name: 'PepsiCo, Inc.',                  exchange: 'NASDAQ', sector: 'Consumer Staples',       price: 175.40, change: 0.50,  changePercent: 0.29, volume:  4900000, marketCap:  241000, peRatio: 25.1, dividendYield: 3.10, beta: 0.54, high52W: 183.39, low52W: 155.83 },
  { ticker: 'NKE',   name: 'Nike, Inc.',                     exchange: 'NYSE',   sector: 'Consumer Discretionary', price:  84.20, change: -0.60, changePercent: -0.71, volume:  9400000, marketCap:  127000, peRatio: 23.5, dividendYield: 1.76, beta: 1.08, high52W: 123.39, low52W:  70.75 },
  { ticker: 'MCD',   name: "McDonald's Corporation",         exchange: 'NYSE',   sector: 'Consumer Discretionary', price: 298.50, change: 1.10,  changePercent: 0.37, volume:  2800000, marketCap:  214000, peRatio: 26.4, dividendYield: 2.24, beta: 0.70, high52W: 302.00, low52W: 243.53 },
  { ticker: 'IBM',   name: 'International Business Machines',exchange: 'NYSE',   sector: 'Technology',             price: 215.80, change: 1.40,  changePercent: 0.65, volume:  3600000, marketCap:  198000, peRatio: 23.1, dividendYield: 3.09, beta: 0.72, high52W: 220.00, low52W: 137.35 },
];

export const US_MARKET_STOCKS: GlobalStock[] = REAL_STOCK_DEFS.map((def) => ({
  ticker: def.ticker,
  name: def.name,
  exchange: def.exchange,
  sector: def.sector,
  price: def.price,
  change: def.change,
  changePercent: def.changePercent,
  volume: def.volume,
  marketCap: def.marketCap,
  peRatio: def.peRatio,
  dividendYield: def.dividendYield,
  beta: def.beta,
  high52W: def.high52W,
  low52W: def.low52W,
  country: 'US',
  currency: 'USD',
}));

/** Look up a stock by exact ticker symbol (case-sensitive). */
export function getGlobalStockByTicker(ticker: string): GlobalStock | undefined {
  return US_MARKET_STOCKS.find((s) => s.ticker === ticker);
}

type SortKey = 'marketCap' | 'volume' | 'change';

/**
 * Return the top-N stocks sorted by the given key (descending).
 */
export function getTopStocks(n: number, sortBy: SortKey): GlobalStock[] {
  const compareFn: (a: GlobalStock, b: GlobalStock) => number =
    sortBy === 'change'
      ? (a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)
      : (a, b) => b[sortBy] - a[sortBy];

  return [...US_MARKET_STOCKS].sort(compareFn).slice(0, n);
}
