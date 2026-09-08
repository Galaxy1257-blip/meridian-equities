import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Smartphone, Code2, Download, Layers } from 'lucide-react';
import { RisingCediLogo } from './RisingCediLogo';

interface AppIconExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppIconExportModal: React.FC<AppIconExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedBg, setCopiedBg] = useState(false);
  const [copiedFg, setCopiedFg] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  if (!isOpen) return null;

  const bgXml = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#0A5239"
        android:pathData="M0,0h108v108h-108z" />
</vector>`;

  const fgXml = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    
    <!-- We scale and center the logo inside the 108x108 app icon canvas -->
    <group
        android:scaleX="2.5"
        android:scaleY="2.5"
        android:translateX="24"
        android:translateY="24">
        
        <!-- The 'C' of the Cedi Symbol -->
        <path
            android:strokeColor="#F4C430"
            android:strokeWidth="2"
            android:strokeLineCap="round"
            android:pathData="M14.5,8 A5,5 0 1,0 14.5,16" />
            
        <!-- The Vertical Strike that turns into a Rising Arrow -->
        <path
            android:strokeColor="#F4C430"
            android:strokeWidth="2"
            android:strokeLineCap="round"
            android:strokeLineJoin="round"
            android:pathData="M10,18 L10,6 L14,10 M10,6 L6,10" />
            
    </group>
</vector>`;

  const handleCopyBg = () => {
    navigator.clipboard.writeText(bgXml);
    setCopiedBg(true);
    setTimeout(() => setCopiedBg(false), 2000);
  };

  const handleCopyFg = () => {
    navigator.clipboard.writeText(fgXml);
    setCopiedFg(true);
    setTimeout(() => setCopiedFg(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col h-[94dvh] sm:h-auto sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-[#0A5239]/10 via-transparent to-amber-500/10 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#0A5239] text-[#F4C430] flex items-center justify-center font-bold text-base sm:text-lg shadow-md border border-[#F4C430]/30 shrink-0">
              ₵
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                <span className="truncate">Rising Cedi Icon</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#0A5239] text-[#F4C430] font-bold shrink-0">
                  Adaptive XML
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                Vector Design & Android Studio Config
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-5 pt-3 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-[#0A5239] dark:border-[#F4C430] text-[#0A5239] dark:text-[#F4C430]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Visual Preview & Design Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-[#0A5239] dark:border-[#F4C430] text-[#0A5239] dark:text-[#F4C430]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Android Vector XML Code (Copy & Paste)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5 text-xs text-slate-600 dark:text-slate-300">
          {activeTab === 'preview' ? (
            <div className="space-y-5">
              {/* Centered Big Icon Showcase */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
                <RisingCediLogo size="xl" showBadge={false} />

                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#F4C430]">
                    Fintech Research Identity
                  </span>
                  <h3 className="text-base font-black text-white">
                    Rising Cedi (Ghana Stock Exchange)
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    A harmonic fusion of the Ghanaian Cedi symbol (₵) morphing upwards into a rising market breakout arrow, grounded on rich Forest Green (#0A5239) and Warm Gold (#F4C430).
                  </p>
                </div>
              </div>

              {/* Design Breakdown Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0A5239] border border-slate-300 inline-block"></span>
                    <span>1. Rich Forest Green (#0A5239)</span>
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Represents Ghana's lush agricultural strength, sustainable capital, and stability. Used as the 108x108 adaptive background.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#F4C430] border border-slate-300 inline-block"></span>
                    <span>2. Golden Cedi Arrow (#F4C430)</span>
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Denotes gold mineral wealth, rising portfolio value, and equity research precision on the GSE floor.
                  </p>
                </div>
              </div>

              {/* Research Integration Note */}
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1 text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-xs">Research & Equity Intelligence Badge</span>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                    The top header and home screen proudly integrate the <strong>"Research Lab"</strong> insignia, providing institutional-grade GSE stock screeners, valuation metrics, and daily closing reports.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File 1: Background */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                    <span>1. ic_launcher_background.xml</span>
                  </span>
                  <button
                    onClick={handleCopyBg}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    {copiedBg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBg ? 'Copied XML!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 rounded-xl text-[10px] font-mono text-slate-300 overflow-x-auto border border-slate-800/80 leading-relaxed">
                  {bgXml}
                </pre>
              </div>

              {/* File 2: Foreground */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-amber-400 font-bold flex items-center gap-1.5">
                    <span>2. ic_launcher_foreground.xml</span>
                  </span>
                  <button
                    onClick={handleCopyFg}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    {copiedFg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFg ? 'Copied XML!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 rounded-xl text-[10px] font-mono text-slate-300 overflow-x-auto border border-slate-800/80 leading-relaxed">
                  {fgXml}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Vector Math-Driven UI • Zero Pixel Distortion
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
