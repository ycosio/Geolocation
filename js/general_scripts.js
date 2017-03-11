$( function() {

  } );

window.onload = getMyLocation;

var WickedlySmart = {
 latitude: 47.624851,
 longitude: -122.52099
};

var Nigeria = {
 latitude: 8.0000000,
 longitude: 10.0000000
};

var map;

function addMarker(map, latlong, title, content) {
	var markerOptions = {
		position: latlong,
		map: map,
		title: title,
		clickable: true
	};

	var marker = new google.maps.Marker(markerOptions);

	var infoWindowOptions = {
		content: content,
		position: latlong
	};

	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

	google.maps.event.addListener(marker, "click", function() {
	infoWindow.open(map);
	});
}

function showMap(coords) {
	var googleLatAndLong = new google.maps.LatLng(coords.latitude,coords.longitude);
	var mapProp= {
	    center: googleLatAndLong,
	    zoom: 2,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map=new google.maps.Map(document.getElementById("map"),mapProp);

	var title = "Your Location";
	var content = "You are here: " + coords.latitude + ", " + coords.longitude;
	addMarker(map, googleLatAndLong, title, content);

	googleLatAndLong = new google.maps.LatLng(WickedlySmart.latitude,WickedlySmart.longitude);
	title = "WickedlySmart";
	content = "WickedlySmart: " + WickedlySmart.latitude + ", " + WickedlySmart.longitude;
	addMarker(map, googleLatAndLong, title, content);

	googleLatAndLong = new google.maps.LatLng(Nigeria.latitude,Nigeria.longitude);
	title = "Nigeria";
	content = "Nigeria: " + Nigeria.latitude + ", " + Nigeria.longitude;
	addMarker(map, googleLatAndLong, title, content);
}

function displayLocation(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var div = document.getElementById("location");
	div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;

	showMap(position.coords);
}

function getMyLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(displayLocation);
	} else {
		alert("Oops, no geolocation support");
	}
}




