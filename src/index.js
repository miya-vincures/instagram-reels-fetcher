// src/index.js
require('dotenv').config();
const { runInstagramReelsFetcher } = require('./instagram');

const isVisibleMode = process.env.VISIBLE === 'true';

(async () => {
  if (isVisibleMode) {
    console.log('📺 VISIBLE=true → Playwright実行開始');
    await runInstagramReelsFetcher();
  } else {
    console.log('⏭️ VISIBLE=false → スキップされました');
  }
})();
