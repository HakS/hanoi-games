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
  //.config(function ($routeProvider, $locationProvider) {
  .config(
    function ($routeProvider) {
      //var initGame = function(game) {
      //  var gameController = game.machineName.charAt(0).toUpperCase() + game.machineName.slice(1);
      //  $routeProvider
      //      .when(game.route, {
      //        templateUrl: 'views/games/' + game.machineName + '.html',
      //        controller: gameController,
      //        controllerAs: game.machineName
      //      });
      //  $rootScope.games.push(game);
      //};
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerAs: 'main'
        })
        // Games
        .when('/hanoi', {
          templateUrl: 'views/games/hanoi.html',
          controller: 'HanoiCtrl',
          controllerAs: 'hanoi',
          title: 'Hanoi Towers'
        })
        .otherwise({
          redirectTo: '/'
        });
      //if (window.history && window.history.pushState) {
      //  $locationProvider.html5Mode(true);
      //}

      //initGame({
      //  name: 'hanoi',
      //  title: 'Hanoi Towers'
      //});
    }
  );
