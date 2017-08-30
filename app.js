

var Location = function (title, lng, lat, venueId ){
  var self = this;
  this.title = title;
  this.location = {lat: lat, lng: lng};
  this.venueId = venueId;

  this.infowindow = new google.maps.InfoWindow();
  this.streetViewService = new google.maps.StreetViewService() ;
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(self.location.lng, self.location.lat),
    map: map,
    title: self.title,
    animation: google.maps.Animation.DROP
  });

  this.getContent = function() {
    var topTips = [];
    var venueUrl = 'https://api.foursquare.com/v2/venues/' + self.venueId + '/tips?sort=recent&limit=3&v=20170509&client_id=GVXA4GBVK2BS3MBLNV5BHZAWP3HZINW0H1QK1XTNWH0ACQW5&client_secret=QAMIPBBSVDK4LXZA1KDCDK5Y0KWQJABV3D31ASXYJZFYB2YT';

    $.getJSON(venueUrl,
      function(data) {
        $.each(data.response.tips.items, function(i, tips){
          // foursquare api has bug that doesn't limit the number of responses
          if (i < 5) {topTips.push('<li>' + tips.text + '</li>') };
        });

      }).done(function(){

        self.content = '<h2>' + self.title + '</h2>' + '<h3>5 Most Recent Comments</h3>' + '<ol class="tips">' + topTips.join('') + '</ol>';
      }).fail(function(jqXHR, textStatus, errorThrown) {
        self.content = '<h2>' + self.title + '</h2>' + '<h3>5 Most Recent Comments</h3>' + '<h4>Oops. There was a problem retrieving this location\'s comments.</h4>';
        console.log('getJSON request failed! ' + textStatus);
      });
    }();

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
      // will look into this after project
      // self.content = self.content.concat(' ' + '<div>' + '</div><div id="pano"></div>' );
      // console.log('getStreetView' + self.content);
      self.infowindow.setContent(self.content);

      this.panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
          position: {
            lat: self.location.lat,
            lng: self.location.lng
          }, pov: {
            heading: 85,
            pitch: 30
          }
        }
      );
    }

    self.marker.addListener('click', function() {
      self.closeAllInfowindows();
      self.streetViewService.getPanoramaByLocation(self.marker.position, 50, self.getStreetView);
      console.log(self.content);
      self.infowindow.setContent(self.content);
      self.marker.setMap(map);
      self.infowindow.open(map, self.marker);
    });

    // this.addListener = google.maps.event.addListener(self.marker, 'click', (this.openInfowindow));
  };

  var model = {
    locations: ko.observableArray([{
      title: 'Park Ave Penthouse',
      venueId: '52d884c5498ecf5c7cafe5ab',
      location: {
        lat: 40.7713024,
        lng: -73.9632393
      }
    },
    {
      title: 'Chelsea Loft',
      venueId: '52d884c5498ecf5c7cafe5ab',
      location: {
        lat: 40.7444883,
        lng: -73.9949465
      }
    },
    {
      title: 'Union Square Open Floor Plan',
      venueId: '52d884c5498ecf5c7cafe5ab',
      location: {
        lat: 40.7347062,
        lng: -73.9895759
      }
    },
    {
      title: 'East Village Hip Studio',
      venueId: '52d884c5498ecf5c7cafe5ab',

      location: {
        lat: 40.7281777,
        lng: -73.984377
      }
    },
    {
      title: 'TriBeCa Artsy Bachelor Pad',
      venueId: '52d884c5498ecf5c7cafe5ab',
      location: {
        lat: 40.7195264,
        lng: -74.0089934
      },

    },
    {
      title: 'Chinatown Homey Space',
      venueId: '52d884c5498ecf5c7cafe5ab',
      location: {
        lat: 40.7180628,
        lng: -73.9961237
      }
    }
  ]),
}

var viewModel = {

  locations: [],
  query: ko.observable(' '),
};

viewModel.instantiateLocations = function () {
  for (i=0;i<model.locations().length;i++)
  {
    var location = new Location(model.locations()[i].title, model.locations()[i].location.lat, model.locations()[i].location.lng, model.locations()[i].venueId);
    viewModel.locations.push(location);
  }
}


// Search function for filtering through the list of locations based on the name of the location.
viewModel.search = ko.dependentObservable(function() {
  var self = this;
  console.log('searcih being called');
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

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.7413549,
            lng: -73.9980244
        },
        zoom: 13,
        mapTypeControl: false
    });
    viewModel.instantiateLocations();


}

function googleError() {
  alert("Error loadings the maps API. Please check your internet connection");
}


ko.applyBindings(viewModel);
