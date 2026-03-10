const puppeteer = require('puppeteer');
const path = require('path');

describe('Popover test', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 100
    });
    page = await browser.newPage();
    await page.goto(`file://${path.resolve(__dirname, '../src/index.html')}`, {
      waitUntil: 'domcontentloaded' // Ждём DOMContentLoaded, как в index.js
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Popover should appear when button is clicked', async () => {
    // Ждём кнопку и кликаем
    await page.waitForSelector('#popover-btn', { timeout: 5000 });
    await page.click('#popover-btn');

    // Ждём появления попвера с проверкой видимости
    await page.waitForFunction(() => {
      const popover = document.getElementById('popover');
      return popover && popover.style.display === 'block' && popover.offsetParent !== null;
    }, { timeout: 15000 });
  });

  test('Popover content should match dataset values', async () => {
    // Открываем попвер
    await page.waitForSelector('#popover-btn', { timeout: 5000 });
    await page.click('#popover-btn');
    await page.waitForFunction(() =>
      document.getElementById('popover').style.display === 'block',
      { timeout: 15000 }
    );

    // Получаем ожидаемые значения из data‑атрибутов кнопки
    const [expectedTitle, expectedContent] = await page.evaluate(() => [
      document.getElementById('popover-btn').dataset.popoverTitle,
      document.getElementById('popover-btn').dataset.content
    ]);

    // Ждём элементы внутри попвера (создаются динамически)
    await page.waitForSelector('.popover-title', { timeout: 10000 });
    await page.waitForSelector('.popover-content', { timeout: 10000 });

    // Проверяем содержимое
    const titleText = await page.$eval('.popover-title', el => el.textContent.trim());
    const contentText = await page.$eval('.popover-content', el => el.textContent.trim());

    expect(titleText).toBe(expectedTitle);
    expect(contentText).toBe(expectedContent);
  });

  test('Popover should hide when clicking outside', async () => {
    // Открываем попвер
    await page.waitForSelector('#popover-btn', { timeout: 5000 });
    await page.click('#popover-btn');
    await page.waitForFunction(() =>
      document.getElementById('popover').style.display === 'block',
      { timeout: 15000 }
    );

    // Клик вне попвера — используем координаты за пределами попвера
    await page.mouse.click(50, 50);

    // Ждём скрытия с увеличенным таймаутом
    await page.waitForFunction(() => {
      const popover = document.getElementById('popover');
      return !popover || popover.style.display === 'none';
    }, { timeout: 8000 });
  });
});
