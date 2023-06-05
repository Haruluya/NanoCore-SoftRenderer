import { Vector3 } from '/src/classes/vector3';



const WorldToScreen = (v:Vector3,canvas:HTMLCanvasElement)=>{
    let x0 = Math.floor((v.X+130)*canvas.width/280);
    let y0 = canvas.height - Math.floor((v.Y+1)*canvas.height/280);
    return new Vector3(x0,y0,v.Z);
};


export default{
    WorldToScreen,
}