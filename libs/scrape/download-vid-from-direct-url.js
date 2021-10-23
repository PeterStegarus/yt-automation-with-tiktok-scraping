const fs = require('fs');
const https = require('https');
const colors = require('colors');

async function downloadVidFromDirectUrl(url, video, index, logVids, category) {
    let file = fs.createWriteStream(video.path);
    https.get(url, function (response) {
        response.pipe(file);
        console.log(`Downloaded vid [${index}] [${video.title.substring(0, 10)}] in [${category}]`.green);
        logVids.push(video);
        fs.writeFileSync(`${process.env.VIDEOS_PATH}/${category}` + "/logs.txt", JSON.stringify(logVids));
    });
}

module.exports = downloadVidFromDirectUrl;