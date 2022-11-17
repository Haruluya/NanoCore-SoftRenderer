import { Edge } from "../../classes/edge";
import { Point } from "../../classes/point";
import { Polygon } from "../../classes/poloygon";
import { Vector3 } from "../../classes/vector3";
import { Barycentric, vectorMultiply } from "../../classes/math";
import { Vector2 } from "../../classes/vector2";
import { ZbufferPageCache } from "/classes/zbufferPageCache";
import { Vector4 } from "../../classes/vector4";

const MAX_DEEP = 9999;

//cache.
let normalCache:Array<Array<number>> = [];
let pointCache:Array<Array<number>> = [];



export const InitCacheCtx = (cache:ZbufferPageCache)=>{
    console.log(cache)
    normalCache = cache.normals;
    pointCache = cache.points;
}


// zbuffer.
let zbuffer:Array<number> = [];
let canvasWidth = 0, canvasHeight = 0;

export const InitZBuffer = (width:number,height:number)=>{
    canvasWidth = width; canvasHeight = height;
    for (let i = 0; i < width * height; i++){
        zbuffer.push(-1 * MAX_DEEP);
    }
}




export const ClearBuffer = ()=>{
    for(let i = 0; i < zbuffer.length; i++){
        zbuffer[i] = -1*MAX_DEEP;
    }
}

export const DrawPointByImgData = (
    imgData:ImageData,
    x:number,y:number,
    color:Vector3,
    )=>{
    
    
    let pixelData = imgData.data;
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

export const DrawGrid = (
    ctx:CanvasRenderingContext2D,
    girdSize:number,
    width:number,
    height:number,
    ) => {
    let xLineTotals = Math.floor(height / girdSize);
    let yLineTotals = Math.floor(width / girdSize);
    for (let i = 0; i < xLineTotals; i++) {
        ctx.beginPath();
        ctx.moveTo(0, girdSize * i);
        ctx.lineTo((yLineTotals - 1) * girdSize, girdSize * i);
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
    }
    for (let j = 0; j < yLineTotals; j++) {
        ctx.beginPath();
        ctx.moveTo(girdSize * j, 0);
        ctx.lineTo(girdSize * j, (xLineTotals - 1) * girdSize);
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
    }

}


let ix = 0;
export const DrawTriangleWithZBufferByCavasAPI = (
    ctx:CanvasRenderingContext2D,
    verts:Array<Vector3>,
    tNormals:Array<Vector3>,
    color:Vector3,
    )=>{
    let pointArray = verts;
    let deepMax:Vector2 = new Vector2(-1*MAX_DEEP,-1*MAX_DEEP);
    let deepMin:Vector2 = new Vector2(MAX_DEEP,MAX_DEEP);
    let clamp = new Vector2(canvasWidth-1,canvasHeight-1);
    for (let i=0; i<3; i++) {
        for (let j=0; j<2; j++) {
            deepMin[j] = Math.max(0,      Math.min(deepMin[j], Math.floor(pointArray[i][j])));
            deepMax[j] = Math.min(clamp[j], Math.max(deepMax[j], Math.floor(pointArray[i][j])));
        }
    }

    let P:Vector3 = new Vector3(0,0,0);
    let pNormal:Vector3 = new Vector3(0,0,0);
    let bcScreen:Vector3 = new Vector3(0,0,0);

    for (P.X=deepMin.X; P.X<=deepMax.X; P.X++) {
        for (P.Y=deepMin.Y; P.Y<=deepMax.Y; P.Y++) {
            bcScreen =  Barycentric(pointArray[0], pointArray[1], pointArray[2], P);
            if (bcScreen.X<0 || bcScreen.Y<0 || bcScreen.Z<0) {
                continue;
            };
            P.Z = 0;
            for (let i=0; i<3; i++) {
                P.Z += pointArray[i][2]*bcScreen[i];
                pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
            }


            let intensity = vectorMultiply(pNormal,new Vector3(0,0,1));
            

            if (zbuffer[Math.floor(P.X+P.Y* canvasWidth)]<P.Z) {
                zbuffer[Math.floor(P.X+P.Y* canvasWidth)] = P.Z;
                //cache

                DrawPointByCanvasAPI(ctx,P.X,P.Y,color.mutiply(intensity));
                normalCache.push([pNormal.X,pNormal.Y,pNormal.Z]);
                pointCache.push([P.X,P.Y,P.Z]);
            }
        }
    }

}
            



export const DrawPointByCanvasAPI = (
    ctx:CanvasRenderingContext2D,
    x0:number,
    y0:number,
    color:Vector3
)=>{
    ctx.fillStyle = 'rgb('+color.X+','+color.Y+','+color.Z+')';
    ctx.fillRect(x0,y0,1,1);
}

export const DrawTriangleByImageDataWithZBuffer = (
    imgData:ImageData,
    verts:Array<Vector3>,
    tNormals:Array<Vector3>,
    color:Vector3
    )=>{
    // EdgeTablePolygon.
    // check amount of point.
    
    const points = new Polygon(verts);

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
                DrawLineByBresenham(imgData,new Point(x0,y),new Point(x1, y),verts,tNormals,color);
            }
            arr = [];
        }
    }
    ET = [];
}

export const DrawLineByBresenham = (
    imgData:ImageData,
    beginPoint:Point,
    endPoint:Point,
    verts:Array<Vector3>,
    tNormals:Array<Vector3>,
    color:Vector3,
    ):void=>{
    let temp = null;
    let m, x, y = 0;
    let e = -0.5;
    let P = new Vector3(0,0,0);
    //Barycentric.
    let bcScreen = new Vector3(0,0,0);
    let pNormal = new Vector3(0,0,0);
    let intensity = 0;

    //Horizontal line.
    if (beginPoint.Y == endPoint.Y) {
        if (beginPoint.X > endPoint.X) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        for (x = beginPoint.X; x < endPoint.X; x++)
        {
            P.X = x, P.Y = beginPoint.Y;P.Z = 0;
            bcScreen =  Barycentric(verts[0], verts[1], verts[2], P);
            for (let i=0; i<3; i++) {
                P.Z += verts[i][2]*bcScreen[i];
                pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
            }


            intensity = vectorMultiply(pNormal,new Vector3(0,0,1));

            if (zbuffer[Math.floor(P.X+P.Y* canvasWidth)]<P.Z) {
                zbuffer[Math.floor(P.X+P.Y* canvasWidth)] = P.Z;
                //cache.
                normalCache.push([pNormal.X,pNormal.Y,pNormal.Z]);
                pointCache.push([P.X,P.Y,P.Z]);
                ix++;
                DrawPointByImgData(imgData,P.X, P.Y, color.mutiply(intensity));
            }
        }
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
        {
            P.X = beginPoint.X, P.Y = y;P.Z = 0;
            bcScreen =  Barycentric(verts[0], verts[1], verts[2], P);
            for (let i=0; i<3; i++) {
                P.Z += verts[i][2]*bcScreen[i];
                pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
            }

            intensity = vectorMultiply(pNormal,new Vector3(0,0,1));

            if (zbuffer[Math.floor(P.X+P.Y* canvasWidth)]<P.Z) {
                zbuffer[Math.floor(P.X+P.Y* canvasWidth)] = P.Z;
                //cache.
                normalCache.push([pNormal.X,pNormal.Y,pNormal.Z]);
                pointCache.push([P.X,P.Y,P.Z]);
                ix++;
                DrawPointByImgData(imgData,P.X, P.Y, color.mutiply(intensity));
            }
        }

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
            {
                P.X = x, P.Y = y;P.Z = 0;
                bcScreen =  Barycentric(verts[0], verts[1], verts[2], P);
                for (let i=0; i<3; i++) {
                    P.Z += verts[i][2]*bcScreen[i];
                    pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
                }

                intensity = vectorMultiply(pNormal,new Vector3(0,0,1));
    
                if (zbuffer[Math.floor(P.X+P.Y* canvasWidth)]<P.Z) {
                    zbuffer[Math.floor(P.X+P.Y* canvasWidth)] = P.Z;
                    //cache.
                    normalCache.push([pNormal.X,pNormal.Y,pNormal.Z]);
                    pointCache.push([P.X,P.Y,P.Z]);
                    DrawPointByImgData(imgData,P.X, P.Y, color.mutiply(intensity));
                }
            }

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
            {
                P.X = x, P.Y = y;P.Z = 0;
                bcScreen =  Barycentric(verts[0], verts[1], verts[2], P);
                for (let i=0; i<3; i++) {
                    P.Z += verts[i][2]*bcScreen[i];
                    pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
                }
                intensity = vectorMultiply(pNormal,new Vector3(0,0,1));
    
                if (zbuffer[Math.floor(P.X+P.Y* canvasWidth)]<P.Z) {
                    zbuffer[Math.floor(P.X+P.Y* canvasWidth)] = P.Z;
                    //cache.
                    normalCache.push([pNormal.X,pNormal.Y,pNormal.Z]);
                    pointCache.push([P.X,P.Y,P.Z]);
                    DrawPointByImgData(imgData,P.X, P.Y, color.mutiply(intensity));
                }
            }
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
            {
                P.X = x, P.Y = y;P.Z = 0;
                bcScreen =  Barycentric(verts[0], verts[1], verts[2], P);
                for (let i=0; i<3; i++) {
                    P.Z += verts[i][2]*bcScreen[i];
                    pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
                }

                intensity = vectorMultiply(pNormal,new Vector3(0,0,1));
    
                if (zbuffer[Math.floor(P.X+P.Y* canvasWidth)]<P.Z) {
                    zbuffer[Math.floor(P.X+P.Y* canvasWidth)] = P.Z;
                    //cache.
                    normalCache.push([pNormal.X,pNormal.Y,pNormal.Z]);
                    pointCache.push([P.X,P.Y,P.Z]);
                    DrawPointByImgData(imgData,P.X, P.Y, color.mutiply(intensity));
                }
            }
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
            {
                P.X = x, P.Y = y;P.Z = 0;
                bcScreen =  Barycentric(verts[0], verts[1], verts[2], P);
                for (let i=0; i<3; i++) {
                    P.Z += verts[i][2]*bcScreen[i];
                    pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
                }
                intensity = vectorMultiply(pNormal,new Vector3(0,0,1));
    
                if (zbuffer[Math.floor(P.X+P.Y* canvasWidth)]<P.Z) {
                    zbuffer[Math.floor(P.X+P.Y* canvasWidth)] = P.Z;

                    //cache.
                    normalCache.push([pNormal.X,pNormal.Y,pNormal.Z]);
                    pointCache.push([P.X,P.Y,P.Z]);
                    DrawPointByImgData(imgData,P.X, P.Y, color.mutiply(intensity));
                }
            }
            e = e + 1 / m;
            if (e < 0) {
                x--;
                e = e + 1;
            }
            y++;
        }
    }
}

export const DrawModelByImageDataWithZBufferAndCache = ( 
    imgData:ImageData,color:Vector3,offset:{x:number,y:number},lightDir:Vector3,
)=>{

    let intensity = 0;
    let normalVec3 = new Vector3(0,0,0);
    let p = new Vector3(0,0,0);
    pointCache.forEach((e,i)=>{
        p.X = e[0]; p.Y = e[1];p.Z = e[2];
        normalVec3.X = normalCache[i][0] 
        normalVec3.Y = normalCache[i][1]; 
        normalVec3.Z = normalCache[i][2];
        intensity = vectorMultiply(normalVec3,lightDir);
        DrawPointByImgData(imgData,p.X+offset.x, p.Y+offset.y, color.mutiply(intensity));
    })
}


export const DrawModelByCanvasAPIWithZBufferAndCache = ( 
    ctx:CanvasRenderingContext2D,color:Vector3,offset:{x:number,y:number},lightDir:Vector3
)=>{
    
    let intensity = 0;
    let normalVec3 = new Vector3(0,0,0);
    pointCache.forEach((P,i)=>{
        normalVec3.X = normalCache[i][0] 
        normalVec3.Y = normalCache[i][1]; 
        normalVec3.Z = normalCache[i][2];
        intensity = vectorMultiply(normalVec3,lightDir);
        DrawPointByCanvasAPI(ctx,P[0]+offset.x, P[1]+offset.y, color.mutiply(intensity));
    })
}

export const DrawTriangleInGridWithZBufferAndCache = (
    ctx:CanvasRenderingContext2D,gridSize:number,color:Vector3,offset:{x:number,y:number},lightDir:Vector3
)=>{
    
    let intensity = 0;
    let normalVec3 = new Vector3(0,0,0);
    pointCache.forEach((P,i)=>{
        normalVec3.X = normalCache[i][0] 
        normalVec3.Y = normalCache[i][1]; 
        normalVec3.Z = normalCache[i][2];
        intensity = vectorMultiply(normalVec3,lightDir);
        DrawPointInGrid(ctx,gridSize,P[0]+offset.x, P[1]+offset.y, color.mutiply(intensity));
    })
}

export const DrawTriangleInGridWithZBuffer = (
    ctx:CanvasRenderingContext2D,
    gridSize:number,
    verts:Array<Vector3>,
    tNormals:Array<Vector3>,
    color:Vector3,
    )=>{
    let pointArray = verts;
    let deepMax:Vector2 = new Vector2(-1*MAX_DEEP,-1*MAX_DEEP);
    let deepMin:Vector2 = new Vector2(MAX_DEEP,MAX_DEEP);
    let clamp = new Vector2(canvasWidth-1,canvasHeight-1);
    for (let i=0; i<3; i++) {
        for (let j=0; j<2; j++) {
            deepMin[j] = Math.max(0,      Math.min(deepMin[j], Math.floor(pointArray[i][j])));
            deepMax[j] = Math.min(clamp[j], Math.max(deepMax[j], Math.floor(pointArray[i][j])));
        }
    }

    let P:Vector3 = new Vector3(0,0,0);
    let pNormal:Vector3 = new Vector3(0,0,0);
    let bcScreen:Vector3 = new Vector3(0,0,0);

    for (P.X=deepMin.X; P.X<=deepMax.X; P.X++) {
        for (P.Y=deepMin.Y; P.Y<=deepMax.Y; P.Y++) {
            bcScreen =  Barycentric(pointArray[0], pointArray[1], pointArray[2], P);
            if (bcScreen.X<0 || bcScreen.Y<0 || bcScreen.Z<0) {
                continue;
            };
            P.Z = 0;
            for (let i=0; i<3; i++) {
                P.Z += pointArray[i][2]*bcScreen[i];
                pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
            }


            let intensity = vectorMultiply(pNormal,new Vector3(0,0,1));
            

            if (zbuffer[Math.floor(P.X+P.Y* canvasWidth)]<P.Z) {
                zbuffer[Math.floor(P.X+P.Y* canvasWidth)] = P.Z;
                //cache

                DrawPointInGrid(ctx,gridSize,P.X,P.Y,color.mutiply(intensity));
                normalCache.push([pNormal.X,pNormal.Y,pNormal.Z]);
                pointCache.push([P.X,P.Y,P.Z]);
            }
        }
    }

}
export const DrawPointInGrid = (
    ctx:CanvasRenderingContext2D,
    gridSize:number,
    gridx:number, 
    gridy:number,
    color:Vector3
)=>{
    // cant overflow.
    if (gridx > Math.floor(canvasWidth / gridSize) - 1 || gridx < 0 ||
        gridy > Math.floor(canvasHeight / gridSize) - 1 || gridy < 0)
        return;



    let rectx = gridx * gridSize;
    let recty = gridy * gridSize;


    ctx.fillStyle = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
    ctx.fillRect(rectx, recty, gridSize, gridSize);

}

export const Hex2Rgb  = (colorHex:string)=>{

    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let color = colorHex.toLowerCase();
    if (reg.test(color)) {
      if (color.length === 4) {
        let colorNew = "#";
        for (let i = 1; i < 4; i += 1) {
          colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
        }
        color = colorNew;
      }
      let colorChange = [];
      for (let i = 1; i < 7; i += 2) {
        colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
      }
      return colorChange;
    } else {
      return [0,0,0];
    }
}