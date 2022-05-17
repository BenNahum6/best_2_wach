const fs = require("fs");
const dataPath = './data/Movies.json';

const readFile =(callback, returnJson = false, filepath = dataPath, encoding = 'utf8') => {
    fs.readFile(filepath,encoding,(err, data) => {
        if (err){
            console.log(err);
        }
        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
    fs.writeFile(filePath, fileData, encoding, (err)=>{
        if(err){
            console.log(err);
        }
        callback();
    });
};

/*Checks that the id and rating  correct. return true if correct*/
function checkValid(req){
    let params = req.body;
    for (let i=0; i<params.id.length; i++){//check id consists of numbers and letters only.
        let num = params.id.codePointAt(i);
        if (num < 48 || (57 < num && num < 65) || (90 < num && num < 97) || 122 < num){
            return false;
        }
    }
    if (params.rating < 1 || params.rating > 5){
        return false;
    }

    return true;
}

/*checks the name of the actor received in the URL. return true if The input is correct*/
function checkActorNameUrl(req){
    let name = req.params.actorName;
    for (let i=0; i<name.length; i++){//check name consists numbers and letters only.
        let num = name.codePointAt(i);
        if (num < 65 || (90 < num && num < 97) || 122 < num){
            return false;
        }
    }
    return true;
}

/*update specific parameters. return json object*/
function updateParameters(data, req){
    let body = req.body;
    if (body.name) {
        console.log("update name from: '" + data[req.body.id].name + "' to: '" + body.name + "'.");
        data[body.id].name = body.name;
    }
    if (body.picture){
        console.log("update picture from: '" + data[req.body.id].picture + "' to: '" + body.picture + "'.");
        data[body.id].picture = body.picture;
    }
    if (body.director){
        console.log("update director from: '" + data[req.body.id].director + "' to: '" + body.director + "'.");
        data[body.id].director = body.director;
    }
    if (body.date){
        console.log("update date from: '" + data[req.body.id].date + "' to: '" + body.date + "'.");
        data[body.id].date = body.date;
    }
    if (body.rating){
        if (!checkValid(req)){
            console.log("rating not update - rating should be between 1 to 5.");
        }
        else {
            console.log("update rating from: '" + data[req.body.id].rating + "' to: '" + body.rating + "'.");
            data[body.id].rating = body.rating;
        }
    }
    if (body.isSeries || !body.isSeries){
        if (!data[body.id].isSeries && body.isSeries){//If it's become a series then add series_details.
            data[body.id]["series_details"] = [];
        }
        if (data[body.id].isSeries && !body.isSeries){//If it's become a movie then delete it series_details.
            delete data[body.id].series_details;
        }

        console.log("update name isSeries: '" + data[req.body.id].isSeries + "' to: '" + body.isSeries + "'.");
        data[body.id].isSeries = body.isSeries;

    }
    if (data[body.id].isSeries && body.series_details){
        console.log("update name series_details: '" + data[req.body.id].series_details + "' to: '" + body.series_details + "'.");
        data[body.id].series_details = body.series_details;
    }
    return data;
}

/*checks the name of the actor received. return true if The input is correct*/
function checkActorName(req){
    let name = req.body.actors.name;
    for (let i=0; i<name.length; i++){//check actor name consists of letters and space only.
        let num = name.codePointAt(i);
        if (num !== 32 && num < 65 || (90 < num && num < 97) || 122 < num){
            return false;
        }
    }
    return true;
}

/*creates a new actor and insert the new actor to the movie. return json object.*/
function addActorToMovie(data, req, i){
    let id = req.body.id;
    let actor = req.body.actors;
    let newActor = "actor_" + i + "_name";
    data[id].actors[newActor] = {};
    data[id].actors[newActor].name = actor.name;
    data[id].actors[newActor].picture = actor.picture;
    data[id].actors[newActor].site = actor.site;

    return data;
}

/*equation of dates and returns true if d1 is less than d2*/
function comperDate(d1, d2) {
    //check years.
    let line = 0, index = 0;
    let year1 = [0,0,0,0];
    let year2 = [0,0,0,0];
    for (let i=0; i<d1.length; i++){
        if (d1[i] === '-'){
            line ++;
            continue;
        }
        if (line === 2){
            year1[index] = d1[i];
            index++;
        }
    }
    line = 0;
    index = 0;
    for (let i=0; i<d2.length; i++){
        if (d2[i] === '-'){
            line ++;
            continue;
        }
        if (line === 2){
            year2[index] = d2[i];
            index++;
        }
    }
    let resultYear1 = year1.map(function (x) {
        return parseInt(x, 10);
    });
    let resultYear2 = year2.map(function (x) {
        return parseInt(x, 10);
    });
    if(resultYear1 < resultYear2)
        return true;

    //check months.
    line = 0;
    index = 0;
    let month1 = [0,0];
    let month2 = [0,0];
    for (let i=0; i<d1.length; i++){
        if (d1[i] === '-'){
            line ++;
            continue;
        }

        if (line === 2){
            break;
        }

        if (line === 1){
            month1[index] = d1[i];
            index++;
        }
    }
    line = 0;
    index = 0;
    for (let i=0; i<d2.length; i++){
        if (d2[i] === '-'){
            line ++;
            continue;
        }
        if (line === 2){
            break;
        }
        if (line === 2){
            month2[index] = d2[i];
            index++;
        }
    }

    let resultMonth1 = month1.map(function (x) {
        return parseInt(x, 10);
    });
    let resultMonth2 = month2.map(function (x) {
        return parseInt(x, 10);
    });
    if(resultMonth1 < resultMonth2)
        return true;

    //check days.
    line = 0;
    index = 0;
    let day1 = [0,0];
    let day2 = [0,0];
    for (let i=0; i<d1.length; i++){
        if (d1[i] === '-'){
            break;
        }
        month1[index] = d1[i];
        index++;
    }

    index = 0;
    for (let i=0; i<d2.length; i++){
        if (d2[i] === '-'){
            break;
        }
        month2[index] = d2[i];
        index++;
    }

    let resultDay1 = day1.map(function (x) {
        return parseInt(x, 10);
    });
    let resultDay2 = day2.map(function (x) {
        return parseInt(x, 10);
    });
    if(resultDay1 < resultDay2)
        return true;

    return false;//if the date1 is biger then datw2.
}

/*check input test of: isSeries, name, director and date. return true if The input is correct */
function checkDetails(req){
    let t = 'true', f = 'false';
    if((req.body.isSeries !== true  && req.body.isSeries !== false) && (req.body.isSeries !== t  && req.body.isSeries !== f)) {//check isSeries consists true or false only.
        console.log("The isSeries is incorrect.");
        return false;
    }

    let movieName = req.body.name;
    for (let i=0; i<movieName.length; i++){//check movie name consists letters, numbers and space only.
        let num = movieName.codePointAt(i);
        if (num !== 32 && num<48 || (57 < num && num < 65) || (90 < num && num < 97) || 122 < num){
            console.log("The movie name is incorrect.");
            return false;
        }
    }

    let director = req.body.director;
    for (let i=0; i<director.length; i++){//check director name consists letters only.
        let num = director.codePointAt(i);
        if (num !== 32 && num < 65 || (90 < num && num < 97) || 122 < num){
            console.log("The director name is incorrect.");
            return false;
        }
    }

    let date = req.body.date;// dd/mm/yyyy
    if(date.length < 10 || 10 < date.length){
        console.log("The date is incorrect.");
        return false;
    }
    for (let i=0; i<date.length; i++){//check date consists numbers and '-' only.
        let num = date.codePointAt(i);
        if (num !== 45 && !(47 < num && num < 58)){
            console.log("The date is incorrect.");
            return false;
        }
        if(i===0 || i===1 || i===3 || i===4 || i===6 || i===8 || i===7 || i===9){
            if(!(47 < num && num < 58)){
                console.log("The date is incorrect.");
                return false;
            }
        }
        else{
            if(num !== 45){
                console.log("The date is incorrect.");
                return false;
            }
        }
    }

    return true;
}

module.exports = {

    /*POST - create new movie*/
    CreateMovie: function (req, res) {
        readFile(data => {
                console.log(req.body);
                let t = true;
                let actors = {};
                if (data[req.body.id]) {//checks if id already exists in json file.
                    res.status(400).send("movie or tv series with id '" + req.body.id + "' already exists!");
                    return;
                } else if (checkValid(req) === false) {
                    res.status(400).send("id must contain only letters and numbers. The rating should be between 1 and 5.");
                    return;
                }
                else if(!checkDetails(req)){
                    res.status(400).send("one or more details are incorrect'.");
                    return;
                }
                else if (req.body.isSeries === "true" || req.body.isSeries=== true) {// TV series.
                    if (!req.body.id || !req.body.name || !req.body.picture || !req.body.director || !req.body.date, !req.body.rating, !req.body.isSeries, !req.body.series_details) {//checks that the important parameters are present.
                        res.status(400).send("missing data. id and TV series name are mandatory!");
                        return;
                    }
                    if(req.body.isSeries === "true") {
                        const usingSplit = req.body.series_details.split(',');
                        data[req.body.id] = {"id": req.body.id, "name": req.body.name, "picture": req.body.picture, "director": req.body.director, "date": req.body.date, "rating": req.body.rating, "isSeries": req.body.isSeries, "series_details": usingSplit, "actors" : actors};//ensures that only these parameters are met.
                    }
                    else {
                        data[req.body.id] = {"id": req.body.id, "name": req.body.name, "picture": req.body.picture, "director": req.body.director, "date": req.body.date, "rating": req.body.rating, "isSeries": req.body.isSeries, "series_details": req.body.series_details, "actors" : actors};//ensures that only these parameters are met.
                    }
                }
                else {// movie.
                    if (!req.body.id || !req.body.name || !req.body.picture || !req.body.director || !req.body.date, !req.body.rating, req.body.isSeries !=="false" && req.body.isSeries !== false) {//checks that the important parameters are present.
                        res.status(400).send("missing data. id and movie name are mandatory! 316");
                        return;
                    }
                    data[req.body.id] = {"id": req.body.id, "name": req.body.name, "picture": req.body.picture, "director": req.body.director, "date": req.body.date, "rating": req.body.rating, "isSeries": req.body.isSeries, "actors" : actors};//ensures that only these parameters are met.
                }

                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send('new movie created.');
                });
            },
            true);
    },

    /*PUT - update the details of the movie without the movie ID and actors names*/
    updateMovie: function (req, res) {
        readFile(data => {
                // console.log(req.body);
                if (!data[req.body.id]) {//checks if id not exists in json file.
                    res.status(400).send("movie with id " + req.body.id + " not exists!");
                }
                else {
                    let updateData = updateParameters(data, req);
                    writeFile(JSON.stringify(updateData, null, 2), () => {
                        res.status(200).send('movie update.');
                    });
                }
            },
            true);
    },

    /*PUT - */
    AddActorToMovie: function (req, res) {
        readFile(data => {
                // console.log(req.body);
                if (!data[req.body.id]) {//checks if id not exists in json file.
                    res.status(400).send("movie with id " + req.body.id + " not exists!");
                }
                else if (!checkActorName(req)){
                    res.status(400).send("The actor name can only contain letters. ");
                }
                else {
                    let numOfActors = Object.keys(data[req.body.id].actors).length + 1;
                        for (let i = 1; i < numOfActors; i++) {
                            let x = "actor_" + i + "_name";
                            if (data[req.body.id].actors[x].name === req.body.actors.name) {
                                res.status(400).send("The actor '" + req.body.actors.name + "' is already appearing in the movie.");
                                return;
                            }
                        }
                        let updateData = addActorToMovie(data, req, numOfActors);
                        writeFile(JSON.stringify(updateData, null, 2), () => {
                            res.status(200).send('add the actor ' + req.body.actors.name + ' to movie ' + data[req.body.id].name + ' update.');
                        });
                }

            },
            true);
    },

    /*GET - get details on the specific movie*/
    getMovie: function (req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                let parsData = JSON.parse(data);
                if (!parsData[req.params.movieID]) {//checks if id not exists in json file.
                    res.status(400).send("movie or tv series with id " + req.params.movieID + " not exists!");
                }
                else {
                    res.send(parsData[req.params.movieID]);
                }
            }
        });
    },

    /*GET - get all movies by release date from new to old*/
    getMovies: function (req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                let parsData = JSON.parse(data);
                let x = Object.keys(parsData).sort((a, b) => b.id - a.id);//returns an array of all keys sorted.

                let arrayData = [];
                for (let i=0; i<x.length; i++){
                    arrayData.push(parsData[x[i]]);
                }

                for (let k = 0; k < x.length; k++){
                    for (let j= k + 1; j < x.length; j++) {
                        if(comperDate(arrayData[k].date, arrayData[j].date)){
                            let temp = arrayData[k];
                            arrayData[k] = arrayData[j];
                            arrayData[j] = temp;
                        }
                    }
                }

                res.status(200).send(arrayData);
            }
        });
    },

    /*DELETE - */
    deleteActorFromMovie:function (req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                console.log(req.params);
                let parsData = JSON.parse(data);
                if (!parsData[req.params.movieID]) { //checks if id not exists in json file.
                    res.status(400).send("movie or tv series with id " + req.params.movieID + " not exists!");
                }
                else if (!checkActorNameUrl(req)) { //check if the name is correct.
                    res.status(400).send("The actor name can only contain normal characters and space.");
                }
                else {
                    let i = 1;
                    try {
                        for (; i < 10000; i++) {
                            let x = "actor_" + i + "_name";
                            console.log(x + " = " + parsData[req.params.movieID].actors[x].name);
                            if (parsData[req.params.movieID].actors[x].name === req.params.actorName) {
                                delete parsData[req.params.movieID].actors[x];
                                writeFile(JSON.stringify(parsData, null, 2), () => {
                                    res.status(200).send('movie deleted successfully.');
                                });
                                break;
                            }
                        }
                    }
                    catch (error){
                        res.status(400).send("The actor '" + req.params.actorName + "' not appearing in the movie.");
                    }
                }
            }
        });
    },

    /*DELETE - deletes the movie from the Json file*/
    deleteMovie: function (req,res){
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                let parsData = JSON.parse(data);
                if (!parsData[req.params.movieID]) {//checks if id not exists in json file.
                    res.status(400).send("movie or tv series with id '" + req.params.movieID + "' not exists!");
                }
                else {
                    console.log(parsData);
                    delete parsData[req.params.movieID];
                    writeFile(JSON.stringify(parsData, null, 2), () => {
                        res.status(200).send('deleted successfully.');
                    });
                }
            }
        });
    }

}

