import {Point} from '/src/classes/point'

const WorldToScreen = (v:Point,canvas:HTMLCanvasElement,offset:{x:number,y:number})=>{
    let x0 = Math.floor((v.X+1)*canvas.width/2) +offset.x;
    let y0 = canvas.height - Math.floor((v.Y+1)*canvas.height/2) +offset.y;
    return new Point(x0,y0);
};

export default{
    WorldToScreen,
}