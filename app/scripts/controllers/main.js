'use strict';

/**
 * @ngdoc function
 * @name haksGamesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the haksGamesApp
 */
angular.module('haksGamesApp')
    .controller('MainCtrl', function () {
    })
    .controller('GamePageCtrl', function($rootScope, $routeParams, $scope) {
        $scope.gameData = {};
        _.forEach($rootScope.games, function(game) {
            if (game.id === $routeParams.gameId) {
                $scope.gameData = game;
                return true;
            }
        });
        //var canvas = angular.element(document.querySelector("#" + $scope.gameData.id));
        //console.log(canvas);
    })
    .directive('initGame', function($routeParams, $compile) {
        return {
            restrict: 'E',
            link: function (scope, element) {
                var gameId = $routeParams.gameId;
                element.html('');
                element.append($compile("<" + gameId + "-game />")(scope));
            }
        };
    });
