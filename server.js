const express = require('express');
routers = require('./routers/routes');
path = require('path');
const nameToImdb = require("name-to-imdb"); //api to imdb
const app = express();
const  port = 3001;


app.use( express.static(path.join(__dirname,'/')));
app.use("/addNewMovie", express.static(path.join(__dirname,'/html/addNewMovie.html')));
app.use("/searchMovieAndTvShow", express.static(path.join(__dirname,'/html/searchMovieAndTvShow.html')));
app.use("/editMovie/:movieID", express.static(path.join(__dirname,'/html/editMovie.html')));
app.use("/AddActorToMovie/:movieID", express.static(path.join(__dirname,'/html/addActor.html')));
app.use("/showActors/:movieID", express.static(path.join(__dirname,'/html/showActors.html')));


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/',routers);

/*printing to console the port we use*/
const server = app.listen(port,()=> {
    console.log('listen on port: ', port);
});

