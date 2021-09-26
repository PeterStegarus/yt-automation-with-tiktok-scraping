const fs = require('fs');
const fetch = require('node-fetch');

async function downloadVidFromUrl(url, downloadPath, desc, index) {
    const response = await fetch(url);
    const buffer = await response.buffer();

    fs.writeFile(`${downloadPath}/${desc}.mp4`, buffer, () =>
        console.log(`finished downloading video [${index}]`));

    fs.writeFileSync(`${downloadPath}/logs.txt`, `[${url}]:[${desc}]\r\n`, "UTF-8", { 'flags': 'a' });
}

module.exports = downloadVidFromUrl;