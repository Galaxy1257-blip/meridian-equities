import React, { useState } from 'react';
import { 
  Newspaper, 
  Search, 
  Sparkles, 
  PiggyBank, 
  TrendingUp, 
  Flame, 
  Scale, 
  Calendar, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  Download, 
  Building2, 
  ArrowRight, 
  ChevronRight, 
  SlidersHorizontal, 
  Filter, 
  X, 
  FileText, 
  DollarSign, 
  AlertCircle,
  ExternalLink,
  Bell,
  Layers,
  ShieldCheck,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { GSEMarketNews, NewsCategory, Stock } from '../types';
import { REPUTABLE_NEWS_SOURCES } from '../data/sourcesData';

interface NewsSectionProps {
  newsList: GSEMarketNews[];
  stocks: Stock[];
  onSelectNews: (news: GSEMarketNews) => void;
  onSelectStockByTicker: (ticker: string) => void;
  onOpenAlertModalForStock: (ticker: string) => void;
  onOpenDividendCalendar: () => void;
  bookmarkedNewsIds: string[];
  onToggleBookmark: (newsId: string) => void;
  onNavigateToCommunity?: () => void;
  onNavigateToChat?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  newsList,
  stocks,
  onSelectNews,
  onSelectStockByTicker,
  onOpenAlertModalForStock,
  onOpenDividendCalendar,
  bookmarkedNewsIds,
  onToggleBookmark,
  onNavigateToCommunity,
  onNavigateToChat
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('ALL');
  const [selectedSourceId, setSelectedSourceId] = useState<string>('ALL');
  const [tickerFilter, setTickerFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'feed' | 'ipo_pipeline' | 'calendar'>('feed');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState<boolean>(false);
  const [isFetchingSources, setIsFetchingSources] = useState<boolean>(false);
  const [lastFetchedTime, setLastFetchedTime] = useState<string>('Just now');

  const handleRefreshSources = () => {
    setIsFetchingSources(true);
    setTimeout(() => {
      setIsFetchingSources(false);
      setLastFetchedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' GMT');
    }, 800);
  };

  // Available categories with counts
  const categories: { key: NewsCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'ALL', label: 'All Bulletins', icon: <Newspaper className="w-3.5 h-3.5" /> },
    { key: 'IPO', label: 'Upcoming IPOs', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: 'DIVIDEND', label: 'Dividends', icon: <PiggyBank className="w-3.5 h-3.5" /> },
    { key: 'EARNINGS', label: 'Financial Reports', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { key: 'TRADES', label: 'Block Trades', icon: <Flame className="w-3.5 h-3.5" /> },
    { key: 'REGULATORY', label: 'SEC & GSE Filings', icon: <Scale className="w-3.5 h-3.5" /> }
  ];

  // Filter news
  const filteredNews = newsList.filter((item) => {
    // Bookmark filter
    if (showOnlyBookmarked && !bookmarkedNewsIds.includes(item.id)) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
      return false;
    }

    // Source filter
    if (selectedSourceId !== 'ALL') {
      if (item.sourceId !== selectedSourceId) {
        // also check if source name partially matches
        const srcObj = REPUTABLE_NEWS_SOURCES.find(s => s.id === selectedSourceId);
        if (!srcObj || !item.source.toLowerCase().includes(srcObj.name.toLowerCase().slice(0, 4))) {
          return false;
        }
      }
    }

    // Ticker filter
    if (tickerFilter !== 'ALL' && !item.relatedTickers.includes(tickerFilter)) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchSource = item.source.toLowerCase().includes(q);
      const matchTicker = item.relatedTickers.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchSource && !matchTicker) {
        return false;
      }
    }

    return true;
  });

  const ipoItems = newsList.filter((n) => n.category === 'IPO' && n.ipoDetails);
  const dividendItems = newsList.filter((n) => n.category === 'DIVIDEND' && n.dividendDetails);
  const breakingNews = newsList.find((n) => n.isBreaking);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-20">
      {/* Top Sub-Navigation Pill Bar */}
      {(onNavigateToCommunity || onNavigateToChat) && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {onNavigateToCommunity && (
            <button
              onClick={onNavigateToCommunity}
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0 transition-colors"
            >
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>Investor Discussions</span>
            </button>
          )}
          {onNavigateToChat && (
            <button
              onClick={onNavigateToChat}
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>GSE Research Desk</span>
            </button>
          )}
          <button
            className="px-4 py-2 rounded-2xl text-xs font-black bg-purple-600 text-white shadow-md shadow-purple-600/20 flex items-center gap-2 shrink-0"
          >
            <Newspaper className="w-4 h-4" />
            <span>News & IPO Filings</span>
          </button>
        </div>
      )}

      {/* Reputable Sources Verification Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                Verified Source Network
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                {REPUTABLE_NEWS_SOURCES.length} Official Portals
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Curated directly from GSE Floor Circulars, SEC Ghana, Bank of Ghana, JoyBusiness, Citi Business & Bloomberg.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={handleRefreshSources}
            disabled={isFetchingSources}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 transition-colors border border-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isFetchingSources ? 'animate-spin' : ''}`} />
            <span>{isFetchingSources ? 'Syncing Feeds...' : 'Fetch Fresh News'}</span>
          </button>
        </div>
      </div>

      {/* Breaking / Top Market Bulletin Banner */}
      {breakingNews && (
        <div 
          onClick={() => onSelectNews(breakingNews)}
          className="bg-linear-to-r from-rose-900/90 via-slate-900 to-amber-950 text-white p-3.5 sm:p-4 rounded-2xl border border-rose-500/40 shadow-md flex items-center justify-between gap-3 cursor-pointer hover:border-rose-400 transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-[11px] font-black uppercase tracking-wider animate-pulse shrink-0 flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              BREAKING
            </span>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold truncate text-white group-hover:text-amber-300 transition-colors">
                {breakingNews.title}
              </h4>
              <p className="text-[11px] text-slate-300 truncate hidden sm:block">
                {breakingNews.summary}
              </p>
            </div>
          </div>

          <button className="text-xs font-bold text-amber-400 flex items-center gap-1 shrink-0 group-hover:translate-x-1 transition-transform">
            <span>Read Filing</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Filter & Navigation Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-5 transition-colors">
        {/* Top Header & View Modes */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  GSE Market News & Intelligence
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time corporate filings, IPO prospectuses, dividend schedules & floor block trades
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode('feed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'feed'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>All News Feed</span>
            </button>

            <button
              onClick={() => setViewMode('ipo_pipeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'ipo_pipeline'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>IPO Pipeline ({ipoItems.length})</span>
            </button>

            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'calendar'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Actions Calendar</span>
            </button>
          </div>
        </div>

        {/* Search, Source Filter, Bookmark Toggle & Ticker Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, filings, IPOs, or tickers (e.g., MTN, GCB, Lithium)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Reputable Source Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-white/[0.1] rounded-xl px-2.5 py-1.5 text-xs">
              <span className="text-slate-400 dark:text-slate-400 font-semibold text-[11px]">Source:</span>
              <select
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value)}
                className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">All Reputable Sources</option>
                {REPUTABLE_NEWS_SOURCES.map((src) => (
                  <option key={src.id} value={src.id} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">
                    {src.name} ({src.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Ticker Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-white/[0.1] rounded-xl px-2.5 py-1.5 text-xs">
              <span className="text-slate-400 dark:text-slate-400 font-semibold text-[11px]">Ticker:</span>
              <select
                value={tickerFilter}
                onChange={(e) => setTickerFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">All Companies</option>
                {stocks.map((s) => (
                  <option key={s.ticker} value={s.ticker} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">
                    {s.ticker} - {s.name}
                  </option>
                ))}
                <option value="ALLGH" className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">ALLGH - Atlantic Lithium</option>
                <option value="EDMI" className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">EDMI - Enterprise GAX</option>
              </select>
            </div>

            {/* Bookmarks Toggle Button */}
            <button
              onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                showOnlyBookmarked
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarked ? 'fill-slate-950' : ''}`} />
              <span>Saved ({bookmarkedNewsIds.length})</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills (when in feed view) */}
        {viewMode === 'feed' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const count = cat.key === 'ALL' 
                ? newsList.length 
                : newsList.filter(n => n.category === cat.key).length;

              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.key
                      ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  <span className="text-[10px] font-mono opacity-80 font-bold">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* View 1: NEWS FEED */}
      {viewMode === 'feed' && (
        <div className="space-y-4">
          {filteredNews.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto">
              <Newspaper className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {showOnlyBookmarked ? 'No Saved Articles' : 'No News Bulletins Found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {showOnlyBookmarked
                  ? 'Tap the bookmark icon on any market bulletin or IPO announcement to save it here for quick reference.'
                  : `No announcements found matching your current filter criteria.`}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedSourceId('ALL');
                  setTickerFilter('ALL');
                  setSearchQuery('');
                  setShowOnlyBookmarked(false);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Reset All News Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNews.map((news) => {
                const isBookmarked = bookmarkedNewsIds.includes(news.id);

                return (
                  <div
                    key={news.id}
                    onClick={() => onSelectNews(news)}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500 transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      {/* Top Meta Row */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                            news.category === 'IPO' ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300' :
                            news.category === 'DIVIDEND' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300' :
                            news.category === 'TRADES' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300' :
                            news.category === 'EARNINGS' ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300' :
                            'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                          }`}>
                            {news.category}
                          </span>

                          {news.isBreaking && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-500 text-[10px] font-black uppercase">
                              Breaking
                            </span>
                          )}

                          {news.pdfFileName && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              PDF Filing
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleBookmark(news.id);
                            }}
                            className={`p-1.5 rounded-lg text-xs transition-colors ${
                              isBookmarked
                                ? 'text-amber-500 hover:text-amber-600'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                          >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {news.title}
                      </h3>

                      {/* Source attribution line */}
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span>Source: {news.source}</span>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {news.summary}
                      </p>

                      {/* Key Metric Highlight Card if any */}
                      {news.metrics && news.metrics.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-center">
                          {news.metrics.slice(0, 3).map((m, idx) => (
                            <div key={idx} className="min-w-0">
                              <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">
                                {m.label}
                              </span>
                              <span className={`text-xs font-black font-mono truncate block ${
                                m.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                              }`}>
                                {m.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Metadata & Tickers */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {news.relatedTickers.map((ticker) => (
                          <span 
                            key={ticker}
                            className="font-mono font-bold text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                          >
                            {ticker}
                          </span>
                        ))}
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                          {news.timestamp}
                        </span>
                      </div>

                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Read</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* View 2: IPO PIPELINE TRACKER */}
      {viewMode === 'ipo_pipeline' && (
        <div className="space-y-4">
          <div className="bg-purple-900/10 dark:bg-purple-950/40 p-4 sm:p-5 rounded-3xl border border-purple-200 dark:border-purple-800/60 flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600 text-white font-black shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs text-purple-950 dark:text-purple-200 space-y-1">
              <h4 className="font-extrabold text-sm text-purple-950 dark:text-white">
                Upcoming Primary Market Listings & IPO Calendar
              </h4>
              <p className="leading-relaxed">
                Initial Public Offerings (IPOs) allow retail Ghanaian investors to purchase newly issued shares before they begin secondary trading on the Ghana Stock Exchange floor. You can participate using Mobile Money (MTN MoMo, Telecel Cash) or through licensed SEC brokers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ipoItems.map((item) => {
              const ipo = item.ipoDetails!;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectNews(item)}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer group space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-purple-600 text-white">
                          {ipo.proposedTicker}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                          {ipo.marketBoard}
                        </span>
                      </div>
                      <h3 className="font-black text-lg text-slate-900 dark:text-white mt-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {ipo.companyName}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Sector: {ipo.sector}
                      </span>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold shrink-0">
                      {ipo.status}
                    </span>
                  </div>

                  {/* Pricing & Targets Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Offer Price</span>
                      <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                        GH₵ {ipo.offerPrice.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Target Raise</span>
                      <span className="font-mono font-bold text-sm text-purple-700 dark:text-purple-300">
                        {ipo.targetRaise}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Min Lot</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {ipo.minSubscription}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                      <span><strong>Subscription Window:</strong> {ipo.subscriptionOpen} – {ipo.subscriptionClose}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-purple-500" />
                      <span><strong>Lead Sponsoring Broker:</strong> {ipo.leadBroker}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      Prospectus Available
                    </span>
                    <button className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex items-center gap-1">
                      <span>View Prospectus</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 3: ACTIONS & DIVIDEND / REPORTS CALENDAR */}
      {viewMode === 'calendar' && (
        <div className="space-y-4">
          <div className="bg-amber-500/10 dark:bg-amber-950/30 p-4 sm:p-5 rounded-3xl border border-amber-500/20 dark:border-amber-800/40 flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Corporate Actions, Dividends & Earnings Schedule
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Track upcoming ex-dividend cutoffs, books closure dates, and earnings release deadlines to ensure your portfolio qualifies for cash distributions.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenDividendCalendar}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 text-white dark:text-slate-950 text-xs font-bold transition-all shadow-xs"
            >
              Open Full Dividend Matrix
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Upcoming Milestones & Books Closure Timeline</span>
              </h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {dividendItems.map((item) => {
                const div = item.dividendDetails!;
                return (
                  <div 
                    key={item.id} 
                    onClick={() => onSelectNews(item)}
                    className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-850/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex flex-col items-center justify-center font-mono font-black text-xs shrink-0">
                        <span>{div.ticker}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                            Cash Dividend
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Qualifying Date: <strong className="text-slate-700 dark:text-slate-200">{div.qualifyingDate}</strong> • Payout Date: <strong className="text-emerald-600 dark:text-emerald-400">{div.paymentDate}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Dividend / Share</span>
                        <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                          GH₵ {div.amountPerShare.toFixed(3)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStockByTicker(div.ticker);
                        }}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-200 transition-colors"
                        title="View stock details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {ipoItems.map((item) => {
                const ipo = item.ipoDetails!;
                return (
                  <div 
                    key={item.id} 
                    onClick={() => onSelectNews(item)}
                    className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-850/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex flex-col items-center justify-center font-mono font-black text-xs shrink-0">
                        <span>{ipo.proposedTicker}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {ipo.companyName} Initial Public Offering
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300">
                            IPO Listing
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Subscription: <strong className="text-slate-700 dark:text-slate-200">{ipo.subscriptionOpen} – {ipo.subscriptionClose}</strong> • Listing Date: <strong className="text-purple-600 dark:text-purple-400">{ipo.listingDate}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Offer Price</span>
                        <span className="font-mono font-black text-sm text-purple-600 dark:text-purple-400">
                          GH₵ {ipo.offerPrice.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNews(item);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
                      >
                        Prospectus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
