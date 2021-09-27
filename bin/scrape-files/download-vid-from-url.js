const fs = require('fs');
const fetch = require('node-fetch');

async function downloadVidFromUrl(url, vid, index) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    
    // fs.appendFileSync(`${process.env.VIDEOS_PATH}/${vid.category}/logs.txt`, `[${url}]:[${desc}]\r\n`);
    fs.writeFile(vid.path, buffer, () =>
        console.log(`finished downloading video [${index}]`));
}

module.exports = downloadVidFromUrl;