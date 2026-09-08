import { ChatChannel, ChatMessage } from '../types';

export const CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 'general',
    name: 'GSE Floor Lounge',
    topic: 'General discussions on market sentiment, daily turnover, and cedi movements',
    iconName: 'MessageSquare',
    unreadCount: 2,
    membersCount: 1420
  },
  {
    id: 'ipo',
    name: 'IPO & Listings Radar',
    topic: 'Atlantic Lithium, GAX SME listings, subscription lot sizes and broker allocations',
    iconName: 'Sparkles',
    unreadCount: 1,
    membersCount: 890
  },
  {
    id: 'dividends',
    name: 'Dividend Hunters Club',
    topic: 'Ex-dividend dates, qualification cutoffs, and dividend reinvestment strategies',
    iconName: 'Coins',
    membersCount: 1140
  },
  {
    id: 'banking',
    name: 'Banking & Tech (GCB / MTNGH)',
    topic: 'Deep dives on banking balance sheets, FinTech data revenues, and Q2 earnings',
    iconName: 'Briefcase',
    membersCount: 760
  },
  {
    id: 'knowledge-desk',
    name: 'GSE Research & Knowledge Desk',
    topic: 'Instant rule-based answers on GSE tax laws, dividend yield math, MoMo brokers & valuations (0 Tokens / 100% Offline)',
    iconName: 'Bot',
    membersCount: 1
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    channelId: 'general',
    senderName: 'Kofi Mensah',
    senderRole: 'investor',
    senderAvatar: '👨🏾‍💼',
    content: 'The volume on $MTNGH today is massive. Seeing big institutional cross trades crossing the Databank desk!',
    timestamp: '10:14 GMT',
    tickerTags: ['MTNGH'],
    likes: 5,
    likedByMe: true
  },
  {
    id: 'msg-2',
    channelId: 'general',
    senderName: 'Akua Serwaa (CFA)',
    senderRole: 'analyst',
    senderAvatar: '👩🏾‍💻',
    content: 'Agreed Kofi. Offshore funds are taking advantage of the low P/E multiples across $GCB and $TOTAL as well. The Composite Index (GSE-CI) is up over 26% in dollar terms YTD.',
    timestamp: '10:28 GMT',
    tickerTags: ['GCB', 'TOTAL'],
    likes: 8
  },
  {
    id: 'msg-3',
    channelId: 'general',
    senderName: 'Kwame Osei',
    senderRole: 'investor',
    senderAvatar: '👨🏾‍🎓',
    content: 'Just started building my portfolio with IC Securities app. Zero capital gains tax on the Ghana Stock Exchange is such an underrated benefit for young people!',
    timestamp: '11:02 GMT',
    likes: 12,
    likedByMe: false
  },
  {
    id: 'msg-4',
    channelId: 'ipo',
    senderName: 'GSE Market Desk',
    senderRole: 'moderator',
    senderAvatar: '🏛️',
    content: 'Reminder: The Atlantic Lithium ($ALLGH) IPO prospectus is officially approved by SEC Ghana. Minimum lot size is 100 shares at GH₵ 4.50. You can subscribe via MTN MoMo or your CSD broker account.',
    timestamp: '08:45 GMT',
    tickerTags: ['ALLGH'],
    likes: 19,
    likedByMe: true
  },
  {
    id: 'msg-5',
    channelId: 'ipo',
    senderName: 'Esi Nyarko',
    senderRole: 'investor',
    senderAvatar: '👩🏾‍🦱',
    content: 'Can anyone confirm if diaspora investors in the UK can use their CSD account number to apply directly online?',
    timestamp: '09:15 GMT',
    likes: 3
  },
  {
    id: 'msg-6',
    channelId: 'dividends',
    senderName: 'Ama Boadi',
    senderRole: 'investor',
    senderAvatar: '👩🏾‍💼',
    content: 'Don’t forget the ex-dividend date for $MTNGH is September 10th! If you buy on or after that day you miss the 8.5 pesewas payout.',
    timestamp: '09:50 GMT',
    tickerTags: ['MTNGH'],
    likes: 14,
    likedByMe: true
  },
  {
    id: 'msg-7',
    channelId: 'dividends',
    senderName: 'Yaw Boateng',
    senderRole: 'investor',
    senderAvatar: '👨🏾‍🔧',
    content: '$BOPP declared GH₵ 1.80 special dividend too. Trailing dividend yield is over 11.4% right now, one of the best on the entire continent.',
    timestamp: '10:30 GMT',
    tickerTags: ['BOPP'],
    likes: 9
  },
  {
    id: 'msg-8',
    channelId: 'banking',
    senderName: 'Dr. Seth Addo',
    senderRole: 'analyst',
    senderAvatar: '👨🏾‍🏫',
    content: '$GCB reported GH₵ 1.15 Billion in H1 PBT with a Capital Adequacy Ratio of 21.8%. That is exceptionally strong buffer against credit risk.',
    timestamp: 'Yesterday',
    tickerTags: ['GCB'],
    likes: 11
  },
  {
    id: 'msg-9',
    channelId: 'knowledge-desk',
    senderName: 'GSE Research Desk',
    senderRole: 'ai',
    senderAvatar: '🏛️',
    content: 'Welcome to the GSE Equity Research & Knowledge Desk! Ask anything about Ghana Stock Exchange shares, dividends, 0% capital gains tax, MoMo stockbrokers, or company valuations. (100% Offline & Free • 0 Tokens Burned)',
    timestamp: 'Just now',
    likes: 0
  }
];

export interface AIQuickPrompt {
  id: string;
  label: string;
  prompt: string;
  category: 'Tax' | 'Dividends' | 'Trading' | 'Brokers' | 'Valuation';
}

export const AI_QUICK_PROMPTS: AIQuickPrompt[] = [
  {
    id: 'p-tax',
    label: '💰 GSE Tax Rules',
    prompt: 'Is capital gains tax charged on GSE shares in Ghana, and what is the dividend withholding tax rate?',
    category: 'Tax'
  },
  {
    id: 'p-div',
    label: '📈 Top Dividend Yields',
    prompt: 'Which GSE stocks have the highest dividend yields right now and when are the next payout dates?',
    category: 'Dividends'
  },
  {
    id: 'p-momo',
    label: '📱 Buy Shares via MoMo',
    prompt: 'How do I open a CSD account and buy shares using MTN Mobile Money or Telecel Cash?',
    category: 'Brokers'
  },
  {
    id: 'p-indices',
    label: '📊 GSE-CI vs GSE-FI',
    prompt: 'What is the difference between the GSE Composite Index (GSE-CI) and the GSE Financial Index (GSE-FI)?',
    category: 'Trading'
  },
  {
    id: 'p-ipo',
    label: '🚀 Atlantic Lithium IPO',
    prompt: 'Give me a breakdown of the Atlantic Lithium (ALLGH) IPO: price, lot size, and how to apply.',
    category: 'Valuation'
  }
];

export function generateAIAdvisorResponse(userQuery: string): string {
  const q = userQuery.toLowerCase();

  if (q.includes('tax') || q.includes('capital gain') || q.includes('withholding')) {
    return `### 🇬🇭 Ghana Stock Exchange Tax Rules Breakdown:

1. **Capital Gains Tax (0% Exemption)**:
   - Under Section 59 of the Income Tax Act of Ghana, capital gains earned from trading listed shares on the **Ghana Stock Exchange (GSE)** are **100% EXEMPT (0% Tax)** for both individuals and companies.
   - You keep 100% of your capital appreciation profit when you sell shares at a higher price!

2. **Dividend Withholding Tax (8% Final Tax)**:
   - Dividends paid by GSE-listed companies are subject to a modest **8% withholding tax** at source.
   - This is a *final tax*, meaning you don't need to declare it again on personal income tax filings.

3. **No Stamp Duty / E-Levy on CSD Stock Purchases**:
   - Stock purchase transactions through registered SEC brokers are exempt from transaction levies.`;
  }

  if (q.includes('dividend') || q.includes('yield') || q.includes('bopp') || q.includes('mtn')) {
    return `### 📊 Top GSE Dividend Performers (2026):

- **Benso Oil Palm Plantation (BOPP)**: Trailing Yield **11.4%**. Recently announced a massive **GH₵ 1.80** special dividend (Ex-dividend Oct 1, 2026).
- **Scancom PLC (MTNGH)**: Annualized Yield **~9.1%**. Declared interim dividend of **GH₵ 0.085** per share (Ex-dividend Sep 10, Qualifying Sep 12, Paid Sep 28).
- **TotalEnergies Marketing Ghana (TOTAL)**: Yield **~8.4%**. Reliable semi-annual cash distribution with strong free cash flow.
- **Societe Generale Ghana (SOGEGH) & GCB**: Yield **7.5% - 8.0%**.

💡 **Pro-Tip**: Always purchase shares **before the Ex-Dividend date** to qualify for cash distribution payouts!`;
  }

  if (q.includes('momo') || q.includes('mobile money') || q.includes('broker') || q.includes('buy shares') || q.includes('open account') || q.includes('csd')) {
    return `### 📱 How to Buy GSE Shares via Mobile Money in Ghana:

1. **Get a Central Securities Depository (CSD) Account**:
   - You only need your Ghana Card and phone number.
   - You can open one online in under 3 minutes via accredited GSE brokers like **IC Securities**, **Databank (Ark)**, **Stanbic SBG Securities**, or **CalBank Brokers**.

2. **Deposit & Buy via MTN MoMo / Telecel Cash**:
   - For example with MTN MoMo: Dial **\`*170#\`** > Financial Services > Pensions & Investments > Select your Broker > Enter your CSD Account Number and amount.
   - Or trade directly inside modern broker mobile apps.

3. **Trade Settlement**:
   - GSE trades settle on a fast **T+1** cycle. Cash dividends are credited straight to your MoMo wallet or registered bank account!`;
  }

  if (q.includes('index') || q.includes('gse-ci') || q.includes('gse-fi') || q.includes('difference')) {
    return `### 📈 GSE-CI vs. GSE-FI Explained:

- **GSE Composite Index (GSE-CI)**:
  - Measures the overall performance of **ALL ordinary shares** listed on the Ghana Stock Exchange (telecoms, financials, mining, agro-processing, energy, manufacturing).
  - It is the primary benchmark for the Ghanaian macro equity market.

- **GSE Financial Stocks Index (GSE-FI)**:
  - Tracks specifically the **financial sector** listed equities (Commercial Banks, Insurance companies, and investment houses like GCB, SCB, EGL, SOGEGH, CAL).
  - High sensitivity to Bank of Ghana monetary policy rates and inflation trends.`;
  }

  if (q.includes('ipo') || q.includes('atlantic') || q.includes('allgh') || q.includes('lithium')) {
    return `### 🚀 Upcoming IPO: Atlantic Lithium Ghana (ALLGH)

- **Listing Board**: Main GSE Board (Accra)
- **Offer Price**: **GH₵ 4.50** per share
- **Minimum Subscription**: 100 shares (**GH₵ 450.00**)
- **Target Capital Raise**: GH₵ 350 Million for local spodumene concentrate & lithium processing in Central Region.
- **Subscription Window**: Sept 1, 2026 – Sept 25, 2026
- **Lead Brokers**: IC Securities & Databank Brokerage
- **Payment Methods**: Direct Bank Deposit, CSD Broker Portals, and MTN Mobile Money / Telecel Cash.`;
  }

  if (q.includes('pe') || q.includes('p/e') || q.includes('valuation') || q.includes('cheap')) {
    return `### 💡 How to Use P/E Ratio on the Ghana Stock Exchange:

- **What it means**: The Price-to-Earnings (P/E) ratio compares a company's current share price to its annual profit per share (EPS).
- **GSE Benchmark**: Many high-quality GSE blue chips trade at single-digit P/E ratios (between **3.5x and 6.8x**), which represents an attractive discount compared to regional peer bourses in Nigeria or Kenya.
- **Rule of Thumb**: A low P/E coupled with strong ROE (Return on Equity) and healthy cash dividend payouts suggests an undervalued bargain!`;
  }

  // Default smart financial answer
  return `Thank you for your question on the Ghana Stock Exchange! 

Here are key facts for Ghanaian equity investors (100% free & offline):
- **Trading Hours**: Official GSE trading session runs daily from **10:00 GMT to 15:00 GMT** (Monday through Friday).
- **Tax Benefit**: **0% Capital Gains Tax** on all listed shares on GSE.
- **Dividend Withholding**: Only 8% final tax deducted at payout.
- **Currency**: All trades execute in Ghana Cedis (GH₵).

Feel free to ask about specific company tickers (like \`$MTNGH\`, \`$GCB\`, \`$BOPP\`, \`$TOTAL\`), valuation formulas (P/E ratio, Dividend Yield), or broker steps!`;
}
