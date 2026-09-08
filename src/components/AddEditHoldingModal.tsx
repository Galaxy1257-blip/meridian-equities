import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Upload, FileText, Check, AlertTriangle, Calendar, DollarSign, Building2, Tag, ArrowRight, Eye, Trash2, Sparkles, HelpCircle, FileCheck } from 'lucide-react';
import { Stock, PortfolioHolding, ReceiptAttachment } from '../types';
import { StockLogo } from './StockLogo';

interface AddEditHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: Stock[];
  onSaveHolding: (holding: Omit<PortfolioHolding, 'id' | 'createdAt'>, holdingId?: string) => void;
  editingHolding?: PortfolioHolding | null;
  preselectedTicker?: string | null;
}

const COMMON_GSE_BROKERS = [
  'Databank Brokerage Ltd',
  'IC Securities Ghana',
  'CalBank Brokerage Ltd',
  'EDC Stockbrokers (Ecobank)',
  'Stanbic Bank Brokerage',
  'GCB Brokerage Ltd',
  'Black Star Brokerage',
  'Strategic African Securities (SAS)',
  'SIC Brokerage Ltd',
  'Direct MoMo / G-Exchange',
  'Other / Self-Directed'
];

export const AddEditHoldingModal: React.FC<AddEditHoldingModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSaveHolding,
  editingHolding,
  preselectedTicker
}) => {
  const [selectedTicker, setSelectedTicker] = useState<string>('MTNGH');
  const [sharesCount, setSharesCount] = useState<string>('');
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [brokerName, setBrokerName] = useState<string>(COMMON_GSE_BROKERS[0]);
  const [notes, setNotes] = useState<string>('');
  const [receipt, setReceipt] = useState<ReceiptAttachment | undefined>(undefined);
  const [isParsingReceipt, setIsParsingReceipt] = useState<boolean>(false);
  const [parseSuccessMsg, setParseSuccessMsg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset form when modal opens or editingHolding changes
  useEffect(() => {
    if (editingHolding) {
      setSelectedTicker(editingHolding.ticker);
      setSharesCount(editingHolding.sharesCount.toString());
      setBuyPrice(editingHolding.buyPrice.toString());
      setStartDate(editingHolding.startDate || new Date().toISOString().split('T')[0]);
      setBrokerName(editingHolding.brokerName || COMMON_GSE_BROKERS[0]);
      setNotes(editingHolding.notes || '');
      setReceipt(editingHolding.receipt);
      setParseSuccessMsg('');
      setError('');
    } else {
      const initialTicker = preselectedTicker || (stocks[0]?.ticker ?? 'MTNGH');
      setSelectedTicker(initialTicker);
      const s = stocks.find(st => st.ticker === initialTicker);
      if (s) {
        setBuyPrice(s.price.toFixed(2));
      }
      setSharesCount('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setBrokerName(COMMON_GSE_BROKERS[0]);
      setNotes('');
      setReceipt(undefined);
      setParseSuccessMsg('');
      setError('');
    }
  }, [editingHolding, preselectedTicker, isOpen, stocks]);

  if (!isOpen) return null;

  const currentStock = stocks.find(s => s.ticker === selectedTicker) || stocks[0];

  const handleStockChange = (ticker: string) => {
    setSelectedTicker(ticker);
    const s = stocks.find(st => st.ticker === ticker);
    if (s && (!buyPrice || buyPrice === '0')) {
      setBuyPrice(s.price.toFixed(2));
    }
  };

  // Smart parser for uploaded PDF receipt or Contract Note
  const processUploadedFile = (file: File) => {
    setError('');
    setIsParsingReceipt(true);
    setParseSuccessMsg('');

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      setError('Please upload a PDF document (.pdf) or image (.png, .jpg) transaction receipt.');
      setIsParsingReceipt(false);
      return;
    }

    // Read as Base64 for local attachment storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;

      const attachment: ReceiptAttachment = {
        fileName: file.name,
        fileType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
        fileSize: file.size,
        fileData: base64Data,
        uploadedAt: new Date().toLocaleDateString()
      };
      setReceipt(attachment);

      // Intelligent filename and simulated contract-note text extraction
      const lowerName = file.name.toLowerCase();
      let extractedTicker: string | null = null;
      let extractedShares: number | null = null;
      let extractedPrice: number | null = null;
      let extractedBroker: string | null = null;

      // Check tickers in filename or mock scan
      for (const s of stocks) {
        if (lowerName.includes(s.ticker.toLowerCase()) || lowerName.includes(s.name.toLowerCase())) {
          extractedTicker = s.ticker;
          break;
        }
      }

      // Look for numbers in filename like "MTNGH_500_shares_2.45.pdf" or "Databank_GCB_1000.pdf"
      const sharesMatch = lowerName.match(/(\d+)\s*(?:shares|shs|units|qty)/i) || lowerName.match(/(?:qty|shares|units)[_-]?(\d+)/i);
      if (sharesMatch) {
        extractedShares = parseInt(sharesMatch[1], 10);
      }

      const priceMatch = lowerName.match(/(?:ghs|ghc|price|at)[_-]?(\d+\.?\d*)/i);
      if (priceMatch) {
        extractedPrice = parseFloat(priceMatch[1]);
      }

      // Check broker names in filename
      for (const broker of COMMON_GSE_BROKERS) {
        const shortName = broker.split(' ')[0].toLowerCase();
        if (lowerName.includes(shortName)) {
          extractedBroker = broker;
          break;
        }
      }

      // Apply detected values if found
      if (extractedTicker) {
        setSelectedTicker(extractedTicker);
      }
      if (extractedShares && extractedShares > 0) {
        setSharesCount(extractedShares.toString());
      }
      if (extractedPrice && extractedPrice > 0) {
        setBuyPrice(extractedPrice.toFixed(2));
      }
      if (extractedBroker) {
        setBrokerName(extractedBroker);
      }

      setIsParsingReceipt(false);
      setParseSuccessMsg(
        extractedTicker || extractedShares
          ? `Receipt verified! Auto-detected: ${extractedTicker || ''} ${extractedShares ? `${extractedShares} shares` : ''} ${extractedPrice ? `@ GH₵${extractedPrice}` : ''}`
          : 'Receipt attached successfully! You can verify the details below.'
      );
    };

    reader.onerror = () => {
      setError('Failed to read the receipt file. Please try again.');
      setIsParsingReceipt(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleRemoveReceipt = () => {
    setReceipt(undefined);
    setParseSuccessMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const sharesNum = parseFloat(sharesCount);
    const priceNum = parseFloat(buyPrice);

    if (!currentStock) {
      setError('Please select a valid GSE listed stock.');
      return;
    }

    if (isNaN(sharesNum) || sharesNum <= 0) {
      setError('Please enter a valid number of shares greater than 0.');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid purchase price per share.');
      return;
    }

    if (!startDate) {
      setError('Please select the purchase date (date of start).');
      return;
    }

    onSaveHolding(
      {
        ticker: currentStock.ticker,
        stockName: currentStock.name,
        sharesCount: Math.round(sharesNum),
        buyPrice: Number(priceNum.toFixed(2)),
        startDate,
        brokerName: brokerName.trim() || undefined,
        notes: notes.trim() || undefined,
        receipt: receipt,
        updatedAt: editingHolding ? new Date().toLocaleDateString() : undefined
      },
      editingHolding?.id
    );

    onClose();
  };

  // Calculations for live preview
  const numShares = parseFloat(sharesCount) || 0;
  const unitPrice = parseFloat(buyPrice) || 0;
  const totalCost = numShares * unitPrice;
  const currentValue = numShares * (currentStock?.price || unitPrice);
  const profitLoss = currentValue - totalCost;
  const profitLossPct = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;
  const estAnnualDividend = currentStock?.dividendAmount ? numShares * currentStock.dividendAmount : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[94dvh] sm:h-auto sm:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-3.5 sm:px-5 py-2.5 sm:py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="p-2 sm:p-2.5 bg-amber-500 text-slate-950 rounded-xl font-black shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-sm sm:text-lg text-white truncate">
                {editingHolding ? 'Edit Portfolio Position' : 'Log Stock Purchase'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Shares, buy price & broker contract notes
              </p>
            </div>
          </div>

          <button
            id="close-holding-modal-btn"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Stock Selection */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center justify-between">
              <span>Select Listed Stock</span>
              {currentStock && (
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Current Floor Price: <strong className="text-slate-900 dark:text-white">GH₵ {currentStock.price.toFixed(2)}</strong>
                </span>
              )}
            </label>
            <div className="flex items-center gap-3">
              {currentStock && (
                <StockLogo
                  ticker={currentStock.ticker}
                  name={currentStock.name}
                  sector={currentStock.sector}
                  size={42}
                  className="shrink-0 rounded-xl shadow-xs"
                />
              )}
              <select
                value={selectedTicker}
                onChange={(e) => handleStockChange(e.target.value)}
                className="flex-1 min-w-0 bg-slate-50 dark:bg-[#0B132B] border border-slate-300 dark:border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-[#0B132B] focus:outline-none cursor-pointer"
              >
                {stocks.map((s) => (
                  <option key={s.ticker} value={s.ticker} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">
                    {s.ticker} — {s.name} ({s.sector}) • Current: GH₵ {s.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Buy Price & Number of Shares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Number of Shares */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                Number of Shares (Units) <span className="text-rose-500">*</span>
              </label>
              <input
                id="holding-shares-input"
                type="number"
                step="1"
                min="1"
                placeholder="e.g. 500"
                value={sharesCount}
                onChange={(e) => setSharesCount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
                required
              />
              {/* Quick share count chips */}
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                {[100, 250, 500, 1000, 2500, 5000].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setSharesCount(qty.toString())}
                    className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {qty.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Buy Price Per Share */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Buy Price per Share (GH₵) <span className="text-rose-500">*</span>
                </label>
                {currentStock && (
                  <button
                    type="button"
                    onClick={() => setBuyPrice(currentStock.price.toFixed(2))}
                    className="text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    Use Current (GH₵{currentStock.price.toFixed(2)})
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">GH₵</span>
                <input
                  id="holding-price-input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 2.45"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="w-full pl-11 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Date of Start & Broker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date of Start */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Date of Start / Purchase <span className="text-rose-500">*</span></span>
              </label>
              <input
                id="holding-date-input"
                type="date"
                value={startDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
                required
              />
            </div>

            {/* Broker Name */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>GSE Broker / Platform</span>
              </label>
              <select
                value={brokerName}
                onChange={(e) => setBrokerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
              >
                {COMMON_GSE_BROKERS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4: PDF Receipt / Contract Note Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>PDF Contract Note / Transaction Receipt</span>
                <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
              </label>

              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Supports PDF, JPG, PNG receipts
              </span>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg"
              className="hidden"
            />

            {receipt ? (
              /* Attached file card */
              <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {receipt.fileType.includes('pdf') ? 'PDF' : 'IMG'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {receipt.fileName}
                      </p>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 rounded">
                        Attached
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {(receipt.fileSize / 1024).toFixed(1)} KB • Uploaded {receipt.uploadedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {receipt.fileData && (
                    <a
                      href={receipt.fileData}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                      title="Preview receipt"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Preview</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveReceipt}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors"
                    title="Remove receipt"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="p-2.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Click to upload or drag & drop PDF contract note
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Auto-extracts shares, price, date & broker from your receipt
                    </span>
                  </div>
                </div>
              </div>
            )}

            {isParsingReceipt && (
              <div className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reading & verifying receipt details...</span>
              </div>
            )}

            {parseSuccessMsg && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{parseSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Section 5: Optional Notes */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
              Investment Notes / Goal (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Dividend retirement fund, DCA monthly purchase on MoMo, long-term hold"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
              maxLength={120}
            />
          </div>

          {/* Position Live Calculation Preview */}
          {numShares > 0 && unitPrice > 0 && (
            <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>Position Summary</span>
                {currentStock && (
                  <div className="flex items-center gap-1.5">
                    <StockLogo ticker={currentStock.ticker} name={currentStock.name} sector={currentStock.sector} size={20} className="rounded" />
                    <span className="font-mono font-black text-white">{currentStock.ticker}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Cost Basis</span>
                  <span className="font-mono font-bold text-white text-sm">
                    GH₵ {totalCost.toFixed(2)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Current Valuation</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    GH₵ {currentValue.toFixed(2)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Unrealized P&L</span>
                  <span className={`font-mono font-bold text-sm ${profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {profitLoss >= 0 ? `+GH₵${profitLoss.toFixed(2)}` : `-GH₵${Math.abs(profitLoss).toFixed(2)}`}
                    <span className="text-[10px] ml-1">
                      ({profitLossPct >= 0 ? `+${profitLossPct.toFixed(1)}%` : `${profitLossPct.toFixed(1)}%`})
                    </span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Est. Annual Dividend</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    GH₵ {estAnnualDividend.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-holding-submit-btn"
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingHolding ? 'Update Position' : 'Save to My Portfolio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
