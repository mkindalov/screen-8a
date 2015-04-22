var app = angular.module("8a-screen");

app.controller('infoscreenDisplay', function($scope, $timeout) {
    var templates=["weatherSK", "weatherBT", "picasaThailand", "weatherDK", "weatherSR", "picasaGermany", "picasaBaltic"];
    angular.forEach(templates, function(obj, index){
      $timeout(function () {
        $scope.$apply(function(){
            $scope.template = obj;
        });
       }, index * 60000);
    })

});
app.directive('picasa', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/picasa.html',
        scope: {
            text: "@text"
        },
        controller: function($scope, $http, $log, $timeout){
            var INTERVAL = 3000;
            load_images();
            loadSlides();

            function setCurrentSlideIndex(index) {
                $scope.currentIndex = index;
            }

            function isCurrentSlideIndex(index) {
                return $scope.currentIndex === index;
            }

            function nextSlide() {
                $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
                $timeout(nextSlide, INTERVAL);
            }

            function loadSlides() {
                $timeout(nextSlide, INTERVAL);
            }

            $scope.currentIndex = 0;
            $scope.setCurrentSlideIndex = setCurrentSlideIndex;
            $scope.isCurrentSlideIndex = isCurrentSlideIndex;

            function parsePhoto(entry) {
                var photo = {
                    image: entry.media$group.media$content[0].url
                };
                return photo;
            }
            function load_images(){
                var url = "https://picasaweb.google.com/data/feed/api/user/104645210533551493647/albumid/" + $scope.text;

                $http.jsonp(url, { params : {
                     alt : 'json',
                     kind : 'photo',
                     hl : 'pl',
                     imgmax : '912',
                     callback: 'JSON_CALLBACK'
                  }}).
                success(function(data, status, headers, config) {
                    var photos = [];
                    if (!data.feed) {
                        photos.push(parsePhoto(data.entry));
                    } else {
                        var entries = data.feed.entry;
                        for (var i = 0; i < entries.length; i++) {
                           photos.push(parsePhoto(entries[i]));
                        }
                     }
                    $scope.slides = photos;
                }).
                error(function(data, status, headers, config) {
                     // Log an error in the browser's console.
                     $log.error('Could not retrieve data from ' + url);
                });
            };
         },
       };
  });

 app.directive('weather', function() {
       return {
         restrict: 'E',
         templateUrl: 'templates/weather.html',
         scope: {
            text: "@text"
         },
         controller: function($scope, $http, $log){

            $scope.city = $scope.text;
            $scope.units = 'metric';
         	$scope.days = '4';
         	load_weather();

         	function load_weather(){
                var url = 'http://api.openweathermap.org/data/2.5/forecast/daily';
                $http.jsonp(url, { params : {
                     q : $scope.city,
                     units : $scope.units,
                     cnt : $scope.days,
                     callback: 'JSON_CALLBACK'
                  }}).
                success(function(data, status, headers, config) {
                     $scope.loc = data;
                     $scope.forecast = data.list;
                  }).
                error(function(data, status, headers, config) {
                     // Log an error in the browser's console.
                     $log.error('Could not retrieve data from ' + url);
                });
         	};
         },
       };
  });