import React, { useState, useRef } from 'react';
import {
  X, FileText, Globe, DollarSign, PenLine, CheckCircle2, ChevronLeft,
  ArrowRight, ShieldCheck, Printer, Download, Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { printW8BENSummary } from '../utils/printW8BENSummary';

interface W8BENWizardProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile | null;
}

export const W8BENWizard: React.FC<W8BENWizardProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState(userProfile?.name || 'Kwame Mensah');
  const [countryResidence, setCountryResidence] = useState(userProfile?.baseCountry === 'GH' ? 'Ghana' : 'Ghana');
  const [citizenship, setCitizenship] = useState('Ghana');
  const [dob, setDob] = useState('1990-05-15');
  const [tin, setTin] = useState('P0012984920');
  const [treatyClaimed, setTreatyClaimed] = useState(true);
  const [isSigned, setIsSigned] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    setIsSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
  };

  const handlePrint = () => {
    printW8BENSummary({
      userProfile,
      name,
      countryResidence,
      tin,
      dateOfBirth: dob,
      claimTreaty: treatyClaimed
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-800 text-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2">
            {step > 1 && !isCompleted && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">IRS Form W-8BEN Wizard</h2>
              <p className="text-xs text-slate-400">US Withholding Tax Treaty Certificate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {!isCompleted && (
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5">
              <span>Step {step} of 4: {step === 1 ? 'Personal Info' : step === 2 ? 'Tax Identification' : step === 3 ? 'Treaty Benefits' : 'Signature'}</span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 flex-1">
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-3 animate-in fade-in">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Legal Name of Beneficial Owner</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Country of Citizenship</label>
                  <input
                    type="text"
                    value={citizenship}
                    onChange={(e) => setCitizenship(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Country of Permanent Residence</label>
                  <input
                    type="text"
                    value={countryResidence}
                    onChange={(e) => setCountryResidence(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Date of Birth (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
              >
                <span>Continue to Tax Identification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Tax ID */}
          {step === 2 && (
            <div className="space-y-3 animate-in fade-in">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Foreign Tax Identifying Number (TIN / Ghana Card)</label>
                <input
                  type="text"
                  value={tin}
                  onChange={(e) => setTin(e.target.value)}
                  placeholder="e.g. GHA-123456789-0 or GRA TIN"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
                <span className="text-[11px] text-slate-500 block">
                  Required by IRS regulations for non-US persons claiming tax treaty exemptions.
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-slate-300">Reference Number:</div>
                <div className="font-mono text-cyan-400">MERIDIAN-W8BEN-{Date.now().toString().slice(-6)}</div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
              >
                <span>Claim Tax Treaty Benefits</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: Treaty Benefits */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>50% Tax Withholding Reduction Qualified</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  By certifying under the US–Ghana Double Taxation Avoidance Agreement (Article 10), your US equity dividend withholding rate drops from <strong className="text-rose-400">30%</strong> down to <strong className="text-emerald-400">15%</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  id="treaty-check"
                  checked={treatyClaimed}
                  onChange={(e) => setTreatyClaimed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                />
                <label htmlFor="treaty-check" className="text-xs text-slate-300 cursor-pointer">
                  I certify that the beneficial owner is a resident of <strong className="text-white">{countryResidence}</strong> within the meaning of the income tax treaty between the United States and that country.
                </label>
              </div>

              <button
                disabled={!treatyClaimed}
                onClick={() => setStep(4)}
                className="w-full py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                <span>Proceed to Digital Signature</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: Digital Signature Canvas */}
          {step === 4 && !isCompleted && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Sign with Finger or Mouse</label>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                >
                  Clear Signature
                </button>
              </div>

              <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-950">
                <canvas
                  ref={canvasRef}
                  width={420}
                  height={140}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full touch-none cursor-crosshair"
                />
              </div>

              <p className="text-[10px] text-slate-500 leading-snug">
                Under penalties of perjury, I declare that I have examined the information on this form and to the best of my knowledge and belief it is true, correct, and complete.
              </p>

              <button
                disabled={!isSigned}
                onClick={() => setIsCompleted(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <PenLine className="w-4 h-4" />
                <span>Sign & Finalize Certificate</span>
              </button>
            </div>
          )}

          {/* COMPLETED SUCCESS SCREEN */}
          {isCompleted && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">Form W-8BEN Certified</h3>
                <p className="text-xs text-slate-300 max-w-xs mt-1">
                  15% dividend treaty rate active for <strong className="text-white">{name}</strong>. Valid for 3 calendar years.
                </p>
              </div>

              <div className="flex gap-2 w-full pt-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF Summary</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center justify-center transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
