const puppeteer = require('puppeteer');
const express = require('express');

const USERNAME = 'bothelper123';
const PASSWORD = 'iyad2009*iyad';
const SERVER_SLUG = 'ourserver-5LOn';

async function startAternosServer() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  try {
    // 🔐 تسجيل الدخول
    await page.goto('https://aternos.org/go/', { waitUntil: 'networkidle2' });
    await page.goto('https://aternos.org/login/', { waitUntil: 'networkidle2' });
    await page.type('#user', USERNAME, { delay: 50 });
    await page.type('#password', PASSWORD, { delay: 50 });
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // 🚪 الانتقال إلى صفحة السيرفر
    await page.goto(`https://aternos.org/server/${SERVER_SLUG}`, { waitUntil: 'networkidle2' });

    // ⏳ الانتظار حتى تظهر حالة السيرفر
    await page.waitForSelector('#statuslabel');

    const status = await page.$eval('#statuslabel', el => el.textContent.trim());
    console.log(`📡 Current server status: ${status}`);

    if (status === 'Offline') {
      console.log('🟢 Starting server...');
      await page.click('#start'); // زر التشغيل
    } else {
      console.log('✅ Server is already running.');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await browser.close();
  }
}

// 🔁 تحقق من حالة السيرفر كل دقيقة
setInterval(startAternosServer, 60 * 1000);

// 🌐 سيرفر Express ليبقي البوت نشطًا في Render
const app = express();
app.get('/', (req, res) => res.send('🚀 Aternos Auto Starter is running!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));

// 📍 تشغيل أول مرة مباشرة
startAternosServer();
