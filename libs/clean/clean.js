const fs = require("fs");
const colors = require('colors');

function getFilesize(path) {
    return fs.statSync(path).size;
}

function cleanEmptyFiles(category, cfg) {
    console.log(`Cleaning [${category}]`.bgYellow);
    const rawLogs = fs.readFileSync(`${cfg.videosPath}/${category}/logs.txt`);
    const logVids = JSON.parse(rawLogs);
    const rawIndex = fs.readFileSync(`${cfg.videosPath}/${category}/upload-index.txt`);
    let index = parseInt(rawIndex);
    let vid, deletedVids = 0;
    for (; index < logVids.length; ++index) {
        vid = logVids[index];
        if (!fs.existsSync(vid.path))
            continue;
        //usually, broken vids are at most 156kb but can't know for sure
        if (getFilesize(vid.path) < 190000) {
            deletedVids++;
            fs.unlinkSync(vid.path);
            logVids.splice(index, 1);
            index--;
        }
    }

    fs.writeFileSync(`${cfg.videosPath}/${category}/logs.txt`, JSON.stringify(logVids));
    console.log(`Cleaned [${deletedVids}] in [${category}]`.bgGreen);
}

function cleanEmptyFilesAll() {
    const cfg = JSON.parse(fs.readFileSync("./config/config.json"));
    const accounts = cfg.accounts;
    for (accIndex in accounts) {
        cleanEmptyFiles(accounts[accIndex].category, cfg);
    }
    console.log("Done cleaning everything".green);
}

module.exports = cleanEmptyFilesAll;