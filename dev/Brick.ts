class Brick {

    private div : HTMLElement;

    private x:number;
    private y:number;
    private width : number = 151;
    private height : number = 72;
    
    public status:boolean = true;

    constructor(r:number, c:number) {
        this.y = r * this.height + 20;
        this.x = c * this.width + ((window.innerWidth / 2) - 453);

        this.div = document.createElement('brick');
        document.body.appendChild(this.div);

        this.draw();
    }

    private draw() : void {
        this.div.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    public removeMyself() : void {
        this.status = false;
        this.div.remove();
    }
} 