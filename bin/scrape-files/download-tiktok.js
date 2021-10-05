const puppeteer = require("puppeteer");
const downloadVidFromUrl = require("./download-vid-from-url.js");
const colors = require('colors');

const timeout = 60000;
const minTimeout503 = 1000
const maxTimeout503 = 10000;
const height = 900;
const width = 900;

function timeout503Random() {
    const tm = Math.floor(Math.random() * (maxTimeout503 - minTimeout503 + 1000) + minTimeout503);
    return tm;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function check503(page, category, video, index) {
    const h1 = await page.$eval("h1", el => el.innerText);
    if (h1 == "503 Service Temporarily Unavailable") {
        throw `[${category}] [${index}] 503 Unavailable`;
    }
}

async function downloadTiktok(browser, video, index, logVids, category) {
    const page = await browser.newPage();
    await page.setDefaultTimeout(timeout);
    await page.setViewport({ width: width, height: height });
    await page.goto(video.ttdownloaderUrl);

    try {
        await Promise.all([
            page.waitForNavigation(),
            check503(page, category, video, index),
            page.waitForSelector('.download-link')
        ]);

        console.log(`Page loaded [${index}] in [${category}]`);

        const downloadLink = await page.$eval('.download-link', el => el.getAttribute("href"));
        await page.close();

        downloadVidFromUrl(downloadLink, video, index, logVids, category);
    } catch (error) {
        await page.close();
        const randomTimeout = timeout503Random();
        console.error(`${error}.`.red + ` Retrying [${index}] in [${category}] in [${randomTimeout}ms]`);
        await sleep(randomTimeout);
        await downloadTiktok(browser, video, index, logVids, category);
    }
}

module.exports = downloadTiktok;