import React, { useState } from 'react';
import { 
  BookOpen, CheckCircle2, Lightbulb, ShieldCheck, ChevronRight, 
  GraduationCap, Award, Search, ArrowRight, Smartphone, Landmark,
  Coins, TrendingUp, HelpCircle, ExternalLink, FileText, X, Sparkles, Check, Building2
} from 'lucide-react';
import { Stock } from '../types';

interface LearnInvestingSectionProps {
  stocks: Stock[];
  onOpenJargon?: (id: string) => void;
  onSelectStock?: (stock: Stock) => void;
  onNavigateToCalculators?: () => void;
  onNavigateToMarkets?: () => void;
  onOpenBrokersDirectory?: () => void;
}

interface QuickGuideDetail {
  id: string;
  icon: React.ElementType;
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
  steps: { title: string; detail: string }[];
  keyRules: string[];
  recommendedEquities: string[];
  actionLabel?: string;
  actionType?: 'markets' | 'calculators' | 'brokers';
}

const QUICK_GUIDES_DATA: QuickGuideDetail[] = [
  {
    id: 'momo-trading',
    icon: Smartphone,
    badge: 'Quick Start',
    title: 'Mobile Money Stock Trading',
    subtitle: 'Buy GSE Equities directly via MTN MoMo, Telecel Cash & Broker Apps',
    desc: 'Dial *170# on MTN or use licensed broker mobile portals to buy GSE equities in minutes using your Ghana Card and existing mobile money wallet.',
    steps: [
      {
        title: 'Step 1: Get Your Ghana Card Ready',
        detail: 'In compliance with Bank of Ghana and SEC regulations, your Ghana Card is mandatory for instant digital identity verification (KYC).'
      },
      {
        title: 'Step 2: Dial *170# or Open a Broker App',
        detail: 'For MTN shares, dial *170# → Select [5] Financial Services → Select [Trade Stocks / MTN Shares]. For other GSE shares (like GCB Bank, TOTAL, BOPP), download an authorized broker app (such as IC Trader or Databank Mobile).'
      },
      {
        title: 'Step 3: Fund Your Trading Account with MoMo',
        detail: 'Transfer funds from your MTN MoMo, Telecel Cash, or AT Money wallet directly to your broker custody account with zero paperwork.'
      },
      {
        title: 'Step 4: Execute Your Buy Order',
        detail: 'Select your chosen company ticker (e.g. MTNGH), enter the number of shares, review current market ask price, and authorize payment with your MoMo PIN.'
      },
      {
        title: 'Step 5: Settlement & SMS Confirmation',
        detail: 'Trade settles on T+3 business days on the GSE floor. Your shares are instantly credited to your Central Securities Depository (CSD) ID.'
      }
    ],
    keyRules: [
      'Minimum investment on Mobile Money starts as low as GH₵ 5 to GH₵ 20.',
      'Dividends are deposited directly back into your Mobile Money wallet or bank.',
      'Mobile Money purchases are protected by SEC Ghana broker fiduciary rules.'
    ],
    recommendedEquities: ['MTNGH', 'GCB', 'TOTAL', 'BOPP'],
    actionLabel: 'Explore GSE Stocks',
    actionType: 'markets'
  },
  {
    id: 'csd-vault',
    icon: Landmark,
    badge: 'Account Security',
    title: 'CSD Electronic Vault',
    subtitle: 'Central Securities Depository Ghana (CSD) Custody & Protections',
    desc: 'Understand your Central Securities Depository ID and how shares are held safely in your legal name under Bank of Ghana and SEC Ghana supervision.',
    steps: [
      {
        title: 'What is the CSD Account?',
        detail: 'The Central Securities Depository (CSD) is the electronic central registry established by the Bank of Ghana and Ghana Stock Exchange. It replaces old physical paper certificates with 100% digital, immutable ownership records.'
      },
      {
        title: 'One CSD ID Across All Brokers',
        detail: 'Your 10-digit CSD account number belongs to YOU, linked to your Ghana Card. You can use one CSD ID across multiple stockbrokers without fragmenting your portfolio.'
      },
      {
        title: 'Broker Insolvency Shield',
        detail: 'Even if a brokerage firm shuts down or faces insolvency, your shares NEVER touch broker balance sheets. They remain safe in the CSD vault and can be transferred to any other licensed broker immediately.'
      },
      {
        title: 'Checking Your Statement & Holdings',
        detail: 'You can request CSD statements online or via SMS shortcode (*888# or portal.csd.com.gh) to inspect your verified shareholdings at any time.'
      }
    ],
    keyRules: [
      'Legal ownership is registered directly with the state depository in your name.',
      'Dividend payouts are wired using your official CSD direct deposit mandate.',
      'Shares cannot be transferred or sold without your explicit authenticated instruction.'
    ],
    recommendedEquities: ['ALL'],
    actionLabel: 'View Licensed GSE Brokers',
    actionType: 'brokers'
  },
  {
    id: 'tax-rules',
    icon: Coins,
    badge: 'Tax Guide',
    title: 'Tax-Free Capital Gains & 8% Tax',
    subtitle: 'Ghana Revenue Authority (GRA) Tax Incentives for GSE Stockholders',
    desc: 'Learn how stock profits are 100% exempt from capital gains tax in Ghana and how cash dividends are subject to a low 8% final withholding tax.',
    steps: [
      {
        title: '0% Capital Gains Tax Exemption',
        detail: 'Under the Ghanaian Income Tax Act (Act 896), capital gains realized from the disposal of shares listed on the Ghana Stock Exchange are completely TAX-FREE for retail investors. If you buy shares at GH₵ 1.00 and sell at GH₵ 3.00, you keep 100% of the profit.'
      },
      {
        title: '8% Final Withholding Tax on Dividends',
        detail: 'When a GSE corporation pays cash dividends, an 8% withholding tax is deducted at source by the share registrar. You receive the remaining 92% net cash directly into your account.'
      },
      {
        title: 'No Complex Annual Filing Needed',
        detail: 'Because the 8% dividend withholding is a "final tax", individual retail investors do not need to perform complex end-of-year tax declarations for their GSE dividend income.'
      },
      {
        title: 'Comparison to Real Estate & Business Income',
        detail: 'Corporate profits face 25% tax, and ordinary income brackets reach up to 35%. The 0% capital gains and 8% dividend rate make GSE equities one of Ghana\'s most tax-advantaged wealth building assets.'
      }
    ],
    keyRules: [
      'Capital gains: 0% (Completely tax exempt on GSE).',
      'Cash dividends: 8% final withholding at source.',
      'Treasury Bill interest: Exempt from withholding tax for retail individuals.'
    ],
    recommendedEquities: ['BOPP', 'TOTAL', 'SCB', 'MTNGH'],
    actionLabel: 'Open Dividend Calculator',
    actionType: 'calculators'
  },
  {
    id: 'blue-chips-vs-tbills',
    icon: TrendingUp,
    badge: 'Asset Strategy',
    title: 'GSE Blue Chips vs. T-Bills',
    subtitle: 'Accra Asset Allocation: Comparing Fixed Income vs. Dividend Equities',
    desc: 'Compare dividend-growth equities against 91-day Government of Ghana Treasury Bills to hedge against inflation, DDEP haircut risks, and cedi depreciation.',
    steps: [
      {
        title: 'Understanding Government T-Bills',
        detail: '91-day and 182-day Treasury Bills provide guaranteed nominal cedi yields (historically 20% to 28%). However, they offer NO capital growth and their real returns can be eroded during periods of high inflation or steep cedi depreciation.'
      },
      {
        title: 'The GSE Blue Chip Advantage',
        detail: 'Companies like MTNGH, GCB Bank, TOTAL Energies, and BOPP produce physical cash flows, revenue growth, and dividend yields (often 8% to 18%). When inflation rises, quality companies raise their prices, protecting your purchasing power.'
      },
      {
        title: 'Hedging Cedi Depreciation with Exporters',
        detail: 'Agro-industrial companies on the GSE (like BOPP - Benso Oil Palm Plantation) sell palm oil linked to global dollar commodities, providing an organic FX hedge against cedi volatility.'
      },
      {
        title: 'Balanced Ghanaian Portfolio Strategy',
        detail: 'Smart investors do not choose one exclusively: keep short-term emergency cash in 91-day T-Bills, and invest long-term compounding wealth in high-ROE, dividend-paying GSE equities.'
      }
    ],
    keyRules: [
      'T-Bills give fixed nominal interest; stocks give capital appreciation + dividends.',
      'GSE equities historically outperform inflation over 3-to-5 year horizons.',
      'Reinvesting cash dividends exponentially accelerates compounding.'
    ],
    recommendedEquities: ['BOPP', 'TOTAL', 'MTNGH', 'GCB', 'SCB'],
    actionLabel: 'View Market Screeners',
    actionType: 'markets'
  }
];

interface QAItem {
  id: string;
  category: 'getting_started' | 'trading_momo' | 'dividends_taxes' | 'valuation' | 'ddep_macro';
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  keyTakeaways: string[];
  suggestedAction?: string;
  relatedTickers?: string[];
}

const GSE_KNOWLEDGE_BASE: QAItem[] = [
  {
    id: 'how-to-buy-momo',
    category: 'trading_momo',
    question: 'How do I buy Ghana Stock Exchange shares using Mobile Money (MTN MoMo or Telecel Cash)?',
    shortAnswer: 'You can buy GSE shares directly on your phone using MTN MoMo (*170#), the MTN Share mobile portal, or via SEC-licensed broker mobile apps (e.g. IC Securities, Databank, CalBank).',
    detailedAnswer: 'To purchase shares via Mobile Money in Ghana, you first need a valid Ghana Card. For MTN Ghana shares, dial *170#, select Financial Services, then Trade Stocks / MTN Shares to buy or sell directly from your MoMo wallet. For other GSE equities (like GCB Bank, BOPP, or TOTAL), download a licensed broker app such as IC Trader or Databank Mobile, link your CSD account number, and fund your wallet instantly with MoMo or Telecel Cash.',
    keyTakeaways: [
      'Valid Ghana Card is required for KYC compliance.',
      'MTN shares can be traded via *170# or MoMo USSD.',
      'Broker apps allow funding with MoMo for all 30+ GSE listed equities.',
      'Settlement takes T+3 business days on the GSE floor.'
    ],
    suggestedAction: 'Open Broker Account or dial *170#',
    relatedTickers: ['MTNGH', 'GCB', 'TOTAL']
  },
  {
    id: 'what-is-csd-account',
    category: 'getting_started',
    question: 'What is a CSD Account and why do I need one to trade on the GSE?',
    shortAnswer: 'The Central Securities Depository (CSD) is the electronic vault in Accra that holds digital records of all your shares, Treasury Bills, and bonds in your legal name.',
    detailedAnswer: 'Just like you need a bank account number to store cash, you need a CSD Account Number (CSD ID) to hold electronic share certificates on the Ghana Stock Exchange. When you buy shares through any broker (Databank, IC Securities, Black Star, etc.), your shares are deposited into your personal CSD account. Even if your broker ceases operations, your shares remain 100% safe in the CSD under the supervision of the Bank of Ghana and SEC.',
    keyTakeaways: [
      'CSD stands for Central Securities Depository Ghana.',
      'One CSD account can hold shares from multiple Ghanaian brokers.',
      'Guarantees legal ownership under your Ghana Card.',
      'Prevents physical paper share theft or loss.'
    ],
    suggestedAction: 'Learn about CSD registration steps',
    relatedTickers: ['ALL']
  },
  {
    id: 'dividend-withholding-tax',
    category: 'dividends_taxes',
    question: 'How are dividends taxed in Ghana, and do I have to pay capital gains tax on stocks?',
    shortAnswer: 'GSE dividends are subject to a final 8% withholding tax deducted automatically. Capital gains from trading listed shares are 100% TAX-FREE in Ghana.',
    detailedAnswer: 'Under Ghanaian tax laws, when a GSE company declares a cash dividend (e.g., GH₵ 0.15 per share), the share registrar automatically withholds 8% as final tax before sending the remaining 92% to your bank account or MoMo wallet. Crucially, any profits you make from selling shares at a higher price (capital gains) are completely exempt from tax on the GSE, making equities one of the most tax-efficient wealth vehicles in Ghana.',
    keyTakeaways: [
      'Dividends have a final 8% withholding tax deducted at source.',
      'Capital gains on GSE shares are 100% tax-free.',
      'Dividends are paid directly to your linked MoMo wallet or Bank account.',
      'No complex annual tax filing is required for retail stock gains.'
    ],
    suggestedAction: 'Calculate your dividend net yield in the Calculators tab',
    relatedTickers: ['BOPP', 'TOTAL', 'MTNGH', 'SCB']
  },
  {
    id: 'blue-chip-vs-gax',
    category: 'valuation',
    question: 'What is the difference between Main Board Blue Chips and GAX (Ghana Alternative Market)?',
    shortAnswer: 'The Main Board lists large, mature Ghanaian corporations (like MTNGH, GCB), while GAX is designed for small and medium enterprises (SMEs) with higher growth potential and higher risk.',
    detailedAnswer: 'The GSE is divided into two primary market boards: 1) The Main Board, which requires minimum stated capital of GH₵ 10 Million and a multi-year audited profit track record (e.g., MTN Ghana, Standard Chartered, TotalEnergies). 2) The Ghana Alternative Market (GAX), which has lower entry thresholds (GH₵ 250,000 stated capital) to help growing SMEs (like Samba Foods, Mega African Capital) raise growth equity.',
    keyTakeaways: [
      'Main Board: High liquidity, proven profitability, large dividends.',
      'GAX: Small-cap growth companies, lower liquidity, potential higher volatility.',
      'Blue chips are generally safer for first-time retail Ghanaian investors.'
    ],
    suggestedAction: 'Filter stocks by Market Board in the Markets tab',
    relatedTickers: ['MTNGH', 'GCB', 'SAMBA']
  },
  {
    id: 'ddep-impact-banks',
    category: 'ddep_macro',
    question: 'How did Ghana\'s Domestic Debt Exchange Programme (DDEP) affect GSE banking stocks?',
    shortAnswer: 'DDEP caused Ghanaian banks to take one-time impairment losses in 2022/2023, but resilient balance sheets and rising net interest income have driven a strong earnings recovery.',
    detailedAnswer: 'During the 2022/2023 DDEP, Ghanaian commercial banks exchanged their high-yielding government bonds for new longer-dated bonds, causing temporary accounting impairment losses. However, top banks like GCB Bank, Ecobank Ghana, and Stanbic demonstrated remarkable operational resilience. Restored fee income, trade financing, and loan growth led to rebounding profits, making several GSE banking stocks attractive value plays with low P/E ratios.',
    keyTakeaways: [
      'Temporary DDEP bond haircut is largely absorbed by banking provisions.',
      'GSE banks (GCB, EGH, CAL) trade at attractive valuation multiples.',
      'Bank of Ghana regulatory forbearance helped stabilize capital buffers.',
      'Rebounding earnings support restored cash dividend distributions.'
    ],
    suggestedAction: 'Check banking sector metrics in the screener',
    relatedTickers: ['GCB', 'EGH', 'CAL', 'SCB']
  },
  {
    id: 'how-to-pick-stocks',
    category: 'valuation',
    question: 'What are the 3 most important metrics to check before buying any GSE stock?',
    shortAnswer: 'The 3 golden metrics on the GSE are: 1) Liquidity (Easy to Sell Score), 2) Dividend Yield % (Cash Back), and 3) P/E Valuation Ratio (Bargain Score).',
    detailedAnswer: 'Because the Accra market has varying daily trading volumes, always examine: 1) Liquidity (ensure the stock trades frequently so you can sell quickly if needed), 2) Dividend History & Yield (look for consistent annual payouts above 8%), and 3) P/E Ratio (compare how cheap the company is relative to its annual earnings). Meridian Equities combines these into an Overall Quality Score to simplify your research.',
    keyTakeaways: [
      'Liquidity prevents getting locked into illiquid shares.',
      'High dividend yields act as cash flow cushions against inflation.',
      'A low P/E ratio (< 6x) indicates potential undervalued bargains on the GSE.'
    ],
    suggestedAction: 'Explore the "Sort by Overall Score" in the Markets tab',
    relatedTickers: ['BOPP', 'MTNGH', 'TOTAL', 'GCB']
  }
];

export const LearnInvestingSection: React.FC<LearnInvestingSectionProps> = ({
  stocks,
  onOpenJargon,
  onSelectStock,
  onNavigateToCalculators,
  onNavigateToMarkets,
  onOpenBrokersDirectory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedQaId, setExpandedQaId] = useState<string | null>('how-to-buy-momo');
  const [activeGuideModal, setActiveGuideModal] = useState<QuickGuideDetail | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Topics' },
    { id: 'trading_momo', label: 'Mobile Money & Trading' },
    { id: 'getting_started', label: 'CSD & Accounts' },
    { id: 'dividends_taxes', label: 'Dividends & Tax' },
    { id: 'valuation', label: 'Valuation & Metrics' },
    { id: 'ddep_macro', label: 'DDEP & Macro' }
  ];

  const handleCardClick = (guide: QuickGuideDetail) => {
    setActiveGuideModal(guide);
    if (guide.id === 'momo-trading') {
      setExpandedQaId('how-to-buy-momo');
      setSelectedCategory('trading_momo');
    } else if (guide.id === 'csd-vault') {
      setExpandedQaId('what-is-csd-account');
      setSelectedCategory('getting_started');
    } else if (guide.id === 'tax-rules') {
      setExpandedQaId('dividend-withholding-tax');
      setSelectedCategory('dividends_taxes');
    } else if (guide.id === 'blue-chips-vs-tbills') {
      setExpandedQaId('blue-chip-vs-gax');
      setSelectedCategory('valuation');
    }
  };

  const handleAction = (type?: string) => {
    setActiveGuideModal(null);
    if (type === 'markets' && onNavigateToMarkets) {
      onNavigateToMarkets();
    } else if (type === 'calculators' && onNavigateToCalculators) {
      onNavigateToCalculators();
    } else if (type === 'brokers' && onOpenBrokersDirectory) {
      onOpenBrokersDirectory();
    }
  };

  const filteredQa = GSE_KNOWLEDGE_BASE.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.detailedAnswer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 text-white border border-emerald-900/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Ghana Stock Exchange Investor Academy
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Learn GSE Investing & Financial Rules
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Master the Accra bourse through verified regulatory guides, Mobile Money purchase walkthroughs, CSD account explanations, and dividend tax insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenJargon && (
            <button
              onClick={() => onOpenJargon('liquidity')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Glossary Guide</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Interactive Quick Guide Cards - NOW FULLY CLICKABLE & EXPANDABLE */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Interactive Field Manuals (Tap to view full actionable guide)
          </span>
          <span className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400">
            4 Interactive Playbooks
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_GUIDES_DATA.map((guide) => {
            const Icon = guide.icon;
            return (
              <button
                key={guide.id}
                type="button"
                onClick={() => handleCardClick(guide)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 active:scale-[0.99] transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer group"
                title={`Click to read full ${guide.title} guide`}
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                      {guide.badge}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    {guide.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {guide.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-100 dark:border-slate-800/80 w-full justify-between">
                  <span>Open Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Topic Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. 'MoMo', 'CSD', 'Tax', 'Dividends', 'P/E')..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q&A Accordion Cards */}
        <div className="space-y-3 pt-2">
          {filteredQa.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No matching topic found for "{searchQuery}". Try searching for "MoMo", "tax", "dividends", or "CSD".
            </div>
          ) : (
            filteredQa.map((qa) => {
              const isExpanded = expandedQaId === qa.id;

              return (
                <div
                  key={qa.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 shadow-xs'
                      : 'bg-slate-50/60 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setExpandedQaId(isExpanded ? null : qa.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          {qa.category.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                        {qa.question}
                      </h4>
                      {!isExpanded && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {qa.shortAnswer}
                        </p>
                      )}
                    </div>

                    <div className={`p-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-500 transition-transform shrink-0 ${isExpanded ? 'rotate-90 text-emerald-500' : ''}`}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-0 border-t border-emerald-500/20 space-y-4 text-xs text-slate-700 dark:text-slate-300">
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 leading-relaxed text-xs">
                        {qa.detailedAnswer}
                      </div>

                      {/* Key Takeaways */}
                      <div className="space-y-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Key Takeaways for Ghanaian Investors:</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {qa.keyTakeaways.map((point, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                              • {point}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Related Tickers */}
                      {qa.relatedTickers && qa.relatedTickers.length > 0 && qa.relatedTickers[0] !== 'ALL' && (
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <span className="text-[11px] font-bold text-slate-400">Related Listed Stocks:</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {qa.relatedTickers.map(ticker => {
                              const stockObj = stocks.find(s => s.ticker === ticker);
                              return (
                                <button 
                                  key={ticker}
                                  onClick={() => stockObj && onSelectStock && onSelectStock(stockObj)}
                                  className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
                                >
                                  {ticker}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Dedicated Interactive Quick Guide Detail Modal */}
      {activeGuideModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setActiveGuideModal(null)}
        >
          <div 
            className="bg-white dark:bg-[#070D1F] w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col text-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-[#070D1F] text-white p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shrink-0">
                  <activeGuideModal.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                      {activeGuideModal.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Official Investor Field Guide</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    {activeGuideModal.title}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {activeGuideModal.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveGuideModal(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              {/* Summary Box */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p>{activeGuideModal.desc}</p>
              </div>

              {/* Step-by-Step Procedure */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Actionable Step-by-Step Procedure</span>
                </h4>
                <div className="space-y-2.5">
                  {activeGuideModal.steps.map((step, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1"
                    >
                      <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{step.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory & Institutional Rules */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Key Investor Rules & Depository Protections</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeGuideModal.keyRules.map((rule, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Listed Equities */}
              {activeGuideModal.recommendedEquities.length > 0 && activeGuideModal.recommendedEquities[0] !== 'ALL' && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Relevant GSE Companies for this Strategy:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeGuideModal.recommendedEquities.map(ticker => {
                      const stockObj = stocks.find(s => s.ticker === ticker);
                      return (
                        <button
                          key={ticker}
                          type="button"
                          onClick={() => {
                            setActiveGuideModal(null);
                            if (stockObj && onSelectStock) onSelectStock(stockObj);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-mono font-black flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <span>{ticker}</span>
                          <span className="text-[10px] text-slate-400 font-sans font-normal">
                            {stockObj ? `GH₵ ${stockObj.price.toFixed(2)}` : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveGuideModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Guide
              </button>

              {activeGuideModal.actionLabel && (
                <button
                  type="button"
                  onClick={() => handleAction(activeGuideModal.actionType)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <span>{activeGuideModal.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
