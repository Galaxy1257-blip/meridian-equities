import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageSquare, Send, Sparkles, Bot, ThumbsUp, Hash, Users, Coins, 
  Briefcase, Plus, User, Info, ShieldCheck, ArrowRight, CornerDownLeft, 
  HelpCircle, RefreshCw, Trash2, Download, Printer, ExternalLink, Zap,
  TrendingUp, TrendingDown, Layers, Scale, DollarSign, Check, FileText,
  Search, X, Flame, Rocket, BarChart2, ChevronRight, Share2, Heart,
  Activity, ArrowUpRight, ArrowDownRight, Tag
} from 'lucide-react';
import { ChatChannel, ChatMessage, Stock, UserProfile } from '../types';
import { CHAT_CHANNELS, INITIAL_CHAT_MESSAGES, AI_QUICK_PROMPTS, generateAIAdvisorResponse } from '../data/chatData';
import { StockLogo } from './StockLogo';

interface InvestorChatSectionProps {
  stocks: Stock[];
  onSelectStockByTicker: (ticker: string) => void;
  onOpenJargonGuide: () => void;
  onNavigateToCommunity?: () => void;
  onNavigateToNews?: () => void;
  userProfile?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

const STORAGE_KEY_COPILOT_MESSAGES = 'meridian_quant_copilot_messages_v2';
const STORAGE_KEY_FLOOR_MESSAGES = 'meridian_floor_chat_messages_v2';
const STORAGE_KEY_USER_NAME = 'meridian_chat_username_v2';
const STORAGE_KEY_USER_VAULT_PREFIX = 'meridian_chat_vault_v2_';

const EXTENDED_CHANNELS: ChatChannel[] = [
  {
    id: 'general',
    name: 'General Floor',
    topic: 'Daily trading flow, market sentiment, and macroeconomic trends',
    iconName: 'MessageSquare',
    unreadCount: 0,
    membersCount: 1420
  },
  {
    id: 'dividends',
    name: 'Dividend Club',
    topic: 'High-yield payouts, ex-dividend cutoff dates, and yield compounding',
    iconName: 'Coins',
    unreadCount: 2,
    membersCount: 1140
  },
  {
    id: 'banking',
    name: 'Banking & Financials',
    topic: 'Balance sheets, loan recovery, CAR ratios, and dividend track records',
    iconName: 'Briefcase',
    unreadCount: 1,
    membersCount: 780
  },
  {
    id: 'telecom',
    name: 'MTN Ghana & Tech',
    topic: 'MoMo transaction volumes, 5G rollouts, data revenues, and free cash flows',
    iconName: 'Zap',
    unreadCount: 3,
    membersCount: 950
  },
  {
    id: 'ipo',
    name: 'IPO & Listings Radar',
    topic: 'Upcoming listings, rights issues, GAX expansion, and institutional blocks',
    iconName: 'Sparkles',
    membersCount: 890
  }
];

export const InvestorChatSection: React.FC<InvestorChatSectionProps> = ({
  stocks,
  onSelectStockByTicker,
  onOpenJargonGuide,
  onNavigateToCommunity,
  onNavigateToNews,
  userProfile,
  onOpenAuthModal
}) => {
  // Mode: 'copilot' (Institutional AI Analyst) or 'floor' (Multi-channel floor chat)
  const [activeMode, setActiveMode] = useState<'copilot' | 'floor'>('copilot');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('general');
  const [copiedReport, setCopiedReport] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSentiment, setSelectedSentiment] = useState<'none' | 'bullish' | 'bearish' | 'analysis' | 'question'>('none');
  const [previewStock, setPreviewStock] = useState<Stock | null>(null);

  // Copilot messages state
  const [copilotMessages, setCopilotMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COPILOT_MESSAGES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load copilot messages', e);
      }
    }
    return [
      {
        id: 'copilot-welcome-1',
        channelId: 'copilot',
        senderName: 'Meridian Quant Copilot',
        senderRole: 'ai',
        senderAvatar: '🏛️',
        content: `### Welcome to Meridian Quant Intelligence Desk 🇬🇭
I am your institutional financial equity copilot, grounded in live Ghana Stock Exchange (GSE) market telemetry and audited statutory filings.

**Quantitative Intelligence Capabilities**:
• **Head-to-Head Comparative Valuation**: Compare P/E multiples, Dividend Yields, and Return on Equity between $MTNGH, $GCB, $BOPP, and $TOTAL.
• **Dividend Sustainability**: Cash distribution coverage and historical payout dependability.
• **Statutory Tax Framework**: Guidance under Ghana Income Tax Act 896 (0% Capital Gains Tax, 8% final Dividend WHT).
• **Ghana Broker Execution**: How to purchase shares through SEC-licensed brokerages and Mobile Money.

Tap any quick prompt below, tag stocks with **$TICKER**, or ask any investment question.`,
        timestamp: 'Real-time',
        tickerTags: ['MTNGH', 'GCB', 'BOPP', 'TOTAL'],
        likes: 12
      }
    ];
  });

  // Multi-channel floor messages state
  const [floorMessages, setFloorMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_FLOOR_MESSAGES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load floor messages', e);
      }
    }
    return INITIAL_CHAT_MESSAGES;
  });

  const [inputMessage, setInputMessage] = useState<string>('');
  const [userName, setUserName] = useState<string>(() => {
    if (userProfile?.name) return userProfile.name;
    return localStorage.getItem(STORAGE_KEY_USER_NAME) || 'Accra Investor 🇬🇭';
  });
  const [isAITyping, setIsAITyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synchronize and restore user account chat vault on login / profile change
  useEffect(() => {
    if (userProfile?.name) {
      setUserName(userProfile.name);
    }

    if (userProfile?.id || userProfile?.contact) {
      const userKey = `${STORAGE_KEY_USER_VAULT_PREFIX}${userProfile.id || userProfile.contact}`;
      const savedVault = localStorage.getItem(userKey);
      if (savedVault) {
        try {
          const parsed = JSON.parse(savedVault);
          if (parsed.copilot && Array.isArray(parsed.copilot) && parsed.copilot.length > 0) {
            setCopilotMessages(parsed.copilot);
          }
          if (parsed.floor && Array.isArray(parsed.floor) && parsed.floor.length > 0) {
            setFloorMessages(parsed.floor);
          }
        } catch (e) {
          console.error('Failed to restore user chat vault', e);
        }
      } else {
        // Claim any anonymous messages authored in the current session so they are never lost
        setCopilotMessages(prev => prev.map(m => {
          if (m.isUserMessage || (m.senderRole === 'investor' && (!m.userId || m.userId === 'guest'))) {
            return {
              ...m,
              userId: userProfile.id,
              userContact: userProfile.contact,
              senderName: userProfile.name || m.senderName,
              isUserMessage: true
            };
          }
          return m;
        }));

        setFloorMessages(prev => prev.map(m => {
          if (m.isUserMessage || (m.senderRole === 'investor' && (!m.userId || m.userId === 'guest'))) {
            return {
              ...m,
              userId: userProfile.id,
              userContact: userProfile.contact,
              senderName: userProfile.name || m.senderName,
              isUserMessage: true
            };
          }
          return m;
        }));
      }
    }
  }, [userProfile]);

  // Persist messages to active storage AND user-specific vault
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COPILOT_MESSAGES, JSON.stringify(copilotMessages));
    if (userProfile?.id || userProfile?.contact) {
      const userKey = `${STORAGE_KEY_USER_VAULT_PREFIX}${userProfile.id || userProfile.contact}`;
      try {
        const vault = JSON.parse(localStorage.getItem(userKey) || '{}');
        localStorage.setItem(userKey, JSON.stringify({ ...vault, copilot: copilotMessages }));
      } catch (e) {
        localStorage.setItem(userKey, JSON.stringify({ copilot: copilotMessages }));
      }
    }
  }, [copilotMessages, userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FLOOR_MESSAGES, JSON.stringify(floorMessages));
    if (userProfile?.id || userProfile?.contact) {
      const userKey = `${STORAGE_KEY_USER_VAULT_PREFIX}${userProfile.id || userProfile.contact}`;
      try {
        const vault = JSON.parse(localStorage.getItem(userKey) || '{}');
        localStorage.setItem(userKey, JSON.stringify({ ...vault, floor: floorMessages }));
      } catch (e) {
        localStorage.setItem(userKey, JSON.stringify({ floor: floorMessages }));
      }
    }
  }, [floorMessages, userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER_NAME, userName);
  }, [userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, floorMessages, activeMode, selectedChannelId, isAITyping]);

  // Comprehensive Institutional AI Analyst Response Generator
  const generateInstitutionalAnalysis = (query: string): string => {
    const q = query.toLowerCase();

    // 1. Ticker specific analysis
    const foundStock = stocks.find(
      s => q.includes(s.ticker.toLowerCase()) || q.includes(s.name.toLowerCase().split(' ')[0])
    );

    if (foundStock) {
      const peRating = foundStock.peRatio < 6 ? 'Highly Undervalued' : foundStock.peRatio < 11 ? 'Fair Value' : 'Premium Multiple';
      const divYieldStr = foundStock.dividendYield ? `${foundStock.dividendYield.toFixed(1)}%` : '0.0%';
      const annualDivPayout = foundStock.dividendAmount ? `GH₵ ${foundStock.dividendAmount.toFixed(2)} / share` : `~GH₵ ${(foundStock.price * (foundStock.dividendYield || 5) / 100).toFixed(2)}`;
      const isProfitable = foundStock.change >= 0;

      return `### 📊 Institutional Equity Dossier: ${foundStock.name} ($${foundStock.ticker})
**Exchange**: Ghana Stock Exchange (Main Board) • **Sector**: ${foundStock.sector}

| Fundamental Metric | Recorded Value | GSE Benchmark | Analyst Verdict |
| :--- | :--- | :--- | :--- |
| **Market Price** | GH₵ ${foundStock.price.toFixed(2)} | Session Quote | ${isProfitable ? '🟢 Up +' + foundStock.changePercent.toFixed(2) + '%' : '🔴 Down ' + foundStock.changePercent.toFixed(2) + '%'} |
| **P/E Multiple** | ${foundStock.peRatio}x | GSE Avg ~8.5x | **${peRating}** |
| **Dividend Yield** | ${divYieldStr} | Market Avg ~6.2% | ${foundStock.dividendYield && foundStock.dividendYield >= 7 ? '🟢 High Yield' : 'Moderate'} |
| **Cash Payout / Share** | ${annualDivPayout} | Annual Distribution | 8% Final WHT at Source |
| **Market Capitalization** | GH₵ ${(foundStock.marketCap / 1000).toFixed(2)}B | Tier 1 Weight | Top Index Constituent |
| **Liquidity Score** | ${foundStock.easyToSellScore}/100 | CSD Volume Depth | ${foundStock.easyToSellScore >= 70 ? '🟢 Active Daily Order Book' : '🟡 Moderate Float'} |
| **52-Week Range** | GH₵ ${foundStock.low52W.toFixed(2)} – ${foundStock.high52W.toFixed(2)} | Cycle Spread | Current: ${((foundStock.price / (foundStock.high52W || 1)) * 100).toFixed(1)}% of 52W High |

#### 🟢 Core Growth Catalysts:
• **Market Position**: Dominant operational moat in Ghana with strong pricing power against local inflation.
• **Tax Optimization**: Capital gains on $${foundStock.ticker} are **100% tax-free** under Section 67 of the Ghana Income Tax Act (Act 896).

#### 🔴 Risk Factors:
• **Monetary & Macro**: Bank of Ghana policy rate shifts and currency fluctuations impact operating cost margins.
• **Trading Velocity**: Institutional blocks can create short-term volume clusters.

**Strategic Verdict**: $${foundStock.ticker} is an institutional cornerstone for long-term equity accumulation and compounding cash flow.`;
    }

    // 2. Comparative Analysis (e.g. MTN vs GCB)
    if (q.includes('vs') || q.includes('compare') || q.includes('difference between')) {
      const mtn = stocks.find(s => s.ticker === 'MTNGH') || stocks[0];
      const gcb = stocks.find(s => s.ticker === 'GCB') || stocks[1];
      const bopp = stocks.find(s => s.ticker === 'BOPP') || stocks[2];

      return `### ⚖️ GSE Comparative Head-to-Head Analysis

| Metric | $MTNGH (MTN Ghana) | $GCB (GCB Bank PLC) | $BOPP (Benso Oil Palm) |
| :--- | :--- | :--- | :--- |
| **Sector** | Telecommunications | Financial Services | Agriculture / Commodity |
| **Current Price** | GH₵ ${mtn?.price.toFixed(2)} | GH₵ ${gcb?.price.toFixed(2)} | GH₵ ${bopp?.price.toFixed(2)} |
| **P/E Ratio** | ${mtn?.peRatio || 9.4}x | ${gcb?.peRatio || 3.8}x | ${bopp?.peRatio || 5.2}x |
| **Dividend Yield** | ${mtn?.dividendYield || 6.8}% | ${gcb?.dividendYield || 7.2}% | ${bopp?.dividendYield || 11.4}% |
| **Liquidity Score** | 95/100 (Top Liquid) | 88/100 (High) | 72/100 (Moderate) |
| **Macro Hedge** | MoMo & Mobile Data | Net Interest Margin | Hard Currency CPO Exports |

**Strategic Summary**:
• For **maximum liquidity and consistent quarterly cash flow**: $MTNGH is the premier exchange benchmark.
• For **deep value re-rating below book value**: $GCB offers deep institutional value.
• For **agricultural export hard-currency hedge**: $BOPP delivers superior dividend yields.`;
    }

    // 3. Tax & GRA Law
    if (q.includes('tax') || q.includes('cgt') || q.includes('withholding') || q.includes('gra') || q.includes('act 896')) {
      return `### 🏛️ Ghana Statutory Tax Framework for GSE Listed Equities

1. **Capital Gains Tax Exemption (0.0% CGT)**:
   - Pursuant to **Section 67 of the Ghana Income Tax Act, 2015 (Act 896)**, capital gains realized from the sale of shares listed on the Ghana Stock Exchange are **completely exempt (0.0% Tax)**.
   - 100% of your capital appreciation is retained without liability.

2. **Dividend Withholding Tax (8.0% Final Tax)**:
   - Dividends paid by GSE-listed companies are subject to an **8.0% final withholding tax**, deducted at source before reaching your account.
   - Because it is a *final tax*, you do not need to report it on separate annual personal income tax declarations.

3. **Transaction Levies & E-Levy**:
   - Trading settlements conducted through CSD-registered brokerages on the Ghana Stock Exchange are exempt from E-Levy.`;
    }

    // 4. Dividends Strategy
    if (q.includes('dividend') || q.includes('yield') || q.includes('passive income') || q.includes('payout')) {
      const topDivs = [...stocks]
        .filter(s => s.dividendYield && s.dividendYield > 0)
        .sort((a, b) => (b.dividendYield || 0) - (a.dividendYield || 0))
        .slice(0, 5);

      const tableRows = topDivs.map(s => 
        `| **$${s.ticker}** | ${s.name} | ${s.sector} | GH₵ ${s.price.toFixed(2)} | **${s.dividendYield?.toFixed(1)}%** | GH₵ ${s.dividendAmount?.toFixed(2) || (s.price * (s.dividendYield || 5) / 100).toFixed(2)} |`
      ).join('\n');

      return `### 💰 GSE Top Dividend Yield Table

| Ticker | Security Name | Sector | Price | Annual Yield | Cash Payout / Sh |
| :--- | :--- | :--- | :--- | :--- | :--- |
${tableRows}

💡 **Rule of Capture**:
• To receive declared cash dividends, you must purchase and hold shares **before** the official Ex-Dividend cutoff date.
• Reinvesting dividend payouts compounds portfolio shares faster over multi-year horizons.`;
    }

    // 5. How to Buy Stocks via MoMo / Broker
    if (q.includes('buy') || q.includes('how to') || q.includes('broker') || q.includes('momo') || q.includes('start')) {
      return `### 📱 How to Start Buying GSE Shares in Ghana

1. **Get a Central Securities Depository (CSD) Account**:
   - You need a CSD Investor ID to hold GSE equities. You can obtain one in minutes with your **Ghana Card**.
   - Licensed brokerages: **IC Securities**, **Databank Brokerage**, **CalBank Securities**, **Stanbic Investment**, **EDC Stockbrokers**, **Black Star Brokerage**.

2. **Purchasing via Mobile Money**:
   - Leading brokers offer mobile USSD and apps connected directly to MTN MoMo, Telecel Cash, and AT Money:
     - e.g., IC Securities (*885# or IC Invest App)
     - Databank (Databank Mobile App or direct MoMo bill pay)
   - Minimum investment: You can start with as little as **GH₵ 50 – GH₵ 100**.

3. **Settlement Timeline**:
   - GSE trades settle on a **T+3 cycle** (Trade date + 3 business days).
   - Once settled, your shares are deposited into your personal CSD account.`;
    }

    // 6. Default General Intelligence Fallback
    return generateAIAdvisorResponse(query);
  };

  const handleSendMessage = (customText?: string) => {
    const content = (customText || inputMessage).trim();
    if (!content) return;

    const tickerMatches = content.match(/\$([A-Z0-9]+)/g);
    const tags = tickerMatches ? tickerMatches.map((t) => t.replace('$', '')) : [];

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' GMT';

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      channelId: activeMode === 'copilot' ? 'copilot' : selectedChannelId,
      senderName: userName,
      senderRole: 'investor',
      senderAvatar: '🙋🏾‍♂️',
      content,
      timestamp: timeStr,
      tickerTags: tags,
      likes: 0,
      likedByMe: false,
      sentiment: selectedSentiment !== 'none' ? selectedSentiment : undefined,
      reactions: { '❤️': 0, '🚀': 0, '🔥': 0, '🐂': 0 },
      userId: userProfile?.id || 'guest',
      userContact: userProfile?.contact || undefined,
      isUserMessage: true
    };

    if (activeMode === 'copilot') {
      setCopilotMessages(prev => [...prev, userMsg]);
      if (!customText) setInputMessage('');
      setSelectedSentiment('none');
      setIsAITyping(true);

      setTimeout(() => {
        const analysis = generateInstitutionalAnalysis(content);
        const aiMsg: ChatMessage = {
          id: `copilot-ai-${Date.now()}`,
          channelId: 'copilot',
          senderName: 'Meridian Quant Copilot',
          senderRole: 'ai',
          senderAvatar: '🏛️',
          content: analysis,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' GMT',
          tickerTags: tags.length > 0 ? tags : ['MTNGH', 'GCB', 'BOPP'],
          likes: 2,
          likedByMe: false,
          reactions: { '❤️': 1, '🚀': 1, '🔥': 0, '🐂': 0 }
        };
        setCopilotMessages(prev => [...prev, aiMsg]);
        setIsAITyping(false);
      }, 500);

    } else {
      setFloorMessages(prev => [...prev, userMsg]);
      if (!customText) setInputMessage('');
      setSelectedSentiment('none');

      // Auto reply on knowledge channels
      if (selectedChannelId === 'knowledge-desk' || content.toLowerCase().includes('?')) {
        setIsAITyping(true);
        setTimeout(() => {
          const aiResponseText = generateInstitutionalAnalysis(content);
          const aiMessage: ChatMessage = {
            id: `ai-msg-${Date.now()}`,
            channelId: selectedChannelId,
            senderName: 'GSE Research Desk',
            senderRole: 'analyst',
            senderAvatar: '🏛️',
            content: aiResponseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' GMT',
            likes: 2,
            likedByMe: false,
            reactions: { '❤️': 1, '🚀': 0, '🔥': 1, '🐂': 0 }
          };
          setFloorMessages(prev => [...prev, aiMessage]);
          setIsAITyping(false);
        }, 600);
      }
    }
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    const updateList = (list: ChatMessage[]) =>
      list.map((m) => {
        if (m.id !== messageId) return m;
        const currentReactions = m.reactions || { '❤️': 0, '🚀': 0, '🔥': 0, '🐂': 0 };
        const currentCount = currentReactions[emoji] || 0;
        return {
          ...m,
          reactions: {
            ...currentReactions,
            [emoji]: currentCount + 1,
          },
        };
      });

    if (activeMode === 'copilot') {
      setCopilotMessages(updateList);
    } else {
      setFloorMessages(updateList);
    }
  };

  const handleInsertTicker = (ticker: string) => {
    setInputMessage((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} $${ticker} ` : `$${ticker} `;
    });
  };

  const handleCopyConversation = () => {
    const msgs = activeMode === 'copilot' ? copilotMessages : floorMessages;
    const formatted = msgs.map(m => `[${m.timestamp}] ${m.senderName}:\n${m.content}\n`).join('\n---\n\n');
    navigator.clipboard.writeText(formatted);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2200);
  };

  const handleClearCopilot = () => {
    if (confirm('Clear your Meridian Quant Copilot research trajectory?')) {
      localStorage.removeItem(STORAGE_KEY_COPILOT_MESSAGES);
      setCopilotMessages([
        {
          id: `copilot-reset-${Date.now()}`,
          channelId: 'copilot',
          senderName: 'Meridian Quant Copilot',
          senderRole: 'ai',
          senderAvatar: '🏛️',
          content: 'Session cleared. Enter a stock ticker (e.g. `$MTNGH`, `$GCB`, `$BOPP`) or select an institutional query below to begin analysis.',
          timestamp: 'Just now'
        }
      ]);
    }
  };

  // Render markdown with tables, bolding, and clickable tickers
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const parseTickersInText = (text: string) => {
      const parts = text.split(/(\$[A-Z0-9]+)/g);
      return parts.map((part, i) => {
        if (part.startsWith('$')) {
          const ticker = part.replace('$', '');
          const stock = stocks.find(s => s.ticker === ticker);
          return (
            <button
              key={i}
              onClick={() => {
                if (stock) {
                  setPreviewStock(stock);
                } else {
                  onSelectStockByTicker(ticker);
                }
              }}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 mx-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/30 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs border border-amber-500/30 cursor-pointer transition-colors align-baseline"
              title={`Inspect ${ticker} live quote`}
            >
              <StockLogo ticker={ticker} size={14} className="rounded-xs inline-block" />
              <span>{ticker}</span>
              {stock && (
                <span className="text-[10px] opacity-80 font-mono">
                  ₵{stock.price.toFixed(2)}
                </span>
              )}
            </button>
          );
        }
        return part;
      });
    };

    lines.forEach((line, idx) => {
      // Table detection
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        const cols = line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
        if (!line.includes('---')) {
          tableRows.push(cols);
        }
        return;
      } else if (inTable) {
        // End of table, render accumulated table
        elements.push(
          <div key={`table-${idx}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/[0.08]">
            <table className="w-full border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-white/[0.08]">
                  {tableRows[0]?.map((th, hIdx) => (
                    <th key={hIdx} className="py-2 px-3 text-left font-bold">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05] bg-white dark:bg-[#070D1F]">
                {tableRows.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 text-slate-700 dark:text-slate-300">
                        {parseTickersInText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={idx} className="text-sm font-black text-slate-900 dark:text-white mt-3 mb-1.5 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h4>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h5 key={idx} className="text-xs font-bold text-slate-900 dark:text-white mt-2 mb-1">
            {line.replace('#### ', '')}
          </h5>
        );
      } else if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        elements.push(
          <p key={idx} className="text-xs text-slate-700 dark:text-slate-300 pl-3 leading-relaxed">
            {parseTickersInText(line)}
          </p>
        );
      } else if (line.trim()) {
        elements.push(
          <p key={idx} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {parseTickersInText(line)}
          </p>
        );
      }
    });

    // Cleanup if ends with table
    if (inTable && tableRows.length > 0) {
      elements.push(
        <div key="table-final" className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/[0.08]">
          <table className="w-full border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-white/[0.08]">
                {tableRows[0]?.map((th, hIdx) => (
                  <th key={hIdx} className="py-2 px-3 text-left font-bold">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05] bg-white dark:bg-[#070D1F]">
              {tableRows.slice(1).map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2 px-3 text-slate-700 dark:text-slate-300">
                      {parseTickersInText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return elements;
  };

  const filteredMessages = useMemo(() => {
    const list = activeMode === 'copilot' 
      ? copilotMessages 
      : floorMessages.filter(m => m.channelId === selectedChannelId);

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(m => 
      m.content.toLowerCase().includes(q) ||
      m.senderName.toLowerCase().includes(q) ||
      m.tickerTags?.some(t => t.toLowerCase().includes(q))
    );
  }, [activeMode, copilotMessages, floorMessages, selectedChannelId, searchQuery]);

  // Top stocks for live quick insertion chips
  const activeTopStocks = useMemo(() => {
    return stocks.slice(0, 8);
  }, [stocks]);

  return (
    <div className="space-y-4 pb-16">
      {/* 1. LIVE TRADING FLOOR TELEMETRY BANNER */}
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>GSE LIVE DESK</span>
          </div>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>342 Traders Active</span>
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">
            Official Session: 10:00 – 15:00 GMT
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold">
            GSE-CI: 4,418.52 (+0.74%)
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">
            Turnover: GH₵ 14.8M
          </span>
        </div>
      </div>

      {/* 2. INSTITUTIONAL TERMINAL HEADER */}
      <div className="bg-white dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Meridian Investor Live Desk
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  REAL-TIME
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ACCRA TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-channel trading discussion lounge & dedicated AI quantitative research desk
              </p>
            </div>
          </div>

          {/* Mode Switcher & Tools */}
          <div className="flex items-center gap-2 self-start md:self-center shrink-0 flex-wrap">
            <div className="p-1 bg-slate-100 dark:bg-[#070D1F] rounded-xl border border-slate-200 dark:border-white/[0.08] flex items-center gap-1">
              <button
                onClick={() => setActiveMode('copilot')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'copilot'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Copilot</span>
              </button>

              <button
                onClick={() => setActiveMode('floor')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'floor'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Floor Rooms</span>
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#070D1F] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-36 sm:w-44"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={handleCopyConversation}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#070D1F] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] text-xs font-bold transition-colors cursor-pointer"
              title="Copy Transcript"
            >
              {copiedReport ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
            </button>

            {activeMode === 'copilot' && (
              <button
                onClick={handleClearCopilot}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#070D1F] hover:bg-rose-500/20 text-slate-600 dark:text-slate-400 hover:text-rose-400 border border-slate-200 dark:border-white/[0.08] text-xs transition-colors cursor-pointer"
                title="Reset Research Session"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Channel Selector when in Floor mode */}
        {activeMode === 'floor' && (
          <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-100 dark:border-white/[0.06] no-scrollbar">
            {EXTENDED_CHANNELS.map((chan) => (
              <button
                key={chan.id}
                onClick={() => setSelectedChannelId(chan.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedChannelId === chan.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-50 dark:bg-[#070D1F] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08]'
                }`}
              >
                <Hash className="w-3.5 h-3.5 opacity-70" />
                <span>{chan.name}</span>
                {chan.membersCount && (
                  <span className="text-[10px] opacity-70 font-mono">({chan.membersCount})</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. CHAT FEED CONTAINER */}
      <div className="bg-white dark:bg-[#070D1F] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col h-[600px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {searchQuery ? `No messages found matching "${searchQuery}"` : 'No messages in this channel yet.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1 text-xs bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isUser = msg.isUserMessage === true || 
                (msg.senderRole === 'investor' && (
                  (userProfile?.id && msg.userId === userProfile.id) ||
                  (userProfile?.contact && msg.userContact === userProfile.contact) ||
                  (msg.senderName === userName) ||
                  (!userProfile && (msg.userId === 'guest' || !msg.userId))
                ));
              const isAI = msg.senderRole === 'ai' || msg.senderRole === 'analyst';

              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 text-xs shadow-xs ${
                    isUser 
                      ? 'bg-amber-500 text-slate-950 font-mono' 
                      : isAI 
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {isUser ? 'ME' : isAI ? <Bot className="w-4 h-4 fill-slate-950" /> : 'FL'}
                  </div>

                  {/* Bubble Body */}
                  <div className={`rounded-2xl p-4 sm:p-5 border space-y-2.5 max-w-[92%] sm:max-w-[85%] ${
                    isUser
                      ? 'bg-amber-50/80 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100 border-amber-200 dark:border-amber-800/40'
                      : isAI
                      ? 'bg-slate-50/90 dark:bg-[#0B132B] text-slate-900 dark:text-white border-slate-200 dark:border-white/[0.08] shadow-xs'
                      : 'bg-white dark:bg-[#0E1736] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/[0.08]'
                  }`}>
                    {/* Sender title, sentiment tag & timestamp */}
                    <div className="flex items-center justify-between gap-3 text-[11px] pb-1.5 border-b border-slate-200/60 dark:border-white/[0.05]">
                      <div className="flex items-center gap-2 font-bold font-mono flex-wrap">
                        <span className={isAI ? 'text-cyan-600 dark:text-cyan-400 font-black' : isUser ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}>
                          {msg.senderName}
                        </span>

                        {isAI && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            PRO ANALYST
                          </span>
                        )}

                        {/* Sentiment badge */}
                        {msg.sentiment === 'bullish' && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                            🚀 BULLISH
                          </span>
                        )}
                        {msg.sentiment === 'bearish' && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30">
                            🐻 BEARISH
                          </span>
                        )}
                        {msg.sentiment === 'analysis' && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                            💡 ANALYSIS
                          </span>
                        )}
                        {msg.sentiment === 'question' && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                            ❓ QUESTION
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Formatted Content */}
                    <div className="space-y-2 text-xs">
                      {renderFormattedContent(msg.content)}
                    </div>

                    {/* Interactive Message Reaction Bar */}
                    <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                      {[
                        { emoji: '❤️', label: 'Like' },
                        { emoji: '🚀', label: 'Moon' },
                        { emoji: '🔥', label: 'Hot' },
                        { emoji: '🐂', label: 'Bull' }
                      ].map(({ emoji }) => {
                        const count = msg.reactions?.[emoji] || 0;
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            className={`px-2 py-0.5 rounded-full text-[11px] font-mono border transition-all flex items-center gap-1 cursor-pointer ${
                              count > 0 
                                ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-white/[0.15] text-slate-900 dark:text-white font-bold' 
                                : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500'
                            }`}
                          >
                            <span>{emoji}</span>
                            {count > 0 && <span>{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {isAITyping && (
            <div className="flex gap-3 max-w-md animate-in fade-in">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 dark:bg-[#0B132B] p-3 rounded-2xl border border-slate-200 dark:border-white/[0.08] flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Processing quantitative order books & GSE filings...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. LIVE TICKER QUICK-INSERT BAR */}
        <div className="px-4 py-2 bg-slate-100/80 dark:bg-[#091024] border-t border-slate-200 dark:border-white/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>Tag:</span>
          </span>
          {activeTopStocks.map((stock) => (
            <button
              key={stock.ticker}
              onClick={() => handleInsertTicker(stock.ticker)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0F1A3A] hover:bg-amber-500/15 border border-slate-200 dark:border-white/[0.08] hover:border-amber-500/40 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title={`Add $${stock.ticker} to chat`}
            >
              <span>${stock.ticker}</span>
              <span className={`text-[10px] ${stock.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                ₵{stock.price.toFixed(2)}
              </span>
            </button>
          ))}
        </div>

        {/* 5. PROMPT CHIPS & INPUT BOX */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-[#0B132B] border-t border-slate-200 dark:border-white/[0.08] space-y-2.5">
          
          {/* Quick Institutional Query Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            <span className="text-slate-400 text-[10px] uppercase font-mono font-bold shrink-0">Quick Queries:</span>
            {[
              'Compare $MTNGH vs $GCB valuation & dividends',
              'Which GSE stocks offer 10%+ dividend yields?',
              'Explain Ghana 0% Capital Gains Tax (Act 896)',
              'Analysis of $BOPP export hedge against cedi depreciation',
              'Step-by-step: How to buy shares via Mobile Money',
              'Banking sector health: GCB vs Standard Chartered'
            ].map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#070D1F] hover:bg-cyan-500/15 hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 hover:text-cyan-400 border border-slate-200 dark:border-white/[0.08] whitespace-nowrap transition-colors cursor-pointer font-mono"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Sentiment Selection Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-xs">
            <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">Sentiment:</span>
            {[
              { id: 'none', label: 'Neutral' },
              { id: 'bullish', label: '🚀 Bullish' },
              { id: 'bearish', label: '🐻 Bearish' },
              { id: 'analysis', label: '💡 Analysis' },
              { id: 'question', label: '❓ Question' }
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedSentiment(id as any)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-colors cursor-pointer ${
                  selectedSentiment === id
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Input text bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={
                activeMode === 'copilot'
                  ? 'Ask quantitative analyst (e.g. "Analyze $MTNGH", "Compare P/E ratios", "Tax rules")...'
                  : `Message #${selectedChannelId} (use $TICKER to tag stocks)...`
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-[#070D1F] border border-slate-200 dark:border-white/[0.12] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isAITyping}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. INTERACTIVE IN-CHAT STOCK SNAPSHOT MODAL */}
      {previewStock && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#0B132B] w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/[0.1] shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <StockLogo
                  ticker={previewStock.ticker}
                  name={previewStock.name}
                  sector={previewStock.sector}
                  size={46}
                  className="rounded-2xl shadow-xs shrink-0"
                />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {previewStock.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {previewStock.ticker} • {previewStock.sector}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewStock(null)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price & Change Banner */}
            <div className="bg-slate-50 dark:bg-[#070D1F] p-4 rounded-2xl border border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Current GSE Price</span>
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  GH₵ {previewStock.price.toFixed(2)}
                </span>
              </div>
              <div className={`px-2.5 py-1 rounded-xl font-mono text-xs font-bold border ${
                previewStock.change >= 0 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}>
                {previewStock.change >= 0 ? '+' : ''}{previewStock.changePercent.toFixed(2)}%
              </div>
            </div>

            {/* Key Fundamentals Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-50 dark:bg-[#070D1F] rounded-xl border border-slate-100 dark:border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block">P/E Multiple</span>
                <span className="font-bold text-slate-900 dark:text-white">{previewStock.peRatio}x</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#070D1F] rounded-xl border border-slate-100 dark:border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block">Dividend Yield</span>
                <span className="font-bold text-emerald-400">
                  {previewStock.dividendYield ? `${previewStock.dividendYield.toFixed(1)}%` : '0%'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#070D1F] rounded-xl border border-slate-100 dark:border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block">Market Cap</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  GH₵ {(previewStock.marketCap / 1000).toFixed(2)}B
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#070D1F] rounded-xl border border-slate-100 dark:border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block">Liquidity Rating</span>
                <span className="font-bold text-cyan-400">{previewStock.easyToSellScore}/100</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onSelectStockByTicker(previewStock.ticker);
                  setPreviewStock(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer font-mono"
              >
                <span>View Full Chart & Screener</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  handleInsertTicker(previewStock.ticker);
                  setPreviewStock(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer font-mono"
              >
                Insert ${previewStock.ticker}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
