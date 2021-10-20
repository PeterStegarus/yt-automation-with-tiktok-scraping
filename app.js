require('dotenv').config({path: "./config/.env"});
const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const scrape = require("./bin/scrape-files/scrape.js");
const upload = require("./bin/upload-files/upload.js");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

const infoTxt = "Scraper";
let isScraping = false;
let isUploading = false;

app.get("/", function (req, res) {
    let uploadNumber = fs.readFileSync(`${process.env.VIDEOS_PATH}/cars/upload-index.txt`);
    let scrapeNumber = JSON.parse(fs.readFileSync("./config/config.json")).scrapeNumber;
    res.render("index", {
        scrapeNumber: scrapeNumber,
        uploadNumber: uploadNumber
    });
})


app.post("/api/scrape", async function (req, res) {
    function toggleIsScraping() {
        console.log("DONE SCRAPING".bgGreen);
        isScraping = !isScraping;
        res.redirect("/api/scrape");
    }
    if (!isScraping) {
        isScraping = true;
        await scrape(toggleIsScraping);
    }
})

var accIndex = 0;

function toggleIsUploading() {
    isUploading = !isUploading;
}

app.post("/api/upload", async function (req, res) {
    accIndex = 0;
    if (!isUploading) {
        isUploading = true;
        upload().then(() => {
            isUploading = false;
            res.redirect("/api/upload");
        });
    }
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
})