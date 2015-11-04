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
    .module('haksGamesApp', ['ngRoute'])
    .config(function ($routeProvider) {
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
            //.when('/game/hanoi', {
            //    templateUrl: 'views/games/hanoi.html',
            //    controller: 'HanoiCtrl',
            //    controllerAs: 'hanoi',
            //    game: 'Hanoi Towers'
            //})
            //.when('/game/maze', {
            //    templateUrl: 'views/games/maze.html',
            //    controller: 'MazeCtrl',
            //    controllerAs: 'maze',
            //    game: 'The Maze'
            //})
            //.when('/game/tictactoe', {
            //    templateUrl: 'views/games/tictactoe.html',
            //    controller: 'TictactoeCtrl',
            //    controllerAs: 'tictactoe',
            //    game: 'Tic-Tac-Toe'
            //})
            //.when('/game/tetris', {
            //    templateUrl: 'views/games/tetris.html',
            //    controller: 'TetrisCtrl',
            //    controllerAs: 'tetris',
            //    game: 'Tetris'
            //})
            .otherwise({
                redirectTo: '/'
            });
            //if (window.history && window.history.pushState) {
            //    $locationProvider.html5Mode(true);
            //}
    })
    .run(function ($rootScope) {
        $rootScope.games = [
            {
                id: 'hanoi',
                title: 'Hanoi Towers'
            },
            {
                id: 'maze',
                title: 'The Maze!'
            },
            {
                id: 'tetris',
                title: 'Tetris'
            },
            {
                id: 'tictactoe',
                title: 'Tic-Tac-Toe'
            }
        ];
    });
