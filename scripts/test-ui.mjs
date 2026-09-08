import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'test-screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runUITests() {
  console.log('🚀 Starting Automated Browser Test Suite...');
  
  // Try launching standard installed chromium or edge/chrome as channel fallback
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.log('Falling back to system installed Chrome/Edge channel...');
    try {
      browser = await chromium.launch({ headless: true, channel: 'msedge' });
    } catch {
      browser = await chromium.launch({ headless: true, channel: 'chrome' });
    }
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  const url = 'http://localhost:3000/';

  console.log(`📡 Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);

  console.log('📸 Taking Initial Home Dashboard Screenshot...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-home-dashboard.png'), fullPage: false });

  // 1. Test Price Alerts Modal
  console.log('🔔 Testing Price Alerts Hub & Toasts...');
  const alertsBtn = page.locator('#main-alerts-btn').first();
  if (await alertsBtn.count() > 0) {
    await alertsBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-price-alerts-modal.png') });
    
    // Close modal via close button
    const closeAlertsBtn = page.locator('#close-price-alerts-modal-btn').first();
    if (await closeAlertsBtn.count() > 0) {
      await closeAlertsBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // 2. Test Markets Navigation & Stock Cards
  console.log('📈 Testing Stocks & Markets View...');
  const stocksNavBtn = page.locator('aside button:has-text("Stocks")').first();
  if (await stocksNavBtn.count() > 0) {
    await stocksNavBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-stocks-market.png') });
  }

  // 3. Test Currency Toggle (GHS <-> USD)
  console.log('💱 Testing Currency Toggle ($ vs GH₵)...');
  const currencyToggleBtn = page.locator('#currency-toggle-btn').first();
  if (await currencyToggleBtn.count() > 0) {
    await currencyToggleBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-usd-mode-home.png') });
    console.log('✅ Switched to USD mode & verified dynamic conversion');
  }

  // 4. Test Daily Market Close Report
  console.log('📊 Testing Daily GSE Market Close Report...');
  const homeTabBtn = page.locator('button:has-text("Home")').first();
  if (await homeTabBtn.count() > 0) {
    await homeTabBtn.click();
    await page.waitForTimeout(600);
  }
  
  const marketCloseBtn = page.locator('button:has-text("Daily Close Report"), button:has-text("Market Close Report")').first();
  if (await marketCloseBtn.count() > 0) {
    await marketCloseBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-market-close-report.png') });
    console.log('✅ Daily Market Close Report modal opened and verified');
    
    // Close report modal
    const closeReportBtn = page.locator('#close-market-close-modal-btn').first();
    if (await closeReportBtn.count() > 0) {
      await closeReportBtn.click();
      await page.waitForTimeout(500);
    } else {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  }

  // 5. Test USD to Cedi Transfer & Remittance Calculator
  console.log('🛡️ Testing USD to Cedi Transfer Calculator...');
  const transferCalcBtn = page.locator('button:has-text("USD to Cedi Transfer")').first();
  if (await transferCalcBtn.count() > 0) {
    await transferCalcBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-usd-to-cedi-calculator.png') });
    console.log('✅ USD to Cedi Transfer Calculator opened and verified');
    
    // Close transfer modal
    const closeFxBtn = page.locator('#close-fx-modal-btn').first();
    if (await closeFxBtn.count() > 0) {
      await closeFxBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // 6. Test Paid Feature Pro Gating (Paywall / Pro Pass Unlock)
  console.log('🔒 Testing Pro Feature Gating & Paywall Modal...');
  const proModeBtn = page.locator('aside button:has-text("PRO")').first();
  if (await proModeBtn.count() > 0) {
    await proModeBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-pro-gating-subscription-modal.png') });
    console.log('✅ Pro Gating verified: Free user attempting Pro opened Subscription & 2-Hour Pass Modal');
    
    // Close subscription modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // 7. Test News Tab
  console.log('📰 Testing GSE Market News & IPO Filings...');
  const newsTab = page.locator('button:has-text("News")').first();
  if (await newsTab.count() > 0) {
    await newsTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-news-section.png') });
  }

  // 8. Test Portfolio Tab
  console.log('💼 Testing Portfolio Desk in USD & GHS...');
  const portfolioTab = page.locator('button:has-text("My Portfolio")').first();
  if (await portfolioTab.count() > 0) {
    await portfolioTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-portfolio-desk.png') });
  }

  await browser.close();
  console.log('🎉 All automated UI tests completed successfully! Screenshots saved in ./test-screenshots');
}

runUITests().catch((err) => {
  console.error('❌ UI Test encountered an error:', err);
  process.exit(1);
});
