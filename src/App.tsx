/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, Sparkles, Heart, HelpCircle, Layers, X, TrendingUp, RefreshCw, 
  Bell, Briefcase, Plus, Newspaper, LayoutGrid, Table, Home, Users, MessageSquare, 
  BookOpen, Zap, Shield, ShieldCheck, ArrowRightLeft, FileText, CheckCircle2, Lock, Activity,
  Calculator, Building2, Menu, User
} from 'lucide-react';
import { Stock, SortOption, SectorFilter, PriceAlert, AlertNotification, NotificationPreferences, PortfolioHolding, GSEMarketNews, MainNavTab, UserProfile } from './types';
import { INITIAL_STOCKS, INITIAL_INDICES } from './data/stocksData';
import { INITIAL_GSE_NEWS } from './data/newsData';
import { Header } from './components/Header';
import { StockCard } from './components/StockCard';
import { StockTable } from './components/StockTable';
import { StockDetailModal } from './components/StockDetailModal';
import { JargonBottomSheet } from './components/JargonBottomSheet';
import { AdmobBannerCard } from './components/AdmobBannerCard';
import { ExchangeRateModal } from './components/ExchangeRateModal';
import { DividendCalendarModal } from './components/DividendCalendarModal';
import { MarketOverview } from './components/MarketOverview';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { AlertToastContainer } from './components/AlertToastContainer';
import { PortfolioSection } from './components/PortfolioSection';
import { AddEditHoldingModal } from './components/AddEditHoldingModal';
import { ReceiptViewerModal } from './components/ReceiptViewerModal';
import { NewsSection } from './components/NewsSection';
import { NewsDetailModal } from './components/NewsDetailModal';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeDashboard } from './components/HomeDashboard';
import { CommunitySection } from './components/CommunitySection';
import { InvestorChatSection } from './components/InvestorChatSection';
import { OnboardingTourModal } from './components/OnboardingTourModal';
import { CalculatorsSection } from './components/CalculatorsSection';
import { LearnInvestingSection } from './components/LearnInvestingSection';
import { MarketCloseReportModal } from './components/MarketCloseReportModal';
import { AuthOnboardingModal } from './components/AuthOnboardingModal';
import { MeridianAI } from './components/MeridianAI';
import { SubscriptionPlansModal } from './components/SubscriptionPlansModal';
import { BiometricSandbox } from './components/BiometricSandbox';

import { FXSlippageShield } from './components/FXSlippageShield';
import { StockBrokersModal } from './components/StockBrokersModal';
import { RisingCediLogo } from './components/RisingCediLogo';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { useFXSync } from './hooks/useFXSync';
import { useOfflineCache } from './hooks/useOfflineCache';
import { useSignals } from './hooks/useSignals';
import { SubscriptionTier } from './types';
import { fetchGhanaStockMarket, ApiStatus } from './services/ghanaStockApi';

const STORAGE_KEY_STOCKS = 'gse_tracker_stocks_v1';
const STORAGE_KEY_VOTES = 'gse_tracker_user_votes_v1';
const STORAGE_KEY_RATE = 'gse_tracker_usd_rate_v1';
const STORAGE_KEY_PRO = 'gse_tracker_show_pro_v1';
const STORAGE_KEY_ALERTS = 'gse_tracker_price_alerts_v1';
const STORAGE_KEY_PORTFOLIO = 'gse_tracker_portfolio_v1';
const STORAGE_KEY_THEME = 'gse_tracker_theme_v1';
const STORAGE_KEY_NEWS = 'gse_tracker_news_v1';
const STORAGE_KEY_NEWS_BOOKMARKS = 'gse_tracker_news_bookmarks_v1';
const STORAGE_KEY_ONBOARDING = 'gse_tracker_has_seen_onboarding_v1';
const STORAGE_KEY_USER_PROFILE = 'gse_tracker_user_profile_v1';
const STORAGE_KEY_NOTIFICATION_PREFS = 'gse_tracker_notification_prefs_v1';
const STORAGE_KEY_NOTIFICATIONS = 'gse_tracker_notifications_v1';
const STORAGE_KEY_NOTIFICATIONS_ARCHIVED = 'gse_tracker_notifications_archived_v1';
const STORAGE_KEY_PRO_PASS_EXPIRY = 'meridian_pro_pass_expiry';

const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  stockPriceAlerts: true,
  stockSurgeAlerts: true,
  portfolioMilestones: true,
  dividendReminders: true,
  majorNewsAlerts: true,
  marketHoursAlerts: true,
  audioChime: true,
  browserPush: false,
};

const DEFAULT_SAMPLE_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'holding-sample-mtn',
    ticker: 'MTNGH',
    stockName: 'MTN Ghana',
    sharesCount: 1500,
    buyPrice: 2.10,
    startDate: '2024-01-15',
    brokerName: 'Databank Brokerage Ltd',
    notes: 'Long-term telecom growth & quarterly cash dividends',
    createdAt: '2024-01-15'
  },
  {
    id: 'holding-sample-gcb',
    ticker: 'GCB',
    stockName: 'GCB Bank PLC',
    sharesCount: 600,
    buyPrice: 5.20,
    startDate: '2024-03-20',
    brokerName: 'IC Securities Ghana',
    notes: 'Banking sector recovery & strong book value',
    createdAt: '2024-03-20'
  },
  {
    id: 'holding-sample-bopp',
    ticker: 'BOPP',
    stockName: 'Benso Oil Palm Plantation',
    sharesCount: 150,
    buyPrice: 18.00,
    startDate: '2024-02-10',
    brokerName: 'CalBank Brokerage Ltd',
    notes: 'Agric export commodity play with massive dividend yield',
    createdAt: '2024-02-10'
  }
];

export default function App() {
  // Stocks state
  const [stocks, setStocks] = useState<Stock[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STOCKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved stocks', e);
      }
    }
    return INITIAL_STOCKS;
  });

  // Ghana Stock Market API live status
  const [apiStatus, setApiStatus] = useState<ApiStatus>('CONNECTING');
  const [apiSource, setApiSource] = useState<string>('api.ghana-api.dev');

  // Price Alerts state
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ALERTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved alerts', e);
      }
    }
    return [];
  });

  // Portfolio Holdings state
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved portfolio', e);
      }
    }
    return DEFAULT_SAMPLE_HOLDINGS;
  });

  // Market News state
  const [newsList, setNewsList] = useState<GSEMarketNews[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NEWS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved news', e);
      }
    }
    return INITIAL_GSE_NEWS;
  });

  const [bookmarkedNewsIds, setBookmarkedNewsIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NEWS_BOOKMARKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved bookmarks', e);
      }
    }
    return [];
  });

  const [selectedNews, setSelectedNews] = useState<GSEMarketNews | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState<boolean>(false);

  const handleToggleNewsBookmark = (newsId: string) => {
    setBookmarkedNewsIds((prev) =>
      prev.includes(newsId) ? prev.filter((id) => id !== newsId) : [...prev, newsId]
    );
  };

  // Portfolio Modals
  const [isAddHoldingModalOpen, setIsAddHoldingModalOpen] = useState<boolean>(false);
  const [editingHolding, setEditingHolding] = useState<PortfolioHolding | null>(null);
  const [preselectedHoldingTicker, setPreselectedHoldingTicker] = useState<string | null>(null);
  const [viewingReceiptHolding, setViewingReceiptHolding] = useState<PortfolioHolding | null>(null);

  // Active toast notifications for triggered alerts
  const [notifications, setNotifications] = useState<AlertNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved notifications', e);
      }
    }
    return [
      {
        id: 'initial-welcome-notif',
        category: 'MARKET',
        type: 'MARKET_OPEN',
        ticker: 'GSE-CI',
        stockName: 'Ghana Stock Exchange',
        title: 'Continuous Floor Session Active',
        message: 'Official GSE continuous trading floor is OPEN. Real-time order matching active across all 39 equities.',
        timestamp: '10:00 GMT',
        read: false
      }
    ];
  });

  const [archivedNotifications, setArchivedNotifications] = useState<AlertNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS_ARCHIVED);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved archived notifications', e);
      }
    }
    return [];
  });

  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState<boolean>(false);
  const [preselectedAlertTicker, setPreselectedAlertTicker] = useState<string | null>(null);

  // Subscription & Pro Pass State
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(() => {
    return (localStorage.getItem('meridian_subscription_tier') as SubscriptionTier) || 'FREE';
  });

  const [proPassExpiry, setProPassExpiry] = useState<number | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PRO_PASS_EXPIRY);
    if (saved) {
      const exp = parseInt(saved, 10);
      if (!isNaN(exp) && exp > Date.now()) return exp;
    }
    return null;
  });

  const isProActive = subscriptionTier !== 'FREE' || Boolean(proPassExpiry && proPassExpiry > Date.now());

  // Notification Preferences State (stocks, portfolio, news, push, chime)
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATION_PREFS);
    if (saved) {
      try {
        return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to load saved notification preferences', e);
      }
    }
    return DEFAULT_NOTIFICATION_PREFS;
  });

  const handleUpdateNotificationPrefs = (newPrefs: Partial<NotificationPreferences>) => {
    setNotificationPrefs((prev) => ({ ...prev, ...newPrefs }));
  };

  // User votes state (ticker -> boolean: true = bull, false = bear)
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VOTES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved votes', e);
      }
    }
    return {};
  });

  // Currency & exchange rate
  const [exchangeRateUsd, setExchangeRateUsd] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RATE);
    return saved ? parseFloat(saved) : 15.5;
  });
  const [currency, setCurrency] = useState<'GHS' | 'USD'>('GHS');

  // Mode: Easy vs Pro (Requires active subscription or Pro pass to remain active)
  const [showPro, setShowPro] = useState<boolean>(() => {
    const savedTier = localStorage.getItem('meridian_subscription_tier');
    const savedExpiry = localStorage.getItem(STORAGE_KEY_PRO_PASS_EXPIRY);
    const hasValidPass = savedExpiry ? parseInt(savedExpiry, 10) > Date.now() : false;
    const hasProTier = savedTier === 'PRO' || savedTier === 'INSTITUTIONAL';
    if (!hasProTier && !hasValidPass) return false;
    const saved = localStorage.getItem(STORAGE_KEY_PRO);
    return saved ? JSON.parse(saved) : false;
  });

  // Theme: Light vs Dark
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Sync theme with document class and localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // UI Navigation & Filters (Bottom Navigation Bar tabs: home, markets, community, portfolio, chat, news)
  const [activeTab, setActiveTab] = useState<MainNavTab>('home');
  const [stocksSubTab, setStocksSubTab] = useState<'all' | 'watchlist'>('all');
  const [marketsViewMode, setMarketsViewMode] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<SectorFilter>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.OVERALL);

  // First-time opening logic:
  // On first launch, open SMS Auth / Onboarding if user is not verified yet
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // User Profile & SMS Auth state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER_PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    return null;
  });

  // SMS and Profile Authentication Modal (opened on-demand via header / sidebar buttons)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const handleCloseOnboarding = () => {
    localStorage.setItem(STORAGE_KEY_ONBOARDING, 'true');
    setIsOnboardingOpen(false);
  };

  const handleOpenOnboarding = () => {
    setIsOnboardingOpen(true);
  };

  // Status & Timestamps
  const [lastUpdated, setLastUpdated] = useState<string>('Last updated: Just now');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleSaveUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEY_ONBOARDING, 'true');
  };

  const handleCloseAuthModal = () => {
    localStorage.setItem(STORAGE_KEY_ONBOARDING, 'true');
    setIsAuthModalOpen(false);
  };

  const handleLogoutUserProfile = () => {
    setUserProfile(null);
    localStorage.removeItem(STORAGE_KEY_USER_PROFILE);
  };

  // Modals
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [jargonModal, setJargonModal] = useState<{ isOpen: boolean; initialId: string | null }>({
    isOpen: false,
    initialId: null
  });
  const [isRateModalOpen, setIsRateModalOpen] = useState<boolean>(false);
  const [isDividendModalOpen, setIsDividendModalOpen] = useState<boolean>(false);
  const [isMarketCloseModalOpen, setIsMarketCloseModalOpen] = useState<boolean>(false);

  // Meridian Equities Advanced Terminal Modals & State
  const [isWallflakeOpen, setIsWallflakeOpen] = useState<boolean>(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState<boolean>(false);

  const [isFXShieldOpen, setIsFXShieldOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isMobileLeftPaneOpen, setIsMobileLeftPaneOpen] = useState<boolean>(false);
  const [isBrokersModalOpen, setIsBrokersModalOpen] = useState<boolean>(false);
  const [isBiometricLocked, setIsBiometricLocked] = useState<boolean>(() => {
    return localStorage.getItem('meridian_biometric_enabled') === 'true';
  });

  // Check Pro pass expiration periodically
  useEffect(() => {
    const checkPassExpiry = () => {
      if (proPassExpiry && Date.now() > proPassExpiry) {
        setProPassExpiry(null);
        localStorage.removeItem(STORAGE_KEY_PRO_PASS_EXPIRY);
        if (subscriptionTier === 'FREE') {
          setShowPro(false);
        }
      }
    };
    checkPassExpiry();
    const interval = setInterval(checkPassExpiry, 15000);
    return () => clearInterval(interval);
  }, [proPassExpiry, subscriptionTier]);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K opens Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Offline caching & Live FX sync hooks
  const { isOnline, saveMarketData } = useOfflineCache();
  const { 
    rate: liveUsdRate, 
    isLive: isLiveFx, 
    lastUpdated: fxLastUpdated, 
    source: fxSource, 
    refetch: refetchFx 
  } = useFXSync();
  const marketSignals = useSignals(stocks);

  // Sync FX rate when live real-time rate updates (unless user explicitly locked a custom rate)
  useEffect(() => {
    const isManualOverride = localStorage.getItem('meridian_fx_manual_override') === 'true';
    if (!isManualOverride && liveUsdRate && Math.abs(liveUsdRate - exchangeRateUsd) > 0.001) {
      setExchangeRateUsd(Number(liveUsdRate.toFixed(2)));
    }
  }, [liveUsdRate]);

  // Lock body scroll whenever any modal or side drawer is open to prevent background movement
  const isAnyModalOpen = Boolean(
    selectedStock ||
    jargonModal.isOpen ||
    isRateModalOpen ||
    isDividendModalOpen ||
    isMarketCloseModalOpen ||
    isWallflakeOpen ||
    isSubscriptionOpen ||
    isFXShieldOpen ||
    isCommandPaletteOpen ||
    isMobileLeftPaneOpen ||
    isBrokersModalOpen ||
    isAuthModalOpen ||
    isNewsModalOpen ||
    isAlertsModalOpen ||
    isAddHoldingModalOpen ||
    viewingReceiptHolding ||
    isOnboardingOpen
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isAnyModalOpen]);

  // Sync live Ghana Stock Exchange data from https://api.ghana-api.dev/api/v1/stock-market
  useEffect(() => {
    let isMounted = true;
    fetchGhanaStockMarket()
      .then((res) => {
        if (!isMounted) return;
        setApiStatus(res.status);
        setApiSource(res.source);
        if (res.stocks && res.stocks.length > 0) {
          setStocks(res.stocks);
          const now = new Date();
          const formatTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastUpdated(`Last updated: Today at ${formatTime}`);
        }
      })
      .catch((err) => {
        console.warn('Ghana Stock API sync notice:', err);
        if (isMounted) setApiStatus('STANDBY_FALLBACK');
      });
    return () => { isMounted = false; };
  }, []);

  // Periodic background auto-refresh to keep live stock prices updated from GSE API (every 60 seconds)
  useEffect(() => {
    const autoRefresh = async () => {
      try {
        const res = await fetchGhanaStockMarket(true);
        if (res.stocks && res.stocks.length > 0) {
          setStocks(res.stocks);
          setApiStatus(res.status);
          setApiSource(res.source);
          const now = new Date();
          const formatTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastUpdated(`Last updated: Today at ${formatTime}`);
        }
      } catch (err) {
        // Keep active cache on network error
      }
    };

    const interval = setInterval(autoRefresh, 60000); // 60s background refresh
    return () => clearInterval(interval);
  }, []);

  // Sync market data to IndexedDB
  useEffect(() => {
    saveMarketData(stocks);
  }, [stocks, saveMarketData]);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STOCKS, JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NEWS_BOOKMARKS, JSON.stringify(bookmarkedNewsIds));
  }, [bookmarkedNewsIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VOTES, JSON.stringify(userVotes));
  }, [userVotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RATE, exchangeRateUsd.toString());
  }, [exchangeRateUsd]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRO, JSON.stringify(showPro));
  }, [showPro]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFICATION_PREFS, JSON.stringify(notificationPrefs));
  }, [notificationPrefs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS_ARCHIVED, JSON.stringify(archivedNotifications));
  }, [archivedNotifications]);

  // Audio tone generator for alert notification
  const playAlertSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // Ignore audio errors if blocked
    }
  };

  // Central Notification Dispatcher (Honors User Category & Delivery Preferences)
  const triggerNotification = (notif: AlertNotification) => {
    // 1. Check User Category Toggles
    if (notif.category === 'STOCK') {
      if (notif.type === 'STOCK_SURGE' && !notificationPrefs.stockSurgeAlerts) return;
      if (notif.type === 'PRICE_ALERT' && !notificationPrefs.stockPriceAlerts) return;
    }
    if (notif.category === 'PORTFOLIO') {
      if (notif.type === 'PORTFOLIO_MILESTONE' && !notificationPrefs.portfolioMilestones) return;
      if (notif.type === 'DIVIDEND_REMINDER' && !notificationPrefs.dividendReminders) return;
    }
    if (notif.category === 'NEWS' && !notificationPrefs.majorNewsAlerts) return;
    if (notif.category === 'MARKET' && !notificationPrefs.marketHoursAlerts) return;

    // 2. Prepend to active notification list & toasts (keep up to 30 active items)
    setNotifications((prev) => [notif, ...prev.filter((n) => n.id !== notif.id)].slice(0, 30));

    // 3. Audio chime if enabled
    if (notificationPrefs.audioChime) {
      playAlertSound();
    }

    // 4. Browser push notification if permitted and active
    if (
      notificationPrefs.browserPush &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(notif.title || notif.stockName || 'Meridian Equities Alert', {
          body: notif.message || `${notif.ticker}: GH₵ ${notif.actualPrice?.toFixed(2)}`,
          icon: '/favicon.ico',
        });
      } catch (err) {
        console.warn('Browser push notification delivery error:', err);
      }
    }
  };

  // Monitor stock prices against active price alerts
  useEffect(() => {
    if (alerts.length === 0 || stocks.length === 0) return;

    let hasChanges = false;
    const newNotifications: AlertNotification[] = [];

    const updatedAlerts = alerts.map((alert) => {
      if (!alert.isActive || alert.triggered) return alert;

      const stock = stocks.find((s) => s.ticker === alert.ticker);
      if (!stock) return alert;

      const isTriggered =
        (alert.condition === 'ABOVE' && stock.price >= alert.targetPrice) ||
        (alert.condition === 'BELOW' && stock.price <= alert.targetPrice);

      if (isTriggered) {
        hasChanges = true;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        newNotifications.push({
          id: `toast-${alert.id}-${Date.now()}`,
          alertId: alert.id,
          category: 'STOCK',
          type: 'PRICE_ALERT',
          ticker: alert.ticker,
          stockName: alert.stockName,
          targetPrice: alert.targetPrice,
          actualPrice: stock.price,
          condition: alert.condition,
          title: `Price Target Hit: ${alert.ticker}`,
          message: `${alert.ticker} reached GH₵ ${stock.price.toFixed(2)}, crossing your ${alert.condition === 'ABOVE' ? 'upper target' : 'lower stop'} of GH₵ ${alert.targetPrice.toFixed(2)}.`,
          timestamp,
          read: false
        });

        return {
          ...alert,
          triggered: true,
          triggeredAt: timestamp
        };
      }

      return alert;
    });

    if (hasChanges) {
      setAlerts(updatedAlerts);
      newNotifications.forEach(triggerNotification);
    }
  }, [stocks, alerts, notificationPrefs]);

  // Stock Surges & Dips Monitor (>= 3.0% session price movement)
  useEffect(() => {
    if (!notificationPrefs.stockSurgeAlerts || stocks.length === 0) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const bigMovers = stocks.filter((s) => Math.abs(s.changePercent) >= 3.0);

    bigMovers.forEach((stock) => {
      const surgeKey = `notif_surge_${stock.ticker}_${todayStr}`;
      if (!sessionStorage.getItem(surgeKey)) {
        sessionStorage.setItem(surgeKey, 'true');
        const isGain = stock.changePercent > 0;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        triggerNotification({
          id: `surge-${stock.ticker}-${Date.now()}`,
          alertId: `surge-${stock.ticker}`,
          category: 'STOCK',
          type: 'STOCK_SURGE',
          ticker: stock.ticker,
          stockName: stock.name,
          actualPrice: stock.price,
          title: `${stock.ticker} ${isGain ? 'Surging' : 'Dipping'} ${isGain ? '+' : ''}${stock.changePercent.toFixed(2)}%`,
          message: `${stock.name} is experiencing sharp intraday movement (${isGain ? '+' : ''}GH₵ ${stock.change.toFixed(2)}). Session volume: ${stock.volume.toLocaleString()} shares.`,
          timestamp,
          read: false,
          actionLabel: 'View Chart'
        });
      }
    });
  }, [stocks, notificationPrefs.stockSurgeAlerts]);

  // Portfolio Milestones & Dividend Reminders on Held Shares
  useEffect(() => {
    if (holdings.length === 0 || stocks.length === 0) return;

    // Calculate total cost and current value
    let totalCost = 0;
    let totalValue = 0;
    holdings.forEach((h) => {
      const stock = stocks.find((s) => s.ticker === h.ticker);
      const currentPrice = stock ? stock.price : h.buyPrice;
      totalCost += h.sharesCount * h.buyPrice;
      totalValue += h.sharesCount * currentPrice;
    });

    const totalProfit = totalValue - totalCost;
    const profitPct = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    const todayStr = new Date().toISOString().split('T')[0];

    // Portfolio Milestone Alert (+GH₵ 100, +GH₵ 500, or +5% profit)
    if (notificationPrefs.portfolioMilestones && (totalProfit >= 100 || profitPct >= 5)) {
      const milestoneTier = totalProfit >= 500 ? '500' : '100';
      const milestoneKey = `notif_portfolio_milestone_${milestoneTier}_${todayStr}`;
      if (!sessionStorage.getItem(milestoneKey)) {
        sessionStorage.setItem(milestoneKey, 'true');
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        triggerNotification({
          id: `portfolio-milestone-${Date.now()}`,
          alertId: 'portfolio-profit-milestone',
          category: 'PORTFOLIO',
          type: 'PORTFOLIO_MILESTONE',
          title: `Portfolio Milestone: +GH₵ ${totalProfit.toFixed(2)} (+${profitPct.toFixed(1)}%)`,
          message: `Your total portfolio valuation reached GH₵ ${totalValue.toFixed(2)} with net gains of +${profitPct.toFixed(1)}%.`,
          timestamp,
          read: false,
          actionLabel: 'View Portfolio'
        });
      }
    }

    // Dividend Reminders for stocks held in portfolio
    if (notificationPrefs.dividendReminders) {
      holdings.forEach((h) => {
        const stock = stocks.find((s) => s.ticker === h.ticker);
        if (stock && stock.dividendYield && stock.dividendYield >= 4.0) {
          const divKey = `notif_div_holding_${h.ticker}_${todayStr}`;
          if (!sessionStorage.getItem(divKey)) {
            sessionStorage.setItem(divKey, 'true');
            const estDividend = (h.sharesCount * (stock.price * (stock.dividendYield / 100))).toFixed(2);
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            triggerNotification({
              id: `div-reminder-${h.ticker}-${Date.now()}`,
              alertId: `div-${h.ticker}`,
              category: 'PORTFOLIO',
              type: 'DIVIDEND_REMINDER',
              ticker: h.ticker,
              stockName: stock.name,
              title: `Upcoming Dividend: ${h.ticker} (${stock.dividendYield.toFixed(1)}% Yield)`,
              message: `You hold ${h.sharesCount.toLocaleString()} shares of ${stock.name}. Estimated annualized payout: GH₵ ${estDividend}.`,
              timestamp,
              read: false,
              actionLabel: 'Check Calendar'
            });
          }
        }
      });
    }
  }, [holdings, stocks, notificationPrefs.portfolioMilestones, notificationPrefs.dividendReminders]);

  // Major News Alerts (Breaking GSE Filings, BoG / SEC Regulatory, IPOs)
  useEffect(() => {
    if (!notificationPrefs.majorNewsAlerts || newsList.length === 0) return;

    const majorNews = newsList.filter(
      (n) => n.isBreaking || n.isImportant || n.category === 'REGULATORY' || n.category === 'IPO'
    );

    majorNews.slice(0, 3).forEach((newsItem) => {
      const newsKey = `notif_news_${newsItem.id}`;
      if (!sessionStorage.getItem(newsKey)) {
        sessionStorage.setItem(newsKey, 'true');
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        triggerNotification({
          id: `news-${newsItem.id}-${Date.now()}`,
          alertId: `news-${newsItem.id}`,
          category: 'NEWS',
          type: 'MAJOR_NEWS',
          newsId: newsItem.id,
          title: `Major Notice: ${newsItem.category}`,
          message: newsItem.title,
          timestamp,
          read: false,
          actionLabel: 'Read Filing'
        });
      }
    });
  }, [newsList, notificationPrefs.majorNewsAlerts]);

  // GSE Floor Session Monitor (10:00 - 15:00 GMT, Mon - Fri)
  useEffect(() => {
    const checkMarketSession = () => {
      const now = new Date();
      const hours = now.getUTCHours();
      const day = now.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
      const isWeekday = day >= 1 && day <= 5;
      const isOpen = isWeekday && hours >= 10 && hours < 15;

      const dateStr = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
      const sessionKey = isOpen ? `gse_market_open_notified_${dateStr}` : `gse_market_closed_notified_${dateStr}`;
      const alreadyNotified = sessionStorage.getItem(sessionKey);

      if (!alreadyNotified) {
        sessionStorage.setItem(sessionKey, 'true');
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' GMT';

        if (isOpen) {
          triggerNotification({
            id: `market-open-${Date.now()}`,
            alertId: 'gse-market-open',
            category: 'MARKET',
            ticker: 'GSE-CI',
            stockName: 'Ghana Stock Exchange',
            targetPrice: 0,
            actualPrice: 0,
            condition: 'ABOVE',
            timestamp: timeStr,
            read: false,
            type: 'MARKET_OPEN',
            title: 'Continuous Floor Session Active',
            message: 'Official GSE continuous trading floor is OPEN. Real-time order matching active across all 39 equities.'
          });
        }
      }
    };

    checkMarketSession();
    const interval = setInterval(checkMarketSession, 20000); // monitor floor session every 20s
    return () => clearInterval(interval);
  }, [notificationPrefs.marketHoursAlerts]);

  // Alert management handlers
  const handleAddAlert = (newAlertData: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => {
    const newAlert: PriceAlert = {
      ...newAlertData,
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toLocaleDateString(),
      triggered: false
    };

    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleActiveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const handleResetTriggeredAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, triggered: false, triggeredAt: undefined, isActive: true }
          : a
      )
    );
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleArchiveNotification = (id: string) => {
    const notif = notifications.find((n) => n.id === id);
    if (notif) {
      const archivedItem: AlertNotification = {
        ...notif,
        archived: true,
        archivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setArchivedNotifications((prev) => [archivedItem, ...prev.filter((a) => a.id !== id)]);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } else {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const handleRestoreNotification = (id: string) => {
    const notif = archivedNotifications.find((n) => n.id === id);
    if (notif) {
      const restoredItem: AlertNotification = {
        ...notif,
        archived: false,
        archivedAt: undefined
      };
      setNotifications((prev) => [restoredItem, ...prev.filter((n) => n.id !== id)]);
      setArchivedNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const handleClearAllNotifications = () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const toArchive = notifications.map((n) => ({
      ...n,
      archived: true,
      archivedAt: n.archivedAt || nowTime
    }));
    setArchivedNotifications((prev) => [...toArchive, ...prev]);
    setNotifications([]);
  };

  const handleClearArchive = () => {
    setArchivedNotifications([]);
  };

  const handleSendTestPush = () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const testNotif: AlertNotification = {
      id: `test-push-${Date.now()}`,
      category: 'STOCK',
      type: 'PRICE_ALERT',
      ticker: 'MTNGH',
      stockName: 'MTN Ghana',
      actualPrice: 2.45,
      targetPrice: 2.40,
      condition: 'ABOVE',
      title: '🔔 Meridian Equities Push Alert',
      message: 'Real-time OS Push Alert is working! MTNGH crossed target at GH₵ 2.45.',
      timestamp: nowTime,
      read: false
    };
    triggerNotification(testNotif);
  };

  // Pro Gating & Activation Handlers
  const handleTogglePro = (enablePro: boolean) => {
    if (enablePro && !isProActive) {
      setIsSubscriptionOpen(true);
      return;
    }
    setShowPro(enablePro);
  };

  const handleOpenProDesk = () => {
    if (!isProActive) {
      setIsSubscriptionOpen(true);
      return;
    }
    setShowPro(true);
    setActiveTab('markets');
  };

  const handleUnlockProPass = (hours: number) => {
    const expiry = Date.now() + hours * 3600 * 1000;
    setProPassExpiry(expiry);
    localStorage.setItem(STORAGE_KEY_PRO_PASS_EXPIRY, expiry.toString());
    setShowPro(true);
  };

  const handleSelectTier = (tier: SubscriptionTier) => {
    setSubscriptionTier(tier);
    localStorage.setItem('meridian_subscription_tier', tier);
    if (tier !== 'FREE') {
      setShowPro(true);
    } else {
      if (!proPassExpiry || proPassExpiry <= Date.now()) {
        setShowPro(false);
      }
    }
  };

  const handleOpenAlertModalForStock = (ticker: string) => {
    setPreselectedAlertTicker(ticker);
    setIsAlertsModalOpen(true);
  };

  // Portfolio Handlers
  const handleSaveHolding = (
    holdingData: Omit<PortfolioHolding, 'id' | 'createdAt'>,
    holdingId?: string
  ) => {
    if (holdingId) {
      // Update existing
      setHoldings((prev) =>
        prev.map((h) =>
          h.id === holdingId
            ? { ...h, ...holdingData, updatedAt: new Date().toLocaleDateString() }
            : h
        )
      );
    } else {
      // Add new holding
      const newHolding: PortfolioHolding = {
        ...holdingData,
        id: `holding-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toLocaleDateString()
      };
      setHoldings((prev) => [newHolding, ...prev]);
    }
  };

  const handleDeleteHolding = (id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  const handleLoadSamplePortfolio = () => {
    setHoldings(DEFAULT_SAMPLE_HOLDINGS);
  };

  const handleOpenAddHoldingModal = (ticker?: string) => {
    if (!isProActive && holdings.length >= 3 && !ticker) {
      // Prompt upgrade if free user exceeds 3 holdings limit
      setIsSubscriptionOpen(true);
      return;
    }
    setEditingHolding(null);
    setPreselectedHoldingTicker(ticker || null);
    setIsAddHoldingModalOpen(true);
  };

  const handleEditHolding = (holding: PortfolioHolding) => {
    setEditingHolding(holding);
    setPreselectedHoldingTicker(holding.ticker);
    setIsAddHoldingModalOpen(true);
  };

  const handleViewReceipt = (holding: PortfolioHolding) => {
    setViewingReceiptHolding(holding);
  };

  // Refresh handler: queries GSE live data with forceRefresh bypass
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchGhanaStockMarket(true);
      setApiStatus(res.status);
      setApiSource(res.source);
      if (res.stocks && res.stocks.length > 0) {
        setStocks(res.stocks);
      }
    } catch (err) {
      console.warn('Ghana API refresh error:', err);
      // local price jitter as fallback
      setStocks((prev) =>
        prev.map((s) => {
          const delta = (Math.random() - 0.49) * 0.04;
          const newPrice = Math.max(0.1, Number((s.price + delta).toFixed(2)));
          const change = Number((newPrice - (s.price - s.change)).toFixed(2));
          const changePercent = Number(((change / (newPrice - change)) * 100).toFixed(2));
          const volumeIncrement = Math.floor(Math.random() * 2500);

          return {
            ...s,
            price: newPrice,
            change,
            changePercent,
            volume: s.volume + volumeIncrement
          };
        })
      );
    } finally {
      const now = new Date();
      const formatTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastUpdated(`Last updated: Today at ${formatTime}`);
      setIsRefreshing(false);
    }
  };

  // Toggle watchlist
  const handleToggleWatchlist = (ticker: string) => {
    setStocks((prev) =>
      prev.map((s) =>
        s.ticker === ticker ? { ...s, isWatchlisted: !s.isWatchlisted } : s
      )
    );
    if (selectedStock && selectedStock.ticker === ticker) {
      setSelectedStock((prev) => prev ? { ...prev, isWatchlisted: !prev.isWatchlisted } : null);
    }
  };

  // Vote Bull / Bear handler
  const handleSubmitVote = (ticker: string, isBull: boolean) => {
    const currentVote = userVotes[ticker];

    setUserVotes((prev) => {
      const next = { ...prev };
      if (currentVote === isBull) {
        delete next[ticker]; // toggle off
      } else {
        next[ticker] = isBull;
      }
      return next;
    });

    setStocks((prev) =>
      prev.map((s) => {
        if (s.ticker !== ticker) return s;
        let bullVotes = s.bullVotes || 0;
        let bearVotes = s.bearVotes || 0;

        // Undo previous vote if any
        if (currentVote === true) bullVotes = Math.max(0, bullVotes - 1);
        if (currentVote === false) bearVotes = Math.max(0, bearVotes - 1);

        // Apply new vote if not toggled off
        if (currentVote !== isBull) {
          if (isBull) bullVotes++;
          else bearVotes++;
        }

        return { ...s, bullVotes, bearVotes };
      })
    );

    if (selectedStock && selectedStock.ticker === ticker) {
      setSelectedStock((prev) => {
        if (!prev) return null;
        let bullVotes = prev.bullVotes || 0;
        let bearVotes = prev.bearVotes || 0;
        if (currentVote === true) bullVotes = Math.max(0, bullVotes - 1);
        if (currentVote === false) bearVotes = Math.max(0, bearVotes - 1);
        if (currentVote !== isBull) {
          if (isBull) bullVotes++;
          else bearVotes++;
        }
        return { ...prev, bullVotes, bearVotes };
      });
    }
  };

  // Open Jargon bottom sheet
  const handleOpenJargon = (jargonId: string) => {
    setJargonModal({
      isOpen: true,
      initialId: jargonId
    });
  };

  // Filter and sort stocks
  const filteredStocks = stocks.filter((stock) => {
    // Watchlist subtab filter
    if (stocksSubTab === 'watchlist' && !stock.isWatchlisted) return false;

    // Sector filter
    if (selectedSector !== 'ALL' && stock.sector !== selectedSector) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = stock.name.toLowerCase().includes(q);
      const matchTicker = stock.ticker.toLowerCase().includes(q);
      const matchSector = stock.sector.toLowerCase().includes(q);
      if (!matchName && !matchTicker && !matchSector) return false;
    }

    return true;
  });

  // Sorting
  const sortedStocks = [...filteredStocks].sort((a, b) => {
    switch (sortOption) {
      case SortOption.OVERALL:
        // Composite formula combining Liquidity + Dividend score
        return (b.easyToSellScore + b.cashBackScore) - (a.easyToSellScore + a.cashBackScore);
      case SortOption.LIQUIDITY:
        return b.easyToSellScore - a.easyToSellScore;
      case SortOption.DIVIDEND:
        return (b.dividendYield || 0) - (a.dividendYield || 0);
      case SortOption.VALUE:
        return b.bargainScore - a.bargainScore;
      case SortOption.PRICE_DESC:
        return b.price - a.price;
      case SortOption.PRICE_ASC:
        return a.price - b.price;
      case SortOption.GAINERS:
        return b.changePercent - a.changePercent;
      case SortOption.LOSERS:
        return a.changePercent - b.changePercent;
      default:
        return 0;
    }
  });

  const watchlistCount = stocks.filter((s) => s.isWatchlisted).length;
  const sectors: SectorFilter[] = ['ALL', 'Telecom', 'Financials', 'Agriculture', 'Energy', 'Consumer Goods'];

  const triggeredAlertsCount = alerts.filter(a => a.triggered).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#040814] flex flex-col font-sans text-slate-900 dark:text-slate-100 selection:bg-amber-500/30 selection:text-amber-950 dark:selection:text-amber-100 transition-colors duration-200 w-full">
      {/* Toast Notification Container for Triggered Alerts & Market Session */}
      <AlertToastContainer
        notifications={notifications}
        onDismiss={handleDismissNotification}
        onSelectStock={setSelectedStock}
        stocks={stocks}
        onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
        onViewMarkets={() => setActiveTab('markets')}
        onViewPortfolio={() => setActiveTab('portfolio')}
        onViewNews={(newsId) => {
          if (newsId) {
            const found = newsList.find((n) => n.id === newsId);
            if (found) {
              setSelectedNews(found);
              setIsNewsModalOpen(true);
              return;
            }
          }
          setActiveTab('news');
        }}
      />

      {/* Top Navigation & App Header */}
      <Header
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        exchangeRateUsd={exchangeRateUsd}
        onOpenExchangeRateModal={() => setIsRateModalOpen(true)}
        indices={INITIAL_INDICES}
        onOpenJargon={handleOpenJargon}
        onOpenDividendCalendar={() => setIsDividendModalOpen(true)}
        currency={currency}
        onToggleCurrency={() => setCurrency((prev) => (prev === 'GHS' ? 'USD' : 'GHS'))}
        onOpenAlertsModal={() => {
          setPreselectedAlertTicker(null);
          setIsAlertsModalOpen(true);
        }}
        alertsCount={alerts.length}
        triggeredAlertsCount={triggeredAlertsCount}
        onOpenPortfolioTab={() => setActiveTab('portfolio')}
        portfolioHoldingsCount={holdings.length}
        onOpenNewsTab={() => setActiveTab('news')}
        newsCount={newsList.length}
        onOpenCalculatorsTab={() => setActiveTab('calculators')}
        onOpenLearnTab={() => setActiveTab('learn')}
        onOpenMarketCloseReport={() => setIsMarketCloseModalOpen(true)}
        onOpenOnboardingTour={handleOpenOnboarding}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenMeridianAI={() => setIsWallflakeOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        userProfile={userProfile}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (activeTab !== 'markets') setActiveTab('markets');
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenMobileMenu={() => setIsMobileLeftPaneOpen(true)}
        onOpenSubscriptionModal={() => setIsSubscriptionOpen(true)}
        subscriptionTier={isProActive ? (subscriptionTier === 'FREE' ? 'PRO (PASS)' : subscriptionTier) : 'FREE'}
        proPassExpiry={proPassExpiry}
      />

      {/* Mobile Slide-Out Left Pane Drawer (invoked via top menu bar on phones) */}
      {isMobileLeftPaneOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in" role="dialog" aria-modal="true">
          {/* Dark Backdrop */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileLeftPaneOpen(false)}
          />

          {/* Sliding Menu Panel */}
          <div className="relative w-72 sm:w-80 max-w-[85vw] h-full max-h-[100dvh] bg-[#070D1F] border-r border-white/10 shadow-2xl flex flex-col p-4 space-y-4 overflow-y-auto overscroll-contain custom-scrollbar z-10 select-none text-white pb-28">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-[#080E20] rounded-[9px] flex items-center justify-center p-0.5">
                    <RisingCediLogo size={18} showBadge={false} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-tight flex items-center gap-1">
                    <span>MERIDIAN</span>
                    <span className="text-cyan-400">EQUITIES</span>
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">Navigation & Tools</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileLeftPaneOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Account Tile */}
            {userProfile && userProfile.isVerified ? (
              <div className="p-2.5 rounded-2xl bg-[#0B132B] border border-white/[0.08] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt="" className="w-8 h-8 rounded-xl object-cover ring-1 ring-cyan-500/40 shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {userProfile.name?.charAt(0) || <User className="w-4 h-4" />}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{userProfile.name}</p>
                    <p className="text-[10px] text-emerald-400 font-mono">Verified Investor</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileLeftPaneOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
                >
                  Account
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileLeftPaneOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Create Account</span>
              </button>
            )}

            {/* Main Navigation Links */}
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5 block mb-1.5">
                MENU
              </span>
              <div className="space-y-1">
                {[
                  { id: 'home' as MainNavTab, label: 'Home', icon: Home, badge: null },
                  { id: 'markets' as MainNavTab, label: 'Stocks', icon: TrendingUp, badge: `${stocks.length}` },
                  { id: 'portfolio' as MainNavTab, label: 'My Portfolio', icon: Briefcase, badge: holdings.length > 0 ? `${holdings.length}` : null },
                  { id: 'news' as MainNavTab, label: 'News', icon: Newspaper, badge: `${newsList.length}` },
                  { id: 'chat' as MainNavTab, label: 'AI Chat', icon: MessageSquare, badge: 'HOT' },
                  { id: 'community' as MainNavTab, label: 'Community', icon: Users, badge: null },
                  { id: 'calculators' as MainNavTab, label: 'Calculators', icon: Calculator, badge: null },
                  { id: 'learn' as MainNavTab, label: 'Learn', icon: BookOpen, badge: null },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileLeftPaneOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-black'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                          isActive 
                            ? 'bg-cyan-500/30 text-cyan-200' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Tools & Desks */}
            <div className="pt-2 border-t border-white/[0.08]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5 block mb-1.5">
                TOOLS & DESKS
              </span>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileLeftPaneOpen(false);
                    setIsBrokersModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>GSE Stock Brokers Directory</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileLeftPaneOpen(false);
                    setIsWallflakeOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Meridian AI Desk</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileLeftPaneOpen(false);
                    handleOpenProDesk();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-300 hover:bg-purple-500/15 border border-transparent hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Meridian Pro Desk</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileLeftPaneOpen(false);
                    setIsFXShieldOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4 text-amber-500" />
                  <span>USD to Cedi Transfer</span>
                </button>

              </div>
            </div>

            {/* Terminal Mode Switcher (Easy vs Pro) */}
            <div className="p-3 rounded-2xl bg-[#0B132B] border border-white/[0.08] space-y-2 select-none mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  TERMINAL MODE
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  showPro ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {showPro ? 'PRO MODE' : 'EASY MODE'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 bg-[#040816] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleTogglePro(false)}
                  className={`py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    !showPro
                      ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EASY
                </button>
                <button
                  type="button"
                  onClick={() => handleTogglePro(true)}
                  className={`py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    showPro
                      ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PRO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Terminal Layout Shell */}
      <div className="flex-1 w-full max-w-[1680px] mx-auto flex items-start">
        {/* Desktop Navigation Sidebar Rail (hidden on mobile) */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 shrink-0 sticky top-[69px] h-[calc(100dvh-69px)] max-h-[calc(100dvh-69px)] border-r border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#070D1F]/95 backdrop-blur-md overflow-y-auto select-none">
          {/* Scrollable upper rail containing Menu & Tools */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3.5 space-y-4 custom-scrollbar">
            {/* Main Navigation Links */}
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 block mb-1.5">
                MENU
              </span>
              <div className="space-y-1">
                {[
                  { id: 'home' as MainNavTab, label: 'Home', icon: Home, badge: null },
                  { id: 'markets' as MainNavTab, label: 'Stocks', icon: TrendingUp, badge: `${stocks.length}` },
                  { id: 'portfolio' as MainNavTab, label: 'My Portfolio', icon: Briefcase, badge: holdings.length > 0 ? `${holdings.length}` : null },
                  { id: 'news' as MainNavTab, label: 'News', icon: Newspaper, badge: `${newsList.length}` },
                  { id: 'chat' as MainNavTab, label: 'AI Chat', icon: MessageSquare, badge: 'HOT' },
                  { id: 'community' as MainNavTab, label: 'Community', icon: Users, badge: null },
                  { id: 'calculators' as MainNavTab, label: 'Calculators', icon: Calculator, badge: null },
                  { id: 'learn' as MainNavTab, label: 'Learn', icon: BookOpen, badge: null },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 shadow-xs font-black'
                          : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                          isActive 
                            ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Tool Links */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 block mb-1.5">
                TOOLS
              </span>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setIsWallflakeOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Meridian AI Desk</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenProDesk}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Meridian Pro Desk</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFXShieldOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4 text-amber-500" />
                  <span>USD to Cedi Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBrokersModalOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>GSE Stock Brokers</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenOnboarding}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>Platform Tour</span>
                </button>
              </div>
            </div>
          </div>

          {/* Docked / Always-accessible bottom controls */}
          <div className="p-3 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50/90 dark:bg-[#060B1B]/95 space-y-2 shrink-0">
            {/* Terminal Mode Switcher (Easy vs Pro) */}
            <div className="space-y-1.5 select-none">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  TERMINAL MODE
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  showPro ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {showPro ? 'PRO MODE' : 'EASY MODE'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 bg-slate-200/70 dark:bg-[#040816] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleTogglePro(false)}
                  className={`py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    !showPro
                      ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🌱 EASY
                </button>
                <button
                  type="button"
                  onClick={() => handleTogglePro(true)}
                  className={`py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    showPro
                      ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  ⚡ PRO
                </button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight font-mono">
                {showPro 
                  ? 'Institutional metrics (Beta, P/E, 52W) active.' 
                  : 'Beginner terms & (i) guides active.'}
              </p>
            </div>

            {/* Footer Security Note */}
            <div className="pt-1 text-[10px] font-mono text-slate-400 text-center border-t border-slate-200/60 dark:border-slate-800/60">
              <span>🔒 256-Bit Encrypted • v2.4</span>
            </div>
          </div>
        </aside>

        {/* Main App Container */}
        <main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-5 space-y-6 pb-28 w-full">
          {/* Offline notification banner */}
          {!isOnline && (
            <div className="bg-amber-500 text-slate-950 px-4 py-2 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm animate-pulse">
              <span>⚡ Offline Mode Active: Serving market cached data from local IndexedDB sandbox.</span>
            </div>
          )}

          {/* Active Tab View: Home vs Markets vs Community vs Portfolio vs Chat vs News */}
          {activeTab === 'home' && (
            <HomeDashboard
              stocks={stocks}
              holdings={holdings}
              onOpenAddHolding={() => handleOpenAddHoldingModal()}
              currency={currency}
              exchangeRateUsd={exchangeRateUsd}
              indices={INITIAL_INDICES}
              showPro={showPro}
              onSelectStock={setSelectedStock}
              onNavigateTab={setActiveTab}
              onOpenJargonGuide={(id) => handleOpenJargon(id || 'variation')}
              onOpenFxModal={() => setIsRateModalOpen(true)}
              onOpenDividendModal={() => setIsDividendModalOpen(true)}
              onOpenMarketCloseReport={() => setIsMarketCloseModalOpen(true)}
              onOpenAlertsModal={() => {
                setPreselectedAlertTicker(null);
                setIsAlertsModalOpen(true);
              }}
              onOpenOnboardingTour={handleOpenOnboarding}
              latestNews={newsList[0]}
              onSelectNews={(news) => {
                setSelectedNews(news);
                setIsNewsModalOpen(true);
              }}
              onOpenMeridianAI={() => setIsWallflakeOpen(true)}
            />
          )}

        {activeTab === 'markets' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Market Highlights Component */}
            <MarketOverview 
              stocks={stocks} 
              onSelectStock={setSelectedStock}
              latestNews={newsList[0]}
              currency={currency}
              exchangeRateUsd={exchangeRateUsd}
              onSelectNews={(news) => {
                setSelectedNews(news);
                setIsNewsModalOpen(true);
              }}
              onOpenNewsTab={() => setActiveTab('news')}
            />

            {/* Search, Tabs & Filters Bar */}
            <div className="bg-white dark:bg-[#070D1F] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm p-4 sm:p-5 space-y-4 transition-colors">
              {/* Top Row: Search Input & Subtabs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Ghana stocks (e.g., MTN, GCB, BOPP, TOTAL)..."
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-[#0B132B] rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white dark:focus:bg-[#0B132B] transition-all"
                  />
                  {searchQuery && (
                    <button
                      id="clear-search-btn"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Subtabs: All Listed vs Watchlist */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center bg-slate-100 dark:bg-[#0B132B] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08] shrink-0">
                    <button
                      id="tab-all-stocks"
                      onClick={() => setStocksSubTab('all')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        stocksSubTab === 'all'
                          ? 'bg-white dark:bg-[#0F1A3A] text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>All Listed ({stocks.length})</span>
                    </button>

                    <button
                      id="tab-watchlist"
                      onClick={() => setStocksSubTab('watchlist')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        stocksSubTab === 'watchlist'
                          ? 'bg-white dark:bg-[#0F1A3A] text-rose-600 dark:text-rose-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${watchlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>Watchlist ({watchlistCount})</span>
                    </button>
                  </div>

                  {/* Price Alerts trigger button */}
                  <button
                    id="main-alerts-btn"
                    onClick={() => {
                      setPreselectedAlertTicker(null);
                      setIsAlertsModalOpen(true);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
                      triggeredAlertsCount > 0
                        ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-300'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700'
                    }`}
                    title="Manage Stock Price Alerts"
                  >
                    <Bell className="w-4 h-4 text-amber-500" />
                    <span className="hidden sm:inline">Price Alerts</span>
                    {alerts.length > 0 && (
                      <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-900 text-white rounded-full">
                        {alerts.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Row: Sector Chips & Sort Dropdown */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                {/* Sector filter pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  <span className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1 hidden sm:inline">
                    Sectors:
                  </span>
                  {sectors.map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setSelectedSector(sec)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                        selectedSector === sec
                          ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-2xs font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'
                      }`}
                    >
                      {sec === 'ALL' ? 'All Sectors' : sec}
                    </button>
                  ))}
                </div>

                {/* Sort selection */}
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <label htmlFor="sort-dropdown" className="text-slate-500 dark:text-slate-400 font-medium">Sort by:</label>
                  <select
                    id="sort-dropdown"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-white/[0.1] rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value={SortOption.OVERALL} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">Overall Score (Best Mix)</option>
                    <option value={SortOption.LIQUIDITY} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">
                      {showPro ? 'Liquidity (Highest First)' : 'Easy to Sell (Fastest • Higher ↑)'}
                    </option>
                    <option value={SortOption.DIVIDEND} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">
                      {showPro ? 'Dividend Yield %' : 'Cash Back (Highest Returns • Higher ↑)'}
                    </option>
                    <option value={SortOption.VALUE} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">
                      {showPro ? 'P/E Multiple (Lowest First • Lower ↓)' : 'Bargain Score (Best Value • Higher ↑)'}
                    </option>
                    <option value={SortOption.GAINERS} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">Today's % Gainers (Higher ↑)</option>
                    <option value={SortOption.PRICE_DESC} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">Price: High to Low</option>
                    <option value={SortOption.PRICE_ASC} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">Price: Low to High</option>
                  </select>
                  {/* View Mode Switcher: Table vs Grid */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setMarketsViewMode('table')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        marketsViewMode === 'table'
                          ? 'bg-white dark:bg-cyan-500/20 text-slate-900 dark:text-cyan-300 shadow-xs border border-transparent dark:border-cyan-500/30 font-black'
                          : 'text-slate-600 dark:text-slate-400 hover:text-white'
                      }`}
                      title="Institutional Table View"
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Table</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarketsViewMode('grid')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        marketsViewMode === 'grid'
                          ? 'bg-white dark:bg-cyan-500/20 text-slate-900 dark:text-cyan-300 shadow-xs border border-transparent dark:border-cyan-500/30 font-black'
                          : 'text-slate-600 dark:text-slate-400 hover:text-white'
                      }`}
                      title="Visual Bento Grid Cards"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Easy Mode Guidance Helper Banner */}
              {!showPro && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-black font-mono">🌱 EASY MODE:</span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Tap any small <strong className="font-mono text-cyan-500 font-black">(i)</strong> button to see whether a metric is out of 100 or %, and if higher or lower is better!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenJargon('variation')}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 cursor-pointer"
                  >
                    Open Metrics Guide →
                  </button>
                </div>
              )}
            </div>

            {/* Stock List / Grid / Table */}
            {sortedStocks.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {stocksSubTab === 'watchlist' ? 'Your Watchlist is Empty' : 'No Stocks Found'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {stocksSubTab === 'watchlist'
                    ? 'Tap the heart icon on any stock card (like MTN Ghana or GCB) to track your favorite GSE investments in one place.'
                    : `No results matching "${searchQuery}". Try searching for ticker symbols like MTNGH, GCB, or sector names.`}
                </p>
                {stocksSubTab === 'watchlist' ? (
                  <button
                    onClick={() => setStocksSubTab('all')}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold hover:bg-slate-800 dark:hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Browse All GSE Stocks
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSector('ALL');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : marketsViewMode === 'table' ? (
              <StockTable
                stocks={sortedStocks}
                currency={currency}
                exchangeRateUsd={exchangeRateUsd}
                showPro={showPro}
                onSelectStock={setSelectedStock}
                onToggleWatchlist={handleToggleWatchlist}
                onOpenAlertModalForStock={handleOpenAlertModalForStock}
                onOpenPortfolioForStock={handleOpenAddHoldingModal}
                alerts={alerts}
                holdings={holdings}
                onOpenJargon={handleOpenJargon}
              />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedStocks.map((stock, index) => {
                    const userVote = userVotes[stock.ticker] ?? null;
                    const showSponsoredCard = index > 0 && index % 4 === 0;
                    const hasActiveAlert = alerts.some(a => a.ticker === stock.ticker && a.isActive && !a.triggered);
                    const stockHoldings = holdings.filter(h => h.ticker === stock.ticker);

                    return (
                      <React.Fragment key={stock.ticker}>
                        <StockCard
                          stock={stock}
                          showPro={showPro}
                          currency={currency}
                          exchangeRateUsd={exchangeRateUsd}
                          onToggleWatchlist={handleToggleWatchlist}
                          onSubmitVote={handleSubmitVote}
                          userVote={userVote}
                          onSelectStock={setSelectedStock}
                          onOpenJargon={handleOpenJargon}
                          onOpenAlertModalForStock={handleOpenAlertModalForStock}
                          hasActiveAlert={hasActiveAlert}
                          onOpenPortfolioForStock={handleOpenAddHoldingModal}
                          holdingsCount={stockHoldings.length}
                        />
                        {showSponsoredCard && (
                          <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <AdmobBannerCard />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <CommunitySection
            stocks={stocks}
            userVotes={userVotes}
            onSubmitVote={handleSubmitVote}
            onSelectStock={setSelectedStock}
            onNavigateTab={setActiveTab}
            onOpenJargon={handleOpenJargon}
            userProfile={userProfile}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <PortfolioSection
            holdings={holdings}
            stocks={stocks}
            currency={currency}
            exchangeRateUsd={exchangeRateUsd}
            userProfile={userProfile}
            onAddNewHolding={handleOpenAddHoldingModal}
            onEditHolding={handleEditHolding}
            onDeleteHolding={handleDeleteHolding}
            onSelectStock={setSelectedStock}
            onViewReceipt={handleViewReceipt}
            onLoadSamplePortfolio={handleLoadSamplePortfolio}
            onOpenJargon={handleOpenJargon}
          />
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <InvestorChatSection
            stocks={stocks}
            onSelectStockByTicker={(ticker) => {
              const s = stocks.find((st) => st.ticker === ticker);
              if (s) setSelectedStock(s);
            }}
            onOpenJargonGuide={() => handleOpenJargon('liquidity')}
            onNavigateToCommunity={() => setActiveTab('community')}
            onNavigateToNews={() => setActiveTab('news')}
            userProfile={userProfile}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <NewsSection
            newsList={newsList}
            stocks={stocks}
            onSelectNews={(news) => {
              setSelectedNews(news);
              setIsNewsModalOpen(true);
            }}
            onSelectStockByTicker={(ticker) => {
              const s = stocks.find((st) => st.ticker === ticker);
              if (s) setSelectedStock(s);
            }}
            onOpenAlertModalForStock={handleOpenAlertModalForStock}
            onOpenDividendCalendar={() => setIsDividendModalOpen(true)}
            bookmarkedNewsIds={bookmarkedNewsIds}
            onToggleBookmark={handleToggleNewsBookmark}
            onNavigateToCommunity={() => setActiveTab('community')}
            onNavigateToChat={() => setActiveTab('chat')}
          />
        )}

        {/* Calculators Tab */}
        {activeTab === 'calculators' && (
          <CalculatorsSection
            stocks={stocks}
            onSelectStock={setSelectedStock}
            onOpenJargon={handleOpenJargon}
            onNavigateToLearn={() => setActiveTab('learn')}
          />
        )}

        {/* Learn Tab */}
        {activeTab === 'learn' && (
          <LearnInvestingSection
            stocks={stocks}
            onOpenJargon={handleOpenJargon}
            onSelectStock={setSelectedStock}
            onNavigateToCalculators={() => setActiveTab('calculators')}
            onNavigateToMarkets={() => setActiveTab('markets')}
            onOpenBrokersDirectory={() => setIsBrokersModalOpen(true)}
          />
        )}
      </main>
    </div>

    {/* Persistent Bottom Navigation Menu Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        communityCount={4}
        chatUnreadCount={1}
        newsCount={newsList.length}
        holdingsCount={holdings.length}
      />

      {/* First-Time Open Onboarding Walkthrough Tour Modal */}
      <OnboardingTourModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          handleCloseOnboarding();
        }}
      />


      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-[#070D1F] text-white border-t border-slate-800 dark:border-white/[0.08] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center font-black text-slate-950 text-[10px]">
              ME
            </div>
            <span>
              <strong>Meridian Equities</strong> • Global & GSE Stock Terminal
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setActiveTab('portfolio')}
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>My Portfolio ({holdings.length})</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAlertsModalOpen(true)}
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Price Alerts ({alerts.length})</span>
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenJargon('liquidity')}
              className="hover:text-amber-300 transition-colors"
            >
              Glossary
            </button>

            <span>•</span>
            <button
              onClick={() => setIsRateModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              FX Rate: GH₵ {exchangeRateUsd.toFixed(2)}
            </button>
          </div>
        </div>

        {/* Regulatory & Institutional Financial Disclaimer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <span className="text-amber-500 font-bold text-sm shrink-0">⚠️</span>
            <div>
              <p className="font-bold text-slate-400 mb-0.5">
                REGULATORY DISCLAIMER — NOT FINANCIAL ADVICE
              </p>
              <p>
                All data, market quotes, Meridian Axis diagnostics, and algorithmic simulations presented by Meridian Equities are strictly for informational and educational purposes. Meridian Equities is not a registered investment advisor or SEC-licensed broker-dealer. Past performance of Ghana Stock Exchange (GSE) or international equities is not indicative of future results. Always consult a certified financial planner or SEC-licensed broker before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Detail Analytics Modal */}
      {selectedStock && (
        <StockDetailModal
          stock={stocks.find((s) => s.ticker === selectedStock.ticker) || selectedStock}
          onClose={() => setSelectedStock(null)}
          currency={currency}
          exchangeRateUsd={exchangeRateUsd}
          showPro={showPro}
          onToggleWatchlist={handleToggleWatchlist}
          onSubmitVote={handleSubmitVote}
          userVote={userVotes[selectedStock.ticker] ?? null}
          onOpenJargon={handleOpenJargon}
          stockAlerts={alerts.filter(a => a.ticker === selectedStock.ticker)}
          onAddAlert={handleAddAlert}
          onDeleteAlert={handleDeleteAlert}
          onOpenAllAlerts={() => {
            setPreselectedAlertTicker(selectedStock.ticker);
            setIsAlertsModalOpen(true);
          }}
          onOpenPortfolioModal={(ticker) => {
            setSelectedStock(null);
            handleOpenAddHoldingModal(ticker);
          }}
          stockHoldings={holdings.filter(h => h.ticker === selectedStock.ticker)}
          relatedNews={newsList.filter(n => n.relatedTickers.includes(selectedStock.ticker))}
          onSelectNews={(news) => {
            setSelectedNews(news);
            setIsNewsModalOpen(true);
          }}
          allStocks={stocks}
        />
      )}

      {/* Market News & IPO Filings Detail Modal */}
      <NewsDetailModal
        isOpen={isNewsModalOpen}
        news={selectedNews}
        allStocks={stocks}
        onClose={() => {
          setIsNewsModalOpen(false);
          setSelectedNews(null);
        }}
        onSelectStock={(ticker) => {
          const s = stocks.find((st) => st.ticker === ticker);
          if (s) {
            setIsNewsModalOpen(false);
            setSelectedStock(s);
          }
        }}
        onOpenAlertModal={(ticker) => {
          setIsNewsModalOpen(false);
          setPreselectedAlertTicker(ticker);
          setIsAlertsModalOpen(true);
        }}
        isBookmarked={selectedNews ? bookmarkedNewsIds.includes(selectedNews.id) : false}
        onToggleBookmark={handleToggleNewsBookmark}
      />

      {/* Add / Edit Portfolio Position Modal (with manual input & PDF receipt upload) */}
      <AddEditHoldingModal
        isOpen={isAddHoldingModalOpen}
        onClose={() => {
          setIsAddHoldingModalOpen(false);
          setEditingHolding(null);
          setPreselectedHoldingTicker(null);
        }}
        stocks={stocks}
        onSaveHolding={handleSaveHolding}
        editingHolding={editingHolding}
        preselectedTicker={preselectedHoldingTicker}
      />

      {/* PDF / Image Receipt Viewer Modal */}
      <ReceiptViewerModal
        isOpen={!!viewingReceiptHolding}
        holding={viewingReceiptHolding}
        onClose={() => setViewingReceiptHolding(null)}
      />

      {/* Jargon Explainer Bottom Sheet */}
      <JargonBottomSheet
        isOpen={jargonModal.isOpen}
        initialJargonId={jargonModal.initialId}
        onClose={() => setJargonModal({ isOpen: false, initialId: null })}
      />

      {/* Exchange Rate Adjustment Modal */}
      <ExchangeRateModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        currentRate={exchangeRateUsd}
        onSaveRate={(newRate) => {
          setExchangeRateUsd(newRate);
          localStorage.setItem('meridian_fx_manual_override', 'true');
        }}
        liveRate={liveUsdRate}
        isLive={isLiveFx}
        lastUpdated={fxLastUpdated}
        source={fxSource}
        onRefreshLive={refetchFx}
        onToggleAutoSync={(autoSync) => {
          if (autoSync) {
            localStorage.removeItem('meridian_fx_manual_override');
            if (liveUsdRate) setExchangeRateUsd(Number(liveUsdRate.toFixed(2)));
          } else {
            localStorage.setItem('meridian_fx_manual_override', 'true');
          }
        }}
      />

      {/* Dividend Calendar Modal */}
      <DividendCalendarModal
        isOpen={isDividendModalOpen}
        onClose={() => setIsDividendModalOpen(false)}
        stocks={stocks}
        onSelectStock={setSelectedStock}
      />

      {/* Price Alerts & Push Notifications Modal */}
      <PriceAlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        stocks={stocks}
        alerts={alerts}
        notifications={notifications}
        archivedNotifications={archivedNotifications}
        onDismissNotification={handleArchiveNotification}
        onArchiveNotification={handleArchiveNotification}
        onRestoreNotification={handleRestoreNotification}
        onClearAllNotifications={handleClearAllNotifications}
        onClearArchive={handleClearArchive}
        onSendTestPush={handleSendTestPush}
        preferences={notificationPrefs}
        onUpdatePreferences={handleUpdateNotificationPrefs}
        onAddAlert={handleAddAlert}
        onDeleteAlert={handleDeleteAlert}
        onToggleActive={handleToggleActiveAlert}
        onResetTriggered={handleResetTriggeredAlert}
        onSelectStock={setSelectedStock}
        onViewPortfolio={() => {
          setIsAlertsModalOpen(false);
          setActiveTab('portfolio');
        }}
        onViewNews={(newsId) => {
          setIsAlertsModalOpen(false);
          if (newsId) {
            const found = newsList.find((n) => n.id === newsId);
            if (found) {
              setSelectedNews(found);
              setIsNewsModalOpen(true);
              return;
            }
          }
          setActiveTab('news');
        }}
        preselectedTicker={preselectedAlertTicker}
      />

      {/* Market Close Report Modal (Green/Red Day Analysis & Associated Terms) */}
      <MarketCloseReportModal
        isOpen={isMarketCloseModalOpen}
        onClose={() => setIsMarketCloseModalOpen(false)}
        stocks={stocks}
        indices={INITIAL_INDICES}
        onSelectStock={setSelectedStock}
        currency={currency}
        exchangeRateUsd={exchangeRateUsd}
      />

      {/* First-Time SMS & Profile Authentication Onboarding Modal */}
      <AuthOnboardingModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        userProfile={userProfile}
        onSaveProfile={handleSaveUserProfile}
        onLogout={handleLogoutUserProfile}
      />

      {/* Meridian AI Local Assistant Modal */}
      <MeridianAI
        stocks={stocks}
        isOpen={isWallflakeOpen}
        onClose={() => setIsWallflakeOpen(false)}
        userProfile={userProfile}
        onSelectStock={setSelectedStock}
      />

      {/* Subscription Plans Modal */}
      <SubscriptionPlansModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        currency={currency}
        onToggleCurrency={() => setCurrency((prev) => (prev === 'GHS' ? 'USD' : 'GHS'))}
        currentTier={subscriptionTier}
        onSelectTier={handleSelectTier}
        baseCountry={userProfile?.baseCountry || 'GH'}
        proPassExpiry={proPassExpiry}
        onUnlockProPass={handleUnlockProPass}
      />



      {/* FX Slippage Shield Calculator Modal */}
      {isFXShieldOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
          onClick={() => setIsFXShieldOpen(false)}
        >
          <div 
            className="w-full max-w-2xl relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="close-fx-modal-btn"
              onClick={() => setIsFXShieldOpen(false)}
              className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 shadow-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <FXSlippageShield 
              exchangeRateUsd={exchangeRateUsd} 
              stocks={stocks}
              onSelectStock={(s) => {
                setSelectedStock(s);
                setIsFXShieldOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* GSE Licensed Stockbrokers Directory Modal */}
      <StockBrokersModal
        isOpen={isBrokersModalOpen}
        onClose={() => setIsBrokersModalOpen(false)}
      />

      {/* Linear-Style Institutional Command Palette */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        stocks={stocks}
        currency={currency}
        exchangeRateUsd={exchangeRateUsd}
        showPro={showPro}
        theme={theme}
        onSelectStock={(stock) => setSelectedStock(stock)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenMeridianAI={() => setIsWallflakeOpen(true)}
        onOpenFXShield={() => setIsFXShieldOpen(true)}

        onLockBiometric={() => setIsBiometricLocked(true)}
        onOpenDividendCalendar={() => setIsDividendModalOpen(true)}
        onOpenJargon={(id) => handleOpenJargon(id)}
        onOpenBrokers={() => setIsBrokersModalOpen(true)}
        onToggleCurrency={() => setCurrency((prev) => (prev === 'GHS' ? 'USD' : 'GHS'))}
        onTogglePro={() => handleTogglePro(!showPro)}
        onToggleTheme={handleToggleTheme}
        onRefresh={handleRefresh}
      />

      {/* Biometric Sandbox Security Screen */}
      <BiometricSandbox
        isEnabled={true}
        onToggle={() => {}}
        isLocked={isBiometricLocked}
        onUnlock={() => setIsBiometricLocked(false)}
      />
    </div>
  );
}
