import React, { useState, useRef, useEffect } from 'react';
import {
  Brain, Send, X, Bot, Sparkles, TrendingUp, HelpCircle,
  ShieldCheck, RefreshCw, Zap, Award, BookOpen
} from 'lucide-react';
import { Stock, UserProfile } from '../types';

interface MeridianAIProps {
  stocks: Stock[];
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile | null;
  onSelectStock?: (stock: Stock) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedTickers?: string[];
}

export const MeridianAI: React.FC<MeridianAIProps> = ({
  stocks,
  isOpen,
  onClose,
  userProfile,
  onSelectStock,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello ${userProfile?.name ? userProfile.name : 'Investor'}! I am Meridian AI — your institutional market intelligence engine. I analyze GSE and global equities, calculate financial ratios, evaluate dividend sustainability, and assist your portfolio allocation with 100% private on-device edge computation.`,
      timestamp: 'Just now',
    },
    {
      id: 'm-2',
      sender: 'ai',
      text: 'Ask me anything: "What is P/E ratio?", "Top dividend stocks on GSE", "Tell me about MTNGH", "How do I buy shares in Ghana?", or "Explain RSI & MACD".',
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickQuestions = [
    'Top dividend yielders',
    'Explain P/E ratio',
    'Analysis of MTNGH',
    'How to buy GSE shares',
    'What is RSI indicator?',
  ];

  const generateLocalAnswer = (query: string): { text: string; suggestedTickers?: string[] } => {
    const q = query.toLowerCase();

    // Check specific stock query
    const matchedStock = stocks.find(
      (s) =>
        q.includes(s.ticker.toLowerCase()) ||
        q.includes(s.name.toLowerCase().split(' ')[0])
    );
    if (matchedStock) {
      const peRating = matchedStock.peRatio < 6 ? 'Very attractive value (low P/E)' : matchedStock.peRatio < 12 ? 'Fairly valued' : 'Premium multiple';
      const divText = matchedStock.dividendYield ? `${matchedStock.dividendYield}% yield` : 'No active dividend';
      return {
        text: `📊 **${matchedStock.name} (${matchedStock.ticker})**:\n- **Current Price**: GH₵${matchedStock.price.toFixed(2)} (${matchedStock.change >= 0 ? '+' : ''}${matchedStock.changePercent}%)\n- **Sector**: ${matchedStock.sector}\n- **P/E Ratio**: ${matchedStock.peRatio} (${peRating})\n- **Dividend**: ${divText}\n- **Liquidity Score**: ${matchedStock.easyToSellScore}/100\n- **Summary**: ${matchedStock.summary}\n\n*Verdict*: A standout ${matchedStock.sector.toLowerCase()} anchor on the Ghana Stock Exchange.`,
        suggestedTickers: [matchedStock.ticker],
      };
    }

    // Dividends
    if (q.includes('dividend') || q.includes('yield') || q.includes('cash back')) {
      const topDiv = [...stocks]
        .filter((s) => s.dividendYield && s.dividendYield > 0)
        .sort((a, b) => (b.dividendYield || 0) - (a.dividendYield || 0))
        .slice(0, 3);

      const listStr = topDiv
        .map((s) => `• **${s.ticker}** (${s.name}): ${s.dividendYield}% yield, next ex-div ~${s.exDividendDate || 'Annual'}`)
        .join('\n');

      return {
        text: `💰 **Top GSE Dividend Yield Champions**:\n${listStr}\n\n*Pro tip*: In Ghana, dividend income from GSE-listed equities attracts a reduced withholding tax of only 8%, with 0% capital gains tax.`,
        suggestedTickers: topDiv.map((s) => s.ticker),
      };
    }

    // P/E ratio
    if (q.includes('p/e') || q.includes('pe ratio') || q.includes('valuation') || q.includes('price to earnings')) {
      return {
        text: `📈 **Price-to-Earnings (P/E) Ratio Explained**:\n\nThe P/E ratio tells you how many Ghana Cedis you are paying for each GH₵1 of corporate annual profit.\n\n• **P/E < 5**: Common on GSE for banks (e.g. GCB, CAL). Extremely cheap, but verify balance sheet health.\n• **P/E 6 - 12**: Healthy blue-chip territory (e.g. MTNGH, TOTAL).\n• **P/E > 15**: Growth premium or temporary earnings depression.\n\n*Rule of Thumb*: Compare a company's P/E to its sector peers, not across unrelated industries!`,
      };
    }

    // RSI
    if (q.includes('rsi') || q.includes('relative strength') || q.includes('oversold')) {
      return {
        text: `📉 **Relative Strength Index (RSI)**:\n\nRSI measures momentum on a 0 to 100 scale based on 14 recent price sessions:\n\n• **Below 30 (Oversold)**: Selling has been aggressive. Often precedes a technical bounce.\n• **Above 70 (Overbought)**: Euphoric rally. Risk of short-term profit taking.\n• **40 - 60 (Neutral)**: Trend consolidation.\n\n*Check our Meridian Axis signals bar on any stock for live computed RSI!*`,
      };
    }

    // How to buy / Broker
    if (q.includes('buy') || q.includes('broker') || q.includes('start') || q.includes('how to invest') || q.includes('csd')) {
      return {
        text: `🏛️ **How to Buy Shares on the Ghana Stock Exchange**:\n\n1. **Get a CSD Account**: Open a Central Securities Depository (CSD) account via any SEC-licensed broker (e.g., IC Securities, Databank, CalBank Brokerage, Stanbic).\n2. **Fund via MoMo/Bank**: Most modern Ghanaian brokers accept instant deposits via MTN MoMo, Telecel Cash, or direct bank EFT.\n3. **Place Limit Orders**: GSE trading sessions run Monday to Friday from 10:00 AM to 3:00 PM GMT.\n4. **Settlement**: Trades settle on a T+2 basis (two business days).`,
      };
    }

    // T-Bills vs Stocks
    if (q.includes('t-bill') || q.includes('treasury') || q.includes('risk') || q.includes('bond')) {
      return {
        text: `⚖️ **GoG Treasury Bills vs. GSE Equities**:\n\n• **91-Day / 182-Day T-Bills**: Government-backed fixed nominal yield (~24-28% range). Great for short-term principal safety.\n• **GSE Dividend Stocks**: Equity ownership offering dividend cashflow (7-12%) PLUS long-term capital appreciation that compounds and outpaces currency inflation.\n\n*Smart Investor Allocation*: Keep 3-6 months cash reserve in T-bills/FD, and allocate surplus long-term wealth into dividend-growing equities like MTN, GCB, or BOPP.`,
      };
    }

    // Default fallback
    return {
      text: `🤖 **Meridian AI Insight**:\n\nRegarding "${query}": The Ghana Stock Exchange offers a unique landscape with high dividend yields (averaging 6-10%), zero capital gains tax for listed equities, and resilient domestic demand.\n\nCheck our **Meridian Axis Radar** or **Historical Strategy Backtester** to cross-validate your thesis against real financial metrics.`,
    };
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateLocalAnswer(userText);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTickers: response.suggestedTickers,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-800 text-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black text-white tracking-tight">Meridian AI</h2>
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Institutional Edge AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Zero token costs • Instant private research desk</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-1.5 leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                {m.suggestedTickers && m.suggestedTickers.length > 0 && onSelectStock && (
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-700">
                    {m.suggestedTickers.map((t) => {
                      const stockObj = stocks.find((s) => s.ticker === t);
                      return (
                        <button
                          key={t}
                          onClick={() => {
                            if (stockObj) {
                              onSelectStock(stockObj);
                              onClose();
                            }
                          }}
                          className="px-2 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-black hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer"
                        >
                          View {t} Details →
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs py-1">
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="italic">Meridian AI is analyzing local market data...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/50 overflow-x-auto flex gap-2 shrink-0 no-scrollbar">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => {
                setInputValue(q);
              }}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 whitespace-nowrap transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90 flex gap-2 shrink-0">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Meridian AI about GSE stocks, ratios, P/E..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-black flex items-center justify-center transition-all cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export { MeridianAI as WallflakeAI };
