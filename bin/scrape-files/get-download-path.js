function getToday() {
    const date = new Date();
    let today = date.toISOString();
    return today.substring(0, today.indexOf('T'));
}

function getDownloadPath(category) {
    return `${process.env.VIDEOS_PATH}/${category}`;
}

module.exports = getDownloadPath;