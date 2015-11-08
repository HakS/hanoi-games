'use strict';

/**
 * @ngdoc function
 * @name haksGamesApp.controller:HanoiCtrl
 * @description
 * # HanoiCtrl
 * Controller of the haksGamesApp
 */

angular.module('haksGamesApp')
    .directive('hanoiGame', function($compile) {

        var SpriteContainer = (function() {
            function SpriteContainer(dimensions, image) {
                var sc = this;
                sc.dimensions = dimensions;
                sc.imageReady = false;
                sc.spriteImage = new Image();
                if (image === undefined) {
                    sc.spriteImage.src = "images/games/hanoi/sprites.gif"
                }
                else {
                    sc.spriteImage.src = "images/games/hanoi/" + image;
                }
                sc.spriteImage.onload = function () {
                    sc.imageReady = true;
                };
            }
            SpriteContainer.prototype.draw = function(position, ctx) {
                if (this.imageReady) {
                    ctx.mozImageSmoothingEnabled = false;
                    ctx.webkitImageSmoothingEnabled = false;
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(
                        this.spriteImage,
                        this.dimensions.x,
                        this.dimensions.y,
                        this.dimensions.width,
                        this.dimensions.height,
                        position.x * 2,
                        position.y * 2,
                        this.dimensions.width * 2,
                        this.dimensions.height * 2
                    );
                }
            };

            return SpriteContainer;
        })();

        var renderGame = function(scope, element) {
            var canvasCompile = $compile('<canvas></canvas>')(scope);
            element.append(canvasCompile);

            var canvas = canvasCompile[0];
            var ctx = canvas.getContext("2d");

            canvas.width = 1024;
            canvas.height = 800;

            // Handle keyboard controls
            var keysDown = {};
            addEventListener("keydown", function (e) {
                keysDown[e.keyCode] = true;
                e.preventDefault();
            }, false);
            addEventListener("keyup", function (e) {
                delete keysDown[e.keyCode];
            }, false);

            // Game objects
            var hanoiPlatform = new SpriteContainer({x: 110, y: 74, width: 436, height: 181});
            var background = new SpriteContainer({x: 553, y: 130, width: 126, height: 126});
            var hanoiBlocks = [
                {enabled: false, x: 138, y: 144, sprite: new SpriteContainer({x: 0, y: 53, width: 34, height: 14})},
                {enabled: false, x: 135, y: 154, sprite: new SpriteContainer({x: 0, y: 67, width: 42, height: 17})},
                {enabled: false, x: 132, y: 164, sprite: new SpriteContainer({x: 0, y: 84, width: 48, height: 19})},
                {enabled: false, x: 128, y: 174, sprite: new SpriteContainer({x: 0, y: 103, width: 56, height: 21})},
                {enabled: false, x: 125, y: 184, sprite: new SpriteContainer({x: 0, y: 124, width: 64, height: 26})},
                {enabled: false, x: 118, y: 194, sprite: new SpriteContainer({x: 0, y: 150, width: 79, height: 31})},
                {enabled: false, x: 112, y: 204, sprite: new SpriteContainer({x: 0, y: 181, width: 90, height: 35})},
                {enabled: false, x: 105, y: 214, sprite: new SpriteContainer({x: 0, y: 216, width: 105, height: 40})}
            ];
            var currentGame = [[], [], []];
            var currentLevel = 8;
            for (var i = 0; i < currentLevel; i++) {
                currentGame[0].push(i);
                hanoiBlocks[i].enabled = true;
            }

            var hero = {
                speed: 256 // movement in pixels per second
            };
            var monster = {};
            var monstersCaught = 0;

            // Reset the game when the player catches a monster
            var reset = function () {
                hero.x = canvas.width / 2;
                hero.y = canvas.height / 2;

                // Throw the monster somewhere on the screen randomly
                monster.x = 32 + (Math.random() * (canvas.width - 64));
                monster.y = 32 + (Math.random() * (canvas.height - 64));
            };

            // Update game objects
            var update = function (modifier) {
                if (38 in keysDown) { // Player holding up
                    hero.y -= hero.speed * modifier;
                }
                if (40 in keysDown) { // Player holding down
                    hero.y += hero.speed * modifier;
                }
                if (37 in keysDown) { // Player holding left
                    hero.x -= hero.speed * modifier;
                }
                if (39 in keysDown) { // Player holding right
                    hero.x += hero.speed * modifier;
                }

                // Are they touching?
                if (
                    hero.x <= (monster.x + 32)
                    && monster.x <= (hero.x + 32)
                    && hero.y <= (monster.y + 32)
                    && monster.y <= (hero.y + 32)
                ) {
                    ++monstersCaught;
                    reset();
                }
            };

            // Draw everything
            var render = function () {
                for (var i = 0; i <= canvas.height; i += 126) {
                    for (var j = 0; j <= canvas.width; j += 126) {
                        background.draw({x: j, y: i}, ctx);
                    }
                }
                hanoiPlatform.draw({x: 40, y: 110}, ctx);
                for (var i = 0; i < currentGame.length; i++) {
                    for (var j = currentGame[i].length - 1; j >= 0 ; j--) {
                        if (hanoiBlocks[currentGame[i][j]].enabled) {
                            var item = hanoiBlocks[currentGame[i][j]];
                            item.sprite.draw({x: item.x, y: item.y}, ctx);
                        }
                    }
                }

                // Score
                ctx.fillStyle = "rgb(250, 250, 250)";
                ctx.font = "24px pixelmixregular";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.fillText("Test text", 32, 32);
            };

            // The main game loop
            var main = function () {
                var now = Date.now();
                var delta = now - then;

                update(delta / 1000);
                render();

                then = now;

                // Request to do this again ASAP
                requestAnimationFrame(main);
            };

            // Cross-browser support for requestAnimationFrame
            var w = window;
            requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

            // Let's play this game!
            var then = Date.now();
            reset();
            main();
        };

        return {
            restrict: 'E',
            link: function(scope, element) {
                renderGame(scope, element);
            }
        };
    });
