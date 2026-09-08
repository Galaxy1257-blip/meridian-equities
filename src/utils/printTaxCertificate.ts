import { PortfolioHolding, Stock, UserProfile } from '../types';

export interface TaxCertificateData {
  userProfile?: UserProfile | null;
  holdings: Array<PortfolioHolding & {
    stock?: Stock;
    currentPrice?: number;
    costBasis: number;
    currentValue: number;
    totalGain: number;
    totalGainPct?: number;
    annualDividend?: number;
    sector?: string;
  }>;
  totalCostGhs: number;
  totalCurrentValueGhs: number;
  totalGainGhs: number;
  totalAnnualDividendGhs: number;
  taxYear?: number | string;
}

/**
 * Generates and prints a clean, independent Meridian Equities Capital Gains & Dividend Tax Estimation Report.
 * Completely self-contained and free of any official government/regulatory claims or affiliations.
 */
export const printGhanaTaxCertificate = (data: TaxCertificateData) => {
  const {
    userProfile,
    holdings,
    totalCostGhs,
    totalCurrentValueGhs,
    totalGainGhs,
    totalAnnualDividendGhs,
    taxYear = new Date().getFullYear()
  } = data;

  const dividendWhtRate = 0.08; // 8% estimated dividend tax rate in Ghana market
  const totalWhtGhs = totalAnnualDividendGhs * dividendWhtRate;
  const netDividendGhs = totalAnnualDividendGhs * (1 - dividendWhtRate);
  const reportRef = `ME-TAX-EST-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const now = new Date();
  const issueDate = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const issueTime = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) + ' GMT';

  const investorName = userProfile?.name || 'Private Portfolio User';
  const investorContact = userProfile?.contact || userProfile?.handle || 'User Account';

  // Build holding rows HTML
  const holdingsRowsHtml = holdings.length > 0
    ? holdings.map((h) => {
        const stockName = h.stock?.name || h.ticker;
        const shares = h.shares || 0;
        const buyPrice = (h.costBasis / (shares || 1)) || 0;
        const currentPrice = h.currentPrice || (h.currentValue / (shares || 1)) || 0;
        const gain = h.totalGain;
        const gainSign = gain >= 0 ? '+' : '';
        const gainClass = gain >= 0 ? 'color: #047857;' : 'color: #b91c1c;';

        return `
          <tr>
            <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; font-family: monospace;">
              ${h.ticker}
              <div style="font-weight: normal; font-size: 10px; color: #64748b; font-family: sans-serif;">${stockName}</div>
            </td>
            <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #475569;">
              ${h.sector || 'Equities'}
            </td>
            <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-size: 11px;">
              ${shares.toLocaleString('en-US')}
            </td>
            <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-size: 11px;">
              GH₵ ${buyPrice.toFixed(2)}
            </td>
            <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-size: 11px;">
              GH₵ ${currentPrice.toFixed(2)}
            </td>
            <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-size: 11px; font-weight: bold;">
              GH₵ ${h.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-size: 11px; font-weight: bold; ${gainClass}">
              ${gainSign}GH₵ ${gain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 10px; font-weight: bold; color: #047857; background-color: #f0fdf4;">
              0.0% (Exempt Rate)
            </td>
            <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-size: 11px; font-weight: bold; color: #047857;">
              GH₵ 0.00
            </td>
          </tr>
        `;
      }).join('')
    : `
      <tr>
        <td colspan="9" style="padding: 20px; text-align: center; color: #64748b; font-style: italic;">
          No portfolio equity holdings recorded for this period.
        </td>
      </tr>
    `;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Capital_Gains_Dividend_Tax_Estimate_${reportRef}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 14mm 14mm 14mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #ffffff;
            color: #0f172a;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.45;
          }
          .certificate-container {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            border: 2px solid #0f172a;
            padding: 24px 28px;
            background: #ffffff;
            position: relative;
          }
          .header-grid {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 14px;
            margin-bottom: 16px;
          }
          .brand-header {
            text-align: center;
            flex-grow: 1;
          }
          .brand-header h1 {
            margin: 0;
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 1px;
            color: #0f172a;
            text-transform: uppercase;
          }
          .brand-header h2 {
            margin: 3px 0 0 0;
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .cert-title-badge {
            background: #0f172a;
            color: #ffffff;
            padding: 8px 16px;
            text-align: center;
            border-radius: 6px;
            margin-bottom: 16px;
          }
          .cert-title-badge h2 {
            margin: 0;
            font-size: 13px;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .cert-title-badge p {
            margin: 2px 0 0 0;
            font-size: 10px;
            color: #94a3b8;
          }
          .meta-box {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 12px;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 12px 14px;
            margin-bottom: 16px;
            font-size: 11px;
          }
          .meta-col p {
            margin: 4px 0;
          }
          .meta-col strong {
            color: #334155;
            display: inline-block;
            width: 120px;
          }
          .stat-summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 18px;
          }
          .stat-card {
            border-radius: 6px;
            padding: 12px 14px;
            border: 1px solid;
          }
          .cgt-card {
            background: #ecfdf5;
            border-color: #a7f3d0;
          }
          .wht-card {
            background: #eff6ff;
            border-color: #bfdbfe;
          }
          .stat-card-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            display: flex;
            justify-content: space-between;
          }
          .cgt-title { color: #065f46; }
          .wht-title { color: #1e40af; }
          .stat-amount {
            font-size: 18px;
            font-weight: 900;
            font-family: monospace;
            margin: 4px 0;
          }
          .cgt-amount { color: #047857; }
          .wht-amount { color: #1d4ed8; }
          .stat-desc {
            font-size: 10px;
            color: #475569;
            margin: 0;
            line-height: 1.35;
          }
          .section-heading {
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #0f172a;
            border-bottom: 1.5px solid #0f172a;
            padding-bottom: 4px;
            margin: 16px 0 8px 0;
          }
          table.data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10.5px;
            margin-bottom: 14px;
          }
          table.data-table th {
            background: #f1f5f9;
            color: #1e293b;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 9.5px;
            letter-spacing: 0.5px;
            padding: 7px 8px;
            border-top: 1px solid #cbd5e1;
            border-bottom: 2px solid #94a3b8;
          }
          table.data-table tfoot td {
            font-weight: 900;
            background: #f8fafc;
            border-top: 2px solid #0f172a;
            padding: 8px 10px;
            font-family: monospace;
            font-size: 11px;
          }
          .disclaimer-box {
            background: #fdfefe;
            border: 1px solid #e2e8f0;
            border-left: 3px solid #0284c7;
            padding: 10px 14px;
            margin-bottom: 16px;
            border-radius: 0 6px 6px 0;
            font-size: 9.5px;
            color: #334155;
            text-align: justify;
            line-height: 1.45;
          }
          .footer-note {
            margin-top: 14px;
            font-size: 8.5px;
            color: #64748b;
            text-align: center;
            border-top: 1px solid #f1f5f9;
            padding-top: 6px;
          }
          @media print {
            body {
              padding: 0;
            }
            .certificate-container {
              border: 2px solid #0f172a !important;
              padding: 18px 22px !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <!-- Application Header -->
          <div class="header-grid">
            <div style="font-family: monospace; font-size: 26px; font-weight: 900; color: #0f172a; width: 44px; height: 44px; border: 2px solid #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #f8fafc;">
              ₵
            </div>
            
            <div class="brand-header">
              <h1>Meridian Equities</h1>
              <h2>Personal Portfolio Analytics & Tax Estimation Summary</h2>
            </div>

            <div style="text-align: right; font-family: monospace; font-size: 9px; color: #475569;">
              <strong style="color: #0f172a;">APP REPORT</strong><br/>
              ESTIMATION ONLY<br/>
              PRIVATE USER COPY
            </div>
          </div>

          <!-- Document Title Banner -->
          <div class="cert-title-badge">
            <h2>Capital Gains & Dividend Tax Estimation Summary</h2>
            <p>Calculated based on standard market tax treatment rules • Assessment Year ${taxYear}</p>
          </div>

          <!-- User & Report Metadata -->
          <div class="meta-box">
            <div class="meta-col">
              <p><strong>Portfolio Holder:</strong> <span style="font-weight: 900; font-size: 12px; color: #0f172a;">${investorName}</span></p>
              <p><strong>User Account:</strong> <span style="font-family: monospace; font-weight: bold;">${investorContact}</span></p>
            </div>
            <div class="meta-col">
              <p><strong>Statement ID:</strong> <span style="font-family: monospace; font-weight: bold; color: #0369a1;">${reportRef}</span></p>
              <p><strong>Generated On:</strong> <span>${issueDate} • ${issueTime}</span></p>
            </div>
          </div>

          <!-- Tax Summary Cards -->
          <div class="stat-summary-grid">
            <!-- Capital Gains Card -->
            <div class="stat-card cgt-card">
              <div class="stat-card-title cgt-title">
                <span>Estimated Capital Gains Tax (CGT)</span>
                <span style="background: #059669; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-size: 9px;">0.0% EXEMPT RATE</span>
              </div>
              <div class="stat-amount cgt-amount">
                GH₵ 0.00 DUE
              </div>
              <p class="stat-desc">
                In standard Ghanaian equity market treatment, capital gains on publicly listed shares are treated as exempt from capital gains tax.
              </p>
            </div>

            <!-- Dividend Withholding Card -->
            <div class="stat-card wht-card">
              <div class="stat-card-title wht-title">
                <span>Estimated Dividend Withholding Tax</span>
                <span style="background: #2563eb; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-size: 9px;">8.0% ESTIMATED RATE</span>
              </div>
              <div class="stat-amount wht-amount">
                GH₵ ${totalWhtGhs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p class="stat-desc">
                Estimated 8.0% standard final dividend withholding tax typically deducted at source by registrars prior to payout.
              </p>
            </div>
          </div>

          <!-- Section A: Equity Holdings & Capital Gains Computation -->
          <div class="section-heading">
            Section A: Tracked Equity Portfolio & Estimated Capital Gains
          </div>
          
          <table class="data-table">
            <thead>
              <tr>
                <th style="text-align: left;">Security / Asset</th>
                <th style="text-align: center;">Sector</th>
                <th style="text-align: right;">Quantity</th>
                <th style="text-align: right;">Cost Basis</th>
                <th style="text-align: right;">Mkt Price</th>
                <th style="text-align: right;">Valuation</th>
                <th style="text-align: right;">Unrealized Gain</th>
                <th style="text-align: center;">Est. Rate</th>
                <th style="text-align: right;">Est. Tax</th>
              </tr>
            </thead>
            <tbody>
              ${holdingsRowsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: left; font-family: sans-serif;">TOTAL PORTFOLIO SUMMARY:</td>
                <td style="text-align: right;">GH₵ ${totalCostGhs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td></td>
                <td style="text-align: right;">GH₵ ${totalCurrentValueGhs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td style="text-align: right; color: ${totalGainGhs >= 0 ? '#047857' : '#b91c1c'};">
                  ${totalGainGhs >= 0 ? '+' : ''}GH₵ ${totalGainGhs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style="text-align: center; color: #047857;">0.0%</td>
                <td style="text-align: right; color: #047857;">GH₵ 0.00</td>
              </tr>
            </tfoot>
          </table>

          <!-- Section B: Annual Dividend & Withholding Computation Breakdown -->
          <div class="section-heading" style="margin-top: 12px;">
            Section B: Estimated Dividend Withholding Breakdown
          </div>

          <table class="data-table" style="margin-bottom: 14px;">
            <tbody>
              <tr>
                <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; width: 60%; font-weight: 600;">
                  Gross Estimated Annual Dividends
                </td>
                <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-weight: bold;">
                  GH₵ ${totalAnnualDividendGhs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #b91c1c;">
                  Less: Estimated Dividend Withholding Tax (8.0% Standard Rate)
                </td>
                <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-weight: bold; color: #b91c1c;">
                  - GH₵ ${totalWhtGhs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 7px 10px; border-bottom: 1px solid #cbd5e1; font-weight: 900; color: #047857;">
                  Estimated Net Dividend Payout (Post-Tax)
                </td>
                <td style="padding: 7px 10px; border-bottom: 1px solid #cbd5e1; text-align: right; font-family: monospace; font-weight: 900; font-size: 12px; color: #047857;">
                  GH₵ ${netDividendGhs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Independent App Disclaimer -->
          <div class="disclaimer-box">
            <strong>IMPORTANT DISCLAIMER & NOTICE:</strong><br/>
            This document is automatically generated by Meridian Equities for personal tracking, informational, and computational estimation purposes only. Meridian Equities is an independent financial technology software application and is not an official government agency, broker-dealer, stock exchange, or tax authority. This statement does not constitute official tax advice, an official tax clearance certificate, or legal confirmation. For official tax filings, please consult a certified tax professional or the appropriate revenue authorities.
          </div>

          <!-- Footer Note -->
          <div class="footer-note">
            Generated via Meridian Equities • Personal Investment Analytics Engine • Reference: ${reportRef}
          </div>
        </div>
      </body>
    </html>
  `;

  // Hidden iframe print engine
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    window.print();
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  // Trigger print after iframe renders
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error('Iframe print error:', err);
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2500);
    }
  }, 250);
};
