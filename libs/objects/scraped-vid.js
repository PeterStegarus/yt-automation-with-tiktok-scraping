function vid(path, title, category, ttdownloaderUrl) {
    this.path = path;
    this.title = title;
    this.category = category;
    this.ttdownloaderUrl = ttdownloaderUrl;
    this.uploaded = false;
}

module.exports = vid;