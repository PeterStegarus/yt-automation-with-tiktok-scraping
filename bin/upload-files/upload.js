const fs = require("fs");
const uploadVid = require("./upload-vid.js");

async function upload(acc, accIndex) {
    credentials = { email: acc.email, pass: acc.pass, recoveryemail: acc.recoveryEmail };
    category = acc.category;
    const rawLogs = fs.readFileSync(`${process.env.VIDEOS_PATH}/${category}/logs.txt`);
    const logVids = JSON.parse(rawLogs);
    const rawIndex = fs.readFileSync(`${process.env.VIDEOS_PATH}/${category}/upload-index.txt`);
    let index = parseInt(rawIndex);
    const localVidsNo = logVids.length;

    if (index >= localVidsNo)
        return;

    const statusResult = await uploadVid(credentials, logVids[index], category, index, localVidsNo);
    if (statusResult) {
        logVids[index].uploaded = true;
        index += 1;
        fs.writeFileSync(`${process.env.VIDEOS_PATH}/${category}/upload-index.txt`, index.toString());
    }

    fs.writeFileSync(`${process.env.VIDEOS_PATH}/${category}/logs.txt`, JSON.stringify(logVids));
}

async function uploadAll() {
    const accounts = JSON.parse(fs.readFileSync("./config/accounts.json"));
    for (accIndex in accounts) {
        await upload(accounts[accIndex], accIndex);
    }
}

module.exports = uploadAll;