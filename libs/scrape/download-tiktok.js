const puppeteer = require("puppeteer");
const downloadVidFromUrl = require("./download-vid-from-url.js");
const fs = require('fs');
const colors = require('colors');

const timeout = 60000;
let minTimeout503 = 100
let maxTimeout503 = 4000;
const height = 900;
const width = 900;

function timeout503Random() {
    const tm = Math.floor(Math.random() * (maxTimeout503 - minTimeout503 + 1000) + minTimeout503);
    return tm;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function check503(page, category, index) {
    const h1 = await page.$eval("h1", el => el.innerText);
    if (h1 == "503 Service Temporarily Unavailable") {
        throw `[${category}] [${index}] 503 Unavailable`;
    }
}

async function checkInvalidUrl(page, category, index) {
    const url = page.url();
    if (url.search("url=") === -1) {
        throw `[${category}] [${index}] Invalid URL`;
    }
}

async function downloadTiktok(browser, video, index, logVids, cfg) {
    let page;
    const concurrentVidsCount = cfg.concurrentVidsCount;
    if (minTimeout503 === 1000) {
        minTimeout503 *= concurrentVidsCount ^ 1.3;
        maxTimeout503 *= concurrentVidsCount ^ 1.15;
    }
    try {
        page = await browser.newPage();
        await page.setDefaultTimeout(timeout);
        await page.setViewport({ width: width, height: height });
        await page.goto(video.ttdownloaderUrl);
        await Promise.all([
            page.waitForNavigation(),
            check503(page, video.category, index),
            checkInvalidUrl(page, video.category, index),
            page.waitForSelector('.download-link')
        ]);

        console.log(`Page loaded [${index}] in [${video.category}]`);

        const downloadLink = await page.$eval('.download-link', el => el.getAttribute("href"));
        await page.close();

        downloadVidFromUrl(downloadLink, video, index, logVids, cfg);
    } catch (error) {
        await page.close();
        if (error.toString().search("Invalid URL") != -1) {
            console.log(error.red + " Skipped".white);
            logVids.push(video);
            // will get skipped by uploader and won't get constantly added to the scraping list
            fs.writeFileSync(`${cfg.videosPath}/${video.category}` + "/logs.txt", JSON.stringify(logVids));
            return;
        }
        const randomTimeout = timeout503Random();
        // console.error(`${error}.`.yellow + ` Retrying [${index}] in [${category}] in [${randomTimeout}ms]`);
        await sleep(randomTimeout);
        await downloadTiktok(browser, video, index, logVids, cfg);
    }
}

module.exports = downloadTiktok;