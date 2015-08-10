// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

weatherApp.config(function ($routeProvider) {

	$routeProvider

		.when('/', {
			templateUrl: 'pages/home.html',
			controller: 'homeController'
		})

		.when('/forecast', {
			templateUrl: 'pages/forecast.html',
			controller: 'forecastController'
		})

		.when('/forecast/:days', {
			templateUrl: 'pages/forecast.html',
			controller: 'forecastController'
		});
})

//SERVICES
weatherApp.service('cityService', function(){

	var self = this;

	this.city = "Albuquerque, NM";

	this.getCity = function() {
		return self.city;
	}
});

//CONTROLLERS
weatherApp.controller('homeController', ['$scope', 'cityService', '$resource', function($scope, cityService){

	$scope.city = cityService.city;
	$scope.$watch('city', function() {
		cityService.city = $scope.city;
	});
	
}]);

weatherApp.controller('forecastController', ['$scope', 'cityService', '$resource', '$routeParams', function($scope, cityService, $resource, $routeParams) {

	$scope.city = cityService.city;

	$scope.days = $routeParams.days || '7';
	

	$scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", { callback: 'JSON_CALLBACK' }, { get: { method: 'JSONP'} });
	$scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days});
	
	$scope.convertToFahrenheit = function(degK) {
		return Math.round((1.8 * (degK - 273)) + 32);
	}

	$scope.convertToDate = function(d) {
		var date = new Date(d * 1000);

		return date;
	}
}]);

//DIRECTIVES
weatherApp.directive ('weatherPanel', function () {
	return {
		restrict: 'E',
		templateUrl: 'directives/weather-panel.html',
		replace: true,
		scope: {
			weatherDay: '=',
			convertToStandard: "&",
			convertToDate: "&",
			dateFormat: "@"
		}
	}
})
