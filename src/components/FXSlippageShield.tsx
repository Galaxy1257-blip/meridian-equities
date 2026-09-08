import React, { useState, useMemo } from 'react';
import {
  ArrowRight, DollarSign, Percent, AlertCircle, HelpCircle,
  RefreshCw, ShieldCheck, CheckCircle2, Building2, Smartphone,
  Info, ChevronDown, ChevronUp, Globe, Sparkles, TrendingUp,
  Zap, ArrowRightLeft, Check, BookOpen
} from 'lucide-react';
import { Stock } from '../types';

interface FXSlippageShieldProps {
  exchangeRateUsd: number;
  stocks?: Stock[];
  onSelectStock?: (stock: Stock) => void;
}

interface TransferRoute {
  id: string;
  name: string;
  category: 'Fintech Remittance' | 'Traditional Bank Wire' | 'Direct SEC Broker Deposit';
  spreadPct: number;
  fixedFeeUsd: number;
  speed: string;
  eLevyExempt: boolean;
  notes: string;
}

const TRANSFER_ROUTES: TransferRoute[] = [
  {
    id: 'broker-direct',
    name: 'Direct SEC Broker Foreign Account (Recommended)',
    category: 'Direct SEC Broker Deposit',
    spreadPct: 0.8,
    fixedFeeUsd: 0,
    speed: 'Same-day / T+1',
    eLevyExempt: true,
    notes: 'Direct transfer to broker CSD custody account. 100% E-Levy exempt under GRA guidelines.'
  },
  {
    id: 'fintech-app',
    name: 'Fintech Remittance App (e.g., LemFi, Sendwave, Remitly)',
    category: 'Fintech Remittance',
    spreadPct: 1.2,
    fixedFeeUsd: 0,
    speed: 'Instant to 5 mins',
    eLevyExempt: true,
    notes: 'Inward remittance to MoMo or bank is exempt upon receipt. Very low markup.'
  },
  {
    id: 'western-union',
    name: 'Traditional Money Transfer (e.g., Western Union, MoneyGram)',
    category: 'Fintech Remittance',
    spreadPct: 2.8,
    fixedFeeUsd: 8,
    speed: 'Instant cash pickup / bank deposit',
    eLevyExempt: true,
    notes: 'Higher retail FX markup baked into their advertised exchange rate.'
  },
  {
    id: 'bank-wire',
    name: 'High-Street International Bank Wire (SWIFT)',
    category: 'Traditional Bank Wire',
    spreadPct: 3.5,
    fixedFeeUsd: 35,
    speed: '2 to 4 business days',
    eLevyExempt: true,
    notes: 'Large banks deduct both international wire fees ($30–$45) plus a 3–4% currency spread.'
  }
];

const FAQS = [
  {
    q: 'What is hidden "FX Spread" (Markup)?',
    a: 'The FX spread is the invisible difference between the official Bank of Ghana mid-market exchange rate and the lower rate your bank or remittance app actually gives you. For example, if the mid-market rate is $1 = GH₵ 15.50, but your provider offers you GH₵ 15.05, that 45 pesewas per dollar (around 2.9%) is their hidden profit margin deducted before your money lands.'
  },
  {
    q: 'Does Ghana E-Levy apply to remittances sent from abroad?',
    a: 'No. Inward cross-border remittances received from outside Ghana directly into Ghanaian bank accounts or Mobile Money wallets are strictly exempt from E-Levy upon arrival. However, subsequent transfers you make locally from your personal wallet to other individuals will be subject to E-Levy (1.0% above the daily GH₵ 100 threshold).'
  },
  {
    q: 'How do I legally avoid E-Levy when buying GSE stocks?',
    a: 'Under Ghana Revenue Authority (GRA) regulations, electronic transfers made directly to licensed investment institutions (SEC-registered stockbrokers like IC Securities, Databank, CalBrokers, or Stanbic) are registered merchant investment transfers and are 100% exempt from E-Levy. Always transfer directly to your broker’s designated CSD collection account.'
  },
  {
    q: 'What is the cheapest way for the diaspora to fund a Ghana trading account?',
    a: 'The most cost-effective method is transferring via modern low-spread fintech remittance apps directly to your local Ghana bank account or Mobile Money, and then funding your broker account via instant bank/MoMo bill-pay. For large transfers (above $10,000), direct institutional wire into your broker’s USD Nostro custody account offers the best bulk exchange rate.'
  },
  {
    q: 'Do foreign or diaspora investors pay Capital Gains Tax on GSE shares?',
    a: 'No! Capital gains on shares listed on the Ghana Stock Exchange enjoy a permanent 0% Capital Gains Tax for all investors (local and diaspora alike). Furthermore, dividend withholding tax on GSE-listed equities is capped at a concessionary 8.0%, compared to 15% for non-listed private companies.'
  }
];

export const FXSlippageShield: React.FC<FXSlippageShieldProps> = ({ 
  exchangeRateUsd, 
  stocks = [], 
  onSelectStock 
}) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'routes' | 'faq'>('calculator');
  const [amount, setAmount] = useState<number>(1000);
  const [fromCurr, setFromCurr] = useState<'USD' | 'GBP' | 'EUR' | 'GHS'>('USD');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('broker-direct');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // FX rates relative to USD
  const rateTable = useMemo(() => {
    const usdToGhs = exchangeRateUsd || 15.5;
    return {
      USD: 1,
      GHS: 1 / usdToGhs,
      GBP: 1.28,
      EUR: 1.09,
    };
  }, [exchangeRateUsd]);

  const activeRoute = useMemo(() => {
    return TRANSFER_ROUTES.find(r => r.id === selectedRouteId) || TRANSFER_ROUTES[0];
  }, [selectedRouteId]);

  const calculations = useMemo(() => {
    const fromInUsd = amount * rateTable[fromCurr];
    const midMarketGhs = fromInUsd / rateTable.GHS;

    // Route-specific spread deduction
    const spreadLossGhs = midMarketGhs * (activeRoute.spreadPct / 100);

    // Fixed fee converted to GHS
    const feeGhs = (activeRoute.fixedFeeUsd / rateTable.GHS);

    // Net Cedis received
    const netCedisReceived = Math.max(0, midMarketGhs - spreadLossGhs - feeGhs);
    const totalLostGhs = midMarketGhs - netCedisReceived;
    const retainedPct = midMarketGhs > 0 ? (netCedisReceived / midMarketGhs) * 100 : 100;
    const lostPct = 100 - retainedPct;

    // Effective exchange rate
    const effectiveRate = amount > 0 ? netCedisReceived / amount : 0;
    const officialRate = amount > 0 ? midMarketGhs / amount : 0;

    return {
      midMarketGhs,
      spreadLossGhs,
      feeGhs,
      netCedisReceived,
      totalLostGhs,
      retainedPct: Math.max(0, Math.min(100, retainedPct)),
      lostPct: Math.max(0, Math.min(100, lostPct)),
      effectiveRate,
      officialRate
    };
  }, [amount, fromCurr, activeRoute, rateTable]);

  // Representative stocks to preview purchasing power in Cedis
  const sampleStocks = useMemo(() => {
    const defaultList = [
      { ticker: 'MTNGH', name: 'MTN Ghana', price: 2.25 },
      { ticker: 'GCB', name: 'GCB Bank PLC', price: 5.40 },
      { ticker: 'BOPP', name: 'Benso Oil Palm', price: 21.50 },
      { ticker: 'TOTAL', name: 'TotalEnergies Ghana', price: 9.80 },
    ];

    return defaultList.map(item => {
      const match = stocks.find(s => s.ticker === item.ticker);
      const price = match?.price || item.price;
      const sharesPurchasable = calculations.netCedisReceived > 0 ? Math.floor(calculations.netCedisReceived / price) : 0;
      return {
        ...item,
        price,
        sharesPurchasable,
        stockObj: match
      };
    });
  }, [stocks, calculations.netCedisReceived]);

  const currencySymbols = {
    USD: '$',
    GBP: '£',
    EUR: '€',
    GHS: 'GH₵'
  };

  return (
    <div className="bg-[#070D1F] border border-white/[0.08] text-white rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 font-sans">
      {/* 1. Header & Meaning Explained Instantly */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                USD to Cedi Transfer Calculator
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Remittance & Fee Shield
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Calculate your exact payout in Ghana Cedis after hidden bank exchange markups, transfer fees, and Ghana tax exemptions.
            </p>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-2xl bg-[#0B132B] border border-white/[0.08] text-right shrink-0">
          <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Official Mid-Market</span>
          <span className="text-xs sm:text-sm font-mono font-black text-amber-400">
            $1 USD = GH₵ {(1 / rateTable.GHS).toFixed(2)}
          </span>
        </div>
      </div>

      {/* 2. Navigation Tabs (Calculator vs Route Comparison vs FAQ) */}
      <div className="grid grid-cols-3 p-1 bg-[#040816] rounded-2xl border border-white/[0.08] text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Calculator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('routes')}
          className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'routes'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Compare Routes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faq')}
          className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'faq'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Investor FAQ</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: INTERACTIVE CALCULATOR
         ========================================================================= */}
      {activeTab === 'calculator' && (
        <div className="space-y-5">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Transfer Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
                  {currencySymbols[fromCurr]}
                </span>
                <input
                  type="number"
                  min="10"
                  step="50"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#040816] border border-slate-700 text-white font-mono font-black text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Sending Currency</label>
              <select
                value={fromCurr}
                onChange={(e) => setFromCurr(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040816] border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="USD" className="bg-[#0B132B] text-white">🇺🇸 USD — US Dollar</option>
                <option value="GBP" className="bg-[#0B132B] text-white">🇬🇧 GBP — British Pound</option>
                <option value="EUR" className="bg-[#0B132B] text-white">🇪🇺 EUR — Euro</option>
                <option value="GHS" className="bg-[#0B132B] text-white">🇬🇭 GHS — Ghana Cedi</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Transfer Channel</label>
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040816] border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {TRANSFER_ROUTES.map(route => (
                  <option key={route.id} value={route.id} className="bg-[#0B132B] text-white">
                    {route.name} ({route.spreadPct}% markup)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Retention & Value Retention Bar */}
          <div className="p-4 rounded-2xl bg-[#040816] border border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>You Receive {calculations.retainedPct.toFixed(1)}% of Raw Market Value</span>
              </span>
              <span className="text-rose-400 font-mono">
                Hidden Deductions: GH₵ {calculations.totalLostGhs.toFixed(2)} ({calculations.lostPct.toFixed(1)}%)
              </span>
            </div>

            {/* Visual Retention Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                style={{ width: `${calculations.retainedPct}%` }}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${calculations.lostPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
              <span>Effective Rate Received: <strong>1 {fromCurr} = GH₵ {calculations.effectiveRate.toFixed(2)}</strong></span>
              <span>Official Benchmark: 1 {fromCurr} = GH₵ {calculations.officialRate.toFixed(2)}</span>
            </div>
          </div>

          {/* Financial Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Official Raw Value</span>
              <span className="text-sm font-mono font-black text-white">
                GH₵ {calculations.midMarketGhs.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Raw exchange rate value</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/[0.08]">
              <span className="text-[10px] text-rose-400 uppercase font-bold block">Hidden Bank Markup</span>
              <span className="text-sm font-mono font-bold text-rose-400">
                -GH₵ {calculations.spreadLossGhs.toFixed(2)}
              </span>
              <span className="text-[10px] text-rose-400/80 block mt-0.5">{activeRoute.spreadPct}% provider cut</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/[0.08]">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">Ghana E-Levy</span>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>EXEMPT (GH₵ 0)</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">100% Tax-free inward rule</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40">
              <span className="text-[10px] text-emerald-400 uppercase font-black block">Cedis Reaching Ghana</span>
              <span className="text-base font-mono font-black text-emerald-400">
                GH₵ {calculations.netCedisReceived.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-300/80 block mt-0.5">Available for GSE stocks</span>
            </div>
          </div>

          {/* Purchasing Power: What Can You Buy on the GSE with This Transfer? */}
          <div className="p-4 rounded-2xl bg-[#0B132B] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  GSE Equity Purchasing Power
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                Live prices at current transfer valuation
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sampleStocks.map(stockItem => (
                <div
                  key={stockItem.ticker}
                  onClick={() => stockItem.stockObj && onSelectStock && onSelectStock(stockItem.stockObj)}
                  className="p-3 rounded-xl bg-[#040816] border border-white/[0.06] hover:border-cyan-500/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-white group-hover:text-cyan-400">
                      {stockItem.ticker}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      GH₵{stockItem.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-sm sm:text-base font-mono font-black text-emerald-400 block">
                    {stockItem.sharesPurchasable.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    shares purchasable
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: TRANSFER ROUTE COMPARISON
         ========================================================================= */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-300 leading-relaxed">
            Different transfer channels charge wildly different hidden currency markups. Direct SEC broker deposit and modern remittance apps deliver up to <strong className="text-emerald-400">GH₵ 450+ more per $1,000 sent</strong> compared to high-street bank SWIFT wires.
          </div>

          <div className="space-y-3">
            {TRANSFER_ROUTES.map(route => {
              const fromInUsd = amount * rateTable[fromCurr];
              const midMarketGhs = fromInUsd / rateTable.GHS;
              const spreadGhs = midMarketGhs * (route.spreadPct / 100);
              const feeGhs = route.fixedFeeUsd / rateTable.GHS;
              const netGhs = Math.max(0, midMarketGhs - spreadGhs - feeGhs);
              const isBest = route.id === 'broker-direct';

              return (
                <div
                  key={route.id}
                  onClick={() => {
                    setSelectedRouteId(route.id);
                    setActiveTab('calculator');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedRouteId === route.id
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                      : 'bg-[#040816] border-white/[0.08] hover:border-slate-600'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {isBest && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          BEST NET RETURN
                        </span>
                      )}
                      <h4 className="font-bold text-xs sm:text-sm text-white">
                        {route.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        Spread: {route.spreadPct}%
                      </span>
                      <span className="text-sm font-mono font-black text-emerald-400">
                        Net: GH₵ {netGhs.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {route.notes}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 mt-2 border-t border-white/[0.06]">
                    <span>Speed: <strong className="text-slate-300">{route.speed}</strong></span>
                    <span>Transfer fee: <strong className="text-slate-300">${route.fixedFeeUsd}</strong></span>
                    <span className="text-emerald-400 font-bold">E-Levy: 0% Exempt</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: FREQUENTLY ASKED QUESTIONS (FAQ)
         ========================================================================= */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400 mb-2">
            Clear, legal, and regulatory answers for Ghanaian diaspora & international cross-border investors:
          </div>

          {FAQS.map((faq, idx) => {
            const isOpen = expandedFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#040816] border border-white/[0.08] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-white/[0.04] pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
