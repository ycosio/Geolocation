$(function() {

});

window.onload = getMyLocation;

//First static place
var WickedlySmart = {
    latitude: 47.624851,
    longitude: -122.52099
};

//Second static place
var Nigeria = {
    latitude: 8.0000000,
    longitude: 10.0000000
};
var markerByUser = [];
var map, count = 0;
var audio= new Audio("assets/listen.mp3");
var id = 1;

//Showing the marker for positions
function addMarker(map, latlong, title, content) {
    var googleLatAndLong = new google.maps.LatLng(latlong.latitude, latlong.longitude);
    var markerOptions = {
        position: googleLatAndLong,
        map: map,
        label: id.toString(),
        title: title,
        clickable: true
    };

    var marker = new google.maps.Marker(markerOptions);

    var infoWindowOptions = {
        content: content,
        position: googleLatAndLong
    };

    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

    google.maps.event.addListener(marker, "click", function() {
      audio.play();
      infoWindow.open(map);
    });
    id++;
}

//Showing the map
function showMap(coords) {
    var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);
    var mapProp = {
        center: googleLatAndLong,
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapProp);

    //Adding tne markers
    var content = "Your Location: " + coords.latitude + ", " + coords.longitude;
    addMarker(map, coords, "Your Location", content);
    upload(content);

    content = "WickedlySmart: " + WickedlySmart.latitude + ", " + WickedlySmart.longitude;
    addMarker(map, WickedlySmart, "WickedlySmart", content);

    content = "Nigeria: " + Nigeria.latitude + ", " + Nigeria.longitude;
    addMarker(map, Nigeria, "Nigeria", content);
    //To add Marker anywhere
    map.addListener('click', function(e) {
        if (count < 6) {
            audio.play();
            var content = "Your Marker: " + e.latLng.lat() + ", " + e.latLng.lng();
            addMarker(map, {
                latitude: e.latLng.lat(),
                longitude: e.latLng.lng()
            }, "Your Marker " + (count + 4), content);
            markerByUser.push([(count + 4).toString(), {
                latitude: e.latLng.lat(),
                longitude: e.latLng.lng()
            }]);
            count++;
            PushDistances();
        } else {
            alert("Can't add more markers!");
        }

    });
}
// Get distance between points

function degreesToRadians(degrees) {
    var radians = (degrees * Math.PI) / 180;
    return radians;
}

function computeDistance(startCoords, destCoords) {
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads = degreesToRadians(startCoords.longitude);
    var destLatRads = degreesToRadians(destCoords.latitude);
    var destLongRads = degreesToRadians(destCoords.longitude);
    var Radius = 6371; // radius of the Earth in km
    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
        Math.cos(startLatRads) * Math.cos(destLatRads) *
        Math.cos(startLongRads - destLongRads)) * Radius;
    return distance;
}

function displayLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var div = document.getElementById("location");
    div.innerHTML = "Your coordinates</br>Latitude: " + latitude + "</br> Longitude: " + longitude;
    markerByUser.push(["You", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }]);
    markerByUser.push(['WickedlySmart HQ', WickedlySmart]);
    markerByUser.push(['Nigeria', Nigeria]);

    PushDistances();
    //Adding the distance among all positions
    /*  var km = computeDistance(position.coords, WickedlySmart);
      div = document.getElementById("P1-P2");
      div.innerHTML = "</br>Distances </br>You - WickedlySmart HQ:</br> " + km + " km";

      km = computeDistance(position.coords, Nigeria);
      div = document.getElementById("P1-P3");
      div.innerHTML = "You - Nigeria</br>  " + km + " km";

      km = computeDistance(Nigeria, WickedlySmart);
      div = document.getElementById("P2-P3");
      div.innerHTML = "Nigeria - WickedlySmart HQ:</br>  " + km + " km";*/
    showMap(position.coords);
}

function getMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocation);
    } else {
        alert("Oops, no geolocation support");
    }
}

function PushDistances(){
  var DistanceLabel = "<tr><th>Marker</th><th>To marker</th><th>Distance</th></tr>";
  for (var pointA = 0; pointA < markerByUser.length; pointA++) {
      for (var pointB = pointA + 1; pointB < markerByUser.length; pointB++) {
          DistanceLabel += "<tr><td>" + markerByUser[pointA][0] + "</td><td>" + markerByUser[pointB][0] + "</td><td>" + computeDistance(markerByUser[pointA][1], markerByUser[pointB][1]).toFixed(3) + "Km</td></tr>";
      }
  }
  div = document.getElementById("table");
  div.innerHTML = DistanceLabel;
}

//----------------------------------------------Firebase Scripts----------------------------------------------------------//


function upload(locale) {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCZxv8sG7abRmj-NKC7_VtjzgnK87r3SI0",
        authDomain: "geolocation-beab5.firebaseapp.com",
        databaseURL: "https://geolocation-beab5.firebaseio.com",
        storageBucket: "geolocation-beab5.appspot.com",
        messagingSenderId: "1005054328238"
    };
    firebase.initializeApp(config);

    var storage = firebase.storage();
    var storageRef = storage.ref();

    var mblob = new Blob([locale], { type: 'text/plain' });
    var textFile= new File([mblob],locale,{ type: 'text/plain' })


    // Create the file metadata
    var metadata = {
        contentType: 'text/plain'
    };

    if (textFile)
    // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child(textFile.name).put(textFile, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },
        function(error) {
            switch (error.code) {
                case 'storage/unauthorized':
                    console.log("User doesn't have permission to access the object");
                    break;

                case 'storage/canceled':
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        function() {
            // Upload completed successfully, now we can get the download URL
            var downloadURL = uploadTask.snapshot.downloadURL;
        });
}
