const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://login.xfinity.com/login');
    await page.type('input#user', 'aamanpatidar110@gmail.com');
    await page.click('button[type=submit]#sign_in');
    await page.waitForNavigation();
    let error
    if( page.url() === 'https://login.xfinity.com/login') {
        error = await page.$eval('p#error', (para) => {
                return para.textContent
        })
    }

    if(error) {
        console.log("Validation failed!", "Error message: " + error)
    }
    await browser.close();
  })();