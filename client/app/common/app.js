
angular.module('genomeApp',[
	'ngRoute',
  'dePartials'
	])

  .config(function ($routeProvider,$locationProvider,$httpProvider) {
    $routeProvider
      .when('/search', {
        templateUrl : '/search/search.html',
        controller  : 'SearchCtrl'
      })
      .otherwise({
        redirectTo: '/search'
      });
  });
