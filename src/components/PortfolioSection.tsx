import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Upload, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Calendar, 
  DollarSign, 
  Edit3, 
  Trash2, 
  Sparkles, 
  PieChart, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  Eye, 
  Clock, 
  Layers, 
  AlertCircle,
  HelpCircle,
  PiggyBank,
  Download,
  Check,
  Printer,
  FileSpreadsheet,
  Target,
  Percent,
  CheckCircle2,
  X
} from 'lucide-react';
import { Stock, PortfolioHolding, FinancialGoal, UserProfile } from '../types';
import { StockLogo } from './StockLogo';
import { BankStatementView } from './BankStatementView';
import { printGhanaTaxCertificate } from '../utils/printTaxCertificate';

interface PortfolioSectionProps {
  holdings: PortfolioHolding[];
  stocks: Stock[];
  currency: 'GHS' | 'USD';
  exchangeRateUsd: number;
  userProfile?: UserProfile | null;
  onAddNewHolding: (preselectedTicker?: string) => void;
  onEditHolding: (holding: PortfolioHolding) => void;
  onDeleteHolding: (id: string) => void;
  onSelectStock: (stock: Stock) => void;
  onViewReceipt: (holding: PortfolioHolding) => void;
  onLoadSamplePortfolio: () => void;
  onOpenJargon: (jargonId: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  holdings,
  stocks,
  currency,
  exchangeRateUsd,
  userProfile,
  onAddNewHolding,
  onEditHolding,
  onDeleteHolding,
  onSelectStock,
  onViewReceipt,
  onLoadSamplePortfolio,
  onOpenJargon
}) => {
  const [holdingSearch, setHoldingSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'value' | 'gain' | 'date' | 'name'>('value');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedSuccess, setExportedSuccess] = useState<boolean>(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState<boolean>(false);
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState<boolean>(false);
  const [isStatementOpen, setIsStatementOpen] = useState<boolean>(false);
  const [statementMode, setStatementMode] = useState<'portfolio' | 'single'>('portfolio');
  const [selectedSingleHolding, setSelectedSingleHolding] = useState<PortfolioHolding | null>(null);
  const [activeGoalTab, setActiveGoalTab] = useState<'Retirement' | 'RealEstate' | 'PassiveIncome'>('PassiveIncome');

  // Compute portfolio aggregates
  let totalCostGhs = 0;
  let totalCurrentValueGhs = 0;
  let totalTodayChangeGhs = 0;
  let totalAnnualDividendGhs = 0;
  const sectorAllocationMap: Record<string, number> = {};

  const holdingDetails = holdings.map((holding) => {
    const stock = stocks.find((s) => s.ticker === holding.ticker);
    const currentPrice = stock?.price ?? holding.buyPrice;
    const todayChangePerShare = stock?.change ?? 0;
    const costBasis = holding.sharesCount * holding.buyPrice;
    const currentValue = holding.sharesCount * currentPrice;
    const totalGain = currentValue - costBasis;
    const totalGainPct = costBasis > 0 ? (totalGain / costBasis) * 100 : 0;
    const todayGain = holding.sharesCount * todayChangePerShare;
    const annualDividend = stock?.dividendAmount ? holding.sharesCount * stock.dividendAmount : 0;
    const sector = stock?.sector || 'Other';

    totalCostGhs += costBasis;
    totalCurrentValueGhs += currentValue;
    totalTodayChangeGhs += todayGain;
    totalAnnualDividendGhs += annualDividend;

    sectorAllocationMap[sector] = (sectorAllocationMap[sector] || 0) + currentValue;

    return {
      ...holding,
      stock,
      currentPrice,
      costBasis,
      currentValue,
      totalGain,
      totalGainPct,
      todayGain,
      annualDividend,
      sector
    };
  });

  const totalGainGhs = totalCurrentValueGhs - totalCostGhs;
  const totalGainPct = totalCostGhs > 0 ? (totalGainGhs / totalCostGhs) * 100 : 0;
  const avgDividendYield = totalCurrentValueGhs > 0 ? (totalAnnualDividendGhs / totalCurrentValueGhs) * 100 : 0;

  // AI Portfolio Health Score Algorithm
  const numSectors = Object.keys(sectorAllocationMap).length;
  let maxHoldingPct = 0;
  holdingDetails.forEach(h => {
    const pct = totalCurrentValueGhs > 0 ? (h.currentValue / totalCurrentValueGhs) * 100 : 0;
    if (pct > maxHoldingPct) maxHoldingPct = pct;
  });

  let healthScore = 50;
  if (holdings.length >= 3) healthScore += 15;
  if (numSectors >= 3) healthScore += 20;
  else if (numSectors === 2) healthScore += 10;
  if (avgDividendYield >= 5.0) healthScore += 15;
  if (maxHoldingPct > 55) healthScore -= 15; // concentration penalty

  healthScore = Math.max(20, Math.min(98, healthScore));
  let healthGrade = 'B+';
  if (healthScore >= 90) healthGrade = 'A+';
  else if (healthScore >= 80) healthGrade = 'A';
  else if (healthScore >= 70) healthGrade = 'B';
  else if (healthScore >= 55) healthGrade = 'C';
  else healthGrade = 'D';

  // Currency helpers
  const formatMoney = (amountGhs: number) => {
    if (currency === 'USD') {
      const usd = amountGhs / exchangeRateUsd;
      return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `GH₵ ${amountGhs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Export Portfolio as Printable Bank Statement (ISO A4 PDF)
  const handleExportPDF = () => {
    if (holdings.length === 0) {
      alert('Your portfolio has no holdings to export yet. Please add a stock holding first.');
      return;
    }
    setStatementMode('portfolio');
    setSelectedSingleHolding(null);
    setIsStatementOpen(true);
  };

  // Export Portfolio as CSV
  const handleExportCSV = () => {
    if (holdings.length === 0) {
      alert('Your portfolio has no holdings to export yet. Please add a stock holding first.');
      return;
    }

    setIsExporting(true);

    try {
      const headers = [
        'Ticker',
        'Stock Name',
        'Sector',
        'Shares Count',
        'Buy Price (GHS)',
        'Current Price (GHS)',
        'Cost Basis (GHS)',
        'Current Valuation (GHS)',
        'Unrealized Gain/Loss (GHS)',
        'Gain/Loss (%)',
        'Purchase Date',
        'Broker',
        'Est. Annual Dividend (GHS)',
        'Notes',
        'Receipt Attached'
      ];

      const escapeCsv = (str: string | number | undefined | null) => {
        if (str === undefined || str === null) return '""';
        const stringVal = String(str).replace(/"/g, '""');
        return `"${stringVal}"`;
      };

      const rows = holdingDetails.map((h) => {
        return [
          escapeCsv(h.ticker),
          escapeCsv(h.stockName),
          escapeCsv(h.sector),
          h.sharesCount,
          h.buyPrice.toFixed(2),
          h.currentPrice.toFixed(2),
          h.costBasis.toFixed(2),
          h.currentValue.toFixed(2),
          h.totalGain.toFixed(2),
          escapeCsv(`${h.totalGainPct >= 0 ? '+' : ''}${h.totalGainPct.toFixed(2)}%`),
          escapeCsv(h.startDate),
          escapeCsv(h.brokerName || 'N/A'),
          h.annualDividend.toFixed(2),
          escapeCsv(h.notes || ''),
          h.receipt ? '"Yes"' : '"No"'
        ].join(',');
      });

      // Include summary rows at the bottom
      const summaryHeader = '\n"--- PORTFOLIO SUMMARY ---",,,,,,,,,,,,,,';
      const summaryRow1 = `"Total Portfolio Valuation (GHS)",,,,,,"${totalCurrentValueGhs.toFixed(2)}",,,,,,,,`;
      const summaryRow2 = `"Total Cost Basis (GHS)",,,,,,"${totalCostGhs.toFixed(2)}",,,,,,,,`;
      const summaryRow3 = `"Total Unrealized Gain/Loss (GHS)",,,,,,,,"${totalGainGhs.toFixed(2)}","${totalGainPct.toFixed(2)}%",,,,,,`;
      const summaryRow4 = `"Est. Total Annual Dividend (GHS)",,,,,,,,,,,,,"${totalAnnualDividendGhs.toFixed(2)}",,`;

      const csvContent = [headers.join(','), ...rows, summaryHeader, summaryRow1, summaryRow2, summaryRow3, summaryRow4].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.setAttribute('href', url);
      link.setAttribute('download', `GSE_Portfolio_Holdings_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportedSuccess(true);
      setTimeout(() => setExportedSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Filter & sort holdings
  const filteredHoldings = holdingDetails.filter((h) => {
    if (!holdingSearch.trim()) return true;
    const q = holdingSearch.toLowerCase().trim();
    return (
      h.ticker.toLowerCase().includes(q) ||
      h.stockName.toLowerCase().includes(q) ||
      h.sector.toLowerCase().includes(q) ||
      (h.brokerName && h.brokerName.toLowerCase().includes(q))
    );
  });

  filteredHoldings.sort((a, b) => {
    if (sortBy === 'value') return b.currentValue - a.currentValue;
    if (sortBy === 'gain') return b.totalGainPct - a.totalGainPct;
    if (sortBy === 'date') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    if (sortBy === 'name') return a.ticker.localeCompare(b.ticker);
    return 0;
  });

  // Calculate duration helper
  const getHoldingDuration = (startDateStr: string) => {
    if (!startDateStr) return '';
    const start = new Date(startDateStr);
    const now = new Date();
    const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (diffMonths < 1) return 'Bought recently';
    if (diffMonths < 12) return `${diffMonths} mo held`;
    const years = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}m held` : `${years}y held`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Portfolio Overview Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 sm:space-y-6">
          {/* Top Title & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 sm:p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                  My GSE Portfolio
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                  {holdings.length} {holdings.length === 1 ? 'Holding' : 'Holdings'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Track real-time valuations, capital gains, dividend cash flow & broker PDF contract notes
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full flex-nowrap sm:flex-wrap">
              {/* Export Portfolio as PDF */}
              <button
                id="portfolio-export-pdf-btn"
                onClick={handleExportPDF}
                disabled={holdings.length === 0}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                title="Export / Print official portfolio statement as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print / PDF</span>
              </button>

              {/* Tax Report */}
              <button
                id="portfolio-tax-report-btn"
                onClick={() => setIsTaxModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                title="Capital Gains 0% Exemption & 8% Withholding Tax Estimation"
              >
                <Percent className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tax Estimation</span>
              </button>

              {/* AI Financial Goals Planner */}
              <button
                id="portfolio-goals-btn"
                onClick={() => setIsGoalsModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                title="AI Goal Allocation & Milestone Tracker"
              >
                <Target className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Goals</span>
              </button>

              {/* Export Portfolio as CSV Button */}
              <button
                id="portfolio-export-csv-btn"
                onClick={handleExportCSV}
                disabled={isExporting || holdings.length === 0}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  exportedSuccess
                    ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-400/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
                title="Export entire portfolio holdings and metrics as a CSV spreadsheet"
              >
                {exportedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>CSV Done!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>CSV</span>
                  </>
                )}
              </button>

              <button
                id="portfolio-add-holding-btn"
                onClick={() => onAddNewHolding()}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Holding</span>
              </button>
            </div>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Portfolio Value */}
            <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Total Portfolio Value</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 font-mono text-slate-300">
                  {currency}
                </span>
              </div>
              <div className="font-mono font-black text-xl sm:text-2xl text-white tracking-tight">
                {formatMoney(totalCurrentValueGhs)}
              </div>
              {currency === 'GHS' && exchangeRateUsd > 0 && (
                <div className="text-[11px] text-slate-400 font-mono">
                  ≈ ${(totalCurrentValueGhs / exchangeRateUsd).toFixed(2)} USD
                </div>
              )}
            </div>

            {/* Total Invested (Cost Basis) */}
            <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700/80 space-y-1">
              <span className="text-xs text-slate-400 font-medium block">Total Cost Basis</span>
              <div className="font-mono font-black text-xl sm:text-2xl text-slate-200 tracking-tight">
                {formatMoney(totalCostGhs)}
              </div>
              <div className="text-[11px] text-slate-400">
                Principal invested capital
              </div>
            </div>

            {/* Total Profit / Loss */}
            <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700/80 space-y-1">
              <span className="text-xs text-slate-400 font-medium block">Total Capital Gain/Loss</span>
              <div className={`font-mono font-black text-xl sm:text-2xl tracking-tight flex items-center gap-1 ${
                totalGainGhs >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {totalGainGhs >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                <span>
                  {totalGainGhs >= 0 ? `+${formatMoney(totalGainGhs)}` : `-${formatMoney(Math.abs(totalGainGhs))}`}
                </span>
              </div>
              <div className="text-[11px] font-mono font-bold">
                <span className={`px-1.5 py-0.5 rounded ${
                  totalGainPct >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {totalGainPct >= 0 ? `+${totalGainPct.toFixed(2)}%` : `${totalGainPct.toFixed(2)}%`} ROI
                </span>
              </div>
            </div>

            {/* Annual Dividend Income */}
            <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Est. Annual Dividends</span>
                <PiggyBank className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="font-mono font-black text-xl sm:text-2xl text-emerald-400 tracking-tight">
                {formatMoney(totalAnnualDividendGhs)}
                <span className="text-xs text-slate-400 font-normal"> /yr</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Avg Yield: <strong className="text-emerald-300">{avgDividendYield.toFixed(1)}%</strong>
              </div>
            </div>
          </div>

          {/* Sector Allocation Progress Bar */}
          {totalCurrentValueGhs > 0 && Object.keys(sectorAllocationMap).length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Sector Diversification
                </span>
                <span className="text-[11px]">
                  {Object.keys(sectorAllocationMap).length} active GSE sectors
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                {Object.entries(sectorAllocationMap).map(([sector, val], idx) => {
                  const pct = (val / totalCurrentValueGhs) * 100;
                  const colors = [
                    'bg-amber-500',
                    'bg-emerald-500',
                    'bg-blue-500',
                    'bg-purple-500',
                    'bg-rose-500',
                    'bg-cyan-500'
                  ];
                  const color = colors[idx % colors.length];
                  return (
                    <div
                      key={sector}
                      style={{ width: `${pct}%` }}
                      className={`${color} h-full transition-all duration-500`}
                      title={`${sector}: ${pct.toFixed(1)}% (${formatMoney(val)})`}
                    />
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 flex-wrap pt-1 text-[11px] text-slate-300">
                {Object.entries(sectorAllocationMap).map(([sector, val], idx) => {
                  const pct = (val / totalCurrentValueGhs) * 100;
                  const dotColors = [
                    'bg-amber-500',
                    'bg-emerald-500',
                    'bg-blue-500',
                    'bg-purple-500',
                    'bg-rose-500',
                    'bg-cyan-500'
                  ];
                  return (
                    <div key={sector} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${dotColors[idx % dotColors.length]}`} />
                      <span>{sector}:</span>
                      <span className="font-bold text-white font-mono">{pct.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Portfolio Health Diagnostics & Stress Test Banner */}
      {holdings.length > 0 && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    AI Portfolio Health & Risk Diagnostics
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Smart Audit
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time algorithmic assessment of diversification, dividend sustainability & volatility
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Health Score</span>
                <span className="text-xl font-black font-mono text-purple-400">
                  {healthScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </span>
              </div>
              <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${
                healthGrade === 'A+' ? 'bg-emerald-500 text-slate-950' :
                healthGrade === 'A' ? 'bg-cyan-500 text-slate-950' :
                healthGrade === 'B+' || healthGrade === 'B' ? 'bg-blue-500 text-white' :
                'bg-amber-500 text-slate-950'
              }`}>
                Grade {healthGrade}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Sector Diversification</span>
              <span className="font-mono font-bold text-white text-sm">
                {numSectors} Active Sectors ({numSectors >= 3 ? '✅ Optimal' : '⚠️ Concentration Risk'})
              </span>
              <p className="text-[10px] text-slate-400">
                {numSectors < 3 ? 'Consider adding Financials or Telecom to spread risk.' : 'Well spread across major GSE industries.'}
              </p>
            </div>

            <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Single Asset Concentration</span>
              <span className="font-mono font-bold text-white text-sm">
                Max {maxHoldingPct.toFixed(1)}% ({maxHoldingPct <= 45 ? '✅ Balanced' : '⚠️ High'})
              </span>
              <p className="text-[10px] text-slate-400">
                {maxHoldingPct > 50 ? 'Top holding exceeds 50% of portfolio value.' : 'No single equity dominates over 50%.'}
              </p>
            </div>

            <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Dividend Cash Flow Engine</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {avgDividendYield.toFixed(1)}% Avg Yield ({avgDividendYield >= 5 ? '✅ Strong' : 'ℹ️ Moderate'})
              </span>
              <p className="text-[10px] text-slate-400">
                Generates estimated {formatMoney(totalAnnualDividendGhs / 12)} per month in passive yield.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Holdings List Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-4 transition-colors">
        {/* Controls Bar: Search, Sort, Counts & Export */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span>My Holdings</span>
              <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-mono font-bold">
                {filteredHoldings.length}
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search filter */}
            <input
              type="text"
              placeholder="Search holding or broker..."
              value={holdingSearch}
              onChange={(e) => setHoldingSearch(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'value' | 'gain' | 'date' | 'name')}
              className="px-3 py-1.5 bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-white/[0.1] rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="value" className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">Highest Total Value</option>
              <option value="gain" className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">Highest % Gain/Loss</option>
              <option value="date" className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">Newest Purchase Date</option>
              <option value="name" className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">Stock Ticker (A-Z)</option>
            </select>

            {/* Secondary Export Button in controls bar */}
            {holdings.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Export as CSV"
              >
                <Download className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Holdings Cards / List */}
        {filteredHoldings.length === 0 ? (
          <div className="py-12 px-4 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {holdingSearch ? 'No matching holdings found' : 'Your Portfolio is Empty'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {holdingSearch
                  ? `No positions matched "${holdingSearch}". Try searching by ticker like MTNGH or GCB.`
                  : 'Start tracking your Ghana Stock Exchange investments. Manually enter your shares with buy price and start date, or upload your broker PDF contract note.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                id="empty-add-holding-btn"
                onClick={() => onAddNewHolding()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log First Stock Purchase</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHoldings.map((h) => {
              const isProfit = h.totalGain >= 0;
              return (
                <div
                  key={h.id}
                  className="bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all space-y-3"
                >
                  {/* Top line: Stock Identity, Sector, Broker, Start Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => h.stock && onSelectStock(h.stock)}
                    >
                      <StockLogo
                        ticker={h.ticker}
                        name={h.stockName}
                        sector={h.sector}
                        size={44}
                        className="rounded-2xl shrink-0 group-hover:scale-105 transition-transform shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {h.stockName}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {h.sector}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap mt-0.5">
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                            <span>Purchased: {h.startDate}</span>
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            {getHoldingDuration(h.startDate)}
                          </span>
                          {h.brokerName && (
                            <>
                              <span className="text-slate-300 dark:text-slate-700">•</span>
                              <span className="text-slate-600 dark:text-slate-300">via {h.brokerName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons on card */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      {/* PDF Receipt Badge/Button */}
                      {h.receipt ? (
                        <button
                          onClick={() => onViewReceipt(h)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                          title="View attached PDF receipt"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>PDF Receipt</span>
                          <Eye className="w-3 h-3 text-emerald-700 dark:text-emerald-300" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onEditHolding(h)}
                          className="px-2 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          title="Attach transaction receipt"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Attach PDF</span>
                        </button>
                      )}

                      {/* Per-Holding Bank-Grade Statement (PDF) */}
                      <button
                        onClick={() => {
                          setSelectedSingleHolding(h);
                          setStatementMode('single');
                          setIsStatementOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title={`Download official ${h.ticker} valuation statement (PDF)`}
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                        <span className="hidden md:inline">Statement</span>
                      </button>

                      {/* Edit position */}
                      <button
                        onClick={() => onEditHolding(h)}
                        className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                        title="Edit position"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete position */}
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${h.sharesCount} shares of ${h.ticker} from your portfolio?`)) {
                            onDeleteHolding(h.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors"
                        title="Delete position"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Financial Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                    {/* Shares & Buy Price */}
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Shares & Buy Price</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                        {h.sharesCount.toLocaleString()} units
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        @ {formatMoney(h.buyPrice)}
                      </span>
                    </div>

                    {/* Current Market Price */}
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Current GSE Price</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                        {formatMoney(h.currentPrice)}
                      </span>
                      {h.stock && (
                        <span className={`text-[10px] font-mono font-semibold flex items-center gap-0.5 ${
                          h.stock.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {h.stock.change >= 0 ? '+' : ''}{h.stock.change.toFixed(2)} ({h.stock.changePercent.toFixed(2)}%)
                        </span>
                      )}
                    </div>

                    {/* Cost Basis vs Valuation */}
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Valuation</span>
                      <span className="font-mono font-black text-slate-900 dark:text-white block text-xs sm:text-sm">
                        {formatMoney(h.currentValue)}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        Cost: {formatMoney(h.costBasis)}
                      </span>
                    </div>

                    {/* Profit / Loss */}
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Unrealized Profit/Loss</span>
                      <span className={`font-mono font-black block text-xs sm:text-sm flex items-center gap-0.5 ${
                        isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {isProfit ? <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> : <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />}
                        {isProfit ? `+${formatMoney(h.totalGain)}` : `-${formatMoney(Math.abs(h.totalGain))}`}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded inline-block ${
                        isProfit 
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                      }`}>
                        {isProfit ? `+${h.totalGainPct.toFixed(2)}%` : `${h.totalGainPct.toFixed(2)}%`}
                      </span>
                    </div>
                  </div>

                  {/* Notes / Footer of Card */}
                  {h.notes && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic bg-amber-500/5 dark:bg-amber-500/10 p-2 rounded-lg border border-amber-200/50 dark:border-amber-500/20">
                      Note: "{h.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Portfolio Tips & Education */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white">
              GSE Portfolio Compounding & Dividend Tips
            </h4>
            <p className="text-xs text-slate-400">
              Holding stocks like MTN Ghana, GCB, and BOPP for long term allows reinvesting dividends for compound growth.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenJargon('dividendYield')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span>Learn Dividend Strategies</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Ghana Tax Exemption & Withholding Report Modal */}
      {isTaxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Capital Gains & Dividend Tax Estimation
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Meridian Equities portfolio tax estimation summary
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTaxModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tax Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Estimated Capital Gains Tax (CGT)</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                    0.0% EXEMPT
                  </span>
                </div>
                <div className="font-mono font-black text-xl text-emerald-700 dark:text-emerald-400">
                  {formatMoney(0)} Due
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Publicly listed equity shares are treated as exempt from capital gains tax under standard market practice.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-300">Estimated Dividend Withholding Tax</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-500 text-white">
                    8.0% Estimated
                  </span>
                </div>
                <div className="font-mono font-black text-xl text-blue-700 dark:text-blue-400">
                  {formatMoney(totalAnnualDividendGhs * 0.08)}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Standard estimated rate typically deducted at source by registrars prior to distribution.
                </p>
              </div>
            </div>

            {/* Computation Statement Table */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Annual Tax Estimation Breakdown
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Total Unrealized Capital Gains:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatMoney(totalGainGhs)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Estimated Capital Gains Tax Rate:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">0.0% (Exempt Rate)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Gross Estimated Annual Dividends:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatMoney(totalAnnualDividendGhs)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Estimated Withholding Tax (8%):</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">- {formatMoney(totalAnnualDividendGhs * 0.08)}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-sm bg-white dark:bg-slate-900 px-3 rounded-xl">
                  <span className="text-slate-900 dark:text-white">Estimated Net Annual Dividend Payout:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{formatMoney(totalAnnualDividendGhs * 0.92)}</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
              Note: This computation is an informational estimation generated by Meridian Equities for personal tracking. Meridian Equities is an independent tracking platform and is not affiliated with any government, regulatory, or tax authority.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  printGhanaTaxCertificate({
                    userProfile,
                    holdings: holdingDetails,
                    totalCostGhs,
                    totalCurrentValueGhs,
                    totalGainGhs,
                    totalAnnualDividendGhs,
                    taxYear: new Date().getFullYear()
                  });
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Tax Estimation (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Financial Goals Planner Modal */}
      {isGoalsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    AI Financial Goals & Milestone Allocator
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Smart GSE stock portfolios designed to hit your life milestones
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGoalsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Goal Preset Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              {[
                { id: 'PassiveIncome', label: 'Monthly Dividend Income' },
                { id: 'RealEstate', label: 'Land in Accra (5 Yrs)' },
                { id: 'Retirement', label: 'Long-term Freedom (15 Yrs)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGoalTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    activeGoalTab === tab.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Goal Plan Content */}
            {activeGoalTab === 'PassiveIncome' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-purple-900 dark:text-purple-200">
                      Goal: {formatMoney(2500)} / month in Passive Dividend Cash
                    </h4>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      Target Capital: {formatMoney(250000)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Constructed using high-yield GSE dividend aristocracy with sustainable payout ratios.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300">
                    Recommended GSE Stock Basket:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-slate-900 dark:text-white">MTNGH (40%)</span>
                      <span className="text-[11px] text-emerald-600 font-bold">10.4% Div Yield</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-slate-900 dark:text-white">SCB (35%)</span>
                      <span className="text-[11px] text-emerald-600 font-bold">11.2% Div Yield</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-slate-900 dark:text-white">TOTAL (25%)</span>
                      <span className="text-[11px] text-emerald-600 font-bold">9.1% Div Yield</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeGoalTab === 'RealEstate' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-amber-900 dark:text-amber-200">
                      Goal: {formatMoney(150000)} Land Acquisition in Accra (5 Yrs)
                    </h4>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      Monthly SIP: {formatMoney(1850)}/mo
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Balanced growth and dividend compounding with an assumed 16.5% historical CAGR.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300">
                    Recommended GSE Stock Basket:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-slate-900 dark:text-white">MTNGH (35%)</span>
                      <span className="text-[11px] text-blue-600 font-bold">Fintech Expansion</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-slate-900 dark:text-white">GCB (35%)</span>
                      <span className="text-[11px] text-blue-600 font-bold">Retail Banking</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-slate-900 dark:text-white">BOPP (30%)</span>
                      <span className="text-[11px] text-blue-600 font-bold">Agri Export Hedge</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeGoalTab === 'Retirement' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-blue-900 dark:text-blue-200">
                      Goal: Long-Term Financial Freedom (15 Yrs)
                    </h4>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Compounded Projection: {formatMoney(850000)}+
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Diversified across 5 key GSE sectors for multi-decade inflation resilience.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300">
                    Recommended GSE Stock Basket:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-slate-900 dark:text-white">MTNGH</span>
                      <span className="text-[10px] text-slate-500">30% allocation</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-slate-900 dark:text-white">SCB / GCB</span>
                      <span className="text-[10px] text-slate-500">25% allocation</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-slate-900 dark:text-white">BOPP</span>
                      <span className="text-[10px] text-slate-500">25% allocation</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-slate-900 dark:text-white">TOTAL</span>
                      <span className="text-[10px] text-slate-500">20% allocation</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Export Goal Plan as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Bank-Grade Portfolio Valuation Statement Modal (ISO A4 PDF) */}
      <BankStatementView
        isOpen={isStatementOpen}
        onClose={() => setIsStatementOpen(false)}
        mode={statementMode}
        singleStock={
          selectedSingleHolding?.stock ||
          (selectedSingleHolding ? stocks.find((s) => s.ticker === selectedSingleHolding.ticker) : null)
        }
        singleHolding={selectedSingleHolding}
        holdings={holdings}
        stocks={stocks}
        userProfile={userProfile}
        currency={currency}
        exchangeRateUsd={exchangeRateUsd}
      />
    </div>
  );
};
