// import dotenv from 'dotenv'
// dotenv.config({ path: "./config/.env" });
import express from "express";
import ejs from "ejs";
import fs from "fs";
import scrape from "./libs/scrape/scrape.mjs"
import upload from "./libs/upload/upload.js";
import clean from "./libs/clean/clean.js";

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
    const cfg = JSON.parse(fs.readFileSync("./config/config.json"));
    let uploadedNumber = fs.readFileSync(`${cfg.videosPath}/cars/upload-index.txt`);
    let scrapedNumber = JSON.parse(fs.readFileSync("./config/config.json")).scrapeNumber;
    res.render("index", {
        scrapeNumber: scrapedNumber,
        uploadNumber: uploadedNumber
    });
})


app.post("/api/scrape", async function (req, res) {
    function toggleIsScraping() {
        console.log("DONE SCRAPING".bgGreen);
        isScraping = !isScraping;
        res.sendStatus(200);
    }
    if (!isScraping) {
        isScraping = true;
        await scrape(toggleIsScraping);
    }
})

var accIndex = 0;

app.post("/api/upload", async function (req, res) {
    accIndex = 0;
    if (!isUploading) {
        isUploading = true;
        upload().then(() => {
            isUploading = false;
            res.sendStatus(200);
        });
    }
})

app.post("/api/clean", async function (req, res) {
    clean();
    res.sendStatus(200);
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
})