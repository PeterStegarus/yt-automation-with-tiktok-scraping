const fs = require("fs");
const uploadVid = require("./upload-vid.js");

async function upload(acc, cfg) {
    credentials = { email: acc.email, pass: acc.pass, recoveryemail: acc.recoveryEmail };
    category = acc.category;
    const rawLogs = fs.readFileSync(`${cfg.videosPath}/${category}/logs.txt`);
    const logVids = JSON.parse(rawLogs);
    const rawIndex = fs.readFileSync(`${cfg.videosPath}/${category}/upload-index.txt`);
    let index = parseInt(rawIndex);
    if (isNaN(index)) {
        console.error(`[${category}] index [${index}] is not a number.`.red);
        return;
    }
    const localVidsNo = logVids.length;

    if (index >= localVidsNo)
        return;

    const statusResult = await uploadVid(credentials, logVids[index], index, localVidsNo, cfg);
    if (statusResult) {
        logVids[index].uploaded = true;
        index += 1;
        fs.writeFileSync(`${cfg.videosPath}/${category}/upload-index.txt`, index.toString());
    }

    fs.writeFileSync(`${cfg.videosPath}/${category}/logs.txt`, JSON.stringify(logVids));
}

async function uploadAll() {
    const cfg = JSON.parse(fs.readFileSync("./config/config.json"));

    const accounts = cfg.accounts;
    for (accIndex in accounts) {
        await upload(accounts[accIndex], cfg);
    }
}

module.exports = uploadAll;