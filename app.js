var map;

// true = showListings not clicked ; false = showListings has been clicked

var viewModel = {
  self : this,
  listingClick: ko.observable(1),
  listingClickShow: ko.pureComputed(function() {
    return this.listingClick = 1 ? "btn-primary" : "btn-secondary";},
    this),
    listingClickHide: ko.pureComputed(function() {
      return this.listingClick < -1 ? "btn-primary" : "btn-secondary";
    }, this)


  };

  // Create a new blank array for all the listing markers.
  var markers = [];

  function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13,
      mapTypeControl: false
    });

    initMarkers();
  }

  // This function initiiates the markers based on data in /static/js/data.js
  function initMarkers() {
    var largeInfowindow = new google.maps.InfoWindow();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations().length; i++) {
      // Get the position from the location array.
      var position = locations()[i].location;
      var title = locations()[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
      });
    }
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);
  }

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  }

  // This function will loop through the markers array and display them all.
  function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
    console.log(viewModel.listingClick());

    console.log(viewModel.listingClickShow());

    if (viewModel.listingClick() == 1)
    {
      viewModel.listingClick(-1) ;
      console.log(viewModel.listingClick());
      console.log(viewModel.listingClickShow());
    }
  }

  // This function will loop through the listings and hide them all.
  function hideListings() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    console.log(viewModel.listingClick());

    console.log(viewModel.listingClickHide());

    if (viewModel.listingClick() == -1)
    {
      viewModel.listingClick(1) ;
      console.log(viewModel.listingClick());
      console.log(viewModel.listingClickHide());
    }
  }

  ko.applyBindings(viewModel);
