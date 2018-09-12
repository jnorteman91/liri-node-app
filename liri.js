require("dotenv").config();
var keys = require("./keysfolder/keys.js");
var request = require("request");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
// var getArtistNames = function(artist) {
//     return artist.name;
// }
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

                console.log("\n-------------------------------\n");

                console.log("Date: " + form);
                console.log("Name: " + js[i].venue.name);
                console.log("City: " + js[i].venue.city);

                if (js[i].venue.region !== "") {
                    console.log("Country: " + js[i].venue.region);
                }
                console.log("Country: " + js[i].venue.country);
                console.log("\n------------------------------\n");
            }
        }
    });
};

function spotifySong(parameter) {
    var searchSong;
    if  (parameter === undefined) {
        searchSong = "The Sign Ace of Base";

    } 

    spotify.search({
        type: "track",
        query: searchSong
    },
    function(err, data) {
        if (err) {
            console.log("An error has occured: " + err);
            return;
        } 
            console.log("\n------------------------------\n");
            console.log("Artist: " + data.tracks.items[0].artist[0].name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Preview: " + data.tracks.items[3].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("\n------------------------------\n");
        
    });
};

function movieInfo(parameter) {

    var searchMovie;
    if (parameter === undefined) {
        searchMovie = "Mr. Nobody";
    } else {
        searchMovie = parameter;
    };

    var queryURL = "http://www.omdbapi.com/?=" + searchMovie + "&y=&plot=short&apikey=trilogy";

    request(queryURL,function(err, res, body) {
        var bodyOf = JSON.parse(body);
        if (!err && res.statusCode === 200) {
            console.log("\n-----------------------------\n");
            console.log("Title: " + bodyOf.Title);
            console.log("Release Year: " + bodyOf.Year);
            console.log("IMDB Rating: " + bodyOf.IMDBRating);
            console.log("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value);
            console.log("Country: " + bodyOf.Country);
            console.log("Language: " + bodyOf.Language);
            console.log("Plot: " + bodyOf.Plot);
            console.log("Actors: " + bodyOf.Actors);
            console.log("\n-----------------------------\n");
        }
    });
};

function getRandom() {
    fs.readfile("random.txt", "utf8", function(err, data) {

        if (err) {
            return console.log(err);
        }

        var dataArray = data.split(",");

        if (dataArray[0] === "spotify-this-song") {
            var  songCheck = dataArray[1].trim().slice(1, -1);
            spotifySong(songCheck);
        } else if (dataArray[0] === "concert-this") {
            if (dataArray[1].charAt(1) === "") {
                var dataLength = dataArray[1].length -1;
                var data = dataArray[1].substring(2, dataLength);
                console.log(data);
                bandsintown(data);
            } else {
                var bandName = dataArray[1].trim();
                console.log(bandName);
            }
        } else if(dataArray[0] === "movie-this") {
            var movieTitle = dataArray[1].trim().slice(1, -1);
            movieInfo(movieTitle);
        }
    });
};

function log(dataLog) {
    
    console.log(dataLog);

    fs.appendFile("log.txt", dataLog + "\n", function(err) {

        if (err) return log("There was an error logging the data: " + err);
    });
}

var select = function(action, parameter) {
    switch (action) {
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

var runLiri = function(argumentone, argumenttwo) {
    select(argumentone, argumenttwo);
}

runLiri(process.argv[2], process.argv.slice(3).join(" "));