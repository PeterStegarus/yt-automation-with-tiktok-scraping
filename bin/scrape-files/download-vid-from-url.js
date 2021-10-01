const fs = require('fs');
const fetch = require('node-fetch');
const colors = require('colors');



async function downloadVidFromUrl(url, vid, index, logVids, category) {
    const response = await fetch(url);
    const buffer = await response.buffer();

    // fs.appendFileSync(`${process.env.VIDEOS_PATH}/${vid.category}/logs.txt`, `[${url}]:[${desc}]\r\n`);
    fs.writeFile(vid.path, buffer, () => {
        console.log(`finished downloading video [${index}]`.green);
        fs.writeFileSync(`${process.env.VIDEOS_PATH}/${category}` + "/logs.txt", JSON.stringify(logVids));
    });
}

module.exports = downloadVidFromUrl;