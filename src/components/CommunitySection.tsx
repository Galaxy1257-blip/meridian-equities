import React, { useState } from 'react';
import { 
  Users, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, Sparkles, 
  ArrowRight, ShieldCheck, Flame, MessageCircle, BarChart3, Clock, 
  Send, HelpCircle, Building2, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Stock, MainNavTab, UserProfile } from '../types';
import { MoneyTalkFeed } from './MoneyTalkFeed';

interface CommunitySectionProps {
  stocks: Stock[];
  userVotes: Record<string, boolean>;
  onSubmitVote: (ticker: string, isBull: boolean) => void;
  onSelectStock: (stock: Stock) => void;
  onNavigateTab: (tab: MainNavTab) => void;
  onOpenJargon: (id: string) => void;
  userProfile?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

interface CommunityDiscussion {
  id: string;
  author: string;
  authorBadge: string;
  authorAvatar: string;
  timeAgo: string;
  ticker?: string;
  title: string;
  body: string;
  likes: number;
  commentsCount: number;
  tags: string[];
}

interface BlockTrade {
  id: string;
  time: string;
  ticker: string;
  company: string;
  shares: number;
  price: number;
  totalValueGhs: number;
  buyerBroker: string;
  sellerBroker: string;
  tradeType: 'Cross Trade' | 'Normal Board' | 'Institutional Block';
}

const INITIAL_DISCUSSIONS: CommunityDiscussion[] = [
  {
    id: 'disc-1',
    author: 'Kweku_Markets_GH',
    authorBadge: 'Senior Trader',
    authorAvatar: '👨🏾‍💼',
    timeAgo: '22m ago',
    ticker: 'MTNGH',
    title: 'MTN Ghana Interim Dividend & 5G Monetization Outlook',
    body: 'With Mobile Money tax normalization and MoMo transaction volumes up 28% YoY, MTN Ghana is positioned for an impressive final dividend payout. Any other long-term holders reinvesting via scrip dividend option?',
    likes: 42,
    commentsCount: 18,
    tags: ['Dividends', 'Telecom', '5G']
  },
  {
    id: 'disc-2',
    author: 'Akosua_Wealth',
    authorBadge: 'Chartered Analyst',
    authorAvatar: '👩🏾‍💻',
    timeAgo: '1h ago',
    ticker: 'GCB',
    title: 'GCB Bank NPL Recovery & Capital Adequacy Ratio',
    body: 'GCB Bank closed today with strong buy queues on the CSD board. After the DDEP restructuring, banking sector asset yields are stabilizing. Fair value target estimated between GH₵ 6.80 - GH₵ 7.40.',
    likes: 29,
    commentsCount: 12,
    tags: ['Banking', 'Valuation', 'DDEP']
  },
  {
    id: 'disc-3',
    author: 'Fiifi_Invest',
    authorBadge: 'Agric Sector Bull',
    authorAvatar: '👨🏾‍🌾',
    timeAgo: '3h ago',
    ticker: 'BOPP',
    title: 'Benso Oil Palm (BOPP) Crude Palm Oil Global Price Surge',
    body: 'Crude Palm Oil futures in Rotterdam are trending up. BOPP has zero debt and historic dividend yields exceeding 14%. An incredible hedge against local currency volatility.',
    likes: 38,
    commentsCount: 9,
    tags: ['Commodities', 'High Yield', 'Agric']
  },
  {
    id: 'disc-4',
    author: 'Esi_Growth',
    authorBadge: 'Retail Investor',
    authorAvatar: '👩🏾',
    timeAgo: '5h ago',
    ticker: 'TOTAL',
    title: 'TotalEnergies Marketing Ghana EV Charging Hubs in Airport City',
    body: 'Notice that Total is piloting rapid EV charging hubs along Accra-Tema motorway and Airport City. Great to see legacy oil marketing companies diversifying into future mobility.',
    likes: 21,
    commentsCount: 6,
    tags: ['Energy', 'EV Infrastructure']
  }
];

const RECENT_BLOCK_TRADES: BlockTrade[] = [
  {
    id: 'bt-1',
    time: '14:28 GMT',
    ticker: 'MTNGH',
    company: 'MTN Ghana',
    shares: 450000,
    price: 2.54,
    totalValueGhs: 1143000,
    buyerBroker: 'IC Securities Ghana',
    sellerBroker: 'Databank Brokerage Ltd',
    tradeType: 'Institutional Block'
  },
  {
    id: 'bt-2',
    time: '13:50 GMT',
    ticker: 'GCB',
    company: 'GCB Bank PLC',
    shares: 85000,
    price: 5.90,
    totalValueGhs: 501500,
    buyerBroker: 'CalBank Brokerage',
    sellerBroker: 'Black Star Brokerage',
    tradeType: 'Cross Trade'
  },
  {
    id: 'bt-3',
    time: '11:15 GMT',
    ticker: 'EGL',
    company: 'Enterprise Group PLC',
    shares: 60000,
    price: 3.10,
    totalValueGhs: 186000,
    buyerBroker: 'Databank Brokerage Ltd',
    sellerBroker: 'Strategic African Securities',
    tradeType: 'Normal Board'
  },
  {
    id: 'bt-4',
    time: '10:40 GMT',
    ticker: 'BOPP',
    company: 'Benso Oil Palm Plantation',
    shares: 25000,
    price: 22.85,
    totalValueGhs: 571250,
    buyerBroker: 'IC Securities Ghana',
    sellerBroker: 'GCB Capital Ltd',
    tradeType: 'Institutional Block'
  }
];

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  stocks,
  userVotes,
  onSubmitVote,
  onSelectStock,
  onNavigateTab,
  onOpenJargon,
  userProfile,
  onOpenAuthModal
}) => {
  const [activeCommunityTab, setActiveCommunityTab] = useState<'moneytalk' | 'discussions'>('moneytalk');
  const [discussions, setDiscussions] = useState<CommunityDiscussion[]>(INITIAL_DISCUSSIONS);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [filterTopic, setFilterTopic] = useState<string>('All');
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [selectedPostTicker, setSelectedPostTicker] = useState<string>('MTNGH');
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const handleLikePost = (id: string) => {
    setLikedPosts(prev => {
      const isCurrentlyLiked = !!prev[id];
      const next = { ...prev, [id]: !isCurrentlyLiked };

      setDiscussions(curr =>
        curr.map(post => {
          if (post.id === id) {
            return {
              ...post,
              likes: isCurrentlyLiked ? Math.max(0, post.likes - 1) : post.likes + 1
            };
          }
          return post;
        })
      );

      return next;
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newDiscussion: CommunityDiscussion = {
      id: `disc-${Date.now()}`,
      author: userProfile?.name || 'You (Accra Investor 🇬🇭)',
      authorBadge: userProfile?.isVerified 
        ? `SMS Verified Investor 🇬🇭 (${userProfile.networkProvider || 'MTN'})` 
        : 'Community Member',
      authorAvatar: '👤',
      timeAgo: 'Just now',
      ticker: selectedPostTicker,
      title: newPostTitle.trim(),
      body: newPostContent.trim(),
      likes: 1,
      commentsCount: 0,
      tags: ['Discussion', selectedPostTicker]
    };

    setDiscussions(prev => [newDiscussion, ...prev]);
    setLikedPosts(prev => ({ ...prev, [newDiscussion.id]: true }));
    setNewPostTitle('');
    setNewPostContent('');
    setIsPosting(false);
  };

  // Calculate market-wide sentiment
  const totalBullVotes = stocks.reduce((acc, s) => acc + (s.bullVotes || 0), 0);
  const totalBearVotes = stocks.reduce((acc, s) => acc + (s.bearVotes || 0), 0);
  const totalSentimentVotes = totalBullVotes + totalBearVotes || 1;
  const overallBullishPercent = Math.round((totalBullVotes / totalSentimentVotes) * 100);

  const topics = ['All', 'MTNGH', 'GCB', 'BOPP', 'Dividends', 'Banking'];

  const filteredDiscussions = filterTopic === 'All'
    ? discussions
    : discussions.filter(d => d.ticker === filterTopic || d.tags.includes(filterTopic));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Sub-Navigation Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveCommunityTab('moneytalk')}
          className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeCommunityTab === 'moneytalk'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>MoneyTalk Signals Feed</span>
        </button>
        <button
          onClick={() => setActiveCommunityTab('discussions')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeCommunityTab === 'discussions'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Investor Forum</span>
        </button>
        <button
          onClick={() => onNavigateTab('chat')}
          className="px-4 py-2 rounded-2xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0 transition-colors"
        >
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          <span>GSE Research Desk</span>
        </button>
        <button
          onClick={() => onNavigateTab('news')}
          className="px-4 py-2 rounded-2xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>News & IPO Filings</span>
        </button>
      </div>

      {activeCommunityTab === 'moneytalk' && (
        <div className="animate-in fade-in duration-200">
          <MoneyTalkFeed
            stocks={stocks}
            userProfile={userProfile}
            onSelectStock={onSelectStock}
            onOpenAuthModal={onOpenAuthModal || (() => {})}
          />
        </div>
      )}

      {/* Top Banner: Community Overview & Live Chat Link */}
      {activeCommunityTab === 'discussions' && (
      <>
      <div className="bg-linear-to-r from-slate-900 via-slate-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
              <Users className="w-3.5 h-3.5" />
              <span>GSE Investor Community & Sentiment Floor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ghana Stock Exchange Investor Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Connect with Ghana's retail and institutional investor community. Cast your daily bull/bear sentiment votes, monitor floor block trades, and engage with market participants.
            </p>
          </div>

          {/* Quick CTA to Chat Lounge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('chat')}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Live Investor Chat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPosting(prev => !prev)}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isPosting ? 'Cancel Post' : 'Start Discussion'}</span>
            </button>
          </div>
        </div>

        {/* Aggregate Sentiment Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall GSE Sentiment</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-black text-emerald-400">{overallBullishPercent}% Bullish</span>
              <span className="text-xs text-rose-400 font-bold">{100 - overallBullishPercent}% Bearish</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2 flex">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${overallBullishPercent}%` }} />
              <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${100 - overallBullishPercent}%` }} />
            </div>
            <div className="text-[10px] text-slate-500 mt-1.5">{totalSentimentVotes} total investor votes recorded</div>
          </div>

          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Voted Bull Stock</div>
              <div className="text-lg font-black text-white mt-0.5">MTN Ghana (MTNGH)</div>
              <div className="text-[11px] text-emerald-400 font-bold">92% Bullish Sentiment (1,420 votes)</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              🐂
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Block Trades</div>
              <div className="text-lg font-black text-white mt-0.5">GH₵ 2.40 Million</div>
              <div className="text-[11px] text-amber-400 font-bold">4 Institutional Crosses Logged</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              🏛️
            </div>
          </div>
        </div>
      </div>

      {/* Write New Discussion Post (Collapsible) */}
      {isPosting && (
        <form onSubmit={handleCreatePost} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Share Analysis or Question with GSE Investors</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsPosting(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <input
                type="text"
                placeholder="Topic Title (e.g. GCB Dividend Prospects for 2025...)"
                value={newPostTitle}
                onChange={e => setNewPostTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <select
                value={selectedPostTicker}
                onChange={e => setSelectedPostTicker(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-white/[0.1] text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {stocks.map(s => (
                  <option key={s.ticker} value={s.ticker} className="bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100">
                    {s.ticker} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            placeholder="Write your market insights, fundamental analysis, or question here. Respect community guidelines..."
            value={newPostContent}
            onChange={e => setNewPostContent(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Posting as: <strong className="text-amber-500">Accra Investor 🇬🇭</strong>
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-extrabold flex items-center gap-1.5 hover:bg-slate-800 dark:hover:bg-amber-400 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Post</span>
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Discussions Feed (Left) & Sentiment / Block Trades (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Community Discussions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Topic Filters */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-center gap-1.5">
              {topics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setFilterTopic(topic)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterTopic === topic
                      ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {topic === 'All' ? '🔥 All Discussions' : topic}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-400 font-bold shrink-0 hidden sm:inline">
              {filteredDiscussions.length} posts
            </span>
          </div>

          {/* Posts List */}
          <div className="space-y-3">
            {filteredDiscussions.map(post => {
              const isLiked = !!likedPosts[post.id];
              return (
                <div
                  key={post.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm">
                        {post.authorAvatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {post.author}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                            {post.authorBadge}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    {post.ticker && (
                      <button
                        onClick={() => {
                          const stock = stocks.find(s => s.ticker === post.ticker);
                          if (stock) onSelectStock(stock);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 text-xs font-black hover:bg-amber-100 transition-colors"
                      >
                        ${post.ticker}
                      </button>
                    )}
                  </div>

                  {/* Title & Body */}
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {post.body}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-1.5 font-bold transition-all px-2.5 py-1 rounded-lg ${
                          isLiked
                            ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 font-black'
                            : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      <button
                        onClick={() => onNavigateTab('chat')}
                        className="flex items-center gap-1.5 font-bold hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>{post.commentsCount} comments</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onNavigateTab('chat')}
                      className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Join in Chat</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Stock Sentiment Voting & Recent Block Trades */}
        <div className="space-y-6">
          {/* Interactive Stock Sentiment Voting */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Vote Stock Sentiment
                </h3>
              </div>
              <button
                onClick={() => onOpenJargon('market_sentiment')}
                className="text-[11px] text-slate-400 hover:text-amber-500"
                title="What is Market Sentiment?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Cast your vote on top Ghana equities to influence the community market barometer.
            </p>

            <div className="space-y-3">
              {stocks.slice(0, 5).map(stock => {
                const userVote = userVotes[stock.ticker] ?? null;
                const bullVotes = stock.bullVotes || 0;
                const bearVotes = stock.bearVotes || 0;
                const totalVotes = bullVotes + bearVotes || 1;
                const bullPct = Math.round((bullVotes / totalVotes) * 100);

                return (
                  <div
                    key={stock.ticker}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => onSelectStock(stock)}
                        className="font-black text-xs text-slate-900 dark:text-white hover:text-amber-500 text-left"
                      >
                        {stock.ticker} <span className="font-normal text-[10px] text-slate-500 dark:text-slate-400">({stock.name})</span>
                      </button>
                      <span className={`text-xs font-mono font-bold ${bullPct >= 50 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {bullPct}% Bullish
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${bullPct}%` }} />
                      <div className="bg-rose-500 h-full transition-all" style={{ width: `${100 - bullPct}%` }} />
                    </div>

                    {/* Voting Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => onSubmitVote(stock.ticker, true)}
                        className={`flex-1 py-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                          userVote === true
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Bullish ({bullVotes})</span>
                      </button>
                      <button
                        onClick={() => onSubmitVote(stock.ticker, false)}
                        className={`flex-1 py-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                          userVote === false
                            ? 'bg-rose-500 text-white font-black shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>Bearish ({bearVotes})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GSE Floor Block Trades */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Recent GSE Floor Block Trades
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                CSD Verified
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              High-value institutional crosses reported by licensed GSE broker-dealers.
            </p>

            <div className="space-y-2.5">
              {RECENT_BLOCK_TRADES.map(trade => (
                <div
                  key={trade.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 dark:text-white">{trade.ticker}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{trade.time}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      GH₵ {trade.totalValueGhs.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>{trade.shares.toLocaleString()} shares @ GH₵ {trade.price.toFixed(2)}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 font-bold">
                      {trade.tradeType}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span>Buyer: <strong>{trade.buyerBroker}</strong></span>
                    <span>Seller: <strong>{trade.sellerBroker}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
