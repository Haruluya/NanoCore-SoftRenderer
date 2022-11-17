import { Edge } from "../../classes/edge";
import { Point } from "../../classes/point";
import { Polygon } from "../../classes/poloygon";
import { Vector3 } from "../../classes/vector3";

let gridBuffer:Array<boolean> = []

export const InitGridBuffer = (canvas:HTMLCanvasElement,girdSize:number)=>{
    gridBuffer = [];
    let width = Math.floor(canvas.width / girdSize) - 1;
    let height = Math.floor(canvas.height / girdSize) - 1
    for (let i = 0; i < width * height; i++){
        gridBuffer.push(false);
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

export const DrawTriangleByCanvasAPI = (
    ctx:CanvasRenderingContext2D,
    t0:Point,
    t1:Point,
    t2:Point,
    color:Vector3
    )=>{
    ctx.fillStyle = 'rgb('+color.X+','+color.Y+','+color.Z+')';
    ctx.beginPath();
    ctx.moveTo(t0.X,t0.Y);
    ctx.lineTo(t1.X,t1.Y);
    ctx.lineTo(t2.X,t2.Y);
    ctx.fill()
}

export const DrawTriangleByImageData = (imgData:ImageData,t0:Point,t1:Point,t2:Point,color:Vector3)=>{
    // EdgeTablePolygon.
    // check amount of point.
    
    const points = new Polygon([t0,t1,t2]);

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

export const DrawLineByBresenham = (
    imgData:ImageData,
    beginPoint:Point,
    endPoint:Point,
    color:Vector3,
    ):void=>{
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
        DrawPointByImgData(imgData,x, beginPoint.Y, color);
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
        DrawPointByImgData(imgData,beginPoint.X, y, color);
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
            DrawPointByImgData(imgData,x, y, color);
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
            DrawPointByImgData(imgData, x, y, color);
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
            DrawPointByImgData(imgData, x, y, color);
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
            DrawPointByImgData(imgData, x, y, color);
            e = e + 1 / m;
            if (e < 0) {
                x--;
                e = e + 1;
            }
            y++;
        }
    }
}

export const DrawTriangleInGrid = (
    ctx:CanvasRenderingContext2D,
    gridSize:number,
    width:number,
    height:number,
    t0:Point,
    t1:Point,
    t2:Point,
    color:Vector3
    )=>{
    // EdgeTablePolygon.
      // check amount of point.
      
      const points = new Polygon([t0,t1,t2]);
  
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
                  DrawLineInGrid(ctx,gridSize,width,height,new Point(x0,y),new Point(x1, y),color);
              }
              arr = [];
          }
      }
      ET = [];
    //   console.log(ix);
}

export const DrawLineInGrid = (
    ctx:CanvasRenderingContext2D,
    girdSize:number,
    width:number,
    height:number,
    beginPoint:Point, 
    endPoint:Point, 
    color:Vector3
    ) => {
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
            DrawPointInGrid(ctx,girdSize, x, beginPoint.Y,width,height,color);
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
            DrawPointInGrid(ctx,girdSize, beginPoint.X, y, width,height,color);
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
            DrawPointInGrid(ctx,girdSize, x, y,width,height,color);
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
            DrawPointInGrid(ctx,girdSize, x, y,width,height,color);
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
            DrawPointInGrid(ctx,girdSize, x, y,width,height,color);
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
            DrawPointInGrid(ctx,girdSize, x, y,width,height,color);
            e = e + 1 / m;
            if (e < 0) {
                x--;
                e = e + 1;
            }
            y++;
        }
    }
}

export const DrawPointInGrid = (
    ctx:CanvasRenderingContext2D,
    girdSize:number,
    gridx:number, 
    gridy:number,
    width:number,
    height:number, 
    color:Vector3

    ) => {

    // cant overflow.
    if (gridx > Math.floor(width / girdSize) - 1 || gridx < 0 ||
        gridy > Math.floor(height / girdSize) - 1 || gridy < 0)
        return;

    let rectx = gridx * girdSize;
    let recty = gridy * girdSize;

    // let gridWidth = Math.floor(width / girdSize) - 1;
    // if(!gridBuffer[gridx*gridWidth+gridy]){
    //     gridBuffer[gridx*gridWidth+gridy] = true;
        ctx.fillStyle = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
        ctx.fillRect(rectx, recty, girdSize, girdSize);
    // }
    
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