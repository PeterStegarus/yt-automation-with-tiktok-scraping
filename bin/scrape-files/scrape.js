const fs = require("fs");
const tiktokScraper = require("tiktok-scraper");
const puppeteer = require("puppeteer");
const getDownloadPath = require("./get-download-path.js");
const downloadTiktok = require("./download-tiktok.js");
const vid = require("../objects/scraped-vid.js");
const { raw } = require("express");
const colors = require('colors');

async function scrapeInit(category) {
    console.log("Starting scraping " + category);
    const downloadPath = getDownloadPath(category);
    fs.mkdir(downloadPath, { recursive: true }, (err) => { if (err) console.log(err); });
    const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome' });

    await scrape(browser, category, downloadPath);

    await browser.close();
    console.log("Done scraping " + category);
}

async function downloadVids(browser, category, vids, logVids, downloadPath) {
    for (const i in vids) {
        let { webVideoUrl: url, text: description } = vids[i];
        description = description.replace(/[\/\\.'":|*?#<>{}]/g, "");
        description = description.replace(/tiktok/ig, "Youtube");
        description = description.replace(/fyp/ig, "");
        
        const ttdownloaderUrl = "https://ttdownloader.com/?url=" + url;
        if (logVids.find(element => element.ttdownloaderUrl == ttdownloaderUrl))
            continue;
        console.log(`new entry ${description}`.cyan);
        const video = new vid(`${downloadPath}/${description}.mp4`, description, category, ttdownloaderUrl);
        logVids.push(video);
        await downloadTiktok(browser, video, i, logVids, category);
    }
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

module.exports = scrapeInit;