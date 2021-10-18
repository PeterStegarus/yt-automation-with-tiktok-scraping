const fs = require('fs');
const fetch = require('node-fetch');
const colors = require('colors');

async function downloadVidFromUrl(url, video, index, logVids, category) {
    const response = await fetch(url);
    const buffer = await response.buffer();

    // fs.appendFileSync(`${process.env.VIDEOS_PATH}/${vid.category}/logs.txt`, `[${url}]:[${desc}]\r\n`);
    fs.writeFile(video.path, buffer, () => {
        console.log(`Downloaded vid [${index}] [${video.title.substring(0,10)}] in [${category}]`.green);
        logVids.push(video);
        fs.writeFileSync(`${process.env.VIDEOS_PATH}/${category}` + "/logs.txt", JSON.stringify(logVids));
    });
}

module.exports = downloadVidFromUrl;