
$(document).ready(function() {

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


    $("#bbb").click(function () {
        let name = $(this).attr("id");
        // console.log(name);
        // let name = $('#name').val();
        getMovieFromIMDB(name);
    });

    function getMovieFromIMDB(name){
        $.ajax({
            type: 'POST', //http recf
            url: '/searchMovieAndTvShow',
            contentType: 'application/json',
            data: JSON.stringify({
                "name": name,
            }),
            processData: false,
            encode: true,
            success: function (data, textStatus, jqxhr){
                console.log(data.meta.name);
            },
            error: function (jqxhr, textStatus, err) {
                console.log(err);
            },
        });
    }

});