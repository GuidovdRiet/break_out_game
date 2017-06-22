/// <reference path="GameObject.ts"/>

class Brick extends GameObject {
    
    public status:boolean = true;

    constructor(r:number, c:number) {
        super();

        this.width = 151;
        this.height = 72;

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