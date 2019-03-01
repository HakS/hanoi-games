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
    .module('haksGamesApp', ['ngRoute', 'djds4rce.angular-socialshare'])
    .config(function ($routeProvider, $locationProvider) {
        // $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix("");
        // $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/game/:gameId', {
                templateUrl: 'views/game-page.html',
                controller: 'GamePageCtrl',
                controllerAs: 'gamePage',
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function ($rootScope) {
        $rootScope.games = [
            {
                id: 'hanoi',
                title: 'Hanoi Towers'
            }
        ];
    });
