const puppeteer = require("puppeteer");
const downloadVidFromUrl = require("./download-vid-from-url.js");
const colors = require('colors');

const timeout = 60000;
const minTimeout503 = 3000
const maxTimeout503 = 15000;
const height = 900;
const width = 900;

function timeout503Random() {
    return Math.floor(Math.random() * (maxTimeout503 - minTimeout503 + 1000) + minTimeout503);
}

async function downloadTiktok(browser, video, index, logVids, category) {
    const page = await browser.newPage();
    await page.setDefaultTimeout(timeout);
    await page.setViewport({ width: width, height: height });
    await page.goto(video.ttdownloaderUrl);
    //503 Service Temporarily Unavailable

    try {
        // await Promise.all([
        // await page.waitForNavigation();
        // ]);

        const h1 = await page.$eval("h1", el => el.innerText);
        if (h1 == "503 Service Temporarily Unavailable") {
            console.log(`[${category}] [${video}/${index}] 503 Unavailable. `.red + `Retrying.`);
            page.close();
            setTimeout(() => { downloadTiktok(browser, video, index, logVids, category); }, timeout503Random());
            return;
        }

        await page.waitForSelector('.download-link');
        console.log(`Page loaded [${index}] in [${category}]`);

        const downloadLink = await page.$eval('.download-link', el => el.getAttribute("href"));
        await page.close();

        downloadVidFromUrl(downloadLink, video, index, logVids, category);
    } catch (error) {
        await page.close();
        console.error(`${error}.`.red + ` Retrying [${index}] in [${category}]`);
        await downloadTiktok(browser, video, index, logVids, category);
    }
}

module.exports = downloadTiktok;