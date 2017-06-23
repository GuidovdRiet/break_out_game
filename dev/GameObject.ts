class GameObject {
    protected div : HTMLElement;

    protected x : number;
    protected y : number;

    protected width : number;
    protected height : number;

    public collision(c1:any, c2:any): any {
        if(c1 || c2) {
            return !(c2.x > c1.x + c1.width || c2.x + c2.width < c1.x || c2.y > c1.y + c1.height || c2.y + c2.height < c1.y);
        }
    }
}