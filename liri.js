require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
// var spotify = require("node-spotify-api");
// var spotify = new Spotify(keys.spotify);

var action = process.argv[2];
var parameter = process.argv[3];

function switchCase() {
    switch(action) {
        case "concert-this":
            bandsInTown(parameter);
            break;
        case "spotify-this-song":
            spotifySong(parameter);
            break;
        case "movie-this":
            omdbInfo(parameter);
            break;
        case "do-what-it-says":
            getRandom();
            break;

            default:
            log("Error: Invalid Search");
            break;
    }
};

function bandsintown(parameter){

    if (action === "concert-this"){
        var showName = "";
        for (var i = 3; i < process.argv.length; i++){
            showName+=process.argv[i];
        }   
        console.log(showName);     
    } else {
        showName = parameter;
    }

    var queryURL = "https://rest.bandsintown.com/artist/"+showName+"/events?app_id=codingbootcamp";

    request(queryURL, function(err, response, body) {
        if (!err && response.statusCode === 200) {
            var js = JSON.parse(body);
            for (var i = 0; i < js.length; i++) {
                var time = js[i].datetime;
                var month = time.substring(5,7);
                var year = time.substring(0,4);
                var day = time.substring(8,10);
                var form = month + "/" + day + "/" + year;

                log("\n-------------------------------\n");

                log("Date: " + form);
                log("Name: " + js[i].venue.name);
                log("City: " + js[i].venue.city);

                if (js[i].venue.region !== "") {
                    log("Country: " + js[i].venue.region);
                }
                log("Country: " + js[i].venue.country);
                log("\n------------------------------\n");
            }
        }
    });
}