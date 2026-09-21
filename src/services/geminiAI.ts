import { GoogleGenAI } from '@google/genai';
import { Stock } from '../types';

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  if (!GEMINI_API_KEY) return null;
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return ai;
}

export function isGeminiConfigured(): boolean {
  return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.length > 10);
}

function buildStockContext(stocks: Stock[]): string {
  return stocks
    .map(
      (s) =>
        `${s.ticker} (${s.name}) | Sector: ${s.sector} | Price: GH₵${s.price} | Change: ${s.changePercent}% | P/E: ${s.peRatio} | Div Yield: ${s.dividendYield ?? 'N/A'}% | Vol: ${s.volume.toLocaleString()} | 52W: ${s.low52W}–${s.high52W}`
    )
    .join('\n');
}

const SYSTEM_PROMPT = `You are Apex AI, a market intelligence assistant for the Ghana Stock Exchange (GSE). You help investors understand GSE stocks, financial ratios, tax rules, and investment concepts.

Rules:
- Be concise and use markdown formatting (bold, bullet points, tables).
- Always reference actual stock data when available.
- Ghana tax context: 0% capital gains tax on GSE-listed shares (Income Tax Act 896), 8% dividend withholding tax.
- GSE trading hours: 10:00–15:00 GMT, Mon–Fri. Settlement: T+2.
- Currency: Ghana Cedis (GH₵).
- You are NOT a licensed financial adviser. End every response with: "This is not financial advice. Always do your own research."
- If asked about non-GSE topics, give a brief helpful answer but steer back to GSE markets.
- Keep responses under 300 words unless the user asks for detail.`;

export async function askGeminiAI(
  userQuery: string,
  stocks: Stock[]
): Promise<string> {
  const client = getClient();
  if (!client) {
    throw new Error('Gemini API not configured');
  }

  const stockContext = buildStockContext(stocks);

  const fullPrompt = `${SYSTEM_PROMPT}

Current GSE stock data:
${stockContext}

User question: ${userQuery}`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: fullPrompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }
    return text;
  } catch (err) {
    console.error('Gemini AI error:', err);
    throw err;
  }
}
