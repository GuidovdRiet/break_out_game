/// <reference path="brick.ts"/>
class Game {
    private lives : number = 2;
    private h1 : HTMLElement;
    private span : HTMLElement;

    private paddle : Paddle;
    private brick : Brick;
    private bricks : Array<Brick> = new Array<Brick>();
    private utils : Utils;
    private ball : Ball;
    
    constructor() {
        this.h1 = document.createElement('h1');
        document.body.appendChild(this.h1);
        this.span = document.createElement('span');
        this.span.innerHTML = `${this.lives}`;
        this.h1.appendChild(this.span);

        // create objects
        this.paddle = new Paddle();
        this.ball = new Ball(this);
        this.utils = new Utils();

        let rows = 3;
        let cols = 6;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                this.bricks.push(new Brick(i, j));
            }
        }

        // start the game loop
        requestAnimationFrame(() => this.gameLoop());
    }

    // game loop
    private gameLoop():void {
        this.updateElements();
        requestAnimationFrame(() => this.gameLoop());
    }

    // update balls en paddles 
    private updateElements():void {

        if(this.utils.hasOverlap(this.ball, this.paddle)) this.ball.hitPaddle();
        
        this.bricks.forEach((brick : any) => {
            if(brick.status == true){
                if(this.utils.hasOverlap(this.ball, brick)) this.removeBrick(brick);
            }
        });
            
        this.ball.update();
        this.paddle.update();
    }

    // Remove brick on ball hit
    private removeBrick(brick : Brick) {
        brick.removeMyself();
        this.ball.reverse();
    }

    // When ball leaves screen use this method to adjust lives 
    public decreaseLifes() {
        this.lives = this.lives - 1;
        if ( this.lives <= 0 ) {
            console.log('You lose!');
            // this.gameOver();
        }
        this.span.innerHTML = `${this.lives}`;
    }
}