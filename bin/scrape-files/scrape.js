const fs = require("fs");
const tiktokScraper = require("tiktok-scraper");
const puppeteer = require("puppeteer");
const getDownloadPath = require("./get-download-path.js");
const downloadTiktok = require("./download-tiktok.js");
const vid = require("../objects/scraped-vid.js");
// const { raw } = require("express");
const colors = require('colors');

async function scrapeInit(category, browser) {
    console.log(`Starting scraping [${category}]`.bgYellow);
    const downloadPath = getDownloadPath(category);
    fs.mkdir(downloadPath, { recursive: true }, (err) => { if (err) console.log(err); });

    await scrape(browser, category, downloadPath);

    console.log(`Done scraping [${category}]`.bgGreen);
}

async function downloadVids(browser, category, vids, logVids, downloadPath) {
    const promises = [];

    for (const i in vids) {
        let { webVideoUrl: url, text: description } = vids[i];
        description = description.replace(/[\/\\.'":|*?#<>{}]/g, "");
        description = description.replace(/fyp|foryoupage/ig, "");
        description = description.replace(/tiktok/ig, "Youtube");

        const ttdownloaderUrl = "https://ttdownloader.com/?url=" + url;
        if (logVids.find(element => element.ttdownloaderUrl == ttdownloaderUrl))
            continue;
        console.log(`New entry [${description.substring(0, 10)}..] in [${category}]`.cyan);
        const video = new vid(`${downloadPath}/${description}.mp4`, description, category, ttdownloaderUrl);
        // await downloadTiktok(browser, video, i, logVids, category);
        promises.push(downloadTiktok(browser, video, i, logVids, category));
    }

    await Promise.all(promises);
}

async function scrape(browser, category, downloadPath) {
    // tiktok-scraper has a built-in downloader but noWaterMark seems to be broken. Going to download videos without watermark through ttdownloader.com
    // const data = await tiktokScraper.hashtag(category, { number: 1, filepath: `./videos/hatz`, download: true, noWaterMark: true, filetype: "json" });

    const data = await tiktokScraper.hashtag(category, { number: process.env.SCRAPE_NUMBER });
    const vids = [...data.collector];
    const rawLogs = fs.readFileSync(downloadPath + "/logs.txt");
    const logVids = JSON.parse(rawLogs);
    await downloadVids(browser, category, vids, logVids, downloadPath);
    fs.writeFileSync(downloadPath + "/logs.txt", JSON.stringify(logVids));
}

const puppeteerOptions = {
    executablePath: "/usr/bin/google-chrome-stable",
    headless: true,
};

async function scrapeAll(toggleIsScraping) {
    const browser = await puppeteer.launch(puppeteerOptions);

    const accounts = JSON.parse(fs.readFileSync("./accounts.json"));
    const promises = [];
    for (const acc in accounts) {
        promises.push(scrapeInit(accounts[acc].category, browser));
    }

    Promise.all(promises)
        .then((results) => {
            browser.close().then((browserRes) => console.log("CLOSED BROWSER"));
            toggleIsScraping();
        });
}

module.exports = scrapeAll;