export default class Point {
    private x:number = 0;
    private y:number = 0;
    get X():number{return this.x;}
    set X(x:number){this.x = x;}
    get Y():number{return this.y;}
    set Y(y:number){this.y = y;}
    constructor(x:number,y:number){
        this.x = x; this.y = y;
    }
}