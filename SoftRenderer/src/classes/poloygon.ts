/*
    @author:haruluya
    @des:The obstraction of polygon
    @params:{
        points:the points of polygon.
    }
*/
import { Point } from "./point";
export class Polygon{
    private points:Array<Point> = [];

    constructor(points:Array<Point>){
        this.points = points
    }
    maxPointX(){
        let max = 0;
        this.points.forEach(element => {
            max = max > element.X ? max : element.X;
        });
        return max;
    }
    minPointX(){
        let min = this.maxPointX();
        this.points.forEach(element =>{
            min = min < element.X ? min : element.X;
        })
        return min;
    }
    maxPointY(){
        let max = 0;
        this.points.forEach(element => {
            max = max > element.Y ? max : element.Y;
        });
        return max;
    }
    minPointY(){
        let min = this.maxPointX();
        this.points.forEach(element =>{
            min = min < element.Y ? min : element.Y;
        })
        return min;
    }
    size(){
        return this.points.length;
    }
    indexValue(index:number){
        return this.points[index];
    }
}
