import React, { useState } from 'react';
import {
  X, ShieldCheck, Camera, Upload, CheckCircle2, ChevronLeft, ArrowRight,
  FileText, Lock, AlertCircle, RefreshCw, Smartphone
} from 'lucide-react';

interface KYCPipelineProps {
  isOpen: boolean;
  onClose: () => void;
  baseCountry?: string;
  onComplete: (data: { docType: string; status: 'pending' | 'verified' }) => void;
}

export const KYCPipeline: React.FC<KYCPipelineProps> = ({
  isOpen,
  onClose,
  baseCountry = 'GH',
  onComplete,
}) => {
  const isGhana = baseCountry === 'GH';
  const [step, setStep] = useState<'SELECT' | 'CAPTURE' | 'REVIEW' | 'SUCCESS'>('SELECT');
  const [docType, setDocType] = useState<'ghana_card' | 'passport' | 'national_id'>(
    isGhana ? 'ghana_card' : 'passport'
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setStep('REVIEW');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('SUCCESS');
      onComplete({ docType, status: 'verified' });
      setTimeout(() => {
        onClose();
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2">
            {step !== 'SELECT' && step !== 'SUCCESS' && (
              <button
                onClick={() => setStep('SELECT')}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Digital KYC Verification</h2>
              <p className="text-xs text-slate-400">Zero-knowledge identity clearance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 flex-1">
          {/* STEP 1: Select Document */}
          {step === 'SELECT' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Select Identity Document
              </span>

              <div className="space-y-2.5">
                {isGhana ? (
                  <>
                    <button
                      onClick={() => setDocType('ghana_card')}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        docType === 'ghana_card'
                          ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">🇬🇭</span>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-white block">Ghana Card</span>
                        <span className="text-[11px] text-slate-400">National Identification Authority (NIA) card</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setDocType('passport')}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        docType === 'passport'
                          ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">🌐</span>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-white block">Republic of Ghana Passport</span>
                        <span className="text-[11px] text-slate-400">International biometric passport</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setDocType('passport')}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        docType === 'passport'
                          ? 'bg-cyan-500/15 border-cyan-500 ring-1 ring-cyan-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">📘</span>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-white block">International Passport</span>
                        <span className="text-[11px] text-slate-400">For diaspora & cross-border trading accounts</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setDocType('national_id')}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        docType === 'national_id'
                          ? 'bg-cyan-500/15 border-cyan-500 ring-1 ring-cyan-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">🪪</span>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-white block">National Driver’s License / State ID</span>
                        <span className="text-[11px] text-slate-400">Government issued photo ID</span>
                      </div>
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setStep('CAPTURE')}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>Continue to Photo Capture</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Capture Document */}
          {step === 'CAPTURE' && (
            <div className="space-y-4 text-center">
              <div className="p-8 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-950/40 flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Capture or Upload {docType === 'ghana_card' ? 'Ghana Card' : 'Passport'}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Position your document clearly within the frame. Ensure good lighting and zero glare.
                  </p>
                </div>

                <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-md transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Choose File / Take Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-500 flex items-center gap-2 text-left">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Device Sandbox: Images are processed exclusively on your device in IndexedDB and never uploaded to public servers.</span>
              </div>
            </div>
          )}

          {/* STEP 3: Review Preview */}
          {step === 'REVIEW' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Confirm Document Preview
              </span>

              {imagePreview && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 max-h-56 flex items-center justify-center">
                  <img src={imagePreview} alt="Captured Document" className="w-full object-contain" />
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Document Type:</span>
                  <span className="font-bold text-white uppercase">{docType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Verification Engine:</span>
                  <span className="font-bold text-emerald-400">Meridian Local KYC Sandbox</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Document Signatures...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Verify Account</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* SUCCESS STEP */}
          {step === 'SUCCESS' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white">KYC Verification Approved!</h3>
              <p className="text-xs text-slate-300 max-w-xs">
                Your identity clearance has been recorded in your local terminal profile. All international trading features are now unlocked.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
