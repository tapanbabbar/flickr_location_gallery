var lat, lon;
var app = angular.module("main", ['uiGmapgoogle-maps']);

// Initialise Google Maps using Angular

app.controller('mainCtrl', function($scope, $http, $filter) {

   $scope.currentPage = 0;
   $scope.pageSize = 10;
   $scope.message = 'Click on the map to view images';
 $scope.numberOfPages = function() {
                     return 1;
                  }
   angular.extend($scope, {
      map: {
         center: {
            latitude: 28.7041,
            longitude: 77.1025
         },
         zoom: 10,
         markers: [],
         events: {
            click: function(map, eventName, originalEventArgs) { // Click Event to drop a pin

               var e = originalEventArgs[0];
               lat = e.latLng.lat(), lon = e.latLng.lng();
               var marker = {
                  id: Date.now(),
                  coords: {
                     latitude: lat,
                     longitude: lon
                  }
               };
               $scope.map.markers = []; // Delete previous marker
               $scope.map.markers.push(marker);

               // Add new marker
               $scope.$apply();
                
              $http.get("https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&api_key=a5e95177da353f58113fd60296e1d250&lat="+lat+"&lon="+lon+"&accuracy=10&format=json&nojsoncallback=1").then(function(res) {
                $scope.message = 'You are browsing in '+res.data.places.place[0].woe_name;
              });
              
              
               $http.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=a5e95177da353f58113fd60296e1d250&lat="+lat+"&lon="+lon+"&accuracy=9&format=json&nojsoncallback=1").then(function(res) {

                  $scope.records = res.data.photos.photo;
                  $scope.numberOfPages = function() {
                    if( Math.ceil($scope.records.length / $scope.pageSize)==0)
                    return 1
                    else
                     return Math.ceil($scope.records.length / $scope.pageSize);
                  }

               });

            }
         }
      }
   });

});

app.filter('startFrom', function() {
   return function(input, start) {
      start = +start; //parse to int
      return input.slice(start);
   }
});