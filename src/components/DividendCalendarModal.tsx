import React from 'react';
import { X, Calendar, PiggyBank, Clock, CheckCircle2 } from 'lucide-react';
import { Stock } from '../types';
import { StockLogo } from './StockLogo';

interface DividendCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
}

export const DividendCalendarModal: React.FC<DividendCalendarModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock
}) => {
  if (!isOpen) return null;

  const dividendStocks = stocks
    .filter(s => s.exDividendDate || (s.dividendYield && s.dividendYield > 0))
    .sort((a, b) => {
      if (!a.exDividendDate) return 1;
      if (!b.exDividendDate) return -1;
      return new Date(a.exDividendDate).getTime() - new Date(b.exDividendDate).getTime();
    });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[94dvh] sm:h-auto sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-3.5 sm:px-5 py-2.5 sm:py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="p-2 sm:p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-sm sm:text-lg text-white truncate">GSE Dividend Schedule</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">Upcoming ex-dividend dates & cash payouts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-2.5 sm:space-y-3 flex-1">
          <div className="bg-amber-500/10 dark:bg-amber-950/30 p-3 sm:p-3.5 rounded-xl border border-amber-500/20 dark:border-amber-700/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs">
              <strong>Important Rule:</strong> To receive cash dividends, you must purchase and hold the stock <strong>before</strong> the Ex-Dividend Cutoff Date!
            </p>
          </div>

          <div className="space-y-2.5">
            {dividendStocks.map((stock) => (
              <div
                key={stock.ticker}
                onClick={() => {
                  onClose();
                  onSelectStock(stock);
                }}
                className="bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-xs group"
              >
                <div className="flex items-center gap-3">
                  <StockLogo
                    ticker={stock.ticker}
                    name={stock.name}
                    sector={stock.sector}
                    size={40}
                    className="rounded-xl shrink-0 shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {stock.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Current Price: GH₵ {stock.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <PiggyBank className="w-3.5 h-3.5" />
                    <span>{stock.dividendAmount ? `GH₵ ${stock.dividendAmount.toFixed(2)}/sh` : `${(stock.dividendYield || 0).toFixed(1)}%`}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                    {stock.exDividendDate ? (
                      <span className="bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono">
                        Cutoff: {stock.exDividendDate}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">Regular Payer</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-950 p-3 px-4 sm:p-4 sm:px-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Source: Ghana Stock Exchange Filings
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
