import { Point } from "../../classes/point";
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

export const DrawLineByBresenham = (
    imgData:ImageData,
    color:Vector3,
    beginPoint:Point,
    endPoint:Point,
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


export const DrawLineByCanvasApi = (
    ctx:CanvasRenderingContext2D, 
    width:number,
    height:number,
    beginPoint:Point,
    endPoint:Point,
    ) => {

    if (beginPoint.X > width || beginPoint.X < 0 
        || beginPoint.Y > height || beginPoint.Y < 0 ||
        endPoint.X > width || endPoint.X < 0 
        || endPoint.Y > height || endPoint.Y < 0
        ){
        return;
    }
    ctx.moveTo(beginPoint.X, beginPoint.Y);
    ctx.lineTo(endPoint.X, endPoint.Y);

}

export const DrawLineInGrid = (
    ctx:CanvasRenderingContext2D,
    girdSize:number,
    width:number,
    height:number,
    beginPoint:Point, 
    endPoint:Point, 
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
            DrawPointInGrid(ctx,girdSize, x, beginPoint.Y,width,height);
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
            DrawPointInGrid(ctx,girdSize, beginPoint.X, y, width,height);
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
            DrawPointInGrid(ctx,girdSize, x, y,width,height);
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
            DrawPointInGrid(ctx,girdSize, x, y,width,height);
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
            DrawPointInGrid(ctx,girdSize, x, y,width,height);
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
            DrawPointInGrid(ctx,girdSize, x, y,width,height);
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
    ) => {

    // cant overflow.
    if (gridx > Math.floor(width / girdSize) - 1 || gridx < 0 ||
        gridy > Math.floor(height / girdSize) - 1 || gridy < 0)
        return;

    let rectx = gridx * girdSize;
    let recty = gridy * girdSize;

    //for drawframe we can use fillstyle only once.
    let gridWidth = Math.floor(width / girdSize) - 1;
    if(!gridBuffer[gridx*gridWidth+gridy]){
        gridBuffer[gridx*gridWidth+gridy] = true;
        ctx.fillRect(rectx, recty, girdSize, girdSize);
    }
    
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