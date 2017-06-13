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
        if (this.y > window.innerWidth) {
            console.log('lose one life');
            this.game.decreaseLifes();
            this.startPosition();
        }
        this.draw();
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
        this.x = c * this.width + (window.innerWidth / 5.4);
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
        this.lives = 2;
        this.bricks = new Array();
        this.h1 = document.createElement('h1');
        document.body.appendChild(this.h1);
        this.span = document.createElement('span');
        this.span.innerHTML = "" + this.lives;
        this.h1.appendChild(this.span);
        this.paddle = new Paddle();
        this.ball = new Ball(this);
        this.utils = new Utils();
        var rows = 3;
        var cols = 6;
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                this.bricks.push(new Brick(i, j));
            }
        }
        this.startButton = document.querySelector('.start_game');
        this.startButton.addEventListener('click', function () { return _this.startGame(); });
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
                if (_this.utils.hasOverlap(_this.ball, brick))
                    _this.removeBrick(brick);
            }
        });
        this.ball.update();
        this.paddle.update();
    };
    Game.prototype.removeBrick = function (brick) {
        brick.removeMyself();
        this.ball.reverse();
    };
    Game.prototype.decreaseLifes = function () {
        this.lives = this.lives - 1;
        if (this.lives <= 0) {
            this.gameOver();
        }
        this.span.innerHTML = "" + this.lives;
    };
    Game.prototype.gameOver = function () {
    };
    Game.prototype.startGame = function () {
        var _this = this;
        var startScreen = document.querySelector('.start_screen');
        startScreen.remove();
        requestAnimationFrame(function () { return _this.gameLoop(); });
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
        this.x = (window.innerWidth / 2) - 138;
        this.y = (window.innerHeight - 50);
        window.addEventListener('keydown', function (event) { return _this.movePaddleOnKeyDown(event); });
        window.addEventListener('keyup', function (event) { return _this.stopPaddle(event); });
    }
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
var Utils = (function () {
    function Utils() {
    }
    Utils.prototype.hasOverlap = function (c1, c2) {
        return !(c2.x > c1.x + c1.width || c2.x + c2.width < c1.x || c2.y > c1.y + c1.height || c2.y + c2.height < c1.y);
    };
    return Utils;
}());
//# sourceMappingURL=main.js.map