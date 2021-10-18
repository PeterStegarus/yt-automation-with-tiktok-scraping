const { upload } = require("youtube-videos-uploader");
const colors = require('colors');

const onVideoUploadSuccess = videoUrl => status = true;

var status = false;
const puppeteerOptions = {
    // userDataDir: "/home/peter/.config/google-chrome/",
    executablePath: "/usr/bin/google-chrome-stable",
    // executablePath: "/usr/bin/firefox",
    headless: false,
    args: ['--disable-web-security'/*, '--user-data-dir'*/, '--allow-running-insecure-content' ]
};

async function uploadVid(credentials, vid, category, index, localVidsNo) {
    try {
        const desc = `#shorts #${category}\n\nWe post daily videos of ${category} and related content.\n\nDisclaimer: The video clips posted on this channel are not owned by the channel itself. This is only a compilations channel.\n\nIf you are the owner of this video and feel like you haven’t been duly credited, please contact me here, and I will get back to you ASAP.\n`;
        console.log(`Uploading in [${category}]: [${(vid.title).substring(0, 10)}..]`.yellow);

        status = false;

        const video = { path: vid.path, title: vid.title, description: vid.title + "\n\n" + desc, language: "english", tags: [category, "shorts", "#shorts"], onSuccess: onVideoUploadSuccess }


        await upload(credentials, [video], puppeteerOptions).then((msg) => {
            console.log(`[${msg}]\n[${index + 1}/${localVidsNo}] vids uploaded in [${category}].\n`.green);
            status = true;
        });

        return status;
    } catch (error) {
        //usually, the error 'Error: No node found for selector: [aria-label="Tags"].' shows up when an account has reached its daily upload limit. (10 vids for new accounts)
        //in this case, simply return false and skip this channel.
        if (error.toString().search("aria-label=\"Tags\"") != -1) {
            console.error(`${error}.`.red + `[${category}] reached upload limit. Skipping.\n`);
            return false;
        }
        console.error(`${error}.`.red + "Retrying");
        return await uploadVid(credentials, vid, category, index, localVidsNo);
    }
}

module.exports = uploadVid;