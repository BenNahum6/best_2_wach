$(document).ready(function(){
    let urlPars = window.location.href.split('/');
    let movieId = decodeURI(urlPars[4]);
    let movieData;
    getMoviesData();

    $(".title").text("details update to movie " + movieData.name);

    $("button").click(function(){
        let clickOn = $(this).attr("id");

        if (clickOn === "return_button"){
            location.href = "/"; //closes the screen and returns to the main screen.
        }
        else
            updateData();
    });

    $("input[type=radio]").change(function () {
        if (this.value === "movie"){
            $("#series").hide();
        }else {
            $("#series").show();
        }
    });

    $("input[type=number]").change(function () {
        if (this.value < 1){
            this.value = 1;
        }
        if (this.value > 5){
            this.value = 5;
        }
    });

    console.log(movieData);
    $("#id").val(movieId);
    $("#name").val(movieData.name);
    let pictureElement = $("#picture");
    pictureElement.val(movieData.picture);
    let imgElement = $("#movie_img");
    imgElement.attr("src", movieData.picture);
    pictureElement.change(function () {
        imgElement.attr("src", pictureElement.val());
    });
    $("#director").val(movieData.director);
    $("#date").val(convertToIsoDate(convertToDate(movieData.date)));
    $("#rating").val(movieData.rating);
    if(movieData.isSeries){
        $("#series").show();
        $("input[name='isSeries']").attr("checked", "true");
        $("#series_details").val(movieData.series_details.toString().replaceAll(",", " "));
    }
    function updateData() {
        let id = movieId;
        let name = $('#name').val();
        let picture = $('#picture').val();
        let director = $('#director').val();
        let date = new Date($('#date').val());
        let rating = $('#rating').val();
        let isSeries = $("input[name='isSeries']:checked").val() === "series";
        let series_details = $('#series_details').val();


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
            alert('img url is incorrect.');
            return false;
        }

        if(director.length < 1){
            alert("The value director cannot be empty.");
            return false;
        }
        for (let i=0; i<director.length; i++){//check director name consists letters only.
            let num = director.codePointAt(i);
            if (num !== 32 && num < 65 || (90 < num && num < 97) || 122 < num){
                alert("director can only contain letters.");
                return false;
            }
        }

        if(isNaN(date.getTime())){//
            alert("The value date cannot be empty.");
            return false;
        }

        date = formatDate(date);

        if (isNaN(rating)){
            alert("Please enter valid rating (1-5)");
            return false;
        }

        if(isSeries) {
            if (series_details.length < 1){
                alert("The value series_details cannot be empty.");
                return false;
            }
            for (let i = 0; i < series_details.length; i++) {//check series_details digits only.
                let num = series_details.charAt(i);
                if (num !== ' ' && (num < '0' || '9' < num)) {
                    alert("series_details can only contain numbers");
                    return false;
                }
            }
            series_details = series_details.split(" ").map(value => parseInt(value));
        }

        $.ajax({
            type: 'PUT', //http rec
            url: '/movies/updateMovie',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": id,
                "name": name,
                "picture": picture,
                "director": director,
                "date": date,
                "rating": rating,
                "isSeries": isSeries,
                "series_details": series_details,
            }),
            processData: false,
            encode: true,
            success: function (data, textStatus, jqxhr){
                location.href = "/"; //closes the screen and returns to the main screen.
            },
            error: function (jqxhr, textStatus, err) {
                console.log(err);
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

    function formatDate(date) {
        return [
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            date.getFullYear(),
        ].join('-');
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function convertToDate(date) {
        date = date.split("-");
        return new Date(date[2], date[1], date[0]);
    }

    function convertToIsoDate(date) {
        return [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-');
    }

});
