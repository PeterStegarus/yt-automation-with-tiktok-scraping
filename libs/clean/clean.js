const fs = require("fs");
const colors = require('colors');

function getFilesize(path) {
    return fs.statSync(path).size;
}

function cleanEmptyFiles(category) {
    console.log(`Cleaning [${category}]`.bgYellow);
    const rawLogs = fs.readFileSync(`${process.env.VIDEOS_PATH}/${category}/logs.txt`);
    const logVids = JSON.parse(rawLogs);
    const rawIndex = fs.readFileSync(`${process.env.VIDEOS_PATH}/${category}/upload-index.txt`);
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

    fs.writeFileSync(`${process.env.VIDEOS_PATH}/${category}/logs.txt`, JSON.stringify(logVids));
    console.log(`Cleaned [${deletedVids}] in [${category}]`.bgGreen);
}

function cleanEmptyFilesAll() {
    const accounts = JSON.parse(fs.readFileSync("./config/accounts.json"));
    for (accIndex in accounts) {
        cleanEmptyFiles(accounts[accIndex].category);
    }
    console.log("Done cleaning everything".green);
}

module.exports = cleanEmptyFilesAll;