import { test, expect } from '@playwright/test';
import fs from 'fs';

test('Game Runtime Error Check', async ({ page }) => {
  const errors: string[] = [];
  const screenshotPath = 'test-results/error-screenshot.png';

  // Ensure test-results directory exists
  if (!fs.existsSync('test-results')) {
    fs.mkdirSync('test-results');
  }

  // Listen for unhandled exceptions/page errors
  page.on('pageerror', (exception) => {
    errors.push(`Uncaught Error: ${exception.message}`);
  });

  // Listen for console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  // Navigate to the game (adjust URL if different)
  // Navigate to the game (adjust URL if different)
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    throw new Error('Could not reach the dev server. Make sure "npm run dev" is running at http://localhost:5174');
  }

  // Allow some time for the game loop to run and potentially trigger errors
  await page.waitForTimeout(5000);

  if (errors.length > 0) {
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Errors detected! Screenshot saved to ${screenshotPath}`);
    throw new Error(`Runtime errors detected:\n${errors.join('\n')}`);
  } else {
    console.log('No runtime errors detected in the captured window.');
  }
});
