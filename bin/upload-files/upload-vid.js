const { upload } = require("youtube-videos-uploader");
const colors = require('colors');

const onVideoUploadSuccess = videoUrl => status = true;


var status = false;

async function uploadVid(credentials, vid, category, index, localVidsNo) {
    try {
        const desc = `#shorts\n\nWe post daily videos of ${category} and related content.\n\nDisclaimer: The video clips posted on this channel are not owned by the channel itself. This is only a compilations channel.\n\nIf you are the owner of this video and feel like you haven’t been duly credited, please contact me here, and I will get back to you ASAP.\n`;
        console.log(`Uploading in [${category}]: [${(vid.title).substring(0, 10)}..]`.yellow);

        status = false;

        const video = { path: vid.path, title: vid.title, description: vid.title + "\n\n" + desc, language: "english", tags: [category, "shorts", "#shorts"], onSuccess: onVideoUploadSuccess }


        await upload(credentials, [video]).then((msg) => {
            console.log(`[${msg}]\n[${index + 1}/${localVidsNo}] vids uploaded in [${category}].\n`.green);
            status = true;
        });

        return status;
    } catch (error) {
        console.error(`${error}.`.red + "Retrying");
        await uploadVid(credentials, vid, category, index, localVidsNo);
    }
}

module.exports = uploadVid;