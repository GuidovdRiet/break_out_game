var Ball = (function () {
    function Ball(game) {
        this.div = document.createElement('ball');
        document.body.appendChild(this.div);
        this.startPosition();
        this.game = game;
    }
    Ball.prototype.hitPaddle = function () {
        this.speedY *= -1;
    };
    Ball.prototype.startPosition = function () {
        this.x = 1000;
        this.y = 400;
        this.width = 30;
        this.height = 30;
        this.speedX = 10;
        this.speedY = 10;
        if (Math.random() > 0.5)
            this.speedX *= -1;
    };
    Ball.prototype.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x + 40 > window.innerWidth || this.x < 0) {
            this.speedX *= -1;
        }
        else if (this.y < 0) {
            this.speedY *= -1;
        }
        if (this.y > window.innerWidth + 40) {
            console.log('lose one life');
            this.game.decreaseLives();
            this.startPosition();
        }
        this.draw();
    };
    Ball.prototype.removeBall = function () {
        this.div.remove();
    };
    Ball.prototype.reverse = function () {
        this.speedY *= -1;
    };
    Ball.prototype.draw = function () {
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    return Ball;
}());
var Brick = (function () {
    function Brick(r, c) {
        this.width = 151;
        this.height = 72;
        this.status = true;
        this.y = r * this.height + 20;
        this.x = c * this.width + ((window.innerWidth / 2) - 453);
        this.div = document.createElement('brick');
        document.body.appendChild(this.div);
        this.draw();
    }
    Brick.prototype.draw = function () {
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    Brick.prototype.removeMyself = function () {
        this.status = false;
        this.div.remove();
    };
    return Brick;
}());
var Game = (function () {
    function Game() {
        var _this = this;
        this.totalLives = 3;
        this.totalBricksHit = 0;
        this.attempts = 0;
        this.wins = 0;
        this.bricks = new Array();
        this.hearts = new Array();
        this.lives = this.totalLives;
        this.renderBricks();
        this.renderHearts();
        this.paddle = new Paddle();
        this.ball = new Ball(this);
        this.utils = new Utils();
        this.h2Attempts = document.createElement('h2');
        this.h2Attempts.classList.add('lost');
        document.body.appendChild(this.h2Attempts);
        this.h2Wins = document.createElement('h2');
        this.h2Wins.classList.add('win');
        document.body.appendChild(this.h2Wins);
        this.startButton = document.querySelector('.start_game');
        this.startButton.addEventListener('click', function () { return setTimeout(_this.startGame(), 4000); });
    }
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.updateElements();
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.updateElements = function () {
        var _this = this;
        if (this.utils.hasOverlap(this.ball, this.paddle))
            this.ball.hitPaddle();
        this.bricks.forEach(function (brick) {
            if (brick.status == true) {
                if (_this.utils.hasOverlap(_this.ball, brick)) {
                    _this.totalBricksHit++;
                    console.log(_this.totalBricksHit + _this.bricks.length);
                    if (_this.totalBricksHit === 2) {
                        _this.winGame();
                    }
                    _this.removeBrick(brick);
                }
            }
        });
        this.ball.update();
        this.paddle.update();
    };
    Game.prototype.renderBricks = function () {
        var rows = 3;
        var cols = 6;
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                this.bricks.push(new Brick(i, j));
            }
        }
    };
    Game.prototype.renderHearts = function () {
        for (var i = 0; i < 3; i++) {
            this.hearts.push(new Heart(i));
        }
    };
    Game.prototype.removeBrick = function (brick) {
        brick.removeMyself();
        this.ball.reverse();
    };
    Game.prototype.decreaseLives = function () {
        this.lives = this.lives - 1;
        if (this.lives <= 3) {
            ;
            this.hearts[this.lives].removeMyself();
        }
        if (this.lives <= 0) {
            this.gameOver();
        }
    };
    Game.prototype.winGame = function () {
        console.log('You Win!');
        this.totalBricksHit = 0;
        this.addWin();
        this.resetGame();
    };
    Game.prototype.gameOver = function () {
        this.addAttempt();
        this.resetGame();
    };
    Game.prototype.resetGame = function () {
        this.paddle.startPosition();
        this.bricks.forEach(function (brick) {
            brick.removeMyself();
        });
        this.hearts.forEach(function (heart) {
            heart.removeMyself();
        });
        this.hearts.splice(0, 3);
        this.bricks.splice(0, 18);
        this.renderHearts();
        this.renderBricks();
        this.lives = this.totalLives;
    };
    Game.prototype.startGame = function () {
        var _this = this;
        var startScreen = document.querySelector('.start_screen');
        startScreen.remove();
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.addAttempt = function () {
        this.attempts++;
        this.h2Attempts.innerHTML = "Fails: " + this.attempts;
    };
    Game.prototype.addWin = function () {
        this.wins++;
        this.h2Wins.innerHTML = "Wins: " + this.wins;
    };
    return Game;
}());
window.addEventListener('load', function () {
    new Game();
});
var Paddle = (function () {
    function Paddle() {
        var _this = this;
        this.leftSpeed = 0;
        this.rightSpeed = 0;
        this.div = document.createElement('paddle');
        document.body.appendChild(this.div);
        this.width = 159;
        this.height = 37;
        this.leftKey = 37;
        this.rightKey = 39;
        this.startPosition();
        window.addEventListener('keydown', function (event) { return _this.movePaddleOnKeyDown(event); });
        window.addEventListener('keyup', function (event) { return _this.stopPaddle(event); });
    }
    Paddle.prototype.startPosition = function () {
        this.x = (window.innerWidth / 2) - 138;
        this.y = (window.innerHeight - 50);
    };
    Paddle.prototype.movePaddleOnKeyDown = function (event) {
        switch (event.keyCode) {
            case this.leftKey:
                this.leftSpeed = 15;
                break;
            case this.rightKey:
                this.rightSpeed = 15;
                break;
        }
    };
    Paddle.prototype.stopPaddle = function (event) {
        switch (event.keyCode) {
            case this.leftKey:
                this.leftSpeed = 0;
                break;
            case this.rightKey:
                this.rightSpeed = 0;
                break;
        }
    };
    Paddle.prototype.update = function () {
        var targetX = this.x - this.leftSpeed + this.rightSpeed;
        if (targetX > -15 && targetX + 200 < window.innerWidth)
            this.x = targetX;
        this.draw();
    };
    Paddle.prototype.draw = function () {
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    return Paddle;
}());
var Heart = (function () {
    function Heart(i) {
        this.status = true;
        this.width = 44;
        this.height = 40;
        this.x = 20;
        this.y = (i * this.width) + 60;
        this.attempts = 0;
        this.div = document.createElement('heart');
        this.div.classList.add('heart');
        document.body.appendChild(this.div);
        this.draw();
    }
    Heart.prototype.removeMyself = function () {
        this.status = false;
        this.div.remove();
    };
    Heart.prototype.draw = function () {
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    return Heart;
}());
var Utils = (function () {
    function Utils() {
    }
    Utils.prototype.hasOverlap = function (c1, c2) {
        return !(c2.x > c1.x + c1.width || c2.x + c2.width < c1.x || c2.y > c1.y + c1.height || c2.y + c2.height < c1.y);
    };
    return Utils;
}());
//# sourceMappingURL=main.js.map