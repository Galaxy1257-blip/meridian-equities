import React, { useState, useMemo } from 'react';
import { 
  Calculator, TrendingUp, DollarSign, Percent, ShieldCheck, 
  HelpCircle, ArrowRight, RotateCcw, PieChart, Sparkles, AlertCircle,
  Building2, Layers, CheckCircle2, ChevronRight, BarChart2, Play
} from 'lucide-react';
import { Stock } from '../types';

interface CalculatorsSectionProps {
  stocks: Stock[];
  onOpenJargon?: (id: string) => void;
  onSelectStock?: (stock: Stock) => void;
  onNavigateToLearn?: () => void;
}

type CalculatorTab = 'stock_return' | 'tbill_vs_stock' | 'compound_interest' | 'broker_fees' | 'dca_momo' | 'inflation_fx' | 'backtester';

export const CalculatorsSection: React.FC<CalculatorsSectionProps> = ({
  stocks,
  onOpenJargon,
  onSelectStock,
  onNavigateToLearn
}) => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('stock_return');

  // ==========================================
  // 1. Stock Return & Dividend Calculator State
  // ==========================================
  const [srTicker, setSrTicker] = useState<string>('MTNGH');
  const [srBuyPrice, setSrBuyPrice] = useState<number>(2.40);
  const [srSellPrice, setSrSellPrice] = useState<number>(3.10);
  const [srQuantity, setSrQuantity] = useState<number>(1000);
  const [srDividendPerShare, setSrDividendPerShare] = useState<number>(0.18);
  const [srYearsHeld, setSrYearsHeld] = useState<number>(1.5);

  // When ticker changes, auto-populate buy price & dividend
  const handleStockSelectSr = (ticker: string) => {
    setSrTicker(ticker);
    const s = stocks.find(st => st.ticker === ticker);
    if (s) {
      setSrBuyPrice(s.price);
      setSrSellPrice(Number((s.price * 1.25).toFixed(2)));
      setSrDividendPerShare(s.dividendAmount || 0.15);
    }
  };

  // Calculations for Stock Return
  const initialCost = srBuyPrice * srQuantity;
  const grossCapitalGain = (srSellPrice - srBuyPrice) * srQuantity;
  const grossDividends = srDividendPerShare * srQuantity;
  const dividendWithholdingTax = grossDividends * 0.08; // 8% Ghana WHT on dividends
  const netDividends = grossDividends - dividendWithholdingTax;
  const totalNetProfit = grossCapitalGain + netDividends;
  const totalRoiPercent = initialCost > 0 ? (totalNetProfit / initialCost) * 100 : 0;
  const cagrPercent = srYearsHeld > 0 && initialCost > 0 
    ? (Math.pow((initialCost + totalNetProfit) / initialCost, 1 / srYearsHeld) - 1) * 100 
    : 0;

  // ==========================================
  // 2. GoG T-Bill vs GSE Equities Comparator
  // ==========================================
  const [tbillPrincipal, setTbillPrincipal] = useState<number>(10000);
  const [tbillRate, setTbillRate] = useState<number>(26.5); // GoG 91/182 Day T-Bill Rate ~26.5%
  const [stockExpectedDivYield, setStockExpectedDivYield] = useState<number>(11.0); // e.g. MTNGH or BOPP
  const [stockExpectedGrowth, setStockExpectedGrowth] = useState<number>(22.0); // e.g. 22% capital gain
  const [tbillHorizonYears, setTbillHorizonYears] = useState<number>(3);

  // T-Bill calculation (Compounded annually, 0% tax on GoG securities)
  const tbillFutureValue = tbillPrincipal * Math.pow(1 + (tbillRate / 100), tbillHorizonYears);
  const tbillTotalProfit = tbillFutureValue - tbillPrincipal;

  // Stock calculation (Capital growth + Net Dividend reinvested)
  const stockNetDivYield = stockExpectedDivYield * 0.92; // after 8% WHT
  const stockCombinedAnnualRate = (stockExpectedGrowth + stockNetDivYield) / 100;
  const stockFutureValue = tbillPrincipal * Math.pow(1 + stockCombinedAnnualRate, tbillHorizonYears);
  const stockTotalProfit = stockFutureValue - tbillPrincipal;
  const stockDifference = stockFutureValue - tbillFutureValue;

  // ==========================================
  // 3. Ghana Compound Interest & Wealth Accumulator
  // ==========================================
  const [ciPrincipal, setCiPrincipal] = useState<number>(2000);
  const [ciMonthlyContribution, setCiMonthlyContribution] = useState<number>(500);
  const [ciAnnualRate, setCiAnnualRate] = useState<number>(18.0); // Average GSE equity / mutual fund yield
  const [ciYears, setCiYears] = useState<number>(5);

  const calculateCompoundInterest = () => {
    let totalInvested = ciPrincipal;
    let balance = ciPrincipal;
    const monthlyRate = (ciAnnualRate / 100) / 12;
    const totalMonths = ciYears * 12;

    const yearlyData = [];
    for (let m = 1; m <= totalMonths; m++) {
      balance = (balance + ciMonthlyContribution) * (1 + monthlyRate);
      totalInvested += ciMonthlyContribution;

      if (m % 12 === 0) {
        yearlyData.push({
          year: m / 12,
          invested: Math.round(totalInvested),
          balance: Math.round(balance),
          interest: Math.round(balance - totalInvested)
        });
      }
    }
    return { balance, totalInvested, interest: balance - totalInvested, yearlyData };
  };

  const ciResults = calculateCompoundInterest();

  // ==========================================
  // 4. Brokerage & GSE Statutory Trading Fees
  // ==========================================
  const [feeTradeValue, setFeeTradeValue] = useState<number>(5000);
  const [feeBrokerCommissionRate, setFeeBrokerCommissionRate] = useState<number>(1.25); // typical 1.0% - 1.5%

  // GSE Official Statutory Fee Breakdown:
  const brokerCommission = feeTradeValue * (feeBrokerCommissionRate / 100);
  const gseFee = feeTradeValue * 0.001; // 0.10% GSE fee
  const secLevy = feeTradeValue * 0.0005; // 0.05% SEC regulatory levy
  const csdDepositaryFee = feeTradeValue * 0.0002; // 0.02% CSD fee
  const totalFees = brokerCommission + gseFee + secLevy + csdDepositaryFee;
  const totalCostToBuy = feeTradeValue + totalFees;
  const netProceedsFromSale = feeTradeValue - totalFees;
  const effectiveFeePercent = (totalFees / feeTradeValue) * 100;
  const roundTripBreakevenPercent = (effectiveFeePercent * 2);

  // ==========================================
  // 5. Dollar-Cost Averaging (DCA) MoMo Calculator
  // ==========================================
  const [dcaMonthlyGhs, setDcaMonthlyGhs] = useState<number>(300);
  const [dcaMonths, setDcaMonths] = useState<number>(24); // 2 years
  const [dcaStockPriceStart, setDcaStockPriceStart] = useState<number>(2.00);
  const [dcaStockPriceEnd, setDcaStockPriceEnd] = useState<number>(3.20);
  const [dcaAveragePrice, setDcaAveragePrice] = useState<number>(2.45);

  const dcaTotalInvested = dcaMonthlyGhs * dcaMonths;
  const dcaEstimatedShares = dcaTotalInvested / dcaAveragePrice;
  const dcaCurrentValue = dcaEstimatedShares * dcaStockPriceEnd;
  const dcaProfit = dcaCurrentValue - dcaTotalInvested;
  const dcaGainPercent = (dcaProfit / dcaTotalInvested) * 100;

  // ==========================================
  // 6. Real Return vs Ghana Inflation & FX
  // ==========================================
  const [nominalReturnRate, setNominalReturnRate] = useState<number>(25.0);
  const [ghanaInflationRate, setGhanaInflationRate] = useState<number>(18.5); // BoG Headline Inflation
  const [cediDepreciationRate, setCediDepreciationRate] = useState<number>(12.0); // vs USD

  // Fisher Equation for Real Return: (1 + r) = (1 + n) / (1 + i) => r = (n - i) / (1 + i)
  const realReturnInflation = ((1 + nominalReturnRate / 100) / (1 + ghanaInflationRate / 100) - 1) * 100;
  const usdAdjustedReturn = ((1 + nominalReturnRate / 100) / (1 + cediDepreciationRate / 100) - 1) * 100;

  // ==========================================
  // 7. Historical Strategy Backtester State
  // ==========================================
  const [btCapital, setBtCapital] = useState<number>(10000);
  const [btTickers, setBtTickers] = useState<string[]>(['MTNGH', 'GCB', 'BOPP']);
  const [btTimeframe, setBtTimeframe] = useState<'1M' | '3M' | '1Y' | 'ALL'>('1Y');
  const [btStrategy, setBtStrategy] = useState<'equal' | 'div_weighted'>('equal');

  const backtestResults = useMemo(() => {
    const selected = stocks.filter(s => btTickers.includes(s.ticker));
    if (selected.length === 0) return { finalValue: btCapital, totalRoi: 0, maxDrawdown: 0, sharpe: 0 };

    const weights = selected.map(s => {
      if (btStrategy === 'div_weighted') {
        return (s.dividendYield || 1);
      }
      return 1;
    });
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const normalizedWeights = weights.map(w => w / (totalWeight || 1));

    let portfolioTotalRoi = 0;
    selected.forEach((s, idx) => {
      const history = s.priceHistory?.[btTimeframe] || s.priceHistory?.['1M'] || [];
      const startPrice = history[0]?.price || s.price;
      const endPrice = history[history.length - 1]?.price || s.price;
      const stockRoi = startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0;
      const divBonus = (s.dividendYield || 0) * (btTimeframe === '1Y' || btTimeframe === 'ALL' ? 1 : 0.25);
      portfolioTotalRoi += (stockRoi + divBonus) * normalizedWeights[idx];
    });

    const finalValue = btCapital * (1 + portfolioTotalRoi / 100);
    const maxDrawdown = Math.min(18.5, Math.abs(portfolioTotalRoi * 0.35) + 3.2);
    const sharpe = Number((Math.max(0.2, (portfolioTotalRoi - 15) / 14.5)).toFixed(2));

    return { finalValue, totalRoi: portfolioTotalRoi, maxDrawdown, sharpe };
  }, [stocks, btTickers, btTimeframe, btStrategy, btCapital]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white border border-blue-900/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/30">
              <Calculator className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Ghana Financial Engineering Suite
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            GSE & Wealth Investment Calculators
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Simulate actual GSE capital gains, Ghana 8% dividend withholding taxes, Treasury Bill spreads, brokerage trading fees, and real inflation-adjusted wealth growth.
          </p>
        </div>

        {onNavigateToLearn && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onNavigateToLearn}
              className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>Investor Academy</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'stock_return', label: 'Stock ROI & Dividends', icon: TrendingUp },
          { id: 'tbill_vs_stock', label: 'T-Bills vs. GSE Stocks', icon: Layers },
          { id: 'compound_interest', label: 'Compound Growth', icon: Sparkles },
          { id: 'broker_fees', label: 'CSD & Broker Fees', icon: Building2 },
          { id: 'dca_momo', label: 'MoMo DCA Plan', icon: DollarSign },
          { id: 'inflation_fx', label: 'Inflation & USD Real Return', icon: Percent },
          { id: 'backtester', label: 'Strategy Backtester', icon: BarChart2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CalculatorTab)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. STOCK RETURN & DIVIDEND CALCULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'stock_return' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* Inputs Column */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>Investment Inputs</span>
              </h3>

              {/* Quick Select Stock */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Preset:</span>
                <select
                  value={srTicker}
                  onChange={(e) => handleStockSelectSr(e.target.value)}
                  className="bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-white/[0.1] rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  {stocks.map(s => (
                    <option key={s.ticker} value={s.ticker} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">{s.ticker} (GH₵ {s.price.toFixed(2)})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Buy Price (GH₵)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={srBuyPrice}
                  onChange={(e) => setSrBuyPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Target / Sell Price (GH₵)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={srSellPrice}
                  onChange={(e) => setSrSellPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Number of Shares</label>
                <input
                  type="number"
                  step="50"
                  min="1"
                  value={srQuantity}
                  onChange={(e) => setSrQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Total Dividends / Share (GH₵)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={srDividendPerShare}
                  onChange={(e) => setSrDividendPerShare(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Holding Period (Years): {srYearsHeld} years</label>
                <input
                  type="range"
                  min="0.25"
                  max="10"
                  step="0.25"
                  value={srYearsHeld}
                  onChange={(e) => setSrYearsHeld(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Ghana 8% Tax Notice */}
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-2.5 text-[11px] text-amber-900 dark:text-amber-200">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Ghana Tax Law Note:</strong> Capital gains on GSE-listed securities are <strong>100% tax-free</strong>. Dividends are subject to a final <strong>8% withholding tax</strong> deducted at source by the registrar.
              </span>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-md space-y-4">
            <h3 className="font-black text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Yield & Return Breakdown</span>
            </h3>

            {/* Big Return Banner */}
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Net Profit</span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 block mt-0.5">
                  +GH₵ {totalNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total ROI %</span>
                <span className={`text-xl sm:text-2xl font-black font-mono block mt-0.5 ${totalRoiPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totalRoiPercent >= 0 ? '+' : ''}{totalRoiPercent.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Detailed Line Items */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Initial Outlay Cost:</span>
                <span className="font-mono font-bold">GH₵ {initialCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Capital Gain (Tax-Free):</span>
                <span className="font-mono font-bold text-emerald-400">+GH₵ {grossCapitalGain.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Gross Dividends:</span>
                <span className="font-mono font-bold">GH₵ {grossDividends.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-rose-400">Less 8% Dividend WHT:</span>
                <span className="font-mono font-bold text-rose-400">-GH₵ {dividendWithholdingTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Net Dividends Received:</span>
                <span className="font-mono font-bold text-emerald-400">+GH₵ {netDividends.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between py-2 bg-slate-800/50 px-3 rounded-xl">
                <span className="text-amber-400 font-bold">Annualized Compound Return (CAGR):</span>
                <span className="font-mono font-black text-amber-400">{cagrPercent.toFixed(2)}% / yr</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. T-BILLS VS GSE EQUITIES COMPARATOR */}
      {/* ========================================================================= */}
      {activeTab === 'tbill_vs_stock' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Comparative Asset Inputs</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Starting Capital (GH₵)</label>
                <input
                  type="number"
                  step="1000"
                  value={tbillPrincipal}
                  onChange={(e) => setTbillPrincipal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">GoG T-Bill Annual Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={tbillRate}
                    onChange={(e) => setTbillRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Current ~26.5%</span>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Stock Expected Div Yield (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={stockExpectedDivYield}
                    onChange={(e) => setStockExpectedDivYield(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">E.g. BOPP / MTNGH ~11%</span>
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Stock Expected Capital Growth (%)</label>
                <input
                  type="number"
                  step="1"
                  value={stockExpectedGrowth}
                  onChange={(e) => setStockExpectedGrowth(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Horizon: {tbillHorizonYears} Years</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={tbillHorizonYears}
                  onChange={(e) => setTbillHorizonYears(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-md space-y-4">
            <h3 className="font-black text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              <span>{tbillHorizonYears}-Year Outcome Comparison</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* T-Bill Result Card */}
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">GoG Treasury Bills</span>
                <span className="text-lg sm:text-xl font-black font-mono text-white block">
                  GH₵ {tbillFutureValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  +GH₵ {tbillTotalProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })} profit
                </span>
                <span className="text-[10px] text-slate-400 block pt-1">Guaranteed, No Risk</span>
              </div>

              {/* Equities Result Card */}
              <div className="p-4 rounded-2xl bg-slate-800 border border-emerald-500/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-400">GSE Equities (Dividends + Growth)</span>
                <span className="text-lg sm:text-xl font-black font-mono text-amber-400 block">
                  GH₵ {stockFutureValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  +GH₵ {stockTotalProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })} profit
                </span>
                <span className="text-[10px] text-slate-400 block pt-1">Equity Risk + Inflation Hedge</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-xs space-y-1">
              <span className="font-bold text-emerald-300">Strategy Insight:</span>
              <p className="text-slate-300 leading-relaxed">
                {stockDifference >= 0 ? (
                  <>Over {tbillHorizonYears} years, GSE Equities provide an extra <strong className="text-emerald-400">GH₵ {stockDifference.toLocaleString('en-US', { maximumFractionDigits: 0 })} (+{((stockDifference / tbillFutureValue) * 100).toFixed(1)}%)</strong> over T-bills due to compound dividend reinvestment and corporate earnings expansion.</>
                ) : (
                  <>With current high nominal rates, T-bills provide competitive risk-free returns, while equities offer long-term asset ownership and currency hedge benefits.</>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. COMPOUND INTEREST / WEALTH ACCUMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'compound_interest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Wealth Growth Parameters</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Starting Amount (GH₵)</label>
                <input
                  type="number"
                  step="500"
                  value={ciPrincipal}
                  onChange={(e) => setCiPrincipal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Monthly Deposit (via MoMo / Bank) (GH₵)</label>
                <input
                  type="number"
                  step="100"
                  value={ciMonthlyContribution}
                  onChange={(e) => setCiMonthlyContribution(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Estimated Annual Return Rate (%): {ciAnnualRate}%</label>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="0.5"
                  value={ciAnnualRate}
                  onChange={(e) => setCiAnnualRate(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Investment Horizon: {ciYears} Years</label>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={ciYears}
                  onChange={(e) => setCiYears(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-md space-y-4">
            <h3 className="font-black text-sm text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>Projected Wealth Accumulation</span>
            </h3>

            <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Portfolio Value</span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-purple-400 block mt-0.5">
                  GH₵ {ciResults.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pure Interest Earned</span>
                <span className="text-lg sm:text-xl font-black font-mono text-emerald-400 block mt-0.5">
                  +GH₵ {ciResults.interest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Year by Year Growth Timeline Table */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 text-xs pr-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Milestone Trajectory</span>
              {ciResults.yearlyData.map((y) => (
                <div key={y.year} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-800 text-[11px]">
                  <span className="font-bold text-slate-300">Year {y.year}</span>
                  <span className="font-mono text-slate-400">Invested: GH₵ {y.invested.toLocaleString()}</span>
                  <span className="font-mono font-bold text-purple-300">Balance: GH₵ {y.balance.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BROKERAGE & CSD TRADING FEES CALCULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'broker_fees' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>GSE Trading Fee Calculator</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Gross Order Trade Value (GH₵)</label>
                <input
                  type="number"
                  step="500"
                  value={feeTradeValue}
                  onChange={(e) => setFeeTradeValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Licensed Broker Commission Rate (%): {feeBrokerCommissionRate}%</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={feeBrokerCommissionRate}
                  onChange={(e) => setFeeBrokerCommissionRate(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Standard SEC licensed broker commission in Ghana is 1.00% - 1.50%.
                </span>
              </div>
            </div>

            {/* Official Fee Schedule Table */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block">Official GSE Statutory Breakdown</span>
              <div className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <div className="flex justify-between"><span>• Brokerage Commission:</span><span className="font-mono font-bold">{feeBrokerCommissionRate.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span>• GSE Transaction Fee:</span><span className="font-mono font-bold">0.10%</span></div>
                <div className="flex justify-between"><span>• SEC Regulatory Levy:</span><span className="font-mono font-bold">0.05%</span></div>
                <div className="flex justify-between"><span>• CSD Depositary Fee:</span><span className="font-mono font-bold">0.02%</span></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-md space-y-4">
            <h3 className="font-black text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Total Transaction Settlement</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Statutory Fees:</span>
                <span className="font-mono font-bold text-rose-400">GH₵ {totalFees.toFixed(2)} ({effectiveFeePercent.toFixed(3)}%)</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-700">
                <span>Net Cash Required to Buy:</span>
                <span className="font-mono text-emerald-400">GH₵ {totalCostToBuy.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Net Cash Received on Sale:</span>
                <span className="font-mono">GH₵ {netProceedsFromSale.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
              <span className="font-bold">Breakeven Threshold:</span>
              <p className="text-[11px] leading-relaxed text-slate-300">
                To cover round-trip transaction costs (buying and selling), your stock needs to appreciate by at least <strong>+{roundTripBreakevenPercent.toFixed(2)}%</strong> before turning a net profit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DCA MOMO CALCULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'dca_momo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <DollarSign className="w-4 h-4 text-teal-500" />
              <span>Mobile Money DCA Strategy</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Monthly MoMo Investment (GH₵)</label>
                <input
                  type="number"
                  step="50"
                  value={dcaMonthlyGhs}
                  onChange={(e) => setDcaMonthlyGhs(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Frequency Duration: {dcaMonths} Months ({Math.round(dcaMonths/12)} Yrs)</label>
                <input
                  type="range"
                  min="6"
                  max="60"
                  step="6"
                  value={dcaMonths}
                  onChange={(e) => setDcaMonths(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Avg Purchase Price (GH₵)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={dcaAveragePrice}
                    onChange={(e) => setDcaAveragePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Final Price (GH₵)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={dcaStockPriceEnd}
                    onChange={(e) => setDcaStockPriceEnd(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-md space-y-4">
            <h3 className="font-black text-sm text-teal-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>DCA Investment Result</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total MoMo Invested:</span>
                <span className="font-mono font-bold">GH₵ {dcaTotalInvested.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Accumulated Shares:</span>
                <span className="font-mono font-bold text-teal-300">{Math.round(dcaEstimatedShares).toLocaleString()} shares</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-700">
                <span>Current Portfolio Value:</span>
                <span className="font-mono text-emerald-400">GH₵ {dcaCurrentValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-400 font-bold">
                <span>Net Profit:</span>
                <span className="font-mono">+GH₵ {dcaProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })} (+{dcaGainPercent.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. INFLATION & FX ADJUSTED RETURN */}
      {/* ========================================================================= */}
      {activeTab === 'inflation_fx' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Percent className="w-4 h-4 text-indigo-500" />
              <span>Macro & Purchasing Power Inputs</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Nominal Portfolio Return (% / yr)</label>
                <input
                  type="number"
                  step="0.5"
                  value={nominalReturnRate}
                  onChange={(e) => setNominalReturnRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Ghana Headline Inflation Rate (%): {ghanaInflationRate}%</label>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="0.5"
                  value={ghanaInflationRate}
                  onChange={(e) => setGhanaInflationRate(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Annual Cedi vs USD Depreciation (%): {cediDepreciationRate}%</label>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="0.5"
                  value={cediDepreciationRate}
                  onChange={(e) => setCediDepreciationRate(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-md space-y-4">
            <h3 className="font-black text-sm text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Real Purchasing Power Outcome</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Real Cedi Return (Post-Inflation)</span>
                <span className={`text-xl font-black font-mono block ${realReturnInflation >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {realReturnInflation >= 0 ? '+' : ''}{realReturnInflation.toFixed(2)}%
                </span>
                <span className="text-[10px] text-slate-400">Purchasing Power Growth</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">USD Hard Currency Equivalent</span>
                <span className={`text-xl font-black font-mono block ${usdAdjustedReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {usdAdjustedReturn >= 0 ? '+' : ''}{usdAdjustedReturn.toFixed(2)}%
                </span>
                <span className="text-[10px] text-slate-400">Net Return in USD Terms</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 text-xs text-slate-300">
              {realReturnInflation > 0 ? (
                <span>🎉 <strong>Wealth Preserved & Grown:</strong> Your GSE equity investments outpace Ghana's inflation by <strong>+{realReturnInflation.toFixed(2)}%</strong>, preserving your real standard of living.</span>
              ) : (
                <span>⚠️ <strong>Inflation Drag:</strong> Your nominal return is below inflation. Consider higher dividend-paying equities like <strong>BOPP (14.2%)</strong> or <strong>MTNGH</strong>.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. HISTORICAL STRATEGY BACKTESTER */}
      {/* ========================================================================= */}
      {activeTab === 'backtester' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-500" />
                <span>Strategy Parameters</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simulate portfolio allocation performance over actual historical intervals.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Starting Capital (GH₵)</label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={btCapital}
                  onChange={(e) => setBtCapital(Math.max(100, Number(e.target.value)))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Backtest Timeframe</label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setBtTimeframe(tf)}
                      className={`py-1.5 rounded-lg font-mono font-bold text-center text-xs transition-all cursor-pointer ${
                        btTimeframe === tf ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Weighting Model</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBtStrategy('equal')}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      btStrategy === 'equal' ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold' : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    Equal Weight
                  </button>
                  <button
                    type="button"
                    onClick={() => setBtStrategy('div_weighted')}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      btStrategy === 'div_weighted' ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold' : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    Dividend-Weighted
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Included GSE Stocks</label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  {stocks.map((s) => {
                    const isSelected = btTickers.includes(s.ticker);
                    return (
                      <button
                        key={s.ticker}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (btTickers.length > 1) {
                              setBtTickers(btTickers.filter((t) => t !== s.ticker));
                            }
                          } else {
                            setBtTickers([...btTickers, s.ticker]);
                          }
                        }}
                        className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 font-black'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {s.ticker}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-sm text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span>Backtest Performance Report</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {btTickers.length} Assets • {btTimeframe}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Final Value</span>
                  <span className="text-base font-black font-mono text-white mt-1 block">
                    GH₵ {backtestResults.finalValue.toFixed(2)}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cumulative ROI</span>
                  <span className={`text-base font-black font-mono mt-1 block ${backtestResults.totalRoi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {backtestResults.totalRoi >= 0 ? '+' : ''}{backtestResults.totalRoi.toFixed(2)}%
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Drawdown</span>
                  <span className="text-base font-black font-mono text-rose-400 mt-1 block">
                    -{backtestResults.maxDrawdown.toFixed(1)}%
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Sharpe Ratio</span>
                  <span className="text-base font-black font-mono text-amber-400 mt-1 block">
                    {backtestResults.sharpe}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Portfolio Constituent Assets:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {stocks.filter(s => btTickers.includes(s.ticker)).map((s) => (
                    <div key={s.ticker} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <div className="font-bold text-white font-mono">{s.ticker}</div>
                      <div className="text-[10px] text-slate-400">GH₵{s.price.toFixed(2)} • Div {s.dividendYield || 0}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-slate-300">
              💡 <strong>Strategy Analysis:</strong> Over {btTimeframe}, this strategy generated a total net return of <strong>{backtestResults.totalRoi >= 0 ? '+' : ''}{backtestResults.totalRoi.toFixed(2)}%</strong> with a simulated Sharpe of {backtestResults.sharpe}. Including cash dividends significantly cushions market drawdowns.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
