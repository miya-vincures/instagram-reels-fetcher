const { GoogleSpreadsheet } = require('google-spreadsheet');

// Secrets に設定した値を使う
const SHEET_ID = process.env.SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

const ACCOUNT_TAB = '計測アカウント';
const DATA_TAB = 'データ';

const getDoc = async () => {
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  });
  await doc.loadInfo();
  return doc;
};

const getAccountList = async () => {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[ACCOUNT_TAB];
  const rows = await sheet.getRows();

  return rows.map(row => ({
    url: row.A,
    username: row.C,
    password: row.D,
  })).filter(r => r.url && r.username && r.password);
};

const appendViewData = async (values) => {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[DATA_TAB];
  await sheet.addRows(values.map(v => ({
    日付: v[0],
    URL: v[1],
    再生数: v[2],
  })));
};

module.exports = {
  getAccountList,
  appendViewData,
};
