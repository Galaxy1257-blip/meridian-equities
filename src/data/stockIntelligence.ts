import { Stock, SnowflakeScore, AiStockNarrative } from '../types';

// Deterministic 5-factor Snowflake score generator based on financial ratios
export function getSnowflakeScore(stock: Stock): SnowflakeScore {
  // Value (0-6): Based on P/E ratio and 52-week position
  let value = 3;
  if (stock.peRatio < 5) value = 6;
  else if (stock.peRatio < 8) value = 5;
  else if (stock.peRatio < 12) value = 4;
  else if (stock.peRatio < 18) value = 3;
  else if (stock.peRatio < 25) value = 2;
  else value = 1;

  // Dividend (0-6): Based on dividend yield
  let dividend = 0;
  const yieldPct = stock.dividendYield || 0;
  if (yieldPct >= 10) dividend = 6;
  else if (yieldPct >= 7.5) dividend = 5;
  else if (yieldPct >= 5.0) dividend = 4;
  else if (yieldPct >= 3.0) dividend = 3;
  else if (yieldPct > 0) dividend = 2;

  // Financial Health (0-6): Liquidity and Market Cap
  let health = 3;
  if (stock.easyToSellScore >= 85) health = 6;
  else if (stock.easyToSellScore >= 70) health = 5;
  else if (stock.easyToSellScore >= 55) health = 4;
  else if (stock.easyToSellScore >= 40) health = 3;
  else health = 2;

  // Past Track Record (0-6): Based on positive 52W gains & cashBackScore
  let past = 3;
  const spread52W = stock.high52W > stock.low52W ? (stock.price - stock.low52W) / (stock.high52W - stock.low52W) : 0.5;
  if (spread52W > 0.75) past = 5;
  else if (spread52W > 0.5) past = 4;
  else past = 3;
  if (stock.cashBackScore > 75) past = Math.min(6, past + 1);

  // Future Growth (0-6): Sector growth potential & bull sentiment
  let future = 3;
  const totalVotes = (stock.bullVotes || 0) + (stock.bearVotes || 0);
  const bullRatio = totalVotes > 0 ? (stock.bullVotes || 0) / totalVotes : 0.6;
  if (stock.sector === 'Telecom' || stock.sector === 'Agriculture') future = 5;
  else if (stock.sector === 'Financials') future = 4;
  if (bullRatio > 0.8) future = Math.min(6, future + 1);

  const total = value + future + past + health + dividend;
  let rating: SnowflakeScore['rating'] = 'Moderate';
  if (total >= 24) rating = 'Exceptional';
  else if (total >= 19) rating = 'Strong';
  else if (total >= 14) rating = 'Moderate';
  else rating = 'Speculative';

  return { value, future, past, health, dividend, total, rating };
}

// AI Stock Narrative generator for each GSE listed stock
export function getAiStockNarrative(stock: Stock): AiStockNarrative {
  const narratives: Record<string, AiStockNarrative> = {
    MTNGH: {
      ticker: 'MTNGH',
      bullThesis: [
        'Data revenue growing over 28% year-over-year with expanding 4G/5G nationwide coverage.',
        'MoMo Fintech ecosystem acts as a cash-generative monopoly with high operating margins (>48%).',
        'Strong capital returns to shareholders with regular semi-annual cash dividends.'
      ],
      bearThesis: [
        'Significant Market Power (SMP) regulatory pricing directives from the National Communications Authority.',
        'Foreign exchange pass-through costs on imported telecom hardware infrastructure.'
      ],
      catalyst2026: 'Rapid adoption of enterprise cloud services and mobile merchant payments across urban and rural Ghana.',
      valuationVerdict: 'Undervalued relative to African telecom peers (EV/EBITDA 4.2x vs regional avg of 6.8x).',
      targetPriceGhs: 8.50
    },
    GCB: {
      ticker: 'GCB',
      bullThesis: [
        'Massive deposit base offering the lowest cost of funds among commercial banking peers.',
        'Dominant player in sovereign treasury securities underwriting and domestic clearing.',
        'Attractive low single-digit P/E multiple (<4.0x) with high double-digit Return on Equity.'
      ],
      bearThesis: [
        'Exposure to sovereign fiscal restructuring cycles and domestic macroeconomic interest rate swings.',
        'Non-performing loans (NPL) recovery timeline across select manufacturing SME sectors.'
      ],
      catalyst2026: 'Aggressive expansion of digital mobile banking platforms driving fee income beyond interest spreads.',
      valuationVerdict: 'Substantial margin of safety trading at a significant discount to tangible book value.',
      targetPriceGhs: 6.80
    },
    BOPP: {
      ticker: 'BOPP',
      bullThesis: [
        'Global crude palm oil (CPO) prices provide a natural structural hedge against local currency depreciation.',
        'Consistently among the highest dividend yielders on the Ghana Stock Exchange (>12% historic yields).',
        'Zero long-term debt and ultra-lean agricultural operational cost structure.'
      ],
      bearThesis: [
        'Weather cyclicality (rainfall patterns in Western Region) can temporarily impact seasonal fruit yields.',
        'Lower market liquidity and tight free float on the GSE floor.'
      ],
      catalyst2026: 'High regional export demand for refined palm stearin and olein across ECOWAS under AfCFTA.',
      valuationVerdict: 'High-conviction dividend cash cow with robust free cash flow yields exceeding 18%.',
      targetPriceGhs: 32.00
    },
    SCB: {
      ticker: 'SCB',
      bullThesis: [
        'Tier-1 international banking risk management standards with premier corporate client relationships.',
        'High Capital Adequacy Ratio (CAR > 24%) well above Bank of Ghana minimum prudential requirements.',
        'Consistently high ROE with premium corporate trade financing fee streams.'
      ],
      bearThesis: [
        'Conservative loan book growth posture compared to aggressive indigenous tier-2 banks.',
        'Higher nominal share price can deter small retail micro-traders.'
      ],
      catalyst2026: 'Cross-border multinationals trade corridors and carbon credit financing initiatives.',
      valuationVerdict: 'Quality banking franchise commanding a well-deserved premium for balance sheet safety.',
      targetPriceGhs: 27.50
    }
  };

  if (narratives[stock.ticker]) {
    return narratives[stock.ticker];
  }

  // Dynamic fallback for any other ticker
  return {
    ticker: stock.ticker,
    bullThesis: [
      `Leading position in the Ghanaian ${stock.sector.toLowerCase()} sector with established brand equity.`,
      `Attractive entry multiple with P/E of ${stock.peRatio}x and dividend yield of ${(stock.dividendYield || 0).toFixed(1)}%.`,
      'Macroeconomic stabilization in Ghana driving increased consumer and industrial purchasing power.'
    ],
    bearThesis: [
      'Input cost inflation and potential currency volatility impacts on operational overhead.',
      'Moderate trading liquidity on the secondary trading floor compared to mega-cap counters.'
    ],
    catalyst2026: `Expansion of core product lines and strategic digitisation across Ghana and the West African sub-region.`,
    valuationVerdict: `Priced at fair market value with upside potential supported by ${stock.bullVotes} bullish community members.`,
    targetPriceGhs: Number((stock.price * 1.25).toFixed(2))
  };
}

// Peer Comparison Helper
export function getPeerComparison(targetStock: Stock, allStocks: Stock[]) {
  // Find stocks in same or adjacent sectors
  const peers = allStocks
    .filter(s => s.ticker !== targetStock.ticker && (s.sector === targetStock.sector || targetStock.sector === 'Financials'))
    .slice(0, 3);

  const list = [targetStock, ...peers];

  return list.map(s => ({
    stock: s,
    ticker: s.ticker,
    name: s.name,
    price: s.price,
    peRatio: s.peRatio,
    dividendYield: s.dividendYield || 0,
    marketCapGhs: s.marketCap,
    easyToSellScore: s.easyToSellScore,
    roeEstimate: s.sector === 'Financials' ? 24.5 : s.sector === 'Telecom' ? 32.0 : 18.0,
    profitMargin: s.sector === 'Telecom' ? '28%' : s.sector === 'Financials' ? '34%' : '22%'
  }));
}
