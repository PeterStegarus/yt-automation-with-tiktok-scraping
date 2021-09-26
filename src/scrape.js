const fs = require("fs");
const tiktokScraper = require("tiktok-scraper");
const https = require("https");
const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const downloadVidFromUrl = require("./downloadVidFromUrl.js");

async function runPup(browser, downloadPath, url, desc, index) {
    const page = await browser.newPage();
    await page.goto(url);
    await Promise.all([
        page.waitForNavigation(),
        console.log(`page loaded [${index}]`),
    ]);
    // await page.screenshot({ path: 'puppeteerScreenshot.png' });
    const downloadLink = await page.$eval('.download-link', el => el.getAttribute("href"));

    downloadVidFromUrl(downloadLink, downloadPath, desc, index);
    page.close();
}

function getDownloadPath(category) {
    const date = new Date();
    let today = date.toISOString();
    today = today.substring(0, today.indexOf('T'));
    return `./videos/${category}/${today}`;
}

async function scrapeTT(category) {
    console.log("Starting scraping");
    const downloadPath = getDownloadPath(category);
    fs.mkdir(downloadPath, { recursive: true }, (err) => {
        if (err) console.log(err);
    });
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
    });

    const data = await tiktokScraper.hashtag(category, { number: 10 });
    const vids = [...data.collector];
    for (const i in vids) {
        const url = vids[i].webVideoUrl;
        const description = vids[i].text;
        const ttdownloaderUrl = "https://ttdownloader.com/?url=" + url;
        await runPup(browser, downloadPath, ttdownloaderUrl, description, i);
    }

    await browser.close();
    console.log("done scraping");
}

module.exports = async function (category) {
    console.log(category);
    scrapeTT(category)
};