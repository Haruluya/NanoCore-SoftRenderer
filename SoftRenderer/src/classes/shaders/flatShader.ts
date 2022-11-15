import { Shader,model,worldToScreen,fragmentResult } from "./shader";

import {m2v, matrixMutiply, v2m, vectorCross, vectorMultiply, vectorNormalize, vectorSubtract} from '../math'
import { Vector3 } from "../vector3";
import { Vector4 } from "../vector4";

export class FlatShader extends Shader{
    private varyingVerts:Array<Vector4> = [];
    private unifromLightDir:Vector3 = new Vector3(0,0,0);
    private unifromProjectionMatrix:Float32Array = new Float32Array();
    private unifromModelMatrix:Float32Array = new Float32Array();
    private unifromViewMatrix:Float32Array = new Float32Array();

    vertex(faceIndex?:number,vertIndex?:number):Vector4{ 
        if (vertIndex === undefined || faceIndex === undefined){
            return new Vector4(new Vector3(0,0,0),1)
        }

        let gl_Position:Vector4 = new Vector4(model.getVertByFaceMap(faceIndex,vertIndex),1);
        const viewProjectionMatrix = matrixMutiply(this.unifromViewMatrix,this.unifromProjectionMatrix);
        gl_Position = new Vector4(m2v(matrixMutiply(viewProjectionMatrix,v2m(gl_Position.getVec3()))),1);
        gl_Position = new Vector4(m2v(matrixMutiply(this.unifromModelMatrix,v2m(gl_Position.getVec3()))),1);
        this.varyingVerts[vertIndex] = gl_Position;
        gl_Position = worldToScreen(gl_Position);
        return gl_Position;
    }

    fragment():fragmentResult{
        const normal = vectorNormalize(
            vectorCross(
                vectorSubtract(this.varyingVerts[2].getVec3(),this.varyingVerts[0].getVec3()),
                vectorSubtract(this.varyingVerts[1].getVec3(),this.varyingVerts[0].getVec3())
            )
        )
        const intensity = vectorMultiply(normal,this.unifromLightDir);
        const color = new Vector3(255,255,255).mutiply(intensity);
        return {
            discard:false,
            color,
        };
    }
}


