/// <reference path="brick.ts"/>
class Game {
    private lives : number;
    private totalLives : number = 3;
    private startButton : HTMLElement;

    private paddle : Paddle;
    private brick : Brick;
    private utils : Utils;
    private ball : Ball;
    
    private bricks : Array<Brick> = new Array<Brick>();
    private hearts : Array<Score> = new Array<Score>();
    
    constructor() {
        this.lives = this.totalLives;

        // Create bricks 
        this.renderBricks();
        this.renderHearts();

        // create objects
        this.paddle = new Paddle();
        this.ball = new Ball(this);
        this.utils = new Utils();

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

        if(this.utils.hasOverlap(this.ball, this.paddle)) this.ball.hitPaddle();
        
        this.bricks.forEach((brick : any) => {
            if(brick.status == true){
                if(this.utils.hasOverlap(this.ball, brick)) this.removeBrick(brick);
            }
        });
            
        this.ball.update();
        this.paddle.update();
    }

    private renderBricks() {
        const rows = 3;
        const cols = 6;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                this.bricks.push(new Brick(i, j));
            }
        }
    } 

    private renderHearts() {
        for (let i = 0; i < 3; i++) {
            this.hearts.push(new Score(i));
        }
    }

    // Remove brick on ball hit
    private removeBrick(brick : Brick) : void {
        brick.removeMyself();
        this.ball.reverse();
    }

    // When ball leaves the screen decrease life by 1  
    public decreaseLives() : void {
        this.lives = this.lives - 1;

        // Remove heart (life)
        if(this.lives <= 3) {;
            this.hearts[this.lives].removeMyself();
        }

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    private gameOver() : void {
        this.hearts[0].addAttempt();

        // Paddle to starting position
        this.paddle.startPosition();

        // Empty brick array in DOM
        this.bricks.forEach((brick : Brick) => {
            brick.removeMyself();
        });

        // Empty heart(lives) array in DOM
        this.hearts.forEach((heart : Score) => {
            heart.removeMyself();
        });

        this.hearts.splice(0, 3);

        // Create new hearts
        this.renderHearts();

        // Create new bricks 
        this.renderBricks();

        // set score to begin value
        this.lives = this.totalLives;        
    }

    private startGame() : void {
        const startScreen = document.querySelector('.start_screen');
        startScreen.remove();
        requestAnimationFrame(() => this.gameLoop());
    }
}