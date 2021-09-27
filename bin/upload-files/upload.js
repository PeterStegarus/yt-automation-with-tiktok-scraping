const uploadMultipleVids = require("./upload-multiple-vids.js");
const credentials = { email: process.env.EMAIL, pass: process.env.PASS, recoveryemail: process.env.RECOVERY_EMAIL }
const vid = require("../objects/scraped-vid.js");



module.exports = () => console.log("uploading");