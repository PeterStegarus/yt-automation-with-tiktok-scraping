const { upload } = require("youtube-videos-uploader");
const uploadVid = require("./uploadVid");

async function uploadMultipleVids(credentials, vids) {
    for (const vid in vids) {
        await uploadVid(credentials, vids[vid].path, vids[vid].title, vids[vid].category)
    }
}

module.exports = uploadMultipleVids;