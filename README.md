Required files examples



.env

    VIDEOS_PATH=./videos
    SCRAPE_NUMBER=50
    UPLOAD_NUMBER=1



accounts.json

    [
        {
            "category":"cars",
            "email":"cars@gmail.com",
            "pass":"password",
            "recoveryEmail":"recoveryEmail@gmail.com"
        },
        {
            "category":"food",
            "email":"food@gmail.com",
            "pass":"password",
            "recoveryEmail":"recoveryEmail@gmail.com"
        }
    ]



Videos categories directories must be created manually at the moment. Example path: ./videos/cars


Each category folder needs to have the following files created manually:

logs.txt

    []

upload-index.txt

    0

Temporary workaround example. Run in the ./videos directory:

    category='cars'
    
    mkdir $category && touch $category/logs.txt $category/upload-index.txt && echo '[]' >> $category/logs.txt && echo 0 >> $category/upload-index.txt
