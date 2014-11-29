angular.module('8a-screen').controller('mainController', function($scope, workoutService){
	$scope.text='marjan';
	$scope.workouts = [];
	workoutService.getWorkouts().then(function(response){
		console.log(response);
		$scope.workouts=response;
	});
});