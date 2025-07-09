const puppeteer = require('puppeteer');
const express = require('express');

const USERNAME = 'bothelper123';
const PASSWORD = 'iyad2009*iyad';
const SERVER_URL = 'https://aternos.org/server/';

async function startServer() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://aternos.org/go/', { waitUntil: 'domcontentloaded' });

  // تسجيل الدخول
  await page.goto('https://aternos.org/login/');
  await page.type('#user', USERNAME, { delay: 100 });
  await page.type('#password', PASSWORD, { delay: 100 });
  await page.click('button[type=submit]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // فتح صفحة السيرفر
  await page.goto(SERVER_URL, { waitUntil: 'domcontentloaded' });

  // انتظار تحميل زر التشغيل
  await page.waitForSelector('#start');

  const isOnline = await page.evaluate(() => {
    return document.querySelector('#start').hasAttribute('disabled');
  });

  if (!isOnline) {
    console.log('🚀 Starting server...');
    await page.click('#start');
  } else {
    console.log('✅ Server already online or starting.');
  }

  await browser.close();
}

// خادم Express لإبقاء Render نشطًا
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Aternos AutoStarter Bot is running!');
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// تشغيل البوت عند بدء التشغيل
startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
});
