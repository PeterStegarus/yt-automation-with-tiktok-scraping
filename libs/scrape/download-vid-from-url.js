const fs = require('fs');
const fetch = require('node-fetch');
const colors = require('colors');

async function downloadVidFromUrl(url, video, index, logVids, cfg) {
    try {
        const response = await fetch(url);
        const buffer = await response.buffer();

        fs.writeFile(video.path, buffer, () => {
            console.log(`Downloaded vid [${index}] [${video.title.substring(0, 10)}] in [${video.category}]`.green);
            logVids.push(video);
            fs.writeFileSync(`${cfg.videosPath}/${video.category}` + "/logs.txt", JSON.stringify(logVids));
        });
    } catch (error) {
        console.log(error.red + `. Trying to download [${index}] in [${video.category}] again`.white);
        await downloadVidFromUrl(url, video, index, logVids, video.category);
    }
}

module.exports = downloadVidFromUrl;