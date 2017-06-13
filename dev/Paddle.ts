class Paddle {

    private div : HTMLElement;

    private leftKey : number;
    private rightKey : number;

    private leftSpeed : number = 0;
    private rightSpeed : number = 0;

    public x : number;
    public y : number;
    public width : number;
    public height : number;

    constructor() {
        // Add Paddle to DOM
        this.div = document.createElement('paddle');
        document.body.appendChild(this.div);

        // width and height to detected collision 
        this.width = 159;
        this.height = 37;

        // Left and right arrow keys move paddle
        this.leftKey = 37;
        this.rightKey = 39;

        // startpositie paddle
        this.x = (window.innerWidth / 2) - 138;
        this.y = (window.innerHeight - 50) ;

        // eventlisteners on keys 
        window.addEventListener('keydown', (event : KeyboardEvent) => this.movePaddleOnKeyDown(event));
        window.addEventListener('keyup',   (event : KeyboardEvent) => this.stopPaddle(event));
    }

    private movePaddleOnKeyDown(event : KeyboardEvent):void {
        switch(event.keyCode) {
            case this.leftKey:
                this.leftSpeed = 15;
                break;
            case this.rightKey:
                this.rightSpeed = 15;
                break;
        }
    }

    private stopPaddle(event : KeyboardEvent) {
        switch(event.keyCode) {
            case this.leftKey:
                this.leftSpeed = 0;
                break;
            case this.rightKey:
                this.rightSpeed = 0;
                break;
        }
    }

    public update() : void {
        let targetX = this.x - this.leftSpeed + this.rightSpeed;
        if(targetX > -15 && targetX + 200 < window.innerWidth) this.x = targetX;
                        
        this.draw();
    }

    private draw() : void {
        this.div.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}