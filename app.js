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
    res.render("index", {
        info: infoTxt,
    });
})

app.post("/api/scrape", async function (req, res) {
    if (!isScraping) {
        isScraping = true;
        const accounts = JSON.parse(fs.readFileSync("./accounts.json"));
        for (const acc in accounts) {
            await scrape(accounts[acc].category);
        }
        isScraping = false;
    }
})

var accIndex = 0;

app.post("/api/upload", async function (req, res) {
    accIndex = 0;
    if (!isUploading) {
        isUploading = true;
        const accounts = JSON.parse(fs.readFileSync("./accounts.json"));
        for (accIndex in accounts) {
            // console.log(accounts[accIndex].category);
            await upload(accounts[accIndex], accIndex);
        }

        isUploading = false;
    }
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
})