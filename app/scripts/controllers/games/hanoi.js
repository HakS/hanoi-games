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
        var renderGame = function(scope, element) {
            var debug = false;

            var canvasCompile = $compile('<canvas></canvas>')(scope);
            var gameWrapper = $compile('<div class="game-container"></div>')(scope);
            gameWrapper.append(canvasCompile);
            element.prepend(gameWrapper);

            var canvas = canvasCompile[0];
            var ctx = canvas.getContext("2d");
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            ctx.save();

            canvas.width = 1024;
            canvas.height = 700;

            var w = window;
            w.requestAnimFrame = function(){
                return (
                    w.requestAnimationFrame       ||
                    w.webkitRequestAnimationFrame ||
                    w.mozRequestAnimationFrame    ||
                    w.oRequestAnimationFrame      ||
                    w.msRequestAnimationFrame     ||
                    function(/* function */ callback){
                        w.setTimeout(callback, 1000 / 60);
                    }
                );
            }();

            var SpriteContainer = (function() {
                function SpriteContainer(dimensions, image) {
                    var sc = this;
                    sc.dimensions = dimensions;
                    sc.imageReady = false;
                    sc.spriteImage = new Image();
                    if (image === undefined) {
                        if (debug) {
                            sc.spriteImage.src = "images/games/hanoi/sprites-debug.png"
                        }
                        else {
                            sc.spriteImage.src = "images/games/hanoi/sprites.gif"
                        }
                    }
                    else {
                        sc.spriteImage.src = "images/games/hanoi/" + image;
                    }
                    sc.spriteImage.onload = function () {
                        sc.imageReady = true;
                    };
                }
                SpriteContainer.prototype.draw = function(position, alpha) {
                    if (this.imageReady) {
                        if (alpha != undefined) {
                            ctx.globalAlpha = alpha;
                        }
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
                        if (alpha != undefined) {
                            ctx.restore();
                            ctx.globalAlpha = 1;
                        }
                    }
                };
                //SpriteContainer.prototype.drawWithColor = function(position) {
                //    this.draw(position);
                //    var imageData = ctx.getImageData(0,0,this.dimensions.width, this.dimensions.height);
                //    console.log(imageData)
                //};

                return SpriteContainer;
            })();

            // Handle keyboard controls
            var keysDown = {};
            var hanoiAnimations = [false, false, false, false]; // Up, Down, Left, Right
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

            var instructions1 = new SpriteContainer({x: 688, y: 137, width: 87, height: 57});
            var instructions2 = new SpriteContainer({x: 688, y: 197, width: 87, height: 57});

            var glows = [
                {alpha: 1, x: 99, y: 217, sprite: new SpriteContainer({x: 555, y: 16, width: 115, height: 45})},
                {alpha: 1, x: 206, y: 171, sprite: new SpriteContainer({x: 555, y: 16, width: 115, height: 45})},
                {alpha: 1, x: 313, y: 122, sprite: new SpriteContainer({x: 555, y: 16, width: 115, height: 45})},
            ];
            var hanoiBlocks = [
                {enabled: false, x: 139, y: 144, sprite: new SpriteContainer({x: 0, y: 0, width: 34, height: 18})},
                {enabled: false, x: 135, y: 154, sprite: new SpriteContainer({x: 0, y: 18, width: 42, height: 20})},
                {enabled: false, x: 132, y: 164, sprite: new SpriteContainer({x: 0, y: 38, width: 48, height: 22})},
                {enabled: false, x: 128, y: 174, sprite: new SpriteContainer({x: 0, y: 60, width: 56, height: 25})},
                {enabled: false, x: 124, y: 184, sprite: new SpriteContainer({x: 0, y: 85, width: 64, height: 27})},
                {enabled: false, x: 117, y: 194, sprite: new SpriteContainer({x: 0, y: 112, width: 79, height: 32})},
                {enabled: false, x: 111, y: 204, sprite: new SpriteContainer({x: 0, y: 144, width: 90, height: 35})},
                {enabled: false, x: 104, y: 214, sprite: new SpriteContainer({x: 0, y: 179, width: 105, height: 40})}
            ];
            var currentGame = [[], [], []];
            var currentLevel = 0, previousColumn = 0, currentColumn = 0, currentBlockIndex = 0, moves = 0, lvlAnimCount = 0;
            var switchColumnChange = false, animating = false, valid = false, changedColumn = false, validated = false, lvlAnim = false;
            var editGame = true;
            var resetGame = false;

            var reset = function (level) {
                hanoiBlocks[0].x = 139; hanoiBlocks[0].y = 144;
                hanoiBlocks[1].x = 135; hanoiBlocks[1].y = 154;
                hanoiBlocks[2].x = 132; hanoiBlocks[2].y = 164;
                hanoiBlocks[3].x = 128; hanoiBlocks[3].y = 174;
                hanoiBlocks[4].x = 124; hanoiBlocks[4].y = 184;
                hanoiBlocks[5].x = 117; hanoiBlocks[5].y = 194;
                hanoiBlocks[6].x = 111; hanoiBlocks[6].y = 204;
                hanoiBlocks[7].x = 104; hanoiBlocks[7].y = 214;

                currentGame = [[], [], []];
                currentLevel = level;
                previousColumn = 0;
                currentColumn = 0;
                switchColumnChange = false;

                for (var i = 0; i < currentLevel; i++) {
                    currentGame[0].push(i);
                    hanoiBlocks[i].enabled = true;
                    hanoiBlocks[i].initialX = hanoiBlocks[i].x;
                    hanoiBlocks[i].initialY = hanoiBlocks[i].y;
                }

                currentBlockIndex = currentGame[currentColumn][0];

                animating = false;
                editGame = true;
                changedColumn = false;
                moves = 0;

                validated = false;
                valid = false;
            };

            var animateLvlUpdate = function() {
                if (lvlAnim) {
                    if (lvlAnimCount < 100) {
                        ctx.globalAlpha = (100 - lvlAnimCount) / 150.00;
                        ctx.fillStyle="#0065D3";
                        ctx.fillRect(0,0,canvas.width,canvas.height);
                        ctx.fillStyle = "rgb(250, 250, 250)";
                        ctx.font = "44px pixelmixregular";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText("Level " + (currentLevel - 2), canvas.width/2, canvas.height/2);
                        ctx.restore();
                        ctx.globalAlpha = 1;
                        lvlAnimCount++;
                    }
                    else {
                        lvlAnim = false;
                        lvlAnimCount = 0;
                    }
                }
            };
            var promptDebug = function(text, position) {
                ctx.fillStyle = "rgb(0, 255 , 0)";
                ctx.font = "12px pixelmixregular";
                ctx.textAlign = "right";
                ctx.textBaseline = "bottom";
                ctx.fillText(text, 1000, 700 - (23*position));
            };

            var updateKeys = function () {
                if (82 in keysDown) {
                    resetGame = true;
                }
                if (!animating) {
                    if (38 in keysDown || 87 in keysDown) { // Player holding up
                        hanoiAnimations = [true, false, false, false];
                    }
                    else if (40 in keysDown || 83 in keysDown) { // Player holding down
                        hanoiAnimations = [false, true, false, false];
                    }
                    else if (37 in keysDown || 65 in keysDown) { // Player holding left
                        hanoiAnimations = [false, false, true, false];
                    }
                    else if (39 in keysDown || 68 in keysDown) { // Player holding right
                        hanoiAnimations = [false, false, false, true];
                    }
                }
            };
            var validateMovement = function() {
                if (!validated) {
                    if (currentGame[currentColumn].length < 1) valid = true;
                    else {
                        valid = currentGame[currentColumn][0] >= currentBlockIndex;
                    }
                    validated = true;
                }
                return valid;
            };
            var update = function () {
                if (!resetGame) {
                    var limit = 107;
                    if (hanoiAnimations[0]) {
                        if (!switchColumnChange && currentBlockIndex != undefined) {
                            var height = (currentLevel - currentGame[currentColumn].length) * 10;
                            var overHeight = height + 20;
                            if ((hanoiBlocks[currentBlockIndex].y - 2) > (hanoiBlocks[currentBlockIndex].initialY - overHeight)) {
                                hanoiBlocks[currentBlockIndex].y -= 2;
                                animating = true;
                            }
                            else {
                                animating = false;
                                editGame = true;
                                validated = false;
                                moves++;
                                hanoiBlocks[currentBlockIndex].y = hanoiBlocks[currentBlockIndex].initialY - overHeight;
                                hanoiBlocks[currentBlockIndex].initialY = hanoiBlocks[currentBlockIndex].y;
                                switchColumnChange = true;
                                hanoiAnimations = [false, false, false, false];
                            }
                        }
                        else hanoiAnimations = [false, false, false, false];
                    }
                    else if (hanoiAnimations[1]) {
                        if (switchColumnChange && validateMovement()) {
                            if (editGame) {
                                currentGame[currentColumn].unshift(currentBlockIndex);
                                currentGame[previousColumn].shift();
                                currentBlockIndex = currentGame[currentColumn][0];
                                editGame = false;
                            }
                            var height = (currentLevel - currentGame[currentColumn].length) * 10;
                            var overHeight = height + 20;
                            if ((hanoiBlocks[currentBlockIndex].y + 2) < (hanoiBlocks[currentBlockIndex].initialY + overHeight)) {
                                hanoiBlocks[currentBlockIndex].y += 2;
                                animating = true;
                            }
                            else {
                                animating = false;
                                moves++;
                                hanoiBlocks[currentBlockIndex].y = hanoiBlocks[currentBlockIndex].initialY + overHeight;
                                hanoiBlocks[currentBlockIndex].initialY = hanoiBlocks[currentBlockIndex].y;
                                switchColumnChange = false;

                                previousColumn = currentColumn;
                                if (currentGame[0].length == 0 && currentGame[1].length == 0) {
                                    if (currentLevel < hanoiBlocks.length) {
                                        lvlAnim = true;
                                        lvlAnimCount = 0;
                                        reset(currentLevel + 1);
                                    }
                                    else {
                                        // Put logic to end the game
                                    }
                                }

                                hanoiAnimations = [false, false, false, false];
                            }
                        }
                        else hanoiAnimations = [false, false, false, false];
                    }
                    else if (hanoiAnimations[2]) {
                        if (switchColumnChange) {
                            if (currentColumn > 0) {
                                if ((hanoiBlocks[currentBlockIndex].x - 10) > (hanoiBlocks[currentBlockIndex].initialX - limit)) {
                                    hanoiBlocks[currentBlockIndex].x -= 10;
                                    hanoiBlocks[currentBlockIndex].y += 4.7;
                                    animating = true;
                                }
                                else {
                                    moves++;
                                    animating = false;
                                    currentColumn--;
                                    validated = false;
                                    hanoiBlocks[currentBlockIndex].x = hanoiBlocks[currentBlockIndex].initialX - limit;
                                    hanoiBlocks[currentBlockIndex].initialX = hanoiBlocks[currentBlockIndex].x;
                                    hanoiBlocks[currentBlockIndex].initialY = hanoiBlocks[currentBlockIndex].y;
                                    hanoiAnimations = [false, false, false, false];
                                }
                            }
                            else hanoiAnimations = [false, false, false, false];
                        }
                        else {
                            if (currentColumn > 0 && !changedColumn) {
                                currentColumn--;
                                previousColumn--;
                                currentBlockIndex = currentGame[currentColumn][0];
                                changedColumn = true;
                            }
                            hanoiAnimations = [false, false, false, false];
                        }
                    }
                    else if (hanoiAnimations[3]) {
                        if (switchColumnChange) {
                            if (currentColumn < 2) {
                                if ((hanoiBlocks[currentBlockIndex].x + 10) < (hanoiBlocks[currentBlockIndex].initialX + limit)) {
                                    hanoiBlocks[currentBlockIndex].x += 10;
                                    hanoiBlocks[currentBlockIndex].y -= 4.7;
                                    animating = true;
                                }
                                else {
                                    moves++;
                                    animating = false;
                                    currentColumn++;
                                    validated = false;
                                    hanoiBlocks[currentBlockIndex].x = hanoiBlocks[currentBlockIndex].initialX + limit;
                                    hanoiBlocks[currentBlockIndex].initialX = hanoiBlocks[currentBlockIndex].x;
                                    hanoiBlocks[currentBlockIndex].initialY = hanoiBlocks[currentBlockIndex].y;
                                    hanoiAnimations = [false, false, false, false];
                                }
                            }
                            else hanoiAnimations = [false, false, false, false];
                        }
                        else {
                            if (currentColumn < 2 && !changedColumn) {
                                currentColumn++;
                                previousColumn++;
                                currentBlockIndex = currentGame[currentColumn][0];
                                changedColumn = true;
                            }
                            hanoiAnimations = [false, false, false, false];
                        }
                    }
                    else {
                        changedColumn = false;
                    }
                }
                else {
                    reset(currentLevel);
                    resetGame = false;
                }
            };
            var render = function () {
                for (var i = 0; i <= canvas.height; i += 126) {
                    for (var j = 0; j <= canvas.width; j += 126) {
                        background.draw({x: j, y: i});
                    }
                }
                hanoiPlatform.draw({x: 40, y: 110});

                for (var i = 0; i < glows.length; i++) {
                    glows[currentColumn].sprite.draw({x: glows[currentColumn].x, y: glows[currentColumn].y}, glows[currentColumn].alpha);
                }

                // level determine of where to draw blocks
                var levelDraw = (hanoiBlocks.length - currentLevel) * 10;
                for (var i = 0; i < currentGame.length; i++) {
                    for (var j = currentGame[i].length - 1; j >= 0 ; j--) {
                        if (hanoiBlocks[currentGame[i][j]].enabled) {
                            var item = hanoiBlocks[currentGame[i][j]];
                            item.sprite.draw({x: item.x, y: (item.y + levelDraw) });
                        }
                    }
                }

                animateLvlUpdate();

                // Score
                ctx.fillStyle = "rgb(250, 250, 250)";
                ctx.font = "16px pixelmixregular";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.fillText("Level: " + (currentLevel - 2), 32, 32*1);
                ctx.fillText("Movements: " + moves, 32, 32*2);

                // Instructions
                if (!debug) {
                    ctx.textAlign = "right";
                    ctx.textBaseline = "bottom";
                    ctx.fillText("Use WASD or directional keys", 1000, 620);
                    ctx.fillText("to move the blocks.", 1000, 650);
                    ctx.fillText("Press R to restart current level.", 1000, 680);

                    instructions1.draw({x: 310, y: 230});
                    instructions2.draw({x: 410, y: 230});
                }

                if (debug) {
                    promptDebug(angular.toJson(keysDown), 1);
                    promptDebug("column change: " + switchColumnChange, 2);
                    promptDebug("current column: " + currentColumn, 3);
                    promptDebug("currentBlockIndex: " + currentBlockIndex, 4);
                    if (currentBlockIndex != undefined) promptDebug("current x: " + hanoiBlocks[currentBlockIndex].x, 5);
                    if (currentBlockIndex != undefined) promptDebug("current y: " + hanoiBlocks[currentBlockIndex].y, 6);
                    promptDebug("current keys: " + angular.toJson(hanoiAnimations), 7);
                    promptDebug("current real level: " + currentLevel, 8);
                }
            };
            var main = function () {
                updateKeys();
                update();
                render();

                // Request to do this again ASAP
                w.requestAnimFrame(main);
            };

            reset(3);
            main();
        };

        return {
            restrict: 'E',
            link: function(scope, element) {
                renderGame(scope, element);
            },
            templateUrl: '/views/games/hanoi.html'
        };
    });
