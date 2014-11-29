angular.module('8a-screen').service('workoutService', function($http){
	var workoutService = function() {};
	
	workoutService.getWorkouts = function () {
    	return $http.get('https://api.mongolab.com/api/1/databases/workout/collections/coll1?apiKey=????').then(function(response) {
            if (typeof response.data === 'object') {
                return response.data;
            } else {
                // invalid response
                return $q.reject(response.data);
            }

        }, function(response) {
            // something went wrong
            return $q.reject(response.data);
    	});
	}
    return workoutService;
});