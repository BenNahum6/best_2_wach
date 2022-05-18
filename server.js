const express = require('express');
routers = require('./routers/routes');
path = require('path');
const app = express();
const  port = 3001;


app.use( express.static(path.join(__dirname,'/')));
app.use("/editMovie/:movieID", express.static(path.join(__dirname,'/html/editMovie.html')));
app.use("/AddActorToMovie/:movieID", express.static(path.join(__dirname,'/html/addActor.html')));
app.use("/showActors/:movieID", express.static(path.join(__dirname,'/html/showActors.html')));


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/',routers);

const server = app.listen(port,()=> {
    console.log('listen on port: ', port);
});