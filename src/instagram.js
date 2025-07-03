// src/instagram.js
const { chromium } = require('playwright');
const { getSheetRows, appendDataRow } = require('./sheets');

async function runInstagramReelsFetcher() {
  const accounts = await getSheetRows('計測アカウント');
  const today = new Date();
  today.setDate(today.getDate() - 1);
  const dateStr = today.toISOString().slice(0, 10); // yyyy-mm-dd

  for (const row of accounts) {
    const reelUrl = row[0];
    const username = row[2];
    const password = row[3];

    if (!reelUrl || !username || !password) continue;

    console.log(`🔐 ${username} でログイン処理開始`);

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // ログインページへ移動
      await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle' });

      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', password);
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle' });

      // リールを開く
      await page.goto(reelUrl, { waitUntil: 'networkidle' });

      // インサイトを開く（3点メニュー → インサイト表示）
      await page.click('svg[aria-label="More options"]');
      await page.waitForTimeout(1000);
      await page.click('text=View Insights');

      // インプレッションを抽出
      await page.waitForSelector('text=Plays');
      const viewsText = await page.textContent('text=Plays >> xpath=..');
      const views = viewsText.match(/\d[\d,]*/)?.[0]?.replace(/,/g, '');

      console.log(`✅ ${reelUrl} の再生回数: ${views}`);

      // データ記録
      await appendDataRow('データ', [dateStr, reelUrl, Number(views)]);
    } catch (err) {
      console.error(`❌ ${username} の処理に失敗:`, err.message);
    } finally {
      await browser.close();
    }
  }
}

module.exports = { runInstagramReelsFetcher };
