
import {Point, Vector2, Vector3} from "./point"
import { Polygon } from "./poloygon";
import { Edge } from "./edge";
import {Barycentric} from './math'

interface ImageData{
    data:Uint8ClampedArray,
    width:number,
    height:number,
    colorSpace:string
}
export const DrawLine = (ctx:any,beginPoint:Point,endPoint:Point,color:Vector3 )=>{
    ctx.beginPath();
    ctx.moveTo(beginPoint.X, beginPoint.Y);
    ctx.lineTo(endPoint.X, endPoint.Y);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
}

export const DrawLineByBresenham = (imgData:ImageData,beginPoint:Point,endPoint:Point,color:Vector3):void=>{
    let temp = null;
    let m, x, y = 0;
    let e = -0.5;


    //Horizontal line.
    if (beginPoint.Y == endPoint.Y) {
        if (beginPoint.X > endPoint.X) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        for (x = beginPoint.X; x < endPoint.X; x++)
            DrawPoint(imgData,x, beginPoint.Y, color);
        return;
    }
    //Vertical line.
    if (beginPoint.X == endPoint.X) {
        if (beginPoint.Y > endPoint.Y) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        for (y = beginPoint.Y; y < endPoint.Y; y++)
            DrawPoint(imgData,beginPoint.X, y, color);
        return;
    }

    m = (endPoint.Y - beginPoint.Y) / (endPoint.X - beginPoint.X);
    if (m > 0 && m <= 1) {
        if (beginPoint.X > endPoint.X) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = -0.5;
        x = beginPoint.X;
        y = beginPoint.Y;
        while (x < endPoint.X) {
            DrawPoint(imgData,x, y, color);
            e = e + m;
            if (e > 0) {
                y++;
                e = e - 1;
            }
            x++;
        }
    } else if (m >= -1 && m < 0) {
        if (beginPoint.X > endPoint.X) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = 0.5;
        x = beginPoint.X;
        y = beginPoint.Y;
        while (x < endPoint.X) {
            DrawPoint(imgData, x, y, color);
            e = e + m;
            if (e < 0) {
                y--;
                e = e + 1;
            }
            x++;
        }
    } else if (m > 1) {
        if (beginPoint.Y > endPoint.Y) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = -0.5;
        x = beginPoint.X;
        y = beginPoint.Y;
        while (y < endPoint.Y) {
            DrawPoint(imgData, x, y, color);
            e = e + 1 / m;
            if (e > 0) {
                x = x + 1;
                e = e - 1;
            }
            y++;
        }
    } else {
        if (beginPoint.Y > endPoint.Y) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = 0.5;
        x = beginPoint.X;
        y = beginPoint.Y;
        while (y < endPoint.Y) {
            DrawPoint(imgData, x, y, color);
            e = e + 1 / m;
            if (e < 0) {
                x--;
                e = e + 1;
            }
            y++;
        }
    }
}


const DrawPoint = (imgData:ImageData,x:number,y:number,color:Vector3)=>{
    
    
    var pixelData = imgData.data;
    if (x > imgData.width || x < 0 || y > imgData.height || y < 0){
        return;
    }

    x = Math.floor(x);
    y = Math.floor(y);
    const pixelIndex = (x+y*imgData.width)*4;
    
    pixelData[pixelIndex+0] = color.X;
    pixelData[pixelIndex+1] = color.Y;
    pixelData[pixelIndex+2] = color.Z;
    pixelData[pixelIndex+3] = 255;

}





const MAX_DEEP = 999;
const MIN_DEEP = -999;



export const DrawTriangleWithZBuffer = (zbuffer:Array<number>,imgData:ImageData,pointArray:Array<Vector3>,color:Vector3)=>{
    let deepMax:Vector2 = new Vector2(MIN_DEEP,MIN_DEEP);
    let deepMin:Vector2 = new Vector2(MAX_DEEP,MAX_DEEP);
    let clamp = new Vector2(imgData.width-1,imgData.height-1);
    for (let i=0; i<3; i++) {
        for (let j=0; j<2; j++) {
            deepMin[j] = Math.max(0,      Math.min(deepMin[j], Math.floor(pointArray[i][j])));
            deepMax[j] = Math.min(clamp[j], Math.max(deepMax[j], Math.floor(pointArray[i][j])));
        }
    }

    let P:Vector3 = new Vector3(0,0,0);
    for (P.X=deepMin.X; P.X<=deepMax.X; P.X++) {

        for (P.Y=deepMin.Y; P.Y<=deepMax.Y; P.Y++) {

            let bcScreen:Vector3  = Barycentric(pointArray[0], pointArray[1], pointArray[2], P);

            if (bcScreen.X<0 || bcScreen.Y<0 || bcScreen.Z<0) continue;
            P.Z = 0;
            for (let i=0; i<3; i++) P.Z += pointArray[i][2]*bcScreen[i];
            if (zbuffer[Math.floor(P.X+P.Y* imgData.width)]<P.Z) {
                zbuffer[Math.floor(P.X+P.Y* imgData.width)] = P.Z;
                DrawPoint(imgData,P.X,P.Y,color);
            }
            
        }
    }
}





export const DrawTriangleByEdgeTablePolygon = (imgData:ImageData,pointArray:Array<Point>,color:Vector3)=>{
    // EdgeTablePolygon.
    // check amount of point.
    
    const points = new Polygon(pointArray);

    if (points.size() < 3)
        return;
    let i, j, x0 = 0, x1 = 0, y, tx, temp;
    // amount of scanline.
    let scanLines, min, max;

    //edge table.
    let ET:any = {};
    //active edge table.
    let AET:Array<Edge> = [];
    //table of intersection point.
    let arr:Array<number> = [];
    //begin point.
    let p0;
    //end point.
    let p1;
    // ptr of node.
    let pNode;

    min = points.minPointY();
    max = points.maxPointY();
    scanLines = max - min;

    //Processing side by side, inserting the information of each edge into the ET.
    for (let i = 0; i < points.size(); i++) {
        if (i < points.size() - 1) {
            p0 = points.indexValue(i);
            p1 = points.indexValue(i + 1);
        }
        else {
            p0 = points.indexValue(i);
            p1 = points.indexValue(0);
        }

        if (p0.Y > p1.Y) {
            temp = p0;
            p0 = p1;
            p1 = temp;
        }

        if (p0.Y != p1.Y) {
            pNode = new Edge(p0.X, (p1.X - p0.X) / (p1.Y - p0.Y), (p1.Y - 1));
            if (!ET[p0.Y - min]) {
                ET[p0.Y - min] = [];
            }

            ET[p0.Y - min].push(pNode);
        }

    }

    for (let i = 0; i < scanLines; i++) {

        y = i + min;
        if (ET[i]) {
            ET[i].forEach(element => {
                AET.push(element);
            });

        }
        ET[i] = null;

        //Dealing with active edge table AET.
        if (AET) {
            for (let i = 0; i < AET.length;) {
                if (AET[i].Ymax < y) {
                    AET.splice(i, 1);

                } else {
                    i++;
                }
            }
        }
        //Activate the edge table is not empty, find the intersection, sort, draw a line.
        if (AET) {

            AET.forEach(element => {
                arr.push(element.X);
                element.X = element.X + element.Dx;
            });

            arr.sort();

            for (j = 0; j < arr.length; j++) {
                if (j % 2 == 0) {
                    tx = arr[j];
                    if (arr[j] - tx)
                        x0 = tx + 1;
                    else
                        x0 = tx;
                    x1 = arr[j + 1];
                }
                DrawLineByBresenham(imgData,new Point(x0,y),new Point(x1, y),color);
            }
            arr = [];
        }
    }
    ET = [];
}


export const DrawTriangle = (imgData:ImageData,t0:Point,t1:Point,t2:Point)=>{
    if (t0.Y==t1.Y && t0.Y==t2.Y) return;
    if (t0.Y>t1.Y) {    
        let temp = t0;
        t0 = t1;
        t1 = temp;
    };
    if (t0.Y>t2.Y) {
        let temp = t0;
        t0 = t2;
        t2 = temp;
    };
    if (t1.Y>t2.Y){
        let temp = t1;
        t1 = t2;
        t2 = temp; 
    };
    console.log(t0,t1,t2)
    let total_height = t2.Y-t0.Y;
    console.log(total_height)
    for (let i=0; i< total_height; i++) {
        //根据t1将三角形分割为上下两部分
        let second_half = i>t1.Y-t0.Y || t1.Y==t0.Y;
        let segment_height = second_half ? t2.Y-t1.Y : t1.Y-t0.Y;
        let alpha = i/total_height;
        let beta  = (i-(second_half ? t1.Y-t0.Y : 0))/segment_height; 
        //计算A,B两点的坐标
        let A =    new Point(t0.X+(t2.X-t0.X)*alpha,t0.X+(t2.X-t0.X)*alpha);
        let B = second_half ? new Point(t1.X+(t2.X-t1.X)*alpha,t0.X+(t2.X-t1.X)*alpha)
                 : new Point(t0.X+(t1.X-t0.X)*alpha,t0.X+(t1.X-t0.X)*alpha);;
        if (A.X>B.X){
            let temp = A;
            A = B;
            B = temp;
        };
        //根据A,B和当前高度对tga着色
        for (let j=A.X; j<=B.X; j++) {
            DrawPoint(imgData,j,t0.Y+i,"");
        }
    }
}

