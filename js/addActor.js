$(document).ready(function(){
    let urlPars = window.location.href.split('/');
    let movieId = decodeURI(urlPars[4]);
    console.log("id is: " + movieId);


    function validation() {
        let name = $('#name').val();
        let picture = $('#picture').val();
        let site = $('#site').val();


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
                console.log(err);
            },
        });
    }

});
