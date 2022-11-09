export class Point {
    get X():number{return this[0];}
    set X(x:number){this[0] = x}
    get Y():number{return this[1];}
    set Y(y:number){this[0] = y}
    constructor(x:number,y:number){
        this[0] = x; this[1] = y;
    }
    [index:number]:number;
    add(b:Point){
        return new Point(
            this.X + b.X,
            this.Y + b.Y
        )
    }
    sub(b:Vector2){
        return new Vector2(
            this.X - b.X,
            this.Y - b.Y
        )
    }
    mutiply(t:number){
        return new Vector2(
            this.X *t,
            this.Y *t,
        )
    }
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
    add(b:Vector2){
        return new Vector2(
            this.X + b.X,
            this.Y + b.Y
        )
    }
    sub(b:Vector2){
        return new Vector2(
            this.X - b.X,
            this.Y - b.Y
        )
    }
    mutiply(t:number){
        return new Vector2(
            this.X *t,
            this.Y *t,
        )
    }

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
    add(b:Vector3){
        return new Vector3(
            this.X + b.X,
            this.Y + b.Y,
            this.Z + b.Z
        )
    }
    sub(b:Vector3){
        return new Vector3(
            this.X - b.X,
            this.Y - b.Y,
            this.Z - b.Z
        )
    }
    mutiply(t:number){
        return new Vector3(
            this.X *t,
            this.Y *t,
            this.Z *t
        )
    }
}

export class Vector4{
    get X():number{return this[0];}
    set X(x:number){this[0] = x}
    get Y():number{return this[1];}
    set Y(y:number){ this[1] = y}
    get Z():number{return this[2];}
    set Z(z:number){ this[2] = z}
    get W():number{return this[3];}
    set W(z:number){ this[3] = z}
    constructor(x:number,y:number,z:number,w:number){
        this[0] = x; this[1] = y; this[2] = z;this[3] = w;
    }

    [index:number]:number;
    add(b:Vector4){
        return new Vector4(
            this.X + b.X,
            this.Y + b.Y,
            this.Z + b.Z,
            this.W + b.W
        )
    }
    sub(b:Vector4){
        return new Vector4(
            this.X - b.X,
            this.Y - b.Y,
            this.Z - b.Z,
            this.W - b.W
        )
    }
    mutiply(t:number){
        return new Vector4(
            this.X *t,
            this.Y *t,
            this.Z *t,
            this.W*=t
        )
    }
}