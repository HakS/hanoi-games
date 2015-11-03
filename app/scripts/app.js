'use strict';

/**
 * @ngdoc overview
 * @name haksGamesApp
 * @description
 * # haksGamesApp
 *
 * Main module of the application.
 */
angular
  .module('haksGamesApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
    if (window.history && window.history.pushState) {
      $locationProvider.html5Mode(true);
    }
  });
