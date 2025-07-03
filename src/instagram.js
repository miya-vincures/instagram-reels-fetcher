const { chromium } = require('playwright');

async function fetchReelViewCount(url, username, password) {
  const browser = await chromium.launch({
    headless: process.env.USE_HEADLESS !== 'false' // falseならGUI表示
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://www.instagram.com/accounts/login/');
    await page.waitForSelector('input[name="username"]');
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle' });

    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const countText = await page.textContent('text=/閲覧|再生/');
    const numeric = countText?.match(/\\d+(,\\d{3})*/)?.[0]?.replace(/,/g, '');
    return numeric ? parseInt(numeric, 10) : null;
  } catch (e) {
    console.error(`❌ fetch error: ${e.message}`);
    return null;
  } finally {
    await browser.close();
  }
}

module.exports = { fetchReelViewCount };
