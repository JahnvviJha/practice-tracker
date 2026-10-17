import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

function findChromePath() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }
  const candidatePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser'
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const CHROME_PATH = findChromePath();
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

async function runBrowserTests() {
  console.log('=============================================');
  console.log('🌐 RUNNING REAL BROWSER INTEGRATION TEST');
  console.log('=============================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  if (!CHROME_PATH) {
    console.error('⚠️  No local Chrome or Chromium executable found.');
    console.error('Please set the CHROME_BIN environment variable to your Chrome or Edge path.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  // Handle confirmation dialogs automatically
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  try {
    // 1. Load Application
    console.log('1. Loading application at desktop viewport (1280x800)...');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(APP_URL, { waitUntil: 'networkidle0' });

    const title = await page.title();
    assert(title.includes('Interview Practice Tracker'), 'Page title is correct');

    // Screenshot Desktop
    await page.screenshot({ path: path.join(process.cwd(), 'desktop_view.png') });
    console.log('  📸 Captured desktop_view.png');

    // 2. Check Console Errors
    assert(consoleErrors.length === 0, `Zero console errors on load (Found ${consoleErrors.length})`);

    // 3. Inspect Metrics Dashboard
    console.log('\n2. Verifying Dashboard Metrics on Initial Load:');
    const totalCountText = await page.$eval('.metric-footer span strong', el => el.textContent);
    assert(totalCountText === '13', `Total initial questions count is 13 (got ${totalCountText})`);

    const mcStatus = await page.$eval('.status-toggle-btn', el => el.textContent.trim());
    assert(mcStatus.includes('Completed'), `Machine coding status badge is "Completed" (got "${mcStatus}")`);

    // 4. Test Mobile Layout
    console.log('\n3. Testing Mobile Responsive Viewport (390x844)...');
    await page.setViewport({ width: 390, height: 844 });
    await page.waitForSelector('.app-container');
    await page.screenshot({ path: path.join(process.cwd(), 'mobile_view.png') });
    console.log('  📸 Captured mobile_view.png');

    // Restore Desktop
    await page.setViewport({ width: 1280, height: 800 });

    // 5. Test Form Validation in Modal
    console.log('\n4. Testing Add Question Modal & Form Validation:');
    const addBtn = await page.waitForSelector('.btn-primary');
    await addBtn.click();
    await page.waitForSelector('.modal-overlay');

    // Submit empty form
    const submitBtn = await page.$('.modal-footer .btn-primary');
    await submitBtn.click();
    await page.waitForSelector('.form-error-title');

    const emptyError = await page.$eval('.form-error-title', el => el.textContent);
    assert(emptyError.includes('Title is required'), `Empty validation caught: "${emptyError}"`);

    // Short title validation
    await page.type('#question-title', 'ab');
    await submitBtn.click();
    const shortError = await page.$eval('.form-error-title', el => el.textContent);
    assert(shortError.includes('at least 3 characters'), `Short title validation caught: "${shortError}"`);

    // Valid title, but invalid URL validation
    await page.click('#question-title', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#question-title', 'System Design: Rate Limiter');

    await page.type('#question-link', 'invalid-url-string');
    await submitBtn.click();
    await page.waitForSelector('.form-error-link');
    const urlError = await page.$eval('.form-error-link', el => el.textContent);
    assert(urlError.includes('valid URL'), `Invalid URL validation caught: "${urlError}"`);

    // Fix URL and select other fields
    await page.click('#question-link', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#question-link', 'https://en.wikipedia.org/wiki/Rate_limiting');

    await page.select('#question-category', 'Technical');
    await page.select('#question-difficulty', 'Hard');
    await page.select('#question-status', 'In Progress');
    await page.type('#question-notes', 'Token bucket and leaky bucket algorithms.');
    await submitBtn.click();

    await page.waitForSelector('.modal-overlay', { hidden: true });
    console.log('  ✅ Question modal closed successfully after valid submission.');

    // Verify Question Added
    const newTotal = await page.$eval('.metric-footer span strong', el => el.textContent);
    assert(newTotal === '14', `Total questions updated to 14 (got ${newTotal})`);

    const firstCardTitle = await page.$eval('.question-card:first-child .question-title', el => el.textContent.trim());
    assert(firstCardTitle.includes('System Design: Rate Limiter'), `New question appears at top: "${firstCardTitle}"`);

    // 6. Test Quick Status Toggle on Card
    console.log('\n5. Testing Quick Status Toggle:');
    const statusChip = await page.$('.question-card:first-child .status-chip');
    await statusChip.click();

    const updatedStatus = await page.$eval('.question-card:first-child .status-chip', el => el.textContent.trim());
    assert(updatedStatus === 'Completed', `Status transitioned from In Progress -> Completed (got "${updatedStatus}")`);

    // 7. Test Instant Search
    console.log('\n6. Testing Search Functionality:');
    await page.type('.search-box .input-field', 'Rate Limiter');
    await new Promise(r => setTimeout(r, 200));

    const searchCount = await page.$$eval('.question-card', cards => cards.length);
    assert(searchCount === 1, `Search "Rate Limiter" returned exactly 1 card (got ${searchCount})`);

    // Clear search
    await page.click('.clear-search-btn');
    await new Promise(r => setTimeout(r, 200));
    const clearedCount = await page.$$eval('.question-card', cards => cards.length);
    assert(clearedCount === 14, `Clearing search restored 14 cards (got ${clearedCount})`);

    // 8. Test Multi-parameter Filtering & Reset
    console.log('\n7. Testing Multi-Parameter Filters:');
    const categorySelect = (await page.$$('.select-field'))[0];
    await categorySelect.select('DSA');
    await new Promise(r => setTimeout(r, 200));

    const dsaCardsCount = await page.$$eval('.question-card', cards => cards.length);
    assert(dsaCardsCount === 5, `Filtering by DSA returns 5 cards (got ${dsaCardsCount})`);

    // Click Clear Filters
    const clearFiltersBtn = await page.$('.toolbar-grid .btn-secondary');
    if (clearFiltersBtn) {
      await clearFiltersBtn.click();
    }
    await new Promise(r => setTimeout(r, 200));
    const restoredCards = await page.$$eval('.question-card', cards => cards.length);
    assert(restoredCards === 14, `Reset filters restored all 14 cards (got ${restoredCards})`);

    // 9. Test Empty Search State
    console.log('\n8. Testing Empty Search State:');
    await page.type('.search-box .input-field', 'NonExistentXYZSearchTerm');
    await new Promise(r => setTimeout(r, 200));

    const emptyTitle = await page.$eval('.empty-state-title', el => el.textContent);
    assert(emptyTitle.includes('No matching questions'), `Empty state rendered: "${emptyTitle}"`);

    // Click Clear filters in empty state
    await page.click('.empty-state .btn-secondary');
    await new Promise(r => setTimeout(r, 200));

    // 10. Test Persistence across Refresh
    console.log('\n9. Testing LocalStorage Persistence Across Full Page Reload:');
    await page.reload({ waitUntil: 'networkidle0' });

    const reloadedTotal = await page.$eval('.metric-footer span strong', el => el.textContent);
    assert(reloadedTotal === '14', `Total remains 14 after reload (got ${reloadedTotal})`);

    const reloadedFirstCard = await page.$eval('.question-card:first-child .question-title', el => el.textContent.trim());
    assert(reloadedFirstCard.includes('System Design: Rate Limiter'), `Persisted item remains at top: "${reloadedFirstCard}"`);

    const reloadedStatus = await page.$eval('.question-card:first-child .status-chip', el => el.textContent.trim());
    assert(reloadedStatus === 'Completed', `Persisted status is Completed (got "${reloadedStatus}")`);

    // 11. Test Delete Question
    console.log('\n10. Testing Question Deletion:');
    const deleteBtn = await page.$('.question-card:first-child .card-actions button:last-child');
    await deleteBtn.click();
    await new Promise(r => setTimeout(r, 300));

    const postDeleteTotal = await page.$eval('.metric-footer span strong', el => el.textContent);
    assert(postDeleteTotal === '13', `Total returned to 13 after delete (got ${postDeleteTotal})`);

    console.log('\n=============================================');
    console.log(`🎉 ALL BROWSER INTEGRATION TESTS PASSED: ${passed}/${total}`);
    console.log('=============================================');

  } catch (err) {
    console.error('❌ Browser Test Error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runBrowserTests();
