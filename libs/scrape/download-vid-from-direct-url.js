const fs = require('fs');
const https = require('https');
const colors = require('colors');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadVidFromDirectUrl(url, video, index, logVids, cfg) {
    let file = fs.createWriteStream(video.path);
    https.get(url, function (response) {
        if (response.statusCode == 429) {
            console.log(`Flagged. Skipping [${index}] in [${video.category}]`.bgRed);
            return;
        }
        response.pipe(file);
        console.log(`Downloaded vid [${index}] [${video.title.substring(0, 10)}] in [${video.category}] with [${response.statusCode}]`.green);
        logVids.push(video);
        fs.writeFileSync(`${cfg.videosPath}/${video.category}` + "/logs.txt", JSON.stringify(logVids));
    });
}

module.exports = downloadVidFromDirectUrl;