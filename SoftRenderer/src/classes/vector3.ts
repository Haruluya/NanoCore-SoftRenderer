import { Vector2 } from "./vector2";

export class Vector3{
    get X():number{return this[0];}
    set X(x:number){this[0] = x;}
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
    getVec2(){
        return new Vector2(this.X,this.Y);
    }
    copy(){
        return new Vector3(this.X,this.Y,this.Z)
    }
    toIntVec(){
        return new Vector3(Math.floor(this.X),Math.floor(this.Y),Math.floor(this.Z))
    }
    [Symbol.iterator]() { 
        let index = 0,target = this;
        return { 
            next() :{done:boolean,value:number | undefined}{ 
                if (index < 3) { 
                    return { done: false, value: target[index++] }; 
                } else { 
                    return { done: true, value: undefined }; 
                } 
            } 
        }; 
    } 
       

}