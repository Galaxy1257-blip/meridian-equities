import React, { useState } from 'react';
import { 
  X, 
  Newspaper, 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Download, 
  ExternalLink, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  DollarSign, 
  PiggyBank, 
  Briefcase, 
  Building2, 
  FileText, 
  Bell,
  ArrowRight,
  Flame,
  Scale
} from 'lucide-react';
import { GSEMarketNews, Stock } from '../types';

interface NewsDetailModalProps {
  isOpen?: boolean;
  news: GSEMarketNews | null;
  onClose: () => void;
  onSelectStockByTicker?: (ticker: string) => void;
  onSelectStock?: (ticker: string) => void;
  onOpenAlertModalForStock?: (ticker: string) => void;
  onOpenAlertModal?: (ticker: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (newsId: string) => void;
  allStocks?: Stock[];
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  isOpen,
  news,
  onClose,
  onSelectStockByTicker,
  onSelectStock,
  onOpenAlertModalForStock,
  onOpenAlertModal,
  isBookmarked,
  onToggleBookmark,
  allStocks = []
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (isOpen !== undefined && !isOpen) return null;
  if (!news) return null;

  const handleStockClick = onSelectStockByTicker || onSelectStock;
  const handleAlertClick = onOpenAlertModalForStock || onOpenAlertModal;

  const handleShare = () => {
    const text = `📰 [GSE News] ${news.title}\n\nKey Takeaway: ${news.summary}\n\nRead more on Meridian Equities.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadFiling = () => {
    const filename = news.pdfFileName || `${news.title.slice(0, 30).replace(/\s+/g, '_')}_GSE_Notice.pdf`;
    
    // Create a hidden iframe to format the document as a clean PDF for printing/saving
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            h1 { color: #1e3a8a; font-size: 22px; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 20px; text-transform: uppercase; }
            h2 { color: #1e40af; font-size: 16px; margin-top: 30px; text-transform: uppercase; }
            .meta { font-size: 13px; color: #444; margin-bottom: 30px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .meta strong { display: inline-block; width: 100px; }
            .footer { margin-top: 50px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-weight: bold; }
            ul { padding-left: 20px; }
            li { margin-bottom: 8px; }
            p { margin-bottom: 12px; text-align: justify; }
            @page { margin: 20mm; size: A4; }
            @media print {
              body { padding: 0; }
              .meta { border: none; background: transparent; padding: 0; border-bottom: 1px solid #ccc; border-radius: 0; padding-bottom: 15px; }
            }
          </style>
        </head>
        <body>
          <h1>Ghana Stock Exchange & SEC Regulatory Filing</h1>
          <div class="meta">
            <strong>Document:</strong> ${filename}<br/>
            <strong>Title:</strong> ${news.title}<br/>
            <strong>Category:</strong> ${news.category}<br/>
            <strong>Date:</strong> ${news.date} (${news.timestamp})<br/>
            <strong>Source:</strong> ${news.source}
          </div>
          
          <h2>Executive Summary</h2>
          <p>${news.summary}</p>
          
          <h2>Key Highlights & Regulatory Takeaways</h2>
          <ul>
            ${news.keyHighlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
          
          <h2>Full Report Details</h2>
          ${news.content.map(p => `<p>${p}</p>`).join('')}
          
          <div class="footer">
            Ghana Stock Exchange • Central Securities Depository • SEC Ghana<br/>
            Generated via Meridian Equities Terminal
          </div>
        </body>
      </html>
    `;

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1000);
      }, 250);
    } else {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const getCategoryTheme = (cat: GSEMarketNews['category']) => {
    switch (cat) {
      case 'IPO':
        return {
          badgeBg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          accent: 'text-purple-600 dark:text-purple-400',
          icon: <Sparkles className="w-3.5 h-3.5" />,
          label: 'Upcoming IPO / Listing'
        };
      case 'DIVIDEND':
        return {
          badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          accent: 'text-emerald-600 dark:text-emerald-400',
          icon: <PiggyBank className="w-3.5 h-3.5" />,
          label: 'Dividend Declaration'
        };
      case 'TRADES':
        return {
          badgeBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          accent: 'text-amber-600 dark:text-amber-400',
          icon: <Flame className="w-3.5 h-3.5" />,
          label: 'Block & Cross Trades'
        };
      case 'EARNINGS':
        return {
          badgeBg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          accent: 'text-blue-600 dark:text-blue-400',
          icon: <TrendingUp className="w-3.5 h-3.5" />,
          label: 'Financial Results & Report'
        };
      case 'REGULATORY':
        return {
          badgeBg: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
          accent: 'text-slate-600 dark:text-slate-400',
          icon: <Scale className="w-3.5 h-3.5" />,
          label: 'SEC & GSE Circular'
        };
      default:
        return {
          badgeBg: 'bg-slate-100 text-slate-800',
          accent: 'text-slate-600',
          icon: <Newspaper className="w-3.5 h-3.5" />,
          label: 'Market News'
        };
    }
  };

  const catTheme = getCategoryTheme(news.category);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-5 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[94dvh] sm:h-auto sm:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-3.5 sm:px-6 py-3 sm:py-4 border-b border-slate-800 shrink-0 space-y-2">
          {/* Top Row: Category Tags & Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 border ${catTheme.badgeBg}`}>
                {catTheme.icon}
                <span className="truncate">{catTheme.label}</span>
              </span>

              {news.isBreaking && (
                <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] sm:text-[11px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  Breaking
                </span>
              )}

              {news.isImportant && (
                <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] sm:text-[11px] font-bold shrink-0">
                  High Impact
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Bookmark button */}
              <button
                onClick={() => onToggleBookmark(news.id)}
                className={`p-1.5 sm:p-2 rounded-xl border transition-colors ${
                  isBookmarked
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-750'
                }`}
                title={isBookmarked ? 'Saved to Bookmarks' : 'Bookmark for later'}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Share article summary"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Full-width Headline & Metadata */}
          <div>
            <h2 className="text-base sm:text-xl font-black text-white leading-snug">
              {news.title}
            </h2>

            <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-400 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{news.timestamp}</span>
              </span>
              <span>•</span>
              <span className="text-slate-300 font-medium">Source: {news.source}</span>
              <span>•</span>
              <span>{news.readTimeMinutes} min read</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1 text-slate-800 dark:text-slate-200">
          
          {/* Key Metrics Strip if available */}
          {news.metrics && news.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {news.metrics.map((m, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">
                    {m.label}
                  </span>
                  <span className={`text-base font-black font-mono ${
                    m.positive 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Key Takeaways Box */}
          <div className="bg-amber-500/10 dark:bg-amber-950/30 p-4 sm:p-5 rounded-2xl border border-amber-500/20 dark:border-amber-700/30">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase mb-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Key Highlights & Investor Takeaways</span>
            </div>
            <ul className="space-y-2">
              {news.keyHighlights.map((hl, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Structured Special Category Section */}
          {/* 1. IPO Special Card */}
          {news.category === 'IPO' && news.ipoDetails && (
            <div className="bg-purple-50/70 dark:bg-purple-950/30 p-5 rounded-2xl border border-purple-200 dark:border-purple-800/60 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500 text-white font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {news.ipoDetails.companyName}
                    </h3>
                    <span className="text-xs text-purple-700 dark:text-purple-300 font-semibold font-mono">
                      Proposed Ticker: {news.ipoDetails.proposedTicker} • {news.ipoDetails.marketBoard}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-purple-200 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 font-bold text-xs">
                  Status: {news.ipoDetails.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-purple-200 dark:border-purple-800/40 text-xs">
                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Offer Price</span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                    GH₵ {news.ipoDetails.offerPrice.toFixed(2)}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Target Capital</span>
                  <span className="font-mono font-bold text-sm text-purple-700 dark:text-purple-300">
                    {news.ipoDetails.targetRaise}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Min Subscription</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {news.ipoDetails.minSubscription}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Listing Date</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {news.ipoDetails.listingDate}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div><strong>Subscription Window:</strong> {news.ipoDetails.subscriptionOpen} – {news.ipoDetails.subscriptionClose}</div>
                <div><strong>Lead Sponsoring Broker:</strong> {news.ipoDetails.leadBroker}</div>
                <div className="italic text-slate-500 dark:text-slate-400 pt-1">"{news.ipoDetails.prospectusSummary}"</div>
              </div>
            </div>
          )}

          {/* 2. Dividend Special Card */}
          {news.category === 'DIVIDEND' && news.dividendDetails && (
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500 text-white font-bold">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Dividend Distribution Schedule
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      Ticker: {news.dividendDetails.ticker}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Dividend / Share</span>
                  <span className="font-mono font-black text-lg text-emerald-600 dark:text-emerald-400">
                    GH₵ {news.dividendDetails.amountPerShare.toFixed(3)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/40 text-xs">
                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Qualifying Date</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{news.dividendDetails.qualifyingDate}</span>
                </div>
                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Payment Date</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{news.dividendDetails.paymentDate}</span>
                </div>
                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Payout Mode</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{news.dividendDetails.payoutMethod || 'Direct Bank/MoMo'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Trade Flow Special Card */}
          {news.category === 'TRADES' && news.tradeDetails && (
            <div className="bg-amber-50/70 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {news.tradeDetails.tradeType} Execution Details
                    </h3>
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                      Ticker: {news.tradeDetails.ticker}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200">
                  Total: GH₵ {(news.tradeDetails.totalValueGhs / 1000000).toFixed(2)}M
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Volume Matched</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{news.tradeDetails.volumeTraded.toLocaleString()} shares</span>
                </div>
                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Execution Price</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">GH₵ {news.tradeDetails.executionPrice.toFixed(2)}</span>
                </div>
                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/40 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Buyer Classification</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{news.tradeDetails.buyerType}</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. Financial Earnings Special Card */}
          {news.category === 'EARNINGS' && news.reportDetails && (
            <div className="bg-blue-50/70 dark:bg-blue-950/30 p-5 rounded-2xl border border-blue-200 dark:border-blue-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-600 text-white font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Quarterly / Annual Financial Summary
                    </h3>
                    <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                      {news.reportDetails.ticker} • {news.reportDetails.period}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200">
                  {news.reportDetails.keyMetricGrowth || 'Earnings Growth'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Total Revenue</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{news.reportDetails.revenue}</span>
                </div>
                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Profit Before Tax</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{news.reportDetails.profitBeforeTax}</span>
                </div>
                <div className="bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Earnings Per Share (EPS)</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{news.reportDetails.earningsPerShare}</span>
                </div>
              </div>
            </div>
          )}

          {/* Full Content Body */}
          <div className="space-y-3.5 pt-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Full Market Announcement
            </h4>
            {news.content.map((paragraph, idx) => (
              <p key={idx} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Related GSE Stocks Chips */}
          {news.relatedTickers && news.relatedTickers.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                Impacted GSE Listed Equities
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {news.relatedTickers.map((ticker) => {
                  const stock = (allStocks || []).find(s => s.ticker === ticker);
                  return (
                    <div 
                      key={ticker}
                      className="bg-slate-100 dark:bg-slate-800 p-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 hover:border-amber-400 transition-all"
                    >
                      <span className="font-mono font-black text-xs text-amber-600 dark:text-amber-400">
                        {ticker}
                      </span>
                      {stock && (
                        <>
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[140px]">
                            {stock.name}
                          </span>
                          <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                            GH₵ {stock.price.toFixed(2)}
                          </span>
                        </>
                      )}
                      
                      {stock && handleStockClick && (
                        <button
                          onClick={() => {
                            onClose();
                            handleStockClick(ticker);
                          }}
                          className="p-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-200 text-xs transition-colors ml-1"
                          title="Open Stock Details"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}

                      {handleAlertClick && (
                        <button
                          onClick={() => {
                            onClose();
                            handleAlertClick(ticker);
                          }}
                          className="p-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-200 text-xs transition-colors"
                          title="Set Price Alert"
                        >
                          <Bell className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 px-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFiling}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                downloaded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
              }`}
              title="Download official regulatory circular copy"
            >
              {downloaded ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloaded ? 'Downloaded Filing' : 'Download Official Circular'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
