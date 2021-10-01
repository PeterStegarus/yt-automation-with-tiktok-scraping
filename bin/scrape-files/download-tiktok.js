const puppeteer = require("puppeteer");
const downloadVidFromUrl = require("./download-vid-from-url.js");
const colors = require('colors');

async function downloadTiktok(browser, video, index, logVids, category) {
    const page = await browser.newPage();
    await page.setDefaultTimeout(60000);
    await page.goto(video.ttdownloaderUrl);

    try {
        await page.waitForSelector('.download-link')
        console.log(`page loaded [${index}]`);

        // await page.screenshot({ path: 'puppeteerScreenshot.png' });
        const downloadLink = await page.$eval('.download-link', el => el.getAttribute("href"));
        page.close();

        downloadVidFromUrl(downloadLink, video, index, logVids, category);
    } catch (error) {
        console.error(`${error} + . Retrying`.red);
        page.close();
        downloadTiktok(browser, video, index, logVids, category)
    }
}

module.exports = downloadTiktok;