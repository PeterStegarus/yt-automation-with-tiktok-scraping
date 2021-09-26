const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const scrape = require("./src/scrape.js");

const category = "cars";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

const infoTxt = "Scraper";
let isScraping = false;

app.get("/", function (req, res) {
    res.render("index", {
        info: infoTxt,
    });
})

app.post("/api/scrape", async function (req, res) {
    if (!isScraping) {
        isScraping = true;
        await scrape(category);
        isScraping = false;
    }
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
})