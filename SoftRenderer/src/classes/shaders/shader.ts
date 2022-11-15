
import { Model } from '../model';
import { Vector3 } from '../vector3';
import { Vector4 } from '../vector4';

/*
@author:Haruluya.
@des:Shader.
*/


export interface fragmentResult{
    discard:boolean,
    color?:Vector3,
}


export abstract class Shader{
    abstract vertex():Vector4;
    abstract fragment():fragmentResult;
    [name:string]:any;
    setUnifrom(name:string,value:any):void{
        if (this[name] === null){
            console.log(name+" Unifrom not found!");
            return;
        }
        this[name] = value;
    }
}


export let model:Model;

export const worldToScreen = (point:Vector4):Vector4=>{
    return new Vector4(
        new Vector3(
            Math.floor((point.X + 1.) * 800 / 4),
            Math.floor((point.Y + 2.) * 800 / 4),
            point.Z,
        ),
        1
    )
}


export const InitShaderContext = (modelData:Model):void=>{
    model = modelData;
}





