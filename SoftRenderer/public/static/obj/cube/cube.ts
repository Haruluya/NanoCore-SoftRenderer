import { Vector3 } from '/src/classes/vector3';

const WorldToScreen = (v:Vector3,canvas:HTMLCanvasElement)=>{
    let x0 = Math.floor((v.X+2)*canvas.width/4);
    let y0 = canvas.height - Math.floor((v.Y+2.5)*canvas.height/4);
    return new Vector3(x0,y0,v.Z);
};

export default{
    WorldToScreen,
}