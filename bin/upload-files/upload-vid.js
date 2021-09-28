const { upload } = require("youtube-videos-uploader");

const onVideoUploadSuccess = videoUrl => status = true;


var status = false;

async function uploadVid(credentials, vid, category) {
    const desc = `#shorts\n\nWe post daily videos of ${category} and related content.\n\nDisclaimer: The video clips posted on this channel are not owned by the channel itself. This is only a compilations channel.\n\nIf you are the owner of this video and feel like you haven’t been duly credited, please contact me here, and I will get back to you ASAP.\n`;
    console.log(`Uploading in category [${category}] the video [${vid.title}]`);

    status = false;

    const video = { path: vid.path, title: vid.title, description: vid.title + "\n\n" + desc, language: "english", tags: [vid.category, "shorts"], onSuccess: onVideoUploadSuccess }
    await upload(credentials, [video]).then((msg) => {
        console.log(msg);
        status = true;
    });

    return status;
}

module.exports = uploadVid;