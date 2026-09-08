import React, { useState } from 'react';
import {
  MessageSquare, Heart, TrendingUp, Sparkles, Award, Share2,
  Filter, Plus, Send, CheckCircle2, User, Hash, Flame
} from 'lucide-react';
import { Stock, UserProfile } from '../types';

interface MoneyTalkFeedProps {
  stocks: Stock[];
  userProfile?: UserProfile | null;
  onSelectStock: (stock: Stock) => void;
  onOpenAuthModal: () => void;
}

interface Post {
  id: string;
  authorName: string;
  authorHandle: string;
  avatar: string;
  isVerified: boolean;
  timeAgo: string;
  content: string;
  likes: number;
  likedByMe: boolean;
  replies: number;
  tag: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorName: 'Kwame Osei',
    authorHandle: '@k_osei_gse',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    timeAgo: '15m ago',
    content: 'Just analyzed _MTNGH quarterly figures. Solid MoMo growth across francophone integration corridors. Target dividend yield projected at 7.2% for Q4. Accumulating at current levels! #DividendSeason #MTNGhana',
    likes: 28,
    likedByMe: false,
    replies: 7,
    tag: 'Analysis',
  },
  {
    id: 'post-2',
    authorName: 'Ama Boateng',
    authorHandle: '@ama_invests',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    timeAgo: '1h ago',
    content: '_BOPP palm oil export volumes remain very high despite global commodity shifts. Book value per share looks very attractive. Who else holds _BOPP for long-term compound growth? #BOPPBreakout #GSE2026',
    likes: 42,
    likedByMe: true,
    replies: 12,
    tag: 'Discussion',
  },
  {
    id: 'post-3',
    authorName: 'David Annan',
    authorHandle: '@annan_capital',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isVerified: false,
    timeAgo: '3h ago',
    content: '_GCB and _CAL looking ripe for banking sector recovery. With inflation cooling down and domestic debt exchange dust settled, credit expansion is returning. #BankingTurnaround #CalBankDip',
    likes: 19,
    likedByMe: false,
    replies: 4,
    tag: 'Macro',
  },
  {
    id: 'post-4',
    authorName: 'Dr. Mensah K.',
    authorHandle: '@dr_mensah',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    timeAgo: '5h ago',
    content: 'Remember: 0% Capital Gains Tax on GSE listed equities + 8% final withholding on cash dividends. Don’t sleep on local equities while chasing volatile offshore instruments. #GSEWealth #FinancialFreedom',
    likes: 64,
    likedByMe: false,
    replies: 15,
    tag: 'Education',
  },
];

export const MoneyTalkFeed: React.FC<MoneyTalkFeedProps> = ({
  stocks,
  userProfile,
  onSelectStock,
  onOpenAuthModal,
}) => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [filter, setFilter] = useState<'ALL' | 'TRENDING' | 'VERIFIED'>('ALL');
  const [newPostText, setNewPostText] = useState('');

  const trendingHashtags = [
    '#GSE2026',
    '#DividendSeason',
    '#MTNGhana',
    '#CalBankDip',
    '#BOPPBreakout',
    '#BankingTurnaround',
  ];

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
            likedByMe: !p.likedByMe,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    if (!userProfile) {
      onOpenAuthModal();
      return;
    }

    const created: Post = {
      id: `post-${Date.now()}`,
      authorName: userProfile.name,
      authorHandle: userProfile.handle || '@investor',
      avatar: userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isVerified: userProfile.isVerified,
      timeAgo: 'Just now',
      content: newPostText.trim(),
      likes: 0,
      likedByMe: false,
      replies: 0,
      tag: 'Community',
    };

    setPosts([created, ...posts]);
    setNewPostText('');
  };

  // Tokenize text: _TICKER, #hashtag, @handle
  const renderFormattedText = (content: string) => {
    const parts = content.split(/(\_[A-Z0-9]+|\#[A-Za-z0-9_]+|\@[A-Za-z0-9_]+)/g);

    return parts.map((part, index) => {
      if (part.startsWith('_')) {
        const ticker = part.substring(1);
        const matchedStock = stocks.find((s) => s.ticker === ticker);
        return (
          <button
            key={index}
            onClick={() => {
              if (matchedStock) onSelectStock(matchedStock);
            }}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono font-black text-xs hover:bg-emerald-500 hover:text-slate-950 transition-colors cursor-pointer"
            title={`View ${ticker} stock sheet`}
          >
            {ticker}
          </button>
        );
      }
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-amber-400 font-semibold mx-0.5">
            {part}
          </span>
        );
      }
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-cyan-400 font-medium underline underline-offset-2 mx-0.5">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const filteredPosts = posts.filter((p) => {
    if (filter === 'VERIFIED') return p.isVerified;
    if (filter === 'TRENDING') return p.likes >= 25;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Trending Ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 overflow-x-auto no-scrollbar shadow-sm">
        <div className="flex items-center gap-1 text-xs font-black text-amber-400 uppercase tracking-wider shrink-0">
          <Flame className="w-4 h-4" />
          <span>Trending:</span>
        </div>
        <div className="flex items-center gap-2">
          {trendingHashtags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-amber-300 hover:border-amber-500/40 cursor-pointer whitespace-nowrap transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Post Creator Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleCreatePost} className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs shrink-0">
              {userProfile?.name ? userProfile.name.charAt(0) : <User className="w-4 h-4" />}
            </div>
            <textarea
              rows={2}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Share an insight or thesis (use _TICKER like _MTNGH, #hashtag, @user)..."
              className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-slate-500">
              Tip: Prefix tickers with <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-400">_MTNGH</code> for interactive badge links.
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Thesis</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'TRENDING', 'VERIFIED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === tab
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'ALL' ? 'All Discussions' : tab === 'TRENDING' ? '🔥 High Engagement' : '✓ Verified Only'}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 transition-colors"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.avatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {post.authorName}
                    </span>
                    {post.isVerified && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {post.authorHandle} • {post.timeAgo}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {post.tag}
              </span>
            </div>

            {/* Post Content */}
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              {renderFormattedText(post.content)}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  post.likedByMe ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{post.likes}</span>
              </button>

              <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:text-cyan-400 transition-colors cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                <span>{post.replies} Replies</span>
              </button>

              <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:text-amber-400 transition-colors cursor-pointer">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
