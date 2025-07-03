const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../credentials/sheets_credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function getAccounts() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const range = '計測アカウント!A2:D';
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  const rows = res.data.values || [];
  return rows
    .filter(r => r[0] && r[2] && r[3])
    .map(r => ({
      url: r[0],
      username: r[2],
      password: r[3],
    }));
}

async function appendResult(dataRows) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: 'データ!A:C',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: dataRows,
    },
  });
}

module.exports = { getAccounts, appendResult };
