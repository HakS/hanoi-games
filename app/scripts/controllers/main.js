'use strict';

/**
 * @ngdoc function
 * @name haksGamesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the haksGamesApp
 */
angular.module('haksGamesApp')
  .controller(
    'MainCtrl', function ($route, $rootScope) {
      $rootScope.games = [];
      _.forEach($route.routes, function(route) {
        if (route.controller !== undefined) {
          $rootScope.games.push({
            title: route.title,
            url: route.originalPath,
            router: route
          });
        }
      });
    }
  );
