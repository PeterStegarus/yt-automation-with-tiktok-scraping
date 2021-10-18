require('dotenv').config();
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
    let scrapeNumber = process.env.SCRAPE_NUMBER;
    res.render("index", {
        scrapeNumber: scrapeNumber,
        uploadNumber: uploadNumber
    });
})

app.post("/api/scrape", async function (req, res) {
    if (!isScraping) {
        isScraping = true;
        await scrape();
        isScraping = false;
        res.redirect("/api/scrape");
    }
})

var accIndex = 0;

app.post("/api/upload", async function (req, res) {
    accIndex = 0;
    if (!isUploading) {
        isUploading = true;
        await upload();
        isUploading = false;
        res.redirect("/api/upload");
    }
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
})