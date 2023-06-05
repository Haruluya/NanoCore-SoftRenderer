import { Edge } from "../../classes/edge";
import { Point } from "../../classes/point";
import { Polygon } from "../../classes/poloygon";
import { Vector3 } from "../../classes/vector3";
import { Barycentric, m2v4, matrixMutiply, vectorMultiply } from "../../classes/math";
import { Vector2 } from "../../classes/vector2";
import { ZbufferPageCache } from "../../classes/zbufferPageCache";
import { TransformMatrix } from "../../classes/transformMatrix";
import { Vector4 } from "../../classes/vector4";

const MAX_DEEP = 9999;

//cache.
let normalCache:Array<Array<number>> = [];
let pointCache:Array<Array<number>> = [];



export const InitCacheCtx = (cache:ZbufferPageCache)=>{
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

export const DrawTriangleByImageDataWithZBuffer = (
    imgData:ImageData,
    lightDir:Vector3,
    verts:Array<Vector3>,
    tNormals:Array<Vector3>,
    color:Vector3,
    )=>{
    // EdgeTablePolygon.
    // check amount of point.
    let tNormalsArray:Array<Array<number>> = [[...tNormals[0]],[...tNormals[1]],[...tNormals[2]],]
    let vertsArray:Array<Array<number>> = [[...verts[0]],...[verts[1]],...[verts[2]]]

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

        if (p0.Y > p1.Y ) {
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

   
                DrawLineByBresenham(imgData,lightDir,new Point(x0,y),new Point(x1, y),vertsArray,tNormalsArray,color);
            }
            arr = [];
        }
    }
    ET = [];
}


let pNormal = new Vector3(0,0,0);
let P = new Vector3(0,0,0);
export const DrawLineByBresenham = (
    imgData:ImageData,
    lightDir:Vector3,
    beginPoint:Array<number>,
    endPoint:Array<number>,
    verts:Array<Array<number>>,
    tNormals:Array<Array<number>>,
    color:Vector3,
    ):void=>{
    let temp = null;
    let m, x, y = 0;
    let e = -0.5;
    //Barycentric.
    let bcScreen = [];

    let intensity = 0;


    //Horizontal line.
    if (beginPoint[1] == endPoint[1]) {
        if (beginPoint[0] > endPoint[0]) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        for (x = beginPoint[0]; x < endPoint[0]; x++)
        {
            P[0] = x, P[1] = beginPoint[1];P.Z = 0;
            bcScreen =  Barycentric(verts[0], verts[1], verts[2], P);
            for (let i=0; i<3; i++) {
                P.Z += verts[i][2]*bcScreen[i];
                pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
            }

            intensity = vectorMultiply(pNormal,lightDir);

            if (zbuffer[Math.floor(P[0]+P[1]* canvasWidth)]<P.Z) {
                zbuffer[Math.floor(P[0]+P[1]* canvasWidth)] = P.Z;

                DrawPointByImgData(imgData,P[0], P[1], color.mutiply(intensity));
            }
        }
        return;
    }
    //Vertical line.
    if (beginPoint[0] == endPoint[0]) {
        if (beginPoint[1] > endPoint[1]) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        for (y = beginPoint[1]; y < endPoint[1]; y++)
        {
            P[0] = beginPoint[0], P[1] = y;P.Z = 0;
            bcScreen =  Barycentric(verts[0], verts[1], verts[2], P);
            for (let i=0; i<3; i++) {
                P.Z += verts[i][2]*bcScreen[i];
                pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
            }

            intensity = vectorMultiply(pNormal,lightDir);

            if (zbuffer[Math.floor(P[0]+P[1]* canvasWidth)]<P.Z) {
                zbuffer[Math.floor(P[0]+P[1]* canvasWidth)] = P.Z;

    
                DrawPointByImgData(imgData,P[0], P[1], color.mutiply(intensity));
            }
        }

        return;
    }

    m = (endPoint[1] - beginPoint[1]) / (endPoint[0] - beginPoint[0]);
    if (m > 0 && m <= 1) {
        if (beginPoint[0] > endPoint[0]) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = -0.5;
        x = beginPoint[0];
        y = beginPoint[1];
        while (x < endPoint[0]) {
            {
                P[0] = x, P[1] = y;P.Z = 0;
                bcScreen =  Barycentric(verts[0], verts[1], verts[2], P);
                for (let i=0; i<3; i++) {
                    P.Z += verts[i][2]*bcScreen[i];
                    pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
                }

                intensity = vectorMultiply(pNormal,lightDir);

                if (zbuffer[Math.floor(P[0]+P[1]* canvasWidth)]<P.Z) {
                    zbuffer[Math.floor(P[0]+P[1]* canvasWidth)] = P.Z;
    
                    DrawPointByImgData(imgData,P[0], P[1], color.mutiply(intensity));
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
        if (beginPoint[0] > endPoint[0]) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = 0.5;
        x = beginPoint[0];
        y = beginPoint[1];
        while (x < endPoint[0]) {
            {
                P[0] = x, P[1] = y;P.Z = 0;
                bcScreen =  Barycentric(verts[0], verts[1], verts[2], P);
                for (let i=0; i<3; i++) {
                    P.Z += verts[i][2]*bcScreen[i];
                    pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
                }

                // intensity = vectorMultiply(pNormal,lightDir);
                if (zbuffer[Math.floor(P[0]+P[1]* canvasWidth)]<P.Z) {
                    zbuffer[Math.floor(P[0]+P[1]* canvasWidth)] = P.Z;

                    DrawPointByImgData(imgData,P[0], P[1], color.mutiply(intensity));
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
        if (beginPoint[1] > endPoint[1]) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = -0.5;
        x = beginPoint[0];
        y = beginPoint[1];
        while (y < endPoint[1]) {
            {
                P[0] = x, P[1] = y;P.Z = 0;
                bcScreen =  Barycentric(verts[0], verts[1], verts[2], P);
                for (let i=0; i<3; i++) {
                    P.Z += verts[i][2]*bcScreen[i];
                    pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
                }

                intensity = vectorMultiply(pNormal,lightDir);

                if (zbuffer[Math.floor(P[0]+P[1]* canvasWidth)]<P.Z) {
                    zbuffer[Math.floor(P[0]+P[1]* canvasWidth)] = P.Z;

                    DrawPointByImgData(imgData,P[0], P[1], color.mutiply(intensity));
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
        if (beginPoint[1] > endPoint[1]) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = 0.5;
        x = beginPoint[0];
        y = beginPoint[1];
        while (y < endPoint[1]) {
            {
                P[0] = x, P[1] = y;P.Z = 0;
                bcScreen =  Barycentric(verts[0], verts[1], verts[2], P);
                for (let i=0; i<3; i++) {
                    P.Z += verts[i][2]*bcScreen[i];
                    pNormal[i] = tNormals[0][i]*bcScreen[0] + tNormals[1][i]*bcScreen[1] + tNormals[2][i]*bcScreen[2] ;
                }

                intensity = vectorMultiply(pNormal,lightDir);

                if (zbuffer[Math.floor(P[0]+P[1]* canvasWidth)]<P.Z) {
                    zbuffer[Math.floor(P[0]+P[1]* canvasWidth)] = P.Z;


                    DrawPointByImgData(imgData,P[0], P[1], color.mutiply(intensity));
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
    imgData:ImageData,color:Vector3,lightDir:Vector3,mvp:Float32Array
)=>{

    let intensity = 0;
    let normalVec3 = new Vector3(0,0,0);
    let p = new Vector4(new Vector3(0,0,0),1);
    console.log(pointCache.length)
    pointCache.forEach((e,i)=>{
        p.X = e[0]/100; p.Y = e[1]/100;p.Z = e[2]/100; p.W = 1;
        console.log(p)
        p = m2v4(matrixMutiply(mvp,p.getMatrix()));
        normalVec3.X = normalCache[i][0] 
        normalVec3.Y = normalCache[i][1]; 
        normalVec3.Z = normalCache[i][2];
        intensity = vectorMultiply(normalVec3,lightDir);
        DrawPointByImgData(imgData,p.X, p.Y, color.mutiply(intensity));
    })
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