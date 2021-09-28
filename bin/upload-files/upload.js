const fs = require("fs");
const uploadMultipleVids = require("./upload-multiple-vids.js");
const uploadVid = require("./upload-vid.js");
const credentials = { email: process.env.EMAIL, pass: process.env.PASS, recoveryemail: process.env.RECOVERY_EMAIL }
const vid = require("../objects/scraped-vid.js");

async function upload(category) {
    console.log("uploading");
    const rawLogs = fs.readFileSync(`${process.env.VIDEOS_PATH}/${category}/logs.txt`);
    const logVids = JSON.parse(rawLogs);
    const rawIndex = fs.readFileSync(`${process.env.VIDEOS_PATH}/${category}/upload-index.txt`);
    let index = parseInt(rawIndex);
    const localVidsNo = logVids.length;

    for (let i = 0; i < process.env.UPLOAD_NUMBER && index < localVidsNo; ++i) {
        if (uploadVid(credentials, logVids[index])) {
            logVids[index].uploaded = true;
        }
    }

    
    index += parseInt(process.env.UPLOAD_NUMBER);
    fs.writeFileSync(`${process.env.VIDEOS_PATH}/${category}/upload-index.txt`, index.toString());
    fs.writeFileSync(`${process.env.VIDEOS_PATH}/${category}/logs.txt`, JSON.stringify(logVids));
    console.log(`There are now [${index}/${localVidsNo}] videos uploaded to youtube`);
}




module.exports = upload;