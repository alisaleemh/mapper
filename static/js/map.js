function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 43.710849,
            lng: -79.413642
        },
        zoom: 9,
        mapTypeControl: false
    });
}
