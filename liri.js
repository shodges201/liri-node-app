require("dotenv").config();
var fs = require("fs");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
console.log(spotify);

var option = process.argv[2];
var name = process.argv.slice(3).join(" ");

switch(option){
    case "concert-this":
        concertThis(name);
        break;
    case "spotify-this-song":
        spotifySong(name);
        break;
    case "movie-this":
        movieThis(name);
        break;
    case "do-what-it-says":
        doSays(name);
        break;
}

function concertThis(art){
    var artist = "";
    if(artist){
        artist = art;
    }
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(function(response){
        if(response.data.length > 0){
            for(var i = 0; i < response.data.length; i++){
                var item = response.data[i];
                var location = undefined;
                var date = "";
                if(item.datetime){
                    var dateList = item.datetime.split("T")[0].split("-");
                    date = dateList[1] + "/" +  dateList[2] + "/" + dateList[0];
                }
                if(item.venue.city){
                    location = item.venue.city;
                }
                if(item.venue.region){
                    if(location){
                        location += ", " + item.venue.region;
                    }
                    else{
                        location = item.venue.city;
                    }
                }
                if(item.venue.country){
                    if(location){
                        location += ", " + item.venue.country;
                    }
                    else{
                        location = item.venue.country;
                    }
                }
                console.log("------------------ Event " + i + " ------------------")
                console.log("Venue: " + item.venue.name);
                console.log("Venue location: " + location);
                console.log("Date: " + date)
            }
            //console.log(JSON.stringify(response.data));
        }
        else{
            console.log("---------------------------No Events To Show!---------------------------")
        }
    })
}

function spotifySong(s){
    var song = "The Sign";
    if(s){
        song = s;
    }
    
    spotify.search({type: "track", query: song, limit:5}).then(function(response){
        for(var i = 0; i < response.tracks.items.length; i++){
            console.log("--------------------------"+ "song " + ((parseInt(i))+ 1) + "--------------------------")
            //console.log(JSON.stringify(response.tracks.items[i], null, 2));
            console.log("arists:");
            for(var j = 0; j < response.tracks.items[i].artists.length; j++){
                console.log("artist " + (j+1) + ": " + response.tracks.items[i].artists[j].name);
            }
            console.log("song name: " + response.tracks.items[i].name);
            console.log("preview url: " + response.tracks.items[i].preview_url);
            console.log("album name: " + response.tracks.items[i].album.name)
        }
    })
}

function movieThis(m){
    var movieName = "Mr.Robot";
    if(m){
        movieName = m;
    }
    console.log(movieName);
    console.log("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy");
    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy")
    .then(function(response){
        console.log(JSON.stringify(response.data, null, 2));
        console.log("Title: " + response.data.Title);
        console.log("Release Year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);
        var rt = false;
        for(var i = 0; i < response.data.Ratings.length; i++){
            if(response.data.Ratings[i].Source === "Rotten Tomatoes"){
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                rt = true;
            }
        }
        if(!rt){
            console.log("Rotten Tomatoes Rating: " + "none available");
        }
        console.log("Country/Countries: " + response.data.Country);
        console.log("Language(s): " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("actors: " + response.data.Actors);
    })

}

function doSays(){
    fs.readFile("random.txt", "utf8", function(err, data){
        var items = data.split(",");
        var opt = items[0];
        var search = items.slice(1).join(" ");
        switch(opt){
            case "concert-this":
                concertThis(search);
                break;
            case "spotify-this-song":
                spotifySong(search);
                break;
            case "movie-this":
                movieThis(search);
                break;
        }
    })
}
