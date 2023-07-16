$(document).ready(function() {

    $("button").click(function () {
        let clickOn = $(this).attr("id");
        console.log(clickOn);
        if (clickOn === 'submit_button') {
            validation();
        }
    });

    /*jump to main paige*/
    $('#home').click(()=>{
        $(".loader").show();
        setTimeout(function() {
            //your code to be executed after 1 second
            $(".loader").hide();
            window.location="/";
        }, 2000);
    });

    /*jump to search paige*/
    $("#search_movie_and_tv").click(function () {
        $(".loader").show();
        setTimeout(function() {
            $(".loader").hide();
            window.location="/searchMovieAndTvShow";
        }, 2000);
    });

    /*jump to main add new movie*/
    $("#add_new_movie").click(function () {
        $(".loader").show();
        setTimeout(function() {
            $(".loader").hide();
            window.location="/addNewMovie";
        }, 2000);
    });

    /*POST - check valid parameters if work do post and add movie to json file.*/
    function validation() {
        let id = $('#id').val();
        let name = $('#name').val();
        let picture = $('#picture').val();
        let director = $('#director').val();
        let date = new Date($('#date').val());
        let rating = $('#rating').val();
        let isSeries = $("input[name='isSeries']:checked").val() === "series";
        let series_details = $('#series_details').val();

        if(id.length < 1){
            alert("The value id cannot be empty");
            return false;
        }
        for (let i=0; i<id.length; i++){//check id consists of numbers and letters only.
            let num = id.codePointAt(i);
            if (num < 48 || (57 < num && num < 65) || (90 < num && num < 97) || 122 < num){
                alert("id can only contain letters and numbers");
                return false;
            }
        }

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
                alert("name can only contain letters.");
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


        //send post
        $.ajax({
            type: 'POST', //http recf
            url: '/movies',
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
                newData = data;
                console.log(data);
                $(".loader").show();
                setTimeout(function() {
                    $(".loader").hide();
                    location.href = "/"; //closes the screen and returns to the main screen.
                }, 2000);
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

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function formatDate(date) {
        return [
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            date.getFullYear(),
        ].join('-');
    }


    $("#return_button").click(function(){
        location.href = "/"; //closes the screen and returns to the main screen.
    });
    let picElement = $('#picture');
    picElement.change(function () {
        $('#actorPicture').attr("src", picElement.val());
    });

});