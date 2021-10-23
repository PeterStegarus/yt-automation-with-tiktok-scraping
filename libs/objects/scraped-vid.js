function vid(path, title, category, ttdownloaderUrl, url) {
    this.path = path;
    this.title = title;
    this.category = category;
    this.ttdownloaderUrl = ttdownloaderUrl;
    this.url = url;
    this.uploaded = false;
}

module.exports = vid;