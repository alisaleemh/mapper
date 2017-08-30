var Location = function (title, lng, lat  ){
  var self = this;
  this.title = title;
  this.location = {lat: lat, lng: lng};

  this.infowindow = new google.maps.InfoWindow();
  this.streetViewService = new google.maps.StreetViewService() ;
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(self.location.lng, self.location.lat),
    map: map,
    title: self.title,
    animation: google.maps.Animation.DROP
  });

  this.closeAllInfowindows = function() {
    for (var i=0; i < viewModel.locations.length; i++) {
      viewModel.locations[i].infowindow.close();
    }
  }

  this.nullAllMarkers = function() {
    for (var i=0; i < viewModel.locations.length; i++) {
      viewModel.locations[i].marker.setMap(null);
    }
  }

  this.showInfoWindow = function() {
    for (var i=0; i < viewModel.locations.length; i++) {
      viewModel.locations[i].infowindow.close();
      viewModel.locations[i].marker.setMap(null);
    }
    self.streetViewService.getPanoramaByLocation(self.marker.position, 50, self.getStreetView);

    map.panTo(self.marker.getPosition());
    self.infowindow.setContent(self.content);
    self.marker.setMap(map);
    self.infowindow.open(map, self.marker);
  };

  this.getStreetView = function()  {
    self.content = '<div>' + self.title + '</div><div id="pano"></div>';
    self.infowindow.setContent(self.content);

    this.panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: {
          lat: self.location.lat,
          lng: self.location.lng
        }, pov: {
          heading: 160,
          pitch: 0
        }
      }
    );
  }

  self.marker.addListener('click', function() {
    self.closeAllInfowindows();
    self.streetViewService.getPanoramaByLocation(self.marker.position, 50, self.getStreetView);
    self.infowindow.setContent(self.content);
    self.marker.setMap(map);
    self.infowindow.open(map, self.marker);
  });

  // this.addListener = google.maps.event.addListener(self.marker, 'click', (this.openInfowindow));
};

var model = {
  locations: ko.observableArray([{
          title: 'Park Ave Penthouse',
          location: {
              lat: 40.7713024,
              lng: -73.9632393
          }
      },
      {
          title: 'Chelsea Loft',
          location: {
              lat: 40.7444883,
              lng: -73.9949465
          }
      },
      {
          title: 'Union Square Open Floor Plan',
          location: {
              lat: 40.7347062,
              lng: -73.9895759
          }
      },
      {
          title: 'East Village Hip Studio',
          location: {
              lat: 40.7281777,
              lng: -73.984377
          }
      },
      {
          title: 'TriBeCa Artsy Bachelor Pad',
          location: {
              lat: 40.7195264,
              lng: -74.0089934
          }
      },
      {
          title: 'Chinatown Homey Space',
          location: {
              lat: 40.7180628,
              lng: -73.9961237
          }
      }
  ]),
}

var viewModel = {

  locations: [],
  query: ko.observable(''),
};

viewModel.instantiateLocations = function () {
  for (i=0;i<model.locations().length;i++)
  {
    var location = new Location(model.locations()[i].title, model.locations()[i].location.lat, model.locations()[i].location.lng);
    viewModel.locations.push(location);
    }
}

viewModel.instantiateLocations();

// Search function for filtering through the list of locations based on the name of the location.
viewModel.search = ko.dependentObservable(function() {
  var self = this;
  var search = this.query().toLowerCase();
  return ko.utils.arrayFilter(self.locations, function(location) {
    if (location.title.toLowerCase().indexOf(search) < 0) {location.marker.setMap(null) };
    if (location.title.toLowerCase().indexOf(search) >= 0) {location.marker.setMap(map) };
    return location.title.toLowerCase().indexOf(search) >= 0;

  });
}, viewModel);



function hideAllListings () {
  for (var i=0; i < this.locations.length; i++){
    viewModel.locations[i].marker.setMap(null);
  }
}

function showAllListings() {
  for (var i=0; i < this.locations.length; i++){
    viewModel.locations[i].marker.setMap(map);
  }
}



ko.applyBindings(viewModel);
