const fs = require("fs");
const uploadMultipleVids = require("./upload-multiple-vids.js");
const uploadVid = require("./upload-vid.js");
const vid = require("../objects/scraped-vid.js");

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

    for (let i = 0; i < process.env.UPLOAD_NUMBER && index < localVidsNo; ++i) {
        const statusResult = await uploadVid(credentials, logVids[index], category, index, localVidsNo);
        if (statusResult) {
            logVids[index].uploaded = true;
        }
    }


    index += parseInt(process.env.UPLOAD_NUMBER);
    fs.writeFileSync(`${process.env.VIDEOS_PATH}/${category}/upload-index.txt`, index.toString());
    fs.writeFileSync(`${process.env.VIDEOS_PATH}/${category}/logs.txt`, JSON.stringify(logVids));
}




module.exports = upload;