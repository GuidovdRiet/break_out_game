class Score {

    public div : HTMLElement;
    public h2 : HTMLElement;

    private x   : number;
    private y   : number;

    private width : number;
    private height : number; 

    public status:boolean = true;
    public attempts : number = 0;

    constructor(i : number) {
        this.width = 44;
        this.height = 40;

        this.x = 20;
        this.y = (i * this.width) + 60;

        this.div = document.createElement('heart');
        this.div.classList.add('heart');
        document.body.appendChild(this.div);

        this.draw();
    }

    public removeMyself() : void {
        this.status = false;
        this.div.remove();
    }

    public addAttempt() : void {
        this.attempts++;
        console.log(this.attempts);
        this.h2 = document.createElement('h2'); 
        this.h2.innerHTML = `Fails: ${this.attempts}`;
        document.body.appendChild(this.h2);
    }

    public draw() : void {
        this.div.style.transform = `translate(${this.x}px, ${this.y}px)`;     
    }
}