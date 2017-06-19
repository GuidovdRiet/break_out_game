class Heart {

    public div : HTMLElement;
    public h2 : HTMLElement;

    private x   : number;
    private y   : number;

    private width : number;
    private height : number; 

    public status:boolean = true;
    public attempts : number;

    constructor(i : number) {
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

    public removeMyself(): void {
        this.status = false;
        this.div.remove();
    }

    public draw(): void {
        this.div.style.transform = `translate(${this.x}px, ${this.y}px)`;     
    }
}