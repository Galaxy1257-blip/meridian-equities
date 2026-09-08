import React from 'react';
import { X, FileText, Download, Calendar, Building2, ExternalLink, ShieldCheck, Tag } from 'lucide-react';
import { PortfolioHolding } from '../types';

interface ReceiptViewerModalProps {
  holding: PortfolioHolding | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({
  holding,
  isOpen,
  onClose
}) => {
  if (!isOpen || !holding || !holding.receipt) return null;

  const { receipt } = holding;
  const isPdf = receipt.fileType.includes('pdf') || receipt.fileName.toLowerCase().endsWith('.pdf');
  const isImage = receipt.fileType.startsWith('image/');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[94dvh] sm:h-auto sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-3.5 sm:px-5 py-2.5 sm:py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="p-2 sm:p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate max-w-[140px] sm:max-w-md">
                  {receipt.fileName}
                </h3>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase shrink-0">
                  Contract Note
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                {holding.stockName} ({holding.ticker}) • {holding.sharesCount.toLocaleString()} shares @ GH₵ {holding.buyPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {receipt.fileData && (
              <a
                href={receipt.fileData}
                download={receipt.fileName}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold"
                title="Download Receipt"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Metadata bar */}
        <div className="bg-slate-100 dark:bg-slate-950 p-3 px-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Purchase Date: <strong>{holding.startDate}</strong></span>
            </span>
            {holding.brokerName && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Broker: <strong>{holding.brokerName}</strong></span>
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Size: {(receipt.fileSize / 1024).toFixed(1)} KB • Uploaded on {receipt.uploadedAt}
          </span>
        </div>

        {/* Body / Document Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950/5 dark:bg-slate-950/40 flex items-center justify-center min-h-[350px]">
          {receipt.fileData ? (
            isImage ? (
              <div className="max-w-full max-h-[500px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-2 shadow-sm">
                <img
                  src={receipt.fileData}
                  alt={receipt.fileName}
                  className="max-h-[480px] w-auto object-contain mx-auto rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-[450px] rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                <iframe
                  src={receipt.fileData}
                  title={receipt.fileName}
                  className="w-full h-full border-none"
                />
              </div>
            )
          ) : (
            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{receipt.fileName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Receipt file registered in local portfolio</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white dark:bg-slate-950 p-4 px-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Securely stored locally in your browser cache</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
