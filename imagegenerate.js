function generateImage(){
    var myLatlng = new google.maps.LatLng(39.325993, -76.617613);
    var mapOptions = {
        zoom: 12,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    /*var oImg = document.createElement('img');
    var src = "https://maps.googleapis.com/maps/api/staticmap?center=3100+N+Charles+Street,Baltimore,MD&zoom=12&scale=2&size=640x640&maptype=terrain";
    src = src.concat(loadMarkers_Driver(loadMarkers));
    //Append the API Key to src
    src = src.concat("&key=AIzaSyDgLXdj8luOqkLNnUw7WxBgkBphAPD8JbE");
    oImg.setAttribute('src', src);
    oImg.setAttribute('alt', 'na');
    oImg.setAttribute('height', '1280');
    oImg.setAttribute('width', '1280');
    document.body.appendChild(oImg);*/
}

function loadMarkers_Driver(callback){
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
            alert("Successfully loaded data");
            //alert(client.responseText); //BAAAAAD
            var clientresponse = client.responseText;
            //alert("Type of response text: " + typeof clientresponse);
            return callback.call(clientresponse);
            //Apparently client.responseText is undefined
        }
    }
    client.send();
}

//If the argument this looks super confusing: http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/

function loadMarkers(){
    //alert("Running loadMarkers()");
    //alert("Type of response text: " + typeof this);
    var returnString = "";
    var allEntries = this.split("\n");
    //for (i = 0; i < allEntries.length; i++) { //for every line
    for (i = 0; i < 5; i++) {
        var split = allEntries[i].split(","); //array of data fields
        //servicerequestnum,code,codeDescription,address,city,state,zip,createdDate,statusDate,status,activity,outcome,updatedDate
        returnString = returnString.concat("&markers=color:")
        if(split[9]=="NEW" || split[9]=="OPEN") {
            returnString = returnString.concat("red")
        } else {
            returnString = returnString.concat("green")
        }
        returnString = returnString.concat("%7Clabel:" + i + "%7C")
        //Add latitude,longitude
        var address = split[3];
        //console.log(address); //these are correct
        geocoderUse(address, function(a, b){returnString = returnString.concat("" + a + "," + b);});
    }
    alert("Successfully loaded all markers");
    console.log(returnString);
    return returnString;
}

function geocoderUse(address, callback){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            //alert("" + latitude + "," + longitude);
            callback(latitude, longitude);
        } else {
            alert("Geocoder status bad - " + status); //OVER QUERY LIMIT
            callback(0, 0);
        }
    }); 
}