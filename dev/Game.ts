/// <reference path="brick.ts"/>
/// <reference path="GameObject.ts"/>

class Game extends GameObject {
    private lives : number;
    private totalLives : number = 3;
    private totalBricksHit : number = 0;
    private attempts : number = 0;
    private wins : number = 0;

    private paddle : Paddle;
    private brick : Brick;
    private ball : Ball;

    private startButton : HTMLElement; 
    private h2Attempts : HTMLElement;
    private h2Wins : HTMLElement;
    
    private bricks : Array<Brick> = new Array<Brick>();
    private hearts : Array<Heart> = new Array<Heart>();
    
    constructor() {
        super();

        this.lives = this.totalLives;

        // Create bricks 
        this.renderBricks();
        this.renderHearts();

        // create objects
        this.paddle = new Paddle();
        this.ball = new Ball(this);

        // create fails dom el
        this.h2Attempts = document.createElement('h2');
        this.h2Attempts.classList.add('lost');
        document.body.appendChild(this.h2Attempts);

        // create fails dom el
        this.h2Wins = document.createElement('h2');
        this.h2Wins.classList.add('win');
        document.body.appendChild(this.h2Wins);
        
        // start the game loop
        this.startButton = <HTMLElement>document.querySelector('.start_game');
        this.startButton.addEventListener('click', () => setTimeout(this.startGame(), 4000));
    }

    // game loop
    private gameLoop() : void {
        this.updateElements();
        requestAnimationFrame(() => this.gameLoop());
    }

    // update balls en paddles 
    private updateElements() : void {
        if(this.ball) {
            if(super.collision(this.ball, this.paddle)) this.ball.hitPaddle();
        }
        
        this.bricks.forEach((brick : any) => {
            if(brick.status == true) {
                if(this.ball) {
                    if(super.collision(this.ball, brick)) {
                        this.totalBricksHit++;
                        if(this.totalBricksHit === this.bricks.length) {
                            this.winGame();
                        }
                        this.removeBrick(brick);   
                    }
                }
            }
        });
            
        if(this.ball) {
            this.ball.update();
        }
        this.paddle.update();
    }

    private renderBricks(): void {
        const rows = 3;
        const cols = 6;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                this.bricks.push(new Brick(i, j));
            }
        }
    } 

    private renderHearts(): void {
        for (let i = 0; i < 3; i++) {
            this.hearts.push(new Heart(i));
        }
    }

    // Remove brick on ball hit
    private removeBrick(brick : Brick): void {
        brick.removeMyself();
        if(this.ball) {
            this.ball.reverse();
        }
    }

    // When ball leaves the screen decrease life by 1  
    public decreaseLives(): void {
        this.lives = this.lives - 1;

        // Remove heart (life)
        if(this.lives <= 3) {;
            this.hearts[this.lives].removeMyself();
        }

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    private winGame(): void {
        this.totalBricksHit = 0;
        this.ball.removeMyself();
        this.ball = undefined;

        const div = document.createElement('div');
        const h1 = document.createElement('h1');
        const button = document.createElement('button');

        div.classList.add('win_screen');
        button.classList.add('btn', 'btn-green');
        h1.innerHTML = 'You Win!';
        button.innerHTML = 'Start';

        div.appendChild(h1);
        div.appendChild(button);
        document.body.appendChild(div);

        button.addEventListener('click', () => {
            div.remove();
            this.resetGame();
            this.startGame()
        })
    }

    private gameOver(): void {
        this.ball.removeMyself();
        this.ball = undefined;

        const div = document.createElement('div');
        const h1 = document.createElement('h1');
        const button = document.createElement('button');

        div.classList.add('lose_screen');
        button.classList.add('btn', 'btn-red');
        h1.innerHTML = 'You Lose!';
        button.innerHTML = 'Try again';

        div.appendChild(h1);
        div.appendChild(button);
        document.body.appendChild(div);

        button.addEventListener('click', () => {
            div.remove();
            this.resetGame();
            this.startGame()
        })
    }

    private resetGame() {
        // Paddle to starting position
        this.paddle.startPosition();

        // Empty brick array in DOM
        this.bricks.forEach((brick : Brick) => {
            brick.removeMyself();
        });

        // Empty heart(lives) array in DOM
        this.hearts.forEach((heart : Heart) => {
            heart.removeMyself();
        });

        // Remove hearts and bricks out of array
        this.hearts.splice(0, 3);
        this.bricks.splice(0, 18);

        // Create a ball to play after 2 seconds
        setTimeout(() => {
            this.ball = new Ball(this);
        }, 2000)

        // Create new hearts
        this.renderHearts();

        // Create new bricks 
        this.renderBricks();

        // set score to begin value
        this.lives = this.totalLives;     
    }

    private startGame(): void {
        const startScreen = document.querySelector('.start_screen');
        startScreen.remove();
        this.gameLoop();
    }
}