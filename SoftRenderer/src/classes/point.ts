export class Point {
    get X():number{return this[0];}
    set X(x:number){this[0] = x}
    get Y():number{return this[1];}
    set Y(y:number){this[0] = y}
    constructor(x:number,y:number){
        this[0] = x; this[1] = y;
    }
    [index:number]:number;
}

export class Vector2{
    get X():number{return this[0];}
    set X(x:number){this[0] = x}
    get Y():number{return this[1];}
    set Y(y:number){this[0] = y}
    constructor(x:number,y:number){
        this[0] = x; this[1] = y;
    }
    [index:number]:number;
}

export class Vector3{
    get X():number{return this[0];}
    set X(x:number){this[0] = x}
    get Y():number{return this[1];}
    set Y(y:number){ this[1] = y}
    get Z():number{return this[2];}
    set Z(z:number){ this[2] = z}
    constructor(x:number,y:number,z:number){
        this[0] = x; this[1] = y; this[2] = z;
    }

    [index:number]:number;

}

