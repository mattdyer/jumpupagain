# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test/game_runtime.spec.ts >> Game Runtime Error Check
- Location: test/game_runtime.spec.ts:4:1

# Error details

```
Error: Runtime errors detected:
Uncaught Error: this.initGameplay is not a function
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import fs from 'fs';
  3  | 
  4  | test('Game Runtime Error Check', async ({ page }) => {
  5  |   const errors: string[] = [];
  6  |   const screenshotPath = 'test-results/error-screenshot.png';
  7  | 
  8  |   // Ensure test-results directory exists
  9  |   if (!fs.existsSync('test-results')) {
  10 |     fs.mkdirSync('test-results');
  11 |   }
  12 | 
  13 |   // Listen for unhandled exceptions/page errors
  14 |   page.on('pageerror', (exception) => {
  15 |     errors.push(`Uncaught Error: ${exception.message}`);
  16 |   });
  17 | 
  18 |   // Listen for console errors
  19 |   page.on('console', (msg) => {
  20 |     if (msg.type() === 'error') {
  21 |       errors.push(`Console Error: ${msg.text()}`);
  22 |     }
  23 |   });
  24 | 
  25 |   // Navigate to the game (adjust URL if different)
  26 |   // Navigate to the game (adjust URL if different)
  27 |   try {
  28 |     await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  29 |   } catch (e) {
  30 |     throw new Error('Could not reach the dev server. Make sure "npm run dev" is running at http://localhost:5174');
  31 |   }
  32 | 
  33 |   // Allow some time for the game loop to run and potentially trigger errors
  34 |   await page.waitForTimeout(5000);
  35 | 
  36 |   if (errors.length > 0) {
  37 |     await page.screenshot({ path: screenshotPath, fullPage: true });
  38 |     console.log(`Errors detected! Screenshot saved to ${screenshotPath}`);
> 39 |     throw new Error(`Runtime errors detected:\n${errors.join('\n')}`);
     |           ^ Error: Runtime errors detected:
  40 |   } else {
  41 |     console.log('No runtime errors detected in the captured window.');
  42 |   }
  43 | });
  44 | 
```