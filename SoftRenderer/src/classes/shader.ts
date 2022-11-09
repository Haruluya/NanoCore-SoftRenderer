
import {Vector2, Vector3, Vector4} from './point'
/*
@author:Haruluya.
@des:Shader.
*/

abstract class Shader{
    abstract vertex(iface:number,nthvert:number):Vector4;
    abstract fragment(bar:Vector3, color:Vector3):boolean;
}


export class GouraudShader extends Shader{
    private varyingIntensity:number = 0;
    private varyingUV:Vector2 = new Vector2(0,0);

    vertex(iface:number,nthvert:number):Vector4{
         //根据面序号和顶点序号读取模型对应顶点，并扩展为4维 
        //  let gl_Vertex:Vector4 = ;
        //  varying_uv.set_col(nthvert, model->uv(iface, nthvert));
        //  //变换顶点坐标到屏幕坐标（视角矩阵*投影矩阵*变换矩阵*v）
        //  mat<4, 4, float> uniform_M = Projection * ModelView;
        //  mat<4, 4, float> uniform_MIT = ModelView.invert_transpose();
        //  gl_Vertex = Viewport* uniform_M *gl_Vertex;
        //  //计算光照强度（顶点法向量*光照方向）
        //  Vec3f normal = proj<3>(embed<4>(model->normal(iface, nthvert))).normalize();
        //  varying_intensity[nthvert] = std::max(0.f, model->normal(iface, nthvert) *light_dir); // get diffuse lighting intensity
        //  return gl_Vertex;
    }
    fragment(bar:Vector3, color:Vector3):boolean{

    }
}


