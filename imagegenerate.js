function generateImage(){
    var myLatlng = new google.maps.LatLng(39.307568, -76.615458);
    var mapOptions = {
        zoom: 12,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    generateMarkers(map);
}

function generateMarkers(map){
    loadMarkers_Driver(map, loadMarkers);
}

function loadMarkers_Driver(map, callback){
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        //All clear
    } else {
        alert("File APIs are not fully supported.");
        return "";
    }
    var filepath = "City_potholes.csv";

    var client = new XMLHttpRequest();
    client.open('POST', filepath, true);
    client.onreadystatechange = function() {
        if (client.readyState == 4) {
            //alert("Successfully loaded data"); //USED PRIMARILY FOR TIMING
            //alert(client.responseText); //BAAAAAD
            var clientresponse = client.responseText;
            //alert("Type of response text: " + typeof clientresponse);
            return callback.call(clientresponse, map);
        }
    }
    client.send();
}

//If the argument this looks super confusing: http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/

function loadMarkers(map){ //this refers to the clientresponse
    //alert("Running loadMarkers()");
    var color = "";
    var allEntries = this.split("\n");
    for (i = 0; i < allEntries.length; i++) { //for every line
    //for (i = 0; i < 20; i++) { //10 is max queries per second. THIS LINE FOR DEBUG
        var split = allEntries[i].split(","); //array of data fields
        //servicerequestnum,code,codeDescription,address,city,state,zip,createdDate,statusDate,status,activity,outcome,updatedDate
        if(split[9]=="NEW" || split[9]=="OPEN") {
            color = "RED";
        } else {
            color = "GREEN";
        }
        //Add latitude,longitude
        var address = split[3] + ", " + split[4] + ", " + split[5];
        //console.log(address); //these are correct
        timedCreation(map, address, color, i);
    }
    //alert("Exiting loadMarkers");
}

//10 is max queries per second. Keep that in mind!
function timedCreation(map, address, color, ID){ 
    setTimeout(function(){markerCreate(map, address, color, ID)}, 200*ID);
}

function markerCreate(map, address, color, ID){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            //alert("" + latitude + "," + longitude);
            var marker = new google.maps.Marker({
                position: {lat: latitude, lng: longitude},
                map: map,
                animation: google.maps.Animation.DROP,
                title: ID,
                label: ID
            });
            
        } else {
            //alert("Geocoder status bad - " + status); //OVER QUERY LIMIT
            console.log("Geocoder status bad - " + status); //OVER QUERY LIMIT
            callback(0, 0);
        }
    }); 
}