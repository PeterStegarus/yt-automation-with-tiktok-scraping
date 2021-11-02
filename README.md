Download tiktoks and post them on youtube 

Required files examples

config/config.json

    {
        "videosPath": "./videos",
        "scrapeNumber": 10,
        "concurrentVidsCount": 3,
        "puppeteerOptions": {
            "userDataDir": "./tmp-data-dir",
            "executablePath": "/usr/bin/google-chrome-stable",
            "headless": true,
            "args": ["--disable-web-security", "--allow-running-insecure-content"]
        },
        "accounts": [
            {
                "category": "games",
                "email": "games@gmail.com",
                "pass": "password",
                "recoveryEmail": "recovery@gmail.com"
            },
            {
                "category": "cars",
                "email": "cars@gmail.com",
                "pass": "password",
                "recoveryEmail": "recovery@gmail.com"
            }
        ]
    }



Videos categories directories must be created manually at the moment. Example path: ./videos/cars


Each category folder needs to have the following files created manually:

logs.txt

    []

upload-index.txt

    0

Temporary workaround example. Run in the ./videos directory:

    category='cars'
    
    mkdir $category && touch $category/logs.txt $category/upload-index.txt && echo '[]' >> $category/logs.txt && echo 0 >> $category/upload-index.txt


You might consider setting your default upload visibility to private. Google doesn't like automated authentication so you might also consider logging in manually when the upload page first shows up. Cookies are saved locally so it should keep you logged in for further testing.
