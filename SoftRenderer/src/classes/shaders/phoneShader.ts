import { Shader,model,worldToScreen,fragmentResult } from "./shader";
import {Vector2, Vector3, Vector4} from '../point'
import {inverse, m2v, matrixMutiply, v2m, vectorCross, vectorMultiply, vectorNormalize, vectorSubtract} from '../math'


export class PhongShader extends Shader{
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
    
        return gl_Position;
    }

    fragment(barycenter?:Vector3):fragmentResult{
        if (!barycenter){
            return {
                discard:true,
            }
        }
        const uv:Vector2 = new Vector2(
            this.varyingUV[0][0] *barycenter[0] +  this.varyingUV[1][0] *barycenter[1] + this.varyingUV[2][0] *barycenter[2],
            this.varyingUV[0][1] *barycenter[0] +  this.varyingUV[1][1] *barycenter[1] + this.varyingUV[2][1] *barycenter[2],
        );
        const n = vectorNormalize(matrixMutiply(inverse(this.unifromModelMatrix),model.getNormalMapByFaceMap()));
        const l = vectorNormalize(m2v(matrixMutiply(matrixMutiply(this.unifromProjectionMatrix,this.unifromModelMatrix),v2m(this.unifromLightDir))))
        const r = vectorNormalize((n.mutiply(vectorMultiply(n,l).mutiply(2.)-1).sub(l)));
        const spec = Math.pow(Math.max(r.Z,.0),model.getSpecularByUV());
        const diff = Math.max(.0,vectorMultiply(n,l));
        const color = model.getDiffuseByUV(uv);
        for (let i = 0; i < 3; i++){
            color[i] = Math.min(5+color[i]*(diff + .6 * spec),255);
        }
        return {
            discard:false,
            color
        }
    }
}