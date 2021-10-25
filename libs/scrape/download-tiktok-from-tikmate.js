const puppeteer = require("puppeteer");
const downloadVidFromDirectUrl = require("./download-vid-from-direct-url.js");
const colors = require('colors');

const timeout = 60000;
const height = 900;
const width = 900;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadTiktok(browser, video, index, logVids, cfg) {
    let page;
    try {
        page = await browser.newPage();
        await page.setDefaultTimeout(timeout);
        await page.setViewport({ width: width, height: height });
        await page.goto("https://tikmate.online");
        await page.waitForSelector('#url');

        await page.type("input[name=url]", video.url, { delay: 0 })
        await page.click("button#send");
        await page.waitForXPath('//*[contains(text(), "Download Server 01 (TikMate)")]');
        let downloadUrl = await page.$eval('a.abutton.is-success.is-fullwidth[onclick]', el => el.getAttribute("href"));
        downloadUrl = "https://tikmate.online" + downloadUrl;

        await page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: "./hatz"
        });
        var button = await page.$('a.abutton.is-success.is-fullwidth[onclick]');
        await button.evaluate(b => b.click());


        // downloadVidFromDirectUrl(downloadUrl, video, index, logVids, cfg);
        await sleep(8000);
        await page.close();


    } catch (error) {
        await page.close();
        console.log(`Error downloading [${index}] [${category}]. [`.red + error.white + "]".red + " Retrying");
        await downloadTiktok(browser, video, index, logVids, cfg);
    }
}

module.exports = downloadTiktok;