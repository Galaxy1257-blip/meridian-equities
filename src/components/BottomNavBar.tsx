import React from 'react';
import { Home, TrendingUp, Briefcase, Calculator, Users, Newspaper, MessageSquare } from 'lucide-react';
import { MainNavTab } from '../types';

interface BottomNavBarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  communityCount?: number;
  chatUnreadCount?: number;
  newsCount?: number;
  holdingsCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  communityCount = 0,
  chatUnreadCount = 0,
  newsCount = 0,
  holdingsCount = 0
}) => {
  const isHome = activeTab === 'home';
  const isMarkets = activeTab === 'markets';
  const isPortfolio = activeTab === 'portfolio';
  const isCalculators = activeTab === 'calculators' || activeTab === 'learn';
  const isCommunity = activeTab === 'community' || activeTab === 'chat';
  const isNews = activeTab === 'news';

  const totalCommunityBadge = (communityCount > 0 ? communityCount : 0) + (chatUnreadCount > 0 ? chatUnreadCount : 0);

  const navItems = [
    {
      id: 'home' as MainNavTab,
      label: 'Home',
      icon: Home,
      isActive: isHome,
      badge: null
    },
    {
      id: 'markets' as MainNavTab,
      label: 'Stocks',
      icon: TrendingUp,
      isActive: isMarkets,
      badge: null
    },
    {
      id: 'portfolio' as MainNavTab,
      label: 'Portfolio',
      icon: Briefcase,
      isActive: isPortfolio,
      badge: holdingsCount > 0 ? holdingsCount : null,
      badgeColor: 'bg-cyan-500 text-slate-950 font-bold'
    },
    {
      id: 'news' as MainNavTab,
      label: 'News',
      icon: Newspaper,
      isActive: isNews,
      badge: newsCount > 0 ? newsCount : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    },
    {
      id: 'community' as MainNavTab,
      label: 'AI Chat',
      icon: MessageSquare,
      isActive: isCommunity,
      badge: totalCommunityBadge > 0 ? totalCommunityBadge : null,
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold'
    },
    {
      id: 'calculators' as MainNavTab,
      label: 'Calculators',
      icon: Calculator,
      isActive: isCalculators,
      badge: null
    }
  ];

  return (
    <nav 
      aria-label="Bottom Navigation Menu"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#060B18]/90 backdrop-blur-xl border-t border-slate-800/80 text-slate-400 py-1 px-3 safe-area-bottom shadow-2xl transition-all md:hidden"
    >
      <div className="max-w-lg mx-auto grid grid-cols-6 gap-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all relative group touch-manipulation min-h-[48px] cursor-pointer ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Backdrop Pill */}
              {isActive && (
                <div className="absolute inset-0 bg-amber-500/15 rounded-xl pointer-events-none border border-amber-500/30 shadow-xs shadow-amber-500/10" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-amber-400' : 'group-hover:scale-105'
                  }`}
                />
                {item.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2 text-[8px] font-mono px-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-full leading-none shadow-sm ${
                      item.badgeColor || 'bg-amber-500 text-slate-950 font-bold'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9px] font-mono mt-0.5 transition-colors block truncate w-full text-center ${
                  isActive ? 'text-amber-300 font-black' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
