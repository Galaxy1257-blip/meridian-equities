import React, { useState } from 'react';
import { X, BookOpen, Lightbulb, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { JARGON_LIST } from '../data/jargonData';
import { JargonInfo } from '../types';

interface JargonBottomSheetProps {
  initialJargonId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JargonBottomSheet: React.FC<JargonBottomSheetProps> = ({
  initialJargonId,
  isOpen,
  onClose
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialJargonId || 'variation');

  React.useEffect(() => {
    if (initialJargonId) {
      setSelectedId(initialJargonId);
    }
  }, [initialJargonId]);

  if (!isOpen) return null;

  const currentJargon: JargonInfo = JARGON_LIST.find(j => j.id === (selectedId || initialJargonId)) || JARGON_LIST[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 p-4 sm:p-5 text-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-950/10 backdrop-blur-xs">
              <BookOpen className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-950/70 block">
                Ghana Stock Exchange Beginner's Guide
              </span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-950">
                Financial Metrics & Term Explainer
              </h2>
            </div>
          </div>

          <button
            id="jargon-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 transition-colors cursor-pointer"
            aria-label="Close explainer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Term Tabs selector */}
        <div className="bg-slate-100 dark:bg-slate-950 p-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {JARGON_LIST.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                (selectedId || currentJargon.id) === item.id
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{item.title}</span>
              <span className="text-[10px] opacity-75">({item.easyTitle})</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {/* Main Title Banner */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Easy Concept Translation</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {currentJargon.title} = <span className="text-amber-600 dark:text-amber-400">&ldquo;{currentJargon.easyTitle}&rdquo;</span>
            </h3>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
              {currentJargon.summary}
            </p>
          </div>

          {/* Direct Metric Scale & Direction Verdict Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Scale card */}
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <span className="text-[10px] font-mono font-black uppercase text-cyan-600 dark:text-cyan-400 block mb-1">
                How It Is Measured (Scale)
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {currentJargon.metricScale || 'Standard Financial Ratio'}
              </span>
            </div>

            {/* Direction rule */}
            <div className={`p-3.5 rounded-xl border ${
              currentJargon.higherOrLower === 'higher_better'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : currentJargon.higherOrLower === 'lower_better'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300'
                : currentJargon.higherOrLower === 'lower_is_safer'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300'
            }`}>
              <span className="text-[10px] font-mono font-black uppercase block mb-1">
                Is Higher Better or Lower Better?
              </span>
              <span className="text-xs font-mono font-black tracking-tight">
                {currentJargon.ruleHeadline || 'HIGHER IS GENERALLY BETTER'}
              </span>
            </div>
          </div>

          {/* Quick Answer Banner */}
          {currentJargon.quickAnswer && (
            <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-950 dark:text-amber-200">
              <div className="text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Quick Answer For Beginners</span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {currentJargon.quickAnswer}
              </p>
            </div>
          )}

          {/* Ghanaian Analogy */}
          <div className="bg-amber-500/10 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-500/20 dark:border-amber-750/30">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase mb-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Everyday Ghanaian Analogy</span>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              &ldquo;{currentJargon.analogy}&rdquo;
            </p>
          </div>

          {/* Detailed Explanation */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              How It Works in the Stock Market
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentJargon.explanation}
            </p>
          </div>

          {/* Why It Matters */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Why This Matters For Your Money</span>
            </div>
            <p className="text-sm text-emerald-950 dark:text-emerald-100 font-medium leading-relaxed">
              {currentJargon.whyItMatters}
            </p>
          </div>

          {/* Real GSE Example */}
          <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Real GSE Example
            </span>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              {currentJargon.exampleGSE}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 px-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Meridian Equities Education Hub
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
