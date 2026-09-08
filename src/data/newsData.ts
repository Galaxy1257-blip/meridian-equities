import { GSEMarketNews } from '../types';

export const INITIAL_GSE_NEWS: GSEMarketNews[] = [
  // 1. UPCOMING IPO - Atlantic Lithium Ghana
  {
    id: 'news-ipo-atlantic-lithium-2026',
    title: 'Upcoming IPO: Atlantic Lithium Ghana Limited Receives SEC Approval for GSE Main Board Listing',
    category: 'IPO',
    timestamp: 'Today at 08:30 GMT',
    date: '2026-08-23',
    relatedTickers: ['ALLGH'],
    summary: 'Atlantic Lithium Ghana is slated to launch its Initial Public Offering (IPO) seeking to raise GH₵ 350M to fund Ewoyaa lithium processing facilities, offering retail Ghanaians direct equity participation.',
    content: [
      'The Securities and Exchange Commission (SEC) and the Council of the Ghana Stock Exchange have approved the admission and public listing of Atlantic Lithium Ghana Limited on the Main GSE Board.',
      'The company plans to float 75 million ordinary shares at an offer price of GH₵ 4.50 per share. The proceeds will accelerate the commercial construction of the Ewoyaa Lithium project in Mfantseman, Central Region.',
      'Retail investors can participate via authorized GSE stockbrokers, Mobile Money (MTN MoMo, Telecel Cash, AT Money), and accredited online depository portals. Sponsoring brokers IC Securities and Databank will manage book-building.',
      'Under GSE local content rules, at least 25% of the total issued shares will be ring-fenced for Ghanaian retail and institutional pension funds, with a minimum subscription lot size of 100 shares.'
    ],
    keyHighlights: [
      'Target capital raise: GH₵ 350 Million for green energy mineral processing.',
      'Offer Price: GH₵ 4.50 per share (Minimum entry: 100 shares / GH₵ 450).',
      'Subscription window opens September 1, 2026 and closes September 25, 2026.',
      'MoMo retail integration allows direct smartphone investment with zero stamp duty fees on application.'
    ],
    source: 'GSE Official Circular & SEC Ghana Bulletin',
    sourceId: 'gse-official',
    sourceUrl: 'https://gse.com.gh/bulletins/2026/atlantic-lithium-listing',
    isBreaking: true,
    isImportant: true,
    readTimeMinutes: 3,
    pdfFileName: 'Atlantic_Lithium_GSE_Prospectus_Summary.pdf',
    metrics: [
      { label: 'Offer Price', value: 'GH₵ 4.50', positive: true },
      { label: 'Target Raise', value: 'GH₵ 350M', positive: true },
      { label: 'Min Investment', value: 'GH₵ 450 (100 sh)' }
    ],
    ipoDetails: {
      companyName: 'Atlantic Lithium Ghana Limited',
      proposedTicker: 'ALLGH',
      offerPrice: 4.50,
      targetRaise: 'GH₵ 350 Million',
      sharesOffered: '75,000,000 Ordinary Shares',
      subscriptionOpen: 'September 1, 2026',
      subscriptionClose: 'September 25, 2026',
      listingDate: 'October 12, 2026',
      minSubscription: '100 shares (GH₵ 450.00)',
      leadBroker: 'IC Securities (Ghana) & Databank Brokerage Ltd',
      status: 'Upcoming',
      sector: 'Mining & Green Energy Resources',
      prospectusSummary: 'Listing to finance Africa-first spodumene concentrate refinery and downstream mineral processing in the Central Region of Ghana.',
      marketBoard: 'Main GSE Board'
    }
  },

  // 2. UPCOMING IPO / GAX - Enterprise Life FinTech SME Spinoff
  {
    id: 'news-ipo-vanguard-fintech-2026',
    title: 'Ghana Alternative Market (GAX): Enterprise Micro-Insurance FinTech IPO Announced for Q4',
    category: 'IPO',
    timestamp: 'Yesterday',
    date: '2026-08-22',
    relatedTickers: ['EGL'],
    summary: 'Enterprise Group subsidiary prepares GAX public offering targeting GH₵ 85 Million to expand AI-driven micro-insurance across West Africa.',
    content: [
      'The Ghana Alternative Market (GAX) is set to welcome its newest technology listing as Enterprise Micro-Life FinTech prepares an Initial Public Offering.',
      'The company provides mobile-first insurance and pension micro-savings to over 1.8 million informal sector workers in Ghana. The IPO aims to raise GH₵ 85 Million to scale digital underwriting into Côte d\'Ivoire and Nigeria.',
      'The GAX listing provides relaxed capital requirements and lower listing fees to encourage fast-growing Ghanaian technology scale-ups to access patient equity capital.'
    ],
    keyHighlights: [
      'Target raise of GH₵ 85M at an indicative price range of GH₵ 1.20 - GH₵ 1.50 per share.',
      'GAX listing date anticipated for late October 2026.',
      'Special retail mobile app subscription planned via Stanbic Bank & CalBank brokers.'
    ],
    source: 'Ghana Alternative Market (GAX) Directorate',
    sourceId: 'gse-official',
    sourceUrl: 'https://gse.com.gh/gax-listings/enterprise-fintech',
    readTimeMinutes: 2,
    pdfFileName: 'GAX_Enterprise_Fintech_Information_Memorandum.pdf',
    metrics: [
      { label: 'Indicative Price', value: 'GH₵ 1.35' },
      { label: 'Target Raise', value: 'GH₵ 85M' },
      { label: 'Listing Board', value: 'GAX' }
    ],
    ipoDetails: {
      companyName: 'Enterprise Digital Micro-Insurance Ltd',
      proposedTicker: 'EDMI',
      offerPrice: 1.35,
      targetRaise: 'GH₵ 85 Million',
      sharesOffered: '62,960,000 Ordinary Shares',
      subscriptionOpen: 'October 1, 2026',
      subscriptionClose: 'October 20, 2026',
      listingDate: 'November 4, 2026',
      minSubscription: '200 shares (GH₵ 270.00)',
      leadBroker: 'Stanbic Bank Ghana / SBG Securities',
      status: 'Upcoming',
      sector: 'Insurance & Financial Technology',
      prospectusSummary: 'Financing digital onboarding kiosks and cloud-based claim micro-settlement for market traders.',
      marketBoard: 'Ghana Alternative Market (GAX)'
    }
  },

  // 3. DIVIDEND DECLARATION - MTN Ghana
  {
    id: 'news-div-mtn-interim-2026',
    title: 'Dividend Notice: MTN Ghana Declares GH₵ 0.085 Interim Cash Dividend per Share for H1',
    category: 'DIVIDEND',
    timestamp: '2 days ago',
    date: '2026-08-21',
    relatedTickers: ['MTNGH'],
    summary: 'Scancom PLC (MTN Ghana) approves a robust interim dividend payment of 8.5 pesewas per share, with qualifying date set for September 12, 2026.',
    content: [
      'The Board of Directors of Scancom PLC (MTN Ghana) is pleased to announce an interim dividend of GH₵ 0.085 per share for the financial half-year ending June 30, 2026.',
      'All shareholders registered in the books of MTNGH at the close of business on Friday, September 12, 2026 (Qualifying Date) will be entitled to this interim dividend payout.',
      'The ex-dividend date has been set for Wednesday, September 10, 2026. In accordance with GSE trading rules, transactions executed on or after September 10 will not carry the right to receive the dividend.',
      'Payments will be credited electronically on September 28, 2026 directly into shareholders\' MTN Mobile Money wallets or designated bank accounts.'
    ],
    keyHighlights: [
      'Interim Dividend: GH₵ 0.085 per ordinary share.',
      'Ex-Dividend Date: September 10, 2026 (must buy before this date to qualify).',
      'Qualifying Date (Books Closure): September 12, 2026.',
      'Payment Date: September 28, 2026 via MoMo or direct bank deposit.',
      'Annualized yield equivalent exceeds 9.1% based on current trading price.'
    ],
    source: 'MTN Ghana Corporate Secretarial & GSE Floor Notice',
    sourceId: 'gse-official',
    sourceUrl: 'https://gse.com.gh/listed-companies/mtngh/dividends',
    isImportant: true,
    readTimeMinutes: 2,
    pdfFileName: 'MTNGH_Interim_Dividend_Declaration_Notice.pdf',
    metrics: [
      { label: 'Dividend / Share', value: 'GH₵ 0.085', positive: true },
      { label: 'Ex-Dividend Date', value: 'Sep 10, 2026' },
      { label: 'Payment Date', value: 'Sep 28, 2026' }
    ],
    dividendDetails: {
      ticker: 'MTNGH',
      amountPerShare: 0.085,
      qualifyingDate: 'September 12, 2026',
      paymentDate: 'September 28, 2026',
      dividendYield: 9.1,
      payoutMethod: 'Direct MTN MoMo & Bank Account EFT'
    }
  },

  // 4. DIVIDEND DECLARATION - Benso Oil Palm (BOPP)
  {
    id: 'news-div-bopp-record-2026',
    title: 'Dividend Update: Benso Oil Palm (BOPP) Announces Massive GH₵ 1.80 Special Dividend Following Export Boom',
    category: 'DIVIDEND',
    timestamp: '3 days ago',
    date: '2026-08-20',
    relatedTickers: ['BOPP'],
    summary: 'BOPP rewards shareholders with a record GH₵ 1.80 cash distribution as international palm oil prices and local processing volumes hit multi-year highs.',
    content: [
      'Benso Oil Palm Plantation (BOPP) has declared a bumper interim and special cash dividend totaling GH₵ 1.80 per share, delivering one of the highest dividend yields on the African continent.',
      'With revenue up 41% due to strong regional export demand across ECOWAS, the company’s net cash position surged, allowing the board to return capital to long-term shareholders.',
      'The books closure date is confirmed for October 3, 2026, with payment to be disbursed on October 24, 2026 via CalBank registrar services.'
    ],
    keyHighlights: [
      'Special Cash Dividend: GH₵ 1.80 per share.',
      'Implied trailing yield: 11.4% (Industry top-tier).',
      'Ex-Dividend date is October 1, 2026.'
    ],
    source: 'Databank Research / GSE Filing',
    readTimeMinutes: 2,
    pdfFileName: 'BOPP_Special_Dividend_Notice_2026.pdf',
    metrics: [
      { label: 'Dividend / Share', value: 'GH₵ 1.80', positive: true },
      { label: 'Trailing Yield', value: '11.4%', positive: true },
      { label: 'Payout Date', value: 'Oct 24, 2026' }
    ],
    dividendDetails: {
      ticker: 'BOPP',
      amountPerShare: 1.80,
      qualifyingDate: 'October 3, 2026',
      paymentDate: 'October 24, 2026',
      dividendYield: 11.4,
      payoutMethod: 'Bank Transfer & Central Securities Depository'
    }
  },

  // 5. BLOCK TRADES - Institutional Mega Cross in MTNGH & GCB
  {
    id: 'news-trade-block-mtn-gcb-2026',
    title: 'Block Trade Alert: GH₵ 10.7 Million Institutional Cross Trades Executed in MTNGH & GCB',
    category: 'TRADES',
    timestamp: 'Today at 11:15 GMT',
    date: '2026-08-23',
    relatedTickers: ['MTNGH', 'GCB'],
    summary: 'High-volume block trades crossed the GSE trading engine today as offshore frontier funds took down 3.2M shares of MTNGH and 450k shares of GCB Bank.',
    content: [
      'Trading activity on the Ghana Stock Exchange surged during the mid-morning session today with two massive off-market negotiated block crosses.',
      'In MTNGH, a single transaction of 3,200,000 shares crossed at GH₵ 2.54 per share, valued at GH₵ 8,128,000. Market sources confirm the buyer was an offshore African equity fund increasing overweight allocation.',
      'Simultaneously, 450,000 shares of GCB Bank PLC were matched at GH₵ 5.90 per share (GH₵ 2,655,000) between local Tier-2 pension fund managers.',
      'The block crosses lifted the daily GSE Composite Index turnover above GH₵ 15 Million, demonstrating strong institutional liquidity and foreign portfolio inflows.'
    ],
    keyHighlights: [
      'MTNGH Block: 3.2M shares crossed at GH₵ 2.54 (Total: GH₵ 8.13M) via Databank.',
      'GCB Block: 450,000 shares matched at GH₵ 5.90 (Total: GH₵ 2.66M) via IC Securities.',
      'Combined floor turnover exceeds weekly average by 230%.'
    ],
    source: 'GSE Daily Official List & Trade Matching Desk',
    isBreaking: true,
    readTimeMinutes: 2,
    metrics: [
      { label: 'MTN Block Value', value: 'GH₵ 8.13M', positive: true },
      { label: 'GCB Block Value', value: 'GH₵ 2.66M', positive: true },
      { label: 'Foreign Flow', value: 'Net Inflow (+)', positive: true }
    ],
    tradeDetails: {
      ticker: 'MTNGH',
      volumeTraded: 3200000,
      executionPrice: 2.54,
      totalValueGhs: 8128000,
      buyerType: 'Offshore Frontier Market Emerging Fund',
      sellerType: 'Local High-Net-Worth Syndicate',
      tradeType: 'Block Trade'
    }
  },

  // 6. BLOCK TRADES - TotalEnergies Marketing Ghana
  {
    id: 'news-trade-total-cross-2026',
    title: 'Trade Flow: Energy Sector Cross Trade of 220,000 TOTAL Shares at GH₵ 10.45',
    category: 'TRADES',
    timestamp: '1 day ago',
    date: '2026-08-22',
    relatedTickers: ['TOTAL'],
    summary: 'A negotiated cross trade in TotalEnergies Marketing Ghana signals renewed institutional appetite for high-dividend downstream energy distributors.',
    content: [
      'A cross trade of 220,000 shares of TotalEnergies Marketing Ghana (TOTAL) was executed yesterday at GH₵ 10.45, representing total trade value of GH₵ 2,299,000.',
      'The trade was arranged by SBG Securities on behalf of a statutory institutional trust, absorbing local retail offer overhang with zero market price disruption.'
    ],
    keyHighlights: [
      '220,000 shares crossed at GH₵ 10.45.',
      'Trade completed without price slippage, affirming order book depth.'
    ],
    source: 'GSE Floor Operations Bulletin',
    readTimeMinutes: 1,
    metrics: [
      { label: 'Volume', value: '220k shares' },
      { label: 'Price', value: 'GH₵ 10.45' },
      { label: 'Value', value: 'GH₵ 2.30M' }
    ],
    tradeDetails: {
      ticker: 'TOTAL',
      volumeTraded: 220000,
      executionPrice: 10.45,
      totalValueGhs: 2299000,
      buyerType: 'Statutory Pension Trust',
      sellerType: 'Corporate Portfolio Realignment',
      tradeType: 'Off-Market Cross'
    }
  },

  // 7. FINANCIAL REPORT - GCB Bank PLC H1 2026 Results
  {
    id: 'news-report-gcb-h1-2026',
    title: 'Financial Report: GCB Bank PLC H1 2026 Profit Before Tax Surges 44% to GH₵ 1.15 Billion',
    category: 'EARNINGS',
    timestamp: 'Aug 20, 2026',
    date: '2026-08-20',
    relatedTickers: ['GCB'],
    summary: 'GCB Bank releases audited half-year results showing stellar 44% growth in profitability driven by digital fee income, low non-performing loans, and treasury yields.',
    content: [
      'GCB Bank PLC has published its financial statements for the six-month period ended June 30, 2026, delivering stellar numbers that beat analyst consensus estimates across all key metrics.',
      'Profit Before Tax (PBT) reached GH₵ 1.15 Billion, a 44.2% jump from GH₵ 798 Million recorded in H1 2025. Net Interest Income expanded by 36% to GH₵ 2.05 Billion.',
      'The bank’s Capital Adequacy Ratio (CAR) strengthened to 21.8%, well above Bank of Ghana\'s prudential requirement of 13.0%, reinforcing balance sheet resilience.',
      'Earnings Per Share (EPS) for the half-year stood at GH₵ 1.88, putting the stock on an annualized Price-to-Earnings (P/E) multiple of just 3.1x, highlighting significant undervaluation relative to African banking peers.'
    ],
    keyHighlights: [
      'Profit Before Tax: GH₵ 1.15 Billion (+44.2% YoY).',
      'Net Interest Income: GH₵ 2.05 Billion (+36.0% YoY).',
      'Capital Adequacy Ratio: 21.8% (Regulatory min: 13.0%).',
      'Half-Year EPS: GH₵ 1.88 (Annualized P/E ratio: ~3.1x).'
    ],
    source: 'GCB Bank Investor Relations & GSE Listing Department',
    isImportant: true,
    readTimeMinutes: 3,
    pdfFileName: 'GCB_Bank_PLC_H1_2026_Audited_Financial_Statement.pdf',
    metrics: [
      { label: 'PBT Growth', value: '+44.2%', positive: true },
      { label: 'Net Interest Inc', value: 'GH₵ 2.05B', positive: true },
      { label: 'P/E Ratio', value: '3.1x (Cheap)', positive: true }
    ],
    reportDetails: {
      ticker: 'GCB',
      period: 'H1 2026 Half-Year Audited',
      revenue: 'GH₵ 2.45 Billion (+38% YoY)',
      profitBeforeTax: 'GH₵ 1.15 Billion (+44.2% YoY)',
      earningsPerShare: 'GH₵ 1.88',
      keyMetricGrowth: '+44.2% PBT Growth'
    }
  },

  // 8. FINANCIAL REPORT - Scancom PLC (MTN Ghana) H1 2026
  {
    id: 'news-report-mtn-h1-2026',
    title: 'Financial Report: MTN Ghana H1 Service Revenue Expands 31.4% on Data & MoMo Dominance',
    category: 'EARNINGS',
    timestamp: 'Aug 19, 2026',
    date: '2026-08-19',
    relatedTickers: ['MTNGH'],
    summary: 'MTN Ghana posts GH₵ 8.9 Billion in half-year revenue, driven by 4G/5G mobile data growth and GH₵ 135 Billion in total MoMo transaction volume.',
    content: [
      'Scancom PLC (MTN Ghana) continues to deliver robust double-digit top-line and bottom-line momentum in its interim 2026 performance results.',
      'Total Service Revenue reached GH₵ 8.92 Billion, up 31.4% year-on-year. Mobile Money revenue increased 42.1% as active merchant payments and cross-border remittances surged.',
      'EBITDA margin remained solid at 56.4%, demonstrating strict operating cost discipline despite utility and network infrastructure inflation.',
      'Management reaffirmed full-year capital expenditure (Capex) guidance of GH₵ 3.8 Billion to expand national broadband fiber and rural connectivity.'
    ],
    keyHighlights: [
      'Total Revenue: GH₵ 8.92 Billion (+31.4% YoY).',
      'Active MoMo Users: 16.4 Million (+14.5% YoY).',
      'EBITDA Margin: 56.4% with strong operating cash flow.',
      'Interim dividend declared of GH₵ 0.085 per share.'
    ],
    source: 'MTN Ghana Investor Relations',
    readTimeMinutes: 3,
    pdfFileName: 'Scancom_MTNGH_H1_2026_Financial_Factsheet.pdf',
    metrics: [
      { label: 'Revenue Growth', value: '+31.4%', positive: true },
      { label: 'EBITDA Margin', value: '56.4%', positive: true },
      { label: 'MoMo Volume', value: 'GH₵ 135B', positive: true }
    ],
    reportDetails: {
      ticker: 'MTNGH',
      period: 'H1 2026 Interim Results',
      revenue: 'GH₵ 8.92 Billion (+31.4% YoY)',
      profitBeforeTax: 'GH₵ 3.42 Billion (+29.8% YoY)',
      earningsPerShare: 'GH₵ 0.162',
      keyMetricGrowth: '+31.4% Revenue Growth'
    }
  },

  // 9. FINANCIAL REPORT - Fan Milk PLC (FML)
  {
    id: 'news-report-fml-turnaround-2026',
    title: 'Financial Report: Fan Milk PLC (FML) Turns Profit Around with 22% Margin Expansion',
    category: 'EARNINGS',
    timestamp: 'Aug 18, 2026',
    date: '2026-08-18',
    relatedTickers: ['FML'],
    summary: 'Danone subsidiary Fan Milk returns to operating profitability following localized dairy sourcing and solar factory cost savings.',
    content: [
      'Fan Milk PLC has announced a strong recovery in its Q2 2026 operating performance, posting operating profit of GH₵ 48.5 Million compared to a loss in the prior year.',
      'The company attributed the rebound to its Danone local milk collection partnership in the Volta and Bono regions, which slashed foreign exchange import exposure by 35%.'
    ],
    keyHighlights: [
      'Operating Profit: GH₵ 48.5M (Reversal from prior year deficit).',
      'Gross margin widened to 34.2% on domestic raw material substitution.'
    ],
    source: 'Fan Milk Corporate Communications / GSE Filing',
    readTimeMinutes: 2,
    pdfFileName: 'Fan_Milk_PLC_Q2_Financial_Release.pdf',
    metrics: [
      { label: 'Gross Margin', value: '34.2%', positive: true },
      { label: 'Operating Profit', value: 'GH₵ 48.5M', positive: true }
    ],
    reportDetails: {
      ticker: 'FML',
      period: 'Q2 2026 Financial Results',
      revenue: 'GH₵ 320 Million (+19% YoY)',
      profitBeforeTax: 'GH₵ 48.5 Million (Turnaround)',
      earningsPerShare: 'GH₵ 0.32',
      keyMetricGrowth: 'Full Operational Turnaround'
    }
  },

  // 10. REGULATORY - Bank of Ghana & SEC Digital CSD Integration
  {
    id: 'news-reg-sec-csd-momo-2026',
    title: 'Regulatory Reform: SEC Ghana & Bank of Ghana Mandate Instant CSD Depository Sync for Retail App Trading',
    category: 'REGULATORY',
    timestamp: 'Aug 17, 2026',
    date: '2026-08-17',
    relatedTickers: [],
    summary: 'New directive requires all GSE licensed brokerage apps to provide real-time Central Securities Depository (CSD) balance synchronization and instant MoMo trade settlements.',
    content: [
      'The Securities and Exchange Commission (SEC) in collaboration with the Bank of Ghana has issued Directive SEC/DIR/008/2026 on Digital Equities Trading and Depository Integration.',
      'Under the new framework, all GSE dealing members must integrate their customer platforms directly with the CSD API to enable instant contract notes, real-time receipt generation, and T+1 cash settlements.',
      'The policy also waives electronic transfer levies on all capital market investments, creating significant cost savings for retail investors buying GSE shares via Mobile Money.'
    ],
    keyHighlights: [
      'T+1 settlement standard for GSE equities (reduced from T+3).',
      'Zero e-levy / transaction tax on stock purchase subscriptions under GH₵ 20,000.',
      'Mandatory instant digital contract notes and receipt downloads for investors.'
    ],
    source: 'SEC Ghana & Bank of Ghana Joint Communiqué',
    isImportant: true,
    readTimeMinutes: 2,
    pdfFileName: 'SEC_Directive_CSD_Digital_Trading_2026.pdf',
    metrics: [
      { label: 'Settlement Speed', value: 'T+1 (Faster)', positive: true },
      { label: 'Capital Tax', value: '0% Exemption', positive: true }
    ]
  },

  // 11. REGULATORY - GSE Extended Trading Hours Pilot
  {
    id: 'news-reg-trading-hours-pilot-2026',
    title: 'Market Notice: Ghana Stock Exchange Announces Extended Trading Floor Hours Pilot for Q4',
    category: 'REGULATORY',
    timestamp: 'Aug 15, 2026',
    date: '2026-08-15',
    relatedTickers: [],
    summary: 'GSE will pilot extended trading hours from 09:30 to 16:00 GMT starting October 1st to accommodate European and American diaspora trading volumes.',
    content: [
      'The Council of the Ghana Stock Exchange has announced a pilot program to extend official daily equity trading hours.',
      'Beginning October 1, 2026, the trading floor and automated matching engine will operate from 09:30 GMT to 16:00 GMT (previously 10:00 to 15:00 GMT).',
      'The extension accommodates significant demand from Ghanaian diaspora investors in the UK, Europe, and North America seeking overlapping market trading windows.'
    ],
    keyHighlights: [
      'New Daily Trading Window: 09:30 - 16:00 GMT (6.5 hours of active trading).',
      'Pilot takes effect October 1, 2026 across all equity and bond boards.'
    ],
    source: 'Ghana Stock Exchange Council Circular',
    sourceId: 'gse-official',
    sourceUrl: 'https://gse.com.gh/trading-hours-update',
    readTimeMinutes: 2,
    metrics: [
      { label: 'New Hours', value: '09:30 - 16:00 GMT' },
      { label: 'Effective Date', value: 'Oct 1, 2026' }
    ]
  },

  // 12. FINANCIAL NEWS - JoyBusiness: Pension Fund Inflows to Equities
  {
    id: 'news-joybusiness-pensions-2026',
    title: 'JoyBusiness Exclusive: Tier-2 & Tier-3 Pension Funds Reallocate GH₵ 1.4B to GSE Equities',
    category: 'TRADES',
    timestamp: 'Today at 09:45 GMT',
    date: '2026-08-23',
    relatedTickers: ['MTNGH', 'GCB', 'TOTAL', 'SCB'],
    summary: 'Ghanaian private pension trustees accelerate domestic equity allocations following double-digit dividend yields and stabilised sovereign debt yields.',
    content: [
      'Private pension fund managers in Ghana have deployed over GH₵ 1.4 Billion into listed equities on the Ghana Stock Exchange over the last two quarters, JoyBusiness can report.',
      'According to data from the National Pensions Regulatory Authority (NPRA), the shift is driven by blue-chip dividend returns averaging 12-16% in banking, telecoms, and agro-processing, providing pension schemes inflation protection.',
      'Fund managers surveyed by JoyBusiness cited Scancom PLC (MTNGH), GCB Bank, and TotalEnergies Marketing Ghana as primary portfolio beneficiaries.'
    ],
    keyHighlights: [
      'GH₵ 1.4 Billion in new institutional liquidity deployed to GSE equities.',
      'Equities now comprise 18.5% of Tier-2 portfolio holdings, up from 11.2%.',
      'Long-term pension inflows support market price discovery and floor liquidity.'
    ],
    source: 'JoyBusiness Financial Desk',
    sourceId: 'joy-business',
    sourceUrl: 'https://myjoyonline.com/business/2026/pension-funds-gse-equities-surge',
    isImportant: true,
    readTimeMinutes: 3,
    metrics: [
      { label: 'Capital Deployed', value: 'GH₵ 1.4 Billion', positive: true },
      { label: 'Pension Allocation', value: '18.5% (+7.3%)', positive: true }
    ]
  },

  // 13. FINANCIAL NEWS - Citi Business: Bank of Ghana Macro Stability
  {
    id: 'news-citibusiness-bog-macro-2026',
    title: 'Citi Business: Bank of Ghana Policy Stance Sustains Cedi Stability, Catalyzing GSE Bull Run',
    category: 'REGULATORY',
    timestamp: '1 day ago',
    date: '2026-08-22',
    relatedTickers: ['GCB', 'EGL', 'GOIL'],
    summary: 'The Bank of Ghana’s monetary tightening and foreign reserve buildup continue to anchor the Ghana Cedi, spurring foreign fund participation on the local bourse.',
    content: [
      'The Ghana Cedi’s steady trajectory against major trading currencies has created a favorable macroeconomic backdrop for Ghanaian listed equities, reports Citi Business News.',
      'International frontier market analysts at Renaissance Capital noted that the GSE Composite Index (GSE-CI) has posted a year-to-date return of +26.4% in US Dollar terms, making Accra one of the top 3 best-performing bourses in Sub-Saharan Africa.'
    ],
    keyHighlights: [
      'GSE Composite Index (GSE-CI) gains +26.4% in USD terms YTD.',
      'Bank of Ghana gross international reserves stand at $7.8 Billion.',
      'Reduced FX volatility encourages multi-national corporate reinvestment.'
    ],
    source: 'Citi Business News Ghana',
    sourceId: 'citi-business',
    sourceUrl: 'https://citibusinessnews.com/2026/bog-cedi-stability-gse-gains',
    readTimeMinutes: 2,
    metrics: [
      { label: 'YTD USD Return', value: '+26.4%', positive: true },
      { label: 'Reserves', value: '$7.8 Billion', positive: true }
    ]
  },

  // 14. GLOBAL WIRE - Bloomberg Africa: Accra Stock Exchange Momentum
  {
    id: 'news-bloomberg-accra-rally-2026',
    title: 'Bloomberg Markets: Foreign Portfolio Investors Return to Ghana Equities on Attractive Multiples',
    category: 'EARNINGS',
    timestamp: '2 days ago',
    date: '2026-08-21',
    relatedTickers: ['MTNGH', 'GCB', 'BOPP', 'UNIL'],
    summary: 'Global emerging market funds are snapping up Accra-listed shares as average Price-to-Earnings ratios of 4.5x offer deep discounts to regional African peers.',
    content: [
      'Overseas portfolio capital is flowing back into West Africa’s second-largest economy, with the Ghana Stock Exchange recording six consecutive weeks of foreign net buying, according to Bloomberg market tracking.',
      'Fund managers in London and Dubai highlight attractive dividend yields and record corporate profit expansions at telecom giant MTN Ghana and leading domestic banks as compelling investment drivers.'
    ],
    keyHighlights: [
      'Foreign investors post six straight weeks of net inflows on GSE.',
      'Average GSE Price-to-Earnings (P/E) stands at 4.5x (versus 11.2x on JSE South Africa and 8.1x on NGX Nigeria).',
      'Corporate dividend yields on GSE average 10.8%, among highest globally.'
    ],
    source: 'Bloomberg Africa Markets',
    sourceId: 'bloomberg-africa',
    sourceUrl: 'https://bloomberg.com/news/articles/2026-ghana-stocks-rally',
    isImportant: true,
    readTimeMinutes: 3,
    metrics: [
      { label: 'GSE Avg P/E', value: '4.5x (Deep Value)', positive: true },
      { label: 'Avg Div Yield', value: '10.8%', positive: true },
      { label: 'Foreign Flow', value: '6 Wks Net Buying', positive: true }
    ]
  }
];

