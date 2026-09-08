import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Globe, 
  Mail, 
  MapPin, 
  Search, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Smartphone,
  CheckCircle2,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export interface GSEBroker {
  id: string;
  name: string;
  shortName: string;
  category: 'Full-Service Investment Bank' | 'Commercial Bank Brokerage' | 'Independent Dealing Member';
  phone: string;
  email: string;
  website: string;
  location: string;
  momoSupported: boolean;
  momoInstructions?: string;
  mobileApp?: string;
  digitalPortal: boolean;
  minAccountOpening: string;
  custodianBank?: string;
}

export const OFFICIAL_GSE_BROKERS: GSEBroker[] = [
  {
    id: 'databank',
    name: 'Databank Brokerage Ltd',
    shortName: 'Databank',
    category: 'Full-Service Investment Bank',
    phone: '+233 30 261 0610',
    email: 'info@databankgroup.com',
    website: 'https://www.databankgroup.com',
    location: '61 Barnes Road, Adabraka, Accra',
    momoSupported: true,
    momoInstructions: 'Deposit via Databank Ark mobile app or MTN MoMo *170#',
    mobileApp: 'Databank Ark (iOS & Android)',
    digitalPortal: true,
    minAccountOpening: 'GH₵ 0 (Free CSD Account)',
    custodianBank: 'Standard Chartered Bank Ghana'
  },
  {
    id: 'ic-securities',
    name: 'IC Securities (Ghana) Ltd',
    shortName: 'IC Securities',
    category: 'Full-Service Investment Bank',
    phone: '+233 30 225 2621',
    email: 'clientservice@ic.africa',
    website: 'https://ic.africa',
    location: 'No. 2 Airport City, Accra',
    momoSupported: true,
    momoInstructions: 'Direct MoMo & Telecel Cash integration inside IC Trader web & app',
    mobileApp: 'IC Trader (iOS & Android)',
    digitalPortal: true,
    minAccountOpening: 'GH₵ 0 (Digital KYC with Ghana Card)',
    custodianBank: 'Stanbic Bank Ghana'
  },
  {
    id: 'sbg-securities',
    name: 'SBG Securities Ghana Ltd (Stanbic Bank)',
    shortName: 'Stanbic SBG',
    category: 'Commercial Bank Brokerage',
    phone: '+233 30 281 5789',
    email: 'sbgsecurities@stanbic.com.gh',
    website: 'https://www.stanbicbank.com.gh',
    location: 'Stanbic Heights, Airport City, Accra',
    momoSupported: true,
    momoInstructions: 'Stanbic Mobile App or Stanbic Online Banking investment desk',
    mobileApp: 'Stanbic App / SBG Investor',
    digitalPortal: true,
    minAccountOpening: 'GH₵ 50',
    custodianBank: 'Stanbic Bank Ghana Custody'
  },
  {
    id: 'cal-brokers',
    name: 'CalBank Brokerage Ltd',
    shortName: 'CalBank Brokers',
    category: 'Commercial Bank Brokerage',
    phone: '+233 30 268 0068',
    email: 'brokerage@calbank.net',
    website: 'https://calbank.net/brokerage',
    location: '23 Independence Avenue, Ridge, Accra',
    momoSupported: true,
    momoInstructions: 'CalBank App or MTN MoMo / Telecel Cash funding',
    mobileApp: 'CalBank App',
    digitalPortal: true,
    minAccountOpening: 'GH₵ 20',
    custodianBank: 'CalBank Custody'
  },
  {
    id: 'edc-stockbrokers',
    name: 'EDC Stockbrokers Ltd (Ecobank Capital)',
    shortName: 'Ecobank EDC',
    category: 'Commercial Bank Brokerage',
    phone: '+233 30 225 1720',
    email: 'edc@ecobank.com',
    website: 'https://ecobank.com/capital',
    location: 'Ecobank Head Office, 2 Morocco Lane, Off Independence Ave, Accra',
    momoSupported: true,
    momoInstructions: 'Ecobank Mobile App investment module & MoMo bill pay',
    mobileApp: 'Ecobank Mobile',
    digitalPortal: true,
    minAccountOpening: 'GH₵ 50',
    custodianBank: 'Ecobank Custodial Services'
  },
  {
    id: 'gcb-brokerage',
    name: 'GCB Brokerage Ltd',
    shortName: 'GCB Brokerage',
    category: 'Commercial Bank Brokerage',
    phone: '+233 30 267 2852',
    email: 'brokerage@gcb.com.gh',
    website: 'https://www.gcbbank.com.gh',
    location: 'GCB High Street Building, Accra',
    momoSupported: true,
    momoInstructions: 'GCB Mobile App, G-Money, or any GCB nationwide branch',
    mobileApp: 'GCB Mobile App',
    digitalPortal: true,
    minAccountOpening: 'GH₵ 20',
    custodianBank: 'GCB Bank Custody'
  },
  {
    id: 'black-star',
    name: 'Black Star Brokerage Ltd',
    shortName: 'Black Star',
    category: 'Independent Dealing Member',
    phone: '+233 30 276 7670',
    email: 'info@blackstargroup.ai',
    website: 'https://blackstargroup.ai',
    location: 'The Octagon, Central Business District, Accra',
    momoSupported: true,
    momoInstructions: 'Instant wallet top-up via MTN MoMo / Telecel Cash',
    mobileApp: 'Black Star Portal',
    digitalPortal: true,
    minAccountOpening: 'GH₵ 0',
    custodianBank: 'Guaranty Trust Bank (Ghana)'
  },
  {
    id: 'sic-brokerage',
    name: 'SIC Brokerage Ltd',
    shortName: 'SIC Brokerage',
    category: 'Independent Dealing Member',
    phone: '+233 30 276 7051',
    email: 'sic-b@sic-fsi.com',
    website: 'https://www.sic-fsi.com',
    location: 'Nyemitei House, Osu, Accra',
    momoSupported: true,
    momoInstructions: 'MoMo merchant code & bank transfer',
    mobileApp: 'Web Trading Desk',
    digitalPortal: true,
    minAccountOpening: 'GH₵ 50',
    custodianBank: 'Barclays / Absa Custody'
  },
  {
    id: 'chapel-hill',
    name: 'Chapel Hill Denham Securities Ghana Ltd',
    shortName: 'Chapel Hill Denham',
    category: 'Full-Service Investment Bank',
    phone: '+233 30 223 3013',
    email: 'info@chapelhilldenham.com',
    website: 'https://chapelhilldenham.com',
    location: 'Suite 2B, Heritage Tower, Ridge, Accra',
    momoSupported: false,
    momoInstructions: 'Direct bank transfer or wire deposit',
    digitalPortal: true,
    minAccountOpening: 'GH₵ 500 (Institutional & HNI Desk)',
    custodianBank: 'Stanbic Bank Ghana'
  },
  {
    id: 'first-atlantic',
    name: 'First Atlantic Brokers Ltd',
    shortName: 'FAB Brokers',
    category: 'Commercial Bank Brokerage',
    phone: '+233 30 268 0825',
    email: 'brokers@firstatlanticbank.com.gh',
    website: 'https://firstatlanticbank.com.gh',
    location: 'Atlantic Place, 1 Seventh Avenue, Ridge, Accra',
    momoSupported: true,
    momoInstructions: 'First Atlantic Mobile App or MoMo push transfer',
    mobileApp: 'Atlantic Mobile',
    digitalPortal: true,
    minAccountOpening: 'GH₵ 50',
    custodianBank: 'First Atlantic Bank Custody'
  },
  {
    id: 'sas-brokers',
    name: 'Strategic African Securities (SAS) Ltd',
    shortName: 'SAS Investment',
    category: 'Independent Dealing Member',
    phone: '+233 30 266 1770',
    email: 'sasltd@sasghana.com',
    website: 'https://www.sasghana.com',
    location: '14th Floor, World Trade Centre, Accra',
    momoSupported: true,
    momoInstructions: 'MTN MoMo pay bill & express direct deposit',
    digitalPortal: true,
    minAccountOpening: 'GH₵ 50',
    custodianBank: 'Zenith Bank Custodial Services'
  },
  {
    id: 'republic-investments',
    name: 'Republic Investments (Ghana) Ltd',
    shortName: 'Republic Investments',
    category: 'Commercial Bank Brokerage',
    phone: '+233 30 225 8106',
    email: 'investments@republicghana.com',
    website: 'https://republicghana.com',
    location: 'No. 48A Sixth Avenue, North Ridge, Accra',
    momoSupported: true,
    momoInstructions: 'Republic Mobile App or MoMo deposit',
    mobileApp: 'Republic Mobile Ghana',
    digitalPortal: true,
    minAccountOpening: 'GH₵ 50',
    custodianBank: 'Republic Bank (Ghana) Custody'
  }
];

interface StockBrokersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBrokerForPortfolio?: (brokerName: string) => void;
}

export const StockBrokersModal: React.FC<StockBrokersModalProps> = ({
  isOpen,
  onClose,
  onSelectBrokerForPortfolio
}) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredBrokers = OFFICIAL_GSE_BROKERS.filter((b) => {
    const matchesSearch = 
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.shortName.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase());
    
    if (filterCategory === 'ALL') return matchesSearch;
    if (filterCategory === 'MOMO') return matchesSearch && b.momoSupported;
    if (filterCategory === 'APP') return matchesSearch && Boolean(b.mobileApp);
    return matchesSearch && b.category === filterCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-[#080E20] border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl w-full max-w-4xl h-[94dvh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="brokers-modal-title"
      >
        {/* Header */}
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-4 border-b border-white/[0.08] flex items-center justify-between bg-gradient-to-r from-[#0B132B] to-[#080E20] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 id="brokers-modal-title" className="text-sm sm:text-lg font-bold truncate">
                  GSE Licensed Brokers
                </h2>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  SEC LICENSED
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Official accredited Dealing Members on the Ghana Stock Exchange
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Quick Info Ribbon */}
        <div className="px-5 sm:px-6 py-2.5 bg-cyan-950/30 border-b border-cyan-500/20 text-xs text-cyan-300 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All stock purchases are held electronically in your personal Central Securities Depository (CSD) account.</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-400">
            {filteredBrokers.length} of {OFFICIAL_GSE_BROKERS.length} Brokers
          </span>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#0A1026] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by broker name, bank, or city..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#060B18] border border-white/[0.08] focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-hidden font-sans"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Brokers' },
              { id: 'MOMO', label: '📱 MoMo Supported' },
              { id: 'APP', label: '📲 Mobile App' },
              { id: 'Commercial Bank Brokerage', label: 'Banks' },
              { id: 'Full-Service Investment Bank', label: 'Investment Banks' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  filterCategory === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Brokers Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          {filteredBrokers.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
              <p className="font-bold text-sm">No stockbrokers matched your search.</p>
              <p className="text-xs text-slate-500 mt-1">Try clearing your search query or filter tags.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBrokers.map((broker) => (
                <div 
                  key={broker.id}
                  className="bg-[#0C142E] rounded-2xl border border-white/[0.08] hover:border-cyan-500/40 p-4 sm:p-5 transition-all shadow-md flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Name & Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {broker.name}
                        </h3>
                        <span className="text-[11px] font-mono text-cyan-400/90 font-medium">
                          {broker.category}
                        </span>
                      </div>
                      {broker.momoSupported && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0 flex items-center gap-1">
                          <Smartphone className="w-2.5 h-2.5" />
                          MOMO
                        </span>
                      )}
                    </div>

                    {/* Metadata Specs */}
                    <div className="space-y-1.5 text-xs text-slate-300 mt-3 pt-3 border-t border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate text-slate-400">{broker.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a 
                          href={`tel:${broker.phone.replace(/\s+/g, '')}`}
                          className="hover:text-cyan-400 font-mono transition-colors"
                        >
                          {broker.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a 
                          href={`mailto:${broker.email}`}
                          className="hover:text-cyan-400 font-mono truncate transition-colors"
                        >
                          {broker.email}
                        </a>
                      </div>
                      {broker.mobileApp && (
                        <div className="flex items-center gap-2 text-emerald-400 font-medium text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>App: {broker.mobileApp}</span>
                        </div>
                      )}
                      {broker.momoInstructions && (
                        <div className="bg-slate-900/60 rounded-xl p-2 mt-2 text-[11px] text-slate-400 border border-white/[0.04]">
                          <strong className="text-slate-300">Deposit Flow: </strong>
                          {broker.momoInstructions}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      Min: {broker.minAccountOpening}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={broker.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3 text-cyan-400" />
                      </a>
                      {onSelectBrokerForPortfolio && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectBrokerForPortfolio(broker.name);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Guidance */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0A1026] text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Need help opening a Central Securities Depository (CSD) trading account? Any licensed broker above can set it up in 5 minutes with your Ghana Card.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer shrink-0"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
