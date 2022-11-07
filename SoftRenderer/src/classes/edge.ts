/*
    @author:haruluya
    @des:The obstraction of edge
    @params:{
        x:The starting x coordinate of the edge or the coordinate of the intersection of the edge and the scan line.
        dx:Reciprocal of the slope of an edge.
        ymax:The maximum y coordinate of the edge.
    }
*/
export class Edge {
    private x:number = 0;
    private dx:number = 0;
    private ymax:number = 0;
    constructor(x:number, dx:number, ymax:number) {
        this.x = x;
        this.dx = dx;
        this.ymax = ymax;
    }
    get X():number{return this.x;}
    set X(x:number){this.x = x;}
    get Dx():number{return this.dx;}
    set Dx(dx:number){this.dx = dx;}
    get Ymax():number{return this.ymax;}
    set Ymax(ymax:number){this.ymax = ymax;}

}
