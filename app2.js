function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 35.7812643,
            lng: -78.6496908
        },
        zoom: 13,
        mapTypeControl: false
    });
}

var Location = function (title, lng, lat, address ){
  var self = this;
  this.title = title;
  this.location = {lat: lat, lng: lng};
  this.address = address;
  this.content = '<p>' + this.title + this.address + '</p>';

  this.infoWindow = new google.maps.InfoWindow();
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(self.location.lng, self.location.lat),
    map: map,
    title: self.title,
    animation: google.maps.Animation.DROP
  });

  this.streetViewService = new google.maps.StreetViewService ;
  self.streetViewService.getPanoramaByLocation(self.marker.position, 50, self.getStreetView);


  }
  this.openInfowindow = function() {
    for (var i=0; i < viewModel.locations.length; i++) {
      viewModel.locations[i].infoWindow.close();
      viewModel.locations[i].marker.setMap(null);
      console.log("closing" + viewModel.locations[i].title)
    }
    map.panTo(self.marker.getPosition());
    self.infoWindow.setContent(self.content);
    self.marker.setMap(map);
    self.infoWindow.open(map, self.marker);
  };

  this.addListener = google.maps.event.addListener(self.marker, 'click', (this.openInfowindow));




};

var viewModel = {

  locations:[
    new Location('Sahan Restaurant', 43.7455, -79.2970, '2010 Lawrence Ave E, Scarborough, ON M1R 2Z1'),
    new Location('Nando\'s Heartland', 43.610253, -79.698342, '815 Britannia Rd W #3, Mississauga, ON L5V 2X8'),
    new Location('BBQ Tonite', 43.640063, -79.624407, '4adc8051f964a520b92c21e3'),
    new Location('Bamiyon Kabab', 43.636290, -79.623017, '4bb8979c3db7b713c965219a'),
    new Location('Affy\'s Premium Grill', 43.598420, -79.747353, '2283 Argentia Rd, Mississauga, ON L5N 2X7')
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
