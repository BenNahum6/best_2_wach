$(document).ready(function(){
    let urlPars = window.location.href.split('/');
    let movieId = decodeURI(urlPars[4]);
    console.log("id is: " + movieId);
    let dataList;
    getMoviesList();

    // console.log(Object.keys(dataList[movieId].actors.length));

    function injectToTable() {

        let content = "<div class='grid'>Picture</div><div class='grid'>Name</div><div class='grid'>site</div><div class='grid'>Action</div>"
        dataList.forEach(function (element, index) {
            let name = element[movieId].actors[index].name;
            let picture = element[movieId].actors[index].picture;
            let site = element[movieId].actors[index].site;
            content += "<div class='grid'><img src=\'" + picture + "\' width='150px'></div>" +
                "<div class='grid'>" + name + "</div>" +
                "<div class='grid'>" + site + "</div>" +
                "<div class='grid'>" +
                "<button class='delete' name='" + element.id + "'>Delete movie</button><br><br>" +
                "</div>";
        })
        $("#actors_table").html(content);


        // $(".delete").click(function () {
        //     $.ajax({
        //         type: 'DELETE', //http rec
        //         url: '/movies/' + this.name + '/actor/' + this.,
        //         contentType: 'application/json',
        //         processData: false,
        //         encode: true,
        //         success: function (data, textStatus, jqxhr){
        //             injectToTable();
        //         },
        //         error: function (jqxhr, textStatus, err) {
        //             console.log(err);
        //         }
        //     });
        // });
    }

    /*GET - get all movie*/
    function getMoviesList(){
        $.ajax({
            type: 'GET', //http rec
            url: '/movies',//
            contentType: 'application/json',
            processData: false,
            encode: true,
            success: function (data, textStatus, jqxhr){
                dataList = data;
                injectToTable();
            },
            error: function (jqxhr, textStatus, err) {
                console.log(err);
            },
        });
    }


});
