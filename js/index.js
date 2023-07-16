$(document).ready(function(){


    $(".parameters").hide();//automatic hiding.
    getMoviesList();
    let sortedBy = "date";
    let dataList;

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



    function convertToDate(date) {
        date = date.split("-");
        return new Date(date[2], date[1], date[0]);
    }

    function sortByDate() {
        if (sortedBy === "date"){
            dataList.reverse();
        }
        else {
            dataList = dataList.sort(function (a, b) {
                a = convertToDate(a.date).getTime();
                b = convertToDate(b.date).getTime();
                return a - b;
            });
        }
        sortedBy = "date";
        injectToTable();
    }

    function sortByRate() {
        if (sortedBy === "rate"){
            dataList.reverse();
        }
        else {
            dataList = dataList.sort(function (a, b) {
                a = a.rating;
                b = b.rating;
                return a - b;
            });
        }
        sortedBy = "rate";
        injectToTable();

    }

    function sortByName() {
        if (sortedBy === "name"){
            dataList.reverse();
        }
        else {
            dataList = dataList.sort(function (a, b) {
                a = a.name;
                b = b.name;
                return a.localeCompare(b);
            });
        }
        sortedBy = "name";
        injectToTable();
    }

    // $("button").click(function(){
    //
    //     let clickOn = $(this).attr("id");
    //
    //     if (clickOn === 'add_movie1' || clickOn === 'add_movie2'){//
    //         $(".parameters").toggle();//show / hiding.
    //         $(window).scrollTop(0);
    //     }
    //     else if(clickOn === 'submit_button'){
    //         validation();
    //     }
    // });


    $("input[type=radio]").change(function () {
        if (this.value === "movie"){
            $("#series").hide();
        }else {
            $("#series").show();
        }
    });

    $(".loader").hide();

    $("input[type=number]").change(function () {
        if (this.value < 1){
            this.value = 1;
        }
        if (this.value > 5){
            this.value = 5;
        }
    });

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

    // function isValidHttpUrl(string) {
    //     let url;
    //
    //     try {
    //         url = new URL(string);
    //     } catch (_) {
    //         return false;
    //     }
    //
    //     return true;
    // }


    function injectToTable() {
        let content = "<div class='grid'>Picture</div><div class='grid'>ID</div><div class='grid' id='nameSort'>Name  <i class='fas fa-angle-double-up'></i><i class='fas fa-angle-double-down'></i></div><div class='grid' id='rateSort'>Rating  <i class='fas fa-angle-double-up'></i><i class='fas fa-angle-double-down'></i></div><div class='grid' id='dateSort'>Date  <i class='fas fa-angle-double-up'></i><i class='fas fa-angle-double-down'></i></div><div class='grid'>Action</div>"
        dataList.forEach(function (element, index) {
            let id = element.id;
            let name = element.name;
            let picture = element.picture;
            let rating = element.rating;
            let date = element.date;
            content += "<div class='grid'><img src=\'" + picture + "\' width='150px'></div>" +
                "<div class='grid'>" + id + "</div>" +
                "<div class='grid'>" + name + "</div>" +
                "<div class='grid'>" + rating + "</div>" +
                "<div class='grid'>" + date + "</div>" +
                "<div class='grid'>" +
                "<button class='delete' name='" + element.id + "'>Delete movie</button><br><br>" +
                "<button class='edit' name='" + element.id + "' hr>Edit movie</button><br><br>" +
                "<button class='addActor' name='" + element.id + "'>Add actor</button><br><br>" +
                "<button class='showActors' name='" + element.id + "'>Show actors</button><br><br>" +
                "</div>";
        })
        $("#movies_table").html(content);

        $("#dateSort").click(function () {
            sortByDate();
        });
        $("#rateSort").click(function () {
            sortByRate();
        });
        $("#nameSort").click(function () {
            sortByName();
        });

        $(".delete").click(function () {
            $.ajax({
                type: 'DELETE', //http rec
                url: '/movies/' + this.name,//
                contentType: 'application/json',
                processData: false,
                encode: true,
                success: function (data, textStatus, jqxhr){
                    getMoviesList();
                },
                error: function (jqxhr, textStatus, err) {
                    console.log(err);
                }
            });
        });

        $(".edit").click(function () {
            window.location="/editMovie/" + this.name;
        });

        $(".addActor").click(function () {
            window.location="/AddActorToMovie/" + this.name;
        });

        $(".showActors").click(function () {
            $(".loader").show();
            let nameToPass = this.name;
            setTimeout(function() {
                //your code to be executed after 1 second
                $(".loader").hide();
                window.location="/showActors/" + nameToPass;
            }, 2000);
        });


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

    // /*POST - check valid parameters if work do post and add movie to json file.*/
    // function validation() {
    //     let id = $('#id').val();
    //     let name = $('#name').val();
    //     let picture = $('#picture').val();
    //     let director = $('#director').val();
    //     let date = new Date($('#date').val());
    //     let rating = $('#rating').val();
    //     let isSeries = $("input[name='isSeries']:checked").val() === "series";
    //     let series_details = $('#series_details').val();
    //
    //     if(id.length < 1){
    //         alert("The value id cannot be empty");
    //         return false;
    //     }
    //     for (let i=0; i<id.length; i++){//check id consists of numbers and letters only.
    //         let num = id.codePointAt(i);
    //         if (num < 48 || (57 < num && num < 65) || (90 < num && num < 97) || 122 < num){
    //             alert("id can only contain letters and numbers");
    //             return false;
    //         }
    //     }
    //
    //     if(name.length < 1){
    //         alert("The value name cannot be empty");
    //         return false;
    //     }
    //     for (let i=0; i<name.length; i++){//check name consists numbers and letters only.
    //         let num = name.codePointAt(i);
    //         if (num !== 32 && num < 48 || (57 < num && num < 65) || (90 < num && num < 97) || 122 < num){
    //             alert("name can only contain letters and numbers");
    //             return false;
    //         }
    //     }
    //
    //     if (!isValidHttpUrl(picture)){
    //         alert('img url is incorrect.');
    //         return false;
    //     }
    //
    //     if(director.length < 1){
    //         alert("The value director cannot be empty.");
    //         return false;
    //     }
    //     for (let i=0; i<director.length; i++){//check director name consists letters only.
    //         let num = director.codePointAt(i);
    //         if (num !== 32 && num < 65 || (90 < num && num < 97) || 122 < num){
    //             alert("name can only contain letters.");
    //             return false;
    //         }
    //     }
    //
    //     if(isNaN(date.getTime())){//
    //         alert("The value date cannot be empty.");
    //         return false;
    //     }
    //
    //     date = formatDate(date);
    //
    //     if (isNaN(rating)){
    //         alert("Please enter valid rating (1-5)");
    //         return false;
    //     }
    //
    //     if(isSeries) {
    //         if (series_details.length < 1){
    //             alert("The value series_details cannot be empty.");
    //             return false;
    //         }
    //         for (let i = 0; i < series_details.length; i++) {//check series_details digits only.
    //             let num = series_details.charAt(i);
    //             if (num !== ' ' && (num < '0' || '9' < num)) {
    //                 alert("series_details can only contain numbers");
    //                 return false;
    //             }
    //         }
    //         series_details = series_details.split(" ").map(value => parseInt(value));
    //     }
    //
    //
    //     //send post
    //     $.ajax({
    //         type: 'POST', //http recf
    //         url: '/movies',//
    //         contentType: 'application/json',
    //         data: JSON.stringify({
    //             "id": id,
    //             "name": name,
    //             "picture": picture,
    //             "director": director,
    //             "date": date,
    //             "rating": rating,
    //             "isSeries": isSeries,
    //             "series_details": series_details,
    //         }),
    //         processData: false,
    //         encode: true,
    //         success: function (data, textStatus, jqxhr){
    //             newData = data;
    //             console.log(data);
    //             $(".parameters").toggle();//show / hiding.
    //             getMoviesList();
    //         },
    //         error: function (jqxhr, textStatus, err) {
    //             console.log(err);
    //         },
    //     });
    // }

});
