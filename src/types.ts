export interface PricePoint {
  date: string;
  price: number;
  volume: number;
}

export interface Stock {
  ticker: string;
  name: string;
  sector: 'Telecom' | 'Financials' | 'Agriculture' | 'Energy' | 'Consumer Goods' | 'Mining' | 'Insurance';
  price: number;
  change: number;
  changePercent: number;
  easyToSellScore: number; // 0-100 (Liquidity)
  cashBackScore: number;   // 0-100 (Dividend Yield strength)
  bargainScore: number;    // 0-100 (Value / P/E attractiveness)
  summary: string;
  description: string;
  isWatchlisted: boolean;
  exDividendDate?: string | null;
  dividendAmount?: number | null;
  dividendYield?: number; // percentage, e.g. 8.5
  marketCap: number; // in millions GHS
  peRatio: number;
  volume: number;
  high52W: number;
  low52W: number;
  bullVotes: number;
  bearVotes: number;
  priceHistory: {
    '1D': PricePoint[];
    '1W': PricePoint[];
    '1M': PricePoint[];
    '3M'?: PricePoint[];
    '1Y': PricePoint[];
    'ALL': PricePoint[];
  };
}

export interface JargonInfo {
  id: string;
  title: string;
  easyTitle: string;
  summary: string;
  explanation: string;
  analogy: string;
  whyItMatters: string;
  exampleGSE: string;
  category: 'trading' | 'dividends' | 'valuation' | 'basics';
  metricScale?: string;
  higherOrLower?: 'higher_better' | 'lower_better' | 'context_dependent' | 'lower_is_safer';
  ruleHeadline?: string;
  quickAnswer?: string;
}

export enum SortOption {
  OVERALL = 'OVERALL',
  LIQUIDITY = 'LIQUIDITY',
  DIVIDEND = 'DIVIDEND',
  VALUE = 'VALUE',
  PRICE_DESC = 'PRICE_DESC',
  PRICE_ASC = 'PRICE_ASC',
  GAINERS = 'GAINERS',
  LOSERS = 'LOSERS'
}

export type SectorFilter = 'ALL' | 'Telecom' | 'Financials' | 'Agriculture' | 'Energy' | 'Consumer Goods' | 'Mining' | 'Insurance';

export interface MarketIndex {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
  description: string;
}

export type AlertCondition = 'ABOVE' | 'BELOW';

export interface PriceAlert {
  id: string;
  ticker: string;
  stockName: string;
  targetPrice: number;
  condition: AlertCondition;
  initialPrice: number;
  createdAt: string;
  triggered: boolean;
  triggeredAt?: string;
  note?: string;
  isActive: boolean;
}

export type NotificationCategory = 'STOCK' | 'PORTFOLIO' | 'NEWS' | 'MARKET';

export interface AlertNotification {
  id: string;
  alertId: string;
  ticker?: string;
  stockName?: string;
  targetPrice?: number;
  actualPrice?: number;
  condition?: AlertCondition;
  timestamp: string;
  read: boolean;
  category?: NotificationCategory;
  type?: 'PRICE_ALERT' | 'STOCK_SURGE' | 'PORTFOLIO_MILESTONE' | 'DIVIDEND_REMINDER' | 'MAJOR_NEWS' | 'MARKET_OPEN' | 'MARKET_CLOSE';
  title?: string;
  message?: string;
  actionLabel?: string;
  newsId?: string;
  archived?: boolean;
  archivedAt?: string;
}

export interface NotificationPreferences {
  stockPriceAlerts: boolean;
  stockSurgeAlerts: boolean;
  portfolioMilestones: boolean;
  dividendReminders: boolean;
  majorNewsAlerts: boolean;
  marketHoursAlerts: boolean;
  audioChime: boolean;
  browserPush: boolean;
}

export interface ReceiptAttachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileData?: string; // base64 data url for viewing / previewing
  uploadedAt: string;
}

export interface PortfolioHolding {
  id: string;
  ticker: string;
  stockName: string;
  sharesCount: number;
  buyPrice: number;
  startDate: string; // YYYY-MM-DD
  brokerName?: string;
  notes?: string;
  receipt?: ReceiptAttachment;
  createdAt: string;
  updatedAt?: string;
}

export type NewsCategory = 'ALL' | 'IPO' | 'DIVIDEND' | 'EARNINGS' | 'TRADES' | 'REGULATORY';

export interface IpoDetails {
  companyName: string;
  proposedTicker: string;
  offerPrice: number; // in GHS
  targetRaise: string; // e.g. "GH₵ 350 Million"
  sharesOffered: string; // e.g. "75,000,000 shares"
  subscriptionOpen: string; // e.g. "Sep 1, 2026"
  subscriptionClose: string; // e.g. "Sep 25, 2026"
  listingDate: string; // e.g. "Oct 12, 2026"
  minSubscription: string; // e.g. "100 shares (GH₵ 450)"
  leadBroker: string; // e.g. "IC Securities & Databank"
  status: 'Upcoming' | 'Open' | 'Closed' | 'Allotted' | 'Listed';
  sector: string;
  prospectusSummary: string;
  marketBoard: 'Main GSE Board' | 'Ghana Alternative Market (GAX)';
}

export interface DividendNewsDetails {
  ticker: string;
  amountPerShare: number; // e.g. 0.085
  qualifyingDate: string;
  paymentDate: string;
  dividendYield: number;
  agmDate?: string;
  payoutMethod?: string;
}

export interface TradeNewsDetails {
  ticker: string;
  volumeTraded: number;
  executionPrice: number;
  totalValueGhs: number;
  buyerType: string;
  sellerType: string;
  tradeType: 'Block Trade' | 'Off-Market Cross' | 'Foreign Inflow' | 'Floor Surge';
}

export interface ReportNewsDetails {
  ticker: string;
  period: string;
  revenue: string;
  profitBeforeTax: string;
  earningsPerShare: string;
  keyMetricGrowth?: string;
}

export interface GSEMarketNews {
  id: string;
  title: string;
  category: 'IPO' | 'DIVIDEND' | 'EARNINGS' | 'TRADES' | 'REGULATORY';
  timestamp: string;
  date: string;
  relatedTickers: string[];
  summary: string;
  content: string[];
  keyHighlights: string[];
  source: string;
  sourceId?: string; // id matching reputable sources
  sourceUrl?: string;
  isBreaking?: boolean;
  isImportant?: boolean;
  readTimeMinutes: number;
  pdfFileName?: string;
  metrics?: { label: string; value: string; positive?: boolean }[];
  ipoDetails?: IpoDetails;
  dividendDetails?: DividendNewsDetails;
  tradeDetails?: TradeNewsDetails;
  reportDetails?: ReportNewsDetails;
}

export interface ReputableSource {
  id: string;
  name: string;
  category: 'Official Exchange' | 'Financial News' | 'Central Bank / Regulator' | 'Global Media';
  reputation: 'Government / Official' | 'Licensed Regulatory' | 'Top Tier National Media' | 'International Wire';
  website: string;
  verified: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  method: 'SMS' | 'EMAIL';
  contact: string; // e.g. +233 24 819 2831 or kwame@example.com
  networkProvider?: 'MTN' | 'Telecel' | 'AT (AirtelTigo)' | 'Global Carrier' | 'Other';
  isVerified: boolean;
  verifiedAt?: string;
  investorLevel: 'Novice' | 'Intermediate' | 'Pro' | 'Institutional';
  tradingGoal: string;
  bio?: string;
  // International & Country Personalization
  baseCountry?: 'GH' | 'US' | 'NG' | 'KE' | 'ZA' | 'GB' | 'EU' | string;
  currencyCode?: 'GHS' | 'USD' | 'NGN' | 'KES' | 'ZAR' | 'GBP' | 'EUR';
  currencySymbol?: string; // e.g. '₵', '$', '₦'
  kycStatus?: 'unverified' | 'pending' | 'verified';
  kycDocType?: 'ghana_card' | 'passport' | 'national_id';
  pinEnabled?: boolean;
  biometricEnabled?: boolean;
  premiumTrialExpiry?: number; // unix timestamp ms
  subscriptionTier?: SubscriptionTier;
}

export interface ChatMessage {
  id: string;
  channelId: string; // 'general' | 'ipo' | 'dividends' | 'banking' | 'ai-advisor'
  senderName: string;
  senderRole: 'investor' | 'moderator' | 'analyst' | 'ai';
  senderAvatar: string;
  content: string;
  timestamp: string;
  tickerTags?: string[];
  likes: number;
  likedByMe?: boolean;
  sentiment?: 'bullish' | 'bearish' | 'analysis' | 'question';
  reactions?: Record<string, number>;
  userId?: string;
  userContact?: string;
  isUserMessage?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  topic: string;
  iconName: string;
  unreadCount?: number;
  membersCount: number;
}

export interface MeridianAxisScore {
  value: number; // 0-6
  future: number; // 0-6
  past: number; // 0-6
  health: number; // 0-6
  dividend: number; // 0-6
  total: number; // 0-30
  rating: 'Exceptional' | 'Strong' | 'Moderate' | 'Speculative';
}
export type SnowflakeScore = MeridianAxisScore;

export interface AiStockNarrative {
  ticker: string;
  bullThesis: string[];
  bearThesis: string[];
  catalyst2026: string;
  valuationVerdict: string;
  targetPriceGhs: number;
}

export type SubscriptionTier = 'FREE' | 'PRO' | 'INSTITUTIONAL';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  priceGhsMonthly: number;
  priceUsdMonthly: number;
  badge: string;
  features: string[];
  isPopular?: boolean;
}

export interface FinancialGoal {
  id: string;
  title: string;
  category: 'Retirement' | 'Accra Real Estate' | 'Children Education' | 'Passive Income' | 'Emergency Wealth';
  targetAmountGhs: number;
  currentSavedGhs: number;
  monthlyDepositGhs: number;
  targetYears: number;
  expectedAnnualReturnPct: number;
  recommendedTickers: string[];
  createdAt: string;
}

export type MainNavTab = 'home' | 'markets' | 'calculators' | 'learn' | 'community' | 'portfolio' | 'chat' | 'news';

export interface OnboardingStep {
  id: number;
  title: string;
  tagline: string;
  icon: string;
  description: string;
  features: string[];
  targetTab?: MainNavTab;
}

