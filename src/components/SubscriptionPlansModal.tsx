import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle2, Crown, Sparkles, ShieldCheck, Zap, ChevronLeft, Check,
  ArrowRight, TrendingUp, FileText, Lock, CreditCard, Smartphone, Play,
  Star, AlertCircle, Info, Clock, Volume2, VolumeX, Pause, RefreshCw, Award
} from 'lucide-react';
import { SubscriptionTier } from '../types';

interface SubscriptionPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'GHS' | 'USD';
  onToggleCurrency?: () => void;
  currentTier: SubscriptionTier;
  onSelectTier: (tier: SubscriptionTier) => void;
  baseCountry?: string;
  proPassExpiry?: number | null;
  onUnlockProPass?: (hours: number) => void;
}

export const SubscriptionPlansModal: React.FC<SubscriptionPlansModalProps> = ({
  isOpen,
  onClose,
  currency,
  onToggleCurrency,
  currentTier,
  onSelectTier,
  baseCountry = 'GH',
  proPassExpiry,
  onUnlockProPass
}) => {
  const isLocal = baseCountry === 'GH';
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(currentTier || 'PRO');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card'>('momo');
  const [momoNumber, setMomoNumber] = useState('');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'at'>('mtn');

  // Video Ad Simulator State
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoSecondsLeft, setVideoSecondsLeft] = useState(12);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [isActivatingSuccess, setIsActivatingSuccess] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  const PRO_PRICE_GHS_MONTHLY = 35;
  const PRO_PRICE_USD_MONTHLY = 4.50;

  // Video Countdown Timer
  useEffect(() => {
    let timer: any;
    if (isVideoPlaying && videoSecondsLeft > 0) {
      timer = setInterval(() => {
        setVideoSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isVideoPlaying && videoSecondsLeft === 0) {
      setVideoCompleted(true);
      setIsVideoPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isVideoPlaying, videoSecondsLeft]);

  if (!isOpen) return null;

  // Remaining time if Pro Pass is active
  const hasActivePass = proPassExpiry && proPassExpiry > Date.now();
  const passMinutesLeft = hasActivePass ? Math.max(1, Math.round((proPassExpiry - Date.now()) / 60000)) : 0;
  const passHours = Math.floor(passMinutesLeft / 60);
  const passMins = passMinutesLeft % 60;

  const handleStartAd = () => {
    setVideoSecondsLeft(10);
    setVideoCompleted(false);
    setIsVideoPlaying(true);
  };

  const handleClaimAdReward = () => {
    const hoursToGrant = 2; // 2 hours of Pro access
    if (onUnlockProPass) {
      onUnlockProPass(hoursToGrant);
    } else {
      onSelectTier('PRO');
    }
    setVideoCompleted(false);
    setIsActivatingSuccess(true);
    setSuccessNotice(`🎉 2-Hour Pro Pass Unlocked! Full institutional analytics are now active.`);
    setTimeout(() => {
      setIsActivatingSuccess(false);
      onClose();
    }, 2000);
  };

  const handleSubscribePayment = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectTier('PRO');
    setIsActivatingSuccess(true);
    setSuccessNotice(`🎉 Subscription Activated! Welcome to Meridian Pro.`);
    setTimeout(() => {
      setIsActivatingSuccess(false);
      onClose();
    }, 1800);
  };

  const freeFeatures = [
    'Live Ghana Stock Exchange floor quotes',
    'Beginner Easy Mode with plain-language metrics',
    'Personal Portfolio Tracking (up to 3 holdings)',
    'Real-time Market News & Regulatory Filings',
    'Community Sentiment Voting & Discussion Rooms',
    'Basic USD/GHS FX rates',
  ];

  const proFeatures = [
    'Everything in Free Plan, PLUS:',
    'Unlimited Portfolio Holdings & PDF Statement Export',
    'Institutional Pro Mode (SMA 20/50 trendlines & Volume Turnover)',
    '52-Week High / Low Range bars on all stocks',
    'Meridian AI Quant Research Assistant (Unrestricted)',
    'Full Dividend Calendar & Ex-Dividend Reminders',
    'Money Transfer Charges Calculator',
    'Verified Investor checkmark in Investor Chat',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#040814]/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto animate-in fade-in duration-150 font-sans">
      <div
        className="bg-[#070D1F] border border-white/[0.08] text-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94dvh] sm:h-auto sm:max-h-[94vh] my-0 sm:my-auto ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#040816] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-lg font-black text-white tracking-tight truncate">
                Meridian Equities Plans
              </h2>
              <p className="text-[11px] text-slate-400 truncate">
                Free access, watch an ad for a pass, or upgrade to Pro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleCurrency && (
              <button
                type="button"
                onClick={onToggleCurrency}
                className="px-2 py-1 rounded-xl bg-[#0B132B] border border-white/[0.08] hover:border-slate-600 text-[11px] sm:text-xs font-mono font-bold text-amber-400 cursor-pointer transition-colors"
                title="Toggle Display Currency"
              >
                {currency === 'GHS' ? '₵ GHS' : '$ USD'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {/* Active Pro Pass Status Banner */}
          {hasActivePass && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-purple-500/15 border border-cyan-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse shrink-0" />
                <div>
                  <p className="text-xs font-black text-white">
                    PRO PASS CURRENTLY ACTIVE
                  </p>
                  <p className="text-[11px] text-cyan-300 font-mono">
                    Time remaining: {passHours > 0 ? `${passHours}h ` : ''}{passMins}m
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-cyan-500 text-slate-950">
                ACTIVE
              </span>
            </div>
          )}

          {/* Success Notification */}
          {isActivatingSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* =========================================================================
              REWARD SYSTEM: WATCH A VIDEO TO UNLOCK 2 HOURS OF PRO
             ========================================================================= */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0B132B] via-[#0E1A38] to-[#12224A] border border-cyan-500/30 shadow-lg space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>Unlock 2-Hour Pro Pass with Video</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500 text-slate-950">
                      FREE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Watch a 10-second sponsor clip to unlock full institutional Pro access.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Video Player Simulator */}
            {!isVideoPlaying && !videoCompleted && (
              <button
                type="button"
                onClick={handleStartAd}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all active:scale-98 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Short Video (10s) → Unlock Pro Pass</span>
              </button>
            )}

            {isVideoPlaying && (
              <div className="space-y-3 p-4 rounded-xl bg-[#040816] border border-cyan-500/40 animate-in fade-in">
                <div className="aspect-video w-full bg-slate-950 rounded-lg relative overflow-hidden border border-slate-800 flex flex-col justify-between p-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-300 z-10">
                    <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded">
                      SPONSOR
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-amber-400 font-bold">Reward in {videoSecondsLeft}s</span>
                      <button
                        type="button"
                        onClick={() => setIsVideoMuted(!isVideoMuted)}
                        className="text-slate-400 hover:text-white"
                      >
                        {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Center Content */}
                  <div className="text-center space-y-1.5 my-auto">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto border border-cyan-500/40 animate-pulse">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-white">
                      SEC Ghana Investor Series: Compounding on GSE
                    </p>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                      Learn how dividend reinvestment outpaces inflation over 5-year cycles.
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full transition-all duration-1000"
                      style={{ width: `${((10 - videoSecondsLeft) / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {videoCompleted && (
              <div className="space-y-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-in zoom-in-95">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Video Complete! Reward Ready to Claim.</span>
                </div>
                <button
                  type="button"
                  onClick={handleClaimAdReward}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>Claim 2-Hour Pro Pass Now</span>
                </button>
              </div>
            )}
          </div>

          {/* =========================================================================
              PLAN CARDS: FREE VS PRO SUBSCRIPTION
             ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. FREE PLAN */}
            <div
              onClick={() => setSelectedTier('FREE')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedTier === 'FREE'
                  ? 'bg-[#0B132B] border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                  : 'bg-[#040816] border-white/[0.08] hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-black text-white">Free Investor</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    FOREVER
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-2xl font-black text-white font-mono">GH₵ 0</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {freeFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectTier('FREE');
                  onClose();
                }}
                className="w-full mt-4 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Use Free Plan
              </button>
            </div>

            {/* 2. PRO PLAN */}
            <div
              onClick={() => setSelectedTier('PRO')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                selectedTier === 'PRO'
                  ? 'bg-gradient-to-b from-[#0B132B] to-[#0D1836] border-amber-500/50 shadow-xl ring-1 ring-amber-500/40'
                  : 'bg-[#040816] border-white/[0.08] hover:border-slate-700'
              }`}
            >
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                    <Crown className="w-4 h-4" />
                    <span>Meridian Pro</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    FULL DESK
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {currency === 'GHS' ? `GH₵ ${PRO_PRICE_GHS_MONTHLY}` : `$ ${PRO_PRICE_USD_MONTHLY}`}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-200">
                  {proFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className={`leading-tight ${i === 0 ? 'font-bold text-white' : ''}`}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 space-y-2">
                <form onSubmit={handleSubscribePayment}>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <span>Upgrade to Pro Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#040816] border-t border-white/[0.08] text-[10px] text-center text-slate-500 shrink-0">
          <span>🔒 Cancel anytime</span>
          <span className="mx-2">•</span>
          <span>No lock-in contract</span>
          <span className="mx-2">•</span>
          <span>Ad rewards refresh automatically</span>
        </div>
      </div>
    </div>
  );
};
