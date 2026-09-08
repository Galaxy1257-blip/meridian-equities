import React from 'react';
import { ExternalLink, ShieldCheck, Award } from 'lucide-react';

export const AdmobBannerCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-amber-500/30 shadow-md my-2">
      <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Sponsored • Licensed GSE Brokerage</span>
        </span>
        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          SEC Regulated
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-1.5">
            <span>Start Trading GSE Stocks on Mobile Money</span>
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Buy and sell MTN Ghana, GCB Bank, and BOPP shares instantly via MTN MoMo, Telecel Cash & Bank Apps through SEC-licensed brokers (Databank, IC Securities, CalBrokers, EDC).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <a
            href="https://gse.com.gh"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <span>Find Licensed Broker</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
