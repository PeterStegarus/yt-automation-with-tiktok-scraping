const fs = require('fs');
const https = require('https');
const colors = require('colors');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadVidFromDirectUrl(url, video, index, logVids, category) {
    let file = fs.createWriteStream(video.path);
    https.get(url, function (response) {
        if (response.statusCode == 429) {
            sleep(10000);
            await downloadVidFromDirectUrl(url, video, index, logVids, category);
            return;
        }
        response.pipe(file);
        console.log(`Downloaded vid [${index}] [${video.title.substring(0, 10)}] in [${category}] with [${response.statusCode}]`.green);
        logVids.push(video);
        fs.writeFileSync(`${process.env.VIDEOS_PATH}/${category}` + "/logs.txt", JSON.stringify(logVids));
    });
}

module.exports = downloadVidFromDirectUrl;