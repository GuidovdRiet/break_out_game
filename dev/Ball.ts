class Ball {

    private div : HTMLElement;
    
    public x : number;
    public y : number;
    public width : number;
    public height : number;

    private speedX : number;
    private speedY : number;

    private game : Game;

    constructor(game : Game) {
        // Create ball in DOM
        this.div = document.createElement('ball');
        document.body.appendChild(this.div);
        this.startPosition();

        // Objects
        this.game = game;
    }

    // de bal raakt een paddle
    public hitPaddle() : void { 
        this.speedY *= -1;
    }

    private startPosition() : void {
        this.x = 1000;
        this.y = 400;
        this.width = 30;
        this.height = 30;
        
        this.speedX = 10;
        this.speedY = 10;
        
        // random richting
        if(Math.random()>0.5) this.speedX *= -1;
    }

    // positie updaten
    public update() : void {
        this.x += this.speedX;
        this.y += this.speedY;

        // bounce left, right, top side of the screen
        if(this.x + 40 > window.innerWidth || this.x < 0) { 
            this.speedX *= -1;
        } else if (this.y < 0) {
            this.speedY *= -1;
        }

        if(this.y > window.innerWidth + 40) { 
            console.log('lose one life');
            this.game.decreaseLives();
            this.startPosition();
        }
        this.draw();
    }

    public removeBall() {
        this.div.remove();
    }

    // Reverse direction when ball hits brick
    public reverse() : void {
        this.speedY *= -1;
    }
    
    // draw in DOM
    public draw() : void {
        this.div.style.transform = `translate(${this.x}px, ${this.y}px)`;     
    }
}