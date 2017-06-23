var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameObject = (function () {
    function GameObject() {
    }
    GameObject.prototype.collision = function (c1, c2) {
        if (c1 || c2) {
            return !(c2.x > c1.x + c1.width || c2.x + c2.width < c1.x || c2.y > c1.y + c1.height || c2.y + c2.height < c1.y);
        }
    };
    return GameObject;
}());
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(game) {
        var _this = _super.call(this) || this;
        _this.div = document.createElement('ball');
        document.body.appendChild(_this.div);
        _this.startPosition();
        _this.game = game;
        return _this;
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
        if (this.y > window.innerHeight + 40) {
            console.log('lose one life');
            this.game.decreaseLives();
            this.startPosition();
        }
        this.draw();
    };
    Ball.prototype.removeMyself = function () {
        this.div.remove();
    };
    Ball.prototype.reverse = function () {
        this.speedY *= -1;
    };
    Ball.prototype.draw = function () {
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    return Ball;
}(GameObject));
var Brick = (function (_super) {
    __extends(Brick, _super);
    function Brick(r, c) {
        var _this = _super.call(this) || this;
        _this.status = true;
        _this.width = 151;
        _this.height = 72;
        _this.y = r * _this.height + 20;
        _this.x = c * _this.width + ((window.innerWidth / 2) - 453);
        _this.div = document.createElement('brick');
        document.body.appendChild(_this.div);
        _this.draw();
        return _this;
    }
    Brick.prototype.draw = function () {
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    Brick.prototype.removeMyself = function () {
        this.status = false;
        this.div.remove();
    };
    return Brick;
}(GameObject));
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        _this.totalLives = 3;
        _this.totalBricksHit = 0;
        _this.attempts = 0;
        _this.wins = 0;
        _this.bricks = new Array();
        _this.hearts = new Array();
        _this.lives = _this.totalLives;
        _this.renderBricks();
        _this.renderHearts();
        _this.paddle = new Paddle();
        _this.ball = new Ball(_this);
        _this.h2Attempts = document.createElement('h2');
        _this.h2Attempts.classList.add('lost');
        document.body.appendChild(_this.h2Attempts);
        _this.h2Wins = document.createElement('h2');
        _this.h2Wins.classList.add('win');
        document.body.appendChild(_this.h2Wins);
        _this.startButton = document.querySelector('.start_game');
        _this.startButton.addEventListener('click', function () { return setTimeout(_this.startGame(), 4000); });
        return _this;
    }
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.updateElements();
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.updateElements = function () {
        var _this = this;
        if (this.ball) {
            if (_super.prototype.collision.call(this, this.ball, this.paddle))
                this.ball.hitPaddle();
        }
        this.bricks.forEach(function (brick) {
            if (brick.status == true) {
                if (_this.ball) {
                    if (_super.prototype.collision.call(_this, _this.ball, brick)) {
                        _this.totalBricksHit++;
                        if (_this.totalBricksHit === _this.bricks.length) {
                            _this.winGame();
                        }
                        _this.removeBrick(brick);
                    }
                }
            }
        });
        if (this.ball) {
            this.ball.update();
        }
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
        if (this.ball) {
            this.ball.reverse();
        }
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
        var _this = this;
        this.totalBricksHit = 0;
        this.ball.removeMyself();
        this.ball = undefined;
        var div = document.createElement('div');
        var h1 = document.createElement('h1');
        var button = document.createElement('button');
        div.classList.add('win_screen');
        button.classList.add('btn', 'btn-green');
        h1.innerHTML = 'You Win!';
        button.innerHTML = 'Start';
        div.appendChild(h1);
        div.appendChild(button);
        document.body.appendChild(div);
        button.addEventListener('click', function () {
            div.remove();
            _this.resetGame();
            _this.startGame();
        });
    };
    Game.prototype.gameOver = function () {
        var _this = this;
        this.ball.removeMyself();
        this.ball = undefined;
        var div = document.createElement('div');
        var h1 = document.createElement('h1');
        var button = document.createElement('button');
        div.classList.add('lose_screen');
        button.classList.add('btn', 'btn-red');
        h1.innerHTML = 'You Lose!';
        button.innerHTML = 'Try again';
        div.appendChild(h1);
        div.appendChild(button);
        document.body.appendChild(div);
        button.addEventListener('click', function () {
            div.remove();
            _this.resetGame();
            _this.startGame();
        });
    };
    Game.prototype.resetGame = function () {
        var _this = this;
        this.paddle.startPosition();
        this.bricks.forEach(function (brick) {
            brick.removeMyself();
        });
        this.hearts.forEach(function (heart) {
            heart.removeMyself();
        });
        this.hearts.splice(0, 3);
        this.bricks.splice(0, 18);
        setTimeout(function () {
            _this.ball = new Ball(_this);
        }, 2000);
        this.renderHearts();
        this.renderBricks();
        this.lives = this.totalLives;
    };
    Game.prototype.startGame = function () {
        var startScreen = document.querySelector('.start_screen');
        startScreen.remove();
        this.gameLoop();
    };
    return Game;
}(GameObject));
var Heart = (function (_super) {
    __extends(Heart, _super);
    function Heart(i) {
        var _this = _super.call(this) || this;
        _this.status = true;
        _this.width = 44;
        _this.height = 40;
        _this.x = 20;
        _this.y = (i * _this.width) + 60;
        _this.attempts = 0;
        _this.div = document.createElement('heart');
        _this.div.classList.add('heart');
        document.body.appendChild(_this.div);
        _this.draw();
        return _this;
    }
    Heart.prototype.removeMyself = function () {
        this.status = false;
        this.div.remove();
    };
    Heart.prototype.draw = function () {
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    return Heart;
}(GameObject));
window.addEventListener('load', function () {
    new Game();
});
var Paddle = (function (_super) {
    __extends(Paddle, _super);
    function Paddle() {
        var _this = _super.call(this) || this;
        _this.leftSpeed = 0;
        _this.rightSpeed = 0;
        _this.div = document.createElement('paddle');
        document.body.appendChild(_this.div);
        _this.width = 159;
        _this.height = 37;
        _this.leftKey = 37;
        _this.rightKey = 39;
        _this.startPosition();
        window.addEventListener('keydown', function (event) { return _this.movePaddleOnKeyDown(event); });
        window.addEventListener('keyup', function (event) { return _this.stopPaddle(event); });
        return _this;
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
}(GameObject));
//# sourceMappingURL=main.js.map