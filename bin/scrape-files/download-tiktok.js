const puppeteer = require("puppeteer");
const downloadVidFromUrl = require("./download-vid-from-url.js");

async function downloadTiktok(browser, video, index) {
    const page = await browser.newPage();
    await page.setDefaultTimeout(600000);
    await page.goto(video.ttdownloaderUrl);
    // await page.waitForNavigation();
    await page.waitForSelector('.download-link')
    console.log(`page loaded [${index}]`);
    // await page.screenshot({ path: 'puppeteerScreenshot.png' });
    const downloadLink = await page.$eval('.download-link', el => el.getAttribute("href"));
    page.close();

    downloadVidFromUrl(downloadLink, video, index);
}

module.exports = downloadTiktok;