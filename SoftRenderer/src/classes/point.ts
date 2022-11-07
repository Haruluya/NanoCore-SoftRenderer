export class Point {
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

export class Vector2{
    private x:number = 0;
    private y:number = 0;
    get X():number{return this.x;}
    set X(x:number){this.x = x;}
    get Y():number{return this.y;}
    set Y(y:number){this.y = y;}
    constructor(x:number,y:number){
        this.x = x; this.y = y;
        this[0] = x; this[1] = y;
    }  

    [index:number]:number;
}

export class Vector3{
    private x:number = 0;
    private y:number = 0;
    private z:number = 0;
    get X():number{return this.x;}
    set X(x:number){this.x = x;}
    get Y():number{return this.y;}
    set Y(y:number){this.y = y;}
    get Z():number{return this.z;}
    set Z(z:number){this.z = z;}
    constructor(x:number,y:number,z:number){
        this.x = x; this.y = y;this.z = z;
        this[0] = x; this[1] = y; this[2] = z;
    }

    [index:number]:number;

}

