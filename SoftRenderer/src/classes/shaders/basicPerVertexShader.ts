import { Shader,model,worldToScreen,fragmentResult } from "./shader";
import {Vector2, Vector3, Vector4} from '../point'
import {m2v, matrixMutiply, v2m, vectorCross, vectorMultiply, vectorNormalize, vectorSubtract} from '../math'

// Basic per-vertex shader.
export class BasicPerVertexShader extends Shader{
    private varyingInt:Vector3 = new Vector3(0,0,0);
    private varyingUV:Array<Vector2> = [];
    private unifromProjectionMatrix:Float32Array = new Float32Array();
    private unifromModelMatrix:Float32Array = new Float32Array();
    private unifromViewMatrix:Float32Array = new Float32Array();
    private unifromLightDir:Vector3 = new Vector3(0,0,0);
    
    vertex(faceIndex?:number,vertIndex?:number):Vector4{ 
        if (vertIndex === undefined || faceIndex === undefined){
            return new Vector4(new Vector3(0,0,0),1)
        }

        let gl_Position:Vector4 = new Vector4(model.getVertByFaceMap(faceIndex,vertIndex),1);
        this.varyingUV[vertIndex] = (model.getUVByFaceMap(faceIndex,vertIndex));
        const viewProjectionMatrix = matrixMutiply(this.unifromViewMatrix,this.unifromProjectionMatrix);
        gl_Position = new Vector4(m2v(matrixMutiply(viewProjectionMatrix,v2m(gl_Position.getVec3()))),1);
        gl_Position = new Vector4(m2v(matrixMutiply(this.unifromModelMatrix,v2m(gl_Position.getVec3()))),1);
        gl_Position = worldToScreen(gl_Position);
        const normal = vectorNormalize(model.getNormalByFaceMap(faceIndex,vertIndex)) ;
      
        this.varyingInt[vertIndex] = Math.max(0.,vectorMultiply(normal,this.unifromLightDir));
        return gl_Position;
    }


    fragment(barycenter?:Vector3):fragmentResult{
        
        if (!barycenter){
            return {
                discard:true,
                color:new Vector3(0,0,0)
            }
        }

        const intensity:number = 
            this.varyingInt[0]*barycenter[0] + this.varyingInt[1]*barycenter[1] + this.varyingInt[2]*barycenter[2];
        const uv:Vector2 = new Vector2(
            this.varyingUV[0][0] *barycenter[0] +  this.varyingUV[1][0] *barycenter[1] + this.varyingUV[2][0] *barycenter[2],
            this.varyingUV[0][1] *barycenter[0] +  this.varyingUV[1][1] *barycenter[1] + this.varyingUV[2][1] *barycenter[2],
        );
        const c:Vector3 = model.getDiffuseByUV(uv);
        let color = c.mutiply(intensity);
        return {
            discard:false,
            color,
        };
    }
}