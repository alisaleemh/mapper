
var Location = function (title, lng, lat  ){
  var self = this;
  this.title = title;
  this.location = {lat: lat, lng: lng};

  this.infoWindow = new google.maps.InfoWindow();
  this.streetViewService = new google.maps.StreetViewService ;
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(self.location.lng, self.location.lat),
    map: map,
    title: self.title,
    animation: google.maps.Animation.DROP
  });



  this.showInfoWindow = function() {
    for (var i=0; i < viewModel.locations.length; i++) {
      viewModel.locations[i].infoWindow.close();
      viewModel.locations[i].marker.setMap(null);
    }
    self.streetViewService.getPanoramaByLocation(self.marker.position, 50, self.getStreetView);

    map.panTo(self.marker.getPosition());
    // self.infoWindow.setContent(self.content);
    self.marker.setMap(map);
    self.infoWindow.open(map, self.marker);
  };

  this.getStreetView = function()  {
    self.content = '<div>' + self.marker.title + '</div><div id="pano"></div>';
    self.infoWindow.setContent('<div>' + self.title + '</div><div id="pano"></div>');

    var panoramaOptions = {
      position: {
          lat: self.location.lat,
          lng: self.location.lng
      },      pov: {
        heading: 160,
        pitch: 0
      }
    };
    console.log(self.location);
    var panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), panoramaOptions);
    }

    this.addListener = google.maps.event.addListener(self.marker, 'click', (this.openInfowindow));
  };

  var viewModel = {

    locations:[
      new Location('Chinatown Homey Space', 40.7180628, -73.9961237),
      new Location('TriBeCa Artsy Bachelor Pad', 40.7195264, -74.0089934),
      new Location('East Village Hip Studio', 40.7281777, -73.984377),
      new Location('Union Square Open Floor Plan', 40.7347062, -73.9895759),
      new Location('Chelsea Loft', 40.7444883, -73.9949465)
    ],
    query: ko.observable(''),

  };


  // Search function for filtering through the list of locations based on the name of the location.
  viewModel.search = ko.dependentObservable(function() {
    var self = this;
    console.log("search being called");
    var search = this.query().toLowerCase();
    return ko.utils.arrayFilter(self.locations, function(location) {
      return location.title.toLowerCase().indexOf(search) >= 0;
    });
  }, viewModel);

  function hideAllListings () {
    for (var i=0; i < this.locations.length; i++){
      viewModel.locations[i].marker.setMap(null);
      console.log('hideAllListings being called');
      console.log(this.locations[i].marker);
    }
  }

  function showAllListings() {
    for (var i=0; i < this.locations.length; i++){
      viewModel.locations[i].marker.setMap(map);
      console.log('showAllListings being called');
      console.log(this.locations[i].marker);
    }
  }




  ko.applyBindings(viewModel);
