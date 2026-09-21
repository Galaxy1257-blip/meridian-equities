import React, { useState, useRef, useEffect } from 'react';
import {
  Brain, Send, X, Bot, Sparkles, TrendingUp, HelpCircle,
  ShieldCheck, RefreshCw, Zap, Award, BookOpen, AlertTriangle
} from 'lucide-react';
import { Stock, UserProfile } from '../types';
import { askGeminiAI, isGeminiConfigured } from '../services/geminiAI';

interface ApexAIProps {
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
  source?: 'gemini' | 'local';
}

export const ApexAI: React.FC<ApexAIProps> = ({
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
      text: `Hello ${userProfile?.name ? userProfile.name : 'Investor'}! I am Apex AI — your GSE market research assistant. Ask me about Ghana Stock Exchange stocks, dividends, valuations, or how to invest.`,
      timestamp: 'Just now',
      source: isGeminiConfigured() ? 'gemini' : 'local',
    },
    {
      id: 'm-2',
      sender: 'ai',
      text: isGeminiConfigured()
        ? 'Powered by Gemini AI with live GSE market context. Ask anything about Ghanaian equities.'
        : 'Running in offline mode with local GSE data. Ask about stock prices, dividends, P/E ratios, or how to buy shares.',
      timestamp: 'Just now',
      source: isGeminiConfigured() ? 'gemini' : 'local',
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

  // Local keyword-based fallback (used when Gemini is not configured or fails)
  const generateLocalAnswer = (query: string): { text: string; suggestedTickers?: string[] } => {
    const q = query.toLowerCase();

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

    if (q.includes('p/e') || q.includes('pe ratio') || q.includes('valuation') || q.includes('price to earnings')) {
      return {
        text: `📈 **Price-to-Earnings (P/E) Ratio Explained**:\n\nThe P/E ratio tells you how many Ghana Cedis you are paying for each GH₵1 of corporate annual profit.\n\n• **P/E < 5**: Common on GSE for banks (e.g. GCB, CAL). Extremely cheap, but verify balance sheet health.\n• **P/E 6 - 12**: Healthy blue-chip territory (e.g. MTNGH, TOTAL).\n• **P/E > 15**: Growth premium or temporary earnings depression.\n\n*Rule of Thumb*: Compare a company's P/E to its sector peers, not across unrelated industries!`,
      };
    }

    if (q.includes('rsi') || q.includes('relative strength') || q.includes('oversold')) {
      return {
        text: `📉 **Relative Strength Index (RSI)**:\n\nRSI measures momentum on a 0 to 100 scale based on 14 recent price sessions:\n\n• **Below 30 (Oversold)**: Selling has been aggressive. Often precedes a technical bounce.\n• **Above 70 (Overbought)**: Euphoric rally. Risk of short-term profit taking.\n• **40 - 60 (Neutral)**: Trend consolidation.`,
      };
    }

    if (q.includes('buy') || q.includes('broker') || q.includes('start') || q.includes('how to invest') || q.includes('csd')) {
      return {
        text: `🏛️ **How to Buy Shares on the Ghana Stock Exchange**:\n\n1. **Get a CSD Account**: Open a Central Securities Depository (CSD) account via any SEC-licensed broker (e.g., IC Securities, Databank, CalBank Brokerage, Stanbic).\n2. **Fund via MoMo/Bank**: Most modern Ghanaian brokers accept instant deposits via MTN MoMo, Telecel Cash, or direct bank EFT.\n3. **Place Limit Orders**: GSE trading sessions run Monday to Friday from 10:00 AM to 3:00 PM GMT.\n4. **Settlement**: Trades settle on a T+2 basis (two business days).`,
      };
    }

    if (q.includes('t-bill') || q.includes('treasury') || q.includes('risk') || q.includes('bond')) {
      return {
        text: `⚖️ **GoG Treasury Bills vs. GSE Equities**:\n\n• **91-Day / 182-Day T-Bills**: Government-backed fixed nominal yield (~24-28% range). Great for short-term principal safety.\n• **GSE Dividend Stocks**: Equity ownership offering dividend cashflow (7-12%) PLUS long-term capital appreciation that compounds and outpaces currency inflation.\n\n*Smart Investor Allocation*: Keep 3-6 months cash reserve in T-bills/FD, and allocate surplus long-term wealth into dividend-growing equities like MTN, GCB, or BOPP.`,
      };
    }

    return {
      text: `🤖 **Apex AI Insight**:\n\nRegarding "${query}": The Ghana Stock Exchange offers a unique landscape with high dividend yields (averaging 6-10%), zero capital gains tax for listed equities, and resilient domestic demand.\n\nCheck individual stock cards for live metrics and signals.`,
    };
  };

  const handleSend = async () => {
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

    try {
      let responseText: string;
      let source: 'gemini' | 'local' = 'local';

      if (isGeminiConfigured()) {
        try {
          responseText = await askGeminiAI(userText, stocks);
          source = 'gemini';
        } catch {
          const local = generateLocalAnswer(userText);
          responseText = local.text;
          source = 'local';
        }
      } else {
        const local = generateLocalAnswer(userText);
        responseText = local.text;
        source = 'local';
      }

      const tickerMatches = userText.match(/\$?([A-Z]{3,6})/g);
      const suggestedTickers = tickerMatches
        ?.map((t) => t.replace('$', '').toUpperCase())
        .filter((t) => stocks.some((s) => s.ticker === t));

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTickers: suggestedTickers?.length ? suggestedTickers : undefined,
        source,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'local',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
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
                <h2 className="text-base font-black text-white tracking-tight">Apex AI</h2>
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {isGeminiConfigured() ? 'Gemini Powered' : 'Offline Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isGeminiConfigured() ? 'AI-assisted GSE market research' : 'Local GSE data lookup'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-start gap-2 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-amber-300/80 leading-tight">
            This is a research tool, not financial advice. Always consult a qualified adviser before investing. Apex Equities is not a broker or investment adviser.
          </p>
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
                {m.source && m.sender === 'ai' && (
                  <div className="text-[9px] text-slate-500 mt-1 pt-1 border-t border-slate-700/40">
                    {m.source === 'gemini' ? 'Generated by Gemini AI' : 'Local GSE data'}
                  </div>
                )}
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
              <span className="italic">
                {isGeminiConfigured() ? 'Apex AI is thinking...' : 'Looking up GSE data...'}
              </span>
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
            placeholder="Ask about GSE stocks, ratios, dividends..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-black flex items-center justify-center transition-all cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};


