
angular.module('genomeApp',[
	'ngRoute',
  'dePartials'
	])

  .config(function ($routeProvider,$locationProvider,$httpProvider) {
    $routeProvider
      .when('/search', {
        templateUrl    : '/search/search.html',
        controller     : 'SearchCtrl',
        reloadOnSearch : false
      })
      .otherwise({
        redirectTo: '/search'
      });
  });
