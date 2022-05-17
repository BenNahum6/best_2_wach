$(document).ready(function(){
    // getMoviesList();
    let urlPars = window.location.href.split('/');
    let movieId = decodeURI(urlPars[4]);
    console.log("id is: " + movieId);
    updateData();

    $("button").click(function(){
        updateData();
    });



    function updateData() {
        let id = movieId;
        let name = $('#name').val();
        let picture = $('#picture').val();
        let director = $('#director').val();
        let date = new Date($('#date').val());
        let rating = $('#rating').val();
        let isSeries = $("input[name='isSeries']:checked").val() === "series";
        let series_details = $('#series_details').val();

        if (name){
            for (let i=0; i<name.length; i++){//check name consists numbers and letters only.
                let num = name.codePointAt(i);
                if (num !== 32 && num < 48 || (57 < num && num < 65) || (90 < num && num < 97) || 122 < num){
                    alert("name can only contain letters and numbers");
                    return false;
                }
            }
        }

        if (picture){
            if (!isValidHttpUrl(picture)){
                alert('img url is incorrect.');
                return false;
            }
        }

        if(director){
            for (let i=0; i<director.length; i++){//check director name consists letters only.
                let num = director.codePointAt(i);
                if (num !== 32 && num < 65 || (90 < num && num < 97) || 122 < num){
                    alert("name can only contain letters.");
                    return false;
                }
            }
        }

        if(!date){
            date = formatDate("date: " + date);

            if(isNaN(date.getTime())){//todo
                alert("The value date cannot be empty.");
                return false;
            }
        }

        if(rating){
            if (isNaN(rating)){
                alert("Please enter valid rating (1-5)");
                return false;
            }
        }

        if(isSeries) {
            for (let i = 0; i < series_details.length; i++) {//check series_details digits only.
                let num = series_details.charAt(i);
                if (num !== ' ' && (num < '0' || '9' < num)) {
                    alert("series_details can only contain numbers and spase");
                    return false;
                }
            }
            series_details = series_details.split(" ").map(value => parseInt(value));
        }

        // $.ajax({
        //     type: 'PUT', //http rec
        //     url: '/movies/updateMovie',
        //     contentType: 'application/json',
        //     data: JSON.stringify({
        //         "name": name,
        //         "picture": picture,
        //         "director": director,
        //         "date": date,
        //         "rating": rating,
        //         "isSeries": isSeries,
        //         "series_details": series_details,
        //     }),
        //     processData: false,
        //     encode: true,
        //     success: function (data, textStatus, jqxhr){
        //         location.href = "/"; //closes the screen and returns to the main screen.
        //     },
        //     error: function (jqxhr, textStatus, err) {
        //         console.log(err);
        //     },
        // });
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
});
