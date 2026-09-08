import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  FileText,
  QrCode,
  Lock
} from 'lucide-react';
import { Stock, PortfolioHolding, UserProfile } from '../types';
import { StockLogo } from './StockLogo';

export interface BankStatementViewProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'portfolio' | 'single';
  singleStock?: Stock | null;
  singleHolding?: PortfolioHolding | null;
  holdings?: PortfolioHolding[];
  stocks?: Stock[];
  userProfile?: UserProfile | null;
  currency?: 'GHS' | 'USD';
  exchangeRateUsd?: number;
}

export const BankStatementView: React.FC<BankStatementViewProps> = ({
  isOpen,
  onClose,
  mode,
  singleStock,
  singleHolding,
  holdings = [],
  stocks = [],
  userProfile,
  currency = 'GHS',
  exchangeRateUsd = 15.5
}) => {
  const statementRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Real timestamp of document generation
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) + ' GMT';

  const docTimestamp = `${dateStr} • ${timeStr}`;
  const statementRefId = `TRK-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const accountHolder = userProfile?.name || 'Personal Portfolio Account';

  // Portfolio calculations
  const holdingLedger = holdings.map((h) => {
    const stock = stocks.find((s) => s.ticker === h.ticker);
    const currentPrice = stock?.price ?? h.buyPrice;
    const costBasis = h.sharesCount * h.buyPrice;
    const currentValue = h.sharesCount * currentPrice;
    const unrealizedGain = currentValue - costBasis;
    const gainPct = costBasis > 0 ? (unrealizedGain / costBasis) * 100 : 0;
    const annualDividend = stock?.dividendAmount 
      ? h.sharesCount * stock.dividendAmount 
      : (stock?.dividendYield ? (currentValue * stock.dividendYield) / 100 : 0);

    return {
      ...h,
      stock,
      currentPrice,
      costBasis,
      currentValue,
      unrealizedGain,
      gainPct,
      annualDividend,
      sector: stock?.sector || 'Diversified'
    };
  });

  const totalCost = holdingLedger.reduce((sum, h) => sum + h.costBasis, 0);
  const totalValuation = holdingLedger.reduce((sum, h) => sum + h.currentValue, 0);
  const totalGain = totalValuation - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const totalAnnualDividends = holdingLedger.reduce((sum, h) => sum + h.annualDividend, 0);

  // Single stock position math
  const singleHoldingMatch = singleHolding || (singleStock ? holdings.find(h => h.ticker === singleStock.ticker) : null);
  const singleShares = singleHoldingMatch ? singleHoldingMatch.sharesCount : 0;
  const singleBuyPrice = singleHoldingMatch ? singleHoldingMatch.buyPrice : (singleStock?.price ?? 0);
  const singleCost = singleShares * singleBuyPrice;
  const singleCurrentVal = singleShares * (singleStock?.price ?? 0);
  const singleGain = singleCurrentVal - singleCost;
  const singleGainPct = singleCost > 0 ? (singleGain / singleCost) * 100 : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Container holding controls + document */}
      <div className="w-full max-w-4xl max-h-[96vh] flex flex-col my-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900">
        
        {/* On-screen modal bar (Hidden in print) */}
        <div className="no-print bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Personal Portfolio Valuation Summary</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PRINT READY
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Informational summary for personal investment tracking, tax notes & record-keeping
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="overflow-y-auto p-3 sm:p-6 bg-slate-850 flex justify-center">
          
          {/* THE OFFICIAL PRINTABLE STATEMENT CONTAINER (Strict white paper layout) */}
          <div 
            id="meridian-printable-statement"
            ref={statementRef}
            className="w-full max-w-[210mm] bg-white text-slate-900 p-8 sm:p-12 font-sans shadow-xl text-[12px] leading-normal border border-slate-200"
            style={{ minHeight: '297mm' }}
          >
            {/* 1. APP PORTFOLIO TRACKING HEADER */}
            <div className="border-b-2 border-slate-900 pb-5 mb-6">
              <div className="flex justify-between items-start gap-4">
                {/* Left Masthead */}
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 text-cyan-400 flex items-center justify-center font-mono text-xl font-black border border-slate-800">
                      ₵
                    </div>
                    <div>
                      <h1 className="font-sans font-black text-xl tracking-tight text-slate-950 uppercase">
                        Meridian Equities
                      </h1>
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">
                        GSE Equity Portfolio Tracker • Accra, Ghana
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-3 space-y-0.5 font-mono">
                    <p>Report: <strong className="text-slate-900">Personal Portfolio Valuation & Tracking Summary</strong></p>
                    <p>Market: <strong className="text-slate-900">Ghana Stock Exchange (GSE) Listed Equities</strong></p>
                  </div>
                </div>

                {/* Right Statement Box */}
                <div className="text-right border-l-2 border-slate-200 pl-4">
                  <span className="inline-block px-2 py-0.5 bg-slate-900 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded mb-1.5">
                    {mode === 'portfolio' ? 'PERSONAL PORTFOLIO SUMMARY' : 'PERSONAL HOLDING SUMMARY'}
                  </span>
                  <div className="space-y-1 font-mono text-[10px]">
                    <p><span className="text-slate-500">Record ID:</span> <strong className="text-slate-950 font-bold">{statementRefId}</strong></p>
                    <p><span className="text-slate-500">Date Generated:</span> <strong className="text-slate-950">{dateStr}</strong></p>
                    <p><span className="text-slate-500">Time Generated:</span> <strong className="text-slate-950">{timeStr}</strong></p>
                    <p><span className="text-slate-500">Sync Status:</span> <strong className="text-emerald-700 font-bold">PORTFOLIO TRACKED</strong></p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CLIENT ACCOUNT & SUMMARY */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 font-mono text-[11px]">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Investor Name</span>
                <span className="font-bold text-slate-950 text-xs truncate block">{accountHolder}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Tracker Handle</span>
                <span className="font-bold text-slate-950">{userProfile?.handle || '@investor'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Base Reporting Currency</span>
                <span className="font-bold text-slate-950">Ghana Cedi (GH₵)</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Reference FX (USD/GHS)</span>
                <span className="font-bold text-slate-950">₵{exchangeRateUsd.toFixed(2)}</span>
              </div>
            </div>

            {/* 3. EXECUTIVE FINANCIAL BALANCES BOX */}
            {mode === 'portfolio' ? (
              <div className="border border-slate-900 rounded-lg overflow-hidden mb-6">
                <div className="bg-slate-900 text-white px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider flex justify-between">
                  <span>Portfolio Valuation Summary (Ghana Market Closes)</span>
                  <span>Reporting Period: YTD 2026</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 p-4 bg-white">
                  <div className="pr-2 pb-2 sm:pb-0">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Total Portfolio Value</span>
                    <span className="text-lg font-mono font-black text-slate-950">
                      GH₵ {totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      ≈ ${(totalValuation / exchangeRateUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </span>
                  </div>

                  <div className="sm:px-3 py-2 sm:py-0">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Capital Cost Basis</span>
                    <span className="text-lg font-mono font-bold text-slate-800">
                      GH₵ {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      Total Capital Invested
                    </span>
                  </div>

                  <div className="sm:px-3 py-2 sm:py-0">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Unrealized P&L</span>
                    <span className={`text-lg font-mono font-black ${totalGain >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {totalGain >= 0 ? '+' : ''}GH₵ {totalGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-[10px] font-mono font-bold block ${totalGain >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {totalGain >= 0 ? '+' : ''}{totalGainPct.toFixed(2)}% Cumulative Return
                    </span>
                  </div>

                  <div className="sm:pl-3 pt-2 sm:pt-0">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Est. Annual Dividends</span>
                    <span className="text-lg font-mono font-black text-emerald-800">
                      GH₵ {totalAnnualDividends.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      Net: GH₵ {(totalAnnualDividends * 0.92).toFixed(2)} (8% WHT applied)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Single Stock Valuation Summary */
              singleStock && (
                <div className="border border-slate-900 rounded-lg overflow-hidden mb-6">
                  <div className="bg-slate-900 text-white px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider flex justify-between">
                    <span>Target Equity Profile: {singleStock.name} ({singleStock.ticker})</span>
                    <span>Board: Official List (GSE)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 p-4 bg-white">
                    <div className="pr-2 pb-2 sm:pb-0">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Current Market Price</span>
                      <span className="text-xl font-mono font-black text-slate-950">
                        GH₵ {singleStock.price.toFixed(2)}
                      </span>
                      <span className={`text-[10px] font-mono font-bold block ${singleStock.change >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {singleStock.change >= 0 ? '+' : ''}{singleStock.changePercent.toFixed(2)}% Session Change
                      </span>
                    </div>

                    <div className="sm:px-3 py-2 sm:py-0">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Market Capitalization</span>
                      <span className="text-lg font-mono font-bold text-slate-800">
                        GH₵ {(singleStock.marketCap / 1000).toFixed(2)}B
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        P/E Ratio: {singleStock.peRatio}x
                      </span>
                    </div>

                    <div className="sm:px-3 py-2 sm:py-0">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Dividend Yield</span>
                      <span className="text-lg font-mono font-black text-emerald-700">
                        {singleStock.dividendYield ? `${singleStock.dividendYield}%` : 'N/A'}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        Div/Share: GH₵ {singleStock.dividendAmount?.toFixed(2) || '0.00'}
                      </span>
                    </div>

                    <div className="sm:pl-3 pt-2 sm:pt-0">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">52-Week Range</span>
                      <span className="text-sm font-mono font-bold text-slate-900 block mt-1">
                        GH₵ {singleStock.low52W.toFixed(2)} – {singleStock.high52W.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        Exchange Liquidity: {singleStock.easyToSellScore}/100
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* 4. TABULAR ASSET LEDGER */}
            {mode === 'portfolio' ? (
              <div className="mb-6">
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center justify-between">
                  <span>Audited Equity Holdings Ledger</span>
                  <span className="text-[10px] text-slate-500 font-normal">Positions: {holdingLedger.length} active holdings</span>
                </h3>

                <table className="w-full border-collapse text-[10px] font-mono">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-y border-slate-300 text-left">
                      <th className="py-2 px-2 font-bold">Ticker</th>
                      <th className="py-2 px-2 font-bold">Security Name</th>
                      <th className="py-2 px-2 font-bold">Sector</th>
                      <th className="py-2 px-2 font-bold text-right">Shares</th>
                      <th className="py-2 px-2 font-bold text-right">Avg Cost</th>
                      <th className="py-2 px-2 font-bold text-right">Market Price</th>
                      <th className="py-2 px-2 font-bold text-right">Cost Basis</th>
                      <th className="py-2 px-2 font-bold text-right">Valuation</th>
                      <th className="py-2 px-2 font-bold text-right">P&L (%)</th>
                      <th className="py-2 px-2 font-bold text-right">Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {holdingLedger.map((item) => {
                      const weightPct = totalValuation > 0 ? (item.currentValue / totalValuation) * 100 : 0;
                      const isProfit = item.unrealizedGain >= 0;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2 px-2 font-black text-slate-950">{item.ticker}</td>
                          <td className="py-2 px-2 text-slate-800 font-sans font-medium">{item.stockName}</td>
                          <td className="py-2 px-2 text-slate-500">{item.sector}</td>
                          <td className="py-2 px-2 text-right font-bold">{item.sharesCount.toLocaleString()}</td>
                          <td className="py-2 px-2 text-right">₵{item.buyPrice.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right font-bold">₵{item.currentPrice.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right">₵{item.costBasis.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right font-black">₵{item.currentValue.toFixed(2)}</td>
                          <td className={`py-2 px-2 text-right font-bold ${isProfit ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isProfit ? '+' : ''}{item.gainPct.toFixed(1)}%
                          </td>
                          <td className="py-2 px-2 text-right text-slate-600">{weightPct.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-900 bg-slate-50 font-bold">
                      <td colSpan={3} className="py-2.5 px-2 uppercase text-slate-950 font-black">
                        Total Consolidated Portfolio
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        {holdingLedger.reduce((sum, h) => sum + h.sharesCount, 0).toLocaleString()}
                      </td>
                      <td colSpan={2} className="py-2.5 px-2"></td>
                      <td className="py-2.5 px-2 text-right">
                        ₵{totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-2 text-right font-black text-slate-950">
                        ₵{totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`py-2.5 px-2 text-right ${totalGain >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {totalGain >= 0 ? '+' : ''}{totalGainPct.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-2 text-right">100.0%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              /* Single stock holding / trade ledger */
              <div className="mb-6">
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Personal Holding Position in This Asset
                </h3>
                {singleHoldingMatch ? (
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3 font-mono text-[11px]">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Shares Held</span>
                        <span className="font-black text-slate-950 text-sm">{singleShares.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Purchase Cost / Share</span>
                        <span className="font-bold text-slate-800">GH₵ {singleBuyPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Total Cost Basis</span>
                        <span className="font-bold text-slate-800">GH₵ {singleCost.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Current Position Value</span>
                        <span className="font-black text-slate-950 text-sm">GH₵ {singleCurrentVal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Unrealized P&L</span>
                        <span className={`font-bold ${singleGain >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {singleGain >= 0 ? '+' : ''}GH₵ {singleGain.toFixed(2)} ({singleGainPct.toFixed(2)}%)
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Executing Broker</span>
                        <span className="font-medium text-slate-800">{singleHoldingMatch.brokerName || 'Databank Brokerage'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Acquisition Date</span>
                        <span className="font-medium text-slate-800">{singleHoldingMatch.startDate || dateStr}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Position Status</span>
                        <span className="text-emerald-700 font-bold">ACTIVE IN PORTFOLIO</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 font-mono text-[11px] text-slate-600">
                    <p>No active holding registered in your portfolio for {singleStock?.name} ({singleStock?.ticker}). This document serves as an informational market quote summary.</p>
                  </div>
                )}
              </div>
            )}

            {/* 5. GHANA MARKET & TAX INFORMATION SCHEDULE */}
            <div className="border-t border-b border-slate-200 py-3 mb-6 font-mono text-[9px] text-slate-600 space-y-1 leading-relaxed">
              <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Ghana Market Reference & Tax Notes:
              </p>
              <p>
                • <strong>Capital Gains Tax Exemption (0.0% CGT)</strong>: Pursuant to Section 67 of the Ghana Income Tax Act, 2015 (Act 896), capital gains realized on the sale of equities listed on the Ghana Stock Exchange are legally exempt from Capital Gains Tax.
              </p>
              <p>
                • <strong>Dividend Withholding Tax (8.0% Final WHT)</strong>: Under Act 896, cash dividend distributions from GSE-listed domestic entities are subject to an 8.0% final withholding tax at payout.
              </p>
            </div>

            {/* 6. APP VERIFICATION CODE & DISCLAIMER (No fake signatures/stamps) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-2">
              <div className="font-mono text-[9px] text-slate-500">
                <p className="font-bold text-slate-900 uppercase">Personal Record ID:</p>
                <p className="tracking-widest font-black text-slate-800 text-xs mt-0.5">{statementRefId}</p>
                <p className="text-[8px] text-slate-400 mt-0.5">Generated for personal record-keeping via Meridian Equities Tracker</p>
              </div>

              <div className="text-left sm:text-right font-mono text-[9px] text-slate-500 max-w-sm">
                <p className="font-bold text-slate-800 uppercase">Informational Tracking Summary</p>
                <p className="text-[8px] text-slate-400 leading-tight mt-0.5">
                  This document is generated for personal investment tracking and record-keeping only. It is not an official legal statement, trade confirmation, or regulatory certificate issued by the Ghana Stock Exchange (GSE), Central Securities Depository (CSD), or Securities and Exchange Commission (SEC).
                </p>
              </div>
            </div>

            {/* Footer watermark note */}
            <div className="text-center text-[8px] font-mono text-slate-400 mt-6 pt-2 border-t border-slate-100">
              Generated via Meridian Equities on {docTimestamp} • For Personal Tracking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
