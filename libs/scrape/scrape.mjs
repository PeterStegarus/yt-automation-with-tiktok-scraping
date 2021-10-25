import fs from "fs";
import tiktokScraper from "tiktok-scraper";
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import pLimit from 'p-limit';
import downloadTiktok from "./download-tiktok.js";
import vid from "../objects/scraped-vid.js";
import colors from 'colors';

puppeteer.use(StealthPlugin())

async function downloadVids(browser, category, vids, logVids, downloadPath, cfg) {
    const promises = [];
    const limit = pLimit(cfg.concurrentVidsCount);

    for (const i in vids) {
        let { webVideoUrl: url, text: description } = vids[i];
        description = description.replace(/[\/\\.'":|*?#<>{}]/g, "").replace(/fyp|foryoupage/ig, "").replace(/tiktok/ig, "Youtube");

        const ttdownloaderUrl = "https://ttdownloader.com/?url=" + url;
        if (logVids.find(element => element.ttdownloaderUrl == ttdownloaderUrl))
            continue;
        console.log(`New entry [${description.substring(0, 10)}..] in [${category}]`.cyan);
        const video = new vid(`${downloadPath}/${description}.mp4`, description, category, ttdownloaderUrl, url);
        promises.push(limit(() => downloadTiktok(browser, video, i, logVids, cfg)));
    }

    await Promise.all(promises);
}

async function scrape(browser, category, downloadPath, cfg) {
    // tiktok-scraper has a built-in downloader but noWaterMark seems to be broken. Going to download videos without watermark through ttdownloader.com
    // const data = await tiktokScraper.hashtag(category, { number: 1, filepath: `./videos/hatz`, download: true, noWaterMark: true, filetype: "json" });

    const data = await tiktokScraper.hashtag(category, { number: cfg.scrapeNumber });
    const vids = [...data.collector];
    const rawLogs = fs.readFileSync(downloadPath + "/logs.txt");
    const logVids = JSON.parse(rawLogs);
    await downloadVids(browser, category, vids, logVids, downloadPath, cfg);
    fs.writeFileSync(downloadPath + "/logs.txt", JSON.stringify(logVids));
}

async function scrapeInit(category, browser, cfg) {
    console.log(`Starting scraping [${category}]`.bgYellow);
    const downloadPath = `${cfg.videosPath}/${category}`;
    fs.mkdir(downloadPath, { recursive: true }, (err) => { if (err) console.log(err); });

    await scrape(browser, category, downloadPath, cfg);

    console.log(`Done scraping [${category}]`.bgGreen);
}

async function scrapeAll(toggleIsScraping) {
    const cfg = JSON.parse(fs.readFileSync("./config/config.json"));
    let puppeteerOptions = cfg.puppeteerOptions;
    puppeteerOptions.userDataDir = "./data-dirs/scrape";
    const browser = await puppeteer.launch();

    const accounts = cfg.accounts;
    const promises = [];
    for (const acc in accounts) {
        promises.push(scrapeInit(accounts[acc].category, browser, cfg));
    }

    Promise.all(promises)
        .then((results) => {
            browser.close().then((browserRes) => console.log("CLOSED BROWSER"));
            toggleIsScraping();
        });
}

export default scrapeAll;