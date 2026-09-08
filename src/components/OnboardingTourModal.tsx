import React, { useState } from 'react';
import { 
  X, ArrowRight, ArrowLeft, CheckCircle2, TrendingUp, Briefcase, 
  Newspaper, MessageSquare, Bot, Sparkles, ShieldCheck, Calendar,
  Calculator, Zap, Layers, Eye, BookOpen, Compass, ExternalLink,
  Award, Check, LayoutGrid
} from 'lucide-react';
import { MainNavTab } from '../types';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: MainNavTab) => void;
}

interface TourAnnotation {
  number: string;
  title: string;
  description: string;
  badge?: string;
}

interface TourStep {
  id: number;
  title: string;
  subtitle: string;
  targetTab: MainNavTab;
  tabLabel: string;
  visualPreview: {
    title: string;
    mockBadge: string;
    mockMetrics: { label: string; value: string; highlight?: boolean }[];
  };
  annotations: TourAnnotation[];
  keyTakeaway: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    title: 'Live GSE Floor & Ticker Ribbon',
    subtitle: 'Real-time equity quotes, daily benchmark indices & session telemetry',
    targetTab: 'home',
    tabLabel: 'Home Dashboard',
    visualPreview: {
      title: 'GHANA STOCK EXCHANGE FLOOR',
      mockBadge: 'MARKET OPEN • 11:42 GMT',
      mockMetrics: [
        { label: 'GSE-CI', value: '4,512.40 (+1.24%)', highlight: true },
        { label: 'USD / GHS', value: 'GH₵ 15.50', highlight: false },
        { label: 'COCOA SPOT', value: '$7,850/t', highlight: false }
      ]
    },
    annotations: [
      {
        number: '1',
        title: 'Official Benchmark Indices (GSE-CI & GSE-FI)',
        description: 'Track the GSE Composite Index and Financial Index with percentage shift indicators updated every session.',
        badge: 'BENCHMARKS'
      },
      {
        number: '2',
        title: 'Session GMT Clock & Trading Hours',
        description: 'Live indicator showing when the Accra trading floor is open (Monday to Friday, 10:00 AM to 3:00 PM GMT).',
        badge: 'GSE HOURS'
      },
      {
        number: '3',
        title: 'Mid-Market USD/GHS FX Rate',
        description: 'Real-time exchange rate with 1-click FX conversion calculator for diaspora and multi-currency investors.',
        badge: 'FX TELEMETRY'
      }
    ],
    keyTakeaway: 'Always verify the GMT clock and composite index direction before placing broker orders.'
  },
  {
    id: 2,
    title: 'Beginner (🌱) vs. Institutional (⚡) Modes',
    subtitle: 'Switch between everyday beginner terminology and institutional ratios',
    targetTab: 'markets',
    tabLabel: 'Stocks Explorer',
    visualPreview: {
      title: 'MTN GHANA (MTNGH) — METRIC COMPARISON',
      mockBadge: 'TERMINAL MODE SWITCH',
      mockMetrics: [
        { label: 'EASY MODE', value: 'Easy to Sell • Cash Back • Bargain', highlight: false },
        { label: 'PRO MODE', value: 'Liquidity • Div Yield • P/E Multiple', highlight: true }
      ]
    },
    annotations: [
      {
        number: '1',
        title: 'Easy Mode: Plain Everyday Language',
        description: 'Replaces confusing Wall Street acronyms with plain English: "Easy to Sell" (Liquidity), "Cash Back" (Dividend Yield), and "Bargain" (P/E).',
        badge: 'NO JARGON'
      },
      {
        number: '2',
        title: 'Pro Mode: Institutional Multiples',
        description: 'Switches to true financial ratios (P/E multiple, exact dividend yield %, 52-week High/Low range, and trading volume).',
        badge: 'PRO RATIOS'
      },
      {
        number: '3',
        title: 'Directional Guides (Higher ↑ vs. Lower ↓)',
        description: 'Visual clues tell you instantly whether a higher number is better (e.g. Dividend Yield) or lower is cheaper (e.g. P/E ratio).',
        badge: 'SMART HINTS'
      }
    ],
    keyTakeaway: 'Toggle Terminal Mode at any time from the left navigation panel or command palette (⌘K).'
  },
  {
    id: 3,
    title: 'Meridian Axis: 5-Point Quantitative Radar',
    subtitle: 'Institutional algorithmic health score rated out of 30',
    targetTab: 'markets',
    tabLabel: 'Stock Details',
    visualPreview: {
      title: 'MERIDIAN AXIS RADAR DIAGNOSTIC',
      mockBadge: 'ALGORITHMIC SCORE: 26/30',
      mockMetrics: [
        { label: 'VALUE', value: '5/6 (Very Cheap)', highlight: false },
        { label: 'DIVIDEND', value: '6/6 (High Yield)', highlight: true },
        { label: 'HEALTH', value: '5/6 (Zero Debt)', highlight: false }
      ]
    },
    annotations: [
      {
        number: '1',
        title: '5 Quantitative Pillars',
        description: 'Evaluates Value (P/E), Future Growth, Historical Performance, Balance Sheet Health, and Dividend Sustainability.',
        badge: 'QUANT MODEL'
      },
      {
        number: '2',
        title: 'Geometric Polygon Visualization',
        description: 'A wider polygon shape indicates an institutional blue-chip anchor, while an indented shape pinpoints balance sheet risk.',
        badge: 'RADAR CHART'
      },
      {
        number: '3',
        title: 'Jargon Explainer Sheet',
        description: 'Tap any (i) info badge across the terminal to pop up an everyday explanation with practical Ghanaian examples.',
        badge: 'GLOSSARY'
      }
    ],
    keyTakeaway: 'Stocks with a Meridian Axis score above 20/30 represent strong fundamental candidates for long-term holding.'
  },
  {
    id: 4,
    title: 'Position Book & Bank Statement Export',
    subtitle: 'Track cost basis vs. current valuation with clean A4 PDF statements',
    targetTab: 'portfolio',
    tabLabel: 'My Portfolio',
    visualPreview: {
      title: 'INVESTOR PORTFOLIO STATEMENT',
      mockBadge: 'TOTAL STANDING: GH₵ 28,450',
      mockMetrics: [
        { label: 'NET GAIN', value: '+GH₵ 4,210 (+17.3%)', highlight: true },
        { label: 'ANNUAL YIELD', value: 'GH₵ 2,180 (7.6%)', highlight: true },
        { label: 'HOLDINGS', value: '4 GSE Equities', highlight: false }
      ]
    },
    annotations: [
      {
        number: '1',
        title: 'Multi-Broker Logging',
        description: 'Record shares bought via Databank, IC Securities, CalBrokers, or Mobile Money with custom purchase price and notes.',
        badge: 'ALL BROKERS'
      },
      {
        number: '2',
        title: 'Automated Dividend Projection',
        description: 'Calculates your estimated monthly and annual passive cashflow based on declared corporate dividend schedules.',
        badge: 'PASSIVE CASH'
      },
      {
        number: '3',
        title: 'Clean A4 ISO Statement Export',
        description: 'Print or export a pristine, bank-grade PDF statement of your equity holdings for personal record-keeping or visa proof.',
        badge: 'A4 PDF PRINT'
      }
    ],
    keyTakeaway: 'All your portfolio data is 100% private and stored encrypted on your own device.'
  },
  {
    id: 5,
    title: 'Investor Community & Meridian AI Copilot',
    subtitle: 'Engage in multi-channel trading rooms and ask quantitative market queries',
    targetTab: 'chat',
    tabLabel: 'Investor Chat',
    visualPreview: {
      title: 'MULTI-CHANNEL INVESTOR LIVE DESK',
      mockBadge: '1,420 INVESTORS ONLINE',
      mockMetrics: [
        { label: 'CHANNELS', value: '#General, #Dividends, #Banking', highlight: false },
        { label: 'TICKER TAGS', value: '$MTNGH, $GCB, $BOPP', highlight: true },
        { label: 'SENTIMENT', value: '72% Bullish GSE Floor', highlight: true }
      ]
    },
    annotations: [
      {
        number: '1',
        title: 'Interactive Ticker Tags ($TICKER)',
        description: 'Clicking any stock tag like $MTNGH or $GCB pops up an instant live quote card without disrupting the conversation.',
        badge: 'LIVE QUOTES'
      },
      {
        number: '2',
        title: 'Sentiment Tagging (Bullish / Bearish)',
        description: 'Tag your message with Bullish 🚀 or Bearish 🔻 to participate in real-time community sentiment tracking.',
        badge: 'CROWD SIGNAL'
      },
      {
        number: '3',
        title: 'Meridian AI Research Desk',
        description: 'Ask deep valuation questions: "Top dividend stocks on GSE", "Explain RSI & MACD", or "Evaluate MTN Ghana".',
        badge: 'AI ANALYST'
      }
    ],
    keyTakeaway: 'Join the Dividend Club or Banking channel to see where institutional and retail capital is rotating.'
  }
];

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'tour' | 'cheat_sheet'>('tour');

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleJumpToTab = (tab: MainNavTab) => {
    onNavigateTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#040814]/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div 
        className="bg-[#070D1F] border border-white/[0.08] rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col h-[94dvh] sm:h-auto sm:max-h-[94vh] my-0 sm:my-auto ring-1 ring-white/10"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navigation Bar */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#040816] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-lg font-black text-white tracking-tight truncate">
                Terminal Tour
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 truncate">
                <span>Step {currentStepIndex + 1}/{TOUR_STEPS.length}</span>
                <span>•</span>
                <span className="text-cyan-400 font-mono font-bold truncate">{currentStep.tabLabel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <div className="flex p-0.5 bg-[#0B132B] rounded-xl border border-white/[0.06] text-xs font-bold mr-1">
              <button
                type="button"
                onClick={() => setViewMode('tour')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs transition-all cursor-pointer ${
                  viewMode === 'tour'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tour
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cheat_sheet')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs transition-all cursor-pointer ${
                  viewMode === 'cheat_sheet'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cheat Sheet
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Walkthrough"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            VIEW 1: STEP-BY-STEP ANNOTATED TOUR
           ========================================================================= */}
        {viewMode === 'tour' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Step Header */}
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>{currentStep.title}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentStep.subtitle}
              </p>
            </div>

            {/* Simulated Visual Preview Card with Annotations */}
            <div className="p-4 rounded-2xl bg-[#0B132B] border border-cyan-500/30 shadow-lg space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  {currentStep.visualPreview.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {currentStep.visualPreview.mockBadge}
                </span>
              </div>

              {/* Mock Metric Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {currentStep.visualPreview.mockMetrics.map((m, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-left ${
                      m.highlight
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                        : 'bg-[#040816] border-white/[0.06] text-slate-300'
                    }`}
                  >
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">
                      {m.label}
                    </span>
                    <span className="text-xs font-mono font-black truncate block mt-0.5">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pinpoint Numbered Annotations */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                TERMINAL ANNOTATIONS & HOW TO USE
              </span>

              <div className="space-y-2.5">
                {currentStep.annotations.map((ann) => (
                  <div
                    key={ann.number}
                    className="p-3.5 rounded-2xl bg-[#040816] border border-white/[0.06] hover:border-cyan-500/30 transition-all flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      {ann.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <h4 className="text-xs font-bold text-white">
                          {ann.title}
                        </h4>
                        {ann.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold border border-white/[0.04]">
                            {ann.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {ann.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Takeaway Pill */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-bold">Pro-Tip: </strong>
                <span>{currentStep.keyTakeaway}</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: 1-PAGE FEATURE CHEAT SHEET
           ========================================================================= */}
        {viewMode === 'cheat_sheet' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            <div className="text-xs text-slate-300">
              Quick sitemap of every tool available on the Meridian Equities terminal:
            </div>

            <div className="space-y-2.5">
              {TOUR_STEPS.map((step) => (
                <div
                  key={step.id}
                  className="p-3.5 rounded-2xl bg-[#040816] border border-white/[0.06] flex items-center justify-between gap-3 hover:border-slate-600 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                        {step.id}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 truncate max-w-sm">
                      {step.subtitle}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleJumpToTab(step.targetTab)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation Controls */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#040816] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setViewMode('tour');
                  setCurrentStepIndex(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentStepIndex === idx
                    ? 'bg-cyan-400 w-6'
                    : 'bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirstStep}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => handleJumpToTab(currentStep.targetTab)}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all cursor-pointer hidden sm:flex items-center gap-1.5"
            >
              <span>Jump to Tab</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>{isLastStep ? 'Finish Tour' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
