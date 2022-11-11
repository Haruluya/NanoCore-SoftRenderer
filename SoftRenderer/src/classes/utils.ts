
import {Point, Vector2, Vector3, Vector4} from "./point"
import { Polygon } from "./poloygon";
import { Edge } from "./edge";
import {Barycentric} from './math'
import { Model } from "./model";
import { Shader } from "./shaders/shader";

interface ImageData{
    data:Uint8ClampedArray,
    width:number,
    height:number,
    colorSpace:string
}

// zbuffer.
let zbuffer:Array<number> = [];

export const InitZBuffer = (width:number,height:number)=>{
    for (let i = 0; i < width * height; i++){
        zbuffer.push(-1 * MAX_DEEP);
    }
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


export const DrawPoint = (imgData:ImageData,x:number,y:number,color:Vector3)=>{
    
    
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


const MAX_DEEP = 9999;
const MIN_DEEP = -9999;


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
        let A =    t0.add(t2.sub(t0).mutiply(alpha))
        let B =    second_half? t1.add(t2.sub(t1).mutiply(beta)) :t0.add(t1.sub(t0).mutiply(beta))
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
let ix = 1;
export const DrawTriangleWithUV = (
    model:Model, 
    imgData:ImageData,
    screenCoords:Array<Vector3>,
    intensity:Array<number>,
    texCoord:Array<Vector2>
    )=>{

    let t0 = screenCoords[0], t1 = screenCoords[1], t2 = screenCoords[2];
    let ity0 = intensity[0], ity1 = intensity[1], ity2 = intensity[2];
    let uv0 = texCoord[0], uv1 = texCoord[1], uv2 = texCoord[2];
    if (t0.Y==t1.Y && t0.Y==t2.Y) return;
    if (t0.Y>t1.Y) {    
        let temp = t0;t0 = t1; t1 = temp;
        let temp2 = ity0; ity0 = ity1; ity1 = temp2;  
        let temp3 = uv0; uv0 = uv1; uv1 = temp3;
    };
    if (t0.Y>t2.Y) {
        let temp = t0;t0 = t2;t2 = temp;
        let temp2 = ity0; ity0 = ity2; ity2 = temp2;  
        let temp3 = uv0; uv0 = uv2; uv2 = temp3;
    };
    if (t1.Y>t2.Y){
        let temp = t1;t1 = t2;t2 = temp; 
        let temp2 = ity1; ity1 = ity2; ity2 = temp2;  
        let temp3 = uv1; uv1 = uv2; uv2 = temp3;
    };
    let total_height = t2.Y-t0.Y;
    for (let i=0; i< total_height; i++) {

        let second_half = i>t1.Y-t0.Y || t1.Y==t0.Y;
        let segment_height = second_half ? t2.Y-t1.Y : t1.Y-t0.Y;

        let alpha = i/total_height;
        let beta  = (i-(second_half ? t1.Y-t0.Y : 0))/segment_height; 


        let A =    t0.add(t2.sub(t0).mutiply(alpha))
        let B =    second_half? t1.add(t2.sub(t1).mutiply(beta)) :t0.add(t1.sub(t0).mutiply(beta))
        
        let ityA = ity0 + (ity2-ity0)*alpha;
        let ityB = second_half? ity1 + (ity2-ity1)*beta : ity0 + (ity1-ity0)*beta;
        
        let uvA = uv0.add(uv2.sub(uv0).mutiply(alpha))
        let uvB = second_half ?  uv1.add(uv2.sub(uv1).mutiply(beta)): uv0.add(uv1.sub(uv0).mutiply(beta));



        
        if (A.X>B.X){
            let temp = A;A = B;B = temp;
            let temp2 = ityA; ityA = ityB; ityB = temp2;
            let temp3 = uvA; uvA = uvB; uvB = temp3;
        };

        for (let j=A.X; j<=B.X; j++) {
            let phi = B.X == A.X? 1.:(j-A.X)/(B.X-A.X);
            let P = A.add(B.sub(A).mutiply(phi))
            let ityP = ityA + (ityB-ityA)*phi;
            ityP = Math.min(1.,Math.abs(ityP)+0.01);

            let uvP = uvA.add(uvB.sub(uvA).mutiply(phi));

            if (P.X < imgData.width && P.Y < imgData.height)
            {
                let idx = Math.floor(P.X+P.Y*imgData.width);

                if (zbuffer[idx] < P.Z ){
                    zbuffer[idx] = P.Z;

                    let color = getDiffuseByUV(model,uvP);

                    DrawPoint(imgData,P.X,P.Y,color.mutiply(ityP));
                }
            }
        }
    }
}


export const DrawTriangleWithShader = (
    shader:Shader,
    imgData:ImageData,
    screenCoords:Array<Vector4>
    )=>{


    let bboxmin:Vector2 = new Vector2(MAX_DEEP,MAX_DEEP);
    let bboxmax:Vector2 = new Vector2(MIN_DEEP,MIN_DEEP);

    for (let i=0; i<3; i++) {
        for (let j=0; j<2; j++) {
            bboxmin[j] = Math.min(bboxmin[j], screenCoords[i][j]/screenCoords[i][3]);
            bboxmax[j] = Math.max(bboxmax[j], screenCoords[i][j]/screenCoords[i][3]);
        }
    }



    // Do not use point or vec2, web engine can not handle.
    for (let i=bboxmin.X; i<=bboxmax.X; i++) {

        for (let j =bboxmin.Y; j <bboxmax.Y; j++) {

            let c:Vector3  = Barycentric(screenCoords[0].getVec2(), screenCoords[1].getVec2(), screenCoords[2].getVec2(), new Vector2(i,j));

            let zP = (screenCoords[0][2]/screenCoords[0][3])*c.X 
                    +(screenCoords[0][2]/screenCoords[1][3])*c.Y
                    +(screenCoords[0][2]/screenCoords[2][3])*c.Z  

            if (c.X<0 || c.Y<0 || c.Z<0 ) continue;
            let {discard,color} = shader.fragment(c);
            

            if (!discard){
                if (zbuffer[Math.floor(i+j* imgData.width)] < zP) {
                    zbuffer[Math.floor(i+j* imgData.width)] = zP;
                    DrawPoint(imgData,i,j,color);
                }
            }

        }

       
    }
        
}

