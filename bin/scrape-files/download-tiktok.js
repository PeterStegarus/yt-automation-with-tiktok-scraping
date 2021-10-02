const puppeteer = require("puppeteer");
const downloadVidFromUrl = require("./download-vid-from-url.js");
const colors = require('colors');

async function downloadTiktok(browser, video, index, logVids, category) {
    const page = await browser.newPage();
    await page.setDefaultTimeout(60000);
    await page.goto(video.ttdownloaderUrl);

    try {
        await Promise.all([
            page.waitForNavigation(),
            page.waitForSelector('.download-link')
        ])
        console.log(`Page loaded [${index}]`);

        const downloadLink = await page.$eval('.download-link', el => el.getAttribute("href"));
        await page.close();

        downloadVidFromUrl(downloadLink, video, index, logVids, category);
    } catch (error) {
        console.error(`${error}.`.red + "Retrying");
        await page.close();
        await downloadTiktok(browser, video, index, logVids, category);
    }
}

module.exports = downloadTiktok;