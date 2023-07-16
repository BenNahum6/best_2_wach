$(document).ready(function(){
    let urlPars = window.location.href.split('/');
    let movieId = decodeURI(urlPars[4]);
    let movieData;
    getMoviesData();
    $(".title").text("add actor to the movie " + movieData.name);

    $("button").click(function(){
        let clickOn = $(this).attr("id");

        if (clickOn === "return_button")
            location.href = "/"; //closes the screen and returns to the main screen.
        else
            validation();
    });

    $("#return_button").click(function(){
        location.href = "/"; //closes the screen and returns to the main screen.
    });
    let picElement = $('#picture');
    picElement.change(function () {
        $('#actorPicture').attr("src", picElement.val());
    });
    function validation() {
        let id = movieId;
        let name = $('#name').val();
        let picture = $('#picture').val();
        let site = $('#fanSite').val();


        if(name.length < 1){
            alert("The value name cannot be empty");
            return false;
        }
        for (let i=0; i<name.length; i++){//check name consists numbers and letters only.
            let num = name.codePointAt(i);
            if (num !== 32 && num < 48 || (57 < num && num < 65) || (90 < num && num < 97) || 122 < num){
                alert("name can only contain letters and numbers");
                return false;
            }
        }


        if (!isValidHttpUrl(picture)){
            alert('picture url is incorrect.');
            return false;
        }

        if (!isValidHttpUrl(site)){
            alert('site url is incorrect.');
            return false;
        }



        //send PUT
        $.ajax({
            type: 'PUT', //http rec
            url: '/movies/AddActorToMovie',//
            contentType: 'application/json',
            data: JSON.stringify({
                "id": id,
                "name": name,
                "picture": picture,
                "site": site,
            }),
            processData: false,
            encode: true,
            success: function (data, textStatus, jqxhr){
                console.log(data);
                location.href = "/"; //closes the screen and returns to the main screen.

            },
            error: function (jqxhr, textStatus, err) {
                alert(jqxhr.responseText);
                console.log(jqxhr.responseText);
            },
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


    function isValidHttpUrl(string) {
        let url;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return true;
    }

});
