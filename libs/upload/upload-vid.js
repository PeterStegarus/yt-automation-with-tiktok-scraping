const fs = require("fs");
const { upload } = require("youtube-videos-uploader");
const colors = require('colors');

const onVideoUploadSuccess = videoUrl => status = true;

var status = false;

async function uploadVid(credentials, vid, category, index, localVidsNo) {
    const puppeteerOptions = {
        userDataDir: `./data-dirs/${category}`,
        executablePath: "/usr/bin/google-chrome-stable",
        headless: true,
        args: ['--disable-web-security'/*, '--user-data-dir'*/, '--allow-running-insecure-content']
    };

    try {
        const desc = `#shorts #${category}\n\nWe post daily videos of ${category} and related content.\n\nDisclaimer: The video clips posted on this channel are not owned by the channel itself. This is only a compilations channel.\n\nIf you are the owner of this video and feel like you haven’t been duly credited, please contact me here, and I will get back to you ASAP.\n`;
        console.log(`Uploading in [${category}]: [${(vid.title).substring(0, 10)}..]`.yellow);

        status = false;

        const video = { path: vid.path, title: vid.title, description: vid.title + "\n\n" + desc, language: "english", tags: [category, "shorts", "#shorts"], onSuccess: onVideoUploadSuccess }


        await upload(credentials, [video], puppeteerOptions).then((msg) => {
            console.log(`[${msg}]\n[${index + 1}/${localVidsNo}] vids uploaded in [${category}].\n`.green);
            fs.unlinkSync(vid.path);
            status = true;
        });

        return status;
    } catch (error) {
        //usually, the error 'Error: No node found for selector: [aria-label="Tags"].' shows up when an account has reached its daily upload limit. (10 vids for new accounts)
        //in this case, simply return false and skip this channel.
        if (error.toString().search("aria-label=\"Tags\"") != -1) {
            console.error(`${error}. `.red + `[${category}] reached upload limit. Skipping.\n`);
            return false;
        }
        if (error.toString().search("does not exist or is not readable") != -1) {
            console.log(`${error}. `.red + `Skipping vid`);
            return true;
        }
        console.error(`${error}.`.red + "Retrying");
        return await uploadVid(credentials, vid, category, index, localVidsNo);
    }
}

module.exports = uploadVid;