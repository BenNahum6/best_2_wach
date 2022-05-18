$(document).ready(function(){
    let urlPars = window.location.href.split('/');
    let movieId = decodeURI(urlPars[4]);
    let movieData;
    getMoviesData();//GET req

    $(".title").text("all the actor shows in the movie " + movieData.name);

    injectToTable();

    function injectToTable() {
        let content = "<div class='grid'>Picture</div><div class='grid'>Name</div><div class='grid'>site</div><div class='grid'>Action</div>"
        movieData.actors = Object.values(movieData.actors);
        movieData.actors.forEach(function (element) {
            let name = element.name;
            let picture = element.picture;
            let site = element.site;
            content +=
                "<div class='grid'><img src=\'" + picture + "\' width='150px'></div>" +
                "<div class='grid'>" + name + "</div>" +
                "<a class='grid' href='"+ site +"'> " + site + "</a>" +
                "<div class='grid'>" +
                "<button class='delete' name='" + element.name + "'>Delete movie</button><br><br>" +
                "</div>";
        });
        $("#actors_table").html(content);


        $(".delete").click(function () {
            $.ajax({
                type: 'DELETE', //http rec
                url: '/movies/' + movieData.id + '/actor/' + this.name,
                contentType: 'application/json',
                processData: false,
                encode: true,
                success: function (data, textStatus, jqxhr){
                    console.log(textStatus);
                    getMoviesData();
                    injectToTable();
                },
                error: function (jqxhr, textStatus, err) {
                    console.log(err);
                }
            });
        });
    }

    /*GET - get all movie*/
    function getMoviesData(){
        $.ajax({
            type: 'GET', //http rec
            url: '/movies',//
            contentType: 'application/json',
            processData: false,
            encode: true,
            async: false,
            success: function (data, textStatus, jqxhr){
                movieData = data.find(function (element) {
                    return element.id === movieId;
                });
            },
            error: function (jqxhr, textStatus, err) {
                console.log(err);
            },
        });
    }

    $("#return_button").click(function(){
        location.href = "/"; //closes the screen and returns to the main screen.
    });
});
