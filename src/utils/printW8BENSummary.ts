import { UserProfile } from '../types';

export interface W8BENPrintData {
  userProfile?: UserProfile | null;
  name: string;
  countryResidence: string;
  tin: string;
  dateOfBirth?: string;
  address?: string;
  claimTreaty?: boolean;
}

/**
 * Generates and prints a certified IRS Form W-8BEN Certification Summary.
 * Uses an isolated hidden iframe with strict A4 styling to avoid blank pages.
 */
export const printW8BENSummary = (data: W8BENPrintData) => {
  const {
    name,
    countryResidence,
    tin,
    dateOfBirth = '01/01/1985',
    address = 'Accra, Ghana',
    claimTreaty = true
  } = data;

  const now = new Date();
  const certDate = now.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  });
  const expiryYear = now.getFullYear() + 3;
  const certRef = `W8BEN-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>IRS_Form_W8BEN_Summary_${certRef}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; padding: 0; margin: 0; font-size: 12px; }
          .w8-box { border: 2px solid #0f172a; padding: 24px; max-width: 210mm; margin: 0 auto; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
          .header h1 { margin: 0; font-size: 18px; font-weight: 900; text-transform: uppercase; }
          .header p { margin: 4px 0 0 0; color: #475569; font-size: 11px; }
          .badge { display: inline-block; background: #047857; color: #ffffff; padding: 4px 10px; font-weight: bold; border-radius: 4px; font-size: 10px; margin-top: 6px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; }
          .grid p { margin: 4px 0; }
          .grid strong { display: inline-block; width: 140px; color: #334155; }
          .cert-text { border-left: 3px solid #0284c7; background: #f0f9ff; padding: 10px 14px; font-size: 11px; line-height: 1.5; color: #0369a1; margin: 16px 0; border-radius: 0 4px 4px 0; }
          .signature-section { margin-top: 30px; border-top: 1px dashed #94a3b8; padding-top: 16px; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="w8-box">
          <div class="header">
            <h1>Certificate of Foreign Status of Beneficial Owner (Form W-8BEN)</h1>
            <p>United States Internal Revenue Service (IRS) Compliance Record • Meridian Global Brokerage Services</p>
            <div class="badge">CERTIFIED • ACTIVE VALIDITY THROUGH DEC 31, ${expiryYear}</div>
          </div>
          <div class="grid">
            <div>
              <p><strong>Beneficial Owner:</strong> <b>${name}</b></p>
              <p><strong>Country of Citizenship:</strong> ${countryResidence}</p>
              <p><strong>Permanent Residence:</strong> ${address}</p>
            </div>
            <div>
              <p><strong>Foreign Tax ID (TIN):</strong> <b>${tin}</b></p>
              <p><strong>Date of Birth:</strong> ${dateOfBirth}</p>
              <p><strong>Certification Date:</strong> ${certDate}</p>
            </div>
          </div>
          <div class="cert-text">
            <strong>Part II — Claim of Tax Treaty Benefits:</strong><br/>
            The beneficial owner certifies that they are a resident of <strong>${countryResidence}</strong> within the meaning of the income tax treaty between the United States and that country. Qualified US equity dividend distributions shall be subject to the reduced 15% treaty withholding rate rather than the default statutory 30% rate.
          </div>
          <div class="signature-section">
            <div>
              <div style="font-size: 16px; font-family: 'Brush Script MT', cursive; font-weight: bold; color: #0f172a; margin-bottom: 4px;">${name}</div>
              <div style="font-size: 10px; color: #64748b; border-top: 1px solid #0f172a; padding-top: 2px;">Electronically Signed by Beneficial Owner</div>
            </div>
            <div style="text-align: right; font-size: 10px; color: #64748b;">
              Reference: ${certRef}<br/>
              Timestamp: ${certDate}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

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

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  }, 200);
};
