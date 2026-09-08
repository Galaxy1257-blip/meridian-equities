import React, { useState, useEffect } from 'react';
import { 
  X, Bell, Plus, Trash2, Check, AlertTriangle, ArrowUpRight, ArrowDownRight, 
  Clock, ShieldCheck, Power, Sparkles, Sliders, TrendingUp, Briefcase, 
  Newspaper, Radio, Volume2, VolumeX, Smartphone, CheckCircle2, ChevronRight,
  CheckCheck, Info, ExternalLink, Archive, RotateCcw, Send
} from 'lucide-react';
import { Stock, PriceAlert, AlertCondition, AlertNotification, NotificationPreferences, NotificationCategory } from '../types';
import { StockLogo } from './StockLogo';

export interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: Stock[];
  alerts: PriceAlert[];
  notifications: AlertNotification[];
  archivedNotifications?: AlertNotification[];
  onDismissNotification: (id: string) => void;
  onArchiveNotification?: (id: string) => void;
  onRestoreNotification?: (id: string) => void;
  onClearAllNotifications: () => void;
  onClearArchive?: () => void;
  onSendTestPush?: () => void;
  preferences: NotificationPreferences;
  onUpdatePreferences: (newPrefs: Partial<NotificationPreferences>) => void;
  onAddAlert: (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => void;
  onDeleteAlert: (id: string) => void;
  onToggleActive: (id: string) => void;
  onResetTriggered: (id: string) => void;
  onSelectStock: (stock: Stock) => void;
  onViewPortfolio?: () => void;
  onViewNews?: (newsId?: string) => void;
  preselectedTicker?: string | null;
}

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({
  isOpen,
  onClose,
  stocks,
  alerts,
  notifications,
  archivedNotifications = [],
  onDismissNotification,
  onArchiveNotification,
  onRestoreNotification,
  onClearAllNotifications,
  onClearArchive,
  onSendTestPush,
  preferences,
  onUpdatePreferences,
  onAddAlert,
  onDeleteAlert,
  onToggleActive,
  onResetTriggered,
  onSelectStock,
  onViewPortfolio,
  onViewNews,
  preselectedTicker
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'feed' | 'archive' | 'targets' | 'settings'>(
    notifications.length > 0 ? 'feed' : alerts.length > 0 ? 'targets' : 'settings'
  );
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<'ALL' | NotificationCategory>('ALL');
  const [testNotice, setTestNotice] = useState<string>('');

  // Price target creation state
  const [targetSubTab, setTargetSubTab] = useState<'list' | 'create'>('list');
  const [selectedTicker, setSelectedTicker] = useState<string>(
    preselectedTicker || (stocks[0]?.ticker ?? 'MTNGH')
  );
  const [condition, setCondition] = useState<AlertCondition>('ABOVE');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [browserPermState, setBrowserPermState] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermState(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStock = stocks.find(s => s.ticker === selectedTicker) || stocks[0];

  const handleStockChange = (ticker: string) => {
    setSelectedTicker(ticker);
    const s = stocks.find(st => st.ticker === ticker);
    if (s) {
      const delta = condition === 'ABOVE' ? s.price * 1.05 : s.price * 0.95;
      setTargetPrice(delta.toFixed(2));
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(targetPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid target price greater than 0.');
      return;
    }

    if (!currentStock) {
      setError('Please select a valid GSE stock.');
      return;
    }

    onAddAlert({
      ticker: currentStock.ticker,
      stockName: currentStock.name,
      targetPrice: Number(priceNum.toFixed(2)),
      condition,
      initialPrice: currentStock.price,
      note: note.trim() || undefined,
      isActive: true
    });

    setNote('');
    setError('');
    setTargetSubTab('list');
  };

  const handleRequestBrowserPush = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      setBrowserPermState(perm);
      if (perm === 'granted') {
        onUpdatePreferences({ browserPush: true });
        new Notification('🔔 Meridian Equities Push Active', {
          body: 'You will receive real-time push alerts for Ghana stock price triggers, dividend cutoffs, and session updates.',
          icon: '/favicon.ico'
        });
        setTestNotice('✅ Browser push permissions granted & active!');
        setTimeout(() => setTestNotice(''), 4000);
      } else {
        onUpdatePreferences({ browserPush: false });
      }
    }
  };

  const handleSendTestPush = () => {
    if (onSendTestPush) {
      onSendTestPush();
      setTestNotice('✅ Test notification sent!');
      setTimeout(() => setTestNotice(''), 3500);
      return;
    }
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🔔 Meridian GSE Test Notification', {
          body: 'Push alerts are working perfectly! You will receive live alerts for stock moves and market filings.',
          icon: '/favicon.ico'
        });
        setTestNotice('✅ Test notification delivered to your OS!');
        setTimeout(() => setTestNotice(''), 3500);
      } else {
        handleRequestBrowserPush();
      }
    }
  };

  // Filtered active notifications
  const filteredNotifications = notifications.filter(n => {
    if (feedCategoryFilter === 'ALL') return true;
    if (feedCategoryFilter === 'STOCK') {
      return n.category === 'STOCK' || n.type === 'STOCK_SURGE' || n.type === 'PRICE_ALERT' || !n.type;
    }
    if (feedCategoryFilter === 'PORTFOLIO') {
      return n.category === 'PORTFOLIO' || n.type === 'PORTFOLIO_MILESTONE' || n.type === 'DIVIDEND_REMINDER';
    }
    if (feedCategoryFilter === 'NEWS') {
      return n.category === 'NEWS' || n.type === 'MAJOR_NEWS';
    }
    if (feedCategoryFilter === 'MARKET') {
      return n.category === 'MARKET' || n.type === 'MARKET_OPEN' || n.type === 'MARKET_CLOSE';
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#080E20] w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/[0.1] overflow-hidden flex flex-col h-[94dvh] sm:h-auto sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Header */}
        <div className="bg-[#040816] text-white px-3.5 sm:px-5 py-2.5 sm:py-4 flex items-center justify-between border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-xl sm:rounded-2xl shadow-md shrink-0">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 font-black" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-lg text-white tracking-tight truncate">
                  Alerts & Notifications Hub
                </h3>
                {notifications.length > 0 && (
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse shrink-0">
                    {notifications.length} active
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-mono truncate">
                Live alerts, archived history, and push settings
              </p>
            </div>
          </div>

          <button
            id="close-price-alerts-modal-btn"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* 2. Top-level Navigation Tabs */}
        <div className="bg-slate-100 dark:bg-[#060B18] px-2.5 sm:px-3 py-1.5 sm:py-2 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setActiveMainTab('feed')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMainTab === 'feed'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-white dark:bg-[#0B132B] text-slate-600 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Live Feed ({notifications.length})</span>
            </button>

            <button
              onClick={() => setActiveMainTab('archive')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMainTab === 'archive'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-white dark:bg-[#0B132B] text-slate-600 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive ({archivedNotifications.length})</span>
            </button>

            <button
              onClick={() => setActiveMainTab('targets')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMainTab === 'targets'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-white dark:bg-[#0B132B] text-slate-600 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Targets ({alerts.length})</span>
            </button>

            <button
              onClick={() => setActiveMainTab('settings')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMainTab === 'settings'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-white dark:bg-[#0B132B] text-slate-600 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Settings & Push</span>
            </button>
          </div>

          {activeMainTab === 'feed' && notifications.length > 0 && (
            <button
              onClick={onClearAllNotifications}
              className="text-[11px] font-mono text-amber-600 dark:text-amber-400 hover:underline font-bold px-2 py-1 rounded hover:bg-amber-500/10 transition-colors cursor-pointer shrink-0"
              title="Move all active notifications to archive"
            >
              Archive All
            </button>
          )}

          {activeMainTab === 'archive' && archivedNotifications.length > 0 && onClearArchive && (
            <button
              onClick={onClearArchive}
              className="text-[11px] font-mono text-rose-500 hover:text-rose-400 font-bold px-2 py-1 rounded hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              title="Permanently remove archived history"
            >
              Clear Archive
            </button>
          )}
        </div>

        {/* 3. Modal Body Content */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 sm:space-y-4 flex-1">
          
          {/* TAB 1: NOTIFICATIONS FEED */}
          {activeMainTab === 'feed' && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {[
                  { id: 'ALL', label: 'All Alerts' },
                  { id: 'STOCK', label: '📈 Stocks' },
                  { id: 'PORTFOLIO', label: '💼 Portfolio' },
                  { id: 'NEWS', label: '📰 Major News' },
                  { id: 'MARKET', label: '🏛️ Floor' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFeedCategoryFilter(tab.id as any)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                      feedCategoryFilter === tab.id
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-200 dark:border-white/[0.08]">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/[0.05] flex items-center justify-center mx-auto text-slate-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      You are all caught up!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                      No unread alerts matching this filter. As price thresholds, portfolio milestones, dividend filings, or major news break, they will appear here.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveMainTab('settings')}
                    className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-white/[0.08] hover:bg-slate-300 dark:hover:bg-white/[0.12] text-xs font-mono font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    Manage Alert Rules
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredNotifications.map((n) => {
                    const isMarket = n.type === 'MARKET_OPEN' || n.type === 'MARKET_CLOSE';
                    const isPortfolio = n.type === 'PORTFOLIO_MILESTONE' || n.type === 'DIVIDEND_REMINDER';
                    const isNews = n.type === 'MAJOR_NEWS';
                    const isSurge = n.type === 'STOCK_SURGE';

                    const stock = stocks.find(s => s.ticker === n.ticker);

                    return (
                      <div
                        key={n.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isPortfolio
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                            : isNews
                            ? 'bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-800/40'
                            : isSurge
                            ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
                            : isMarket
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/40'
                            : 'bg-white dark:bg-[#0B132B] border-slate-200 dark:border-white/[0.08]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl text-slate-950 font-bold shrink-0 text-sm ${
                            isPortfolio
                              ? 'bg-emerald-400'
                              : isNews
                              ? 'bg-cyan-400'
                              : isSurge
                              ? 'bg-amber-400'
                              : isMarket
                              ? 'bg-indigo-400'
                              : 'bg-amber-400'
                          }`}>
                            {isPortfolio ? '💼' : isNews ? '📰' : isSurge ? '🚀' : isMarket ? '🏛️' : '🔔'}
                          </div>

                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap text-xs">
                              <span className={`text-[10px] font-mono font-black tracking-wider uppercase px-1.5 py-0.2 rounded ${
                                isPortfolio
                                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                  : isNews
                                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                                  : isSurge
                                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}>
                                {isPortfolio ? 'PORTFOLIO' : isNews ? 'MAJOR NEWS' : isSurge ? 'SURGE' : isMarket ? 'FLOOR' : 'PRICE TARGET'}
                              </span>
                              <span className="text-slate-400 text-[10px] font-mono">{n.timestamp}</span>
                            </div>

                            <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                              {n.title || n.stockName || n.ticker}
                            </h5>

                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {stock && (
                            <button
                              onClick={() => {
                                onSelectStock(stock);
                                onClose();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                            >
                              Inspect Stock
                            </button>
                          )}
                          {isPortfolio && onViewPortfolio && (
                            <button
                              onClick={() => {
                                onViewPortfolio();
                                onClose();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors cursor-pointer"
                            >
                              View Portfolio
                            </button>
                          )}
                          {isNews && onViewNews && (
                            <button
                              onClick={() => {
                                onViewNews(n.newsId);
                                onClose();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
                            >
                              Read News
                            </button>
                          )}
                          <button
                            onClick={() => onDismissNotification(n.id)}
                            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                            title="Dismiss"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ARCHIVED NOTIFICATIONS */}
          {activeMainTab === 'archive' && (
            <div className="space-y-3">
              {archivedNotifications.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-200 dark:border-white/[0.08]">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                    <Archive className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Archive is Empty
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                      Dismissed notifications, price target hits, and past market alerts will be kept here safely so you never lose your history.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {archivedNotifications.map((n) => {
                    const stock = stocks.find((s) => s.ticker === n.ticker);
                    const isPortfolio = n.category === 'PORTFOLIO';
                    const isNews = n.category === 'NEWS';

                    return (
                      <div
                        key={n.id}
                        className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#070D1F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-white/[0.15] transition-all"
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {stock ? (
                            <StockLogo ticker={stock.ticker} name={stock.name} size={36} />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                              <Archive className="w-4 h-4" />
                            </div>
                          )}

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {n.category}
                              </span>
                              {n.timestamp && (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {n.timestamp}
                                </span>
                              )}
                              {n.archivedAt && (
                                <span className="text-[10px] text-amber-500/90 font-mono font-semibold">
                                  • Archived at {n.archivedAt}
                                </span>
                              )}
                            </div>

                            <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                              {n.title || n.stockName || n.ticker}
                            </h5>

                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {onRestoreNotification && (
                            <button
                              type="button"
                              onClick={() => onRestoreNotification(n.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Restore to active live feed"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                              <span>Restore</span>
                            </button>
                          )}
                          {stock && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectStock(stock);
                                onClose();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                            >
                              Inspect
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {activeMainTab === 'targets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setTargetSubTab('list')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      targetSubTab === 'list'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Active Targets ({alerts.length})
                  </button>
                  <button
                    onClick={() => {
                      setTargetSubTab('create');
                      if (!targetPrice && currentStock) {
                        const delta = condition === 'ABOVE' ? currentStock.price * 1.05 : currentStock.price * 0.95;
                        setTargetPrice(delta.toFixed(2));
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      targetSubTab === 'create'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Set New Alert</span>
                  </button>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Evaluated on live floor feed
                </span>
              </div>

              {targetSubTab === 'create' ? (
                <form onSubmit={handleCreateAlert} className="space-y-4 bg-slate-50 dark:bg-[#0B132B] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Configure Stock Price Trigger</span>
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Select Stock on Ghana Stock Exchange
                    </label>
                    <select
                      value={selectedTicker}
                      onChange={(e) => handleStockChange(e.target.value)}
                      className="w-full bg-white dark:bg-[#070D1F] border border-slate-300 dark:border-white/[0.1] rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                    >
                      {stocks.map((s) => (
                        <option key={s.ticker} value={s.ticker} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">
                          {s.ticker} — {s.name} (Current: GH₵ {s.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Alert Trigger Condition
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCondition('ABOVE');
                          if (currentStock) setTargetPrice((currentStock.price * 1.05).toFixed(2));
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          condition === 'ABOVE'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                            : 'bg-white dark:bg-[#070D1F] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                          <span>Rises Above (≥)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Take profit target</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCondition('BELOW');
                          if (currentStock) setTargetPrice((currentStock.price * 0.95).toFixed(2));
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          condition === 'BELOW'
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500'
                            : 'bg-white dark:bg-[#070D1F] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <ArrowDownRight className="w-4 h-4 text-rose-500" />
                          <span>Falls Below (≤)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Buy the dip / Stop loss</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Target Price (GH₵)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">GH₵</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        className="w-full bg-white dark:bg-[#070D1F] border border-slate-300 dark:border-white/[0.1] rounded-xl pl-12 pr-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Reason / Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Buy dip for quarterly dividend, or execute via Databank"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full bg-white dark:bg-[#070D1F] border border-slate-300 dark:border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Alert Rule</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetSubTab('list')}
                      className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-white/[0.08] hover:bg-slate-300 dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {alerts.length === 0 ? (
                    <div className="text-center py-12 px-4 space-y-3 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-200 dark:border-white/[0.08]">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          No Stock Price Targets Configured
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                          Set automated price triggers for stocks like MTNGH, GCB, BOPP, or TOTAL to get notified the second your buy/sell target hits.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setTargetSubTab('create');
                          if (!targetPrice && currentStock) {
                            const delta = condition === 'ABOVE' ? currentStock.price * 1.05 : currentStock.price * 0.95;
                            setTargetPrice(delta.toFixed(2));
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Create Your First Target
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {alerts.map((al) => {
                        const st = stocks.find(s => s.ticker === al.ticker);
                        const isTriggered = al.triggered;

                        return (
                          <div
                            key={al.id}
                            className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              !al.isActive
                                ? 'opacity-50 bg-slate-50 dark:bg-[#070D1F] border-slate-200 dark:border-white/[0.04]'
                                : isTriggered
                                ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/50'
                                : 'bg-white dark:bg-[#0B132B] border-slate-200 dark:border-white/[0.08]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <StockLogo ticker={al.ticker} name={al.stockName} size={36} />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                                    {al.ticker}
                                  </span>
                                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                    al.condition === 'ABOVE'
                                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                      : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                                  }`}>
                                    {al.condition === 'ABOVE' ? '≥ RISE' : '≤ DROP'} GH₵ {al.targetPrice.toFixed(2)}
                                  </span>
                                  {isTriggered && (
                                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                                      TRIGGERED
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                  Live: GH₵ {st?.price.toFixed(2) || al.initialPrice.toFixed(2)}
                                  {al.note && ` • "${al.note}"`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {isTriggered && (
                                <button
                                  onClick={() => onResetTriggered(al.id)}
                                  className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30 transition-colors cursor-pointer text-xs"
                                  title="Rearm / Reset trigger"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => onToggleActive(al.id)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  al.isActive
                                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-slate-300'
                                }`}
                                title={al.isActive ? 'Pause rule' : 'Resume rule'}
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteAlert(al.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/20 transition-colors cursor-pointer"
                                title="Delete rule"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CONFIGURE & PUSH DELIVERY */}
          {activeMainTab === 'settings' && (
            <div className="space-y-5">
              {testNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{testNotice}</span>
                </div>
              )}

              {/* 1. Dedicated Browser Push Notifications Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-[#0B132B] to-[#070D1F] border border-cyan-500/30 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white">
                          Operating System Push Notifications
                        </h4>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                          browserPermState === 'granted'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : browserPermState === 'denied'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {browserPermState === 'granted' ? '● Permitted' : browserPermState === 'denied' ? '● Blocked' : '● Action Required'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Receive instant stock price hits, market open/close, and major dividend notices even when browsing other apps.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.08]">
                  {browserPermState !== 'granted' ? (
                    <button
                      type="button"
                      onClick={handleRequestBrowserPush}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Allow Push Notifications</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendTestPush}
                      className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test Push Alert</span>
                    </button>
                  )}

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer ml-auto">
                    <span>Active in Background</span>
                    <input
                      type="checkbox"
                      checked={preferences.browserPush}
                      onChange={(e) => {
                        if (e.target.checked && browserPermState !== 'granted') {
                          handleRequestBrowserPush();
                        } else {
                          onUpdatePreferences({ browserPush: e.target.checked });
                        }
                      }}
                      className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* 2. Notification Category Subscriptions */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  CATEGORY SUBSCRIPTIONS
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#070D1F] border border-slate-200 dark:border-white/[0.08] cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Stock Price Triggers</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Custom rise/drop price targets</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.stockPriceAlerts}
                      onChange={(e) => onUpdatePreferences({ stockPriceAlerts: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#070D1F] border border-slate-200 dark:border-white/[0.08] cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Daily Surges (±5%)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Unusual volume and price spikes</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.stockSurgeAlerts}
                      onChange={(e) => onUpdatePreferences({ stockSurgeAlerts: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#070D1F] border border-slate-200 dark:border-white/[0.08] cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Dividends & Record Dates</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Ex-dividend and books closure</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.dividendReminders}
                      onChange={(e) => onUpdatePreferences({ dividendReminders: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#070D1F] border border-slate-200 dark:border-white/[0.08] cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Major Regulatory News</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">SEC filings, IPOs, earnings</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.majorNewsAlerts}
                      onChange={(e) => onUpdatePreferences({ majorNewsAlerts: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* 3. Audio Chime */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  SOUND CHANNELS
                </span>
                <label className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#070D1F] border border-slate-200 dark:border-white/[0.08] cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Acoustic Audio Chime</span>
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      Play an institutional two-tone chime whenever an alert triggers.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.audioChime}
                    onChange={(e) => onUpdatePreferences({ audioChime: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer shrink-0"
                  />
                </label>
              </div>
            </div>
          )}

        </div>

        {/* 4. Modal Footer */}
        <div className="bg-slate-100 dark:bg-[#060B18] p-4 px-6 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted local rules engine • Synchronized on floor ticks</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
