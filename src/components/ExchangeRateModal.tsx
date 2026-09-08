import React, { useState, useEffect } from 'react';
import { X, DollarSign, Check, RefreshCw, Radio, Sparkles, TrendingUp, Info } from 'lucide-react';

interface ExchangeRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: number;
  onSaveRate: (newRate: number) => void;
  liveRate?: number;
  isLive?: boolean;
  lastUpdated?: Date | null;
  source?: string;
  onRefreshLive?: () => void;
  isAutoSync?: boolean;
  onToggleAutoSync?: (autoSync: boolean) => void;
}

export const ExchangeRateModal: React.FC<ExchangeRateModalProps> = ({
  isOpen,
  onClose,
  currentRate,
  onSaveRate,
  liveRate = 11.36,
  isLive = true,
  lastUpdated,
  source = 'Open ER-API (Live Interbank)',
  onRefreshLive,
  isAutoSync = true,
  onToggleAutoSync
}) => {
  const [rateInput, setRateInput] = useState<string>(currentRate.toString());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    setRateInput(currentRate.toString());
  }, [currentRate, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(rateInput);
    if (!isNaN(parsed) && parsed > 0) {
      if (onToggleAutoSync && parsed !== liveRate) {
        onToggleAutoSync(false);
      }
      onSaveRate(parsed);
      onClose();
    }
  };

  const handleApplyLiveRate = () => {
    if (liveRate && liveRate > 0) {
      setRateInput(liveRate.toFixed(2));
      onSaveRate(Number(liveRate.toFixed(2)));
      if (onToggleAutoSync) {
        onToggleAutoSync(true);
      }
      onClose();
    }
  };

  const handleRefreshClick = async () => {
    if (onRefreshLive) {
      setIsRefreshing(true);
      try {
        await onRefreshLive();
      } finally {
        setTimeout(() => setIsRefreshing(false), 600);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#080E24] w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[92dvh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 dark:bg-[#040816] text-white px-3.5 sm:px-5 py-2.5 sm:py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="p-2 sm:p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm sm:text-base text-white tracking-tight truncate">USD / GHS Exchange</h3>
                <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Live
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">Accra Interbank & Mid-Market FX Telemetry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          {/* Live Rate Spotlight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-cyan-500/10 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                  Verified Market Benchmark
                </span>
              </div>
              <button
                type="button"
                onClick={handleRefreshClick}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer shadow-xs"
                title="Force refresh live FX rate"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                <span>Fetch Now</span>
              </button>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-500 dark:text-amber-400">
                  GH₵ {liveRate.toFixed(4)}
                  <span className="text-xs font-sans text-slate-500 dark:text-slate-400 ml-2 font-normal">/ 1.00 USD</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Source: {source}
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyLiveRate}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sync Live</span>
              </button>
            </div>

            {lastUpdated && (
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                <span>Last live sync: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-medium">Auto-refreshes every 5 mins</span>
              </div>
            )}
          </div>

          {/* Custom Rate Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Active Terminal Rate (1 USD in GH₵):
                </label>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Currently: <strong className="text-slate-800 dark:text-slate-200">GH₵ {currentRate.toFixed(2)}</strong>
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-black text-amber-500 text-base">GH₵</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="100"
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  className="w-full pl-14 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="11.36"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                <Info className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                <span>Adjusting this rate updates all USD portfolio conversions, dual-currency stock cards, and FX slippage analytics in real-time.</span>
              </div>
            </div>

            {/* Quick Preset Pills */}
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Quick Presets
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRateInput(liveRate.toFixed(2))}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/20 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  ⚡ Live ({liveRate.toFixed(2)})
                </button>
                <button
                  type="button"
                  onClick={() => setRateInput('12.00')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  12.00
                </button>
                <button
                  type="button"
                  onClick={() => setRateInput('15.50')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  15.50 (Historical)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/5">
              <button
                type="button"
                onClick={handleApplyLiveRate}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Use Live Rate</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Apply & Save</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
