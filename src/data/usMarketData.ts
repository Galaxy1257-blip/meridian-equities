/**
 * usMarketData.ts
 * Algorithmic seeder that produces a 870+ item GlobalStock array composed of:
 *   - 50 real well-known US equities with approximate live-ish data
 *   - 820 deterministically generated synthetic mid/small-cap stocks
 *
 * All prices are in USD; GSE stocks (added via the GSE module) use GHS.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Deterministic pseudo-random helpers (LCG-based, seed-driven)
// ---------------------------------------------------------------------------

function lcgNext(seed: number): number {
  // Parameters from Numerical Recipes
  return (seed * 1664525 + 1013904223) & 0xffffffff;
}

/** Returns a float in [0, 1) for a given integer seed. */
function pseudoRandom(seed: number): number {
  const s = lcgNext(seed);
  return (s >>> 0) / 4294967296;
}

/** Returns a float in [min, max] derived from a seed. */
function rangeFromSeed(seed: number, min: number, max: number): number {
  return min + pseudoRandom(seed) * (max - min);
}

/** Round to at most `dp` decimal places. */
function round(v: number, dp = 2): number {
  const factor = Math.pow(10, dp);
  return Math.round(v * factor) / factor;
}

// ---------------------------------------------------------------------------
// Core seeder function
// ---------------------------------------------------------------------------

/**
 * Generates a fully-populated GlobalStock from deterministic inputs.
 * The `seed` integer drives all randomised fields so the output is
 * reproducible across runs.
 */
export function seedStock(
  seed: number,
  baseTicker: string,
  basePrice: number,
  exchange: 'NYSE' | 'NASDAQ',
  sector: string,
  name: string,
): GlobalStock {
  const s0 = lcgNext(seed);
  const s1 = lcgNext(s0);
  const s2 = lcgNext(s1);
  const s3 = lcgNext(s2);
  const s4 = lcgNext(s3);
  const s5 = lcgNext(s4);
  const s6 = lcgNext(s5);
  const s7 = lcgNext(s6);

  // Price jitter ±5%
  const jitter = 1 + (pseudoRandom(s0) - 0.5) * 0.1;
  const price = round(basePrice * jitter, 2);

  // Daily change: ±3%
  const changePct = round((pseudoRandom(s1) - 0.5) * 6, 2);
  const change = round((price * changePct) / 100, 2);

  // 52-week range: low = price * (0.65–0.95), high = price * (1.05–1.45)
  const low52W = round(price * (0.65 + pseudoRandom(s2) * 0.3), 2);
  const high52W = round(price * (1.05 + pseudoRandom(s3) * 0.4), 2);

  // Volume: 100k – 50M shares
  const volume = Math.round(rangeFromSeed(s4, 100000, 50000000));

  // Market cap: derived from price and a synthetic share count (10M–10B shares)
  const shares = rangeFromSeed(s5, 10e6, 10e9);
  const marketCap = round((price * shares) / 1e6, 0); // millions

  const peRatio = round(rangeFromSeed(s6, 8, 35), 1);
  const dividendYield = round(pseudoRandom(s7) * 5, 2); // 0–5 %
  const beta = round(rangeFromSeed(lcgNext(s7), 0.5, 2.0), 2);

  return {
    ticker: baseTicker,
    name,
    exchange,
    sector,
    price,
    change,
    changePercent: changePct,
    volume,
    marketCap,
    peRatio,
    dividendYield,
    beta,
    high52W,
    low52W,
    country: 'US',
    currency: 'USD',
  };
}

// ---------------------------------------------------------------------------
// 50 real well-known US stocks (approximate data, mid-2024 levels)
// ---------------------------------------------------------------------------

interface RealStockDef {
  ticker: string;
  name: string;
  exchange: 'NYSE' | 'NASDAQ';
  sector: string;
  price: number;
  marketCap: number; // millions USD (approximate)
  peRatio: number;
  dividendYield: number;
  beta: number;
}

const REAL_STOCK_DEFS: RealStockDef[] = [
  { ticker: 'AAPL',  name: 'Apple Inc.',                     exchange: 'NASDAQ', sector: 'Technology',          price: 189.84, marketCap: 2910000, peRatio: 30.2, dividendYield: 0.51, beta: 1.24 },
  { ticker: 'MSFT',  name: 'Microsoft Corporation',          exchange: 'NASDAQ', sector: 'Technology',          price: 415.32, marketCap: 3085000, peRatio: 36.8, dividendYield: 0.71, beta: 0.90 },
  { ticker: 'GOOGL', name: 'Alphabet Inc. Class A',          exchange: 'NASDAQ', sector: 'Communication Svcs',  price: 175.10, marketCap: 2185000, peRatio: 27.1, dividendYield: 0.00, beta: 1.05 },
  { ticker: 'AMZN',  name: 'Amazon.com Inc.',                exchange: 'NASDAQ', sector: 'Consumer Discretionary',price: 185.07,marketCap: 1945000, peRatio: 55.4, dividendYield: 0.00, beta: 1.15 },
  { ticker: 'META',  name: 'Meta Platforms Inc.',            exchange: 'NASDAQ', sector: 'Communication Svcs',  price: 491.18, marketCap: 1258000, peRatio: 26.5, dividendYield: 0.40, beta: 1.25 },
  { ticker: 'NVDA',  name: 'NVIDIA Corporation',             exchange: 'NASDAQ', sector: 'Technology',          price: 875.39, marketCap: 2157000, peRatio: 68.3, dividendYield: 0.03, beta: 1.72 },
  { ticker: 'TSLA',  name: 'Tesla Inc.',                     exchange: 'NASDAQ', sector: 'Consumer Discretionary',price: 177.46,marketCap:  565000, peRatio: 47.2, dividendYield: 0.00, beta: 2.00 },
  { ticker: 'JPM',   name: 'JPMorgan Chase & Co.',           exchange: 'NYSE',   sector: 'Financials',          price: 197.45, marketCap:  569000, peRatio: 11.7, dividendYield: 2.23, beta: 1.08 },
  { ticker: 'BAC',   name: 'Bank of America Corporation',    exchange: 'NYSE',   sector: 'Financials',          price:  38.52, marketCap:  303000, peRatio: 13.3, dividendYield: 2.49, beta: 1.42 },
  { ticker: 'V',     name: 'Visa Inc.',                      exchange: 'NYSE',   sector: 'Financials',          price: 275.96, marketCap:  570000, peRatio: 31.2, dividendYield: 0.77, beta: 0.94 },
  { ticker: 'MA',    name: 'Mastercard Incorporated',        exchange: 'NYSE',   sector: 'Financials',          price: 455.32, marketCap:  426000, peRatio: 36.4, dividendYield: 0.57, beta: 1.00 },
  { ticker: 'WMT',   name: 'Walmart Inc.',                   exchange: 'NYSE',   sector: 'Consumer Staples',    price:  67.84, marketCap:  544000, peRatio: 28.6, dividendYield: 1.18, beta: 0.56 },
  { ticker: 'JNJ',   name: 'Johnson & Johnson',              exchange: 'NYSE',   sector: 'Health Care',         price: 152.73, marketCap:  367000, peRatio: 10.2, dividendYield: 3.31, beta: 0.56 },
  { ticker: 'PG',    name: 'Procter & Gamble Co.',           exchange: 'NYSE',   sector: 'Consumer Staples',    price: 162.10, marketCap:  382000, peRatio: 25.4, dividendYield: 2.35, beta: 0.53 },
  { ticker: 'UNH',   name: 'UnitedHealth Group Inc.',        exchange: 'NYSE',   sector: 'Health Care',         price: 487.82, marketCap:  452000, peRatio: 22.6, dividendYield: 1.47, beta: 0.59 },
  { ticker: 'XOM',   name: 'Exxon Mobil Corporation',        exchange: 'NYSE',   sector: 'Energy',              price: 117.97, marketCap:  471000, peRatio: 14.3, dividendYield: 3.13, beta: 1.09 },
  { ticker: 'CVX',   name: 'Chevron Corporation',            exchange: 'NYSE',   sector: 'Energy',              price: 154.49, marketCap:  289000, peRatio: 13.8, dividendYield: 4.00, beta: 1.03 },
  { ticker: 'ABBV',  name: 'AbbVie Inc.',                    exchange: 'NYSE',   sector: 'Health Care',         price: 171.60, marketCap:  303000, peRatio: 54.3, dividendYield: 3.41, beta: 0.70 },
  { ticker: 'LLY',   name: 'Eli Lilly and Company',          exchange: 'NYSE',   sector: 'Health Care',         price: 795.13, marketCap:  757000, peRatio: 104.2,dividendYield: 0.68, beta: 0.40 },
  { ticker: 'MRK',   name: 'Merck & Co., Inc.',              exchange: 'NYSE',   sector: 'Health Care',         price: 126.50, marketCap:  321000, peRatio: 19.4, dividendYield: 2.40, beta: 0.38 },
  { ticker: 'HD',    name: 'The Home Depot, Inc.',           exchange: 'NYSE',   sector: 'Consumer Discretionary',price: 341.92,marketCap:  341000, peRatio: 22.9, dividendYield: 2.46, beta: 1.04 },
  { ticker: 'COST',  name: 'Costco Wholesale Corporation',   exchange: 'NASDAQ', sector: 'Consumer Staples',    price: 793.14, marketCap:  350000, peRatio: 51.4, dividendYield: 0.54, beta: 0.79 },
  { ticker: 'AVGO',  name: 'Broadcom Inc.',                  exchange: 'NASDAQ', sector: 'Technology',          price: 165.32, marketCap:  758000, peRatio: 33.4, dividendYield: 1.20, beta: 1.10 },
  { ticker: 'ORCL',  name: 'Oracle Corporation',             exchange: 'NYSE',   sector: 'Technology',          price: 128.18, marketCap:  355000, peRatio: 30.6, dividendYield: 1.06, beta: 1.02 },
  { ticker: 'CSCO',  name: 'Cisco Systems, Inc.',            exchange: 'NASDAQ', sector: 'Technology',          price:  48.97, marketCap:  199000, peRatio: 15.7, dividendYield: 3.16, beta: 0.87 },
  { ticker: 'INTC',  name: 'Intel Corporation',              exchange: 'NASDAQ', sector: 'Technology',          price:  31.29, marketCap:  133000, peRatio: 32.5, dividendYield: 1.28, beta: 1.05 },
  { ticker: 'AMD',   name: 'Advanced Micro Devices, Inc.',   exchange: 'NASDAQ', sector: 'Technology',          price: 167.42, marketCap:  270000, peRatio: 295.5,dividendYield: 0.00, beta: 1.75 },
  { ticker: 'CRM',   name: 'Salesforce, Inc.',               exchange: 'NYSE',   sector: 'Technology',          price: 274.00, marketCap:  267000, peRatio: 48.4, dividendYield: 0.58, beta: 1.33 },
  { ticker: 'ADBE',  name: 'Adobe Inc.',                     exchange: 'NASDAQ', sector: 'Technology',          price: 470.94, marketCap:  211000, peRatio: 43.7, dividendYield: 0.00, beta: 1.29 },
  { ticker: 'NFLX',  name: 'Netflix, Inc.',                  exchange: 'NASDAQ', sector: 'Communication Svcs',  price: 638.00, marketCap:  277000, peRatio: 45.7, dividendYield: 0.00, beta: 1.38 },
  { ticker: 'DIS',   name: 'The Walt Disney Company',        exchange: 'NYSE',   sector: 'Communication Svcs',  price:  96.22, marketCap:  175000, peRatio: 37.9, dividendYield: 0.00, beta: 1.16 },
  { ticker: 'CMCSA', name: 'Comcast Corporation',            exchange: 'NASDAQ', sector: 'Communication Svcs',  price:  40.29, marketCap:  161000, peRatio: 10.8, dividendYield: 2.92, beta: 0.98 },
  { ticker: 'PFE',   name: 'Pfizer Inc.',                    exchange: 'NYSE',   sector: 'Health Care',         price:  28.73, marketCap:  162000, peRatio:  8.8, dividendYield: 6.27, beta: 0.60 },
  { ticker: 'TMO',   name: 'Thermo Fisher Scientific Inc.',  exchange: 'NYSE',   sector: 'Health Care',         price: 559.15, marketCap:  215000, peRatio: 35.4, dividendYield: 0.26, beta: 0.73 },
  { ticker: 'ABT',   name: 'Abbott Laboratories',            exchange: 'NYSE',   sector: 'Health Care',         price: 103.83, marketCap:  180000, peRatio: 25.7, dividendYield: 1.93, beta: 0.70 },
  { ticker: 'DHR',   name: 'Danaher Corporation',            exchange: 'NYSE',   sector: 'Health Care',         price: 243.12, marketCap:  176000, peRatio: 45.2, dividendYield: 0.41, beta: 0.85 },
  { ticker: 'NKE',   name: 'Nike, Inc.',                     exchange: 'NYSE',   sector: 'Consumer Discretionary',price:  93.96,marketCap:  143000, peRatio: 26.0, dividendYield: 1.62, beta: 1.07 },
  { ticker: 'SBUX',  name: 'Starbucks Corporation',          exchange: 'NASDAQ', sector: 'Consumer Discretionary',price:  79.01,marketCap:   89000, peRatio: 20.2, dividendYield: 2.85, beta: 0.98 },
  { ticker: 'MCD',   name: "McDonald's Corporation",         exchange: 'NYSE',   sector: 'Consumer Discretionary',price: 265.31,marketCap:  193000, peRatio: 22.7, dividendYield: 2.27, beta: 0.71 },
  { ticker: 'KO',    name: 'The Coca-Cola Company',          exchange: 'NYSE',   sector: 'Consumer Staples',    price:  62.19, marketCap:  268000, peRatio: 25.2, dividendYield: 3.09, beta: 0.57 },
  { ticker: 'PEP',   name: 'PepsiCo, Inc.',                  exchange: 'NASDAQ', sector: 'Consumer Staples',    price: 171.41, marketCap:  236000, peRatio: 22.0, dividendYield: 3.16, beta: 0.55 },
  { ticker: 'LOW',   name: "Lowe's Companies, Inc.",         exchange: 'NYSE',   sector: 'Consumer Discretionary',price: 225.77,marketCap:  130000, peRatio: 20.5, dividendYield: 1.96, beta: 1.12 },
  { ticker: 'TGT',   name: 'Target Corporation',             exchange: 'NYSE',   sector: 'Consumer Discretionary',price: 149.79,marketCap:   69000, peRatio: 16.4, dividendYield: 2.95, beta: 1.05 },
  { ticker: 'GE',    name: 'GE Aerospace',                   exchange: 'NYSE',   sector: 'Industrials',         price: 160.00, marketCap:  174000, peRatio: 31.8, dividendYield: 0.21, beta: 1.18 },
  { ticker: 'CAT',   name: 'Caterpillar Inc.',               exchange: 'NYSE',   sector: 'Industrials',         price: 346.43, marketCap:  168000, peRatio: 16.4, dividendYield: 1.50, beta: 1.11 },
  { ticker: 'BA',    name: 'The Boeing Company',             exchange: 'NYSE',   sector: 'Industrials',         price: 182.08, marketCap:  108000, peRatio:  0.0, dividendYield: 0.00, beta: 1.44 },
  { ticker: 'RTX',   name: 'RTX Corporation',                exchange: 'NYSE',   sector: 'Industrials',         price: 105.54, marketCap:  140000, peRatio: 39.3, dividendYield: 2.27, beta: 0.86 },
  { ticker: 'HON',   name: 'Honeywell International Inc.',   exchange: 'NASDAQ', sector: 'Industrials',         price: 202.46, marketCap:  135000, peRatio: 22.5, dividendYield: 2.16, beta: 1.03 },
  { ticker: 'MMM',   name: '3M Company',                     exchange: 'NYSE',   sector: 'Industrials',         price:  97.78, marketCap:   55000, peRatio: 11.6, dividendYield: 5.73, beta: 0.93 },
  { ticker: 'IBM',   name: 'International Business Machines',exchange: 'NYSE',   sector: 'Technology',          price: 188.57, marketCap:  171000, peRatio: 22.2, dividendYield: 3.31, beta: 0.71 },
];

// ---------------------------------------------------------------------------
// Build real-stock GlobalStock entries with deterministic daily jitter
// ---------------------------------------------------------------------------

function buildRealStock(def: RealStockDef, idx: number): GlobalStock {
  const seed = idx * 97 + 13; // deterministic but varied
  const s0 = lcgNext(seed);
  const s1 = lcgNext(s0);
  const s2 = lcgNext(s1);
  const s3 = lcgNext(s2);

  // Small daily jitter ±2% so totals feel realistic but constant
  const jitter = 1 + (pseudoRandom(s0) - 0.5) * 0.04;
  const price = round(def.price * jitter, 2);
  const changePct = round((pseudoRandom(s1) - 0.5) * 4, 2);
  const change = round((price * changePct) / 100, 2);
  const low52W = round(price * (0.7 + pseudoRandom(s2) * 0.2), 2);
  const high52W = round(price * (1.1 + pseudoRandom(s3) * 0.3), 2);
  const volume = Math.round(rangeFromSeed(lcgNext(s3), 1e6, 80e6));

  return {
    ticker: def.ticker,
    name: def.name,
    exchange: def.exchange,
    sector: def.sector,
    price,
    change,
    changePercent: changePct,
    volume,
    marketCap: def.marketCap,
    peRatio: def.peRatio,
    dividendYield: def.dividendYield,
    beta: def.beta,
    high52W,
    low52W,
    country: 'US',
    currency: 'USD',
  };
}

const REAL_STOCKS: GlobalStock[] = REAL_STOCK_DEFS.map((d, i) =>
  buildRealStock(d, i),
);

// ---------------------------------------------------------------------------
// Synthetic stock generation – 820 stocks
// ---------------------------------------------------------------------------

const SECTORS = [
  'Technology',
  'Financials',
  'Health Care',
  'Consumer Discretionary',
  'Consumer Staples',
  'Industrials',
  'Energy',
  'Materials',
  'Real Estate',
  'Utilities',
  'Communication Svcs',
];

const EXCHANGES: Array<'NYSE' | 'NASDAQ'> = ['NYSE', 'NASDAQ'];

const SYNTHETIC_NAMES_BY_SECTOR: Record<string, string[]> = {
  'Technology':             ['Systems', 'Technologies', 'Solutions', 'Dynamics', 'Networks', 'Platforms', 'Digital', 'Cyber', 'Data', 'Cloud'],
  'Financials':             ['Financial', 'Capital', 'Bancorp', 'Holdings', 'Investments', 'Advisors', 'Asset Mgmt', 'Credit', 'Insurance', 'Trust'],
  'Health Care':            ['Health', 'BioSciences', 'Therapeutics', 'Medical', 'Pharma', 'Genomics', 'MedTech', 'Diagnostics', 'Biotech', 'Life Sciences'],
  'Consumer Discretionary': ['Retail', 'Brands', 'Lifestyle', 'Luxury', 'Fashion', 'Travel', 'Leisure', 'Motors', 'Autos', 'Entertainment'],
  'Consumer Staples':       ['Foods', 'Beverages', 'Household', 'Personal Care', 'Grocery', 'Nutrition', 'Organics', 'Farms', 'Packaged Goods', 'Essentials'],
  'Industrials':            ['Industries', 'Manufacturing', 'Aerospace', 'Engineering', 'Construction', 'Transport', 'Logistics', 'Infrastructure', 'Automation', 'Machinery'],
  'Energy':                 ['Energy', 'Petroleum', 'Resources', 'Oil & Gas', 'Renewables', 'Power', 'Fuels', 'Mining', 'Drilling', 'Pipeline'],
  'Materials':              ['Materials', 'Chemicals', 'Metals', 'Mining', 'Plastics', 'Specialty Chem', 'Polymers', 'Composites', 'Paper', 'Packaging'],
  'Real Estate':            ['REIT', 'Properties', 'Realty', 'Real Estate', 'Developments', 'Estates', 'Commercial Props', 'Residential REIT', 'Towers', 'Partners'],
  'Utilities':              ['Utilities', 'Electric', 'Gas & Electric', 'Water', 'Power Grid', 'Renewables Util', 'Transmission', 'Distribution', 'Energy Svcs', 'Grid'],
  'Communication Svcs':     ['Communications', 'Media', 'Broadcasting', 'Telecom', 'Networks', 'Streaming', 'Publishing', 'Advertising', 'Social', 'Wireless'],
};

function syntheticName(ticker: string, sector: string, seed: number): string {
  const words = SYNTHETIC_NAMES_BY_SECTOR[sector] ?? ['Corp'];
  const wordIdx = Math.abs(seed) % words.length;
  const prefix = ticker.replace(/\d+$/, '');
  return `${prefix} ${words[wordIdx]} Corp.`;
}

/** Base price bands roughly matching the sector's real-world distribution */
function sectorBasePrice(sector: string, seed: number): number {
  const bands: Record<string, [number, number]> = {
    'Technology':             [10,  500],
    'Financials':             [15,  200],
    'Health Care':            [20,  400],
    'Consumer Discretionary': [10,  300],
    'Consumer Staples':       [20,  200],
    'Industrials':            [20,  250],
    'Energy':                 [10,  150],
    'Materials':              [10,  120],
    'Real Estate':            [5,   80],
    'Utilities':              [20,  90],
    'Communication Svcs':     [10,  250],
  };
  const [lo, hi] = bands[sector] ?? [5, 200];
  return round(rangeFromSeed(seed, lo, hi), 2);
}

function buildSyntheticStocks(): GlobalStock[] {
  const result: GlobalStock[] = [];
  for (let i = 1; i <= 820; i++) {
    const ticker = `SMID${String(i).padStart(3, '0')}`;
    const sectorIdx = (i - 1) % SECTORS.length;
    const sector = SECTORS[sectorIdx];
    const exchangeIdx = Math.floor((i - 1) / SECTORS.length) % 2;
    const exchange = EXCHANGES[exchangeIdx];
    const seed = i * 31337 + sectorIdx * 1009;
    const basePrice = sectorBasePrice(sector, seed);
    const name = syntheticName(ticker, sector, seed);
    result.push(seedStock(seed, ticker, basePrice, exchange, sector, name));
  }
  return result;
}

const SYNTHETIC_STOCKS: GlobalStock[] = buildSyntheticStocks();

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export const US_MARKET_STOCKS: GlobalStock[] = [
  ...REAL_STOCKS,
  ...SYNTHETIC_STOCKS,
];

// ---------------------------------------------------------------------------
// Helper exports
// ---------------------------------------------------------------------------

/** Look up a stock by exact ticker symbol (case-sensitive). */
export function getGlobalStockByTicker(ticker: string): GlobalStock | undefined {
  return US_MARKET_STOCKS.find((s) => s.ticker === ticker);
}

type SortKey = 'marketCap' | 'volume' | 'change';

/**
 * Return the top-N stocks sorted by the given key (descending).
 * `change` sorts by absolute percentage change so both gainers and losers
 * with large moves appear at the top.
 */
export function getTopStocks(n: number, sortBy: SortKey): GlobalStock[] {
  const compareFn: (a: GlobalStock, b: GlobalStock) => number =
    sortBy === 'change'
      ? (a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)
      : (a, b) => b[sortBy] - a[sortBy];

  return [...US_MARKET_STOCKS].sort(compareFn).slice(0, n);
}
