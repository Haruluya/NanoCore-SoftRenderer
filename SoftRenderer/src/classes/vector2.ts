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
    [Symbol.iterator]() { 
        let index = 0,target = this;
        return { 
            next() :{done:boolean,value:number | undefined}{ 
                if (index < 2) { 
                    return { done: false, value: target[index++] }; 
                } else { 
                    return { done: true, value: undefined }; 
                } 
            } 
        }; 
    } 
}