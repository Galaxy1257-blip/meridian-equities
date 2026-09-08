import { chromium } from 'playwright';
import path from 'path';

async function testAlertsAndPush() {
  console.log('🧪 Testing Alerts Archiving & Web Push Controls...');
  const browser = await chromium.launch({ headless: true, channel: 'msedge' }).catch(() => chromium.launch({ headless: true }));
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    permissions: ['notifications']
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Open Price Alerts & Notification Center via Header button
  const alertsBtn = page.locator('button[title="Price Alerts Center"]').first();
  await alertsBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(process.cwd(), 'test-screenshots', '09-alerts-feed-active.png') });
  console.log('📸 Captured 09-alerts-feed-active.png');

  // Archive first notification
  const archiveFirstBtn = page.locator('button[title="Archive notification"]').first();
  if (await archiveFirstBtn.count() > 0) {
    await archiveFirstBtn.click();
    await page.waitForTimeout(500);
  }

  // Switch to Archive Tab
  const archiveTabBtn = page.locator('button:has-text("Archive")').first();
  await archiveTabBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(process.cwd(), 'test-screenshots', '10-alerts-archive-tab.png') });
  console.log('📸 Captured 10-alerts-archive-tab.png');

  // Switch to Settings / Preferences Tab (where Push notification toggle & test push are located)
  const settingsTabBtn = page.locator('button:has-text("Preferences"), button:has-text("Settings")').first();
  await settingsTabBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(process.cwd(), 'test-screenshots', '11-push-notifications-settings.png') });
  console.log('📸 Captured 11-push-notifications-settings.png');

  await browser.close();
  console.log('🎉 Alerts Archive and Push controls test completed successfully!');
}

testAlertsAndPush().catch(console.error);
