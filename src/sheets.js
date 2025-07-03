// src/sheets.js
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../credentials/credentials.json');

const SHEET_ID = process.env.SHEET_ID;

async function getSheet(doc, name) {
  await doc.loadInfo();
  return doc.sheetsByTitle[name];
}

async function getSheetRows(sheetName) {
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth(creds);
  const sheet = await getSheet(doc, sheetName);
  return await sheet.getRows().then(rows => rows.map(r => Object.values(r._rawData)));
}

async function appendDataRow(sheetName, row) {
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth(creds);
  const sheet = await getSheet(doc, sheetName);
  await sheet.addRow({
    A: row[0], // 日付
    B: row[1], // URL
    C: row[2], // 再生回数
  });
}

module.exports = { getSheetRows, appendDataRow };
